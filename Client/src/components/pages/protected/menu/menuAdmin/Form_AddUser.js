import React, { Component } from 'react'
import { Form, Header,Segment, Button, Divider, Label, Container} from 'semantic-ui-react'
import axios from 'axios';
import { withRouter ,Redirect} from "react-router-dom";
//COMPONENTS
import Loader from '../../../../reuse/loader';

class FormExampleSubcomponentControl extends Component {
  _isMounted = false;

  state = {
    isLoading: true,
  
    user_type_id : 'USER', 
    username : '',
    password : '',
    lastname : '',
    firstname : '',
    middlename : '',
    contact_number : '',
    retypePassword : ''
  }

  componentDidMount() {
    this._isMounted = true;

    try {
      let response;

      const header = {
          headers: {
              authorization : localStorage.getItem('x')
          }
      }

      const init = async() =>{
          try {
              response = await axios.post('http://localhost:4040/api/auth',{} ,header)

              if(response.data.msg !== 'auth' || !response) {
                  localStorage.clear();
                  this.props.history.push("/");
              }
              
              if(this._isMounted) {
                  this.setState({
                      isLoading:false
                  })
              }                  
          } catch(err){
          }  
      }

          init();
    } catch(err) {
        localStorage.clear();
        this.props.history.push("/");
    } 
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleChange = (e, { value }) => this.setState({ value })

  render() {

    const onSubmit = async(e) => {
      e.preventDefault();

      if(
        this.state.username.trim() === ''||
        this.state.lastname.trim()  === ''  ||
        this.state.firstname.trim()  === ''  ||
        this.state.contact_number.trim()  === '' ||
        this.state.retypePassword.trim()  !== this.state.password.trim() 
      ) {
        alert("Please suppliment required fields")
        return
      }

      let body = {
        user_type_id  : this.state.user_type_id,
        username  : this.state.username,
        password  : this.state.password,
        lastname : this.state.lastname ,
        firstname : this.state.firstname,
        middlename : this.state.middlename ,
        contact_number : this.state.contact_number
      }

      let headers ={
        headers:{
          authorization : localStorage.getItem('x')
        }
      }

      
      var data = 'ERROR';
      try{
        
        data = await axios.post('http://localhost:4040/api/register',body ,headers)
        
        this.setState({
          username : '',
          password : '',
          lastname : '',
          firstname : '',
          middlename : '',
          contact_number : '',
          retypePassword : ''
        })

        alert("User Added");
        
      } catch(err) {
        console.log(err)
      } 
    
    }

    if(this.state.isLoading) {
      return (<Loader/>)
    }

    return (
      <Container textAlign="left" style={{marginTop:20}}  >
        <Segment  style={{ maxWidth: 600 ,margin:"auto"}}> 
      
          <Header textAlign="center"  color='blue' icon>
            Add User
          </Header>

          <Form>

            <Form.Field >
              <Label as='a' color='grey' ribbon>Lastname</Label>
              <input value={this.state.lastname}  required maxLength="60" 
                onChange={(e) => {
                  this.setState({
                    lastname: e.target.value
                  })
                }}/>
            </Form.Field>

            <Form.Field >
              <Label as='a' color='grey' ribbon>Firstname</Label>
              <input value={this.state.firstname}  required maxLength="60" 
                onChange={(e) => {
                  this.setState({
                    firstname: e.target.value
                  })
                }} />
            </Form.Field>

            <Form.Field >
              <Label as='a' color='grey' ribbon>Middlename</Label>
              <input value={this.state.middlename}  required maxLength="60"
                onChange={(e) => {
                  this.setState({
                    middlename: e.target.value
                  })
                }}/>
            </Form.Field>

            <Form.Field >
              <Label as='a' color='grey' ribbon>Contact Number</Label>
              <input value={this.state.contact_number} type="number" required maxLength="20"
                onChange={(e) => {
                  this.setState({
                    contact_number: e.target.value
                  })
                }}/>      
            </Form.Field>

            <Divider/>

            <Form.Field >
              <Label as='a' color='grey' ribbon>Username</Label>
              <input value={this.state.username}  required maxLength="30"
                onChange={(e) => {
                  this.setState({
                    username: e.target.value
                  })
                }}/>
            </Form.Field>

            <Form.Field >
              <Label as='a' color='grey' ribbon>Password</Label>
              <input value={this.state.password}  type="password" maxLength="30"
                onChange={(e) => {
                  this.setState({
                    password: e.target.value
                  })
                }}/>
            </Form.Field>

            <Form.Field >
              <Label as='a' color='grey' ribbon>Retype Password</Label>
              <input value={this.state.retypePassword}  type="password" required maxLength="30"
                onChange={(e) => {
                    this.setState({
                      retypePassword: e.target.value
                    })
                }}/>
            </Form.Field>

            <Divider/>

            <Button onClick={onSubmit}  >Submit</Button>
          </Form>

        </Segment>
      </Container>
    )
  }
}

export default withRouter(FormExampleSubcomponentControl);
