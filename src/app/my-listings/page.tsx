
import { getUserList } from "@/actions/user/bussiness-list/get-user-list";
import BusinessListingsTable from "./BusinessListingsTable";


export default async function MyBusinessListingsPage() {

    const { businessUserData } = await getUserList()

 
    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">My Business Listings</h1>
            <BusinessListingsTable data={businessUserData} />
        </div>
    )
}

