import {AddTodolistActionType, RemoveTodolistActionType, SetAllTodolists} from './todolists-reducer';
import {TaskResponseDataType, TasksResponseType, UpdateTaskRequestType} from "../../../api/tasks/tasks-api-types";
import {AppThunk} from "../../../app/bll/store";
import {tasksAPI} from "../../../api/tasks/tasks-api";
import {setAppStatus} from "../../../app/bll/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../assets/utils/error-util";

const initialState = {} as {[key: string]: TasksResponseType}

export const tasksReducer = (state: TasksStateType = initialState, action: TasksActionsType): TasksStateType => {
    switch (action.type) {
        case "SET_ALL_TODOLISTS": {
            let copyState = {...state}
            action.todolists.forEach(el => {
                    copyState = {
                        ...copyState,
                        [el.id]: {
                            items: [],
                            totalCount: 0,
                            error: null
                        }
                    }
                }
            )
            return copyState
        }
        case "SET_TASKS":
            return {...state, [action.todolistId]: {...action.responseTasks}}
        case 'REMOVE-TASK':
            return {
                ...state,
                [action.todolistId]:
                    {
                        ...state[action.todolistId],
                        items: state[action.todolistId]?.items.filter(el => el.id !== action.taskId),
                        totalCount: state[action.todolistId].totalCount - 1
                    }
            }
        case 'ADD-TASK':
            return {
                ...state,
                [action.todolistId]: {
                    ...state[action.todolistId],
                    items: [action.task, ...state[action.todolistId].items],
                    totalCount: state[action.todolistId].totalCount + 1
                }
            }
        case 'UPDATE_TASK':
            return {
                ...state,
                [action.todolistId]:
                    {
                        ...state[action.todolistId],
                        items: state[action.todolistId]?.items.map(el => el.id === action.taskId
                            ? action.task
                            : el)
                    }
            }
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: {items: [], totalCount: 0, error: null}}
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        default:
            return state;
    }
}

//AC's
export const removeTaskAC = (todolistId: string, taskId: string,) =>
    ({type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId} as const)
export const addTaskAC = (todolistId: string, task: TaskResponseDataType) =>
    ({type: 'ADD-TASK', todolistId, task} as const)
export const updateTaskAC = (todolistId: string, taskId: string, task: TaskResponseDataType) =>
    ({type: 'UPDATE_TASK', todolistId, taskId, task} as const)
export const setAllTasksAC = (todolistId: string, responseTasks: TasksResponseType) =>
    ({type: 'SET_TASKS', todolistId, responseTasks} as const)

//TC's
export const getTasks = (todolistId: string): AppThunk => dispatch => {
    dispatch(setAppStatus("progress"))
    tasksAPI.getTasks(todolistId)
        .then(res => {
            dispatch(setAllTasksAC(todolistId, res.data))
            dispatch(setAppStatus("success"))
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
        })
        .finally(() => {
            dispatch(setAppStatus('idle'))
        })
}
export const createTask = (todolistId: string, title: string): AppThunk => dispatch => {
    dispatch(setAppStatus("progress"))
    tasksAPI.createTask(todolistId, title)
        .then(res => {
            console.log(res)
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC(todolistId, res.data.data.item))
                dispatch(setAppStatus("success"))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
        })
        .finally(() => dispatch(setAppStatus('idle')))
}
export const updateTask = (todolistId: string, taskId: string, updateData: UpdateTaskDomainModelType): AppThunk => (dispatch, getState) => {
    dispatch(setAppStatus("progress"))
    const currentTask = getState().tasks[todolistId].items.find(el => el.id === taskId)
    if (currentTask) {
        let updateModel: UpdateTaskRequestType = {
            title: currentTask.title,
            description: currentTask.description,
            status: currentTask.status,
            priority: currentTask.priority,
            startDate: currentTask.startDate,
            deadline: currentTask.deadline,
            ...updateData
        }
        tasksAPI.updateTask(todolistId, taskId, updateModel)
            .then(res => {
                if (res.data.resultCode === 0) {
                    dispatch(updateTaskAC(todolistId, taskId, res.data.data.item))
                    dispatch(setAppStatus("success"))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(e => {
                handleServerNetworkError(e, dispatch)
            })
            .finally(() => dispatch(setAppStatus('idle')))

    }else{
        handleServerNetworkError('task not found', dispatch)
    }
}
export const deleteTask = (todolistId: string, taskId: string): AppThunk => dispatch => {
    dispatch(setAppStatus("progress"))
    tasksAPI.deleteTask(todolistId, taskId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC(todolistId, taskId))
                dispatch(setAppStatus("success"))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
        })
        .finally(() => dispatch(setAppStatus('idle')))
}

//types
export type TasksStateType = typeof initialState
export type UpdateTaskDomainModelType = {
    title?: string,
    description?: string,
    status?: number,
    priority?: number,
    startDate?: string,
    deadline?: string
}
export type TasksActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetAllTodolists
    | ReturnType<typeof setAllTasksAC>
