import {FieldErrorType} from "../api/api-types";
import {store} from "./bll/store";

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type ThunkAPIType = {
    rejectValue: {
        errors: Array<string>
        fieldsErrors?: Array<FieldErrorType>
    }
    dispatch: AppDispatch
}
export type RequestStatusType = 'idle' | 'progress' | 'success' | 'failed'