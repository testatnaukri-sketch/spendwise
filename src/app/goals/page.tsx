import { Layout } from '@/components/layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function GoalsPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Goals</h1>
            <p className="text-muted-foreground">
              Set and track your financial goals
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Goal
          </Button>
        </div>

        {/* Goals Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Emergency Fund</CardTitle>
              <p className="text-sm text-muted-foreground">
                6 months of expenses
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">75%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: '75%' }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    $7,500 / $10,000
                  </span>
                  <span className="text-muted-foreground">Dec 2024</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vacation Fund</CardTitle>
              <p className="text-sm text-muted-foreground">Summer 2024 trip</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">40%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: '40%' }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">$1,200 / $3,000</span>
                  <span className="text-muted-foreground">Jun 2024</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">New Laptop</CardTitle>
              <p className="text-sm text-muted-foreground">Work upgrade</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">90%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: '90%' }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">$1,800 / $2,000</span>
                  <span className="text-muted-foreground">Mar 2024</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Home Down Payment</CardTitle>
              <p className="text-sm text-muted-foreground">
                First home purchase
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">25%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: '25%' }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    $15,000 / $60,000
                  </span>
                  <span className="text-muted-foreground">Dec 2026</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Investment Portfolio</CardTitle>
              <p className="text-sm text-muted-foreground">Long-term growth</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span className="font-medium">60%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: '60%' }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    $12,000 / $20,000
                  </span>
                  <span className="text-muted-foreground">Ongoing</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed border-2 border-muted-foreground/25 flex items-center justify-center min-h-[200px]">
            <CardContent className="pt-6">
              <div className="text-center">
                <Plus className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Add new goal</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
