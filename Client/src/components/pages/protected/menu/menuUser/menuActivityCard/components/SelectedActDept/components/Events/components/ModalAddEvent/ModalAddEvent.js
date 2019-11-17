import React, { useEffect, useState } from 'react';
import { Grid, Header, Button, Table, Menu, Message, Segment, Modal, Form } from 'semantic-ui-react';
import { withRouter, Link} from 'react-router-dom';
import baseURL from '../../../../../../../../../../../../res/baseuri';
import axios from 'axios';


const ModalAddEvent = (props) => {

    const {location, match, history } = props;

    const [type, setType] = useState([]);
    const [elDept, setElDept] =useState([])

    const apiFetchEventType = () => {
        
        const fetchData = async() => {
            try{
            
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                };

                const fetchActivityType = await axios.get(`${baseURL}/api/activity/types`, header);
                const fetchDeptDetails= await axios.get(`${baseURL}/api/activity/user`, header);
                
                // /activity/user
                console.log()
                let el_id = fetchDeptDetails.data.data[0].el_id || '';

                const fetchElDept = await axios.get(`${baseURL}/api/departments/coursedepartment/${el_id}`, header);

                console.log( `AcitivityType: ` , fetchActivityType.data.data)
                console.log( `el_dept: ` , fetchElDept.data.data)

                setType(fetchActivityType.data.data)
                setElDept(
                    fetchElDept.data.data.filter((it)=>{return(it.key!== 'ALL')}
                ));


            } catch(err) {
                // localStorage.removeItem('x')
                console.log(err)
                history.push('/')
            }
        }

        fetchData();
    }

    console.log('ModalAddevent Props: ', props)

    return(
        <Modal size={'fullscreen'}

            trigger={
                <Button animated='fade'
                    // as={Link}
                    // to={props.location.pathname + `/settings`}
                    secondary
                >
                    <Button.Content visible>{'New Event'}</Button.Content>
                    <Button.Content hidden>{'New Event'}</Button.Content>
                </Button> 
            }

            onOpen={()=>{console.log('Modal Form Add Event: OPENING...'); apiFetchEventType()}}
        >
          <Modal.Header>New Event Details</Modal.Header>
          
          <Modal.Content>
            <FormNewEventDetails {...props} el_dept={elDept}  typesAct={type || []}/>
          </Modal.Content>

          <Modal.Actions>
            <Button
              positive
              labelPosition='right'
              content='Save'
            />
          </Modal.Actions>
        </Modal>
    )
}

const FormNewEventDetails = (props) => {


      // Insert Values
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [department, setDepartment] = useState('');

    const options = props.typesAct || [];
    const el_dept = props.el_dept || [];
      
    /*
    INSERT INTO events
        (
        `departments_id`, -- this the dept ID
        `events_type_id`, -- DropDown
        `name`, -- TextINput
        `semester_id`, -- Current Active Sem query
        `acad_year_id`, -- CurrentActive Sem QUery
        `course`, -- ALL
        `yearlevel`, -- ALL 
        `student_department`, -- SELECT
        `creator_account_id`, --account_id)


        `name`, -- TextINput
        `events_type_id`, -- DropDown
        `student_department` -- Drop Down

        `yearlevel`, -- ALL 
        `course` -- ALL
        
    */

    const deptOnChange = (e, {value}) => {
        console.log(value)
        setDepartment(`${value}`)

    }

    const typeOnChange = (e, {value}) => {
        console.log(value)
        setType(value)

    }

    const onSaveButtonClicked = () => {
        console.log(
            'UserAccountId: ', props.userDetails.id || ''
        )

        console.log(
            'ActivityDepartmentId: ', props.match.params.dept || ''
        )

        console.log(
            'EventName: ', name || ''
        )

        console.log(
            'type_id: ', type || ''
        )

        console.log(
            'department: ', department || ''
        )
    }

    return (
        <Form>
            <Form.Group widths='equal'>

                <Form.Select
                    fluid
                    label='Type'
                    options={options}
                    placeholder='Type'
                    search
                    onChange={typeOnChange}
                    value={type}
                />

                <Form.Select
                    fluid
                    label='Department'
                    options={el_dept}
                    placeholder='Department'
                    search
                    onChange={deptOnChange}
                    value={department}
                />

                <Form.Input 
                    value={name}
                    onChange={(e)=>{setName(e.target.value)}}
                    fluid label='Event Name'
                    placeholder='Event Name' />
 
            </Form.Group>
        
            <Form.Button
                onClick={()=>{onSaveButtonClicked()}}
            >
            Submit
            </Form.Button>
        </Form>
    )
}

export default ModalAddEvent;