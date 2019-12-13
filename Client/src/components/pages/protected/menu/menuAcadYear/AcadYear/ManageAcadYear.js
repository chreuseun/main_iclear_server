import React, { useEffect, useState } from 'react'
import { Table, Segment, Dropdown, Container, Modal, Radio, Button, Form, Label, Divider, Header, Tab } from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import baseURL from '../../../../../../res/baseuri'

// Loader
import Loader from '../../../../../reuse/loader';

function ManageAcadYear(props) {

    const { match, location, history } = props

    const [didMount, setDidMount] = useState(false)

    const [deptList, setDeptList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
  

                const result = await axios.get(`${baseURL}/api/acad_year/get`,header);
                
                if(xa)
                {
                    setDeptList(result.data.data);
                }

                
            } catch(err) {
                history.push('/')
            }
            
        }
        x();

        return () => (xa=false)

      }, []);

    if(!didMount) {
        return null
    }

    const internalRefresh = async()=>{
        try{
            const header = {
                headers: {
                    authorization : localStorage.getItem('x')
                }
            }

            const result = await axios.get(`${baseURL}/api/acad_year/get`,header);
               
                setDeptList(result.data.data);
    
        } catch(err) {
            props.history.push('/')
        }
        
    }

    const setActAcadYear = async(base_year) => {
        console.log(base_year)
        
        try{
            const header = {
                headers: {
                    authorization : localStorage.getItem('x')
                }
            }

            let result1 = await axios.post(`${baseURL}/api/acad_year/set`,{base_year:base_year},header);

            let result = await axios.get(`${baseURL}/api/acad_year/get`,header);
               
                setDeptList(result.data.data);
    
        } catch(err) {
            props.history.push('/')
        }
    }

    const AddNewAcadYear = async() => {
        console.log('Button Add Acad Year Cliked')

        
        try{
            const header = {
                headers: {
                    authorization : localStorage.getItem('x')
                }
            }

            let result1 = await axios.post(`${baseURL}/api/acad_year/insert`,{},header);

            let result = await axios.get(`${baseURL}/api/acad_year/get`,header);
               
            setDeptList(result.data.data);
    
        } catch(err) {
            props.history.push('/')
        }
    }

    const componentDeptList = deptList.map((it, idx) => {
        return(
            <Table.Row key={it.id}  negative={it.state==="1"? false : true} >
                      
                <Table.Cell>
                    <Radio onClick={() =>{setActAcadYear(it.base_year)} } toggle checked={it.state==='1'?true:false}/> 
                </Table.Cell>
                <Table.Cell>{it.name}</Table.Cell>
                <Table.Cell>{it.base_year}</Table.Cell>

            </Table.Row>      
        )
    })

    return(
        <Container>
            <h2>Manage School Year</h2>
            
            <Segment style={{ overflow: 'auto', maxHeight: '1000vh' }}>

                <Button  onClick={() => {AddNewAcadYear()}} positive>Add School Year</Button>

                <Segment.Group horizontal>                    
                    <Table singleLine>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Active S.Y.</Table.HeaderCell>
                                <Table.HeaderCell>Acad. Year</Table.HeaderCell>
                                <Table.HeaderCell>Base Year</Table.HeaderCell>
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