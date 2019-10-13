import React, { Component } from 'react';
import { withRouter, BrowserRouter, Route, Switch, Redirect, Link} from "react-router-dom";
import { Menu , Container, Dropdown } from 'semantic-ui-react';

//componets

// *** USERS
import InsertNewUser from '../../../../components/pages/protected/menu/menuAdmin/Form_AddUser';
import InsertNewAdmin from '../../../../components/pages/protected/menu/menuAdmin/Form_AddAdmin';
import ManageUser from '../../../../components/pages/protected/menu/menuAdmin/ManageUsers';

// ***  DEPARTMENTS
import InsertNewDepartment from './../../../pages/protected/menu/menuDepartment/Form_AddDepartment';
import ManageDepartments from './../../../pages/protected/menu/menuDepartment/ManageDepartments';

// *** ACADYEAR/SEMESTER
import ManageAcadYear from './../../../pages/protected/menu/menuAcadYear/AcadYear/ManageAcadYear';
import ManageSemester from './../../../pages/protected/menu/menuAcadYear/Semester/MangeSemester';

// ** STUDENT
import UploadStudent from './../../../pages/protected/menu/menuStudent/UploadCSV';

class NavbarAdmin extends Component {

    render() {
        const { match, location, history } = this.props

        return(
            <React.Fragment>

                <BrowserRouter>
                    <Menu color="black" stackable inverted  fixed='top'>
                        <Container>

                            <Link to="/menu">
                                <Menu.Item>
                                    HOME 
                                </Menu.Item>
                            </Link>

                            <Dropdown item text='Users'>
                                <Dropdown.Menu>
                                    
                                    <Dropdown.Item as={Link} to={location.pathname + '/newuser'} style={{color:'black'}}>
                                        Add User
                                    </Dropdown.Item>
                                   
                                    
                                    <Dropdown.Item as={Link} to={location.pathname + '/newadmin'} style={{color:'black'}}>
                                        Add Admin
                                    </Dropdown.Item>
                                                                  
                                    
                                    <hr/>                                    
                                    <Dropdown.Item as={Link} to={location.pathname + '/configaccount'} style={{color:'black'}}>
                                        Manage Users
                                    </Dropdown.Item>
                                   
                                </Dropdown.Menu>
                            </Dropdown>

                            <Dropdown item text='Departments'>
                                <Dropdown.Menu>
                                    <Dropdown.Item   as={Link} to={location.pathname + '/newdepartment'} >Add Department</Dropdown.Item>
                                    <hr/>
                                    <Dropdown.Item as={Link} to={location.pathname + '/configdepartment'} >Manage Departments</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

                            <Dropdown item text='Academic Year'>
                                <Dropdown.Menu>
                                  
                                    <Dropdown.Item as={Link} to={location.pathname + '/config_acad_year'}>Manage Academic Year</Dropdown.Item>
                                    <hr/>
                                    <Dropdown.Item as={Link} to={location.pathname + '/config_semester'}>Manage Semester</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>

                            <Dropdown item text='Student'>
                                <Dropdown.Menu>
                                  
                                    <Dropdown.Item as={Link} to={location.pathname + '/uploadstudent'}>Upload CSV</Dropdown.Item>
                                    <hr/>
                                    <Dropdown.Item as={Link} to={location.pathname + '/config_semester'}>Manage Students</Dropdown.Item>
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
                    
                    <Container style={{marginTop:"50px"}}>
                        <Switch>
                          <Route path={location.pathname + '/newuser'} component={InsertNewUser}/>  
                          <Route path={location.pathname + '/newadmin'} component={InsertNewAdmin}/>  
                          <Route path={location.pathname + '/configaccount'} component={ManageUser}/> 

                          <Route path={location.pathname + '/newdepartment'} component={InsertNewDepartment}/> 
                          <Route path={location.pathname + '/configdepartment'} component={ManageDepartments}/> 

                          <Route path={location.pathname + '/config_semester'} component={ManageSemester}/> 
                          <Route path={location.pathname + '/config_acad_year'} component={ManageAcadYear}/> 

                          <Route path={location.pathname + '/uploadstudent'} component={UploadStudent}/> 
                        </Switch>
                    </Container>
                </BrowserRouter>
            </React.Fragment>
        );
    }
}

export default withRouter(NavbarAdmin);