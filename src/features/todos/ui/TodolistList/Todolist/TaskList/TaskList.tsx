import {TasksResponseType} from "../../../../../../api/tasks/tasks-api-types";
import {Task} from "./Task/Task";
import React, {useEffect} from "react";
import {FilterValuesType} from "../../../../bll/todolists-reducer";
import {getTasks} from "../../../../bll/tasks-reducer";
import {useAppDispatch} from "../../../../../../assets/hooks/useAppDispatch";
import {useAppSelector} from "../../../../../../assets/hooks/useAppSelector";

type TaskListPropsType = {
    id: string
    tasks: TasksResponseType
    filter: FilterValuesType
    changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    removeTask: (taskId: string, todolistId: string) => void
}
export const TaskList = (props: TaskListPropsType) => {
    const dispatch = useAppDispatch()
    const isAuth = useAppSelector(state => state.auth.isAuth)

    let tasksForTodolist = props.tasks.items
    if (props.filter === 'active') {
        tasksForTodolist = props.tasks.items.filter(t => !(!!t.status))
    }
    if (props.filter === 'completed') {
        tasksForTodolist = props.tasks.items.filter(t => !!t.status)
    }

    useEffect(() => {
        isAuth && dispatch(getTasks(props.id))
    }, [isAuth])

    return (
        <>
            {
                tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={props.id}
                                                removeTask={props.removeTask}
                                                changeTaskTitle={props.changeTaskTitle}
                                                changeTaskStatus={props.changeTaskStatus}
                />)
            }
        </>
    )
}