import React, { useEffect, useState } from 'react';
import { Grid, Header, Button, Table, Menu, Message, Segment, Modal, Divider } from 'semantic-ui-react';
import { withRouter, Link} from 'react-router-dom';
import baseURL from '../../../../../../../../../../res/baseuri';
import axios from 'axios';

// Show ModalAddEvent
import ModalAddEvent from './components/ModalAddEvent/ModalAddEvent';
import TableEventList from './components/TableEventList/TableEventList';
import { withStatement } from '@babel/types';

const Event = (props) => {

    const {location, match, history } = props;

    const [eventList, setEventList] = useState([]);

    useEffect(()=>{ 
        // http://192.168.100.10:4040/api/activity/121/events
        

        const fetchData = async() => {
            try{
            
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                };
                
                // /activity/user
                console.log()

                const fetchElDept = await axios.get(`${baseURL}/api/activity/${location.state.dept}/events`, header);

                if(fetchElDept.data.data){
                    setEventList(fetchElDept.data.data || [])
                }

                console.log( `all Events: ` , fetchElDept.data.data)

            } catch(err) {
                // localStorage.removeItem('x')
                console.log(err)
                history.push('/')
            }
        }

        fetchData();

    }, [])
    
    const refreshEventList = () => {
        const fetchData = async() => {
            try{
            
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                };
                

                const fetchElDept = await axios.get(`${baseURL}/api/activity/${location.state.dept}/events`, header);

                if(fetchElDept.data.data){
                    setEventList(fetchElDept.data.data || [])
                    console.log('New Event Added: ', fetchElDept.data.data)
                }
                // console.log( `all Events: ` , fetchElDept.data.data)

            } catch(err) {
                // localStorage.removeItem('x')
                console.log(err)
                history.push('/')
            }
        }

        fetchData();
    }

    return(
        <React.Fragment>
            <Header
                as='h3'
                content='Manage Events'
                subheader='Manage your events details'
            />

            {/*  Menu button to show add new event form */}
            <Menu secondary>


            <Menu.Menu position='left'>
                    <Menu.Item>
                        <Button primary>
                            Launch Scanner
                        </Button>

                        <a rel="noopener noreferrer" href="/scanner" target="_blank">Link Here</a>
                    </Menu.Item>
                </Menu.Menu>

                <Menu.Menu position='right'>
                    <Menu.Item>
                        <ModalAddEvent {...props} log={refreshEventList} />
                    </Menu.Item>
                </Menu.Menu>

            </Menu>

            <TableEventList {...props} eventList={eventList} />

        </React.Fragment>
    )
}

export default withRouter(Event);