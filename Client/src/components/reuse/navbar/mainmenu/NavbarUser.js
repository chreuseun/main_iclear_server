import React, { Component } from 'react';
import { withRouter, BrowserRouter, Route, Switch, Link} from "react-router-dom";
import { Menu,  Container, Dropdown } from 'semantic-ui-react';

//componets TRADIONAL
import SelectionMyDepartments from '../../../pages/protected/menu/menuUser/menuMyDepartments/SelectionMyDepartments'
import SelectedDepartments from '../../../pages/protected/menu/menuUser/menuMyDepartments/components/SelectedDepartment'
import ManageDeptRequirements from '../../../pages/protected/menu/menuUser/menuMyDepartments/components/manageDeptRequirement.js/manageDeptRequirements';
import MenuDeptClearance from '../../../pages/protected/menu/menuUser/menuDepartmentClearance/menuDepartmentClearance';

// Violation
import MainViolation from '../../../pages/protected/menu/menuUser/menuViolation/MainViolation';
import SelectedVioDept from '../../../pages/protected/menu/menuUser/menuViolation/components/SelectedVioDept/SelectedVioDept'
import VioDepSettings from '../../../pages/protected/menu/menuUser/menuViolation/components/SelectedVioDept/components/VioDeptSettings/VioDepSettings'

// Activity Card
import MainActivityCards from '../../../pages/protected/menu/menuUser/menuActivityCard/MainActCard';
import SelectedActDept from '../../../pages/protected/menu/menuUser/menuActivityCard/components/SelectedActDept/SelectedActDept'

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

        const { location, history } = this.props
        
        const RouteUser = () => {
            return (
                <Switch>
                    
                    {/* HOME/INDEX */}
                    <Route  exact path={location.pathname }               render={(props) => <SelectionMyDepartments {...props} userDetails={this.props.userDetails}/>}/> 
                    
                    {/* VIOLATION SYSTEM */}
                    <Route  exact path={location.pathname + '/viol'} render={(props) => <MainViolation {...props} userDetails={this.props.userDetails}/>}/>
                    <Route  exact path={location.pathname + '/viol/:dept'} render={(props) => <SelectedVioDept {...props} userDetails={this.props.userDetails}/>}/>  
                    <Route  exact path={location.pathname + '/viol/:dept/settings'} render={(props) => <VioDepSettings {...props} userDetails={this.props.userDetails}/>}/>  

                    {/* ACTIVITY */}
                    <Route  exact path={location.pathname + '/act'} render={(props) => <MainActivityCards {...props} userDetails={this.props.userDetails}/>}/> 
                    <Route  exact path={location.pathname + '/act/:dept'} render={(props) => <SelectedActDept {...props} userDetails={this.props.userDetails}/>}/> 
                    
                    {/* DEPARTMENTS */}
                    <Route  exact path={location.pathname + '/:dept'}     render={(props) => <SelectedDepartments {...props} userDetails={this.props.userDetails}/>}/> 
                    <Route  exact path={location.pathname + '/:dept/req'} render={(props) => <ManageDeptRequirements {...props} userDetails={this.props.userDetails}/>}/> 
                    <Route  exact  path={location.pathname + '/:dept/clr'} render={(props) => <MenuDeptClearance {...props} title={`Issue Clearance`} userDetails={this.props.userDetails}/>} /> 
                    <Route  render={()=>{}}/> 
                </Switch>
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

                             <Menu.Menu position='left'>                            
                                <Menu.Item
                                    as={Link}
                                    to="/menu"
                                    name='Departments'
                                />

                                <Menu.Item
                                    as={Link}
                                    to={location.pathname + '/viol'}
                                    name='Violation'
                                />

                                <Menu.Item
                                    as={Link}
                                    to="/menu/act"
                                    name='Activity Card'
                                />
                            </Menu.Menu>                      

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
                        <RouteUser/>
                    </Container>
                </BrowserRouter>
            
            </React.Fragment>
        );
    }
}

export default withRouter(NavbarUser);