export interface Task {
    id?: string
    name: string
    description: string
    dueDate: Date
    xpReward: number
    status: "pending" | "submitted" | "reviewed"
    assigneeId: string
}
