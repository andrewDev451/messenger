import React from 'react'
import './Login.css'
import Button from "@material-ui/core/Button";
import {auth, provider} from '../../firebase'
import {useStateValue} from "../../StateProvider";
import {actionTypes} from "../../reducer";


const Login = () => {
    const [{}, dispatch] = useStateValue()

    const signIn = () => {
        auth
            .signInWithPopup(provider)
            .then((result) => {
                console.log(result)
                dispatch({
                    type: actionTypes.SET_USER,
                    user: result.user
                })
            })
            .catch((error) => alert(error.message))
    }

    return (
        <div className="login">
            <div className="login__container">
                <div className="login__text">
                    <h1>Sign In</h1>
                </div>

                <Button onClick={signIn} type="submit">
                    Sign In With Google
                </Button>
            </div>
        </div>
    )
}

export default Login