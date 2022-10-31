import {tasksReducer} from '../../features/todos/bll/tasks-reducer';
import {todolistsReducer} from '../../features/todos/bll/todolists-reducer';
import {combineReducers} from 'redux';
import {authReducer} from "../../features/auth/";
import thunk from 'redux-thunk';
import {appReducer} from "./app-reducer";
import {configureStore} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    app: appReducer,
    tasks: tasksReducer,
    todolists: todolistsReducer,
    auth: authReducer,
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk)
} )


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
