import { instance } from '../api-instance'
import { AxiosResponse } from 'axios'
import { TaskResponseDataType, TasksResponseType, UpdateTaskRequestType } from './tasks-api-types'
import { ItemResponseType, ServerResponseType } from '../api-types'

export const tasksAPI = {
  getTasks(todolistId: string) {
    return instance.get<Record<string, never>, AxiosResponse<TasksResponseType>>(
      `todo-lists/${todolistId}/tasks`,
    )
  },
  createTask(todolistId: string, title: string) {
    return instance.post<
      { title: string },
      AxiosResponse<ServerResponseType<ItemResponseType<TaskResponseDataType>>>
    >(`todo-lists/${todolistId}/tasks`, { title })
  },
  updateTask(todolistId: string, taskId: string, updateTaskData: UpdateTaskRequestType) {
    return instance.put<
      UpdateTaskRequestType,
      AxiosResponse<ServerResponseType<ItemResponseType<TaskResponseDataType>>>
    >(`todo-lists/${todolistId}/tasks/${taskId}`, updateTaskData)
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<Record<string, never>, AxiosResponse<ServerResponseType>>(
      `todo-lists/${todolistId}/tasks/${taskId}`,
    )
  },
}
