import {AppThunk} from "./store";
import {authAPI} from "../../api/auth/auth-api";
import {handleServerAppError, handleServerNetworkError} from "../../assets/utils/error-util";
import {toggleIsAuthAC} from "../../features/auth/bll/auth-reducer";

const initialState = {
    isInitialized: false,
    status: 'idle' as RequestStatusType,
    error: '',
}

export const appReducer = (state: AppStateType = initialState, action: AppActionsType): AppStateType => {
    switch (action.type) {
        case 'TOGGLE_IS_INITIALIZED':
            return {...state, isInitialized: action.value}
        case "SET_APP_STATUS":
            return {...state, status: action.status}
        case 'SET_APP_ERROR':
            return {...state, error: action.error}
        default:
            return state
    }
}

export const toggleIsInitialized = (value: boolean) =>
    ({type: 'TOGGLE_IS_INITIALIZED', value} as const)
export const setAppStatus = (status: RequestStatusType) =>
    ({type: 'SET_APP_STATUS', status} as const)
export const setAppError = (error: string) =>
    ({type: 'SET_APP_ERROR', error} as const)

export const initializeApp = (): AppThunk => dispatch => {
    authAPI.getMe()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(toggleIsAuthAC(true))
            }else {
                handleServerAppError(res.data, dispatch)
                dispatch(toggleIsAuthAC(false))
            }
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
            dispatch(toggleIsAuthAC(false))
        })
        .finally(() => dispatch(toggleIsInitialized(true)))
}

export type AppStateType = typeof initialState
export type RequestStatusType = 'idle' | 'progress' | 'success' | 'failed'
export type AppActionsType =
    | ReturnType<typeof toggleIsInitialized>
    | ReturnType<typeof setAppStatus>
    | ReturnType<typeof setAppError>