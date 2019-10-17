import React, { useEffect, useState } from 'react'
import { Table, Segment, Radio, Container } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import baseURL from '../../../../../res/baseuri'

function ManageUsers(props) {

    const uri = {
        getAccounts:`${baseURL}/api/getaccounts`
    }

    const [userList, setUserList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect( () => {

        const x = async()=>{
            try{
            
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                }

                const result = await axios.post(uri.getAccounts,{},header);
                setUserList(result.data.sqlResult);
            } catch(err) {
                history.push('/')
            }
            
        }
        x();
        
      }, []);
    
    const { match, location, history } = props
    

    const setAccountState = async(acc_id) => {
        try{
            
            const header = {
                headers: {
                    authorization : localStorage.getItem('x')
                }
            }

            // INSERT 
            const result1 = await axios.post(`${baseURL}/api/accounts/state/set`,{acc_id},header);
            
            const result = await axios.post(`${baseURL}:4040/api/getaccounts`,{},header);

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
            <Table.Cell>{it.updated_at}</Table.Cell>
        </Table.Row>)
    })

    return(

        <Container>
            <h2>Manage Users</h2>

            <Segment style={{ overflow: 'auto', maxHeight: '1000vh' }}>
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
                        <Table.HeaderCell>Update At</Table.HeaderCell>
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