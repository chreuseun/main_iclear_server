import React, { useEffect, useState } from 'react'
import { Table, Segment, Dropdown, Container, Modal, Button, Form, Label, Divider, Header, Input } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import csv from 'csvtojson';

// Loader
import Loader from '../../../../reuse/loader';
import { async } from 'q';
import { userInfo } from 'os';


function ManageDepartment(props) {

    const { match, location, history } = props
    const [didMount, setDidMount] = useState(false)
    const [CsvArr, setCsvArr] =  useState([]);
    const [ActAcadYear,setActAcadYear] = useState('');
    const [ActSemester,setActSemester] = useState('');
    const [ValAcadLevel,setValAcadLevel] = useState({});
    const [ListEducLevel,setListEducLevel] = useState([]);

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

                const result = await axios.post('http://localhost:4040/api/educlevel/get',{},header);
                
                if(xa)
                {
                    setListEducLevel(result.data.sqlResult)
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


    // ********** Client Logics
    const parseCSV = async(e) => {
        e.preventDefault()
  
        // initialize file reader
        var reader = new FileReader();
  
        function a() {
          return(
            new Promise((res, rej)=>{
              
              reader.readAsText(e.target.files[0])
  
              reader.onload = function(e) {
                if(reader.result){
                  res(reader.result)
                } else {
                  rej('');
                }
              }
  
            })
          )
        }
  
        let data = await a()
  
        let output = await csv({noheader:true, output: "json " }).fromString(data);
        
        let selected_educLevel =  `${1}`; // FROM API
        let activeAcadYear = `${1}`; // FROM API
        let activeSem = `${1}`; // FROM API
  
        function b() {
          return(
            new Promise((res, rej) => {
              
              if(output){
                let data2= ( output.slice( 1, output.length).map((it, ix) => {
  
                    if(it.field1 !== "") {
                      return (
                                [
                                  it.field1, // id
                                  selected_educLevel, // educ_level_id
                                  `GS${it.field1}`, // username
                                  `$2y$14$0KXJgXTja40eZLNTf7oSy.y6buQOKuuCKcSK87Hh3cNjHzaU95fa6`, // password
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
                                  activeAcadYear, // acad_year_id
                                  activeSem, // semester_id
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
  
        setCsvArr( await b());
  
        console.log(CsvArr)
    }

    const uploadCSV = async(e) => {
        try{

            const header = {
                headers: {
                    authorization : localStorage.getItem('x')
                }
            }

            const body = {
                values : CsvArr
            }

            const result = await axios.post('http://localhost:4040/api/student/csv/insert',body,header);
      
            console.log(result.data);
            
        } catch(err) {
            props.history.push('/')
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
        
        // setValAcadLevel(value)
      
        // setValYearLevel('');
        // setValCourse('');

        // let filter=( subdata.course.filter((item)=> {
        //   return item.educ_level_id === value
        // }) )

        // let filter1=( subdata.yearlevel.filter((item)=> {
        //   return item.educ_level_id === value
        // }) )
  
        // setCourse(filter.map((it, idx) => { 
        //   console.log(it)
        //   return {key:it.course,value:it.course, text: it.course }
        // }))

        // setYearLevel(filter1.map((it, idx) => { 
        //   console.log(it)
        //   return {key:it.yearlevel,value:it.yearlevel, text: it.yearlevel }
        // }))
 
    }

    return(
        <Container textAlign="left" style={{marginTop:100}}  >
        <Segment  style={{ maxWidth: 600 ,margin:"auto"}}> 
      
          <Header textAlign="center"   icon>
            <h2>Upload CSV</h2>
          </Header>

          <Form>

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
              <Input onChange={(e)=> {parseCSV(e)}}  required  type="file" />
            </Form.Field>

            <Divider/>

            <Button onClick={()=>{console.log(ValAcadLevel);}} color='blue'>Upload</Button>
          </Form>
        </Segment>

      </Container>
    )
}


export default withRouter(ManageDepartment)