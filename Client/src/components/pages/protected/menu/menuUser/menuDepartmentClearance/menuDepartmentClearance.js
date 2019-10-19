import React, { useEffect, useState } from 'react'
import { Table, Segment, Container,  Radio, Header, Button, Input,Loader, Dimmer} from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import baseURL from '../../../../../../res/baseuri';


function ManageAcadYear(props) {

    const { match, location, history } = props

    const [didMount, setDidMount] = useState(false)

    const [deptList, setDeptList] = useState([]);
    const [context, setContext] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [ShowForm, setShowForm] = useState(false);// 
    const [depinfo, setDepInfo] = useState({});// 

    const [DepStd,setDepStd] = useState([]);
    
    

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


                const detStd_ = (await axios.get(`${baseURL}/api/departments/103/std`, header))


                console.log(detStd_.data.data.students)
                if(xa)
                {
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

        /*
            "s_id": 1,
            "s_acd_yr": 1,
            "s_sem_id": 1,
            "d_type_id": 2,
            "d_crs": "-ALL",
            "d_yr": "-ALL",
            "el_id": 4,
            "d_id": 103,
            "s_username": "CL1",
            "s_fn": "Jason Marc",
            "s_mn": "Marinas",
            "s_ln": "Del Rosario",
            "s_yr": "1st",
            "s_sec": "B",
            "s_crs": "BSCPE",
            "ay_name": "2019-2020",
            "sem_name": "1st"
        */

        return(
            <Table.Row key={it.s_username}  >
                      
                <Table.Cell>{it.s_id}</Table.Cell>
                <Table.Cell>{it.s_username}</Table.Cell>
                <Table.Cell>{`${it.s_ln}, ${it.s_fn} ${it.s_mn}`}</Table.Cell>
                <Table.Cell>{it.s_sec}</Table.Cell>
                <Table.Cell>{`${it.s_crs} - ${it.s_yr}`}</Table.Cell>
                <Table.Cell>{`${it.ay_name} - ${it.sem_name}`}</Table.Cell>
            </Table.Row>      
        )
    })

    // ***************************************************************************
    const addBtnOnClick = () => {
       
            setShowForm(!ShowForm);
        
    }

    const saveReqOnClick = async() => {
        if(context.trim() !== ''){
            try{
                setIsLoading(true)
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                }

         
                const add = await axios.post(`${baseURL}/api/departments/req/add`,{d_id: match.params.dept, context},header);
                console.log(add.data.data)

                // final step
                const result = await axios.get(`${baseURL}/api/departments/${match.params.dept}/req/get`,header);
                setDeptList(result.data.data);

                setContext('')
                alert('Added')

                setIsLoading(false)
                
            } catch(err) {
                props.history.push('/')
            }
        } else {
            alert('Requiment field required..')
            setIsLoading(false)
        }

        
    }

    return(
        <Container>

            <Dimmer  active={isLoading} inverted>
                <Loader inverted content='Loading' />
            </Dimmer>

            <Header textAlign='center'>{props.title}: {depinfo.d_name || ''}</Header>

            <Button onClick={addBtnOnClick} positive ={!ShowForm} negative={ShowForm} >{ShowForm?'Cancel':'Add Requirement'}</Button>
            
            <Container  style={{marginTop:'15px',maxWidth:'600px',display: ShowForm?'block':'none'}}>
                <Input  
                    style={{maxWidth:'500px'}}     
                    fluid            
                    placeholder='New Requirement'
                    value={context}
                    onChange={
                        (e) => {
                            e.preventDefault();
                            setContext(e.target.value)
                        }
                    } 
                />

                <Button 
                    onClick={()=>{saveReqOnClick()}}
                    style={{marginTop:'5px'}} color='green'>Save</Button> 
            </Container>
          
            <Segment style={{ overflow: 'auto', maxHeight: '1000vh' }}>
           
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

export default withRouter(ManageAcadYear)