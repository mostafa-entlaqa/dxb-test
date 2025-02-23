'use client'

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building, ShoppingCart, Briefcase, MapPin } from "lucide-react"

interface EditBusinessDetailsProps {
  business: any
  category: any
  area: any
  onSave: (data: any) => void
}

export default function EditBusinessDetails({ 
  business,
  category,
  area,
  onSave
}: EditBusinessDetailsProps) {
  const [formData, setFormData] = useState({
    business_name: business.business_name || '',
    opportunity_name: business.opportunity_name || '',
    description: business.description || '',
    acquisition_type: business.acquisition_type || 'Buy',
    category_id: business.category_id,
    area_id: business.area_id,
    investment_percentage: business.investment_percentage
  })

  const handleChange = (field: string, value: any) => {
    const newData = {
      ...formData,
      [field]: value
    }
    setFormData(newData)
    onSave(newData) // Immediately notify parent of changes
  }

  // Update local state if business prop changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      business_name: business.business_name || '',
      opportunity_name: business.opportunity_name || '',
      description: business.description || '',
      acquisition_type: business.acquisition_type || 'Buy',
      category_id: business.category_id,
      area_id: business.area_id,
    }))
  }, [business])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4 text-blue-800">Business Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* <div>
          <label className="text-sm font-medium">Business Name</label>
          <Input
            value={formData.business_name}
            onChange={(e) => handleChange('business_name', e.target.value)}
          />
        </div> */}

        <div>
          <label className="text-sm font-medium">Business Name</label>
          <Input
            value={formData.opportunity_name}
            onChange={(e) => handleChange('opportunity_name', e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Acquisition Type</label>
          <Select
            value={formData.acquisition_type}
            onValueChange={(value) => handleChange('acquisition_type', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Buy">Buy</SelectItem>
              <SelectItem value="Invest">Invest</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.acquisition_type === 'Invest' && (
          <div>
            <label className="text-sm font-medium">Investment Percentage</label>
            <Input
              type="number"
              value={formData.investment_percentage}
              onChange={(e) => handleChange('investment_percentage', e.target.value)}
            />
          </div>
        )}

        <div>
          <label className="text-sm font-medium">Category</label>
          <Select
            value={formData.category_id.toString()}
            onValueChange={(value) => handleChange('category_id', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {category.map((cat: any) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Area</label>
          <Select
            value={formData.area_id.toString()}
            onValueChange={(value) => handleChange('area_id', parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {area.map((a: any) => (
                <SelectItem key={a.id} value={a.id.toString()}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={4}
        />
      </div>
    </div>
  )
} 