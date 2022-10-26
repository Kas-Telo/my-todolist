import React, {useEffect} from 'react'
import './App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {Menu} from '@mui/icons-material';
import {logout} from "../features/auth/bll/auth-reducer";
import {CircularProgress, LinearProgress} from "@mui/material";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {Routing} from "./routing/Routing/Routing";
import {initializeApp} from "./bll/app-reducer";
import {useAppDispatch} from "../assets/hooks/useAppDispatch";
import {useAppSelector} from "../assets/hooks/useAppSelector";

function App() {
    const isAuth = useAppSelector(state => state.auth.isAuth)
    const status = useAppSelector(state => state.app.status)
    const isInitialized = useAppSelector(state => state.app.isInitialized)
    const dispatch = useAppDispatch()

    const logoutHandler = () => {
        dispatch(logout())
    }

    useEffect(() => {
        // dispatch(getMe())
        dispatch(initializeApp({}))
    }, [])

    if (!isInitialized) {
        return (
            <div style={{display: 'flex', justifyContent: 'center', margin: '300px 0 0 0 '}}>
                <CircularProgress/>
            </div>
        )
    }

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
                    {isAuth && <Button color="inherit" onClick={logoutHandler}>Logout</Button>}
                </Toolbar>
            </AppBar>
            <div style={{position: 'fixed', width: '100%'}}>{status === 'progress' && <LinearProgress/>}</div>
            <Container fixed>
                <Routing/>
            </Container>
            <ErrorSnackbar/>
        </div>
    );
}

export default App;
