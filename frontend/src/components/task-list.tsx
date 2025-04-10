"use client"

import type { Task } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, CheckCircle, Upload } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface TaskListProps {
    tasks: Task[]
    onEdit?: (task: Task) => void
    onDelete?: (taskId: string) => void
    onReview?: (taskId: string) => void
    onSubmit?: (taskId: string) => void
    isParentView: boolean
}

export default function TaskList({ tasks, onEdit, onDelete, onReview, onSubmit, isParentView }: TaskListProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return <Badge variant="outline">Pending</Badge>
            case "submitted":
                return <Badge variant="secondary">Submitted</Badge>
            case "reviewed":
                return <Badge variant="default">Completed</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>XP Reward</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                No tasks found
                            </TableCell>
                        </TableRow>
                    ) : (
                        tasks.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell className="font-medium">
                                    <div>{task.name}</div>
                                    <div className="text-sm text-muted-foreground line-clamp-1">{task.description}</div>
                                </TableCell>
                                <TableCell>{formatDistanceToNow(task.dueDate!, { addSuffix: true })}</TableCell>
                                <TableCell>{task.xpReward} XP</TableCell>
                                <TableCell>{getStatusBadge(task.status)}</TableCell>
                                <TableCell className="text-right">
                                    {isParentView ? (
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => onEdit?.(task)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => onDelete?.(task.id!)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            {task.status === "SUBMITTED" && (
                                                <Button variant="ghost" size="icon" onClick={() => onReview?.(task.id!)}>
                                                    <CheckCircle className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            {task.status === "PENDING" && (
                                                <Button variant="outline" size="sm" onClick={() => onSubmit?.(task.id!)}>
                                                    <Upload className="h-4 w-4 mr-2" /> Submit
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
