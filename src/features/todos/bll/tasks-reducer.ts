import {addTodolist, removeTodolist, setAllTodolists,} from './todolists-reducer';
import {TaskResponseDataType, TasksResponseType, UpdateTaskRequestType} from "../../../api/tasks/tasks-api-types";
import {AppDispatch, RootState} from "../../../app/bll/store";
import {tasksAPI} from "../../../api/tasks/tasks-api";
import {setAppStatus} from "../../../app/bll/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../assets/utils/error-util";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {} as { [key: string]: TasksResponseType }

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        removeTaskAC: (state, action: PayloadAction<{ todolistId: string, taskId: string }>) => {
            const index = state[action.payload.todolistId].items.findIndex(el => el.id === action.payload.taskId)
            state[action.payload.todolistId].items.splice(index, 1)
            state[action.payload.todolistId].totalCount = state[action.payload.todolistId].totalCount - 1
        },
        addTaskAC: (state, action: PayloadAction<{ todolistId: string, task: TaskResponseDataType }>) => {
            state[action.payload.todolistId].items.unshift(action.payload.task)
            state[action.payload.todolistId].totalCount = state[action.payload.todolistId].totalCount + 1
        },
        updateTaskAC: (state, action: PayloadAction<{ todolistId: string, taskId: string, task: TaskResponseDataType }>) => {
            const index = state[action.payload.todolistId].items.findIndex(el => el.id === action.payload.taskId)
            state[action.payload.todolistId].items[index] = action.payload.task
        },
        setAllTasksAC: (state, action: PayloadAction<{ todolistId: string, responseTasks: TasksResponseType }>) => {
            state[action.payload.todolistId] = action.payload.responseTasks
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setAllTodolists, (state, action) => {
            action.payload.todolists.forEach(el => {
                    state[el.id] = {
                        items: [],
                        totalCount: 0,
                        error: null
                    }
                }
            )
        });
        builder.addCase(addTodolist, (state, action) => {
            state[action.payload.todolist.id] = {items: [], totalCount: 0, error: null}
        });
        builder.addCase(removeTodolist, (state, action) => {
            delete state[action.payload.todolistId]
        });
    }
})

export const tasksReducer = slice.reducer
export const {
    removeTaskAC,
    addTaskAC,
    updateTaskAC,
    setAllTasksAC
} = slice.actions

//TC's
export const getTasks = (todolistId: string) => (dispatch: AppDispatch) => {
    dispatch(setAppStatus({status: "progress"}))
    tasksAPI.getTasks(todolistId)
        .then(res => {
            dispatch(setAllTasksAC({todolistId: todolistId, responseTasks: res.data}))
            dispatch(setAppStatus({status: "success"}))
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
        })
        .finally(() => {
            dispatch(setAppStatus({status: 'idle'}))
        })
}
export const createTask = (todolistId: string, title: string) => (dispatch: AppDispatch) => {
    dispatch(setAppStatus({status: "progress"}))
    tasksAPI.createTask(todolistId, title)
        .then(res => {
            console.log(res)
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC({todolistId: todolistId, task: res.data.data.item}))
                dispatch(setAppStatus({status: "success"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
        })
        .finally(() => dispatch(setAppStatus({status: 'idle'})))
}
export const updateTask = (todolistId: string, taskId: string, updateData: UpdateTaskDomainModelType) => (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(setAppStatus({status: "progress"}))
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
                    dispatch(updateTaskAC({todolistId: todolistId, taskId: taskId, task: res.data.data.item}))
                    dispatch(setAppStatus({status: "success"}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(e => {
                handleServerNetworkError(e, dispatch)
            })
            .finally(() => dispatch(setAppStatus({status: 'idle'})))

    } else {
        handleServerNetworkError('task not found', dispatch)
    }
}
export const deleteTask = (todolistId: string, taskId: string) => (dispatch: AppDispatch) => {
    dispatch(setAppStatus({status: "progress"}))
    tasksAPI.deleteTask(todolistId, taskId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC({todolistId: todolistId, taskId: taskId}))
                dispatch(setAppStatus({status: "success"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
        })
        .finally(() => dispatch(setAppStatus({status: 'idle'})))
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
