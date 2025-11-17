import OpenAI from 'openai';
import type {
  PurchaseAdvisorInput,
  PurchaseAdvisorResponse,
  RecommendationCategory,
} from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Anonymize merchant names to protect PII
 * Replaces specific merchant names with categories
 */
function anonymizeMerchant(merchant: string): string {
  const merchantMap: Record<string, string> = {
    'amazon': 'online_retailer_1',
    'walmart': 'retail_store_1',
    'target': 'retail_store_2',
    'starbucks': 'coffee_shop',
    'mcdonalds': 'fast_food',
    'whole foods': 'grocery_store_1',
    'trader joe': 'grocery_store_2',
  };

  const lowerMerchant = merchant.toLowerCase();
  for (const [key, value] of Object.entries(merchantMap)) {
    if (lowerMerchant.includes(key)) {
      return value;
    }
  }

  // Generic anonymization for unmapped merchants
  return `merchant_${merchant.substring(0, 1).toUpperCase()}`;
}

/**
 * Prepare a PII-safe payload for the AI advisor
 */
function preparePiiSafePayload(input: PurchaseAdvisorInput): string {
  const anonymizedExpenses = input.recentExpenses.map((exp) => ({
    amount: exp.amount,
    category: exp.category,
    merchant: anonymizeMerchant(exp.merchant),
    date: exp.date,
  }));

  const payload = {
    expenses: anonymizedExpenses,
    budgets: input.budgets.map((b) => ({
      category: b.category,
      limit: b.limit,
      period: b.period,
    })),
    goals: input.goals.map((g) => ({
      title: g.title,
      targetAmount: g.target_amount,
      currentAmount: g.current_amount,
      deadline: g.deadline,
    })),
    purchaseContext: input.purchaseContext,
  };

  return JSON.stringify(payload);
}

/**
 * Get purchase advisor recommendations from OpenAI
 */
export async function getAdvisorRecommendations(
  input: PurchaseAdvisorInput,
  userId: string
): Promise<Omit<PurchaseAdvisorResponse, 'userId' | 'id'>> {
  const piiSafePayload = preparePiiSafePayload(input);

  const systemPrompt = `You are a personal finance advisor AI that helps users make smart purchasing decisions.
Analyze their spending patterns, budget status, and financial goals.
Provide recommendations in three categories: necessity, luxury, and waste.
Be specific, actionable, and encouraging.
Return your response as a valid JSON object with this structure:
{
  "recommendations": [
    {
      "type": "necessity|luxury|waste",
      "title": "Category Title",
      "description": "Brief description",
      "items": ["item 1", "item 2"],
      "actionableTips": ["tip 1", "tip 2"]
    }
  ],
  "summary": "Overall financial summary",
  "reasoning": "Why you gave these recommendations"
}`;

  const userPrompt = `Analyze this financial data and provide purchase recommendations:\n${piiSafePayload}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON from response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    const recommendations: RecommendationCategory[] = parsed.recommendations || [];

    return {
      recommendations,
      summary: parsed.summary || 'Analysis complete',
      reasoning: parsed.reasoning || 'Recommendations based on your financial data',
      generatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // 1 hour cache
    };
  } catch (error) {
    console.error('Error getting advisor recommendations:', error);
    throw error;
  }
}
