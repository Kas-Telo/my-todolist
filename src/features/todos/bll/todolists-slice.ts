import { TodolistResponseDataType } from '../../../api/todolists/todolists-api-types'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  createTodolist,
  deleteTodolist,
  getTodolists,
  updateTodolistTitle,
} from './todolists-thunks'
import { logout } from '../../auth/bll/auth-thunks'
import { RequestStatusType } from '../../../app/types'

const initialState = [] as Array<TodolistDomainType>

export const slice = createSlice({
  name: 'todolists',
  initialState,
  reducers: {
    changeTodolistFilter: (
      state,
      action: PayloadAction<{ id: string; filter: FilterValuesType }>,
    ) => {
      const todolist = state.find((el) => el.id === action.payload.id)
      if (todolist) todolist.filter = action.payload.filter
    },
    setTodolistEntityStatus: (
      state,
      action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>,
    ) => {
      const todolist = state.find((el) => el.id === action.payload.id)
      if (todolist) todolist.entityStatus = action.payload.entityStatus
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, () => {
      return initialState
    })
    builder.addCase(createTodolist.fulfilled, (state, action) => {
      state.unshift({ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' })
    })
    builder.addCase(getTodolists.fulfilled, (state, action) => {
      return action.payload.todolists.map((el: TodolistResponseDataType) => ({
        ...el,
        filter: 'all',
        entityStatus: 'idle',
      }))
    })
    builder.addCase(deleteTodolist.fulfilled, (state, action) => {
      const index = state.findIndex((el) => el.id === action.payload.todolistId)
      if (index > -1) state.splice(index, 1)
    })
    builder.addCase(updateTodolistTitle.fulfilled, (state, action) => {
      const todolist = state.find((el) => el.id === action.payload.id)
      if (todolist) todolist.title = action.payload.title
    })
  },
})

export const { setTodolistEntityStatus } = slice.actions

// types
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistResponseDataType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
