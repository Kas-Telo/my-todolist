import {Button, Checkbox, FormControlLabel, FormGroup, FormLabel, Grid, TextField} from '@mui/material';
import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../../../app/bll/store";
import {useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import {login} from "../../bll/auth-reducer";

export const Login = () => {
    const dispatch = useAppDispatch
    const isAuth = useAppSelector(state => state.auth.isAuth)
    const navigate = useNavigate()

    useEffect(() => {
        isAuth && navigate('/')
    }, [isAuth])

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        onSubmit: values => {
            dispatch(login({email: values.email, password: values.password, rememberMe: values.rememberMe}))
        }
    })
    return (
        <Grid container justifyContent={"center"}>
            <Grid item xs={4} justifyContent={'center'}>
                <form onSubmit={formik.handleSubmit}>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               target={'_blank'}> here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField
                            margin={"dense"}
                            label="Email"
                            variant="standard"
                            type={'email'}
                            {...formik.getFieldProps('email')}
                        />
                        <TextField
                            label="Password"
                            variant="standard"
                            type={'password'}
                            margin={"dense"}
                            {...formik.getFieldProps('password')}
                        />
                        <FormControlLabel
                            control={<Checkbox/>}
                            label={'Remember me'}
                            {...formik.getFieldProps('rememberMe')}
                        />
                        <Button type={'submit'} variant="contained">Sign In</Button>
                    </FormGroup>
                </form>
            </Grid>
        </Grid>
    );
};