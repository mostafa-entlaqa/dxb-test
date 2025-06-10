import { getClientSupabase } from "@/lib/supabase/client"

export const initCredits = async (userId: string | undefined) => {
    if (!userId) {
        throw new Error('User ID is required')
    }
    const supabase = await getClientSupabase()

    // First, try to fetch the existing credits
    const { data: existingCredits, error: fetchError } = await supabase
        .from('users_credits')
        .select('id')
        .eq('user_id', userId)
        .single()

    if (existingCredits) {
        // Credits already exist, no need to insert
        return
    }

    if (fetchError && fetchError.code !== 'PGRST116') {
        // If error is not 'PGRST116' (no rows found), then it's a real fetch error
        console.error('Error fetching existing user credits:', fetchError)
        throw new Error('Failed to check existing user credits')
    }

    // If no existing credits (fetchError.code === 'PGRST116' or no error and data is null), insert new credits
    const { error: insertError } = await supabase
        .from('users_credits')
        .insert({ user_id: userId, credits: 5, ai_credits: 0 })

    if (insertError) {
        console.error('Error inserting user credits:', insertError)
        throw new Error('Failed to insert user credits')
    }
}
