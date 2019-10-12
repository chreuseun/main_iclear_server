import React, {  useState, useEffect } from 'react'
import { Form, Header,Segment, Button,Divider, Label, Container, Dropdown} from 'semantic-ui-react'
import axios from 'axios';
import { withRouter, Redirect} from "react-router-dom";
//COMPONENTS
import Loader from '../../../../reuse/loader';

function FormExampleSubcomponentControl (props) {
  
    //STATES
    const [loader, setLoader] = useState(true);

    const [ type , setType ] = useState([]);  // dept type ADMIN OR USER
    const [ acadlevel , setAcadLevel] = useState([]);  // Academic Level
    const [ course , setCourse ] = useState([]);  // Course
    const [ yearlevel , setYearLevel ] = useState([]);  // Yearlevel
    const [ subdata , setSubDate ] = useState([]);
    const [ initData, setInitData] = useState([])

    const [ valDeptName, setValDeptName] = useState('');
    const [ valType, setValType ] = useState('');
    const [ valAcadLevel, setValAcadLevel ] = useState('');
    const [ valCourse, setValCourse ] = useState('');
    const [ valYearLevel, setValYearLevel ] = useState('');
    const [ valHeadOff, setValHeadOff] = useState('');
    const [valStatus, setValStatus] = useState('');

  
    
    const x = async()=>{
      try{

        const header = {
              headers: {
                  authorization : localStorage.getItem('x')
              },
          }

          let result = await axios.post('http://localhost:4040/api/departmentstype/get',{},header);
          setType(result.data.sqlResult)
          // console.log('TYPE OK');

          result = await axios.post('http://localhost:4040/api/educlevel/get',{},header);
          setAcadLevel(result.data.sqlResult)
          // console.log('acadlevel OK');

          result = await axios.post('http://localhost:4040/api/educcourselevel/get',{},header);
          setSubDate(result.data.sqlResult)
          // console.log('yr_cors OK');

          result = await axios.post('http://localhost:4040/api/department/getone',{id:props.deptKey},header);
          // console.log( result.data.sqlResult[0]);

          let sqlResult = result.data.sqlResult[0];

          setValDeptName(sqlResult.d_name);
          setValType(sqlResult.d_type);

          setValAcadLevel(sqlResult.el_id);
          let initResult = await axios.post('http://localhost:4040/api/initeduccourselevel',{id:sqlResult.el_id},header);
           
          setInitData(initResult.data.sqlResult);

          setCourse(initResult.data.sqlResult.course);
          setYearLevel(initResult.data.sqlResult.yearlevel);

          setValCourse(sqlResult.d_course);
          setValYearLevel(sqlResult.d_yearlevel);

          setValHeadOff(sqlResult.head_officer);
          setValStatus(parseInt(sqlResult.d_state));
          
          
          setLoader(false)
          
          

      } catch(err) {
              props.history.push('/')
      } 
  }
    
    useEffect(() => {
 
      const ac = new AbortController();

       


        x();

        return ()=> ac.abort();

    }, [])

    // ON SUBMIT
    const onSubmit = async(e) => {
      e.preventDefault();   

      if(
        valDeptName.trim() === ''    || valType  === ''   ||
        valAcadLevel  === ''  || valCourse === '' ||
        valYearLevel === ''   || valHeadOff.trim() === '' || valStatus === ''
      ) {
        alert("Please suppliment required fields")

      } else {
        setLoader(true);

        let body = {
          valDepartment_id : props.deptKey,
          valDeptName  : valDeptName,
          valType  : valType,
          valAcadLevel  : valAcadLevel,
          valCourse : valCourse ,
          valYearLevel : valYearLevel,
          valHeadOff : valHeadOff,
          valStatus : valStatus 
        }
  
        let headers ={
          headers:{
            authorization : localStorage.getItem('x')
          }
        }
  
        let response = await axios.post('http://localhost:4040/api/department/update', body, headers)
  
        if(response) {
          console.log(props.location)
          
          alert('Department Updated', )
          props.history.push(props.location.pathname)
          
        } else {
          alert('Department Update Failed...')
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

     // Yearlevel Changed
     const status_handleChange = (e, { value }) => {
        setValStatus(value);
        console.log(valStatus)
      
    }

    if(loader) {
      return(<Loader loadText='Loading'/>)
    }

    // DISPLAY FORM
    return (
      <Container textAlign="left" style={{marginTop:20}}  >
        <Segment  style={{ maxWidth: 600 ,margin:"auto"}}> 

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
                  value={valType}
                  onChange={type_handleChange}
                  options={type}
                  />
            </Form.Field>

            <Form.Field >
              <Label as='a' color='blue'  ribbon>Acadamic Level</Label>
                  <Dropdown
                  placeholder='Acadamic Level'
                  fluid                  
                  search
                  selection
                  value={valAcadLevel}
                  onChange={acadlevel_handleChange}
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
                    value={valCourse}
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
                    value={valYearLevel}
                    onChange={yearlevel_handleChange}
                    options={yearlevel}
                  />
            </Form.Field>

            <Form.Field >
              <Label as='a' color='blue'  ribbon>Status</Label>
                  <Dropdown
                    placeholder='Status'
                    fluid
                    search
                    selection
                    value={valStatus}
                    onChange={status_handleChange}
                    options={
                        [
                            {key:1,value:1,text:'ACTIVE'},
                            {key:0,value:0,text:'DISABLE'},
                        ]
                    }
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
 
// () => {console.log(valDeptName, valType, valAcadLevel, valCourse, valYearLevel, valStatus, valHeadOff)}