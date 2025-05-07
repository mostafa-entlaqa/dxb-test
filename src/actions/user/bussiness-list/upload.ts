'use server'

import { getServerSupabase } from '@/lib/supabase/utils'
import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'

export async function uploadFile(
  formData: FormData,
  bucket: string
): Promise<string | null> {
  const supabase = getServerSupabase()
  
  const file = formData.get('file') as File
  if (!file) {
    console.error('No file provided')
    return null
  }
  
  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const fileExt = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw uploadError
    }
    
    if (uploadData) {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(uploadData.path)
      
      return data.publicUrl
    }
    
    return null
  } catch (error) {
    console.error('Error in uploadFile:', error)
    throw error
  }
} 

export async function uploadImages(
  formData: FormData,
  bucket: string
): Promise<string[]> {
  const supabase = getServerSupabase()
  const imageUrls: string[] = []
  const files = formData.getAll('files') as File[]

  for (const file of files) {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const fileExt = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer)

    if (uploadError) throw uploadError 
    
    if (uploadData) {
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)
      imageUrls.push(publicUrl)
    }
  }

  return imageUrls
}
