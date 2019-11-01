import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Dimmer, Loader} from 'semantic-ui-react';
import axios from 'axios';
import { withRouter,} from 'react-router-dom';
import baseURL from '../../../../../../../res/baseuri';


const ModalAddNewSubject = (props) =>{

    const { history } = props

    const [value, setValue] = useState('');
    const [didMount, setDidMount] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [educlevel, setEducLevel] = useState([]);
    const [dbdatas, setDatas] =useState([]);
    const [course, setCourse] = useState([]);
    const [yearlvl, setYearlvl] = useState([]);
    const [sect , setSect] = useState([]);
    const [close,setClose] = useState(false)


    // VALUES
    const [valSubj, setValSubj] = useState('');
    const [valAcLvl, setValAcLvl] = useState('');
    const [valCrs, setValCrs] = useState(''); 
    const [valYr, setValYr] = useState(''); 
    const [valSec, setValSec] = useState(''); 

    const [valAcYr, setValAcyr] = useState('');
    const [valSem, setValSem] = useState('');
    

    useEffect(()=>{
        setDidMount(true);
        let xa = true;

        const fetchData = async() => {

            try{
            
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                };

                const result = await axios.get(`${baseURL}/api/class/current`,header);

                if(xa){
                    setDatas(result.data.data);
                    let datas = result.data.data;
            
                    setEducLevel(Array.from(new Set(datas.map(s => s.educ_level_id)))
                                .map(educ_level_id => {
                                    return {
                                        key: `${educ_level_id}`,
                                        text: datas.find( s => s.educ_level_id === educ_level_id).el_name,
                                        value: `${educ_level_id}`
                                    }
                                }));
                            
                    console.log(datas)

                    setValAcyr(datas[0].acad_year_id); // acadYearId
                    setValSem(datas[0].sem_name);   // semId
                    setIsLoading(false)
                }

            } catch(err) {
                // localStorage.removeItem('x')
                console.log(err)
                history.push('/')
            }

        }

        fetchData();

        return () => (xa=false)
    }, []);

    if(!didMount){
        return null;
    }

    const acadLevelOnChange = (e,  {value}) => {
        console.log(value)
        setValAcLvl(`${value}`)

        // Set to NUll
        setValCrs('');
        setValYr('');
        setValSec('');

        // 
        let arr_course;
        if(`${value}` === '1' || `${value}` === '2'){
            arr_course = [{
                key:   'NONE',                    
                value: 'NONE',
                text:  'NONE'
            }]
        } else {
            arr_course = dbdatas.filter((item) => {
                return item.educ_level_id == value
            }).map((it)=>{
                return {
                    key:it.course,
                    value:it.course,
                    text:it.course
                    
                }
            })
            
            arr_course = Array.from(new Set(arr_course.map(s => s.key)))
            .map(key => {
                return {
                    key: `${key}`,
                    text: arr_course.find( s => s.key == key).text,
                    value: `${key}`
                }
            })
        }

        setCourse(arr_course)
    }

    const courseOnChange = (e, {value}) => {
        
        console.log(value)
        setValCrs(`${value}`)

        // Set to NUll
        setValYr('');
        setValSec('');


        let arr_course;
        if(`${valAcLvl}` === '1' || `${valAcLvl}` === '2'){
            
            arr_course = dbdatas.filter((item) => {
                return item.educ_level_id == `${valAcLvl}`
            }).map((it)=>{
                return {
                    key:it.yearlevel,
                    value:it.yearlevel,
                    text:it.yearlevel
                }
            })

            arr_course = Array.from(new Set(arr_course.map(s => s.key)))
            .map(key => {
                return {
                    key: `${key}`,
                    text: arr_course.find( s => s.key == key).text,
                    value: `${key}`
                }
            })
        } else {
            arr_course = dbdatas.filter((item) => {
                return item.educ_level_id == valAcLvl && item.course == value
            }).map((it)=>{
                return {
                    key:it.yearlevel,
                    value:it.yearlevel,
                    text:it.yearlevel 
                }
            })
            
            arr_course = Array.from(new Set(arr_course.map(s => s.key)))
            .map(key => {
                return {
                    key: `${key}`,
                    text: arr_course.find( s => s.key == key).text,
                    value: `${key}`
                }
            })
        }

        setYearlvl(arr_course)

    }

    const yearlevelOnChange = (e,{value}) => {
        console.log(value)
        setValYr(`${value}`)

        // Set to NUll
        setValSec('');

        let arr_course;

        if(`${valAcLvl}` === '1' || `${valAcLvl}` === '2'){
            
            arr_course = dbdatas.filter((item) => {
                return item.educ_level_id == `${valAcLvl}` && item.yearlevel ==  value
            }).map((it)=>{
                return {
                    key:it.section,
                    value:it.section,
                    text:it.section
                }
            })

            arr_course = Array.from(new Set(arr_course.map(s => s.key)))
            .map(key => {
                return {
                    key: `${key}`,
                    text: arr_course.find( s => s.key == key).text,
                    value: `${key}`
                }
            })
        } else {
            arr_course = dbdatas.filter((item) => {
                return item.educ_level_id == valAcLvl && item.course == valCrs && item.yearlevel == value
            }).map((it)=>{
                return {
                    key:it.section,
                    value:it.section,
                    text:it.section 
                }
            })
            
            arr_course = Array.from(new Set(arr_course.map(s => s.key)))
            .map(key => {
                return {
                    key: `${key}`,
                    text: arr_course.find( s => s.key == key).text,
                    value: `${key}`
                }
            })
        }

        setSect(arr_course)
    }

    const sectOnChange = (e, {value}) => {
        console.log(value)
        setValSec(`${value}`)
    }

    // save the Subject to class table
    const onSubmit = (e) =>{
        e.preventDefault();

        let saveSubj = async({body}) => {

            try{
                
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                };

                await axios.post(`${baseURL}/api/class/insert`, body, header);
                

                props.refreshSubjectlist();

                alert('Subject Added Successfully...')
                setClose(false)
            } catch(err) {
                // localStorage.removeItem('x')
                history.push('/')
            }
        }

        if(`${valSubj}` === '' || `${valAcLvl}` === '' ||`${valCrs}`=== '' || `${valYr}` === '' || `${valSec}` === '' ) {
            alert('Please require all fields...')
        } else {

            let body = {
                subj: `${valSubj}` ,
                el_id: `${valAcLvl}`,
                course: `${valCrs}`,
                year: `${valYr}`,
                section: `${valSec}`,
                account_id: `${props.userDetails.id}`
            }

            console.log(
                'Save Data to DB',
                body
            )

            saveSubj({body})
        }    

    }

    const onClick = () => {
        
        setValSubj('');
        setValAcLvl('');
        setValCrs('');
        setValYr('');
        setValSec('');
        setClose(true)
    }

    return(
        <Modal open={close} dimmer='blurring' size='fullscreen' trigger={<Button onClick={onClick} color='green'>Create New Subject</Button>}>
            
            <Dimmer active={isLoading} inverted>
                <Loader inverted>Loading</Loader>
            </Dimmer>

            <Modal.Actions>
                <Button onClick={()=>{setClose(false)}} negative>
                    Close
                </Button>
            </Modal.Actions>

            <Modal.Header>Add New Class</Modal.Header>


            <Modal.Content >
           
                <Modal.Description>
                <Form>

                    <Form.Group widths='equal'>
                        <Form.Input 
                            style={{maxWidth:'450px'}} 
                            fluid label='Subject Name'
                            value={valSubj}
                            onChange={(e)=>{e.preventDefault(); setValSubj(e.target.value)}}
                            placeholder='Subject Name' />
                    </Form.Group>

                    <Form.Group widths='equal'>

                        <Form.Select
                            fluid
                            label='Academic Level'
                            options={educlevel}
                            placeholder='Acad. Level'
                            value={`${valAcLvl}`}
                            onChange={acadLevelOnChange}
                        />

                        <Form.Select
                            fluid
                            label='Course'
                            options={course}
                            placeholder='Course'
                            value={`${valCrs}`}
                            onChange={courseOnChange}
                        />              

                        <Form.Select
                            fluid
                            label='Year level'
                            options={yearlvl}
                            placeholder='Year level'
                            onChange={yearlevelOnChange}
                            value={`${valYr}`}
                          
                        />

                        <Form.Select
                            fluid
                            label='Section'
                            options={sect}
                            placeholder='Section'
                            onChange={sectOnChange}
                            value={valSec}
                        />

                    </Form.Group>
                    
                 </Form>
                   
                </Modal.Description>

            </Modal.Content>

            <Modal.Actions>
                <Button onClick={onSubmit} primary>
                    Save
                </Button>
            </Modal.Actions>

        </Modal>
    )
}

export default withRouter(ModalAddNewSubject)
