import React, { useEffect, useState } from 'react'
import { Table, Segment, Radio, Container, Form, Input, Checkbox, Button, Select } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import baseURL from '../../../../../res/baseuri'

function ManageUsers(props) {

    const uri = {
        getAccounts:`${baseURL}/api/getaccounts`
    }

    const [userList, setUserList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // filters
    const [text, setText] = useState('');
    const [type, setType] = useState('');
    const [locked, setLocked] = useState('');
    const [state, setState] = useState('');

    useEffect( () => {

        const x = async()=>{
            try{
            
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                }

                const fetch = await axios.post(uri.getAccounts,{},header);

                const authorization = await axios.post(`${baseURL}/api/auth` ,{} ,header);

                if(authorization.data.msg !== 'auth' || !authorization || authorization.data.user_details.user_type_id !== 'ADMIN') {
                    localStorage.clear();
                    history.push("/");
                }

                setUserList(fetch.data.sqlResult);

            } catch(err) {
                localStorage.clear();
                history.push('/');
            }
        }
        x();
        
      }, []);

    const optType = [
        {key:'ALL',text:'ALL', value:''},
        {key:'ADMIN',text:'ADMIN', value:'ADMIN'},
        {key:'USER',text:'USER', value:'USER'},
        {key:'SUBJECT',text:'SUBJECT', value:'SUBJECT'}
    ]

    const optLocked = [
        {key:'ALL',text:'ALL', value:''},
        {key:'1',text:'YES', value:'1'},
        {key:'0',text:'NOT', value:'0'}
    ]

    const optState = [
        {key:'ALL',text:'ALL', value:''},
        {key:'1',text:'Active', value:'1'},
        {key:'0',text:'Inactive', value:'0'},
    ]
    
    const { match, location, history } = props
    

    const setAccountState = async(acc_id) => {
        try{
            
            const header = {
                headers: {
                    authorization : localStorage.getItem('x')
                }
            }

            // INSERT 
            await axios.post(`${baseURL}/api/accounts/state/set`,{acc_id},header);
            
            const result = await axios.post(`${baseURL}/api/getaccounts`,{},header);

            setUserList(result.data.sqlResult);
        } catch(err) {
            history.push('/')
        }

    }

    const setAccountLock = async(acc_id) => {
        console.log(acc_id)
        try{
            
            const header = {
                headers: {
                    authorization : localStorage.getItem('x')
                }
            }

            // INSERT 
            const result1 = await axios.post(`${baseURL}/api/accounts/islocked/set`,{acc_id},header);
            
            const result = await axios.post(`${baseURL}/api/getaccounts`,{},header);

            setUserList(result.data.sqlResult);
        } catch(err) {
            history.push('/')
        }
    }

    const x = userList.map((it, idx) => {
        return(
        <Table.Row key={it.id}>
            <Table.Cell>  
              <Radio toggle onClick={()=>{setAccountState(it.id)}}   checked={it.state==='1'?true:false}/>
            </Table.Cell>
            <Table.Cell>{it.user_type_id}</Table.Cell>
            <Table.Cell>{it.username}</Table.Cell>
            <Table.Cell>{it.lastname}</Table.Cell>
            <Table.Cell>{it.firstname}</Table.Cell>
            <Table.Cell>{it.middlename}</Table.Cell>
            <Table.Cell>  
              <Radio toggle onClick={()=>{setAccountLock(it.id)}} checked={it.is_locked===1?true:false}/>
            </Table.Cell>
            <Table.Cell>{it.contact_number}</Table.Cell>
        </Table.Row>)
    });

    const FormFilterApi = async()=>{
        try{
        
            const header = {
                headers: {
                    authorization : localStorage.getItem('x')
                }
            }

            const fetch = await axios.post(`${baseURL}/api/getaccounts?text=${text}&type=${type}&locked=${locked}&state=${state}` ,{},header);

           
            setUserList(fetch.data.sqlResult);

        } catch(err) {
            localStorage.clear();
            history.push('/');
        }
    }

    const onTextChange = (e) => {
        setText(e.target.value);
    }

    const onTypeChange = (e,{value}) => {
        setType(value)
    }

    const onLockedChange = (e,{value}) => {
        setLocked(value)
    }

    const onStateChange = (e,{value}) => {
        setState(value)
    }



    return(

        <Container>
            <h2>Manage Users</h2>

            <Segment style={{ overflow: 'auto', maxHeight: '1000vh' }}>

            <div>
                <Form>
                    <Form.Group widths='equal'>
                        <Form.Field
                            control={Input}
                            label='Search'
                            placeholder='Search name'
                            value={text}
                            onChange={onTextChange}
                        />

                        <Form.Field
                            control={Select}
                            label='Type'
                            options={optType}
                            placeholder='Type'
                            onChange={onTypeChange}
                        />

                        <Form.Field
                            control={Select}
                            label='Locked'
                            options={optLocked}
                            placeholder='Locked'
                            onChange={onLockedChange}
                        />

                        <Form.Field
                            control={Select}
                            label='State'
                            options={optState}
                            placeholder='State'
                            onChange={onStateChange}
                        />

                        <Form.Field
                            control={Button}
                            label='Search'
                            onClick={()=>{
                                FormFilterApi();
                            }}
                            content="Search"
                            placeholder='State'
                        />
                    </Form.Group>
                </Form>
            </div>
            
            <Segment.Group horizontal>

            

            <Table singleLine>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>State</Table.HeaderCell>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Username</Table.HeaderCell>
                        <Table.HeaderCell>Lastname</Table.HeaderCell>
                        <Table.HeaderCell>Firstname</Table.HeaderCell>
                        <Table.HeaderCell>Middlename</Table.HeaderCell>                        
                        <Table.HeaderCell>Locked</Table.HeaderCell>
                        <Table.HeaderCell>Contact #</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                 
                    {x}

                </Table.Body>
            </Table>

            </Segment.Group>
        </Segment>
        </Container>

        
    
        
        )
    }


export default withRouter(ManageUsers)