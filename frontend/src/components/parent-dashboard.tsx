
import {useEffect, useState} from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import TaskList from "@/components/task-list"
import CreateTaskDialog from "@/components/create-task-dialog"
import type { Task } from "@/lib/types"
import axios from "axios";
import {useUser} from "@/context/UserContext.tsx";
import {toast} from "sonner";

export default function     ParentDashboard() {
    const { userData } = useUser()
    const [tasks, setTasks] = useState<Task[]>([])

    useEffect(() => {
        async function getAllTasks(){
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/tasks`,{
                    headers : {
                        Authorization: `Bearer ${userData?.token}`
                    }
                })

                setTasks(response.data.tasks)


            }catch (error){
                console.log(error)
            }
        }
        getAllTasks()
    }, []);

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
        setEditingTask({
            ...task,
            dueDate : new Date(task.dueDate!),
        })
        setIsCreateDialogOpen(true)
    }

    console.log(tasks)

    const handleDeleteTask = async (taskId: string) => {
        setTasks(tasks.filter((task) => task.id !== taskId))

        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/tasks/${taskId}`,{
                headers : {
                    Authorization: `Bearer ${userData?.token}`
                }
            })
            toast.success("Task deleted")
        }catch (error){
            console.log(error)
        }
    }

    const handleReviewTask = (taskId: string) => {
        setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: "REVIEWED" } : task)))
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
