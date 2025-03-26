import { redirect } from "next/navigation"
import { getUserProfile, getUserCredits } from "@/actions/user/profile"
import ProfileForm from "./profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, CreditCard, User } from "lucide-react"
import { getServerSupabase } from "@/lib/supabase/utils"

export default async function ProfilePage() {
  // Get the current user session from Supabase
  const supabase = getServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user profile and credits data
  const userId = user.id
  const userProfile = await getUserProfile(userId)
  const userCredits = await getUserCredits(userId)

  if (!userProfile) {
    return <div className="container mx-auto py-10">User not found</div>
  }

  // Format dates for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          {userProfile.is_premium && (
            <Badge variant="default" className="bg-amber-500">
              Premium
            </Badge>
          )}
          <Badge variant={userProfile.profile_completed ? "outline" : "secondary"}>
            {userProfile.profile_completed ? "Complete" : "Incomplete"}
          </Badge>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm user={userProfile} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Email Verification</p>
                    <p className="text-xs text-muted-foreground">
                      {userProfile.email_verified ? "Verified" : "Not verified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Member Since</p>
                    <p className="text-xs text-muted-foreground">{formatDate(userProfile.created_at)}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Account Type</p>
                    <p className="text-xs text-muted-foreground">{userProfile.is_premium ? "Premium" : "Free"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">AI Credits:</span>
                  <span className="font-bold text-lg">{userCredits?.ai_credits || 0}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Credits:</span>
                  <span className="font-bold text-lg">{userCredits?.credits || 0}</span>
                </div>

                {userCredits?.last_credits_added_at && (
                  <div className="pt-2 border-t text-xs text-muted-foreground">
                    Last credits added: {formatDate(userCredits.last_credits_added_at)}
                  </div>
                )}

                {userCredits?.joined_at && (
                  <div className="text-xs text-muted-foreground">Joined: {formatDate(userCredits.joined_at)}</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

