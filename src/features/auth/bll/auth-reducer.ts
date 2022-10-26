import {authAPI} from "../../../api/auth/auth-api";
import {AppDispatch} from "../../../app/bll/store";
import {LoginRequestType, UserResponseDataType} from "../../../api/auth/auth-api-types";
import {setAppStatus} from "../../../app/bll/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../assets/utils/error-util";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearData} from "../../todos/bll/todolists-reducer";

const initialState = {
    user: {} as UserResponseDataType,
    isAuth: false,
}

export const getMe = createAsyncThunk(
    'app/initializeApp',
    async ({}, {dispatch, rejectWithValue}) => {
        debugger
        dispatch(setAppStatus({status: 'progress'}))
        const res = await authAPI.getMe()
        try {
            debugger
            if (res.data.resultCode === 0) {
                dispatch(setAppStatus({status: "success"}))
                return {user: res.data.data}
            } else {
                debugger
                dispatch(toggleIsAuth({isAuth: false}))
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (e) {
            debugger
            dispatch(toggleIsAuth({isAuth: false}))
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        } finally {
            dispatch(setAppStatus({status: 'idle'}))
        }
    })

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        toggleIsAuth: (state, action: PayloadAction<{ isAuth: boolean }>) => {
            state.isAuth = action.payload.isAuth
        }
    },
    extraReducers: builder => {
        builder.addCase(getMe.fulfilled, (state, action) => {
            state.isAuth = true
            state.user = action.payload.user
        })
        builder.addCase(getMe.rejected, (state, action) => {
            state.isAuth = false
        })
    }
})

export const authReducer = slice.reducer
export const {toggleIsAuth} = slice.actions

//TC's
export const login = (loginData: LoginRequestType) => (dispatch: AppDispatch) => {
    dispatch(setAppStatus({status: 'progress'}))
    authAPI.login(loginData)
        .then(res => {
            if (res.data.resultCode === 0) {
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
            dispatch(clearData({}))
            dispatch(toggleIsAuth({isAuth: false}))
            dispatch(setAppStatus({status: "success"}))
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
        })
        .finally(() => dispatch(setAppStatus({status: 'idle'})))
}
