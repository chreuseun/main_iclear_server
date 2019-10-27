import React, { useEffect, useState } from 'react';
import { withRouter, BrowserRouter, Route, Switch, Redirect, Link} from "react-router-dom";
import { Menu,  Container, Dropdown, Header,Segment, Sidebar,Image, Grid } from 'semantic-ui-react';

//componets
import SelectionMyDepartments from '../../../pages/protected/menu/menuUser/menuMyDepartments/SelectionMyDepartments'
import SelectedDepartments from '../../../pages/protected/menu/menuUser/menuMyDepartments/components/SelectedDepartment'
import ManageDeptRequirements from '../../../pages/protected/menu/menuUser/menuMyDepartments/components/manageDeptRequirement.js/manageDeptRequirements';
import MenuDeptClearance from '../../../pages/protected/menu/menuUser/menuDepartmentClearance/menuDepartmentClearance';
import SubjectList from '../../../pages/protected/menu/menuTeacher/subjectlist/subjectlist'

const NavbarUser = (props) => {
    
    const { match, location, history } = props
    const [isLoading, setIsLoading] = useState(true);
    const [didMount ,setDidMount] = useState(false); 
    

    useEffect(()=>{
        setDidMount(true);
    },[]) 

    if(!didMount) {
        return null
    }

    // <SelectionMyDepartments {...props} userDetails={props.userDetails}/>
    const RouteUser = (data) => {
        return (
            <Switch>
                <Route  exact path={location.pathname }               render={(props) => <SubjectList {...props} userDetails={data.userDetails} />}/> 
                <Route  exact path={location.pathname + '/:dept'}     render={(props) => <SelectedDepartments {...props} userDetails={data.userDetails}/>}/> 
                <Route  exact path={location.pathname + '/:dept/req'} render={(props) => <ManageDeptRequirements {...props} userDetails={data.userDetails}/>}/> 
                <Route  exact path={location.pathname + '/:dept/clr'} render={(props) => <MenuDeptClearance {...props} title={`Issue Clearance`} userDetails={data.userDetails}/>} /> 
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

                        <Menu.Menu position='right'>                            
                            <Dropdown item text={'Welcome, ' + props.userDetails.username}>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={()=>{localStorage.clear();history.push('/')}} >Sign-Out</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Menu>
                    </Container>  
                </Menu>

                <Container style={{marginTop:"100px",background:'#F8F8F8',padding:'20px'}}>
                    <RouteUser userDetails={props.userDetails}/>
                </Container>
            </BrowserRouter>
        
        </React.Fragment>
    );
}

const Sidemenu= (props) => {

    return(
        <Grid.Row stretched>
            <Container style={{height:'100%'}}>

                <Sidebar.Pushable style={{height:'100%'}} as={Segment}>


                <Sidebar
                    style={{background:'#afc2cb' }}
                    as={Menu}
                    animation={'push'}
                    direction={'left'}
                    icon='labeled'
                    inverted
                    vertical
                    visible={true}
                    width='thin'
                    >
                        <Container >
                        <h1 style={{color:'#ffffff',paddingTop:'5px',paddingBottom:'5px'}}>Menu</h1>
                        </Container>
                        <Menu.Item as='a'>
                        Home
                        </Menu.Item>
                        <Menu.Item as='a'>
                        Games
                        </Menu.Item>
                        <Menu.Item as='a'>
                        Channels
                        </Menu.Item>
                
                    </Sidebar>
            

                <Sidebar.Pusher>
                    <Segment stretched style={{height: '100vh'}} basic>
                    <Header as='h3'>Application Content</Header>
                    <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                    </Segment>
                </Sidebar.Pusher>
                </Sidebar.Pushable>

            </Container>
        </Grid.Row>
    )
}   

export default withRouter(NavbarUser);