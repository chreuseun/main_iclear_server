import React, { useEffect, useState } from 'react'
import { Table, Segment, Radio, Container } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import baseURL from '../../../../../res/baseuri';

// peripheral components
import Loader from '../../../../reuse/loader';

function ManageUsers(props) {

    const [didMount, setDidMount] = useState(false)

    const [userList, setUserList] = useState([]);
    const [deptDetails, setDeptDetails] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    useEffect( () => {
        setDidMount(true);
        let xa = true

        const x = async()=>{
            try{

                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                }

                const result = await axios.get(`${baseURL}/api/departments/${props.deptKey}/users`,header);

                console.log()

                if(xa) {
                    setUserList(result.data.data.deptUser);
                    setDeptDetails(result.data.data.department);
                    setIsLoading(false);
                }

            } catch(err) {
                history.push('/')
            }   
        }

        x();

        return () => (xa=false)
        
      }, []);

    if(!didMount) {
        return null
    }

    const { match, location, history } = props

    const RefreshUserList = async(isMember, acc_id)=>{
        try{
         

           let api_uri = {};

           const header = {
            headers: {
                authorization : localStorage.getItem('x')
            }
            }

            isMember === "1" ? api_uri.action = `${baseURL}/api/departments/users/delete`
                           : api_uri.action = `${baseURL}/api/departments/users/add`


            const deptUserResult = await axios.post(api_uri.action, { acc_id:acc_id, dep_id:props.deptKey },header);

            console.log(deptUserResult.data)

            const result = await axios.get(`${baseURL}/api/departments/${props.deptKey}/users`,header);

            

            setUserList(result.data.data.deptUser);
            setDeptDetails(result.data.data.department);
            
        
        } catch(err) {
            props.history.push('/')
        }   
    }

    const UserItems = userList.map((it, idx) => {
        return(
        <Table.Row key={it.acc_id}>

            <Table.Cell>  
              <Radio toggle onClick={ () => {RefreshUserList(it.is_member,it.acc_id)}} checked={it.is_member==="1"? true : false}/>
            </Table.Cell>

            <Table.Cell>{it.username}</Table.Cell>
            <Table.Cell>{it.lastname}</Table.Cell>
            <Table.Cell>{it.firstname}</Table.Cell>
            <Table.Cell>{it.middlename}</Table.Cell>

            
        </Table.Row>)
    })


    if(isLoading) {
        return(<Loader/>)
    }

    return(
        <Container>
         
         <h3>{deptDetails.d_name}</h3>
           <Segment style={{ overflow: 'auto', maxHeight: '1000vh' }}>
            <Segment.Group horizontal>
             
              <Table singleLine>
                  <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Add User</Table.HeaderCell>
                        <Table.HeaderCell>Username</Table.HeaderCell>
                        <Table.HeaderCell>Lastname</Table.HeaderCell>
                        <Table.HeaderCell>Firstname</Table.HeaderCell>
                        <Table.HeaderCell>Middlename</Table.HeaderCell>                        
                      </Table.Row>
                  </Table.Header>

                  <Table.Body>
                      {UserItems}
                  </Table.Body>
              </Table>

            </Segment.Group>
        </Segment>
        </Container>
        )
    }


export default withRouter(ManageUsers)
