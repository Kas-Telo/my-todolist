import {slice} from './bll/auth-slice'
import {asyncActions} from './bll/auth-thunks'
import * as authSelectors from './bll/selectors'

const authReducer = slice.reducer
const authActions = {
    ...slice.actions,
    ...asyncActions
}
export {
    authReducer,
    authActions,
    authSelectors,
}