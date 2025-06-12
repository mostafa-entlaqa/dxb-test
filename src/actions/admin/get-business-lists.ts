import { getServerSupabase } from '@/lib/supabase/utils'



export const getBusinessesList = async () => {
    const supabase = await getServerSupabase()

    const {data,error } =  await supabase.from('businesses').select('*')
        if(error) {
        throw new Error(error.message)
    }
    return {data}
} 