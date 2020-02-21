import React, { useEffect, useState } from 'react';
import { withRouter, BrowserRouter, Route, Switch, Link} from "react-router-dom";
import { Menu , Container, Dropdown } from 'semantic-ui-react';
import axios from 'axios';
import baseURL from '../../../../res/baseuri'; 

//COMPONENTS LIST *******************************************************************************

// *** USERS
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
import StudentList from './../../../pages/protected/menu/menuStudent/StudentList';

const NavbarAdmin = (props) => {

    const { location, history, match } = props;

    const [didMount, setDidMount] = useState(false);
    const [userDetails, setUserDetails] = useState({});
    const [activeOption, setActiveOption] = useState({});

    // Use Effect Part
    useEffect(()=> {

        let UpdateHooks = true;
        setDidMount(true);

        console.log('NavbarAdmin:  ','useEffect - Data');

        const getUserDetails = () => {

            const fetchData = async() => {

                try{
                
                    const header = {
                        headers: {
                            authorization : localStorage.getItem('x')
                        }
                    };

                    const result = await await axios.post(`${baseURL}/api/auth` ,{} ,header);

                    if(result.data.msg !== 'auth' || !result || result.data.user_details.user_type_id !== 'ADMIN') {
                        localStorage.clear();
                        history.push("/");
                    }
                    
                    if(UpdateHooks) {        
                        setUserDetails(result.data.user_details);
                        setActiveOption(location.pathname); 
                    }   
                } catch(err) {
                    localStorage.clear();
                    history.push("/");
                }
            };

            fetchData();

            return () => (UpdateHooks=false);
        };

        getUserDetails();

        return () => (UpdateHooks=false);

    },[]);

    if(!didMount) {
        return null;
    }

    const pushTo = (path) => {
        history.push(path)
    }

    const SubmenuComponent = () => {
        
        // ON GOING - DONE
        if( location.pathname  === '/menu/newuser') {
            return(
               <InsertNewAdmin/> 
            )
        } 
        // ON GOING - DONE
        else if( location.pathname  === '/menu/configaccount') {
            return(
               <ManageUser/> 
            )
        } 
        // ON GOING - DONE
        else if( location.pathname  === '/menu/newdepartment'){
            return(
                <InsertNewDepartment/> 
             )
        } 
        // ON GOING - DONE
        else if( location.pathname  === '/menu/configdepartment'){
            return(
                <ManageDepartments/> 
             )
        }
        // ON GOING - DONE
        else if( location.pathname  === '/menu/config_acad_year'){
            return(
                <ManageAcadYear/> 
             )
        } else if( location.pathname  === '/menu/config_semester'){
            return(
                <ManageSemester/> 
             )
        } else if( location.pathname  === '/menu/uploadstudent'){
            return(
                <UploadStudent/> 
             )
        } else if( location.pathname  === '/menu/students'){
            return(
                <StudentList/> 
             )
        } else {
            return(null)
        }
    }

    return(
        <React.Fragment>

            <BrowserRouter>

                <Menu color="blue" stackable inverted  fixed='top'>
                    <Container>

                        <Menu.Item
                             item text='Users'
                            onClick={()=>pushTo('/menu')}>
                            HOME 
                        </Menu.Item>
                   
                        <Dropdown item text='Users'>
                            <Dropdown.Menu>
                                                                    
                                <Dropdown.Item 
                                    style={{color:'black'}}
                                    onClick={()=>pushTo('/menu/newuser')}>
                                    Add User
                                </Dropdown.Item>
                                                                
                                
                                <hr/>        

                                <Dropdown.Item 
                                    style={{color:'black'}}
                                    onClick={()=>pushTo('/menu/configaccount')}>
                                    Manage Users
                                </Dropdown.Item>
                                
                            </Dropdown.Menu>
                        </Dropdown>

                        <Dropdown item text='Departments'>
                            <Dropdown.Menu>
                                <Dropdown.Item  
                                    style={{color:'black'}}
                                    onClick={()=>pushTo('/menu/newdepartment')}>
                                    Add Department
                                </Dropdown.Item>

                                <hr/>

                                <Dropdown.Item 
                                    style={{color:'black'}}
                                    onClick={()=>pushTo('/menu/configdepartment')}>
                                    Manage Departments
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        <Dropdown item text='Academic Year'>
                            <Dropdown.Menu>
                                
                                <Dropdown.Item 
                                    style={{color:'black'}}
                                    onClick={()=>pushTo('/menu/config_acad_year')}>
                                    Manage Academic Year
                                </Dropdown.Item>

                                <hr/>

                                <Dropdown.Item 
                                    style={{color:'black'}}
                                    onClick={()=>pushTo('/menu/config_semester')}>
                                    Manage Semester
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        <Dropdown item text='Student'>
                            <Dropdown.Menu>
                                
                                <Dropdown.Item 
                                    style={{color:'black'}}
                                    onClick={()=>pushTo('/menu/uploadstudent')}>
                                    Upload CSV
                                </Dropdown.Item>
                                <hr/>
                                <Dropdown.Item
                                    style={{color:'black'}}
                                    onClick={()=>pushTo('/menu/students')}>
                                    Manage Students
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        <Menu.Menu position='right'>                            
                            <Dropdown item text={'Welcome, ' + userDetails.username || ''}>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={()=>{localStorage.clear(); history.push('/')}} >Sign-Out</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Menu>
                    </Container>  
                </Menu>
                
                <Container style={{marginTop:"50px"}}>
                        <SubmenuComponent/>
                </Container>

            </BrowserRouter>

        </React.Fragment>
    );   
}

export default withRouter(NavbarAdmin);


