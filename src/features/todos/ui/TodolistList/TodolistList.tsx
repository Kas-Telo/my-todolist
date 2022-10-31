import React, {useCallback, useEffect} from "react";
import Grid from "@mui/material/Grid";
import {AddItemForm} from "../../../../components/AddItemForm/AddItemForm";
import Paper from "@mui/material/Paper";
import {Todolist} from "./Todolist/Todolist";
import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "../../../../assets/hooks/useAppDispatch";
import {useAppSelector} from "../../../../assets/hooks/useAppSelector";
import {createTodolist, getTodolists} from "../../bll/todolists-thunks";

export const TodolistList: React.FC = () => {
    const todolists = useAppSelector(state => state.todolists)
    const isAuth = useAppSelector(state => state.auth.isAuth)

    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const addTodolist = useCallback((title: string) => {
        dispatch(createTodolist({title}))
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
                        return <Grid item key={tl.id}>
                            <Paper style={{padding: '10px'}}>
                                <Todolist todolist={tl}/>
                            </Paper>
                        </Grid>
                    })
                }
            </Grid>

        </>
    )
}