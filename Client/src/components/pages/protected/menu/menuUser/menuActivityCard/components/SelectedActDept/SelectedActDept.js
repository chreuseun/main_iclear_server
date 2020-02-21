import React, { useEffect, useState } from 'react';
import { Grid, Header, Button, Table, Menu, Message, Segment, Modal, Divider } from 'semantic-ui-react';
import { withRouter, Link} from 'react-router-dom';
import baseURL from '../../../../../../../../res/baseuri';
import axios from 'axios';

// SUBMENU CONTAINERS
import Events from './components/Events/Event';
import Records from './components/Records/Records'

const SelectedActivityDept = (props) => {

    
    const { location , history } = props

    const [actDeptInfo, setActDeptInfo] = useState({});
    const [subMenu, setSubMenu] = useState('Events');
   
    useEffect(() => {

        let UpdateHook = true;

        const fetchData = async() => {
            try{
            
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                };

                const actDeptDetailes = await axios.post(`${baseURL}/api/department/getone`, {id:location.state.dept || ''},header)

                if(UpdateHook){
                    setActDeptInfo(actDeptDetailes.data.sqlResult[0] || {});
                    console.log(`ActDepInfo: ` ,actDeptDetailes.data.sqlResult[0])
                }

            } catch(err) {
                // localStorage.removeItem('x')
                console.log(err)
                history.push('/')
            }
        }

        fetchData();

        return () => (UpdateHook=false)

    },[])

    const subMenOnClick = (e, {name}) => {
        setSubMenu(name);
    }

    const ActiveSubmenu = () => {

        if(subMenu === 'Events') 
        {return(<Events {...props} actDeptInfo={actDeptInfo}/>)}

        if(subMenu === 'Records') 
        {return(<Records {...props}/>)}

    }

    return(
        <React.Fragment>
            <div>
                <Header as='h2'>
                    { actDeptInfo.d_name || '' } {'-'} { actDeptInfo.el_name || '' }
                    
                    <Header.Subheader>
                        Manage our student Activity records and dept. settings
                    </Header.Subheader>
                </Header>        
            </div>
            <hr></hr>

            <div>

                <Menu attached='top' tabular>

                    <Menu.Item
                        name='Events'
                        onClick={subMenOnClick}
                        active={subMenu === 'Events'}
                    />

                    <Menu.Item
                        name='Records'
                        onClick={subMenOnClick}
                        active={subMenu === 'Records'}
                    />
                </Menu>

                <Segment attached='bottom'>
                    { <ActiveSubmenu  {...props}/> }
                </Segment>
            </div>

        </React.Fragment>
    )

}



export default withRouter(SelectedActivityDept)




/*
const MessageEmpty =  () => {
    return(
        <Message warning>
            <Message.Header>Sorry, no departments is assigned to you.</Message.Header>
            <p>0 Results found, Visit our Admin/IT for your eligibility of dept. assignment</p>
        </Message>
    )
}

*/
