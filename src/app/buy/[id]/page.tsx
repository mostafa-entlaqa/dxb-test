import { getCategoryById } from "@/actions/user/bussiness-list/get-category-by-id"
import ListingPreview from "../components/business-details/ListingPreview"
import { getBusinessesById } from "@/actions/user/buy/get-businesses-by-id"
import { getAreaById } from "@/actions/user/bussiness-list/get-area-by-id"

export default async function ListingPreviewPage({ params }: { params: { id: string } }) {

  const business = await getBusinessesById(params.id)
  if (!business) {
    return <div>Business not found</div>
  }

  const category = await getCategoryById(business.category_id)
  if (!category) {
    return <div>Category not found</div>
  }

  console.log('category',category)

  const area = await getAreaById(business.area_id)
  if (!area) {
    return <div>Area not found</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-12">
      <ListingPreview business={business} category={category.data} area={area.data} />
    </div>
  )
}

