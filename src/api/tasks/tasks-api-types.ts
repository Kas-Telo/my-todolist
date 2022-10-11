export type TaskResponseDataType = {
    id: string,
    title: string,
    description: string
    todoListId: string,
    order: number,
    status: number,
    priority: number,
    startDate: string,
    deadline: string,
    addedDate: string
}
export type TasksResponseType = {
    items: Array<TaskResponseDataType>
    totalCount: number
    error: null | string
}
export type UpdateTaskRequestType = {
    title: string,
    description: string,
    status: number,
    priority: number,
    startDate: string,
    deadline: string
}