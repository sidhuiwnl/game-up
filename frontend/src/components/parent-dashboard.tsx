"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import TaskList from "@/components/task-list"
import CreateTaskDialog from "@/components/create-task-dialog"
import type { Task } from "@/lib/types"

export default function     ParentDashboard() {
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: "1",
            name: "Read a book",
            description: "Read at least 20 pages of your favorite book",
            dueDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
            xpReward: 50,
            status: "pending",
        },
        {
            id: "2",
            name: "Practice math",
            description: "Complete the math worksheet",
            dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
            xpReward: 75,
            status: "submitted",
        },
    ])

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null)

    const handleCreateTask = (task: Task) => {
        if (editingTask) {
            setTasks(tasks.map((t) => (t.id === task.id ? task : t)))
            setEditingTask(null)
        } else {
            setTasks([...tasks, { ...task, id: Date.now().toString() }])
        }
        setIsCreateDialogOpen(false)
    }

    const handleEditTask = (task: Task) => {
        setEditingTask(task)
        setIsCreateDialogOpen(true)
    }

    const handleDeleteTask = (taskId: string) => {
        setTasks(tasks.filter((task) => task.id !== taskId))
    }

    const handleReviewTask = (taskId: string) => {
        setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: "reviewed" } : task)))
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Manage Tasks</h2>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create Task
                </Button>
            </div>

            <Card>
                <CardContent className="p-6">
                    <TaskList
                        tasks={tasks}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onReview={handleReviewTask}
                        isParentView={true}
                    />
                </CardContent>
            </Card>

            <CreateTaskDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onSave={handleCreateTask}
                editTask={editingTask}
            />
        </div>
    )
}
