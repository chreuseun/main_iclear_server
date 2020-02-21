import React, { useEffect, useState } from 'react'
import {  Segment, Dropdown, Container, Button, Form, Label, Divider, Header, Input, Dimmer, Loader } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import csv from 'csvtojson';
import baseURL from '../../../../../res/baseuri'

function ManageDepartment(props) {

    const { match, location, history } = props
    const [IsLoading,setIsLoading] = useState(true);
    const [didMount, setDidMount] = useState(false)
    const [ActAcadYear,setActAcadYear] = useState('');
    const [ActSemester,setActSemester] = useState('');
    const [ValAcadLevel,setValAcadLevel] = useState(undefined);
    const [ListEducLevel,setListEducLevel] = useState([]);
    const [CsvFile,setCsvFile] = useState();

    useEffect( () => {
        
        setDidMount(true);
        let xa = true;
     
        const x = async()=>{
            try{

                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                }

                const authorization = await await axios.post(`${baseURL}/api/auth` ,{} ,header);

                if(authorization.data.msg !== 'auth' || !authorization || authorization.data.user_details.user_type_id !== 'ADMIN') {
                    localStorage.clear();
                    history.push("/");
                }

                const result = await axios.post(`${baseURL}/api/educlevel/get`,{},header);

                const result1 = await axios.get(`${baseURL}/api/acad_year/active/get`,header);

                const result2 = await axios.get(`${baseURL}/api/semester/active/get`,header);
                  
                console.log(result1)
                console.log(result2)

                if(xa)
                {
                  setIsLoading(false);
                  setActAcadYear(result1.data.data[0]);
                  setActSemester(result2.data.data[0]);
                  setListEducLevel(result.data.sqlResult);
                }

                
            } catch(err) {
                props.history.push('/')
            }
            
        }
        x();

        return () => {
          xa=false;
          
        }

    }, []);

    if(!didMount) {
        return null
    }

    const parseCSV = async(e) => {
      try{
        e.preventDefault()
  
        console.log('CSV File Set')
        setCsvFile(e.target.files[0])
      } catch(err) {
        console.log('Invalid CSV')
      }
    }
 
    const parse2 = async(file) => {
      try{
        setIsLoading(true);

        setCsvFile(file)
  
        // initialize file reader
        var reader = new FileReader();
  
        function readCSVfile() {
          return(
            new Promise((res, rej)=>{
              
              reader.readAsText(file)
  
              reader.onload = function() {
                if(reader.result){
                  res(reader.result)
                } else {
                  rej('');
                }
              }
  
            })
          )
        }

        function refactorToMySQL() { 
          return(
            new Promise((res, rej) => {
              
              if(output){
                let data2= ( output.slice( 1, output.length).map((it, ix) => {
  
                    if(it.field1 !== "") {
                      return (
                                [
                                  it.field1, // id
                                  `${ValAcadLevel.id}`, // educ_level_id
                                  `${ValAcadLevel.code}${it.field1}`, // username
                                  `$2y$14$ic5Y36G3r5oZ19kZxaoQ/u/JItjRHSvYyO3x/FCkbzUjmkp7KWbGK`, // password
                                  it.field2, // image_url
                                  it.field3, // studfname
                                  it.field4, // studmname
                                  it.field5, // studlname
                                  it.field6, // course
                                  it.field7, // yearlevel
                                  it.field9, // cpnum
                                  it.field10, // familyphone
                                  it.field11, // gender
                                  it.field8,  // section
                                  `${ActAcadYear.id}`, // acad_year_id
                                  `${ValAcadLevel.id}` === '1' || `${ValAcadLevel.id}` === '2' ? '4' : `${ActSemester.id}`, // semester
                                  `${ValAcadLevel.id}` === '1' || `${ValAcadLevel.id}` === '2' ? 'NONE' : it.field12 || 'NONE',
                                  `${ValAcadLevel.id}` === '1' || `${ValAcadLevel.id}` === '2' ? 'NONE' : it.field13 || 'NONE',
                                ]
                      )
                    }    
                  })
                );
  
                res(data2)
              } else {
                rej([])
              }
  
            })
          )
        }

        let data = await readCSVfile()
        console.log(data)
  
        let output = await csv({noheader:true, output: "json " }).fromString(data);

        console.log(output)
        
        refactorToMySQL()
        .then(async(data)=>{
          const header = {
              headers: {
                  authorization : localStorage.getItem('x')
              }
          }

          const body = {
              values : data
          }

          const result = await axios.post(`${baseURL}/api/student/csv/insert`,body,header);
          
          alert('Uploading .CSV successful..')
          setIsLoading(false);
          console.log('CSV to Mysql Uploaded')
          console.log(result.data.data);
          
        })
        .catch(()=>{
          console.log('Invalid CSV')
          alert('Uploading .CSV failed..')
          setIsLoading(false);
        })
      } catch(err) {
        console.log('Invalid CSV')
        alert('Uploading .CSV failed..')
        setIsLoading(false);
      } 
    }

    const acadlevel_handleChange = (e, { value, text }) => {

        console.log(value)

        ListEducLevel.map((it,ix)=>{

            if(it.value === value){
                setValAcadLevel({
                    id : `${value}`,
                    code : `${it.code}`
                })
            }
        })
    }

    return(
        <Container textAlign="left" style={{marginTop:100}}  >

        <Dimmer inverted active={IsLoading}>
          <Loader/>
        </Dimmer>

        <Segment  style={{ maxWidth: 600 ,margin:"auto"}}> 

          <Header textAlign="center"   icon>
            <h2>Upload CSV</h2>
          </Header>

          <Form>

            <Form.Field >
              <Label as='a' color='blue'  ribbon>Active School Year</Label>
              <Input value={ActAcadYear.name}/>
            </Form.Field>

            <Form.Field >
              <Label as='a' color='blue'  ribbon>Active Semester</Label>
              <Input value={ActSemester.name}/>
            </Form.Field>

            <Form.Field >
              <Label as='a' color='blue'  ribbon>Acadamic Level</Label>
                  <Dropdown
                    placeholder='Acadamic Level'
                    fluid
                    onChange={acadlevel_handleChange}
                    search
                    selection
                    options={ListEducLevel}
                  />
            </Form.Field>

            <Form.Field >
              <Label as='a' color='blue'  ribbon>Upload .csv file</Label>
              <Input disabled={ValAcadLevel? false:true} onChange={(e)=> {parseCSV(e)}}  required  type="file" />
            </Form.Field>

            <Divider/>

            <Button onClick={()=>{ parse2(CsvFile); }} color='blue'>Upload</Button>
          </Form>
        </Segment>

      </Container>
    )
}

export default withRouter(ManageDepartment)