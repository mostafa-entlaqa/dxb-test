import { DollarSign, TrendingUp, PieChart } from "lucide-react"

interface FinancialsWidgetProps {
  isUnlocked: boolean
  selling_price: number
  monthly_revenue: number
  profit_margin: number
}

export default function FinancialsWidget({ isUnlocked, selling_price, monthly_revenue, profit_margin }: FinancialsWidgetProps) {
  return (
    <div className={`space-y-4 ${isUnlocked ? "" : "filter blur-sm"}`}>
      <h2 className="text-2xl font-semibold mb-4 text-blue-800">Key Financials</h2>
      <div className="bg-blue-50 p-4 rounded-lg flex items-center">
        <DollarSign className="mr-4 text-green-600" />
        <div>
          <p className="font-semibold text-gray-700">Selling Price</p>
          <p className="text-2xl text-blue-700">AED{selling_price}</p>
        </div>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg flex items-center">
        <TrendingUp className="mr-4 text-blue-600" />
        <div>
          <p className="font-semibold text-gray-700">Monthly Revenue</p>
          <p className="text-2xl text-blue-700">AED{monthly_revenue}</p>
        </div>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg flex items-center">
        <PieChart className="mr-4 text-purple-600" />
        <div>
          <p className="font-semibold text-gray-700">Profit Margin</p>
          <p className="text-2xl text-blue-700">{profit_margin}%</p>
        </div>
      </div>
    </div>
  )
}

