import {AppDispatch} from "./store";
import {authAPI} from "../../api/auth/auth-api";
import {handleServerAppError, handleServerNetworkError} from "../../assets/utils/error-util";
import {toggleIsAuth} from "../../features/auth/bll/auth-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    isInitialized: false,
    status: 'idle' as RequestStatusType,
    error: '',
}

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        toggleIsInitialized: (state, action: PayloadAction<{value: boolean}>) => {
            state.isInitialized = action.payload.value
        },
        setAppStatus: (state, action: PayloadAction<{status: RequestStatusType}>) => {
            state.status = action.payload.status
        },
        setAppError: (state, action:PayloadAction<{error: string}>) => {
            state.error = action.payload.error
        }
    }
})

export const appReducer = slice.reducer
export const {toggleIsInitialized, setAppStatus, setAppError} = slice.actions

export const initializeApp = () => (dispatch: AppDispatch) => {
    authAPI.getMe()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(toggleIsAuth({isAuth: true}))
            }else {
                handleServerAppError(res.data, dispatch)
                dispatch(toggleIsAuth({isAuth: false}))
            }
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
            dispatch(toggleIsAuth({isAuth: false}))
        })
        .finally(() => dispatch(toggleIsInitialized({value: true})))
}

export type RequestStatusType = 'idle' | 'progress' | 'success' | 'failed'
