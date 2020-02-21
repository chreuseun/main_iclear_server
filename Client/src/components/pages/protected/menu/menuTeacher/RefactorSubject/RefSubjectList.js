import React, { useEffect, useState } from 'react';
import { withRouter, BrowserRouter, Route, Switch, Link} from "react-router-dom";
import { Menu,  Container, Dropdown } from 'semantic-ui-react';
import axios from 'axios'
import baseURL from '../../../../../../res/baseuri';

//componets TRADIONAL
import SubjectList  from '../subjectlist/subjectlist';  //./../../pages/protected/menu/menuUser/menuMyDepartments/SelectionMyDepartments'

const NavbarUser = (props) => {

    const { match ,location, history } = props;

    const [didMount, setDidMount] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userDetails, setUserDetails] = useState({});

    useEffect(()=>{
        
        let UpdateHooks = true;
        setDidMount(true);
        setIsLoading(true);

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

                    if(result.data.msg !== 'auth' || !result || result.data.user_details.user_type_id !== 'USER') {
                        localStorage.clear();
                        history.push("/");
                    }
                    
                    if(UpdateHooks) {        
                        setUserDetails(result.data.user_details);
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
        return null
    }
      
    // to other page 
    const pushToLink = (push) => {
        history.push(push)
    };

    // route [ /menu/dep. /menu/act, /menu/vio ]
    const pushTo = (path) => {
        history.push(path)
    };

    return(
        <React.Fragment>

            <BrowserRouter>
                <Menu color='blue' style={{}} stackable inverted  fixed='top'>
                    <Container>

                        <Menu.Item
                            onClick={()=>pushTo('/menu')}
                        >
                            HOME 
                        </Menu.Item>

                            <Menu.Menu position='left'>                            
                            <Menu.Item
                                onClick={()=>pushTo("/menu/dep")}
                                name='Departments'
                            />

                            <Menu.Item
                                onClick={()=>pushTo("/menu/viol")}
                                name='Violation'
                            />

                            <Menu.Item
                                onClick={()=>pushTo("/menu/act")}
                                name='Activity Card'
                            />
                        </Menu.Menu>                      

                        <Menu.Menu position='right'>                            
                            <Dropdown item text={'Welcome, ' + userDetails.username || ''}>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={()=>{localStorage.clear();history.push('/')}} >Sign-Out</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Menu>
                    </Container>  
                </Menu>

                <Container   style={{marginTop:"100px", padding:'20px'}}>


                    {/* <SubjectList pushToLink={pushToLink} userDetails={userDetails} /> */}
                    
                </Container>
            </BrowserRouter>
        
        </React.Fragment>
    );
}


export default withRouter(NavbarUser);

