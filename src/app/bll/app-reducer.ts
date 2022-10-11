
const initialState = {
    isInitialized: false
}

export const appReducer = (state:AppStateType =  initialState, action: AppActionsType): AppStateType => {
    switch (action.type) {
        case 'TOGGLE_IS_INITIALIZED':
            return {...state, isInitialized: action.value}
        default:
            return state
    }
}

export const toggleIsInitialized = (value: boolean) =>
    ({type: 'TOGGLE_IS_INITIALIZED', value })

export type AppStateType = typeof initialState

export type AppActionsType =
    | ReturnType<typeof toggleIsInitialized>