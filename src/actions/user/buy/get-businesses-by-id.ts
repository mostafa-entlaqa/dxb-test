import { getServerSupabase } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function getBusinessesById(id: string) {
    const supabase = getServerSupabase()
    const {data, error} = await supabase.from('businesses').select('*').eq('id', id).single()
    if (error) {
        throw new Error('Error fetching business by id')
}
return data

  
}