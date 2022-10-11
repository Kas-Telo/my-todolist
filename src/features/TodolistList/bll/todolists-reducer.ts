import {TodolistResponseDataType} from "../../../api/todolists/todolists-api-types";
import {AppThunk} from "../../../app/bll/store";
import {todolistsAPI} from "../../../api/todolists/todolists-api";
import {toggleIsInitialized} from "../../../app/bll/app-reducer";
import {getTasks} from "./tasks-reducer";

const initialState = [] as Array<TodolistDomainType>

export const todolistsReducer = (state: TodolistsStateType = initialState, action: TodolistsActionsType): TodolistsStateType => {
    switch (action.type) {
        case "SET_ALL_TODOLISTS": {
            return action.todolists.map(el => ({...el, filter: 'all'}))
        }
        case 'REMOVE-TODOLIST': {
            return state.filter(el => el.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [{
                ...action.todolist,
                filter: 'all',
            }, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(el => el.id === action.id ? {...el, title: action.title} : el)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(el => el.id === action.id ? {...el, filter: action.filter} : el)
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
export const setAllTodolistsAC = (todolists: Array<TodolistResponseDataType>) =>
    ({type: 'SET_ALL_TODOLISTS', todolists} as const)


//TC's
export const getTodolists = (): AppThunk => dispatch => {
    todolistsAPI.getTodolists()
        .then(res => {
            dispatch(setAllTodolistsAC(res.data))
            res.data.forEach(el => {
                dispatch(getTasks(el.id))
            })
        })
        .then(() => {
            dispatch(toggleIsInitialized(true))
        })
        .catch(e => alert(e))
}
export const createTodolist = (title: string): AppThunk => dispatch => {
    todolistsAPI.createTodolist(title)
        .then(res => {
            res.data.data && dispatch(addTodolistAC(res.data.data.item))
        })
        .catch(e => {
            console.log(e)
            alert(e)
        })
}
export const updateTodolistTitle = (title: string, todolistId: string): AppThunk => dispatch => {
    todolistsAPI.updateTodolistTitle(title, todolistId)
        .then(() => {
            dispatch(changeTodolistTitleAC(todolistId, title))
        })
        .catch(e => alert(e))
}
export const deleteTodolist = (todolistId: string): AppThunk => dispatch => {
    todolistsAPI.deleteTodolist(todolistId)
        .then(() => {
            dispatch(removeTodolistAC(todolistId))
        })
        .catch(e => alert(e))
}

//types
type TodolistsStateType = typeof initialState
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistResponseDataType & {
    filter: FilterValuesType
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
    | SetAllTodolists


