import { notFound } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserById } from "@/app/actions/users"
import { getInvoicesByUserId } from "@/app/actions/invoices"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface UserDetailPageProps {
  params: {
    id: string
  }
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const user = await getUserById(params.id)

  if (!user) {
    notFound()
  }

  const invoices = await getInvoicesByUserId(params.id)

  // Calculate total spent
  const totalSpent = invoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0)

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">User Details</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>User details and account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.profile_pic_url || "/placeholder.svg?height=80&width=80"} alt={user.full_name} />
                <AvatarFallback>
                  {user.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{user.full_name}</h3>
                <p className="text-muted-foreground">{user.email}</p>
                <Badge
                  variant="outline"
                  className={
                    user.role === "admin"
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : user.role === "business"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-green-50 text-green-700 border-green-200"
                  }
                >
                  {user.role || "User"}
                </Badge>
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span>{user.phone_number || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">LinkedIn:</span>
                <a
                  href={user.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {user.linkedin_url ? "View Profile" : "Not provided"}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interest:</span>
                <span>{user.interest || "Not specified"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credits Information</CardTitle>
            <CardDescription>User credits and usage statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Regular Credits</div>
                <div className="text-2xl font-bold mt-1">{user.credits || 0}</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">AI Credits</div>
                <div className="text-2xl font-bold mt-1">{user.ai_credits || 0}</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Total Spent</div>
                <div className="text-2xl font-bold mt-1">{formatCurrency(totalSpent)}</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Transactions</div>
                <div className="text-2xl font-bold mt-1">{invoices.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="transactions">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="credits">Credits History</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>All transactions associated with this user</CardDescription>
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
                          <TableCell className="font-medium">{invoice.id}</TableCell>
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
          <TabsContent value="credits" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Credits History</CardTitle>
                <CardDescription>History of credits additions and usage</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-6 text-muted-foreground">Credits history will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
