import React, { useCallback, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import { AddItemForm } from '../../../../components/AddItemForm/AddItemForm'
import { Todolist } from './Todolist/Todolist'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../../assets/hooks/useAppSelector'
import { todosActions, todosSelectors } from '../../index'
import { authSelectors } from '../../../auth/'
import { useActions } from '../../../../assets/hooks/useActions'

export const TodolistList: React.FC = () => {
  const todolists = useAppSelector(todosSelectors.selectTodos)
  const isAuth = useAppSelector(authSelectors.selectIsAuth)

  const { createTodolist, getTodolists } = useActions(todosActions)

  const navigate = useNavigate()

  const addTodolist = useCallback((title: string) => {
    createTodolist({ title })
  }, [])

  useEffect(() => {
    isAuth && getTodolists({})
    !isAuth && navigate('/login')
  }, [isAuth])
  return (
    <>
      <Grid container style={{ padding: '20px' }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid
        container
        spacing={5}
        style={{ flexWrap: 'nowrap', overflowX: 'scroll', minHeight: '500px' }}
      >
        {todolists.map((tl) => {
          return (
            <Grid item key={tl.id}>
              <div style={{ width: '300px' }}>
                <Todolist todolist={tl} />
              </div>
            </Grid>
          )
        })}
      </Grid>
    </>
  )
}
