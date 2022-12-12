import {slice as tasksSlice} from './bll/tasks-slice'
import {slice as todolistsSlice} from './bll/todolists-slice'
import {asyncActions as tasksAsyncAction} from './bll/tasks-thunks'
import {asyncActions as todosAsyncAction} from './bll/todolists-thunks'
import * as todosSelectors from './bll/selectors'

const tasksReducer = tasksSlice.reducer
const todolistsReducer = todolistsSlice.reducer

const todosActions = {
    ...todosAsyncAction,
    ...todolistsSlice.actions
}

const tasksActions = {
    ...tasksAsyncAction,
    ...tasksSlice.actions
}

export {
    tasksReducer,
    todolistsReducer,
    tasksActions,
    todosActions,
    todosSelectors,
}