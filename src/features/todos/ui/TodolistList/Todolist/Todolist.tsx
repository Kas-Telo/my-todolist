import React, { useCallback } from 'react'
import { AddItemForm } from '../../../../../components/AddItemForm/AddItemForm'
import { EditableSpan } from '../../../../../components/EditableSpan/EditableSpan'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { Delete } from '@mui/icons-material'
import { FilterValuesType, TodolistDomainType } from '../../../bll/todolists-slice'
import { tasksActions, todosActions } from '../../../index'
import { TaskList } from './TaskList/TaskList'
import { useActions } from '../../../../../assets/hooks/useActions'
import { Paper } from '@mui/material'

type PropsType = {
  todolist: TodolistDomainType
}

export const Todolist = React.memo(function (props: PropsType) {
  const { createTask } = useActions(tasksActions)
  const { deleteTodolist, updateTodolistTitle, changeTodolistFilter } = useActions(todosActions)
  const disabled = props.todolist.entityStatus === 'progress'

  const removeTodolist = () => {
    deleteTodolist({ id: props.todolist.id })
  }

  const addTask = useCallback(
    (title: string) => {
      createTask({ todolistId: props.todolist.id, title })
    },
    [props.todolist.id],
  )

  const changeTodolistTitle = useCallback(
    (title: string) => {
      updateTodolistTitle({ title, id: props.todolist.id })
    },
    [props.todolist.id],
  )

  const onFilterClickHandler = useCallback(
    (filter: FilterValuesType) => {
      changeTodolistFilter({ id: props.todolist.id, filter })
    },
    [props.todolist.id],
  )

  const filterButtonRendering = (
    filter: FilterValuesType,
    text: string,
    color: 'inherit' | 'primary' | 'secondary',
  ) => {
    return (
      <Button
        variant={props.todolist.filter === filter ? 'outlined' : 'text'}
        onClick={() => onFilterClickHandler(filter)}
        color={color}
      >
        {text}
      </Button>
    )
  }

  return (
    <Paper style={{ padding: '10px', position: 'relative' }}>
      <IconButton
        size={'small'}
        onClick={removeTodolist}
        disabled={disabled}
        style={{ position: 'absolute', top: 0, right: 0 }}
      >
        <Delete />
      </IconButton>
      <h3>
        <EditableSpan
          value={props.todolist.title}
          onChange={changeTodolistTitle}
          disabled={disabled}
        />
      </h3>
      <AddItemForm addItem={addTask} disabled={disabled} />
      <div>
        <TaskList id={props.todolist.id} filter={props.todolist.filter} />
      </div>
      <div style={{ paddingTop: '10px' }}>
        {filterButtonRendering('all', 'All', 'inherit')}
        {filterButtonRendering('active', 'Active', 'primary')}
        {filterButtonRendering('completed', 'Completed', 'secondary')}
      </div>
    </Paper>
  )
})
