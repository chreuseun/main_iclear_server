import React,{useState, useEffect} from 'react';
import { withRouter} from "react-router-dom";
import { Button, Menu, Segment, Header, Modal, Form, Loader } from 'semantic-ui-react';
import axios from 'axios'
import baseURL from '../../../../../../res/baseuri';


import TableComponent from './components/SubjectList_table';

// path : '/menu/dep/:dept/sub'


const RegisterSubject = (props)  => {
    const { match ,location, history } = props;

    const [loading, setLoading] = useState(true);

    const [submenu , setSubmenu] = useState('List');
    const [depDetails, setDepDetails] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [subjectDetails, setSubjectDetails] = useState([]);

    useEffect(()=>{

        console.log('Match: ', match)
        console.log('Location: ', location)
        console.log('History: ', history)

        let upadateHook = true;

        const x = async() => {
            try{

                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                }

                // Get Department Details
                const result = await axios.post(`${baseURL}/api/department/getone`, { id:location.state.dept }, header);

                // Get SubjectDetails
                const fetchDeptDetails = await axios.get(`${baseURL}/api/subjclass/subjects/${result.data.sqlResult[0].el_id}`,header);

                console.log(result.data)
                console.log('Fetch Dept Details: ', fetchDeptDetails.data.data);

                if(upadateHook)
                {
                    setLoading(false);
                    setDepDetails(result.data.sqlResult[0]);
                    setSubjectDetails(fetchDeptDetails.data.data)
                }

            } catch(err) {
                history.push('/')
            }
        }

        x();

        return () => (upadateHook = false)
    },[]);

    if(loading){
        console.log('Loading')
        return(
            <Loader/>
        )
    }

    // SubMenu
    const Selection = () => {
        return(
            <React.Fragment>
                <div>
                    <Menu attached='top' tabular>
                        <Menu.Item
                            name='Subject  List'
                            active={submenu === 'List'}
                        />
                    </Menu>
        
                    <Segment attached='bottom'>

                        <div>
                            <Menu secondary>
                                
                                <Menu.Menu position='right'>
                                    <Menu.Item>
                                        <Button onClick={()=>{setOpenModal(!openModal)}} secondary>
                                            Add Subject
                                        </Button>
                                    </Menu.Item>
                                    
                                </Menu.Menu>
                            </Menu>
                        </div>

                        <Segment style={{ overflow: 'auto', maxHeight: '1000vh' }}>
                            <Segment.Group horizontal>

                                {/* Table Here!! list of subjects for the educ leve */}
                                <TableComponent subjectDetails={subjectDetails}/>

                            </Segment.Group>
                        </Segment>

                    </Segment>
                </div>
          </React.Fragment>
        )
    }

    // Modal Add Subject
    const ModalAddSubject = () => {

        const [course, setCourse] = useState([]);
        const [yearlevel, setYearlevel] = useState([]);

        const x = async(UpdateHook)=>{

            try{               
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                }

                const result = await axios.get(`${baseURL}/api/filter_student/class/course/?educlevel=${depDetails.el_id}`, header);
                const resultYearLevel = await axios.get(`${baseURL}/api/filter_student/yearlevel`, header);

                console.log(result.data)

                if(UpdateHook)
                {
                    setCourse(result.data.data)
                    setYearlevel(resultYearLevel.data.data)
                }

            } catch(err) {
                history.push('/')
            }

        }

        useEffect(()=>{
            let UpdateHook = true

            x(UpdateHook);

            return (()=>{
                UpdateHook = false
                console.log('Modal is Closed')
            })
        },[])

        const FormAddingSubject = () => {

            const [name , setName] = useState('');
            const [code, setCode] = useState('');
            const [valcourse,setValCourse] = useState('');
            const [valyearlevel,setValYearlevel] = useState('');

            const onSubmitClick = () => {
    
                if(
                    name !== '' &&
                    code !== '' &&
                    valcourse !== '' &&
                    valyearlevel !== '' &&
                    depDetails.el_id !== ''
                ){
                    
                    let subjectDetails = {
                        name,
                        code,
                        educ_level_id: depDetails.el_id ,
                        yearlevel:valyearlevel,
                        course:valcourse 
                    }

                    const AxiosInsertSubjectDetails = async(UpdateHook = true)=>{

                        try{               
                            const header = {
                                headers: {
                                    authorization : localStorage.getItem('x')
                                }
                            }
                            // http://127.0.0.1:4040
                            const result = await axios.post(`${baseURL}/api/subjclass/insert`, subjectDetails, header);
      
                            console.log(result.data.data)

                            let response = result.data.data

                            if(response.msg === "Insert Succesful"){
                                setName('');
                                setCode('');
                                setValYearlevel('');
                                setValCourse('');
                                alert('Subject Added')
                               
                             
                               

                            }else if(response.msg === "Code Already Exist") {
                                alert('Subject code Already Exist')
                                setCode('')
                            } else{
                                alert('Subbject Insert failed')
                            }

                        } catch(err) {
                            history.push('/menu')
                        }
            
                    }

                    AxiosInsertSubjectDetails();
                } else {
                    alert('All Fields are required')
                }

            }

            const onCourseChange = (e, {value}) => {
                setValCourse(value)
            }

            const onYearLevelChange = (e, {value}) => {
                setValYearlevel(value)
            }

            return(
                <Form>
                    <Form.Group widths='equal'>

                        <Form.Input 
                            onChange={ (e)=>{  setName(e.target.value) } }
                            value={name}
                            fluid label='Subject Name' placeholder='Subject name' maxLength={"30"}/>

                        <Form.Input 
                            onChange={(e)=>{  setCode(e.target.value); }}
                            value={code}
                            fluid label='Code' placeholder='Code' maxLength={"20"}/>

                    </Form.Group>

                    <Form.Group widths='equal'>

                        <Form.Select
                            fluid
                            label='Course'
                            options={course}
                            placeholder='Course'
                            onChange={onCourseChange}
                            value={valcourse}
                        />

                        <Form.Select
                            fluid
                            label='Year Level'
                            options={yearlevel}
                            placeholder='Gender'
                            onChange={onYearLevelChange}
                            value={valyearlevel}
                        />

                    </Form.Group>

                    <Form.Button onClick={onSubmitClick}>Submit</Form.Button>
                </Form>
            )
        }

        return(
            <Modal open={openModal}>
            <Modal.Header>
                Add Subject

                <Button 
                    onClick={()=>{ setOpenModal(false) }}
                    floated="right" inverted color='red'>
                    Close   
                </Button>

            </Modal.Header>

            <Modal.Content >

                {/* FORM  */}
                <FormAddingSubject/>

            </Modal.Content>
          </Modal>
        )
    }

    return (

        <div>

            <div>
                <Header as='h2'>

                        {depDetails.d_name || ''}

                    <Header.Subheader>

                        Assign Subjects to teachers

                    </Header.Subheader>
                </Header>
            </div>

            <hr/>

            <Selection/>

            { openModal && <ModalAddSubject/>}

        </div>

    )
}

export default withRouter(RegisterSubject)
