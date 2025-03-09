'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { FileText, Upload } from "lucide-react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from '@/components/ui/use-toast'

interface EditDocumentsProps {
  business: any
  onSave: (data: any) => void
}

export default function EditDocuments({ business, onSave }: EditDocumentsProps) {
  const [isUploading, setIsUploading] = useState(false)
  const presentationInputRef = useRef<HTMLInputElement>(null)
  const financialsInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClientComponentClient()

  const handleFileUpload = async (file: File, type: 'presentation' | 'financials') => {
    if (!file) return

    try {
      setIsUploading(true)

      // Get correct bucket name
      const bucketName = type === 'presentation' ? 'presentations' : 'financial-statements'

      // Create unique file name
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${business.user_id}/${business.id}/${fileName}`

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath)

      // Update business data
      const updates = {
        [`${type}_file`]: publicUrl
      }
      onSave(updates)

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      })
    } catch (error: any) { // Type assertion to handle error.message
      console.error('Error uploading document:', error)
      toast({
        title: "Error",
        description: `Failed to upload document: ${error.message}`,
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handlePresentationClick = () => {
    presentationInputRef.current?.click()
  }

  const handleFinancialsClick = () => {
    financialsInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-blue-800 dark:text-blue-400">Documents</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FileText className="mr-2 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold dark:text-gray-200">Presentation</span>
          </div>
          <input
            type="file"
            ref={presentationInputRef}
            className="hidden"
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileUpload(file, 'presentation')
            }}
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={handlePresentationClick}
            disabled={isUploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload Presentation"}
          </Button>
          {business.presentation_file && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Current file: {business.presentation_file.split('/').pop()}
            </p>
          )}
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <FileText className="mr-2 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold dark:text-gray-200">Financial Statement</span>
          </div>
          <input
            type="file"
            ref={financialsInputRef}
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileUpload(file, 'financials')
            }}
          />
          <Button
            variant="outline"
            className="w-full"
            onClick={handleFinancialsClick}
            disabled={isUploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload Financial Statement"}
          </Button>
          {business.financials_file && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Current file: {business.financials_file.split('/').pop()}
            </p>
          )}
        </div>
      </div>
    </div>
  )
} 