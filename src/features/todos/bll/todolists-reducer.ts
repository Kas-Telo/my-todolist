import {TodolistResponseDataType} from "../../../api/todolists/todolists-api-types";
import {AppThunk} from "../../../app/bll/store";
import {todolistsAPI} from "../../../api/todolists/todolists-api";
import {RequestStatusType, setAppStatus} from "../../../app/bll/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../assets/utils/error-util";

const initialState = [] as Array<TodolistDomainType>

export const todolistsReducer = (state: TodolistsStateType = initialState, action: TodolistsActionsType): TodolistsStateType => {
    switch (action.type) {
        case "SET_ALL_TODOLISTS": {
            return action.todolists.map(el => ({...el, filter: 'all', entityStatus: 'idle'}))
        }
        case 'REMOVE-TODOLIST': {
            return state.filter(el => el.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(el => el.id === action.id ? {...el, title: action.title} : el)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(el => el.id === action.id ? {...el, filter: action.filter} : el)
        case 'SET-TODOLIST-ENTITY-STATUS':
            return state.map(el => el.id === action.id ? {...el, entityStatus: action.status} : el)
        default:
            return state;
    }
}

//AC's
export const removeTodolistAC = (todolistId: string) =>
    ({type: 'REMOVE-TODOLIST', id: todolistId} as const)
export const addTodolistAC = (todolist: TodolistResponseDataType) =>
    ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistTitleAC = (id: string, title: string) =>
    ({type: 'CHANGE-TODOLIST-TITLE', id: id, title: title} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
    ({type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter} as const)
export const setTodolistEntityStatusAC = (id: string, status: RequestStatusType) =>
    ({type: 'SET-TODOLIST-ENTITY-STATUS', id, status} as const)
export const setAllTodolistsAC = (todolists: Array<TodolistResponseDataType>) =>
    ({type: 'SET_ALL_TODOLISTS', todolists} as const)

//TC's
export const getTodolists = (): AppThunk => dispatch => {
    dispatch(setAppStatus("progress"))
    todolistsAPI.getTodolists()
        .then(res => {
            dispatch(setAllTodolistsAC(res.data))
            dispatch(setAppStatus("success"))
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
        })
        .finally(() => {
            dispatch(setAppStatus('idle'))
        })
}
export const createTodolist = (title: string): AppThunk => dispatch => {
    dispatch(setAppStatus("progress"))
    todolistsAPI.createTodolist(title)
        .then(res => {
            if (res.data.resultCode === 0) {
                res.data.data && dispatch(addTodolistAC(res.data.data.item))
                dispatch(setAppStatus('success'))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
        })
        .finally(() => dispatch(setAppStatus('idle')))
}
export const updateTodolistTitle = (title: string, todolistId: string): AppThunk => dispatch => {
    dispatch(setAppStatus("progress"))
    dispatch(setTodolistEntityStatusAC(todolistId, 'progress'))
    todolistsAPI.updateTodolistTitle(title, todolistId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(changeTodolistTitleAC(todolistId, title))
                dispatch(setAppStatus("success"))
                dispatch(setTodolistEntityStatusAC(todolistId, 'success'))
            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(setTodolistEntityStatusAC(todolistId, 'failed'))
            }
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
            dispatch(setTodolistEntityStatusAC(todolistId, 'failed'))
        })
        .finally(() => {
            dispatch(setAppStatus('idle'))
            dispatch(setTodolistEntityStatusAC(todolistId, 'idle'))
        })
}
export const deleteTodolist = (todolistId: string): AppThunk => dispatch => {
    dispatch(setAppStatus("progress"))
    dispatch(setTodolistEntityStatusAC(todolistId, 'progress'))
    todolistsAPI.deleteTodolist(todolistId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC(todolistId))
                dispatch(setAppStatus("success"))
            } else {
                handleServerAppError(res.data, dispatch)
                dispatch(setTodolistEntityStatusAC(todolistId, 'failed'))
            }
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
            dispatch(setTodolistEntityStatusAC(todolistId, 'failed'))
        })
        .finally(() => {
            dispatch(setAppStatus('idle'))
        })
}

//types
type TodolistsStateType = typeof initialState
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistResponseDataType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
//ActionTypes
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type SetAllTodolists = ReturnType<typeof setAllTodolistsAC>
export type TodolistsActionsType =
    | AddTodolistActionType
    | RemoveTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof setTodolistEntityStatusAC>
    | SetAllTodolists


