'use server'

import {  createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'

export async function uploadFile(
  file: File,
  bucket: string
): Promise<string | null> {
  const supabase = createServerComponentClient({ cookies })
  
  if (!file) return null
  
  // Convert File to ArrayBuffer for server-side handling
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  
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
  files: File[],
  bucket: string
): Promise<string[]> {
  const supabase = createServerComponentClient({ cookies })
  const imageUrls: string[] = []

  for (const file of files) {
    // Convert File to ArrayBuffer for server-side handling
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    const fileExt = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer)

    if (uploadError) throw uploadError 
    console.log(uploadData)
    console.log(uploadError)
    if (uploadData) {
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)
      imageUrls.push(publicUrl)
    }
  }

  return imageUrls
} 


