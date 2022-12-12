import {useMemo} from "react";
import {useAppDispatch} from "./useAppDispatch";
import {ActionCreatorsMapObject, bindActionCreators} from "redux";

export const useActions = <T extends ActionCreatorsMapObject>(actions: T) => {
    const dispatch = useAppDispatch()
    const boundActions = useMemo(() => {
        return bindActionCreators(actions, dispatch)
    }, [])

    return boundActions
}