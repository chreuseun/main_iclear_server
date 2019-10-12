import React, { Component } from 'react';
import { Button, Form, Grid, Header, Segment } from 'semantic-ui-react'


export default class InputUser extends Component {
    state = {
        isLogged : false,
        isLoading: true
    }

    render() {

        const usChange = (e) => {
            this.props.usSend(e.target.value)
        }
        
        const pwChange = (e) => {
            this.props.pwSend(e.target.value)
        }

        const onClick = () => {
            this.props.onClick()
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
        );
    }
}