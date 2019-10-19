import React, { Component } from 'react';
import { withRouter, BrowserRouter, Route, Switch, Redirect, Link} from "react-router-dom";
import { Menu, Label , Message, Grid, Popup, Container, Dropdown, Button } from 'semantic-ui-react';

//componets
import SelectionMyDepartments from '../../../pages/protected/menu/menuUser/menuMyDepartments/SelectionMyDepartments'
import SelectedDepartments from '../../../pages/protected/menu/menuUser/menuMyDepartments/components/SelectedDepartment'
import manageDeptRequirements from '../../../pages/protected/menu/menuUser/menuMyDepartments/components/manageDeptRequirement.js/manageDeptRequirements';

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
                    <Menu color='blue' style={{}} stackable inverted  fixed='top'>
                        <Container>

                            <Link to="/menu">
                                <Menu.Item>
                                    HOME 
                                </Menu.Item>
                            </Link>

                            <Menu.Menu position='right'>                            
                                <Dropdown item text={'Welcome, ' + this.props.userDetails.username}>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={()=>{localStorage.clear();history.push('/')}} >Sign-Out</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Menu.Menu>
                        </Container>  
                    </Menu>

                    <Container   style={{marginTop:"100px",background:'#F8F8F8', padding:'20px'}}>
                    
                        <Switch>
                          <Route  exact path={location.pathname } component={SelectionMyDepartments}/> 
                          <Route  exact path={location.pathname + '/:dept'} component={SelectedDepartments}/> 
                          <Route  exact path={location.pathname + '/:dept/req'} component={manageDeptRequirements}/> 
                          <Route  exact component={SelectionMyDepartments}/> 
                        </Switch>
                    </Container>
                </BrowserRouter>
            
            </React.Fragment>
        );
    }
}

export default withRouter(NavbarUser);