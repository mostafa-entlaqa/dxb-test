import { getServerSupabase } from '@/lib/supabase/utils'


type BusinessType = {
    id: number
    images: string[]
    opportunity_name: string
    form_status: string
    approve: Date | null
}

export const getUserList = async () => {

    const supabase = await getServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    // Check if user and user.id are valid
    if (!user || !user.id) {
        console.error('User not found or user ID is invalid');
        return { businessUserData: null };
    }

    const { data: businessUserData, error } = await supabase.from('businesses').select('id,images,opportunity_name,form_status,approve,user_id').eq('user_id', user.id)
    if (error) {
        console.log(error)
    }

    return {
        businessUserData
    }
}


