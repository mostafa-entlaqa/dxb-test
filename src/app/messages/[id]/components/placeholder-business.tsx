import React from 'react'
import { BuyerTag } from './buyer-tag'

interface PlaceholderBusinessType {
    businessId: string
    buyerId: string | null
}

function PlaceholderBusiness({ businessId, buyerId }: PlaceholderBusinessType) {
    return (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
                <p className="mb-4">Select a buyer to view messages</p>
                <BuyerTag businessId={businessId} buyerId={buyerId || ''} isLoading={false} />
            </div>
        </div>
    )
}

export default PlaceholderBusiness 