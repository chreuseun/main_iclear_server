import React, { useEffect, useState } from 'react'
import { Table, Segment, Radio, Container } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import axios from 'axios';

function ManageUsers(props) {

 

    const [userList, setUserList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect( () => {

        const header = {
                      headers: {
                          authorization : localStorage.getItem('x')
                      }
                  }

        const x = async()=>{
            try{
                const result = await axios.post('http://localhost:4040/api/getaccounts',{},header);
                setUserList(result.data.sqlResult);
            } catch(err) {
                props.history.push('/')
            }
            
        }
        x();
        
      }, []);
    

    const { match, location, history } = props
    

    const x = userList.map((it, idx) => {
        return(
        <Table.Row key={it.id}>
            <Table.Cell>  
              <Radio toggle defaultChecked={it.state==='1'?true:false}/>
            </Table.Cell>
            <Table.Cell onClick={()=>{console.log(userList)}}>{it.user_type_id}</Table.Cell>
            <Table.Cell>{it.username}</Table.Cell>
            <Table.Cell>{it.lastname}</Table.Cell>
            <Table.Cell>{it.firstname}</Table.Cell>
            <Table.Cell>{it.middlename}</Table.Cell>
            <Table.Cell>  
              <Radio toggle defaultChecked={it.is_locked===1?true:false}/>
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