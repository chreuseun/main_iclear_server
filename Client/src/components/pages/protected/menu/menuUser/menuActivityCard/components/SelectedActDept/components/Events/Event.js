import React, { useEffect, useState } from 'react';
import { Grid, Header, Button, Form, Menu, Message, Segment, Modal, Divider, CommentActions, Table } from 'semantic-ui-react';
import { withRouter, Link} from 'react-router-dom';
import baseURL from '../../../../../../../../../../res/baseuri';
import axios from 'axios';

// Show ModalAddEvent
import TableEventList from './components/TableEventList/TableEventList';

const Event = (props) => {

    const {location, history } = props;

    const [eventList, setEventList] = useState([]);

    useEffect(()=>{ 

        let updateHook = true;

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

                if(updateHook){
                    if(fetchElDept.data.data){
                        setEventList(fetchElDept.data.data || [])
                    }
                }

            } catch(err) {
                // localStorage.removeItem('x')
                console.log(err)
                history.push('/')
            }
        }

        fetchData();

        return(()=> {
            updateHook=false;
        })

    }, [])

    const refreshEventList = () => {

        const fetchData = async() => {

            try{

                console.log('refreshEventList')

                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                };

                const fetchElDept = await axios.get(`${baseURL}/api/activity/${location.state.dept}/events`, header);

                if(fetchElDept.data.data){

                     console.log(fetchElDept.data.data);
                    setEventList(fetchElDept.data.data || []);

                }

            } catch(err) {

                // localStorage.removeItem('x')
                console.log(err)
                history.push('/')

            }
        }

        fetchData();
    }

    const openNewLink = (event_id) => {
        const url = `/scanner?event_id=${event_id}`;
        window.open(url, '_blank');
    }


    const ModalAddEvent = () => {

        const [type_, setType] = useState([]);
        const [elDept, setElDept] =useState([]);
    
        
        const effect = async(updateHook) => {
            try{
            
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                };

                const fetchActivityType = await axios.get(`${baseURL}/api/activity/types`, header);
                const fetchDeptDetails = await axios.get(`${baseURL}/api/activity/user`, header);

                let el_id = fetchDeptDetails.data.data[0].el_id || '';

                const fetchElDept = await axios.get(`${baseURL}/api/departments/coursedepartment/${el_id}`, header);

                setType(fetchActivityType.data.data);

                setElDept(
                    fetchElDept.data.data.filter((it)=>{return(it.key!== 'ALL')})
                );

            } catch(err) {
                // localStorage.removeItem('x')
                console.log(err)
                history.push('/')
            }
        }
       
        useEffect(() => {

            let updateHook = true;

            effect(updateHook);

            return(
                () => {
                    updateHook = false
                }
            )
        }, [])

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

        const FormNewEventDetails = () => {

            // Insert Values
          const [name, setName] = useState('');
          const [type, setType] = useState('');
      
          const options = type_ || [];
      
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
                          department: props.actDeptInfo.student_department ,
                          dep_id: props.location.state.dept,
                          acc_id: props.userDetails.id
                      }
      
                      const postApiAddNewEvent = await axios.post(`${baseURL}/api/activity/event/add`, body, header);

                      const fetchElDept = await axios.get(`${baseURL}/api/activity/${location.state.dept}/events`, header);

                    if(fetchElDept.data.data){
                         setEventList(fetchElDept.data.data || []);
                    }
        
               


                  } catch(err) {
                      // localStorage.removeItem('x')
                      console.log(err)
                      history.push('/')
                  }
              }
      
              if(name === '' || type === '' || !props.location.state.dept || !props.userDetails.id){
                  alert('All fields requires values...')
              }else{
                  AddEventInTable();
      
                  setName('');
                  setType('');
                  alert('New Event saved');

                  
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
              <Modal.Header>New Event Details
       
              </Modal.Header>

              <Modal.Content>
                <FormNewEventDetails  el_dept={elDept}  typesAct={type_ || []}/>
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

    // ?MAIN
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

                    </Menu.Item>
                </Menu.Menu>

                <Menu.Menu position='right'>
                    <Menu.Item>
                        {/*  */}
                        <ModalAddEvent {...props} log={refreshEventList} />
                    </Menu.Item>
                </Menu.Menu>

            </Menu>

            <TableEventList {...props} eventList={eventList}  openNewLink={openNewLink}/>

        </React.Fragment>
    )
}


export default withRouter(Event);