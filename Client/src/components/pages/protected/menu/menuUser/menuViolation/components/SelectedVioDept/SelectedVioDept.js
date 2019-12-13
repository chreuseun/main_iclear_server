import React, { useEffect, useState } from 'react';
import { Grid, Header, Button, Table, Menu, Message, Segment, Modal, Divider } from 'semantic-ui-react';
import { withRouter, Link} from 'react-router-dom';
import baseURL from '../../../../../../../../res/baseuri';
import axios from 'axios';

// ModalStudent.js
import ModalStudent from './ModalStudent';


const SelectedVioDept = (props) => {

    
    const { location ,match, history } = props

    const [didMount, setDidMount] = useState(false);
    const [Issue, setIssue] = useState(false);
    const [vioDeptTitle, setVioDeptTitle] = useState({});
    const [studentList, setStudentList] = useState([]);
    const [selected, setSelected] = useState(undefined);

    useEffect(() => {

        setDidMount(true);
        let UpdateHook = true;

        const fetchData = async() => {
            try{
            
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                };
                
                const result = await axios.get(`${baseURL}/api/violation/user/${location.state.dept}`,header);
                const violationDept = await axios.post(`${baseURL}/api/department/getone`, {id:location.state.dept ||''},header)

                if(UpdateHook){
                    setVioDeptTitle(violationDept.data.sqlResult[0] || {})
                    setStudentList(result.data.data || [])
                }

            } catch(err) {
                localStorage.removeItem('x')
                console.log('RefSelectedVioDept - useEffect ERROR')
                history.push('/')
            }
        }

        fetchData();

        return () => (UpdateHook=false)

    },[])
    
    if(!didMount){
        return null;
    }

    const TableMain = () => {
        return(
            <Table compact>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>UID</Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Yr.</Table.HeaderCell>
                    <Table.HeaderCell>Section</Table.HeaderCell>
                    <Table.HeaderCell>Course</Table.HeaderCell>
                    <Table.HeaderCell>Department</Table.HeaderCell>
                    <Table.HeaderCell>S.Y.</Table.HeaderCell>
                    <Table.HeaderCell>Semester</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {<StudentList/>}
            </Table.Body>
        </Table>
        )
    }
    
    const StudentList = () => {

        console.log(studentList)

        return(
            <React.Fragment>


                {studentList.map((it, ix)=>{
                    return(
                        <ModalStudent key={it.s_username} {...props} it={it}/>
                    )
                })}
            </React.Fragment>
        )
    }

    const pushTo = (path) => {
        
        var pushData = {
            pathname: `/menu/viol/${path}/settings`,
            state: { dept: location.state.dept }
        }

        console.log(pushData)
        

        props.pushToLink(pushData)
    }

    return(
        <React.Fragment>
            
            <div>
                <Header as='h2'>
                    { vioDeptTitle.d_name || '' } {'-'} { vioDeptTitle.el_name || '' }
                    <Header.Subheader>
                        Manage our student violation records and dept. settings
                    </Header.Subheader>
                </Header>      
            </div>

            <hr></hr>

            <br/>

            {/* MENU */}
            <div>
                <Menu secondary>

                <Menu.Menu position='left'>
                        <Menu.Item>
                            <Button animated='fade'
                                secondary
                            >
                                <Button.Content visible>{'All records'}</Button.Content>
                                <Button.Content hidden> {'All records'}</Button.Content>
                            </Button>
                        </Menu.Item>
                        
                    </Menu.Menu>



                    <Menu.Menu position='right'>
                        <Menu.Item>
                            <Button animated='fade'
                                primary
                                
                                onClick={()=>pushTo(location.state.dept)}
                                >

                                <Button.Content visible>{'Settings'}</Button.Content>
                                <Button.Content hidden> {'Settings'}</Button.Content>

                            </Button>
                        </Menu.Item>
                        
                    </Menu.Menu>
                </Menu>
            </div>

            <br/>

            <Grid >

                <Grid.Row  >
                    <Grid.Column>        
                        <Segment style={{ overflow: 'auto', maxHeight: '1000vh' }}>
                            <Segment.Group horizontal>
                                {studentList.length > 0?
                                    <TableMain/> : <MessageEmpty/> }
                               

                            </Segment.Group>
                        </Segment>
                                
                         

                    </Grid.Column>
                </Grid.Row>

            </Grid>
            
            {/* <ModalIssueViolationToStudent {...props} it={selected} Issue={Issue} onOpen={modalOpen} onClose={modalClose}/> */}

        </React.Fragment>
    )
}

const MessageEmpty =  () => {
    return(
        <Message warning>
            <Message.Header>Sorry, no departments is assigned to you.</Message.Header>
            <p>0 Results found, Visit our Admin/IT for your eligibility of dept. assignment</p>
        </Message>
    )
}

export default withRouter(SelectedVioDept)

