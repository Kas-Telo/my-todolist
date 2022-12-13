import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { TodolistList } from '../../../features/todos/ui/TodolistList/TodolistList'
import { Login } from '../../../features/auth/ui/Login/Login'
import { ErrorNotFound } from '../../../components/ErrorNotFound/ErrorNotFound'

export const Routing = () => {
  return (
    <Routes>
      <Route path={'/'} element={<TodolistList />} />
      <Route path={'/login'} element={<Login />} />
      <Route path={'*'} element={<ErrorNotFound />} />
    </Routes>
  )
}