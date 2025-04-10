import ParentDashboard from "@/components/parent-dashboard"
import ChildDashboard from "@/components/child-dashboard"
import {useUser} from "@/context/UserContext.tsx";

export default function Dashboard() {
    const { userData } = useUser();



    return (

            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-center">{`Task Manager ${userData?.user.role} Dashboard`}</h1>

                { userData?.user.role === "PARENT" ? (
                    <ParentDashboard />
                ) : (
                    <ChildDashboard />
                )}


            </main>

    )
}
