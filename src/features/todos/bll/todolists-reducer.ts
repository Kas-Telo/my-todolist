import {TodolistResponseDataType} from "../../../api/todolists/todolists-api-types";
import {AppDispatch} from "../../../app/bll/store";
import {todolistsAPI} from "../../../api/todolists/todolists-api";
import {RequestStatusType, setAppStatus} from "../../../app/bll/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../assets/utils/error-util";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = [] as Array<TodolistDomainType>

const slice = createSlice({
    name: 'todolists',
    initialState,
    reducers: {
        removeTodolist: (state, action: PayloadAction<{ todolistId: string }>) => {
            const index = state.findIndex(el => el.id === action.payload.todolistId)
            if (index > -1) state.splice(index, 1)
        },
        addTodolist: (state, action: PayloadAction<{ todolist: TodolistResponseDataType }>) => {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        },
        changeTodolistTitle: (state, action: PayloadAction<{ id: string, title: string }>) => {
            const todolist = state.find(el => el.id === action.payload.id)
            if(todolist) todolist.title = action.payload.title
        },
        changeTodolistFilter: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
            const todolist = state.find(el => el.id === action.payload.id)
            if(todolist) todolist.filter = action.payload.filter
        },
        setTodolistEntityStatus: (state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) => {
            const todolist = state.find(el => el.id === action.payload.id)
            if(todolist) todolist.entityStatus = action.payload.entityStatus
        },
        setAllTodolists: (state, action: PayloadAction<{ todolists: Array<TodolistResponseDataType> }>) => {
            return action.payload.todolists.map(el => ({...el, filter: 'all', entityStatus: 'idle'}))
        },
    }
})

export const todolistsReducer = slice.reducer
export const {
    removeTodolist,
    addTodolist,
    changeTodolistTitle,
    changeTodolistFilter,
    setTodolistEntityStatus,
    setAllTodolists
} = slice.actions

//TC's
export const getTodolists = () => (dispatch: AppDispatch) => {
    dispatch(setAppStatus({status: "progress"}))
    todolistsAPI.getTodolists()
        .then(res => {
            dispatch(setAllTodolists({todolists: res.data}))
            dispatch(setAppStatus({status: "success"}))
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
        })
        .finally(() => {
            dispatch(setAppStatus({status: 'idle'}))
        })
}
export const createTodolist = (title: string) => (dispatch: AppDispatch) => {
    dispatch(setAppStatus({status: "progress"}))
    todolistsAPI.createTodolist(title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTodolist({todolist: res.data.data.item}))
                dispatch(setAppStatus({status: 'success'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
        })
        .finally(() => dispatch(setAppStatus({status: 'idle'})))
}
export const updateTodolistTitle = (title: string, todolistId: string) => (dispatch: AppDispatch) => {
    dispatch(setAppStatus({status: "progress"}))
    dispatch(setTodolistEntityStatus({id:todolistId, entityStatus: 'progress'}))
    todolistsAPI.updateTodolistTitle(title, todolistId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(changeTodolistTitle({ id: todolistId, title}))
                dispatch(setAppStatus({status: "success"}))
                dispatch(setTodolistEntityStatus({id: todolistId, entityStatus: 'success'}))
            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(setTodolistEntityStatus({ id: todolistId, entityStatus: 'failed'}))
            }
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
            dispatch(setTodolistEntityStatus({ id: todolistId, entityStatus: 'failed'}))
        })
        .finally(() => {
            dispatch(setAppStatus({status: 'idle'}))
            dispatch(setTodolistEntityStatus({ id: todolistId, entityStatus: 'idle'}))
        })
}
export const deleteTodolist = (todolistId: string) => (dispatch: AppDispatch) => {
    dispatch(setAppStatus({status: "progress"}))
    dispatch(setTodolistEntityStatus({ id: todolistId, entityStatus: 'progress'}))
    todolistsAPI.deleteTodolist(todolistId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolist({ todolistId}))
                dispatch(setAppStatus({status: "success"}))
            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(setTodolistEntityStatus({ id: todolistId, entityStatus: 'failed'}))
            }
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
            dispatch(setTodolistEntityStatus({ id: todolistId, entityStatus: 'failed'}))
        })
        .finally(() => {
            dispatch(setAppStatus({status: 'idle'}))
        })
}

//types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistResponseDataType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
