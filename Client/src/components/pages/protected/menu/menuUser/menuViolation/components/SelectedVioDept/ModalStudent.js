import React, { useEffect, useState } from 'react';
import {  Header, Button, Table, Message, Modal, Divider, Card } from 'semantic-ui-react';
import { withRouter} from 'react-router-dom';
import baseURL from '../../../../../../../../res/baseuri';
import axios from 'axios';


const ModalStudent = (props) => {


    const { location, history, match } = props
    const { s_username, s_ln,  s_fn,  s_mn,  s_yr,  s_sec,  s_crs,  s_dept, ay_name,sem_name, s_sem_id, s_acd_yr } = props.it


    const [didMount, setDidMount] = useState(false);
    const [violations, setViolations] = useState([]);
    const [showList, setShowList] = useState(true);
    const [showListRecord, setShowListRecord] = useState(true);
    const [violationRecords, setViolationRecords] =useState([]);

    // useEffect(()=>{
    //     console.log('Model Intial API data fetch')
    //     setDidMount(true);
    //     let UpdateHooks = true;

    //     const axiosAPI = async()=>{
    //         try{               
    //             const header = {
    //                 headers: {
    //                     authorization : localStorage.getItem('x')
    //                 }
    //             }

    //             // get violationList for this departmnet
    //             const fetchViolationList = await axios.get(`${baseURL}/api/violation/user/${match.params.dept}/violations`, header);
     
    //             // get violation records of the student
    //             const fetchStudentViolationRecords = await axios.get(`${baseURL}/api/violation/user/1234/violations/student/records/${s_username}`, header);
                
    //             if(UpdateHooks)
    //             {
    //                 if(fetchViolationList.data.data){

    //                     let data = fetchViolationList.data.data
    //                     setViolations(data)
    //                 } 
                    
    //                 if(fetchStudentViolationRecords.data.data) {
    //                     let data = fetchStudentViolationRecords.data.data
    //                     setViolationRecords(data)
    //                 }
    //             }
    //         } catch(err) {
    //             history.push('/')
    //         }        
    //     }

    //     axiosAPI();

    //     return () => (UpdateHooks=false)
    // },[])

    // if(!didMount) {
    //     return null
    // }

    const refreshContents = () => {
        const axiosAPI = async()=>{
            try{               
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                }

                // get violationList for this departmnet
                const fetchViolationList = await axios.get(`${baseURL}/api/violation/user/${match.params.dept}/violations`, header);
     
                // get violation records of the student
                const fetchStudentViolationRecords = await axios.get(`${baseURL}/api/violation/user/1234/violations/student/records/${s_username}`, header);

                if(fetchViolationList.data.data){
                    let data = fetchViolationList.data.data
                    setViolations(data)
                } 
                
                if(fetchStudentViolationRecords.data.data) {
                    let data = fetchStudentViolationRecords.data.data
                    setViolationRecords(data)
                }

            } catch(err) {
                history.push('/')
            }        
        }

        axiosAPI();
    }


    const onViolationRecordsButton = () =>{

        setShowListRecord(!showListRecord)
    }   

    const onViolationListButton = () => {
        setShowList(!showList)
    }

    // issue violation for the current day only one is allowed per date
    const onAddIssue = (it) => {
        const InsertData = async() => {
            try{
            
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                };

                /*
                { 
                    "s_id":1,
                    "s_acd_yr":1,
                    "s_sem_id":1,
                    "d_type_id":3,
                    "d_crs":"-ALL",
                    "d_yr":"-ALL",
                    el_id":4,
                    "d_id":117,
                    "s_username":"CL1",
                    "s_fn":"Jason Marc",
                    "s_mn":"Marinas",
                    "s_ln":"Del Rosario",
                    "s_yr":"1st",
                    "s_sec":"B",
                    "s_crs":"BSCPE",
                    "s_dept":"CCS",
                    "ay_name":"2019-2020",
                    "sem_name":"1st"}
                */
                const {v_id} = it
                const body = {
                    uid: s_username,
                    vio: v_id,
                    sem: s_sem_id,
                    ay: s_acd_yr,
                    yr: s_yr,
                    crs: s_crs,
                    sec: s_sec
                }

                const result = await axios.post(`${baseURL}/api/violation/user/${match.params.dept}/violations/student/add`,body, header);
     
                if(result.data.data[8]){

                    result.data.data[8].insertId !== 0 ? 
                        refreshContents() :
                        console.log('no inserted')

                    alert( result.data.data[8].insertId !== 0 ? 'Violation Issued' : 'Already issued for this date')
                }

            } catch(err) {
                console.log(err)
                history.push('/')
            }
        }

        InsertData();
    }

    return(
        <Modal size='fullscreen'    
            onOpen={()=>{refreshContents()}}      
            trigger={            
                <Table.Row  >
                    
                    <Table.Cell>{s_username}</Table.Cell>
                    <Table.Cell>{`${s_ln}, ${s_fn} ${s_mn}`}</Table.Cell>
                    <Table.Cell>{s_yr}</Table.Cell>
                    <Table.Cell>{s_sec}</Table.Cell>
                    <Table.Cell>{s_crs}</Table.Cell>
                    <Table.Cell>{s_dept}</Table.Cell>
                    <Table.Cell>{ay_name}</Table.Cell>
                    <Table.Cell>{sem_name}</Table.Cell>
                    {/* <Table.Cell>{JSON.stringify(it)}</Table.Cell> */}
                </Table.Row>
            } >

            {/* Header */}
            <Modal.Header>
                Issue Violation
            </Modal.Header>

            <Modal.Content>
     
                <div>
                    {/* student details */}
                    <div>
                       
                            <Card>
                                <Card.Content>
                                    
                                    <Card.Header>{s_ln}, {s_fn} {s_mn}</Card.Header>
                                    <Card.Meta>{s_username}</Card.Meta>

                                    <Card.Description>
                                    <Card.Meta>Enrolled:</Card.Meta>
                                    {s_yr}-{s_sec}, {s_crs} 
                                    <br/>
                                    {ay_name} {sem_name} {s_dept} 
                                        
                                    </Card.Description>

                                </Card.Content>

                                {/* <Card.Content extra>
                                    <div className='ui two buttons'>
                                    <Button basic color='green'>
                                        Approve
                                    </Button>
                                    <Button basic color='red'>
                                        Decline
                                    </Button>
                                    </div>
                                </Card.Content> */}
                            </Card>
                    </div>

                    {/* Click to Show Violation List */}
                    <Button secondary 
                        style={{marginTop:'20px'}}
                        onClick={onViolationListButton}>
                            Violations List
                    </Button>
                    {/* Violation List */}
                    <div style={{display: showList? 'block':'none'}}>
                        <Divider horizontal>
                            <Header as='h4'>
                                    Violation List
                            </Header>
                        </Divider>

                        <Table style={{ overflowX:'scroll'}} selectable padded >
                            <Table.Header >
                                <Table.Row>
                                    <Table.HeaderCell>Violation</Table.HeaderCell>
                                    <Table.HeaderCell style={{maxWidth:'300px'}} >Description</Table.HeaderCell>
                                    <Table.HeaderCell>Class</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            
                            <Table.Body>
                                {violations.map((it, id) => {

                                    const {v_name, v_description, v_class} = it

                                    return(
                                        <Table.Row key={it.v_id} 
                                            onClick={()=>{ onAddIssue(it) }}>
                                            <Table.Cell>{v_name}</Table.Cell>
                                            <Table.Cell style={{maxWidth:'300px'}} >{v_description}</Table.Cell>
                                            <Table.Cell>{v_class}</Table.Cell>
                                         </Table.Row>
                                    )
                                })}
                            </Table.Body>
                        </Table>
                    </div>
                    
                    <br/>
                    {/* Click to show violation records */}
                    <Button  secondary 
                        style={{marginTop:'20px'}}
                        onClick={onViolationRecordsButton}>
                            Violations records
                    </Button>
                    {/* Student Record */}
                    <div  style={{display: showListRecord? 'block':'none'}} >
                        <Divider horizontal>
                            <Header as='h4'>
                                    Violation Offences Record
                            </Header>
                        </Divider>

                        <Table style={{ overflowX:'scroll'}} selectable compact>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Violation</Table.HeaderCell>
                                    <Table.HeaderCell>Yr.</Table.HeaderCell>
                                    <Table.HeaderCell>Section</Table.HeaderCell>
                                    <Table.HeaderCell>Course</Table.HeaderCell>
                                    <Table.HeaderCell>Sem-S.Y.</Table.HeaderCell>
                                    <Table.HeaderCell>Issued On</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {violationRecords.map((it, ix)=>{

                                    /*
                                        {"id":200, 
                                        "student_username":"CL1",
                                        "violation_id":22,
                                        "semester_id":1,
                                        "acad_year_id":1,
                                        "state":"1",
                                        "is_send_sms":"0",
                                        "yearlevel":"1st",
                                        "course":"BSCPE",
                                        "section":"B",
                                        existing_record":1,
                                        "s_dep":"CCS",
                                        "sem_name":"1st",
                                        "v_name":"Littering",
                                        "ay_name":"2019-2020",
                                        "issued_on":"11-16-2019",
                                        "time":"07:51:45 PM"}

                                    */

                                    return(
                                        <Table.Row key={it.id}>
                                            <Table.Cell style={{maxWidth:'300px'}}>{it.v_name}</Table.Cell>
                                            <Table.Cell>{it.yearlevel}</Table.Cell>
                                            <Table.Cell>{it.section}</Table.Cell>                                            
                                            <Table.Cell>{it.course}</Table.Cell>
                                            <Table.Cell>{it.sem_name}, {it.ay_name}</Table.Cell>
                                            <Table.Cell>{it.issued_on} {it.time}</Table.Cell>
                                            

                                            
                                      
                                         </Table.Row>
                                    )
                                })}
                            </Table.Body>
                        </Table>
                    </div>

                </div>
               
            </Modal.Content>

        </Modal>
    )
}

const MessageEmpty =  () => {
    return(
        <Message warning>
            <Message.Header>Sorry, no violation records for this student.</Message.Header>
            <p>0 Results found</p>
        </Message>
    )
}


export default withRouter(ModalStudent)