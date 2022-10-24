import {authAPI} from "../../../api/auth/auth-api";
import {AppDispatch} from "../../../app/bll/store";
import {LoginRequestType, UserResponseDataType} from "../../../api/auth/auth-api-types";
import {setAppStatus} from "../../../app/bll/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../assets/utils/error-util";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    user: {} as UserResponseDataType,
    isAuth: false,
}

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<{ user: UserResponseDataType }>) => {
            state.user = action.payload.user
        },
        toggleIsAuth: (state, action: PayloadAction<{ isAuth: boolean }>) => {
            state.isAuth = action.payload.isAuth
        }
    }
})

export const authReducer = slice.reducer
export const {setUserData, toggleIsAuth} = slice.actions

//TC's
export const login = (loginData: LoginRequestType) => (dispatch: AppDispatch) => {
    dispatch(setAppStatus({status: 'progress'}))
    authAPI.login(loginData)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(toggleIsAuth({isAuth: true}))
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
export const logout = () => (dispatch: AppDispatch) => {
    dispatch(setAppStatus({status: 'progress'}))
    authAPI.logout()
        .then(() => {
            dispatch(toggleIsAuth({isAuth: false}))
            dispatch(setAppStatus({status: "success"}))
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
        })
        .finally(() => dispatch(setAppStatus({status: 'idle'})))
}
export const getMe = () => (dispatch: AppDispatch) => {
    dispatch(setAppStatus({status: 'progress'}))
    authAPI.getMe()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(toggleIsAuth({isAuth: true}))
                dispatch(setUserData({user: res.data.data}))
                dispatch(setAppStatus({status: "success"}))
            } else {
                dispatch(toggleIsAuth({isAuth: false}))
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(e => {
            dispatch(toggleIsAuth({isAuth: false}))
            handleServerNetworkError(e, dispatch)
        })
        .finally(() => dispatch(setAppStatus({status: 'idle'})))
}