import {authAPI} from "../../../api/auth/auth-api";
import {AppThunk} from "../../../app/bll/store";
import {LoginRequestType, UserResponseDataType} from "../../../api/auth/auth-api-types";

const initialState = {
    user: null as UserDomainType | null,
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
    authAPI.login(loginData)
        .then(res => {
            if (res.resultCode === 0) {
                dispatch(toggleIsAuthAC(true))
            } else {
                alert(res.messages[0])
            }
        })
        .catch(e => alert(e))
}
export const logout = (): AppThunk => dispatch => {
    authAPI.logout()
        .then(() => dispatch(toggleIsAuthAC(false)))
        .catch(e => alert(e))
}
export const getMe = (): AppThunk => dispatch => {
    authAPI.getMe()
        .then(res => {
            if (res.resultCode === 0) {
                dispatch(toggleIsAuthAC(true))
                res.data && dispatch(setUserDataAC(res.data))
            }else{
                dispatch(toggleIsAuthAC(false))
                alert(res.messages[0])
            }
        })
        .catch(e => alert(e))
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


