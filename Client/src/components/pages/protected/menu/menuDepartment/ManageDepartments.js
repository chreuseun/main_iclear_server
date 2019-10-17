import React, { useEffect, useState } from 'react'
import { Table, Segment, Dropdown, Container, Modal, Button, Form, Label, Divider, Header } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import baseURL from '../../../../../res/baseuri'
import axios from 'axios';

// Loader
import Loader from '../../../../reuse/loader';
import FormUpdateDepartment from './Form_UpdateDepartment';
import ManageDepartmentsUser from './ManageDepartmentsUser';


function ManageDepartment(props) {

    const { match, location, history } = props

    const [didMount, setDidMount] = useState(false)

    const [deptList, setDeptList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect( () => {
        
        setDidMount(true);
        let xa = true;
     
        const x = async()=>{
            try{

                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                }

                const result = await axios.get(`${baseURL}/api/department/get`,header);
                
                if(xa)
                {
                    setDeptList(result.data.sqlResult);
                }

                
            } catch(err) {
                props.history.push('/')
            }
            
        }
        x();

        return () => (xa=false)

      }, []);

    if(!didMount) {
        return null
    }

    const internalRefresh = async()=>{
        try{

            const header = {
                headers: {
                    authorization : localStorage.getItem('x')
                }
            }

            const result = await axios.get(`${baseURL}/api/department/get`,header);
               
                setDeptList(result.data.sqlResult);
    
        } catch(err) {
            props.history.push('/')
        }
        
    }

    const componentDeptList = deptList.map((it, idx) => {
        return(
            <Table.Row key={it.d_id}  onClick={()=>{}} negative={it.d_state==="1"? false : true} >
                        
                <Table.Cell>{it.d_name}</Table.Cell>
                <Table.Cell>{it.el_name}</Table.Cell>

                <Table.Cell>{it.d_type_name}</Table.Cell>
                <Table.Cell>{it.d_yearlevel}</Table.Cell>
                <Table.Cell>{it.d_course}</Table.Cell>

                <Table.Cell>{it.head_officer}</Table.Cell>
                <Table.Cell>{it.d_state==="1"?'ACTIVE': ''}</Table.Cell>

                <Table.Cell>                    
                    <Button.Group>
                        <UpdateDepartmentModal internalRefresh={()=>internalRefresh} deptKey={it.d_id} />
                        <Button.Or />
                        <ManageDepartmentUser internalRefresh={()=>internalRefresh}  deptKey={it.d_id}/>
                    </Button.Group>
                </Table.Cell>
            </Table.Row>      
        )
    })

    return(
        <Container>
            <h2>Manage Departments</h2>

            <Segment style={{ overflow: 'auto', maxHeight: '1000vh' }}>
            <Segment.Group horizontal>
                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Department</Table.HeaderCell>
                            <Table.HeaderCell>Level</Table.HeaderCell>
                            <Table.HeaderCell>Type</Table.HeaderCell>
                            <Table.HeaderCell>Year</Table.HeaderCell>
                            <Table.HeaderCell>Course</Table.HeaderCell>
                            <Table.HeaderCell>Head Officer</Table.HeaderCell>                        
                            <Table.HeaderCell>State</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                        <Table.Body>
                            {componentDeptList}
                        </Table.Body>
                    </Table>
                </Segment.Group>

                
            </Segment>
        </Container>  
        )
}

// <- Update Department Credentials, such a status, name, headofficers, educ_level, yearlevel and course ->
function UpdateDepartmentModal(props) {
    
    return(
        <Modal onClose={props.internalRefresh()} trigger={<Button>Edit</Button>}>
            <Modal.Header>Update Department Details</Modal.Header>
            <Modal.Content >
                
                <FormUpdateDepartment deptKey={props.deptKey}/>

            </Modal.Content>

            <Modal.Actions>
            
            </Modal.Actions>
        </Modal>
    )
}

// <-MANAGE USERS IN A DEPARTMENT->
function ManageDepartmentUser(props) {
    
    return(
        <Modal onClose={props.internalRefresh()}  trigger={<Button color="green">Manage Users</Button>}>
            <Modal.Header>Manage Departments Users</Modal.Header>
                <Modal.Content >
                    <ManageDepartmentsUser deptKey={props.deptKey}/>
                    </Modal.Content>
                <Modal.Actions>
            
            </Modal.Actions>
        </Modal>
    )
}

export default withRouter(ManageDepartment)