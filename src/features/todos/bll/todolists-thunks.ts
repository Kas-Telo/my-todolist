import {createAsyncThunk} from "@reduxjs/toolkit";
import {setAppStatus} from "../../../app/bll/app-reducer";
import {todolistsAPI} from "../../../api/todolists/todolists-api";
import {getTasks} from "./tasks-thunks";
import {handleServerAppError, handleServerNetworkError} from "../../../assets/utils/error-util";
import {setTodolistEntityStatus} from "./todolists-reducer";

export const createTodolist = createAsyncThunk(
    'app/createTodolist',
    async (param: { title: string }, thunkAPI) => {
        thunkAPI.dispatch(setAppStatus({status: 'progress'}))
        try {
            const res = await todolistsAPI.createTodolist(param.title)
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatus({status: 'success'}))
                return {todolist: res.data.data.item}
            } else {
                handleServerAppError(res.data, thunkAPI.dispatch)
                return thunkAPI.rejectWithValue(null)
            }
        } catch (e) {
            handleServerNetworkError(e, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(null)
        } finally {
            thunkAPI.dispatch(setAppStatus({status: 'idle'}))
        }
    }
)
export const getTodolists = createAsyncThunk(
    'app/getTodolists',
    async (param, thunkAPI) => {
        thunkAPI.dispatch(setAppStatus({status: 'progress'}))
        try {
            const res = await todolistsAPI.getTodolists()
            res.data.forEach(el => {
                thunkAPI.dispatch(getTasks(el.id))
            })
            thunkAPI.dispatch(setAppStatus({status: "success"}))
            return {todolists: res.data}
        } catch (e) {
            handleServerNetworkError(e, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(null)
        } finally {
            thunkAPI.dispatch(setAppStatus({status: 'idle'}))
        }
    }
)
export const deleteTodolist = createAsyncThunk(
    'app/deleteTodolist',
    async (param: { id: string }, thunkAPI) => {
        thunkAPI.dispatch(setAppStatus({status: 'progress'}))
        thunkAPI.dispatch(setTodolistEntityStatus({id: param.id, entityStatus: 'progress'}))
        try {
            const res = await todolistsAPI.deleteTodolist(param.id)
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatus({status: "success"}))
                return {todolistId: param.id}
            } else {
                handleServerAppError(res.data, thunkAPI.dispatch)
                thunkAPI.dispatch(setTodolistEntityStatus({id: param.id, entityStatus: 'failed'}))
                return thunkAPI.rejectWithValue(null)
            }
        } catch (e) {
            handleServerNetworkError(e, thunkAPI.dispatch)
            thunkAPI.dispatch(setTodolistEntityStatus({id: param.id, entityStatus: 'failed'}))
            return thunkAPI.rejectWithValue(null)
        } finally {
            thunkAPI.dispatch(setAppStatus({status: 'idle'}))
        }
    }
)
export const updateTodolistTitle = createAsyncThunk(
    'app/updateTodolistTitle',
    async (param: { title: string, id: string }, thunkAPI) => {
        thunkAPI.dispatch(setAppStatus({status: 'progress'}))
        thunkAPI.dispatch(setTodolistEntityStatus({id: param.id, entityStatus: 'progress'}))
        try {
            const res = await todolistsAPI.updateTodolistTitle(param.title, param.id)
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatus({status: "success"}))
                thunkAPI.dispatch(setTodolistEntityStatus({id: param.id, entityStatus: 'success'}))
                return {id: param.id, title: param.title}
            } else {
                handleServerAppError(res.data, thunkAPI.dispatch)
                thunkAPI.dispatch(setTodolistEntityStatus({id: param.id, entityStatus: 'failed'}))
                return thunkAPI.rejectWithValue(null)
            }
        } catch (e) {
            handleServerNetworkError(e, thunkAPI.dispatch)
            thunkAPI.dispatch(setTodolistEntityStatus({id: param.id, entityStatus: 'failed'}))
            return thunkAPI.rejectWithValue(null)
        } finally {
            thunkAPI.dispatch(setAppStatus({status: 'idle'}))
            thunkAPI.dispatch(setTodolistEntityStatus({id: param.id, entityStatus: 'idle'}))
        }
    }
)