import {TasksActionsType, tasksReducer} from '../../features/TodolistList/bll/tasks-reducer';
import {TodolistsActionsType, todolistsReducer} from '../../features/TodolistList/bll/todolists-reducer';
import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import {AuthActionsType, authReducer} from "../../features/auth/bll/auth-reducer";
import {TypedUseSelectorHook, useSelector} from "react-redux";
import thunk, {ThunkAction, ThunkDispatch} from 'redux-thunk';
import {AppActionsType, appReducer} from "./app-reducer";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    app: appReducer,
    tasks: tasksReducer,
    todolists: todolistsReducer,
    auth: authReducer,
})
// непосредственно создаём store
declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>
type AppRootActionsType = TodolistsActionsType | TasksActionsType | AuthActionsType | AppActionsType

export const useAppDispatch = store.dispatch as ThunkDispatch<AppRootStateType, unknown, AppRootActionsType>
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppRootActionsType>

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
