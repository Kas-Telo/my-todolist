import {UserResponseDataType} from "../../../api/auth/auth-api-types";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {getMe} from "./auth-thunks";

const initialState = {
    user: {} as UserResponseDataType,
    isAuth: false,
}

export const slice = createSlice({
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
    }
})

// export const authReducer = slice.reducer
export const {toggleIsAuth} = slice.actions

//TC's


