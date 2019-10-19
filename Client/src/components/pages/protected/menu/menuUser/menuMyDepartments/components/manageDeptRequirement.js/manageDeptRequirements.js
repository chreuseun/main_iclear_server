import React, { useEffect, useState } from 'react'
import { Table, Segment, Container,  Radio, Header, Button, Input,Loader, Dimmer} from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import baseURL from '../../../../../../../../res/baseuri';
import { async } from 'q';

function ManageAcadYear(props) {

    const { match, location, history } = props

    const [didMount, setDidMount] = useState(false)

    const [deptList, setDeptList] = useState([]);
    const [context, setContext] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [ShowForm, setShowForm] = useState(false);
    const [depinfo, setDepInfo] = useState({});
    

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
                const depInf = await axios.post(`${baseURL}/api/department/getone`,{id:match.params.dept}, header)

                const result = await axios.get(`${baseURL}/api/departments/${match.params.dept}/req/get`,header);
                console.log(depInf.data.sqlResult[0])
                if(xa)
                {
                    setDepInfo(depInf.data.sqlResult[0]);
                    setDeptList(result.data.data);
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
  
    const componentDeptList = deptList.map((it, idx) => {
        return(
            <Table.Row key={it.id}  negative={it.state==="1"? false : true} >
                      
                <Table.Cell>{it.context}</Table.Cell>
                <Table.Cell>
                    <Radio onClick={() =>{} } toggle checked={it.state==='1'?true:false}/> 
                </Table.Cell>
                
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

            <Header textAlign='center'>Requirements: {depinfo.d_name || ''}</Header>

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
                    <Table singleLine>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Requirement</Table.HeaderCell>
                                <Table.HeaderCell>State</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                            <Table.Body>
                                {componentDeptList}
                            </Table.Body>
                        </Table>
                    </Segment.Group>               
            </Segment>
        </Container>  
        )
}

export default withRouter(ManageAcadYear)
