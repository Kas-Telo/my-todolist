import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  TextField,
} from '@mui/material'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormikHelpers, useFormik } from 'formik'
import { useAppSelector } from '../../../../assets/hooks/useAppSelector'
import { authActions, authSelectors } from '../../index'
import { useAppDispatch } from '../../../../assets/hooks/useAppDispatch'

type FormValuesType = {
  email: string
  password: string
  rememberMe: boolean
}
type FormikErrorType = {
  email?: string
  password?: string
  rememberMe?: boolean
}

export const Login = () => {
  const isAuth = useAppSelector(authSelectors.selectIsAuth)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    isAuth && navigate('/')
  }, [isAuth])

  const formik = useFormik({
    validate: (values) => {
      const errors: FormikErrorType = {}
      if (!values.email) {
        errors.email = 'Email is required'
      }
      if (!values.password) {
        errors.password = 'Password is required'
      }
      return errors
    },
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    onSubmit: async (values: FormValuesType, formikHelpers: FormikHelpers<FormValuesType>) => {
      const action = await dispatch(authActions.login(values))

      if (authActions.login.rejected.match(action)) {
        if (action.payload?.fieldsErrors?.length) {
          const error = action.payload.fieldsErrors[0]
          formikHelpers.setFieldError('email', error.error)
        }
      }
    },
  })

  return (
    <Grid container justifyContent={'center'}>
      <Grid item xs={4} justifyContent={'center'}>
        <form onSubmit={formik.handleSubmit}>
          <FormLabel>
            <p>
              To log in get registered
              <a href={'https://social-network.samuraijs.com/'} target={'_blank'} rel='noreferrer'>
                {' '}
                here
              </a>
            </p>
            <p>or use common test account credentials:</p>
            <p>Email: free@samuraijs.com</p>
            <p>Password: free</p>
          </FormLabel>
          <FormGroup>
            <TextField
              margin={'dense'}
              label='Email'
              variant='standard'
              {...formik.getFieldProps('email')}
            />
            {formik.errors.email && formik.touched.email && (
              <span style={{ color: 'red', fontSize: '12px' }}>{formik.errors.email}</span>
            )}
            <TextField
              label='Password'
              variant='standard'
              type={'password'}
              margin={'dense'}
              {...formik.getFieldProps('password')}
            />
            {formik.errors.password && formik.touched.password && (
              <span style={{ color: 'red', fontSize: '12px' }}>{formik.errors.password}</span>
            )}
            <FormControlLabel
              control={<Checkbox />}
              label={'Remember me'}
              {...formik.getFieldProps('rememberMe')}
            />
            <Button type={'submit'} variant='contained'>
              Sign In
            </Button>
          </FormGroup>
        </form>
      </Grid>
    </Grid>
  )
}
