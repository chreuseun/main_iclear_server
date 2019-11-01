import React, {  useState, useEffect } from 'react';
import {Segment, Dimmer, Loader as Ld } from 'semantic-ui-react'

import IsLogged from '../../../auth/api/isLogged'
import _Login from '../../../auth/api/login'

import LoginForm from './loginForm'
import Loader from '../../reuse/loader'

const Login = (props) => {

    const { history } = props

    const [didMount, setDidMount] = useState(false)

    const [us, setUs] = useState('');
    const [pw, setPw] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [load, setLoad] = useState(false);


    useEffect(()=>{
        setDidMount(true);
        let setState = true; // xa


        // Check Token API
        if(localStorage.getItem('x')) {
            const arg = {
                cb : ()=>{ 
                    history.push("/menu")
                },
                cbf : ()=> {
                    localStorage.clear()
                    history.push("/")
                }
            }

            IsLogged(arg)
        } else {
            setIsLoading(false);
        }   

    },[])

    if(!didMount) {
        return null
    }

    const usSend = (us) => {
        setUs(us)
    }

    const pwSend = (pw) => {      
        setPw(pw)
    }

    const onClick = () => {

        setLoad(true)

        if( us !== '' && pw !== '' ) {

            let arg = {
                us: us,
                pw: pw,
                cb: () => {props.history.push("/menu")}
            }

            _Login(arg)
        }
        setLoad(false)
    }

    if(isLoading){
        return (
            <Loader loadText={"Loading"}/>
        )
    } 

    return(
        <Segment>
            <Dimmer active={load}>
                <Ld/>
            </Dimmer>

            <LoginForm usSend={usSend} pwSend={pwSend} onClick={onClick}/>
        </Segment>
    );
}

export default Login