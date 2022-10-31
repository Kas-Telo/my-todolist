import {createAsyncThunk} from "@reduxjs/toolkit";
import {setAppStatus} from "../../../app/bll/app-reducer";
import {authAPI} from "../../../api/auth/auth-api";
import {
    handleAsyncServerAppError, handleAsyncServerNetworkError,
    handleServerAppError,
    handleServerNetworkError
} from "../../../assets/utils/error-util";
import {LoginRequestType} from "../../../api/auth/auth-api-types";
import {toggleIsAuth} from "./auth-reducer";
import {AppDispatch} from "../../../app/bll/store";

export const getMe = createAsyncThunk(
    'app/getMe',
    async (param, thunkAPI) => {
        thunkAPI.dispatch(setAppStatus({status: 'progress'}))
        try {
            const res = await authAPI.getMe()
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatus({status: "success"}))
                return {user: res.data.data}
            } else {
                handleServerAppError(res.data, thunkAPI.dispatch)
                return thunkAPI.rejectWithValue(null)
            }
        } catch (e) {
            handleServerNetworkError(e, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(null)
        } finally {
            thunkAPI.dispatch(setAppStatus({status: 'idle'}))
        }
    })
export const login = createAsyncThunk<any, any, ThunkAPIType>(
    'app/login',
    async (loginData: LoginRequestType, thunkAPI) => {
        thunkAPI.dispatch(setAppStatus({status: 'progress'}))
        try {
            const res = await authAPI.login(loginData)
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(getMe())
                thunkAPI.dispatch(setAppStatus({status: "success"}))
                return {}
            } else {
                handleAsyncServerAppError(res.data, thunkAPI)
            }
        } catch (e) {
            handleAsyncServerNetworkError(e, thunkAPI)
        } finally {
            thunkAPI.dispatch(setAppStatus({status: 'idle'}))
        }
    })
export const logout = createAsyncThunk(
    'app/logout',
    async (param, thunkAPI) => {
        thunkAPI.dispatch(setAppStatus({status: 'progress'}))
        try {
            await authAPI.logout()
            thunkAPI.dispatch(toggleIsAuth({isAuth: false}))
            thunkAPI.dispatch(setAppStatus({status: "success"}))
            return {}
        } catch (e) {
            handleServerNetworkError(e, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(null)
        } finally {
            thunkAPI.dispatch(setAppStatus({status: 'idle'}))
        }
    })

export const asyncActions = {
    login,
    logout,
    getMe
}

//types
export type ThunkAPIType = {
    dispatch: AppDispatch,
    rejectWithValue: Function
}