import { getBusinesses } from "@/actions/admin/businesses"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const businesses = await getBusinesses()
    return NextResponse.json(businesses)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch businesses" }, { status: 500 })
  }
} 