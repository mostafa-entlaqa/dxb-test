
import { getUserList } from "@/actions/user/bussiness-list/get-user-list";
import BusinessListingsTable from "./BusinessListingsTable";


export default async function MyBusinessListingsPage() {

    const { businessUserData } = await getUserList()

 
    // Transform the data to match the expected structure while keeping original property names
    // const transformedData = businessUserData.map(item => ({
    //     id: item.id.toString(), // Ensure id is a string
    //     images: item.images, // Keep the original images array
    //     opportunity_name: item.opportunity_name, // Keep the original opportunity_name
    //     form_status: item.form_status, // Keep the original form_status
    //     approve: item.approve, // Keep the original approve property
    // }));

    // console.log("Transformed Data:", transformedData);

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">My Business Listings</h1>
            <BusinessListingsTable data={businessUserData} />
        </div>
    )
}

