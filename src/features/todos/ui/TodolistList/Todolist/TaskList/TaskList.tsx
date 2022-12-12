import {Task} from "./Task/Task";
import React from "react";
import {FilterValuesType} from "../../../../bll/todolists-slice";
import {useAppSelector} from "../../../../../../assets/hooks/useAppSelector";
import {selectTasks} from "../../../../bll/selectors";

type TaskListPropsType = {
    id: string
    filter: FilterValuesType
}
export const TaskList = (props: TaskListPropsType) => {
    const allTasks = useAppSelector(selectTasks)
    const tasks = allTasks[props.id]

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