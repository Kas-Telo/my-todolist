import {createAsyncThunk} from "@reduxjs/toolkit";
import {tasksAPI} from "../../../api/tasks/tasks-api";
import {handleAsyncServerAppError, handleAsyncServerNetworkError} from "../../../assets/utils/error-util";
import {UpdateTaskRequestType} from "../../../api/tasks/tasks-api-types";
import {appSyncActions} from "../../../app/bll/app-sync-actions";
import {RootState, ThunkAPIType} from "../../../app/types";

const {setAppStatus} = appSyncActions

//thunks
export const getTasks = createAsyncThunk<any, any, ThunkAPIType>(
    'tasks/getTasks',
    async (param: { todolistId: string }, thunkAPI) => {
        thunkAPI.dispatch(setAppStatus({status: "progress"}))
        try {
            const res = await tasksAPI.getTasks(param.todolistId)
            thunkAPI.dispatch(setAppStatus({status: "success"}))
            return {todolistId: param.todolistId, responseTasks: res.data}
        } catch (e) {
            return handleAsyncServerNetworkError(e, thunkAPI)
        } finally {
            thunkAPI.dispatch(setAppStatus({status: 'idle'}))
        }

    })
export const createTask = createAsyncThunk<any, any, ThunkAPIType>(
    'tasks/createTask',
    async (param: { todolistId: string, title: string }, thunkAPI) => {
        thunkAPI.dispatch(setAppStatus({status: "progress"}))
        try {
            const res = await tasksAPI.createTask(param.todolistId, param.title)
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatus({status: "success"}))
                return {task: res.data.data.item}
            } else {
                return handleAsyncServerAppError(res.data, thunkAPI)
            }
        } catch (e) {
            return handleAsyncServerNetworkError(e, thunkAPI)
        } finally {
            thunkAPI.dispatch(setAppStatus({status: 'idle'}))
        }
    })
export const updateTask = createAsyncThunk<any,
    UpdateTaskThunkType<UpdateTaskDomainModelType>,
    UpdateTaskThunkAPIType>(
    'tasks/updateTask',
    async (param: UpdateTaskThunkType<UpdateTaskDomainModelType>, thunkAPI) => {
        thunkAPI.dispatch(setAppStatus({status: "progress"}))
        const currentTask = thunkAPI.getState().tasks[param.todolistId].items.find(el => el.id === param.taskId)
        if (!currentTask) {
            return handleAsyncServerNetworkError('task not found', thunkAPI)
        }
        let updateModel: UpdateTaskRequestType = {
            title: currentTask.title,
            description: currentTask.description,
            status: currentTask.status,
            priority: currentTask.priority,
            startDate: currentTask.startDate,
            deadline: currentTask.deadline,
            ...param.data
        }
        try {
            const res = await tasksAPI.updateTask(param.todolistId, param.taskId, updateModel)
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatus({status: "success"}))
                return {todolistId: param.todolistId, taskId: param.taskId, data: res.data.data.item}
            } else {
                handleAsyncServerAppError(res.data, thunkAPI)
            }
        } catch (e) {
            handleAsyncServerNetworkError(e, thunkAPI)
        } finally {
            thunkAPI.dispatch(setAppStatus({status: 'idle'}))
        }
    })
export const deleteTask = createAsyncThunk<any, any, ThunkAPIType>(
    'tasks/deleteTask',
    async (param: { todolistId: string, taskId: string }, thunkAPI) => {
        thunkAPI.dispatch(setAppStatus({status: "progress"}))
        try {
            const res = await tasksAPI.deleteTask(param.todolistId, param.taskId)
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatus({status: "success"}))
                return {todolistId: param.todolistId, taskId: param.taskId}
            } else {
                return handleAsyncServerAppError(res.data, thunkAPI)
            }
        } catch (e) {
            return handleAsyncServerNetworkError(e, thunkAPI)
        } finally {
            thunkAPI.dispatch(setAppStatus({status: 'idle'}))
        }
    })

export const asyncActions = {
    getTasks,
    updateTask,
    createTask,
    deleteTask,
}

//types
export type UpdateTaskDomainModelType = {
    title?: string,
    description?: string,
    status?: number,
    priority?: number,
    startDate?: string,
    deadline?: string
}
type UpdateTaskThunkType<T> = {
    todolistId: string,
    taskId: string,
    data: T
}
type UpdateTaskThunkAPIType = ThunkAPIType & {
    state: RootState
}