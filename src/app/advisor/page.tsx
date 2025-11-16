import { Layout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lightbulb, TrendingUp, PiggyBank, Target } from 'lucide-react'

export default function AdvisorPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Financial Advisor</h1>
          <p className="text-muted-foreground">
            Get personalized financial advice powered by AI
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <TrendingUp className="mx-auto h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-medium">Investment Tips</h3>
              <p className="text-sm text-muted-foreground">
                Get investment advice
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <PiggyBank className="mx-auto h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-medium">Savings Plan</h3>
              <p className="text-sm text-muted-foreground">Optimize savings</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Target className="mx-auto h-8 w-8 text-purple-600 mb-2" />
              <h3 className="font-medium">Goal Strategy</h3>
              <p className="text-sm text-muted-foreground">
                Reach goals faster
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Lightbulb className="mx-auto h-8 w-8 text-yellow-600 mb-2" />
              <h3 className="font-medium">Budget Help</h3>
              <p className="text-sm text-muted-foreground">Improve budgeting</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Advice Cards */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                <CardTitle className="text-lg">High Priority Advice</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">
                    Increase Emergency Fund
                  </h4>
                  <p className="text-sm text-yellow-700 mb-3">
                    Based on your current spending, we recommend having at least
                    $18,000 in your emergency fund. You&apos;re currently at
                    $7,500. Consider increasing your monthly savings by $200 to
                    reach this goal within 6 months.
                  </p>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      Learn More
                    </Button>
                    <Button size="sm">Take Action</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium mb-2">
                        Investment Opportunity
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Your risk profile suggests you could benefit from
                        diversifying into index funds. Consider allocating 20%
                        of your portfolio to low-cost S&P 500 index funds.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        2 days ago
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Medium
                    </span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium mb-2">Subscription Audit</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        We noticed you have 5 active subscriptions totaling
                        $87/month. Consider reviewing and canceling unused
                        services to save $30/month.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        1 week ago
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Low
                    </span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium mb-2">Tax Optimization</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Maximize your 401(k) contributions before year-end to
                        reduce taxable income. You can contribute an additional
                        $4,500 for 2024.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        2 weeks ago
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      High
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
