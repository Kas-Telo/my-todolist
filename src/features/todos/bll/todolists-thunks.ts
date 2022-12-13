import { createAsyncThunk } from '@reduxjs/toolkit'
import { todolistsAPI } from '../../../api/todolists/todolists-api'
import { getTasks } from './tasks-thunks'
import {
  handleAsyncServerAppError,
  handleAsyncServerNetworkError,
} from '../../../assets/utils/error-util'
import { setTodolistEntityStatus } from './todolists-slice'
import { appSyncActions } from '../../../app/bll/app-sync-actions'
import { ThunkAPIType } from '../../../app/types'
import { formattedTitle } from '../../../assets/utils/title-formatting'

const { setAppStatus } = appSyncActions

export const createTodolist = createAsyncThunk<any, any, ThunkAPIType>(
  'app/createTodolist',
  async (param: { title: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({ status: 'progress' }))
    try {
      const res = await todolistsAPI.createTodolist(param.title)
      if (res.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatus({ status: 'success' }))
        return { todolist: res.data.data.item }
      } else {
        return handleAsyncServerAppError(res.data, thunkAPI)
      }
    } catch (e) {
      return handleAsyncServerNetworkError(e, thunkAPI)
    } finally {
      thunkAPI.dispatch(setAppStatus({ status: 'idle' }))
    }
  },
)
export const getTodolists = createAsyncThunk<any, any, ThunkAPIType>(
  'app/getTodolists',
  async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({ status: 'progress' }))
    try {
      const res = await todolistsAPI.getTodolists()
      res.data.forEach((el) => {
        thunkAPI.dispatch(getTasks({ todolistId: el.id }))
      })
      thunkAPI.dispatch(setAppStatus({ status: 'success' }))
      const todos = res.data.map((el) => ({ ...el, title: formattedTitle(el.title) }))
      return { todolists: todos }
    } catch (e) {
      return handleAsyncServerNetworkError(e, thunkAPI)
    } finally {
      thunkAPI.dispatch(setAppStatus({ status: 'idle' }))
    }
  },
)
export const deleteTodolist = createAsyncThunk<any, any, ThunkAPIType>(
  'app/deleteTodolist',
  async (param: { id: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({ status: 'progress' }))
    thunkAPI.dispatch(setTodolistEntityStatus({ id: param.id, entityStatus: 'progress' }))
    try {
      const res = await todolistsAPI.deleteTodolist(param.id)
      if (res.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatus({ status: 'success' }))
        return { todolistId: param.id }
      } else {
        thunkAPI.dispatch(setTodolistEntityStatus({ id: param.id, entityStatus: 'failed' }))
        return handleAsyncServerAppError(res.data, thunkAPI)
      }
    } catch (e) {
      thunkAPI.dispatch(setTodolistEntityStatus({ id: param.id, entityStatus: 'failed' }))
      return handleAsyncServerNetworkError(e, thunkAPI)
    } finally {
      thunkAPI.dispatch(setAppStatus({ status: 'idle' }))
    }
  },
)
export const updateTodolistTitle = createAsyncThunk<any, any, ThunkAPIType>(
  'app/updateTodolistTitle',
  async (param: { title: string; id: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({ status: 'progress' }))
    thunkAPI.dispatch(setTodolistEntityStatus({ id: param.id, entityStatus: 'progress' }))
    try {
      const res = await todolistsAPI.updateTodolistTitle(param.title, param.id)
      if (res.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatus({ status: 'success' }))
        thunkAPI.dispatch(setTodolistEntityStatus({ id: param.id, entityStatus: 'success' }))
        return { id: param.id, title: param.title }
      } else {
        thunkAPI.dispatch(setTodolistEntityStatus({ id: param.id, entityStatus: 'failed' }))
        return handleAsyncServerAppError(res.data, thunkAPI)
      }
    } catch (e) {
      thunkAPI.dispatch(setTodolistEntityStatus({ id: param.id, entityStatus: 'failed' }))
      return handleAsyncServerNetworkError(e, thunkAPI)
    } finally {
      thunkAPI.dispatch(setAppStatus({ status: 'idle' }))
      thunkAPI.dispatch(setTodolistEntityStatus({ id: param.id, entityStatus: 'idle' }))
    }
  },
)

export const asyncActions = {
  getTodolists,
  createTodolist,
  updateTodolistTitle,
  deleteTodolist,
}
