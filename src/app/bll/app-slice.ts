import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getMe} from "../../features/auth/bll/auth-thunks";
import {appSyncActions} from "./app-sync-actions";
import {AppDispatch, RequestStatusType} from "../types";

const initialState = {
    isInitialized: false,
    status: 'idle' as RequestStatusType,
    error: '',
}

export const initializeApp = createAsyncThunk<any, any, { dispatch: AppDispatch }>(
    'app/initializeApp',
    async (param, {dispatch}) => {
        await dispatch(getMe({}))
        return {}
    })

export const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(initializeApp.fulfilled, (state) => {
            state.isInitialized = true
        })
        builder.addCase(appSyncActions.setAppStatus, (state, action) => {
            state.status = action.payload.status
        })
        builder.addCase(appSyncActions.setAppError, (state, action) => {
            state.error = action.payload.error
        })
    }
})

export const asyncActions = {
    initializeApp
}
