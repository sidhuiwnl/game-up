
import { useEffect, useState} from "react"
import { Card, CardContent } from "@/components/ui/card"
import TaskList from "@/components/task-list"
import SubmitTaskDialog from "@/components/submit-task-dialog"
import type { Task } from "@/lib/types"
import { Progress } from "@/components/ui/progress"
import { Trophy } from "lucide-react"
import axios from "axios";
import {useUser} from "@/context/UserContext.tsx";

export default function ChildDashboard() {
    const { userData } = useUser();





    const [tasks, setTasks] = useState<Task[]>([])

    useEffect(() => {
        async function getChildTask() {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/tasks`, {
                    headers: {
                        Authorization: `Bearer ${userData?.token}`,
                    },
                })

                console.log(response.data)
                setTasks(response.data.tasks)
            } catch (error) {
                console.error("Error fetching child tasks:", error)
            }
        }
        if(userData?.token){
            getChildTask()
        }

    },[userData])


    const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
    const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null)

    //@ts-ignore
    const handleSubmitTask = async (taskId: string, submissionType: string, submissionContent: string) => {
        setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: "SUBMITTED" } : task)))
        let payload : { content ? : string, fileUrl? : string,completed? : "COMPLETED"} = {};

        if (submissionType === "TEXT") {
            payload.content = submissionContent;
        } else if (submissionType === "FILE") {
            payload.fileUrl = submissionContent;
        } else if (submissionType === "COMPLETED") {
            payload.completed = submissionType;
        }
        try {
                const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/tasks/${taskId}/submit`,payload,{
                    headers : {
                        Authorization : `Bearer ${userData?.token}`
                    },
                })

                console.log("Submitted task", response)

        }catch(error) {
            console.error(error)
        }
        setIsSubmitDialogOpen(false)
        setSubmittingTaskId(null)
    }

    const handleOpenSubmitDialog = (taskId: string) => {
        setSubmittingTaskId(taskId)
        setIsSubmitDialogOpen(true)
    }


    const earnedXP = tasks.filter((task) => task.status === "REVIEWED").reduce((sum, task) => sum + task.xpReward, 0)


    const xpForNextLevel = 500
    const progress = ((earnedXP % xpForNextLevel) / xpForNextLevel) * 100
    const currentLevel = Math.floor(earnedXP / xpForNextLevel) + 1

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 justify-between">
                <Card className="flex-1">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-medium mb-2">Your Progress</h3>
                        <div className="flex items-center gap-2 mb-2">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                            <span className="font-bold text-xl">Level {currentLevel}</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                <span>
                  XP: {earnedXP % xpForNextLevel}/{xpForNextLevel}
                </span>
                                <span>Total XP: {earnedXP}</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex-1">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-medium mb-2">Tasks Summary</h3>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold">{tasks.filter((t) => t.status === "PENDING").length}</div>
                                <div className="text-sm text-muted-foreground">Pending</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{tasks.filter((t) => t.status === "SUBMITTED").length}</div>
                                <div className="text-sm text-muted-foreground">Submitted</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{tasks.filter((t) => t.status === "REVIEWED").length}</div>
                                <div className="text-sm text-muted-foreground">Completed</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <h2 className="text-2xl font-semibold">Your Tasks</h2>

            <Card>
                <CardContent className="p-6">
                    <TaskList tasks={tasks} onSubmit={handleOpenSubmitDialog} isParentView={false} />
                </CardContent>
            </Card>

            {submittingTaskId && (
                <SubmitTaskDialog
                    open={isSubmitDialogOpen}
                    onOpenChange={setIsSubmitDialogOpen}
                    onSubmit={(type, content) => handleSubmitTask(submittingTaskId, type, content)}
                    task={tasks.find((t) => t.id === submittingTaskId)!}
                />
            )}
        </div>
    )
}
