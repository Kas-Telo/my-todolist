import React, {ChangeEvent, useCallback} from 'react'
import {EditableSpan} from '../../../../../../../components/EditableSpan/EditableSpan'
import {Delete} from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';
import {TaskResponseDataType} from "../../../../../../../api/tasks/tasks-api-types";
import {deleteTask, updateTask} from "../../../../../bll/tasks-thunks";
import {useAppDispatch} from "../../../../../../../assets/hooks/useAppDispatch";

type TaskPropsType = {
    task: TaskResponseDataType
    todolistId: string
}
export const Task = React.memo((props: TaskPropsType) => {
    const dispatch = useAppDispatch()
    const onClickHandler = useCallback(() => {
        dispatch(deleteTask({todolistId: props.todolistId, taskId: props.task.id}));
    }, [props.task.id, props.todolistId]);

    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch(updateTask({todolistId: props.todolistId,
            taskId: props.task.id,
            data: {status: e.currentTarget.checked ? 1 : 0}}));
    }, [props.task.id, props.todolistId]);

    const onTitleChangeHandler = useCallback((newValue: string) => {
        dispatch(updateTask({todolistId: props.todolistId, taskId: props.task.id, data: {title: newValue}}));
    }, [props.task.id, props.todolistId]);

    return <div key={props.task.id} className={!!props.task.status ? 'is-done' : ''}>
        <Checkbox
            checked={!!props.task.status}
            color="primary"
            onChange={onChangeHandler}
        />

        <EditableSpan value={props.task.title} onChange={onTitleChangeHandler}/>
        <IconButton onClick={onClickHandler}>
            <Delete/>
        </IconButton>
    </div>
})
