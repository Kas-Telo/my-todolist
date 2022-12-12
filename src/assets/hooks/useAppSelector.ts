import {TypedUseSelectorHook, useSelector} from "react-redux";
import {RootState} from "../../app/types";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector