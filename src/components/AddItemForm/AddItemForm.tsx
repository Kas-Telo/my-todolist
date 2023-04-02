import { ChangeEvent, KeyboardEvent, memo, useState } from 'react'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import { AddBox } from '@mui/icons-material'

type AddItemFormPropsType = {
  addItem: (title: string) => void
  disabled?: boolean
}

export const AddItemForm = memo(function (props: AddItemFormPropsType) {
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isTouched, setIsTouched] = useState(false)

  const onBlurHandler = () => {
    if (title.trim() === '' && error !== 'Title is required') {
      setError('Title is required')
    }
  }

  const addItem = () => {
    if (!error) {
      if (title.trim() !== '') {
        props.addItem(title.trim())
        setTitle('')
        setError(null)
      } else {
        setError('Title is required')
      }
    }
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.trim() === '' && isTouched) {
      setError('Title is required')
    }
    if (e.currentTarget.value.trim() !== '' && error === 'Title is required') {
      setError(null)
    } else if (title.length > 100) {
      setError('Max 100 symbols')
    } else if (title.length <= 100 && error === 'Max 100 symbols') {
      setError(null)
    }
    setTitle(e.currentTarget.value)
  }

  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
    if (e.key === 'Enter' && !error) {
      addItem()
    }
  }

  return (
    <div>
      <TextField
        variant='outlined'
        error={!!error}
        value={title}
        onChange={onChangeHandler}
        onKeyPress={onKeyPressHandler}
        label='Title'
        helperText={error}
        disabled={props.disabled}
        multiline
        onBlur={onBlurHandler}
        onFocus={() => {
          !isTouched && setIsTouched(true)
        }}
      />
      <IconButton color='primary' onClick={addItem} disabled={props.disabled}>
        <AddBox />
      </IconButton>
    </div>
  )
})
