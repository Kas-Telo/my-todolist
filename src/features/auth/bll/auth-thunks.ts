import {createAsyncThunk} from "@reduxjs/toolkit";
import {authAPI} from "../../../api/auth/auth-api";
import {handleAsyncServerAppError, handleAsyncServerNetworkError,} from "../../../assets/utils/error-util";
import {LoginRequestType} from "../../../api/auth/auth-api-types";
import {toggleIsAuth} from "./auth-slice";
import {appSyncActions} from "../../../app/bll/app-sync-actions";
import {ThunkAPIType} from "../../../app/types";

const {setAppStatus} = appSyncActions

export const getMe = createAsyncThunk<any, any, ThunkAPIType>(
    'app/getMe',
    async (param = {}, thunkAPI) => {
        thunkAPI.dispatch(setAppStatus({status: 'progress'}))
        try {
            const res = await authAPI.getMe()
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatus({status: "success"}))
                return {user: res.data.data}
            } else {
                return handleAsyncServerAppError(res.data, thunkAPI)
            }
        } catch (e) {
            return handleAsyncServerNetworkError(e, thunkAPI)
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
                thunkAPI.dispatch(getMe({}))
                thunkAPI.dispatch(setAppStatus({status: "success"}))
                return {}
            } else {
                return handleAsyncServerAppError(res.data, thunkAPI, false)
            }
        } catch (e) {
            return handleAsyncServerNetworkError(e, thunkAPI)
        } finally {
            thunkAPI.dispatch(setAppStatus({status: 'idle'}))
        }
    })
export const logout = createAsyncThunk<any, any, ThunkAPIType>(
    'app/logout',
    async (param, thunkAPI) => {
        thunkAPI.dispatch(setAppStatus({status: 'progress'}))
        try {
            await authAPI.logout()
            thunkAPI.dispatch(toggleIsAuth({isAuth: false}))
            thunkAPI.dispatch(setAppStatus({status: "success"}))
            return {}
        } catch (e) {
            return handleAsyncServerNetworkError(e, thunkAPI)
        } finally {
            thunkAPI.dispatch(setAppStatus({status: 'idle'}))
        }
    })

export const asyncActions = {
    login,
    logout,
    getMe
}

