import { Suspense } from "react"
import { MoreHorizontal, Search, FileText } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { getBusinesses } from "@/actions/admin/businesses"
import { Skeleton } from "@/components/ui/skeleton"

async function PendingBusinessTable() {
  const businesses = await getBusinesses("pending")

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business ID</TableHead>
            <TableHead>Business Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Files</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {businesses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                No pending businesses found
              </TableCell>
            </TableRow>
          ) : (
            businesses.map((business) => (
              <TableRow key={business.id}>
                <TableCell className="font-medium">{business.id}</TableCell>
                <TableCell>{business.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {business.type === 'investment' ? 'Investment' : 'Buy'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {business.is_featured ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Featured
                    </Badge>
                  ) : (
                    <Badge variant="outline">Not Featured</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {business.images && business.images[0] ? (
                    <img
                      src={business.images[0]}
                      alt={business.name}
                      className="w-10 h-10 object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-muted-foreground">No image</span>
                  )}
                </TableCell>
                <TableCell>
                  {business.files && business.files.length > 0 ? (
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>{business.files.length}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No files</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Pending
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <a href={`/buy/${business.id}`}>View Details</a>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-green-600">Approve</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Reject</DropdownMenuItem>
                      <DropdownMenuItem>Cancel</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function BusinessTableSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business ID</TableHead>
            <TableHead>Business Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Files</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3].map((i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
              <TableCell><Skeleton className="h-5 w-[150px]" /></TableCell>
              <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
              <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
              <TableCell><Skeleton className="h-10 w-10 rounded-md" /></TableCell>
              <TableCell><Skeleton className="h-5 w-[50px]" /></TableCell>
              <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-8 w-8 rounded-full ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default function PendingBusinessPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Pending Business Applications</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search businesses..." className="pl-8 w-[250px]" />
          </div>
          <Button>Export</Button>
        </div>
      </div>

      <Suspense fallback={<BusinessTableSkeleton />}>
        <PendingBusinessTable />
      </Suspense>
    </DashboardLayout>
  )
}
