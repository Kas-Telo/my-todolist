import {AppDispatch} from "./store";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {getMe} from "../../features/auth/bll/auth-thunks";

const initialState = {
    isInitialized: false,
    status: 'idle' as RequestStatusType,
    error: '',
}

export const initializeApp = createAsyncThunk<any, any, { dispatch: AppDispatch }>(
    'app/initializeApp',
    async (param, {dispatch}) => {
        await dispatch(getMe())
        dispatch(setAppError({error: ''}))
        return {}
    })


const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setAppError: (state, action: PayloadAction<{ error: string }>) => {
            state.error = action.payload.error
        }
    },
    extraReducers: builder => {
        builder.addCase(initializeApp.fulfilled, (state) => {
            state.isInitialized = true
        })
    }
})

export const appReducer = slice.reducer
export const {setAppStatus, setAppError} = slice.actions


export type RequestStatusType = 'idle' | 'progress' | 'success' | 'failed'
