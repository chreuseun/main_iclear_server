import React, { Component } from 'react';

import IsLogged from '../../../auth/api/isLogged'
import _Login from '../../../auth/api/login'

import LoginForm from './loginForm'
import Loader from '../../reuse/loader'


export default class Login extends Component {

    state = {
        us:'',
        pw:'',
        isLoading: true
    }

    componentDidMount() {

        // Check Token API
        if(localStorage.getItem('x')) {
            const arg = {
                cb : ()=>{ 
                    this.props.history.push("/menu")
                },
                cbf : ()=> {
                    localStorage.clear()
                    this.props.history.push("/")
                }
            }

            IsLogged(arg)
        } else {
            this.setState({
                isLoading:false
            })
        }     
         
    }

    usSend = (us) => {
        this.setState({
            us:us
        })
    }

    pwSend = (pw) => {
        this.setState({
            pw:pw
        })

    }

    onClick = () => {
        if( this.state.us !== '' && this.state.pw !== '' ) {

            let arg = {
                us: this.state.us,
                pw: this.state.pw,
                cb: () => {this.props.history.push("/menu")}
            }

            _Login(arg)
        }
        
 
    }
    // 
    render() {

        if(this.state.isLoading){
            return (
                <Loader loadText={"Loading"}/>
            )
        } 

        return(
            <LoginForm usSend={this.usSend} pwSend={this.pwSend} onClick={this.onClick}/>
        );
    }
}
