export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  merchant: string;
  description: string;
  date: string;
  created_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  limit: number;
  period: 'monthly' | 'yearly';
  created_at: string;
  updated_at: string;
}

export interface FinancialGoal {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  created_at: string;
}

export interface RecommendationCategory {
  type: 'necessity' | 'luxury' | 'waste';
  title: string;
  description: string;
  items: string[];
  actionableTips: string[];
}

export interface PurchaseAdvisorResponse {
  id: string;
  userId: string;
  recommendations: RecommendationCategory[];
  summary: string;
  reasoning: string;
  generatedAt: string;
  expiresAt: string;
}

export interface PurchaseAdvisorInput {
  recentExpenses: Expense[];
  budgets: Budget[];
  goals: FinancialGoal[];
  purchaseContext?: string;
}
