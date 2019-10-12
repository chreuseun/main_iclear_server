import React, { Component } from 'react'
import { Form, Grid, Header,Segment, Button, Select} from 'semantic-ui-react'

const options = [
  { key: 'm', text: 'Male', value: 'male' },
  { key: 'f', text: 'Female', value: 'female' },
  { key: 'o', text: 'Other', value: 'other' },
]

class FormExampleSubcomponentControl extends Component {
  state = {}

  handleChange = (e, { value }) => this.setState({ value })

  render() {
    return (

      <Grid textAlign='center' style={{ height: '100vh' }}>
              <Grid.Column style={{ maxWidth: 600 }}>

                <Header as='h2' textAlign='center'>
                    Add New User
                </Header>
                <Form textAlign='left' size='large'>

               
                  <Segment stacked>
                    <label>Last Name</label>
                    <input type="text"  placeholder="Last Name" style={{marginBottom:"20px"}}/>

                    <label>First Name</label>
                    <input  type="text"  placeholder="First Name" style={{marginBottom:"20px"}}/>
                    
                    <label>Middle Name</label>
                    <input type="text"  placeholder="Middle Name" style={{marginBottom:"20px"}}/>

                    <label>Contact Number</label>
                    <input type="tel"  placeholder="Contact Number" style={{marginBottom:"20px"}}/>

  
                    <label>Username</label>
                    <input  type="text"  placeholder="Username" style={{marginBottom:"20px"}} />
                
                    <label>Password</label>
                    <input type="password"  placeholder="Password" style={{marginBottom:"20px"}}/>

                    <label>Retype Password</label>
                    <input type="password"  placeholder="Retype Password" />

                    <hr style={{marginBottom:"20px"}}/>
          
                    <Button color='blue' fluid size='large'>
                      Login
                    </Button>

                  </Segment>
                </Form>
             
              </Grid.Column>
            </Grid>
    )
  }
}

export default FormExampleSubcomponentControl
