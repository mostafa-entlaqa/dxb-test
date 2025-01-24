'use server'

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'

export async function uploadFile(
  formData: FormData,
  bucket: string
): Promise<string | null> {
  const supabase = createServerComponentClient({ cookies })
  
  const file = formData.get('file') as File
  if (!file) return null
  
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
    return publicUrl
  }
  
  return null
} 

export async function uploadImages(
  formData: FormData,
  bucket: string
): Promise<string[]> {
  const supabase = createServerComponentClient({ cookies })
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
