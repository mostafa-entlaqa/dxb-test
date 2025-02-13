// 'use client'

// import { createContext, useContext, useEffect, useState } from 'react'
// import { getUser } from '@/app/actions/user/get-user'

// const UserContext = createContext<any>(null)

// export function UserProvider({ children, userId }: { children: React.ReactNode, userId: string }) {
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     let mounted = true

//     const loadUser = async () => {
//       if (!userId) {
//         setLoading(false)
//         return
//       }

//       try {
//         const userData = await getUser(userId)
//         if (mounted) {
//           setUser(userData)
//         }
//       } catch (error) {
//         console.error('Error loading user:', error)
//       } finally {
//         if (mounted) {
//           setLoading(false)
//         }
//       }
//     }

//     loadUser()

//     return () => {
//       mounted = false
//     }
//   }, [userId])

//   return (
//     <UserContext.Provider value={{ user, loading }}>
//       {children}
//     </UserContext.Provider>
//   )
// }

// export const useUser = () => {
//   const context = useContext(UserContext)
//   if (!context) {
//     throw new Error('useUser must be used within a UserProvider')
//   }
//   return context
// } 