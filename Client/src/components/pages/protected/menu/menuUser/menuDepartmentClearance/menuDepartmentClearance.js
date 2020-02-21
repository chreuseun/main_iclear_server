import React, { useEffect, useState } from 'react'
import { Table, Segment, Container,  Radio, Header, Button, Input,Loader, Dimmer, Modal, Form, Select} from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import baseURL from '../../../../../../res/baseuri';

// Component
import IssueClearanceModal from '../../../../protected/menu/menuUser/menuDepartmentClearance/IssueClearanceModal'


function ManageAcadYear(props) {

    const optLevel = [
        {key:'0', text:'ALL', value:''},
        {key:'1', text:'GS', value:'1'},
        {key:'2', text:'JHS', value:'2'},
        {key:'3', text:'SHS', value:'3'},
        {key:'4', text:'COLLEGE', value:'4'}
    ]

    const { match, location, history } = props

    const [didMount, setDidMount] = useState(false)
    const [deptList, setDeptList] = useState([]);
    const [context, setContext] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [ShowForm, setShowForm] = useState(false);
    const [depinfo, setDepInfo] = useState({});
    const [DepStd,setDepStd] = useState([]);


        
    const [opCourse, setOpCourse] = useState([]);
    const [opYrLvl, setOpYrLvl] = useState([]);
    const [opSection, setOpSection] = useState([]);

    const [text, setText] = useState('');
    const [level, setLevel] = useState('');
    const [course, setCourse] = useState('');
    const [yearlevel, setYearlevel] = useState('');
    const [section, setSection] = useState('');


    useEffect( () => {
        console.log('UserDetails: ', location.state)
       
        setDidMount(true);
        let xa = true;
     
        const x = async()=>{
            try{

                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                }

                const resOpYrLvl = await axios.get(`${baseURL}/api/filter_student/yearlevel`, header);
                const resOpSec = await axios.get(`${baseURL}/api/filter_student/section`, header);
                const resOpLevel = await axios.get(`${baseURL}/api/filter_student/course` ,header);

                const detStd_ = (await axios.get(`${baseURL}/api/departments/${location.state.dept}/std`, header))

                console.log(detStd_.data.data);

                if(xa)
                {

                    setOpCourse([{key:0, text:'ALL', value:''} ,...resOpLevel.data.data ]|| []);
                    setOpYrLvl( [{key:0, text:'ALL', value:''} , ...resOpYrLvl.data.data] || []);
                    setOpSection([{key:0, text:'ALL', value:''} , ...resOpSec.data.data] || [] );

                    setDepInfo(detStd_.data.data.dep);
                    setDepStd(detStd_.data.data.students)
                    setIsLoading(false)
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
  
    const ComponentdepStudentsList = DepStd.map((it, idx) => {
        
        return(
            <ModalClearancePane userDetails={props.userDetails} key={it.s_username} item={it}/>
        )
    })

    // ***************************************************************************

    const fetchFilterStudent = async() => {
       
        try{

            const header = {
                headers: {
                    authorization : localStorage.getItem('x')
                }
            }

            const detStd_ = (await axios.get(`${baseURL}/api/departments/${location.state.dept}/std?text=${text}&level=${level}&course=${course}&yrlvl=${yearlevel}&section=${section}`, header))

            setDepStd(detStd_.data.data.students)

        } catch(err) {
            props.history.push('/')
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
        fetchFilterStudent();
    }


    return(
        <Container>

            <Dimmer  active={isLoading} inverted>
                <Loader inverted content='Loading'/>
            </Dimmer>

            <Header textAlign='center'>Issue Clearance:{depinfo.d_name || ''}</Header>

                
            <Segment style={{ overflow: 'auto', maxHeight: '1000vh' }}>
           
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



                <Segment.Group horizontal>   

                <Table color='red' striped compact selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Sys No.</Table.HeaderCell>
                            <Table.HeaderCell>UID</Table.HeaderCell>
                            <Table.HeaderCell>Student</Table.HeaderCell>
                            <Table.HeaderCell>Section</Table.HeaderCell>
                            <Table.HeaderCell>Course-Yr.</Table.HeaderCell>
                            <Table.HeaderCell>S.Y.-Sem</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {ComponentdepStudentsList}
                    </Table.Body>
                </Table>
             
                </Segment.Group>
            </Segment>
        </Container>  
    )
}

const ModalClearancePane = (props) => {
    return(
        <Modal trigger={StdRow(props.item)} size='fullscreen'>
            <Modal.Header>Issue Clearance</Modal.Header>

            <Modal.Content >
                <IssueClearanceModal userDetails={props.userDetails} studentInfo={props.item}/>
            </Modal.Content>

            <Modal.Actions>
            
            </Modal.Actions>
        </Modal>
    )
}

const StdRow = (item) => {
    return(
        <Table.Row key={item.s_username}  >
            <Table.Cell>{item.s_id}</Table.Cell>
            <Table.Cell>{item.s_username}</Table.Cell>
            <Table.Cell>{`${item.s_ln}, ${item.s_fn} ${item.s_mn}`}</Table.Cell>
            <Table.Cell>{item.s_sec}</Table.Cell>
            <Table.Cell>{`${item.s_crs} - ${item.s_yr}`}</Table.Cell>
            <Table.Cell>{`${item.ay_name} - ${item.sem_name}`}</Table.Cell>
        </Table.Row>
    )
}

export default withRouter(ManageAcadYear)