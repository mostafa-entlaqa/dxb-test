import { notFound, redirect } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserById, updateUserCredits } from "@/app/actions/users"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ManageCreditsPageProps {
  params: {
    id: string
  }
}

async function updateCredits(formData: FormData) {
  "use server"

  const userId = formData.get("userId") as string
  const credits = Number.parseInt(formData.get("credits") as string, 10) || 0
  const aiCredits = Number.parseInt(formData.get("aiCredits") as string, 10) || 0

  await updateUserCredits(userId, credits, aiCredits)

  redirect(`/users/${userId}`)
}

export default async function ManageCreditsPage({ params }: ManageCreditsPageProps) {
  const user = await getUserById(params.id)

  if (!user) {
    notFound()
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Manage User Credits</h2>
      </div>

      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Update Credits for {user.full_name}</CardTitle>
            <CardDescription>Modify the user's regular and AI credits</CardDescription>
          </CardHeader>
          <form action={updateCredits}>
            <CardContent className="space-y-4">
              <input type="hidden" name="userId" value={user.id} />

              <div className="space-y-2">
                <Label htmlFor="credits">Regular Credits</Label>
                <Input id="credits" name="credits" type="number" defaultValue={user.credits || 0} min={0} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aiCredits">AI Credits</Label>
                <Input id="aiCredits" name="aiCredits" type="number" defaultValue={user.ai_credits || 0} min={0} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <a href={`/users/${user.id}`}>Cancel</a>
              </Button>
              <Button type="submit">Update Credits</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}
