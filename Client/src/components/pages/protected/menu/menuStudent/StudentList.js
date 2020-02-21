import React,{ useEffect, useState } from 'react';
import { Button, Header, Menu, Input, Table, Form, Select } from 'semantic-ui-react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import baseURL from '../../../../../res/baseuri';
import { IoMdSearch } from "react-icons/io";

const StudentList = (props) => {

    const {match, history, location} = props;

    const [load, setLoad] = useState(true);
    const [student, setStudent ] = useState([]);
    const [opCourse, setOpCourse] = useState([]);
    const [opYrLvl, setOpYrLvl] = useState([]);
    const [opSection, setOpSection] = useState([]);

    const [text, setText] = useState('');
    const [level, setLevel] = useState('');
    const [course, setCourse] = useState('');
    const [yearlevel, setYearlevel] = useState('');
    const [section, setSection] = useState('');

    const optLevel = [
        {key:'0', text:'ALL', value:''},
        {key:'1', text:'GS', value:'1'},
        {key:'2', text:'JHS', value:'2'},
        {key:'3', text:'SHS', value:'3'},
        {key:'4', text:'COLLEGE', value:'4'}
    ]

    useEffect(()=>{

        let updateHook = true;

        console.log('useEffect ')

        const getUserDetails = async() => {
            try{

                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                };

                // /api/student
                const resOpYrLvl = await axios.get(`${baseURL}/api/filter_student/yearlevel`, header);
                const resOpSec = await axios.get(`${baseURL}/api/filter_student/section`, header);
                const resOpLevel = await axios.get(`${baseURL}/api/filter_student/course` ,header);
                const result = await axios.get(`${baseURL}/api/student?text=${text}&level=${level}&course=${course}` ,header);

                if(updateHook){
                    setStudent(result.data.data || []);
                    setOpCourse([{key:0, text:'ALL', value:''} ,...resOpLevel.data.data ]|| []);
                    setOpYrLvl( [{key:0, text:'ALL', value:''} , ...resOpYrLvl.data.data] || []);
                    setOpSection([{key:0, text:'ALL', value:''} , ...resOpSec.data.data] || [] );
                }

            } catch(err) {
                localStorage.clear();
                history.push("/");
            }
        };

        getUserDetails();

        return () => (updateHook=false);


        
    },[])

    const FetchFilterStudent = async() => {
        try{

            const header = {
                headers: {
                    authorization : localStorage.getItem('x')
                }
            };

            const result = await axios.get(`${baseURL}/api/student?text=${text}&level=${level}&course=${course}&yrlvl=${yearlevel}&section=${section}` ,header);
            
            setStudent(result.data.data || []);

        } catch(err) {
            localStorage.clear();
            history.push("/");
        }
    }

    const onEnterKeyDown = (e) => {
        if(e.key === 'Enter'){
            console.log(e.key)
        }
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

    const onSearchButtonClicked = () => {
        FetchFilterStudent();
    }

    return(
        <div>
            <Header
                as='h2'
                content='Student Records' 
                subheader='List of Studens save on the database.'
            />

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

            {/* Table */}
            <div>
                <Table compact>
                    <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Username</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Course</Table.HeaderCell>
                        <Table.HeaderCell>Section</Table.HeaderCell>
                        <Table.HeaderCell>Yearlevel</Table.HeaderCell>
                        <Table.HeaderCell>SchoolYear</Table.HeaderCell>
                    </Table.Row>
                    </Table.Header>

                    <Table.Body>


                        {student.map((it,ix)=>{
                            return(
                                <Table.Row>
                                    <Table.Cell>{it.username}</Table.Cell>
                                    <Table.Cell>{`${it.studlname}, ${it.studfname}, ${it.studmname}`}</Table.Cell>
                                    <Table.Cell>{it.course}</Table.Cell>
                                    <Table.Cell>{it.section}</Table.Cell>
                                    <Table.Cell>{it.yearlevel}</Table.Cell>
                                    <Table.Cell>{`${it.sem_name} | ${it.ay_name}`}</Table.Cell>
                                </Table.Row>
                            )
                        })}
                      
                    </Table.Body>
                </Table>
            </div>

        </div>
    )

};

export default withRouter(StudentList);