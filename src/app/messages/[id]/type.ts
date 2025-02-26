export interface BusinessDetails {
    id: string
    opportunity_name: string
    selling_price: number
    category: { name: string }
    area: { name: string }
    user_id: string
    category_id: number
    area_id: string
  }
  
  export interface BuyerStatus {
    id: string
    business_id: string
    buyer_id: string
    status: "New" | "Qualified" | "Negotiation" | "Won" | "Lost"
    has_unread: boolean
    buyer: {
      id: string
      email: string
      full_name: string
      profile_pic_url?: string
    }
  }