import React, {useCallback} from 'react'
import {AddItemForm} from '../../../../../components/AddItemForm/AddItemForm'
import {EditableSpan} from '../../../../../components/EditableSpan/EditableSpan'
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import {Delete} from '@mui/icons-material';
import {FilterValuesType, TodolistDomainType} from "../../../bll/todolists-reducer";
import {TasksResponseType} from "../../../../../api/tasks/tasks-api-types";
import {TaskList} from "./TaskList/TaskList";

type PropsType = {
    todolist: TodolistDomainType
    tasks: TasksResponseType
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    removeTask: (taskId: string, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
}

export const Todolist = React.memo(function (props: PropsType) {
    const disabled = props.todolist.entityStatus === "progress"

    const addTask = useCallback((title: string) => {
        props.addTask(title, props.todolist.id)
    }, [props.addTask, props.todolist.id])

    const removeTodolist = () => {
        props.removeTodolist(props.todolist.id)
    }
    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.todolist.id, title)
    }, [props.todolist.id, props.changeTodolistTitle])

    const onAllClickHandler = useCallback(() => {
        props.changeFilter('all', props.todolist.id)
    }, [props.todolist.id, props.changeFilter])
    const onActiveClickHandler = useCallback(() => {
        props.changeFilter('active', props.todolist.id)
    }, [props.todolist.id, props.changeFilter])
    const onCompletedClickHandler = useCallback(() => {
        props.changeFilter('completed', props.todolist.id)
    }, [props.todolist.id, props.changeFilter])

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
                tasks={props.tasks}
                filter={props.todolist.filter}
                removeTask={props.removeTask}
                changeTaskTitle={props.changeTaskTitle}
                changeTaskStatus={props.changeTaskStatus}
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


