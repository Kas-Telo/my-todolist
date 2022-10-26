import {addTodolist, clearData, removeTodolist, setAllTodolists,} from './todolists-reducer';
import {TasksResponseType} from "../../../api/tasks/tasks-api-types";
import {createSlice} from "@reduxjs/toolkit";
import {createTask, deleteTask, getTasks, updateTask} from "./tasks-thunks";

const initialState = {} as { [key: string]: TasksResponseType }

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {

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
        builder.addCase(getTasks.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.responseTasks
        });
        builder.addCase(createTask.fulfilled, (state, action) => {
            state[action.payload.task.todoListId].items.unshift(action.payload.task)
            state[action.payload.task.todoListId].totalCount = state[action.payload.task.todoListId].totalCount + 1
        });
        builder.addCase(deleteTask.fulfilled, (state, action) => {
            const index = state[action.payload.todolistId].items.findIndex(el => el.id === action.payload.taskId)
            state[action.payload.todolistId].items.splice(index, 1)
            state[action.payload.todolistId].totalCount = state[action.payload.todolistId].totalCount - 1
        });
        builder.addCase(updateTask.fulfilled, (state, action) => {
            const index = state[action.payload.todolistId].items.findIndex(el => el.id === action.payload.taskId)
            state[action.payload.todolistId].items[index] = action.payload.data
        });
        builder.addCase(clearData, (state, action) => {
            return {}
        })
    }
})

export const tasksReducer = slice.reducer

