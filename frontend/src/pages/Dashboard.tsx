import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ParentDashboard from "@/components/parent-dashboard"
import ChildDashboard from "@/components/child-dashboard"
import {useUser} from "@/context/UserContext.tsx";

export default function Dashboard() {
    const { userData } = useUser();



    return (

            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-center">Task Manager</h1>

                { userData?.user.role === "PARENT" ? (
                    <Tabs defaultValue="parent" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="parent">Parent View</TabsTrigger>
                            <TabsTrigger value="child">Child View</TabsTrigger>
                        </TabsList>

                        <TabsContent value="parent">
                            <ParentDashboard />
                        </TabsContent>

                        <TabsContent value="child">
                            <ChildDashboard />
                        </TabsContent>
                    </Tabs>
                ) : (

                        <ChildDashboard />

                )}


            </main>

    )
}
