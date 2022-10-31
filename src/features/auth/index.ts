import {slice} from './bll/auth-reducer'
import {asyncActions} from './bll/auth-thunks'
import { selectIsAuth } from './bll/selectors'
import {Login} from './ui/Login/Login'


const authReducer = slice.reducer
const authActions = {
    ...slice.actions,
    ...asyncActions
}
export {
    authReducer,
    authActions,
    Login,
    selectIsAuth,
}