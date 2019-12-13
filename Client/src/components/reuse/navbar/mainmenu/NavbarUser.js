import React, { useEffect, useState } from 'react';
import { withRouter, BrowserRouter} from "react-router-dom";
import { Menu,  Container, Dropdown } from 'semantic-ui-react';
import axios from 'axios'
import baseURL from '../../../../res/baseuri';

const NavbarUser = (props) => {

    const {  history } = props;

    const [didMount, setDidMount] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userDetails, setUserDetails] = useState({});

    useEffect(()=>{
        
        let UpdateHooks = true;
        setDidMount(true);
        setIsLoading(true);

        

        const getUserDetails = () => {
            console.log('/menu - useEffect() START');
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
                        console.log('/menu - useEffect() END');
                    }   
                } catch(err) {
                    console.log('/menu - useEffect Error');
                    localStorage.clear();
                    history.push("/");
                }
            };

            fetchData();

        };

        getUserDetails();

        return () => (UpdateHooks=false);
    },[])

    if(!didMount) {
        return null
    }

    // Menu navigation routes  [ /menu/dep, /menu/act, /menu/vio ]
    const pushTo = (path) => {
        history.push(path)
    }

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
                
                </Container>
            </BrowserRouter>
        
        </React.Fragment>
    );
}


export default withRouter(NavbarUser);


 // const RouteUser = () => {
    //     return (

    //         <Switch>
                
    //             {/* HOME/INDEX */}
    //             <Route  exact path={'/menu/dep' } render={(props) => <SelectionMyDepartments {...props} userDetails={userDetails} />}/> 
    //             {/* HOME/INDEX */}
                
    //             {/* VIOLATION SYSTEM */}
    //             <Route  exact path={ '/menu/viol'} render={(props) => <MainViolation {...props} userDetails={userDetails}/>}/>
    //             <Route  exact path={'/menu/viol/:dept'} render={(props) => <SelectedVioDept {...props} userDetails={userDetails}/>}/ >  
    //             <Route  exact path={'/menu/viol/:dept/settings'} render={(props) => <VioDepSettings {...props} userDetails={userDetails} />}/>  
    //             {/* VIOLATION SYSTEM */}                    

    //             {/* ACTIVITY */}
    //             <Route  exact path={'/menu/act'}       render={(props) => <MainActivityCards {...props} userDetails={userDetails}/>}/>                 
    //             <Route  exact path={'/menu/act/:dept'} render={(props) => <SelectedActDept {...props} userDetails={userDetails}/>}/>                 
    //             <Route  exact path={'/menu/act/:dept/scan'}  render={(props) => <LaunchScanner {...props} userDetails={userDetails}/>}/>
    //             {/* ACTIVITY */}

    //             {/* DEPARTMENTS */}
    //             <Route  exact path={'/menu/dep/:dept'}     render={(props) => <SelectedDepartments {...props} userDetails={userDetails}/>}/> 
    //             <Route  exact path={'/menu/dep/:dept/req'} render={(props) => <ManageDeptRequirements {...props} userDetails={userDetails}/>}/> 
    //             <Route  exact  path={'/menu/dep/:dept/clr'} render={(props) => <MenuDeptClearance {...props} title={`Issue Clearance`} userDetails={userDetails}/>} /> 
    //             <Route  render={()=>{return(null)}}/> 
    //             {/* DEPARTMENTS */}
                
    //         </Switch>
    //     )
    // }