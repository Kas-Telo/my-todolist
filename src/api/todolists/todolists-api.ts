import {instance} from "../api-instance";
import {TodolistResponseDataType} from "./todolists-api-types";
import {AxiosResponse} from "axios";
import {ItemResponseType, ServerResponseType} from "../api-types";

export const todolistsAPI = {
    getTodolists() {
        return instance.get<{}, AxiosResponse<Array<TodolistResponseDataType>>>(`/todo-lists`)
    },
    createTodolist(title: string) {
        return instance.post<{ title: string },
            AxiosResponse<ServerResponseType<ItemResponseType<TodolistResponseDataType>>>>(`/todo-lists`, {title})
    },
    updateTodolistTitle(title: string, todolistId: string) {
        return instance.put<{ title: string }, AxiosResponse<ServerResponseType>>(`/todo-lists/${todolistId}`, {title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<{}, AxiosResponse<ServerResponseType>>(`/todo-lists/${todolistId}`)
    }
}