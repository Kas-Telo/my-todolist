import { tasksReducer, todolistsReducer } from '../../features/todos'
import { combineReducers } from 'redux'
import { authReducer } from '../../features/auth/'
import thunk from 'redux-thunk'
import { appReducer } from '../index'
import { configureStore } from '@reduxjs/toolkit'

const rootReducer = combineReducers({
  auth: authReducer,
  app: appReducer,
  todolists: todolistsReducer,
  tasks: tasksReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk),
})

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store
