import React, { useEffect, useState } from 'react';
import { Grid, Header, Menu, Table, Message, Segment } from 'semantic-ui-react';
import { withRouter,} from 'react-router-dom';
import baseURL from '../../../../../../../../../../res/baseuri';
import axios from 'axios';

// Import Violation List 
import ViolationList from './components/Violations/ViolationList';
import ClassList from './components/Class/ViolationClass';

const ViolationSettings = (props) => {

    const { location ,match, history } = props

    const [didMount, setDidMount] = useState(false);
    const [vioDept, setVioDept] = useState({});
    const [active, setActive] = useState('Violations');

    useEffect(() => {

        setDidMount(true);
        let UpdateHook = true;

        const fetchData = async() => {
            try{
            
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                };
                
                const violationDept = await axios.post(`${baseURL}/api/department/getone`, {id:location.state.dept||''},header)

                if(UpdateHook){
                    setVioDept(violationDept.data.sqlResult[0] || {})
                }

            } catch(err) {
                console.log(err)
                history.push('/')
            }
        }

        fetchData();

        return () => (UpdateHook=false)

    },[])
    
    if(!didMount){
        return null;
    }

    const subMenOnClick = (e, {name}) => {
        setActive(name)
        console.log(name)
    }


    return(
        <React.Fragment>

            <div>
                <Header as='h2'>
                    {'Settings: '}  { vioDept.d_name || '' } {'-'} { vioDept.el_name || '' } {'   '}  { vioDept.el_id || '' }
                    <Header.Subheader>
                        Configure class and violations
                    </Header.Subheader>
                </Header>           
            </div>

            <hr></hr>

            <Grid verticalAlign='top' columns={1} >
                <Grid.Row>
                    <Grid.Column>
                            <Menu attached='top' tabular>
                                <Menu.Item
                                    name='Violations'
                                    onClick={subMenOnClick}
                                    active={active === 'Violations'}
                                />
                                
                                <Menu.Item
                                    name='Class'
                                    onClick={subMenOnClick}
                                    active={active === 'Class'}
                                />                            
                            </Menu>

                            <Segment attached='bottom'>
                                {
                                    active === 'Violations' ? 
                                        <ViolationsSubMenu /> : 
                                        <ClassSubMenu/>
                                }
                            </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

        </React.Fragment>
    )
}

const ViolationsSubMenu = (props) => {

    
    return(

        <React.Fragment>

            <Header as='h3'>
                Violation
                <Header.Subheader>
                Manage your account settings and set email preferences
                </Header.Subheader>
            </Header>
            
            <ViolationList/>
            
        </React.Fragment>  
    )
}

const ClassSubMenu = () => {
    return(

        <React.Fragment>
            <Header as='h3'>
                Class
                <Header.Subheader>
                    Manage your account settings and set email preferences
                </Header.Subheader>
            </Header>

            <ClassList/>

        </React.Fragment>

        


    )
}

const MessageEmpty =  () => {
    return(
        <Message warning>
            <Message.Header>Sorry, no departments is assigned to you.</Message.Header>
            <p>0 Results found, Visit our Admin/IT for your eligibility of dept. assignment</p>
        </Message>
    )
}

export default withRouter(ViolationSettings)

