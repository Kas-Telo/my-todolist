import {TypedUseSelectorHook, useSelector} from "react-redux";
import {RootState} from "../../app/bll/store";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector