import React, {useEffect} from 'react'
import './App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {Menu} from '@mui/icons-material';
import {getTodolists} from '../features/TodolistList/bll/todolists-reducer';
import {useAppDispatch, useAppSelector} from './bll/store';
import {getMe, login, logout} from "../features/auth/bll/auth-reducer";
import {toggleIsInitialized} from "./bll/app-reducer";
import {TodolistList} from "../features/TodolistList/TodolistList";

function App() {
    const isAuth = useAppSelector(state => state.auth.isAuth)
    const isInitializedApp = useAppSelector(state => state.app.isInitialized)
    const dispatch = useAppDispatch

    const onClickButtonLoginHandler = () => {
        !isAuth && dispatch(login({
            email: 'alexkas2511@gmail.com',
            password: 'Kas372api',
            rememberMe: true,
            captcha: false
        }))
        isAuth && dispatch(logout())
    }

    useEffect(() => {
        dispatch(getMe())
        dispatch(getTodolists())
        !isAuth && dispatch(toggleIsInitialized(false))
    }, [isAuth])

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit" onClick={onClickButtonLoginHandler}>{isAuth ? 'Logout' : 'Login'}</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                {isInitializedApp
                    ? <TodolistList/>
                    : 'Loading...'
                }
            </Container>
        </div>
    );
}
export default App;
