import axios, {AxiosError} from "axios";
import {setAppError, setAppStatus} from "../../app/bll/app-reducer";
import {ServerResponseType} from "../../api/api-types";
import {Dispatch} from "redux";


export const handleServerNetworkError = (e: unknown, dispatch: Dispatch) => {
    const err = e as Error | AxiosError
    if (axios.isAxiosError(err)) {
        const error = err.response?.data ? err.response?.data.message : err.message
        dispatch(setAppError({error}))
        console.warn(error)
    }else {
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