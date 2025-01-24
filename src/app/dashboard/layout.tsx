import React from 'react'
import { getUserRole } from '../../actions/get-user-role'
import { redirect } from 'next/navigation'

interface DashboardLayoutProps {
    children: React.ReactNode
    user: React.ReactNode
    admin: React.ReactNode
}

export default async function DashboardLayout({ children, user, admin }: DashboardLayoutProps) {
  const { userRole, error } = await getUserRole()
  
  // Handle error case
  if (error || !userRole) {
    return redirect('/auth/login') // or wherever you want to redirect
  }

  // Render only the appropriate content based on role
  return (
    <div>
      {userRole.role === 'admin' ? admin : user}
    </div>
  )
}

