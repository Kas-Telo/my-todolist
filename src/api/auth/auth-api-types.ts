//types
export type LoginResponseDataType = {
    userId: number
}
export type UserResponseDataType = {
    id: number,
    login: string,
    email: string
}
export type LoginRequestType = {
    email: string,
    password: string,
    rememberMe: boolean,
    captcha: false
}