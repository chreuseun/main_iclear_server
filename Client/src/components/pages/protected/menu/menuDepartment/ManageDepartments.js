import React, { useEffect, useState } from 'react'
import { Table, Segment, Dropdown, Container, Modal, Button, Form, Label, Divider, Header, Select,Input } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import baseURL from '../../../../../res/baseuri'
import axios from 'axios';

// Loader
import Loader from '../../../../reuse/loader';
import FormUpdateDepartment from './Form_UpdateDepartment';
import ManageDepartmentsUser from './ManageDepartmentsUser';


function ManageDepartment(props) {

    const optLevel = [
        {key:'0', text:'ALL', value:''},
        {key:'1', text:'GS', value:'1'},
        {key:'2', text:'JHS', value:'2'},
        {key:'3', text:'SHS', value:'3'},
        {key:'4', text:'COLLEGE', value:'4'}
    ]

    const optType = [
        {key:'0', text:'ALL', value:''},
        {key:'2', text:'TRADITIONAL', value:'2'},
        {key:'3', text:'VIOLATION', value:'3'},
        {key:'4', text:'ACTIVITY', value:'4'},
    ]

    const optState = [
        {key:'3', text:'ALL', value:''},
        {key:'1', text:'ACTIVE', value:'1'},
        {key:'0', text:'DISABLED', value:'0'},
    ]

    const { match, location, history } = props

    const [didMount, setDidMount] = useState(false)

    const [deptList, setDeptList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // filter values
    const [text, setText] = useState('');
    const [level, setLevel] = useState('');
    const [type, setType] = useState('');
    const [state, setState] = useState('');

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

                const authorization = await await axios.post(`${baseURL}/api/auth` ,{} ,header);

                if(authorization.data.msg !== 'auth' || !authorization || authorization.data.user_details.user_type_id !== 'ADMIN') {
                    localStorage.clear();
                    history.push("/");
                }
  

                const result = await axios.get(`${baseURL}/api/department/get`,header);
                console.log(result.data.sqlResult);

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
                <Table.Cell>{it.student_department}</Table.Cell>

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

    const onTextChange = (e) => {
        setText(e.target.value);
    }

    const onLevelChange = (e, {value}) => {
        setLevel(value);
        console.log(value);
    }

    const onTypeChange = (e, {value}) => {
        setType(value);
        console.log(value);
    }

    const onStateChange = (e, {value}) => {
        setState(value);
        console.log(value);
    }

    const FetchApiDisplay = async(e) => {
        try{

            const header = {
                headers: {
                    authorization : localStorage.getItem('x')
                }
            }

            const result = await axios.get(`${baseURL}/api/department/get?text=${text||''}&level=${level||''}&type=${type||''}&state=${state||''}`,header);

            console.log(result.data.sqlResult);

            setDeptList(result.data.sqlResult);

        } catch(err) {
            localStorage.clear();
            props.history.push('/')
        }
    }

    return(
        <Container>
            <h2>Manage Departments</h2>

            
            <div>
                <Form>
                    <Form.Group widths='equal'>
                        <Form.Field
                            control={Input}
                            label='Search'
                            placeholder='Search'
                            value={text}
                            onChange={onTextChange}
                        />

                        <Form.Field
                            control={Select}
                            label='Level'
                            options={optLevel}
                            placeholder='Level'
                            onChange={onLevelChange}
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
                            label='State'
                            options={optState}
                            placeholder='State'
                            onChange={onStateChange}
                        />

                        <Form.Field
                            control={Button}
                            label='Search'
                            content="Search"
                            placeholder='State'
                            onClick={ () => {
                                    FetchApiDisplay();
                                }
                            }
                        />
                    </Form.Group>
                </Form>
            </div>


            <Segment style={{ overflow: 'auto', maxHeight: '1000vh' }}>
            <Segment.Group horizontal>

                <Table singleLine>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Department</Table.HeaderCell>
                            <Table.HeaderCell>Level</Table.HeaderCell>
                            <Table.HeaderCell>Std. Dept.</Table.HeaderCell>
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