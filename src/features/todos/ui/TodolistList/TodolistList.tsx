import React, {useCallback, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../../../app/bll/store";
import {createTask, deleteTask, updateTask} from "../../bll/tasks-reducer";
import {
    changeTodolistFilterAC,
    createTodolist,
    deleteTodolist,
    FilterValuesType,
    getTodolists,
    updateTodolistTitle
} from "../../bll/todolists-reducer";
import Grid from "@mui/material/Grid";
import {AddItemForm} from "../../../../components/AddItemForm/AddItemForm";
import Paper from "@mui/material/Paper";
import {Todolist} from "./Todolist/Todolist";
import {useNavigate} from "react-router-dom";

export const TodolistList: React.FC = () => {
    const todolists = useAppSelector(state => state.todolists)
    const tasks = useAppSelector(state => state.tasks)
    const isAuth = useAppSelector(state => state.auth.isAuth)
    const navigate = useNavigate()
    const dispatch = useAppDispatch

    const removeTask = useCallback(function (id: string, todolistId: string) {
        dispatch(deleteTask(todolistId, id));
    }, []);

    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(createTask(todolistId, title));
    }, []);

    const changeStatus = useCallback(function (id: string, isDone: boolean, todolistId: string) {
        dispatch(updateTask(todolistId, id, {status: isDone ? 1 : 0}));
    }, []);

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        dispatch(updateTask(todolistId, id, {title: newTitle}));
    }, []);

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        dispatch(changeTodolistFilterAC(todolistId, value));
    }, []);

    const removeTodolist = useCallback(function (id: string) {
        dispatch(deleteTodolist(id))
    }, []);

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        dispatch(updateTodolistTitle(title, id))
    }, []);

    const addTodolist = useCallback((title: string) => {
        dispatch(createTodolist(title))
    }, [dispatch]);

    useEffect(() => {
        isAuth && dispatch(getTodolists())
        !isAuth && navigate('/login')
    }, [isAuth])
    return (
        <>
            <Grid container style={{padding: '20px'}}>
                <AddItemForm addItem={addTodolist}/>
            </Grid>
            <Grid container spacing={3}>
                {
                    todolists.map(tl => {
                        let allTodolistTasks = tasks[tl.id];

                        return <Grid item key={tl.id}>
                            <Paper style={{padding: '10px'}}>
                                <Todolist
                                    todolist={tl}
                                    tasks={allTodolistTasks}
                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeStatus}
                                    removeTodolist={removeTodolist}
                                    changeTaskTitle={changeTaskTitle}
                                    changeTodolistTitle={changeTodolistTitle}
                                />
                            </Paper>
                        </Grid>
                    })
                }
            </Grid>

        </>
    )
}