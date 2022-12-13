import axios, { AxiosError } from 'axios'
import { ItemResponseType, ServerResponseType } from '../../api/api-types'
import { appSyncActions } from '../../app/bll/app-sync-actions'
import { AppDispatch } from '../../app/types'
import { LoginResponseDataType, UserResponseDataType } from '../../api/auth/auth-api-types'
import { TodolistResponseDataType } from '../../api/todolists/todolists-api-types'
import { TaskResponseDataType } from '../../api/tasks/tasks-api-types'

const { setAppStatus, setAppError } = appSyncActions

// types
type ThunkAPIType = {
  dispatch: AppDispatch
  rejectWithValue: (arg0: any) => any
}
export const handleAsyncServerNetworkError = (
  e: unknown,
  thunkAPI: ThunkAPIType,
  showError = true,
) => {
  const err = e as Error | AxiosError
  if (showError) {
    thunkAPI.dispatch(
      setAppError(
        axios.isAxiosError(err)
          ? { error: err.response?.data ? err.response?.data.message : err.message }
          : { error: err.message ? err.message : 'Some error occurred' },
      ),
    )
  }
  thunkAPI.dispatch(setAppStatus({ status: 'failed' }))
  return thunkAPI.rejectWithValue({ errors: [err.message], fieldsErrors: undefined })
}

export const handleAsyncServerAppError = (
  res: ServerResponseType<
    | UserResponseDataType
    | LoginResponseDataType
    | ItemResponseType<TodolistResponseDataType | TaskResponseDataType>
    | Record<string, never>
  >,
  thunkAPI: ThunkAPIType,
  showError = true,
) => {
  if (showError) {
    thunkAPI.dispatch(
      appSyncActions.setAppError(
        res.messages.length ? { error: res.messages[0] } : { error: 'some error occurred' },
      ),
    )
  }
  thunkAPI.dispatch(setAppStatus({ status: 'failed' }))
  return thunkAPI.rejectWithValue({ errors: res.messages, fieldsErrors: res.fieldsErrors })
}
