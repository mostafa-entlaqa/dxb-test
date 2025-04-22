import { notFound } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getInvoiceById } from "@/actions/admin/invoices"
import { getUserById } from "@/actions/admin/users"
import { getBusinessById } from "@/actions/admin/businesses"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface TransactionDetailPageProps {
  params: {
    id: string
  }
}

export default async function TransactionDetailPage({ params }: TransactionDetailPageProps) {
  const invoice = await getInvoiceById(params.id)

  if (!invoice) {
    notFound()
  }

  const [user, business] = await Promise.all([getUserById(invoice.user_id), getBusinessById(invoice.business_id)])

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Transaction Details</h2>
        <div className="flex gap-2">
          {invoice.status === "pending" && (
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
                <CardTitle>Transaction #{invoice.id}</CardTitle>
                <CardDescription>Transaction details and status</CardDescription>
              </div>
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
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-semibold">{formatCurrency(invoice.amount, invoice.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Currency:</span>
                <span>{invoice.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Date:</span>
                <span>
                  {invoice.payment_date ? new Date(invoice.payment_date).toLocaleDateString() : "Not paid yet"}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stripe Payment Intent:</span>
                <span className="font-mono text-sm">{invoice.stripe_payment_intent_id || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stripe Invoice ID:</span>
                <span className="font-mono text-sm">{invoice.stripe_invoice_id || "N/A"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>Details about the customer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user ? (
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <a href={`/users/${user.id}`} className="text-blue-600 hover:underline">
                      {user.full_name}
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span>{user.phone_number || "N/A"}</span>
                  </div>
                </div>
              ) : (
                <p className="text-center py-2 text-muted-foreground">User information not available</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Details about the business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {business ? (
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Business ID:</span>
                    <a href={`/business/${business.id}`} className="text-blue-600 hover:underline">
                      {business.id}
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Description:</span>
                    <span className="text-right">{business.opportunity_description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Investment %:</span>
                    <span>{business.investment_percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge
                      variant="outline"
                      className={
                        business.approve_status === "approved"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : business.approve_status === "pending"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-red-50 text-red-700 border-red-200"
                      }
                    >
                      {business.approve_status.charAt(0).toUpperCase() + business.approve_status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ) : (
                <p className="text-center py-2 text-muted-foreground">Business information not available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
