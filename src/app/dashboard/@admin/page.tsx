// import { Suspense } from "react"
// import { DashboardLayout } from "@/components/layout/dashboard-layout"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Building, CreditCard, Users } from "lucide-react"
// import { getUsers } from "@/actions/admin/users"
// import { getBusinesses } from "@/actions/admin/businesses"
// import { getInvoices } from "@/actions/admin/invoices"
// import { Skeleton } from "@/components/ui/skeleton"

// async function DashboardCards() {
//   // Fetch data for dashboard cards
//   const [users, pendingBusinesses, pendingInvoices] = await Promise.all([
//     getUsers(),
//     getBusinesses("pending"),
//     getInvoices("pending"),
//   ])

//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Total Users</CardTitle>
//           <Users className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">{users.length}</div>
//           <p className="text-xs text-muted-foreground">Active users in the system</p>
//         </CardContent>
//       </Card>
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
//           <CreditCard className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">{pendingInvoices.length}</div>
//           <p className="text-xs text-muted-foreground">Requires attention</p>
//         </CardContent>
//       </Card>
//       <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Business Applications</CardTitle>
//           <Building className="h-4 w-4 text-muted-foreground" />
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">{pendingBusinesses.length}</div>
//           <p className="text-xs text-muted-foreground">Pending approval</p>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// function DashboardSkeleton() {
//   return (
//     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//       {[1, 2, 3].map((i) => (
//         <Card key={i}>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <Skeleton className="h-5 w-[120px]" />
//             <Skeleton className="h-4 w-4" />
//           </CardHeader>
//           <CardContent>
//             <Skeleton className="h-8 w-[60px] mb-1" />
//             <Skeleton className="h-4 w-[140px]" />
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   )
// }

// export default function DashboardPage() {
//   return (
//     <DashboardLayout>
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold">Dashboard</h2>
//       </div>

//       <Suspense fallback={<DashboardSkeleton />}>
//         <DashboardCards />
//       </Suspense>

//       <div className="mt-6">
//         <Tabs defaultValue="users">
//           <TabsList>
//             <TabsTrigger value="users">Recent Users</TabsTrigger>
//             <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
//             <TabsTrigger value="business">Recent Business</TabsTrigger>
//           </TabsList>
//           <TabsContent value="users" className="mt-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Recent User Activity</CardTitle>
//                 <CardDescription>Overview of the latest user registrations and activities</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <p>User activity content will appear here</p>
//               </CardContent>
//             </Card>
//           </TabsContent>
//           <TabsContent value="transactions" className="mt-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Recent Transactions</CardTitle>
//                 <CardDescription>Overview of the latest transaction activities</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <p>Transaction activity content will appear here</p>
//               </CardContent>
//             </Card>
//           </TabsContent>
//           <TabsContent value="business" className="mt-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Recent Business Applications</CardTitle>
//                 <CardDescription>Overview of the latest business application activities</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <p>Business application activity content will appear here</p>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </DashboardLayout>
//   )
// }
