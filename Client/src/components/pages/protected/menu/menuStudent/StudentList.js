import React,{ useEffect, useState, useRef} from 'react';
import { Button, Header, Menu, Input, Table, Form, Select, Container ,Image} from 'semantic-ui-react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import baseURL from '../../../../../res/baseuri';
import ReactToPrint from 'react-to-print';
import logo from './../../../../../res/assets/dyci.jpg';

const StudentList = (props) => {

    const {match, history, location} = props;
    const componentToPrint = useRef();
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
        <div style={{marginBottom:16}}>
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

                

                <ReactToPrint
                    trigger={() => <Button secondary>Print</Button>}
                    content={() => componentToPrint.current}
                />

                <hr/>
            </div>

            {/* TABLE */}
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
            
            <div style={{display:'none'}}>
                <StudentListPrintOut student={student} ref={componentToPrint}/>
            </div>
            
        </div>
    )

};

class StudentListPrintOut extends React.Component {

    render () {
        const {student=[], data=[]}= this.props 

        return (
            <>
                <PrintOut student={student}/>
            </>
        )
    }
}

const PrintOut = ({student=[]}) => {
    
    var today  = new Date().toLocaleDateString("en-US")

    return(
            <div style={{margin:'auto', fontFamily:'arial'}}>
                {/* SCHOOL NAME */}
                <div style={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
                        
                    <div style={{display:'flex', flexDirection:'row',alignItems:'center',textAlign:'center',}}>
                        <img src={logo} alt={'logo'}style={{width:50, height:50}}/>

                        <div style={{marginLeft: 10}}>
                            <span style={{textAlign:'center', fontWeight:'bold',fontSize:'24sp'}}>Dr.Yanga's Colleges Incorporated</span>
                            <br/>
                            <small>Wakas, Bocaue, Bulacan #3016</small>
                        </div>
                        {/* <span style={{textAlign:'center', fontWeight:'bold',fontSize:'20sp'}}>
                            
                            Dr.Yanga's Colleges Incorporated
                        </span> */}
                    </div>
                  
                        {/* <br/>
                        <s`mall>Wakas, Bocaue, Bulacan #3016</small> */}
                </div>
                
               

                <h4 style={{textAlign:'center'}}>
                    Student List
                </h4>


                <span>
                    Printed at: <strong>{today}</strong>
                </span>

                <hr/>
                {/* Table */}
                <div style={{borderColor:'#272727', borderWidth:1/3}}>
                    <Table >
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
}

export default withRouter(StudentList);