import {TasksResponseType} from "../../../../api/tasks/tasks-api-types";
import {Task} from "./Task/Task";
import React from "react";
import {FilterValuesType} from "../../bll/todolists-reducer";

type TaskListPropsType = {
    id: string
    tasks: TasksResponseType
    filter: FilterValuesType
    changeTaskStatus: (id: string, isDone: boolean, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    removeTask: (taskId: string, todolistId: string) => void
}
export const TaskList = (props: TaskListPropsType) => {
    let tasksForTodolist = props.tasks.items

    if (props.filter === 'active') {
        tasksForTodolist = props.tasks.items.filter(t => !(!!t.status))
    }
    if (props.filter === 'completed') {
        tasksForTodolist = props.tasks.items.filter(t => !!t.status)
    }
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