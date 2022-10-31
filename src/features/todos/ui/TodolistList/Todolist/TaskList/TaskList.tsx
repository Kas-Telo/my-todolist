import {Task} from "./Task/Task";
import React from "react";
import {FilterValuesType} from "../../../../bll/todolists-reducer";
import {useAppSelector} from "../../../../../../assets/hooks/useAppSelector";

type TaskListPropsType = {
    id: string
    filter: FilterValuesType
}
export const TaskList = (props: TaskListPropsType) => {
    const tasks = useAppSelector(state => state.tasks[props.id])

    let tasksForTodolist = tasks.items
    if (props.filter === 'active') {
        tasksForTodolist = tasks.items.filter(t => !(!!t.status))
    }
    if (props.filter === 'completed') {
        tasksForTodolist = tasks.items.filter(t => !!t.status)
    }

    return (
        <>
            {
                tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={props.id}/>)
            }
        </>
    )
}