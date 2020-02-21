import React, {  useState, useEffect } from 'react'
import { Form,Segment, Button,Divider, Label, Container, Dropdown, Radio} from 'semantic-ui-react'
import axios from 'axios';
import baseURL from '../../../../../res/baseuri'
import { withRouter} from "react-router-dom";
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
    const [ initData, setInitData] = useState([]);
    const [crsDept, setCrsDept] = useState([]); // crsDept
    const [ valDeptName, setValDeptName] = useState('');
    const [ valType, setValType ] = useState('');
    const [ valAcadLevel, setValAcadLevel ] = useState('');
    const [ valCourse, setValCourse ] = useState('');
    const [ valYearLevel, setValYearLevel ] = useState('');
    const [ valHeadOff, setValHeadOff] = useState('');
    const [valStatus, setValStatus] = useState('');
    const [ valCrsDept, setValCrsDept ] = useState('');
    const [ valIsChecked, setValIsChecked] = useState('none');

    useEffect(() => {
 
    const ac = new AbortController();

    const x = async()=>{
      try{

        const header = {
          headers: {
              authorization : localStorage.getItem('x')
          }
        }

          let result = await axios.post(`${baseURL}/api/departmentstype/get`,{},header);
          setType(result.data.sqlResult)

          result = await axios.post(`${baseURL}/api/educlevel/get`,{},header);
          setAcadLevel(result.data.sqlResult)

          result = await axios.post(`${baseURL}/api/educcourselevel/get`,{},header);
          setSubDate(result.data.sqlResult)

          result = await axios.post(`${baseURL}/api/department/getone`,{id:props.deptKey},header);

          let sqlResult = result.data.sqlResult[0];

          setValDeptName(sqlResult.d_name);
          setValType(sqlResult.d_type);
          setValIsChecked(sqlResult.is_subdep);
          setValAcadLevel(sqlResult.el_id);

          let data_crsDept = await axios.get(`${baseURL}/api/departments/coursedepartment/${sqlResult.el_id}`,header);
          setCrsDept(data_crsDept.data.data)

          setValCrsDept(sqlResult.student_department);

          let initResult = await axios.post(`${baseURL}/api/initeduccourselevel`,{id:sqlResult.el_id},header);
           
          setInitData(initResult.data.sqlResult);
          setCourse(initResult.data.sqlResult.course);
          setYearLevel(initResult.data.sqlResult.yearlevel);
          setValCourse(sqlResult.d_course);
          setValYearLevel(sqlResult.d_yearlevel);
          setValHeadOff(sqlResult.head_officer);
          setValStatus(parseInt(sqlResult.d_state));

          setLoader(false);
      } catch(err) {
              props.history.push('/')
      } 
    }
        x();

        return ()=> ac.abort();

    }, []);

    // ON SUBMIT
    const onSubmit = async(e) => {
      e.preventDefault();   

      if(
        valDeptName.trim() === ''    || valType  === ''   ||
        valAcadLevel  === ''  || valCourse === '' ||
        valYearLevel === ''   || valHeadOff.trim() === '' || valStatus === '' ||
        valCrsDept === ''
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
          valStatus : valStatus ,
          valCrsDept: valCrsDept,
          valIsChecked:valIsChecked
        }

        let headers ={
          headers:{
            authorization : localStorage.getItem('x')
          }
        }

        let response = await axios.post(`${baseURL}/api/department/update`, body, headers)

        if(response) {
          console.log(props.location)
          
          alert('Department Updated', )
          props.history.push(props.location.pathname)
          
        } else {
          alert('Department Update Failed...')
        }
      }

      setLoader(false)
    }

    // ON Dept TYPE CHANGE
    const type_handleChange = (e, { value }) => {
      setValType(value)
      console.log(valType)
    }

    // ACADLEVEL CAHNGE
    const acadlevel_handleChange = async(e, { value }) => {

      setValAcadLevel(value)
      setCrsDept([])
      setYearLevel([]);
      setCourse([]);
      setValCrsDept('')
      setValYearLevel('');
      setValCourse('');

        try{
          const header = {
            headers: {
                authorization : localStorage.getItem('x')
            }
          }

          let data_crsDept = await axios.get(`${baseURL}/api/departments/coursedepartment/${value}`,header);
          setCrsDept(data_crsDept.data.data)
        } catch(err) {
                props.history.push('/')
        }  
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

     // TO DISABLE AND ENABLE A DEPARTMENT
     const status_handleChange = (e, { value }) => {
        setValStatus(value);
        console.log(valStatus)
      
    }

    // Department of course
    const crsDept_handleChange = (e, { value }) => {

      setValCrsDept(value);
      setYearLevel([]);
      setCourse([]);
      setValYearLevel('');
      setValCourse('');

      let filter=( subdata.course.filter((item)=> {
        return (item.educ_level_id === valAcadLevel && item.department === value ) 
      }) );

      let filter1=( subdata.yearlevel.filter((item)=> {
        return item.educ_level_id === valAcadLevel  
      }) );

      if(value === 'ALL') {
        setCourse( [ ...filter.map((it, idx) => { 
          return {key:it.course,value:it.course, text: it.course }
        }) ] );
  
      } else {
        setCourse( [ {key:'ALL', value: 'ALL', text: 'ALL' }, ...filter.map((it, idx) => { 
          return {key:it.course,value:it.course, text: it.course }
        }) ] );
      }

     
      setYearLevel( filter1.map((it, idx) => {
        return {key:it.yearlevel,value:it.yearlevel, text: it.yearlevel }
      }));
    }

    const onIsRadio_handleChange = (e, {value}) => {
      console.log(value);
      setValIsChecked(value)
    }

    const TradionSubDept = () => {

      return(
          <React.Fragment>
               {/* SELECT [NONE, REG, FIN] */}
          
              <Form.Group widths='equal'  >
                <Form.Field>
                  <Radio
                    
                    value='none'
                    label='none'
                    name='radioGroup'
                    checked={valIsChecked === 'none'}
                    onChange={onIsRadio_handleChange}
                  />  
                </Form.Field>

                <Form.Field>
                  <Radio
                    
                    label='Is Finance?'
                    name='radioGroup'
                    value='fin'
                    checked={valIsChecked === 'fin'}
                    onChange={onIsRadio_handleChange}
                  />
                </Form.Field>
                <Form.Field>
                  <Radio
                    
                    value='reg'
                    label='Is Registrar?'
                    name='radioGroup'
                    checked={valIsChecked === 'reg'}
                    onChange={onIsRadio_handleChange}
                  />  
                </Form.Field>
              </Form.Group>
       
          </React.Fragment>
      )
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

            {valType === 2 ?  <TradionSubDept/> : ''}

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
              <Label as='a' color='blue'  ribbon>Department</Label>
                  <Dropdown
                    placeholder='Course'
                    fluid
                    search
                    selection
                    value={valCrsDept}
                    onChange={crsDept_handleChange}
                    options={crsDept}
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