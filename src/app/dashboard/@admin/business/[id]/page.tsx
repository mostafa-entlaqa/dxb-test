import { notFound } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getBusinessById } from "@/actions/admin/businesses"
import { getInvoicesByBusinessId } from "@/actions/admin/invoices"

interface BusinessDetailPageProps {
  params: {
    id: string
  }
}

export default async function BusinessDetailPage({ params }: BusinessDetailPageProps) {
  const business = await getBusinessById(params.id)

  if (!business) {
    notFound()
  }

  const invoices = await getInvoicesByBusinessId(params.id)

  // Calculate total revenue
  const totalRevenue = invoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0)

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Business Details</h2>
        <div className="flex gap-2">
          {business.approve_status === "pending" && (
            <>
              <Button variant="outline" className="text-red-600">
                Reject
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">Approve</Button>
            </>
          )}
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Business #{business.id}</CardTitle>
                <CardDescription>Business details and status</CardDescription>
              </div>
              <Badge
                variant="outline"
                className={
                  business.approve_status === "approved"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : business.approve_status === "pending"
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : business.approve_status === "cancelled"
                        ? "bg-gray-50 text-gray-700 border-gray-200"
                        : "bg-red-50 text-red-700 border-red-200"
                }
              >
                {business.approve_status.charAt(0).toUpperCase() + business.approve_status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Description:</span>
                <span className="text-right max-w-[250px]">{business.opportunity_description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Investment Percentage:</span>
                <span>{business.investment_percentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Form Status:</span>
                <span>{business.form_status}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Approval Date:</span>
                <span>
                  {business.approveAt ? new Date(business.approveAt).toLocaleDateString() : "Not approved yet"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subscription End:</span>
                <span>
                  {business.subscription_end_date
                    ? new Date(business.subscription_end_date).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Session ID:</span>
                <span className="font-mono text-sm">{business.session_id}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
            <CardDescription>Revenue and transaction statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Total Revenue</div>
                <div className="text-2xl font-bold mt-1">{formatCurrency(totalRevenue)}</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Transactions</div>
                <div className="text-2xl font-bold mt-1">{invoices.length}</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Pending</div>
                <div className="text-2xl font-bold mt-1">
                  {invoices.filter((invoice) => invoice.status === "pending").length}
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Completed</div>
                <div className="text-2xl font-bold mt-1">
                  {invoices.filter((invoice) => invoice.status === "paid").length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="transactions">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="details">Additional Details</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>All transactions associated with this business</CardDescription>
              </CardHeader>
              <CardContent>
                {invoices.length === 0 ? (
                  <p className="text-center py-6 text-muted-foreground">No transactions found</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">
                            <a href={`/transactions/${invoice.id}`} className="text-blue-600 hover:underline">
                              {invoice.id}
                            </a>
                          </TableCell>
                          <TableCell>{formatCurrency(invoice.amount, invoice.currency)}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                invoice.status === "paid"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : invoice.status === "pending"
                                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                    : invoice.status === "cancelled"
                                      ? "bg-gray-50 text-gray-700 border-gray-200"
                                      : "bg-red-50 text-red-700 border-red-200"
                              }
                            >
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {invoice.payment_date ? new Date(invoice.payment_date).toLocaleDateString() : "N/A"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="details" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
                <CardDescription>More information about this business</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-6 text-muted-foreground">
                  Additional business details will be displayed here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
