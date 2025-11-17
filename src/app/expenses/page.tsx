import { Layout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function ExpensesPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Expenses</h1>
            <p className="text-muted-foreground">
              Track and manage your expenses
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,456.78</div>
              <p className="text-xs text-muted-foreground">45% of budget</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2,890.12</div>
              <p className="text-xs text-muted-foreground">-15% change</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Daily
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$81.89</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      FS
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">Food & Dining</p>
                    <p className="text-sm text-muted-foreground">
                      Grocery Store • Today
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600">-$87.43</p>
                  <p className="text-xs text-muted-foreground">Debit Card</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-medium text-sm">
                      TR
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">Transportation</p>
                    <p className="text-sm text-muted-foreground">
                      Gas Station • Yesterday
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600">-$45.00</p>
                  <p className="text-xs text-muted-foreground">Credit Card</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-medium text-sm">
                      EN
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">Entertainment</p>
                    <p className="text-sm text-muted-foreground">
                      Netflix • 2 days ago
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600">-$15.99</p>
                  <p className="text-xs text-muted-foreground">Auto-pay</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
