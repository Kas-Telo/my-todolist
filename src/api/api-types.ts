export type ServerResponseType<T = {}> = {
    data: T,
    messages: string[],
    fieldsErrors: FieldErrorType[]
    resultCode: number
}
export type ItemResponseType<T = {}> = {
    item: T
}
export type FieldErrorType = {
    field: string
    error: string
}