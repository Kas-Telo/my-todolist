export type ServerResponseType<T = Record<string, never>> = {
  data: T
  messages: string[]
  fieldsErrors: FieldErrorType[]
  resultCode: number
}
export interface ItemResponseType<T = Record<string, never>> {
  item: T
}

export type FieldErrorType = {
  field: string
  error: string
}
