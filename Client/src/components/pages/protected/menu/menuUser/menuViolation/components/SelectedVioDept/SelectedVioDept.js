import React, { useEffect, useState } from 'react';
import { Grid, Header, Button, Table, Menu, Message, Segment, Modal, Select, Input, Form } from 'semantic-ui-react';
import { withRouter, F} from 'react-router-dom';
import baseURL from '../../../../../../../../res/baseuri';
import axios from 'axios';

// ModalStudent.js
import ModalStudent from './ModalStudent';


const SelectedVioDept = (props) => {

    
    const { location , history } = props

    const [didMount, setDidMount] = useState(false);
    const [Issue, setIssue] = useState(false);
    const [vioDeptTitle, setVioDeptTitle] = useState({});
    const [studentList, setStudentList] = useState([]);
    const [selected, setSelected] = useState(undefined);

    // {values of filter}
    const [text, setText] = useState('');
    const [level, setLevel] = useState('');
    const [course, setCourse] = useState('');
    const [yearlevel, setYearlevel] = useState('');
    const [section, setSection] = useState('');

    // { Options }
    const [opCourse, setOpCourse] = useState([]);
    const [opYrLvl, setOpYrLvl] = useState([]);
    const [opSection, setOpSection] = useState([]);

    
    const optLevel = [
        {key:'0', text:'ALL', value:''},
        {key:'1', text:'GS', value:'1'},
        {key:'2', text:'JHS', value:'2'},
        {key:'3', text:'SHS', value:'3'},
        {key:'4', text:'COLLEGE', value:'4'}
    ]

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
                
                const resOpYrLvl = await axios.get(`${baseURL}/api/filter_student/yearlevel`, header);
                const resOpSec = await axios.get(`${baseURL}/api/filter_student/section`, header);
                const resOpLevel = await axios.get(`${baseURL}/api/filter_student/course` ,header);

                const result = await axios.get(`${baseURL}/api/violation/user/${location.state.dept}?text=${text}&level=${level}&course=${course}&yrlvl=${yearlevel}&section=${section}`,header);

                const violationDept = await axios.post(`${baseURL}/api/department/getone`, {id:location.state.dept ||''},header)

                if(UpdateHook){
                    setOpCourse([{key:0, text:'ALL', value:''} ,...resOpLevel.data.data ]|| []);
                    setOpYrLvl( [{key:0, text:'ALL', value:''} , ...resOpYrLvl.data.data] || []);
                    setOpSection([{key:0, text:'ALL', value:''} , ...resOpSec.data.data] || [] );
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

    const onTextChange = (e) => {
        setText(e.target.value);
    }

    const onLevelChange = (e, {value}) => {
        setLevel(value)
    }

    const onCourseChange = (e, {value}) => {
        setCourse(value);
    }

    const onYearLevelChange = (e, {value}) => {
        setYearlevel(value);
    }

    const onSectionChange = (e, {value}) => {
        setSection(value);
    }

    const fetchFilterStudent = async() => {

        try{

            const header = {
                headers: {
                    authorization : localStorage.getItem('x')
                }
            };

            const result = await axios.get(`${baseURL}/api/violation/user/${location.state.dept}?text=${text}&level=${level}&course=${course}&yrlvl=${yearlevel}&section=${section}`,header);
                setStudentList(result.data.data || [])

        } catch(err) {
            localStorage.removeItem('x')
            console.log('RefSelectedVioDept - useEffect ERROR')
            history.push('/')
        }

    }

    const onSearchButtonClicked = () => {
        fetchFilterStudent();
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

            
            {/* Searching */}
            <div>
                <Form>
                    <Form.Group widths='equal'>

                        <Form.Field
                            id='form-input-control-first-name'
                            control={Input}
                            label='Search'
                            placeholder='Student Name / Username'
                            value={text}
                            onChange={onTextChange}
                        />

                        <Form.Field
                            control={Select}
                            options={optLevel}
                            label='Level'
                            placeholder='Level'
                            search
                            onChange={onLevelChange}
                        />

                        <Form.Field
                            control={Select}
                            options={opCourse}
                            label='Course'
                            placeholder='Course'
                            search
                            onChange={onCourseChange}
                        />

                        <Form.Field
                            control={Select}
                            options={opYrLvl}
                            label='Yearlevel'
                            placeholder='Year Level'
                            search
                            onChange={onYearLevelChange}
                        />

                      <Form.Field
                            control={Select}
                            options={opSection}
                            label='Section'
                            placeholder='Section'
                            search
                            onChange={onSectionChange}
                        />

                        <Form.Field
                            control={Button}
                            label='Search'
                            content="Search"
                            onClick={()=>{onSearchButtonClicked()}}
                        />

                    </Form.Group>

                    <Form.Group widths='equal'>
                   

                    </Form.Group>    


                </Form>
            </div>

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

