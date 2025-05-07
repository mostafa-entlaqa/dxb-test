import { getServerSupabase } from '@/lib/supabase/utils'


type BusinessType = {
    id: number
    images: string[]
    opportunity_name: string
    form_status: string
    approve: Date | null
    user_messages_count: number
}

export const getUserList = async () => {

    const supabase = getServerSupabase()
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

    // Get unlock counts and user messages for each business
    const enhancedBusinessData = await Promise.all(
        businessUserData?.map(async (business) => {
            const { count: unlockCount } = await supabase
                .from('unlocked_businesses')
                .select('*', { count: 'exact' })
                .eq('business_id', business.id);

            const { count: userMessagesCount } = await supabase
                .from('buyer_status')
                .select('*', { count: 'exact' })
                .eq('business_id', business.id);

            return {
                ...business,
                views_count: unlockCount || 0,
                user_messages_count: userMessagesCount ? userMessagesCount - 1 : 0
            };
        }) || []
    );

    return {
        businessUserData: enhancedBusinessData
    }
}