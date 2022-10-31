import React, {useCallback} from 'react'
import {AddItemForm} from '../../../../../components/AddItemForm/AddItemForm'
import {EditableSpan} from '../../../../../components/EditableSpan/EditableSpan'
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import {Delete} from '@mui/icons-material';
import {changeTodolistFilter, TodolistDomainType} from "../../../bll/todolists-reducer";
import {TaskList} from "./TaskList/TaskList";
import {deleteTodolist, updateTodolistTitle} from "../../../bll/todolists-thunks";
import {useAppDispatch} from "../../../../../assets/hooks/useAppDispatch";
import {createTask} from "../../../bll/tasks-thunks";

type PropsType = {
    todolist: TodolistDomainType
}

export const Todolist = React.memo(function (props: PropsType) {
    const disabled = props.todolist.entityStatus === "progress"
    const dispatch = useAppDispatch()

    const addTask = useCallback((title: string) => {
        dispatch(createTask({todolistId: props.todolist.id, title}));
    }, [props.todolist.id])

    const removeTodolist = () => {
        dispatch(deleteTodolist({id: props.todolist.id}))
    }
    const changeTodolistTitle = useCallback((title: string) => {
        dispatch(updateTodolistTitle({title, id: props.todolist.id}))
    }, [props.todolist.id])

    const onAllClickHandler = useCallback(() => {
        dispatch(changeTodolistFilter({id: props.todolist.id, filter: 'all'}))
    }, [props.todolist.id])
    const onActiveClickHandler = useCallback(() => {
        dispatch(changeTodolistFilter({id: props.todolist.id, filter: 'active'}))
    }, [props.todolist.id])
    const onCompletedClickHandler = useCallback(() => {
        dispatch(changeTodolistFilter({id: props.todolist.id, filter: 'completed'}))
    }, [props.todolist.id])

    return <div>
        <h3><EditableSpan value={props.todolist.title} onChange={changeTodolistTitle} disabled={disabled}/>
            <IconButton onClick={removeTodolist} disabled={disabled}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask} disabled={disabled}/>
        <div>
            <TaskList
                id={props.todolist.id}
                filter={props.todolist.filter}
            />
        </div>
        <div style={{paddingTop: '10px'}}>
            <Button variant={props.todolist.filter === 'all' ? 'outlined' : 'text'}
                    onClick={onAllClickHandler}
                    color={'inherit'}
            >All
            </Button>
            <Button variant={props.todolist.filter === 'active' ? 'outlined' : 'text'}
                    onClick={onActiveClickHandler}
                    color={'primary'}>Active
            </Button>
            <Button variant={props.todolist.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={onCompletedClickHandler}
                    color={'secondary'}>Completed
            </Button>
        </div>
    </div>
})


