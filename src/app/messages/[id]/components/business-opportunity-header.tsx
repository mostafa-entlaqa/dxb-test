import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export function BusinessOpportunityHeader({ className }: { className?: string }) {
  return (
    <Card className={`${className} shadow-none rounded-none`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Image
            src="/placeholder.svg"
            alt="Business image"
            width={100}
            height={100}
            className="rounded-lg object-cover"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-primary">Premium Coffee Shop</h1>
            <p className="text-lg font-semibold text-primary">Selling Price: $250,000</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

