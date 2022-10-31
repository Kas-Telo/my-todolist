import {setAppStatus} from "../../app/bll/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "./error-util";
import {toggleIsAuth} from "../../features/auth/bll/auth-reducer";
import {AnyAction, ThunkDispatch} from "@reduxjs/toolkit";

export const tryCatchConstructionThunkBody = (dispatch:  ThunkDispatch<unknown, unknown, AnyAction>,
                          rejectWithValue: (value: any) => any,
                          resultFromServer: any,
                          returnObject: unknown) => {
    try {
        if (resultFromServer.data.resultCode === 0) {
            dispatch(setAppStatus({status: "success"}))
            return returnObject
        } else {
            dispatch(toggleIsAuth({isAuth: false}))
            handleServerAppError(resultFromServer.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (e) {
        dispatch(toggleIsAuth({isAuth: false}))
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    } finally {
        dispatch(setAppStatus({status: 'idle'}))
    }
}