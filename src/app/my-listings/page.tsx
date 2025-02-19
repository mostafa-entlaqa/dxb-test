
import { getUserList } from "@/actions/user/bussiness-list/get-user-list";
import BusinessListingsTable from "./BusinessListingsTable";


export default async function MyBusinessListingsPage() {

    const { businessUserData } = await getUserList()

    const dummpyData = [
        { id: "1", images: ["/placeholder.svg"], opportunity_name: "Coffee Shop", approve: "2023-05-15", form_status: "Published" },
        { id: "2", images: ["/placeholder.svg"], opportunity_name: "Tech Startup", approve: "2023-06-01", form_status: "Draft" },
        { id: "3", images: ["/placeholder.svg"], opportunity_name: "Bookstore", approve: "2023-06-10", form_status: "Published" },
        // Add more sample data here...
    ]

    const newDummpy = [
        { id: "1", photo: "/placeholder.svg", name: "Coffee Shop", publishDate: "2023-05-15", publishStatus: "Published" },
        { id: "2", photo: "/placeholder.svg", name: "Tech Startup", publishDate: "2023-06-01", publishStatus: "Draft" },
        { id: "3", photo: "/placeholder.svg", name: "Bookstore", publishDate: "2023-06-10", publishStatus: "Published" },
        // Add more sample data here...
    ]
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

