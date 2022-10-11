import {instance} from "../api-instance";
import {ServerResponseType} from "../api-types";
import {LoginRequestType, LoginResponseDataType, UserResponseDataType} from "./auth-api-types";
import {AxiosResponse} from "axios";

export const authAPI = {
    getMe(){
        return instance.get<{}, AxiosResponse<ServerResponseType<UserResponseDataType>>>(`/auth/me`)
            .then(res => res.data)
    },
    login(loginData: LoginRequestType){
        console.log('login')
        return instance.post<LoginRequestType, AxiosResponse<ServerResponseType<LoginResponseDataType>>>( `/auth/login`, loginData)
            .then(res => res.data)
    },
    logout(){
        console.log('logout')
        return instance.delete<AxiosResponse<ServerResponseType>>(`/auth/login`)
            .then(res => res.data)
    }
}

