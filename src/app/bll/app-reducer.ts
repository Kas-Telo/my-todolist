import {AppDispatch} from "./store";
import {getMe} from "../../features/auth/bll/auth-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    isInitialized: false,
    status: 'idle' as RequestStatusType,
    error: '',
}

export const initializeApp = createAsyncThunk<any, any, { dispatch: AppDispatch }>(
    'app/initializeApp',
    ({}, {dispatch,rejectWithValue}) => {

        const promise = Promise.resolve(dispatch(getMe()))
        promise
            .then(res => {
                debugger
                console.log(promise)
                console.log(res)
                return {}
            })
            .catch(res => {
                debugger
                console.log(res)
                return rejectWithValue({err: 'err'})
            })
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
        builder.addCase(initializeApp.fulfilled, (state, action) => {
            debugger
            state.isInitialized = true
        })
        builder.addCase(initializeApp.rejected, (state, action) => {
            state.isInitialized = true
        })
    }
})

export const appReducer = slice.reducer
export const {setAppStatus, setAppError} = slice.actions


export type RequestStatusType = 'idle' | 'progress' | 'success' | 'failed'
