
import { getClientSupabase } from "@/lib/supabase/client"

export const initCredits = async (userId: string | undefined) => {
    if (!userId) {
        throw new Error('User ID is required')
    }
    const supabase = await getClientSupabase()
    const { data, error } = await supabase
        .from('users_credits')
        .insert({ user_id: userId, credits: 5, ai_credits: 0 })

    if (error) {
        console.error('Error inserting user credits:', error)
        throw new Error('Failed to insert user credits')
    }

}
