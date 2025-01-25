import { Building, ShoppingCart, Briefcase, MapPin } from "lucide-react"
import { Business } from "../../type"

interface BusinessDetailsProps {
  isUnlocked: boolean
  acquisition_type: string
  category: string
  area: string
  description: string
  opportunity_name: string
}

export default function BusinessDetails({ isUnlocked, acquisition_type, category, area, description, opportunity_name }: BusinessDetailsProps) {
  return (
    <div className={isUnlocked ? "" : "filter blur-sm"}>
      <h2 className="text-2xl font-semibold mb-4 text-blue-800">Business Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center text-blue-700">
            <Building className="mr-2" />
            <span className="font-semibold">Business Name:</span>
          </div>
          <span className="ml-6 text-gray-700">{opportunity_name}</span>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center text-blue-700">
            <ShoppingCart className="mr-2" />
            <span className="font-semibold">Acquisition Type:</span>
          </div>
          <span className="ml-6 text-gray-700">{acquisition_type}</span>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center text-blue-700">
            <Briefcase className="mr-2" />
            <span className="font-semibold">Category:</span>
          </div>
          <span className="ml-6 text-gray-700">{category}</span>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center text-blue-700">
            <MapPin className="mr-2" />
            <span className="font-semibold">Area:</span>
          </div>
          <span className="ml-6 text-gray-700">{area}</span>
        </div>
      </div>
      <div className="mt-4 bg-blue-50 p-4 rounded-lg">
        <p className="text-gray-700">
          <span className="font-semibold text-blue-700">Business Description:{description}</span> 
        </p>
      </div>
    </div>
  )
}

