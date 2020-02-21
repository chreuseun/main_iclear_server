import React, { Component, useState, useEffect } from 'react';
import {withRouter} from 'react-router-dom'
import { Button, Form, Grid, Header, Segment ,Dimmer, Loader} from 'semantic-ui-react'
import Login from './login';


const LoginForm = (props) => {  

  const [didMount, setDidMount] = useState(false)
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    setDidMount(true);
    let setState = true;

    console.log('Login Form: ', 'useEffect([])');

    return () => (setState=false)
  }, []);

  if(!didMount) {
    return null
  }

  const usChange = (e) => {
    props.usSend(e.target.value)
  }

  const pwChange = (e) => {
      props.pwSend(e.target.value)
  }

  const onClick = () => {
      props.onClick()
  }

  return(
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>

      <Grid.Column style={{ maxWidth: 450 }}>

        <Header as='h2' color='blue' textAlign='center'>
          Log-in to your account
        </Header>
        <Form size='large'>

          <Segment stacked>

            <input onChange={usChange}   type="text"  placeholder="Username" style={{marginBottom:"10px"}}/>

            <input onChange={pwChange}   type="password"  placeholder="password" style={{marginBottom:"10px"}}/>

            <Button onClick={onClick} color='blue' fluid size='large'>
              Login
            </Button>

          </Segment>

        </Form>

      </Grid.Column>
    </Grid>
  )
}

export default LoginForm;