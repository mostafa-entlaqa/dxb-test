'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, X, Plus, Image as ImageIcon } from "lucide-react"
import Image from 'next/image'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from '@/components/ui/use-toast'

interface EditImagesProps {
  business: any
  onSave: (data: any) => void
}

export default function EditImages({ business, onSave }: EditImagesProps) {
  const [images, setImages] = useState<string[]>(business.images || [])
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = createClientComponentClient()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      setIsUploading(true)
      const newImages: string[] = []

      for (const file of files) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `${business.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('business-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('business-images')
          .getPublicUrl(filePath)

        newImages.push(publicUrl)
      }

      const updatedImages = [...images, ...newImages]
      setImages(updatedImages)
      onSave({ images: updatedImages })

    } catch (error) {
      console.error('Error uploading images:', error)
      toast({
        title: "Error",
        description: "Failed to upload images. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageDelete = async (indexToDelete: number) => {
    if (isDeleting) return // Prevent multiple clicks
    
    try {
      setIsDeleting(true)
      const imageUrl = images[indexToDelete]
      
      // Extract the file path from the URL
      const urlParts = imageUrl.split('business-images/')
      if (urlParts.length < 2) throw new Error('Invalid image URL')
      
      const filePath = urlParts[1]

      // Delete the file from storage
      const { error: deleteError } = await supabase.storage
        .from('business-images')
        .remove([filePath])

      if (deleteError) throw deleteError

      // Update both state and database immediately
      const updatedImages = images.filter((_, index) => index !== indexToDelete)
      
      setImages(updatedImages)
      onSave({ images: updatedImages })
      
      toast({
        title: "Success",
        description: "Image deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting image:', error)
      toast({
        title: "Error",
        description: "Failed to delete image. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="shadow-lg mb-8">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Images</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="relative h-8"
            disabled={isUploading}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleImageUpload}
            />
            {isUploading ? "Uploading..." : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </>
            )}
          </Button>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-6 border border-dashed rounded-lg bg-muted">
            <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-1 text-sm text-muted-foreground">No images uploaded</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative group aspect-square">
                <div className="w-full h-full rounded-md overflow-hidden">
                  <Image
                    src={image}
                    alt={`Business image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  onClick={() => handleImageDelete(index)}
                  disabled={isDeleting}
                >
                  <X className="h-3 w-3" />
                </Button>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 