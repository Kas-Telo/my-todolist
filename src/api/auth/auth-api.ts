import {instance} from "../api-instance";
import {ServerResponseType} from "../api-types";
import {LoginRequestType, LoginResponseDataType, UserResponseDataType} from "./auth-api-types";
import {AxiosResponse} from "axios";

export const authAPI = {
    getMe(){
        return instance.get<{}, AxiosResponse<ServerResponseType<UserResponseDataType>>>(`/auth/me`)
    },
    login(loginData: LoginRequestType){
        return instance.post<LoginRequestType, AxiosResponse<ServerResponseType<LoginResponseDataType>>>( `/auth/login`, loginData)
    },
    logout(){
        return instance.delete<{}, AxiosResponse<ServerResponseType>>(`/auth/login`)
    }
}

