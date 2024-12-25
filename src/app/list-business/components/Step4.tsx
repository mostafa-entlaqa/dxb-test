import { useFormContext } from 'react-hook-form'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type LucideIcon, Upload } from 'lucide-react'

interface Step4Props {
  icon: LucideIcon
}

export default function Step4({ icon: Icon }: Step4Props) {
  const { register, setValue, watch } = useFormContext()
  const images = watch('images')

  console.log(images)

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 text-blue-600">
        <Icon className="w-8 h-8" />
        <h2 className="text-2xl font-semibold">Upload Documents</h2>
      </div>
      <div className="space-y-4">
        <div>
          <Label htmlFor="images" className="flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Upload Business Images (optional)</span>
          </Label>
          <Input 
            type="file" 
            id="images" 
            multiple 
            accept="image/*"
            {...register('images')}
            onChange={(e) => {
              const files = e.target.files
              if (files) {
                const filesArray = Array.from(files)
                setValue('images', filesArray)
              }
            }}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="presentation" className="flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Upload Presentation (optional)</span>
          </Label>
          <Input 
            type="file" 
            id="presentation" 
            accept=".pdf,.ppt,.pptx"
            {...register('presentation')} 
            className="mt-2" 
          />
        </div>

        <div>
          <Label htmlFor="financialStatement" className="flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Upload Financial Statement (optional)</span>
          </Label>
          <Input 
            type="file" 
            id="financialStatement" 
            accept=".pdf,.xls,.xlsx,.doc,.docx"
            {...register('financialStatement')} 
            className="mt-2" 
          />
        </div>
      </div>
    </div>
  )
}
