import { createAction } from '@reduxjs/toolkit'
import { RequestStatusType } from '../types'

const setAppStatus = createAction<{ status: RequestStatusType }>('appActions/setAppStatus')
const setAppError = createAction<{ error: string }>('appActions/setAppError')

export const appSyncActions = {
  setAppStatus,
  setAppError,
}