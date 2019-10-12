import React, { useEffect, useState } from 'react'
import { Table, Segment, Dropdown, Container, Modal, Radio, Button, Form, Label, Divider, Header, Tab } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import axios from 'axios';

function ManageAcadYear(props) {

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

                const result = await axios.get('http://localhost:4040/api/semester/get',header);
                
                if(xa)
                {
                    setDeptList(result.data.data);
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

            const result = await axios.get(`http://localhost:4040/api/semester/get`,header);
               
                setDeptList(result.data.data);
    
        } catch(err) {
            props.history.push('/')
        }
        
    }

    const setActSemester = async(sem_name) => {
        
        try{
            const header = {
                headers: {
                    authorization : localStorage.getItem('x')
                }
            }

            let result1 = await axios.post('http://localhost:4040/api/semester/set',{sem_name:sem_name},header);

            let result = await axios.get('http://localhost:4040/api/semester/get',header);
               
            setDeptList(result.data.data);
    
        } catch(err) {
            props.history.push('/')
        }
    }


    const componentDeptList = deptList.map((it, idx) => {
        return(
            <Table.Row key={it.id}  negative={it.state==="1"? false : true} >
                      
                <Table.Cell>
                    <Radio onClick={() =>{setActSemester(it.name)} } toggle checked={it.state==='1'?true:false}/> 
                </Table.Cell>
                <Table.Cell>{it.name}</Table.Cell>
            </Table.Row>      
        )
    })

    return(
        <Container>
            <h2>Manage Semester</h2>
            
            <Segment style={{ overflow: 'auto', maxHeight: '1000vh' }}>

                <Segment.Group horizontal>                    
                    <Table singleLine>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Active Semester</Table.HeaderCell>
                                <Table.HeaderCell>Name</Table.HeaderCell>
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
// function UpdateDepartmentModal(props) {
    
//     return(
//         <Modal onClose={props.internalRefresh()} trigger={<Button>Edit</Button>}>
//             <Modal.Header>Update Department Details</Modal.Header>
//             <Modal.Content >
                
//                 <FormUpdateDepartment deptKey={props.deptKey}/>

//             </Modal.Content>

//             <Modal.Actions>
            
//             </Modal.Actions>
//         </Modal>
//     )
// }

// // <-MANAGE USERS IN A DEPARTMENT->
// function ManageDepartmentUser(props) {
    
//     return(
//         <Modal onClose={props.internalRefresh()}  trigger={<Button color="green">Manage Users</Button>}>
//             <Modal.Header>Manage Departments Users</Modal.Header>
//                 <Modal.Content >
//                     <ManageDepartmentsUser deptKey={props.deptKey}/>
//                     </Modal.Content>
//                 <Modal.Actions>
            
//             </Modal.Actions>
//         </Modal>
//     )
// }

export default withRouter(ManageAcadYear)