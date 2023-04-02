import React, { ChangeEvent, useState } from 'react'
import TextField from '@mui/material/TextField'

type EditableSpanPropsType = {
  value: string
  onChange: (newValue: string) => void
  disabled?: boolean
}

export const EditableSpan = React.memo(function (props: EditableSpanPropsType) {
  const [editMode, setEditMode] = useState(false)
  const [title, setTitle] = useState(props.value)

  const activateEditMode = () => {
    if (props.disabled) return
    setEditMode(true)
    setTitle(props.value)
  }
  const activateViewMode = () => {
    setEditMode(false)
    if (title.trim() !== '') {
      props.onChange(title.trim())
    } else {
      setTitle(props.value)
    }
  }
  const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  return editMode ? (
    <TextField value={title} onChange={changeTitle} autoFocus onBlur={activateViewMode} />
  ) : (
    <span style={{ overflowWrap: 'break-word' }} onDoubleClick={activateEditMode}>
      {props.value}
    </span>
  )
})
