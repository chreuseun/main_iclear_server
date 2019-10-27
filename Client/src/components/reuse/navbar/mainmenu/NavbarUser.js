import React, { Component } from 'react';
import { withRouter, BrowserRouter, Route, Switch, Redirect, Link} from "react-router-dom";
import { Menu,  Container, Dropdown, Header } from 'semantic-ui-react';

//componets
import SelectionMyDepartments from '../../../pages/protected/menu/menuUser/menuMyDepartments/SelectionMyDepartments'
import SelectedDepartments from '../../../pages/protected/menu/menuUser/menuMyDepartments/components/SelectedDepartment'
import ManageDeptRequirements from '../../../pages/protected/menu/menuUser/menuMyDepartments/components/manageDeptRequirement.js/manageDeptRequirements';
import MenuDeptClearance from '../../../pages/protected/menu/menuUser/menuDepartmentClearance/menuDepartmentClearance';

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
        console.log(this.props.userDetails)

        const RouteUser = () => {
            return (
                <Switch>
                    <Route  exact path={location.pathname }               render={(props) => <SelectionMyDepartments {...props} userDetails={this.props.userDetails}/>}/> 
                    <Route  exact path={location.pathname + '/:dept'}     render={(props) => <SelectedDepartments {...props} userDetails={this.props.userDetails}/>}/> 
                    <Route  exact path={location.pathname + '/:dept/req'} render={(props) => <ManageDeptRequirements {...props} userDetails={this.props.userDetails}/>}/> 
                    <Route  exact path={location.pathname + '/:dept/clr'} render={(props) => <MenuDeptClearance {...props} title={`Issue Clearance`} userDetails={this.props.userDetails}/>} /> 
                    <Route  render={()=>{}}/> 
                </Switch>
            )
        }

        const RouteSubject = () => {
            return (
                <Switch>
                    
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
                        
                        <Header>{this.props.userDetails.user_type_id}</Header>
                    

                        {this.props.userDetails.user_type_id==='USER'?
                            <RouteUser/> : <RouteSubject/>}
                        

                    </Container>
                </BrowserRouter>
            
            </React.Fragment>
        );
    }
}

export default withRouter(NavbarUser);