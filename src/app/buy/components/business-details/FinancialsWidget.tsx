import { DollarSign, TrendingUp, PieChart, Share2 } from "lucide-react"

interface FinancialsWidgetProps {
  isUnlocked: boolean
  selling_price: number
  monthly_revenue: number
  profit_margin: number
  acquisition_type: string
  investment_percentage?: number
}

export default function FinancialsWidget({
  isUnlocked,
  selling_price,
  monthly_revenue,
  profit_margin,
  acquisition_type,
  investment_percentage
}: FinancialsWidgetProps) {
  return (
    <div className={`space-y-4 ${isUnlocked ? "" : "filter blur-sm"}`}>
      <h2 className="text-2xl font-semibold mb-4 text-blue-800">Key Financials</h2>
      <div className="bg-blue-50 dark:bg-blue-950/50  p-4 rounded-lg flex items-center">
        <DollarSign className="mr-4 text-green-600" />
        <div>
          <p className="font-semibold text-gray-700">{acquisition_type === 'Buy' ? 'Selling Price' : "Required Investment"}</p>
          <p className="text-2xl text-blue-700">AED{selling_price.toLocaleString()}</p>
        </div>
      </div>
      <div className="bg-blue-50 dark:bg-blue-950/50  p-4 rounded-lg flex items-center">
        <TrendingUp className="mr-4 text-blue-600" />
        <div>
          <p className="font-semibold text-gray-700">Monthly Revenue</p>
          <p className="text-2xl text-blue-700">AED{monthly_revenue.toLocaleString()}</p>
        </div>
      </div>
      <div className="bg-blue-50 dark:bg-blue-950/50  p-4 rounded-lg flex items-center">
        <PieChart className="mr-4 text-purple-600" />
        <div>
          <p className="font-semibold text-gray-700">Profit Margin</p>
          <p className="text-2xl text-blue-700">{profit_margin}%</p>
        </div>
      </div>
      {acquisition_type === 'Invest' && investment_percentage && (
        <div className="bg-blue-50 dark:bg-blue-950/50  p-4 rounded-lg flex items-center">
          <Share2 className="mr-4 text-orange-600" />
          <div>
            <p className="font-semibold text-gray-700">Equity</p>
            <p className="text-2xl text-blue-700">{investment_percentage}%</p>
          </div>
        </div>
      )}
    </div>
  )
}

