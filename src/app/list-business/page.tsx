import BusinessListingWizard from '@/components/BusinessListingWizard'

export default function ListBusinessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto py-10">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-800">List Your Business for Sale</h1>
        <BusinessListingWizard />
      </div>
    </div>
  )
}

