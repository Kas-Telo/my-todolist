import axios, {AxiosError} from "axios";
import {setAppError, setAppStatus} from "../../app/bll/app-reducer";
import {ServerResponseType} from "../../api/api-types";
import {Dispatch} from "redux";
import {toggleIsAuth} from "../../features/auth/bll/auth-reducer";
import {ThunkAPIType} from "../../features/auth/bll/auth-thunks";


export const handleServerNetworkError = (e: unknown, dispatch: Dispatch) => {
    const err = e as Error | AxiosError
    if (axios.isAxiosError(err)) {
        const error = err.response?.data ? err.response?.data.message : err.message
        dispatch(setAppError({error}))
        if (err.response?.status === 401) {
            dispatch(toggleIsAuth({isAuth: false}))
        }
        console.warn(error)
    } else {
        dispatch(setAppError({error: err.message}))
    }
    dispatch((setAppStatus({status: 'failed'})))
}

export const handleServerAppError = (res: ServerResponseType, dispatch: Dispatch) => {
    if (res.messages.length > 0) {
        dispatch(setAppError({error: res.messages[0]}))
    } else {
        dispatch(setAppError({error: 'some error occurred'}))
    }
    dispatch((setAppStatus({status: 'failed'})))
}

export const handleAsyncServerNetworkError = (e: unknown, thunkAPI: ThunkAPIType) => {
    const err = e as Error | AxiosError
    if (axios.isAxiosError(err)) {
        const error = err.response?.data ? err.response?.data.message : err.message
        thunkAPI.dispatch(setAppError({error}))
        if (err.response?.status === 401) {
            thunkAPI.dispatch(toggleIsAuth({isAuth: false}))
        }
        console.warn(error)
    } else {
        thunkAPI.dispatch(setAppError({error: err.message}))
    }
    thunkAPI.dispatch((setAppStatus({status: 'failed'})))
    return thunkAPI.rejectWithValue(err)
}

export const handleAsyncServerAppError = (res: ServerResponseType, thunkAPI: ThunkAPIType) => {
    let err = {error: 'some error occurred'}
    if (res.messages.length > 0) {
        err = {error: res.messages[0]}
        thunkAPI.dispatch(setAppError(err))
    } else {
        thunkAPI.dispatch(setAppError(err))
    }
    thunkAPI.dispatch((setAppStatus({status: 'failed'})))
    return thunkAPI.rejectWithValue(err)
}