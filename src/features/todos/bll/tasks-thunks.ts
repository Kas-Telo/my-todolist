import {createAsyncThunk} from "@reduxjs/toolkit";
import {setAppStatus} from "../../../app/bll/app-reducer";
import {tasksAPI} from "../../../api/tasks/tasks-api";
import {handleServerAppError, handleServerNetworkError} from "../../../assets/utils/error-util";
import {TaskResponseDataType, UpdateTaskRequestType} from "../../../api/tasks/tasks-api-types";
import {RootState} from "../../../app/bll/store";

//thunks
export const getTasks = createAsyncThunk(
    'tasks/getTasks',
    async (todolistId: string, thunkAPI) => {
        thunkAPI.dispatch(setAppStatus({status: "progress"}))
        const res = await tasksAPI.getTasks(todolistId)
        try {
            thunkAPI.dispatch(setAppStatus({status: "success"}))
        } catch (e) {
            handleServerNetworkError(e, thunkAPI.dispatch)
        } finally {
            thunkAPI.dispatch(setAppStatus({status: 'idle'}))
        }
        return {todolistId: todolistId, responseTasks: res.data}
    })
export const createTask = createAsyncThunk(
    'tasks/createTask',
    async (param: { todolistId: string, title: string }, thunkAPI) => {
        thunkAPI.dispatch(setAppStatus({status: "progress"}))
        const res = await tasksAPI.createTask(param.todolistId, param.title)
        try {
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatus({status: "success"}))
            } else {
                handleServerAppError(res.data, thunkAPI.dispatch)
            }
        } catch (e) {
            handleServerNetworkError(e, thunkAPI.dispatch)
        } finally {
            thunkAPI.dispatch(setAppStatus({status: 'idle'}))
        }
        return {task: res.data.data.item}
    })
export const updateTask = createAsyncThunk<UpdateTaskThunkType<TaskResponseDataType>,
    UpdateTaskThunkType<UpdateTaskDomainModelType>,
    { state: RootState }>(
    'tasks/updateTask',
    async (param: UpdateTaskThunkType<UpdateTaskDomainModelType>, thunkAPI) => {
        thunkAPI.dispatch(setAppStatus({status: "progress"}))
        const currentTask = thunkAPI.getState().tasks[param.todolistId].items.find(el => el.id === param.taskId)
        if (!currentTask) {
            handleServerNetworkError('task not found', thunkAPI.dispatch)
            return thunkAPI.rejectWithValue('task not found')
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
        const res = await tasksAPI.updateTask(param.todolistId, param.taskId, updateModel)
        try {
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatus({status: "success"}))
                return {todolistId: param.todolistId, taskId: param.taskId, data: res.data.data.item}
            } else {
                handleServerAppError(res.data, thunkAPI.dispatch)
                return thunkAPI.rejectWithValue(res.data)
            }
        } catch (e) {
            handleServerNetworkError(e, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(e)
        } finally {
            thunkAPI.dispatch(setAppStatus({status: 'idle'}))
        }
    })
export const deleteTask = createAsyncThunk(
    'tasks/deleteTask',
    async (param: { todolistId: string, taskId: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: "progress"}))
    const res = await tasksAPI.deleteTask(param.todolistId, param.taskId)
    try {
        if (res.data.resultCode === 0) {
            // thunkAPI.dispatch(removeTaskAC({todolistId: todolistId, taskId: taskId}))
            thunkAPI.dispatch(setAppStatus({status: "success"}))
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
        }
    } catch (e) {
        handleServerNetworkError(e, thunkAPI.dispatch)
    } finally {
        thunkAPI.dispatch(setAppStatus({status: 'idle'}))
    }
    return {todolistId: param.todolistId, taskId: param.taskId}
})

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