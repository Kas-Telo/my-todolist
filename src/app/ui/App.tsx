import React, { useEffect } from 'react'
import './App.css'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import { Menu } from '@mui/icons-material'
import { CircularProgress, LinearProgress } from '@mui/material'
import { ErrorSnackbar } from '../../components/ErrorSnackbar/ErrorSnackbar'
import { Routing } from '../routing/Routing/Routing'
import { useAppSelector } from '../../assets/hooks/useAppSelector'
import { authActions, authSelectors } from '../../features/auth'
import { useActions } from '../../assets/hooks/useActions'
import { appAsyncActions, appSelectors } from '../index'

function App() {
  const isAuth = useAppSelector(authSelectors.selectIsAuth)
  const status = useAppSelector(appSelectors.selectStatus)
  const isInitialized = useAppSelector(appSelectors.selectIsInitialized)

  const { logout } = useActions(authActions)
  const { initializeApp } = useActions(appAsyncActions)

  useEffect(() => {
    initializeApp({})
  }, [])

  if (!isInitialized) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '300px 0 0 0 ' }}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <div className='App'>
      <AppBar position='static'>
        <Toolbar>
          <IconButton edge='start' color='inherit' aria-label='menu'>
            <Menu />
          </IconButton>
          {isAuth && (
            <Button color='inherit' onClick={logout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <div style={{ position: 'absolute', width: '100%' }}>
        {status === 'progress' && <LinearProgress />}
      </div>
      <Container fixed>
        <Routing />
      </Container>
      <ErrorSnackbar />
    </div>
  )
}

export default App
