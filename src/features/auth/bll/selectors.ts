import {RootState} from "../../../app/bll/store";

export const selectIsAuth = (state: RootState) => state.auth.isAuth