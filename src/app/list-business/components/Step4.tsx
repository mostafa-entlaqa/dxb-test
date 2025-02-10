import { useFormContext } from 'react-hook-form'
import { Input } from "@/components/ui/input"
import { type LucideIcon, Upload } from 'lucide-react'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { uploadFile, uploadImages } from '@/actions/user/bussiness-list/upload'
import { useState, useCallback } from 'react'
import { toast } from '@/components/ui/use-toast'

interface Step4Props {
  icon: LucideIcon
}

export default function Step4({ icon: Icon }: Step4Props) {
  const { setValue,watch, formState: { errors } } = useFormContext()
  const [uploadingImages, setUploadingImages] = useState(false)
  const [uploadingPresentation, setUploadingPresentation] = useState(false)
  const [uploadingFinancial, setUploadingFinancial] = useState(false)

  const images = watch('images')
  const presentation = watch('presentation')
  const financialStatement = watch('financialStatement')
  console.log('watch images', images)
  console.log('watch presentation', presentation)
  console.log('watch financialStatement', financialStatement)
  const uploadFilesToStorage = useCallback(async (files: File[], bucket: string) => {
    try {
      const formData = new FormData()
      files.forEach(file => {
        formData.append('files', file)
      })
      const urls = await uploadImages(formData, bucket)
      return urls
    } catch (error) {
      console.error('Error uploading files:', error)
      throw error
    }
  }, [])

  const uploadSingleFileToStorage = useCallback(async (file: File, bucket: string) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const url = await uploadFile(formData, bucket)
      return url
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }, [])

  const handleImageChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      try {
        setUploadingImages(true)
        const filesArray = Array.from(files)
        const urls = await uploadFilesToStorage(filesArray, 'business-images')
        setValue('images', urls, { shouldValidate: true })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upload images. Please try again.",
          variant: "destructive"
        })
        setValue('images', [], { shouldValidate: true })
      } finally {
        setUploadingImages(false)
      }
    } else {
      setValue('images', [], { shouldValidate: true })
    }
  }, [setValue, uploadFilesToStorage])

  const handlePresentationChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      try {
        setUploadingPresentation(true)
        const url = await uploadSingleFileToStorage(files[0], 'presentations')
        if (!url) throw new Error('Failed to get upload URL')
        setValue('presentation', url, { shouldValidate: true })
      } catch (error) {
        console.error('Error uploading presentation:', error)
        toast({
          title: "Error",
          description: "Failed to upload presentation. Please try again.",
          variant: "destructive"
        })
        setValue('presentation', '', { shouldValidate: true })
      } finally {
        setUploadingPresentation(false)
      }
    } else {
      setValue('presentation', '', { shouldValidate: true })
    }
  }, [setValue, uploadSingleFileToStorage])

  const handleFinancialStatementChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      try {
        setUploadingFinancial(true)
        const url = await uploadSingleFileToStorage(files[0], 'financial-statements')
        if (!url) throw new Error('Failed to get upload URL')
        setValue('financialStatement', url, { shouldValidate: true })
      } catch (error) {
        console.error('Error uploading financial statement:', error)
        toast({
          title: "Error",
          description: "Failed to upload financial statement. Please try again.",
          variant: "destructive"
        })
        setValue('financialStatement', '', { shouldValidate: true })
      } finally {
        setUploadingFinancial(false)
      }
    } else {
      setValue('financialStatement', '', { shouldValidate: true })
    }
  }, [setValue, uploadSingleFileToStorage])

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 text-blue-600">
        <Icon className="w-8 h-8" />
        <h2 className="text-2xl font-semibold">Upload Documents</h2>
      </div>
      <div className="space-y-4">
        <FormField
          name="images"
          render={() => (
            <FormItem>
              <FormLabel className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload Business Images </span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={uploadingImages}
                    className="mt-2"
                  />
                  {uploadingImages && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                      <div className="text-sm text-blue-600">Uploading images...</div>
                    </div>
                  )}
                </div>
              </FormControl>
              {images && images.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-2">Uploaded images:</p>
                  <div className="flex flex-wrap gap-2">
                    {images.map((url: string, index: number) => (
                      <div key={index} className="relative group">
                        <img 
                          src={url} 
                          alt={`Uploaded ${index + 1}`} 
                          className="w-20 h-20 object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {errors.images && (
                <FormMessage>
                  {errors.images.message as string}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          name="presentation"
          render={() => (
            <FormItem>
              <FormLabel className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload Presentation (optional)</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type="file" 
                    accept=".pdf,.ppt,.pptx"
                    onChange={handlePresentationChange}
                    disabled={uploadingPresentation}
                    className="mt-2" 
                  />
                  {uploadingPresentation && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                      <div className="text-sm text-blue-600">Uploading presentation...</div>
                    </div>
                  )}
                </div>
              </FormControl>
              {presentation && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Uploaded presentation:</p>
                  <a 
                    href={presentation} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View presentation
                  </a>
                </div>
              )}
              {errors.presentation && (
                <FormMessage>
                  {errors.presentation.message as string}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <FormField
          name="financialStatement"
          render={() => (
            <FormItem>
              <FormLabel className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload Financial Statement (optional)</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type="file" 
                    accept=".pdf,.xls,.xlsx,.doc,.docx"
                    onChange={handleFinancialStatementChange}
                    disabled={uploadingFinancial}
                    className="mt-2" 
                  />
                  {uploadingFinancial && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                      <div className="text-sm text-blue-600">Uploading financial statement...</div>
                    </div>
                  )}
                </div>
              </FormControl>
              {financialStatement && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Uploaded financial statement:</p>
                  <a 
                    href={financialStatement} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View financial statement
                  </a>
                </div>
              )}
              {errors.financialStatement && (
                <FormMessage>
                  {errors.financialStatement.message as string}
                </FormMessage>
              )}
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
