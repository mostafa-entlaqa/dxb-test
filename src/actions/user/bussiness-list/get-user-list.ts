import { getServerSupabase } from '@/lib/supabase/utils'


type BusinessType = {
    id: number
    images: string[]
    opportunity_name: string
    form_status: string
    approve: Date | null
}

export const getUserList = async () => {

    const supabase =  getServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    // Check if user and user.id are valid
    if (!user || !user.id) {
        console.error('User not found or user ID is invalid');
        return { businessUserData: null };
    }

    const { data: businessUserData, error } = await supabase.from('businesses').select('id,images,opportunity_name,form_status,approveAt,user_id,approve_status,featured').eq('user_id', user.id)
    if (error) {
        console.log(error)
    }

    // Get unlock counts for each business
    const enhancedBusinessData = await Promise.all(
        businessUserData?.map(async (business) => {
            const { count } = await supabase
                .from('unlocked_businesses')
                .select('*', { count: 'exact' })
                .eq('business_id', business.id);
            
            return {
                ...business,
                views_count: count || 0
            };
        }) || []
    );

    return {
        businessUserData: enhancedBusinessData
    }
}


