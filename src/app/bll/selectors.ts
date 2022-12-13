import { RootState } from '../types'

export const selectIsInitialized = (state: RootState) => state.app.isInitialized
export const selectStatus = (state: RootState) => state.app.status
export const selectError = (state: RootState) => state.app.error