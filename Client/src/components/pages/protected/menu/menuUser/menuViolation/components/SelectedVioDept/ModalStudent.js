import React, {  useState } from 'react';
import {  Header, Button, Table, Message, Modal, Divider, Card, Transition, Menu } from 'semantic-ui-react';
import { withRouter} from 'react-router-dom';
import baseURL from '../../../../../../../../res/baseuri';
import axios from 'axios';

import ClassanctionList from '../.../../../../menuViolation/components/SelectedVioDept/components/VioDeptSettings/components/Class/ViolationClassNoAddSanction';

const ModalStudent = (props) => {


    const { location, history } = props
    const { s_username, s_ln,  s_fn,  s_mn,  s_yr,  s_sec,  s_crs,  s_dept, ay_name,sem_name, s_sem_id, s_acd_yr } = props.it

    const [violations, setViolations] = useState([]);
    const [showList, setShowList] = useState(true);
    const [showListRecord, setShowListRecord] = useState(true);
    const [showSanctionList, setShowSanctionList] = useState(true);

    const [violationRecords, setViolationRecords] =useState([]);

    const [isGroup, setIsGroup] = useState(false);

    const refreshContents = async(mode = '') => {

        try{
            const header = {
                headers: {
                    authorization : localStorage.getItem('x')
                }
            }

            // get violationList for this departmnet
            const fetchViolationList = await axios.get(`${baseURL}/api/violation/user/${location.state.dept}/violations`, header);

            // get violation records of the student
            const fetchStudentViolationRecords = await axios.get(`${baseURL}/api/violation/user/1234/violations/student/records/${s_username}?mode=${mode}`, header);

            if(fetchViolationList.data.data){
                let data = fetchViolationList.data.data
                setViolations(data)
            } 
            
            if(fetchStudentViolationRecords.data.data) {
                let data = fetchStudentViolationRecords.data.data
                setViolationRecords(data)
            }

        } catch(err) {
            localStorage.clear();
            history.push('/')
        }

    }

    // button to Show/Hiide Violation Records of the student
    const onViolationRecordsButton = () =>{
        setShowListRecord(!showListRecord)
    }

    // button to Show/Hide Violation List
    const onViolationListButton = () => {
        setShowList(!showList)
    }

    // button to Show/Hide SANCTION List
    const onSanctionListButton = () => {
        setShowSanctionList(!showSanctionList)
    }

    const onGroup = () => {
        refreshContents('grouped');
        setIsGroup(true);
    }

    const onBreak = () => {
        refreshContents('breakdown');
        setIsGroup(false);
    }

    // issue violation for the current day only one is allowed per date
    const onAddIssue = async(it) => {
        // const InsertData = async() => {

        try{

            const header = {
                headers: {
                    authorization : localStorage.getItem('x')
                }
            };

            const {v_id} = it;

            const body = {
                uid: s_username,
                vio: v_id,
                sem: s_sem_id,
                ay: s_acd_yr,
                yr: s_yr,
                crs: s_crs,
                sec: s_sec
            }

            const result = await axios.post(`${baseURL}/api/violation/user/${location.state.dept}/violations/student/add`,body, header);

            if(result.data.data[8]){

                result.data.data[8].insertId !== 0 ? 
                    refreshContents() :

                alert( result.data.data[8].insertId !== 0 ? 'Violation Issued' : 'Already issued for this date')
            }

        } catch(err) {
            console.log(err)
            history.push('/')
        }

        // }
        // InsertData();
    }

    return(
        <Modal size='fullscreen'    
            onOpen={()=>{refreshContents()}}      
            trigger={            
                // student  datails
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
                    {/* CARD student details */}
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

                    {/* Click to Show SANCTION List */}
                    <Button secondary 
                        style={{marginTop:'20px'}}
                        onClick={onSanctionListButton}>
                            Sanction List
                    </Button>
                    
                       {/* Violation List */}
                       <Transition visible={showSanctionList} animation='scale' duration={500}>
                        <div>
                            <Divider horizontal>
                                <Header as='h4'>
                                        Sanction List
                                </Header>
                            </Divider>

                            <Table style={{ overflowX:'scroll'}} selectable padded >
                                {/* <SanctionRecordTable/> */}

                                <ClassanctionList/>
                            </Table>
                        </div>
                    
                    </Transition>
                                      


                    <br/>





                    {/* Click to Show Violation List */}
                    <Button secondary 
                        style={{marginTop:'20px'}}
                        onClick={onViolationListButton}>
                            Violations List
                    </Button>

                    {/* Violation List */}
                    <Transition visible={showList} animation='scale' duration={500}>
                        <div>
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
                    
                    </Transition>
                   
                    <br/>
                    {/* Click to show violation records of student */}
                    <Button  secondary 
                        style={{marginTop:'20px'}}
                        onClick={onViolationRecordsButton}>
                            Violations records
                    </Button>

                    {/* Student Record */}
                    <Transition visible={showListRecord} animation='scale' duration={500}>
                        
                        <div>

                            <Divider horizontal>
                                <Header as='h4'>
                                        Violation Offences Record
                                </Header>
                            </Divider>

                            {/* MENU : GROUP or BREAKDOWN Button */}
                            <div>
                                <Menu secondary>

                                    <Menu.Menu position='right'>

                                        <Menu.Item>
                                            <Button
                                            onClick={()=>onGroup()}
                                            visible>{'Group by count'}</Button>
                                        </Menu.Item>

                                        <Menu.Item>
                                            <Button 
                                            onClick={()=>onBreak()}
                                            visible>{'Group by breakdown'}</Button>
                                        </Menu.Item>
                                        
                                    </Menu.Menu>
                                </Menu>
                            </div>

                            <Table style={{ overflowX:'scroll'}} selectable compact>
                                
                                {/* BREAKDOWN */}
                                {!isGroup &&  <ViolationRecordHeaderBreakDown violationRecords={violationRecords}/> }
                                
                                {/* GROUPED */}
                                {isGroup &&  <ViolationRecordHeaderGrouped violationRecords={violationRecords}/> }

                            </Table>

                        </div>
                    </Transition>

                </div>
               
            </Modal.Content>

        </Modal>
    )
}

const SanctionRecordTable = (props) => {

    const violationRecords = props.violationRecords || [];

    return(
        <React.Fragment>
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

        </React.Fragment>
    )
}

const ViolationRecordHeaderBreakDown = (props) => {
    return(
        <React.Fragment>
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
                {props.violationRecords.map((it, ix)=>{
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

        </React.Fragment>
    )
}

const ViolationRecordHeaderGrouped = (props) => {
    return(
        <React.Fragment>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Violation</Table.HeaderCell>
                    <Table.HeaderCell>Yr.</Table.HeaderCell>
                    <Table.HeaderCell>Section</Table.HeaderCell>
                    <Table.HeaderCell>Course</Table.HeaderCell>
                    <Table.HeaderCell>Sem-S.Y.</Table.HeaderCell>
                    <Table.HeaderCell>No. of Records</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {props.violationRecords.map((it, ix)=>{
                    return(
                        <Table.Row key={it.id}>
                            <Table.Cell style={{maxWidth:'300px'}}>{it.v_name}</Table.Cell>
                            <Table.Cell>{it.yearlevel}</Table.Cell>
                            <Table.Cell>{it.section}</Table.Cell>                                            
                            <Table.Cell>{it.course}</Table.Cell>
                            <Table.Cell>{it.sem_name}, {it.ay_name}</Table.Cell>
                            <Table.Cell>{it.max_existing_record}</Table.Cell>
                        </Table.Row>
                    )
                })}
            </Table.Body>

        </React.Fragment>
    )
}


const ClassSubMenu = () => {
    return(

        <React.Fragment>
            <Header as='h3'>
                Class
                <Header.Subheader>
                    Manage your account settings and set email preferences
                </Header.Subheader>
            </Header>

            {/* <ClassList/> */}

        </React.Fragment>

        


    )
}


// const MessageEmpty =  () => {
//     return(
//         <Message warning>
//             <Message.Header>Sorry, no violation records for this student.</Message.Header>
//             <p>0 Results found</p>
//         </Message>
//     )
// }


export default withRouter(ModalStudent)