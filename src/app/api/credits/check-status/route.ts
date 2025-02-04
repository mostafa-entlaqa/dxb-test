// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
// import { cookies } from 'next/headers'
// import { NextResponse } from 'next/server'

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url)
//   const businessId = searchParams.get('businessId')
  
//   const supabase = createRouteHandlerClient({ cookies })
  
//   try {
//     const { data: { user } } = await supabase.auth.getUser()
//     if (!user) {
//       return NextResponse.json({ isUnlocked: false, aiAnalysisUsed: false })
//     }

//     const { data } = await supabase
//       .from('credits')
//       .select('is_unlocked, ai_analysis_used')
//       .eq('user_id', user.id)
//       .eq('business_id', businessId)
//       .single()

//     return NextResponse.json({
//       isUnlocked: data?.is_unlocked || false,
//       aiAnalysisUsed: data?.ai_analysis_used || false
//     })
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to check status' }, { status: 500 })
//   }
// } 