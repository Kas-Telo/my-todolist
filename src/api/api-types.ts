export type ServerResponseType<T = {}> = {
    data: T,
    messages: string[],
    fieldsErrors: string[],
    resultCode: number
}
export type ItemResponseType<T = {}> = {
    item: T
}