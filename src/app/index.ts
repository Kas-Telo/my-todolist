import {slice} from './bll/app-slice'
import {asyncActions as appAsyncActions} from "./bll/app-slice";
import * as appSelectors from './bll/selectors'

const appReducer = slice.reducer

export {
    appReducer,
    appAsyncActions,
    appSelectors,
}
