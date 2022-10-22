import {authAPI} from "../../../api/auth/auth-api";
import {AppThunk} from "../../../app/bll/store";
import {LoginRequestType, UserResponseDataType} from "../../../api/auth/auth-api-types";
import {setAppStatus} from "../../../app/bll/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../../assets/utils/error-util";

const initialState = {
    user: {} as UserDomainType,
    isAuth: false,
}

export const authReducer = (state: AuthStateType = initialState, action: AuthActionsType): AuthStateType => {
    switch (action.type) {
        case "SET_USER_DATA":
            return {...state, user: action.user}
        case "TOGGLE_IS_AUTH":
            return {...state, isAuth: action.isAuth}
        default:
            return state
    }
}

//AC's
export const setUserDataAC = (user: UserResponseDataType) => ({type: 'SET_USER_DATA', user} as const)
export const toggleIsAuthAC = (isAuth: boolean) => ({type: 'TOGGLE_IS_AUTH', isAuth} as const)

//TC's
export const login = (loginData: LoginRequestType): AppThunk => dispatch => {
    dispatch(setAppStatus('progress'))
    authAPI.login(loginData)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(toggleIsAuthAC(true))
                dispatch(setAppStatus("success"))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
        })
        .finally(() => dispatch(setAppStatus('idle')))
}
export const logout = (): AppThunk => dispatch => {
    dispatch(setAppStatus('progress'))
    authAPI.logout()
        .then(() => {
            dispatch(toggleIsAuthAC(false))
            dispatch(setAppStatus("success"))
        })
        .catch(e => {
            handleServerNetworkError(e, dispatch)
        })
        .finally(() => dispatch(setAppStatus('idle')))
}
export const getMe = (): AppThunk => dispatch => {
    dispatch(setAppStatus('progress'))
    authAPI.getMe()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(toggleIsAuthAC(true))
                dispatch(setUserDataAC(res.data.data))
                dispatch(setAppStatus("success"))
            } else {
                dispatch(toggleIsAuthAC(false))
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(e => {
            dispatch(toggleIsAuthAC(false))
            handleServerNetworkError(e, dispatch)
        })
        .finally(() => dispatch(setAppStatus('idle')))
}

//types
type AuthStateType = typeof initialState
export type AuthActionsType =
    | ReturnType<typeof setUserDataAC>
    | ReturnType<typeof toggleIsAuthAC>
type UserDomainType = {
    id: number
    login: string
    email: string
}


