import { RootState } from '../../../app/types'

export const selectTasks = (state: RootState) => state.tasks
export const selectTodos = (state: RootState) => state.todolists