import React, { useEffect, useState } from 'react';
import { Grid, Header, Button, Table, Menu, Message, Segment, Modal, Form } from 'semantic-ui-react';
import { withRouter, Link} from 'react-router-dom';
import baseURL from '../../../../../../../../../../../../res/baseuri';
import axios from 'axios';


const ModalAddEvent = (props) => {

    const { history } = props;

    const [type, setType] = useState([]);
    const [elDept, setElDept] =useState([]);

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

    return(
        <Modal size={'fullscreen'}

            trigger={
                <Button animated='fade'
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
            <FormNewEventDetails {...props} log={props.log} el_dept={elDept}  typesAct={type || []}/>
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

    const { history } = props;
      // Insert Values
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [department, setDepartment] = useState('');

    const options = props.typesAct || [];
    const el_dept = props.el_dept || [];
      
    const deptOnChange = (e, {value}) => {
        console.log(value)
        setDepartment(`${value}`)

    }

    const typeOnChange = (e, {value}) => {
        console.log(value)
        setType(value)

    }

    const onSaveButtonClicked = () => {


        const AddEventInTable = async() => {
            try{

                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                };

                let body = {
                    name:name ,                    
                    type ,
                    department ,
                    dep_id: props.location.state.dept,
                    acc_id: props.userDetails.id
                }

                const postApiAddNewEvent = await axios.post(`${baseURL}/api/activity/event/add`, body, header);

                console.log(postApiAddNewEvent)
            } catch(err) {
                // localStorage.removeItem('x')
                console.log(err)
                history.push('/')
            }
        }

        if(name === '' || type === '' || department === '' || !props.location.state.dept || !props.userDetails.id){
            alert('All fields requires values...')
        }else{
            AddEventInTable();

            setName('');
            setType('');
            setDepartment('');
            alert('New Event saved');
            props.log();
        }
        
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