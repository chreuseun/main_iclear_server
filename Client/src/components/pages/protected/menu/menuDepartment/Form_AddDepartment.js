import React, {  useState, useEffect } from 'react'
import { Form, Header,Segment, Button,Divider, Label, Container, Dropdown} from 'semantic-ui-react'
import axios from 'axios';
import baseURL from '../../../../../res/baseuri';
import { withRouter, Redirect} from "react-router-dom";
//COMPONENTS
import Loader from '../../../../reuse/loader';



function FormExampleSubcomponentControl (props) {
    
    const _isMounted = false;
    


    //STATES
    const [loader, setLoader] = useState(true);

    const [ type , setType ] = useState([]);  // dept type ADMIN OR USER
    const [ acadlevel , setAcadLevel] = useState([]);  // Academic Level
    const [ course , setCourse ] = useState([]);  // Course
    const [ yearlevel , setYearLevel ] = useState([]);  // Yearlevel
    const [ subdata , setSubDate ] = useState([]);

    const [ valDeptName, setValDeptName] = useState('');
    const [ valType, setValType ] = useState('');
    const [ valAcadLevel, setValAcadLevel ] = useState('');
    const [ valCourse, setValCourse ] = useState('');
    const [ valYearLevel, setValYearLevel ] = useState('');
    const [ valHeadOff, setValHeadOff] = useState('');
    
    useEffect(() => {
        
        const header = {
            headers: {
                authorization : localStorage.getItem('x')
            }
        }

        const x = async()=>{
            try{
                let result = await axios.post(`${baseURL}/api/departmentstype/get`,{},header);
                setType(result.data.sqlResult)
                console.log('TYPE OK');

                // 

                result = await axios.post(`${baseURL}/api/educlevel/get`,{},header);
                setAcadLevel(result.data.sqlResult)
                console.log('acadlevel OK');

                result = await axios.post(`${baseURL}/api/educcourselevel/get`,{},header);
                setSubDate(result.data.sqlResult)
                console.log('yr_cors OK');

                setLoader(false)

            } catch(err) {
                    props.history.push('/')
            } 
        }

        x();

    }, [])

    // ON SUBMIT
    const onSubmit = async(e) => {
      e.preventDefault();   

      

      if(
        valDeptName.trim() === ''    || valType  === ''   ||
        valAcadLevel  === ''  || valCourse === '' ||
        valYearLevel === ''   || valHeadOff.trim() === ''
      ) {
        alert("Please suppliment required fields")

      } else {
        setLoader(true);

        let body = {
          valDeptName  : valDeptName,
          valType  : valType,
          valAcadLevel  : valAcadLevel,
          valCourse : valCourse ,
          valYearLevel : valYearLevel,
          valHeadOff : valHeadOff 
        }
  
        let headers ={
          headers:{
            authorization : localStorage.getItem('x')
          }
        }
  
        let response = await axios.post(`${baseURL}/api/departmentinsert`, body, headers)
  
        if(response) {
          setValDeptName('');
          setValType('') ;
          setValAcadLevel('') ;
          setValCourse('') ;
          setValYearLevel('');
          setValHeadOff('');
  
          alert('Department Added')
        } else {
          alert('Adding Department Failed...')
        }
      }

     

      setLoader(false)

      // ************************************************************************************
    }

    // ON Dept TYPE CHANGE
    const type_handleChange = (e, { value }) => {
      setValType(value)
      console.log(valType)
    }

    // ACADLEVEL CAHNGE
    const acadlevel_handleChange = (e, { value }) => {
        setValAcadLevel(value)
      
        setValYearLevel('');
        setValCourse('');

        let filter=( subdata.course.filter((item)=> {
          return item.educ_level_id === value
        }) )

        let filter1=( subdata.yearlevel.filter((item)=> {
          return item.educ_level_id === value
        }) )
  
        setCourse(filter.map((it, idx) => { 
          console.log(it)
          return {key:it.course,value:it.course, text: it.course }
        }))

        setYearLevel(filter1.map((it, idx) => { 
          console.log(it)
          return {key:it.yearlevel,value:it.yearlevel, text: it.yearlevel }
        }))
 
    }

    // Course Changed
    const course_handleChange = (e, { value }) => {
      setValCourse(value);
      console.log(valCourse)
    }

    // Yearlevel Changed
    const yearlevel_handleChange = (e, { value }) => {
      setValYearLevel(value);
      console.log(valYearLevel)
    }

    if(loader) {
      return(<Loader loadText='Loading'/>)
    }

    // DISPLAY FORM
    return (
      <Container textAlign="left" style={{marginTop:20}}  >
        <Segment  style={{ maxWidth: 600 ,margin:"auto"}}> 
      
          <Header textAlign="center"  color='blue' icon>
            Add Department
          </Header>

          <Form>

            <Form.Field >
              <Label as='a' color='blue'  ribbon>Department Name</Label>
              <input  required maxLength="40" name="department" value={valDeptName} onChange={(e)=>{setValDeptName(e.target.value)}}/>
            </Form.Field>

            <Form.Field >
              <Label as='a' color='blue'  ribbon>Type</Label>
                  <Dropdown
                  placeholder='Daparment Type'
                  fluid
                  search
                  selection
                  onChange={type_handleChange}
                  options={type}
                  />
            </Form.Field>

            <Form.Field >
              <Label as='a' color='blue'  ribbon>Acadamic Level</Label>
                  <Dropdown
                  placeholder='Acadamic Level'
                  fluid
                  onChange={acadlevel_handleChange}
                  search
                  selection
                  options={acadlevel}
                  />
            </Form.Field>

            <Form.Field >
              <Label as='a' color='blue'  ribbon>Course</Label>
                  <Dropdown
                    placeholder='Course'
                    fluid
                    search
                    selection
                    onChange={course_handleChange}
                    options={course}
                  />
            </Form.Field>

            <Form.Field >
              <Label as='a' color='blue'  ribbon>Yearlevel</Label>
                  <Dropdown
                    placeholder='Year Level'
                    fluid
                    search
                    selection
                    onChange={yearlevel_handleChange}
                    options={yearlevel}
                  />
            </Form.Field>

            <Form.Field >
              <Label as='a' color='blue' ribbon>Head Officer</Label>
              <input  required maxLength="40" name="Officer name" value={valHeadOff} onChange={(e)=>{setValHeadOff(e.target.value)}}/>
            </Form.Field>
            

            <Divider/>

            <Button onClick={onSubmit} >Submit</Button>
          </Form>
        </Segment>

      </Container>
    )
  
}

export default withRouter(FormExampleSubcomponentControl);