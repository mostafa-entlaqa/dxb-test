import React from 'react'
import { getUserRole } from '../actions/get-user-role'

interface DashboardLayoutProps {
    children: React.ReactNode
    user: React.ReactNode
    admin: React.ReactNode
}
        

export default async function DashboardLayout({ children,user,admin }:DashboardLayoutProps ) {
  const {  userRole   } = await getUserRole()
  console.log(userRole?.role, 'userRole')
  if (!userRole) {
    return <div>not found user role</div>
  }
  return (
    <>
      {children}
      {userRole.role  === 'admin' && admin }
      {userRole.role  === 'user' && user}
    </>
  )
}

