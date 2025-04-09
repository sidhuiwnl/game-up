"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import TaskList from "@/components/task-list"
import SubmitTaskDialog from "@/components/submit-task-dialog"
import type { Task } from "@/lib/types"
import { Progress } from "@/components/ui/progress"
import { Trophy } from "lucide-react"

export default function ChildDashboard() {
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: "1",
            name: "Read a book",
            description: "Read at least 20 pages of your favorite book",
            dueDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
            xpReward: 50,
            status: "pending",
            assigneeId : ""
        },
        {
            id: "2",
            name: "Practice math",
            description: "Complete the math worksheet",
            dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
            xpReward: 75,
            status: "submitted",
            assigneeId : ""
        },
        {
            id: "3",
            name: "Science experiment",
            description: "Complete the baking soda volcano experiment",
            dueDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
            xpReward: 100,
            status: "reviewed",
            assigneeId : ""
        },
    ])

    const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
    const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null)

    //@ts-ignore
    const handleSubmitTask = (taskId: string, submissionType: string, submissionContent: string) => {
        setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: "submitted" } : task)))
        setIsSubmitDialogOpen(false)
        setSubmittingTaskId(null)
    }

    const handleOpenSubmitDialog = (taskId: string) => {
        setSubmittingTaskId(taskId)
        setIsSubmitDialogOpen(true)
    }

    // Calculate total XP earned
    const earnedXP = tasks.filter((task) => task.status === "reviewed").reduce((sum, task) => sum + task.xpReward, 0)

    // Calculate progress to next level (assuming 500 XP per level)
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
                                <div className="text-2xl font-bold">{tasks.filter((t) => t.status === "pending").length}</div>
                                <div className="text-sm text-muted-foreground">Pending</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{tasks.filter((t) => t.status === "submitted").length}</div>
                                <div className="text-sm text-muted-foreground">Submitted</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">{tasks.filter((t) => t.status === "reviewed").length}</div>
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
