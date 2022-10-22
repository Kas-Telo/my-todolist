import {Dispatch} from "redux";
import axios, {AxiosError} from "axios";
import {setAppError, setAppStatus} from "../../app/bll/app-reducer";
import {AppRootActionsType} from "../../app/bll/store";
import {ServerResponseType} from "../../api/api-types";




export const handleServerNetworkError = (e: unknown, dispatch: Dispatch<AppRootActionsType>) => {
    const err = e as Error | AxiosError
    if (axios.isAxiosError(err)) {
        const error = err.response?.data ? err.response?.data.message : err.message
        dispatch(setAppError(error))
        console.warn(error)
    }else {
        dispatch(setAppError(err.message))
    }
    dispatch((setAppStatus('failed')))
}

export const handleServerAppError = (res: ServerResponseType, dispatch: Dispatch<AppRootActionsType>) => {
    if (res.messages.length > 0) {
        dispatch(setAppError(res.messages[0]))
    } else {
        dispatch(setAppError('some error occurred'))
    }
    dispatch((setAppStatus('failed')))
}