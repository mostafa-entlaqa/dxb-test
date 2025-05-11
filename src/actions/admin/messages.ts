import { getServerSupabase } from "@/lib/supabase/server"

export async function getMessageRooms() {
  const supabase = getServerSupabase()

  // Fetch all messages, join with business for name and owner, and join users for sender/receiver
  const { data: messages, error } = await supabase
    .from("messages")
    .select(`
      id, business_id, sender_id, receiver_id, content, created_at,
      businesses!messages_business_id_fkey (id, opportunity_name, user_id),
      sender:sender_id (id, full_name, profile_pic_url),
      receiver:receiver_id (id, full_name, profile_pic_url)
    `)
    .order("created_at", { ascending: false })

  if (error) throw error
  if (!messages) return []

  // Group by business_id, sender_id, receiver_id (room)
  const roomMap = new Map<string, any>()
  for (const msg of messages) {
    const business = Array.isArray(msg.businesses) ? msg.businesses[0] : msg.businesses
    if (!business) continue
    const sender = Array.isArray(msg.sender) ? msg.sender[0] : msg.sender
    const receiver = Array.isArray(msg.receiver) ? msg.receiver[0] : msg.receiver
    // Determine seller (business.user_id) and buyer (the other user)
    const sellerId = business.user_id
    let buyerId = msg.sender_id === sellerId ? msg.receiver_id : msg.sender_id
    let seller = msg.sender_id === sellerId ? sender : receiver
    let buyer = msg.sender_id === sellerId ? receiver : sender
    // Always order ids to avoid duplicate rooms
    const ids = [sellerId, buyerId].sort()
    const room_id = `${msg.business_id}-${ids[0]}-${ids[1]}`
    if (!roomMap.has(room_id)) {
      roomMap.set(room_id, {
        room_id,
        business_id: msg.business_id,
        business_name: business.opportunity_name || '',
        seller: seller ? {
          id: seller.id,
          full_name: seller.full_name,
          profile_pic_url: seller.profile_pic_url
        } : null,
        buyer: buyer ? {
          id: buyer.id,
          full_name: buyer.full_name,
          profile_pic_url: buyer.profile_pic_url
        } : null,
        last_message: msg.content,
        last_date: msg.created_at,
      })
    }
  }
  return Array.from(roomMap.values())
} 