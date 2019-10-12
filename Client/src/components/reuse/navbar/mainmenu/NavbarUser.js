import React, { Component } from 'react';
import { withRouter, BrowserRouter, Route, Switch, Redirect, Link} from "react-router-dom";
import { Menu ,Icon, Container, Dropdown } from 'semantic-ui-react';

//componets

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

        return(
            <React.Fragment>

                <BrowserRouter>
                    <Menu style={{}} stackable inverted >
                        <Container>

                            <Link to="/menu">
                                <Menu.Item>
                                    HOME 
                                </Menu.Item>
                            </Link>

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

                            <Dropdown item text='Subjects'>
                                <Dropdown.Menu>
                                    <Dropdown.Item>My Subjects</Dropdown.Item>

                                    <hr/>
                                    <Dropdown.Item>Issue Clearance</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

                            <Menu.Menu position='right'>                            
                                <Dropdown item text={'Welcome, ' + this.props.userDetails.username}>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={()=>{localStorage.clear();history.push('/')}} >Sign-Out</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Menu.Menu>
                        </Container>  
                    </Menu>

                    <Container>
                      
                    </Container>
                </BrowserRouter>
            
            </React.Fragment>
        );
    }
}

export default withRouter(NavbarUser);