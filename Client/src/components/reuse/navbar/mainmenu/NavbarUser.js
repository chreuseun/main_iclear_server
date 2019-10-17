import React, { Component } from 'react';
import { withRouter, BrowserRouter, Route, Switch, Redirect, Link} from "react-router-dom";
import { Menu, Label , Message, Grid, Popup, Container, Dropdown, Button } from 'semantic-ui-react';

//componets
import SelectionMyDepartments from '../../../pages/protected/menu/menuUser/menuMyDepartments/SelectionMyDepartments'
import SelectedDepartments from '../../../pages/protected/menu/menuUser/menuMyDepartments/components/SelectedDepartment'

class NavbarUser extends Component {
    _isMounted = false;

    state = {
        isLoading: true
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { match, location, history } = this.props


        const MyDepartments = () => {
            return(
                <Dropdown item text='Departments'>
                <Dropdown.Menu>
                    
                    <Dropdown.Item as={Link} to={location.pathname + '/newuser'} style={{color:'black'}}>
                        My Departments
                    </Dropdown.Item>
                                          
                    
                    <hr/>                                    
                    <Dropdown.Item as={Link} to={location.pathname + '/configaccount'} style={{color:'black'}}>
                        Issue Clearance
                    </Dropdown.Item>
                   
                </Dropdown.Menu>
            </Dropdown>
            )
        }

        const MySubjects = () => {
            return(
                
                <Dropdown item text='Subjects'>
                <Dropdown.Menu>
                    <Dropdown.Item>My Subjects</Dropdown.Item>

                    <hr/>
                    <Dropdown.Item>Issue Clearance</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            )
        }


        return(
            <React.Fragment>

                <BrowserRouter>
                    <Menu color='blue' style={{}} stackable inverted  fixed='top'>
                        <Container>

                            <Link to="/menu">
                                <Menu.Item>
                                    HOME 
                                </Menu.Item>
                            </Link>

                                { this.props.userDetails.user_type_id === 'USER'? MyDepartments() : MySubjects()}
                               
                            <Menu.Menu position='right'>                            
                                <Dropdown item text={'Welcome, ' + this.props.userDetails.username}>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={()=>{localStorage.clear();history.push('/')}} >Sign-Out</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Menu.Menu>
                        </Container>  
                    </Menu>

                    <Container   style={{marginTop:"200px",background:'#F8F8F8', padding:'20px'}}>
                    
                        <Switch>
                          <Route  exact path={location.pathname } component={SelectionMyDepartments}/> 
                          <Route  exact path={location.pathname + '/id'} component={SelectedDepartments}/> 
                          <Route  exact component={SelectionMyDepartments}/> 
                        </Switch>
                    </Container>
                </BrowserRouter>
            
            </React.Fragment>
        );
    }
}

export default withRouter(NavbarUser);