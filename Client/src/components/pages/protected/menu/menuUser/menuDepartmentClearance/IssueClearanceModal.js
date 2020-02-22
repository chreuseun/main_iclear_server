import React, { useState, useEffect } from 'react'
import { Container,Table, Button, Image, Checkbox,Card, Grid, Dimmer, Loader, Message } from 'semantic-ui-react'
import {withRouter} from 'react-router-dom'
import baseURL from '../../../../../../res/baseuri'
import axios from 'axios';

const ModalScrollingExample = (props) => {

    const { match, location, history } = props
    const [load, setLoad] = useState(true);
    const [didMount ,setDidMount] = useState(false); 
    const [requirements,setRequirements] = useState([]);
    const [insertErr, setInsertErr] = useState(true);
    const [insertOk, setInsertOk] = useState(true);
    const [records, setRecords] = useState([]);

    useEffect( () => {

        console.log('STUDENT INFO              : ',props.studentInfo)
       
        setDidMount(true);
        let xa = true;
     
        const x = async()=>{
            try{

                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                }
                const depInf = await axios.post(`${baseURL}/api/department/getone`,{id:location.state.dept}, header) 

                const result = await axios.get(`${baseURL}/api/departments/${location.state.dept}/req/get`,header);

                const _issRecords = await axios.post(`${baseURL}/api/clearance/issue/get`, {d_id:location.state.dept , s_uid:props.studentInfo.s_username }, header); // 
            
                if(xa)
                {
                  setRequirements(result.data.data.map((it,ix)=> {
                    it.selected= false
                    return(it)
                  }))

                  setRecords(_issRecords.data.data);

                  setLoad(false);
                } 
            } catch(err) {
                props.history.push('/')
            }
            
        }

        x();

        return () => (xa=false)

    }, []);

    // click the requirement trun the check to TRUE or FALSE
    const onSelected = (id) => {
    
        setRequirements(requirements.map((it,ix)=>{

            if(`${it.id}` === `${id}`){
                it.selected = !it.selected
            }

            return(it)

        }))
    }

    // filter requirement which selected is true
    const onSaveIssue = async() => {

       try{
            console.log('saving isuue');

            setLoad(true)

            const header = {
                headers: {
                    authorization : localStorage.getItem('x')
                }
            }
            
            const actYr = (await axios.get(`${baseURL}/api/acad_year/active/get`, header)).data.data[0].id;

            const actSem = (await axios.get(`${baseURL}/api/semester/active/get`,header)).data.data[0].id;

            let filt =  (requirements.filter((it)=>{            
                return it.selected === true
            }))

            console.log('user_details: ', props.userDetails);
            let addData = filt.map((it, id)=>{

                console.log('Looping again: ')

                return([
                    props.studentInfo.s_username,
                    `${props.studentInfo.s_username}${location.state.dept}${actYr}${actSem}${it.context}`,
                    location.state.dept,
                    actYr,
                    props.studentInfo.s_sem_id == 4 ?  props.studentInfo.s_sem_id : actSem ,
                    it.context,
                    props.userDetails.id,
                    props.studentInfo.s_crs,
                    props.studentInfo.s_yr,
                    props.studentInfo.s_sec
                ])
            })  

            // if length is NOT ZERO
            if(addData.length !== 0){

                 console.log('Posting')
                await axios.post(`${baseURL}/api/clearance/issue/add`,{addData},header);

               
                const _issRecords = await axios.post(`${baseURL}/api/clearance/issue/get`, {d_id:location.state.dept , s_uid:props.studentInfo.s_username }, header);
                setRecords(_issRecords.data.data)
                setLoad(false)

                setInsertOk(false)
                setTimeout(()=>{ setInsertOk(true) }, 3000);
            } else {
                setLoad(false)
                setInsertErr(false)
                setTimeout(()=>{ setInsertErr(true) }, 3000);
            }

        } catch(err) {
            // props.history.push('/')
        }
    } 

    const onRemarkClick = async(id, remarks) => {
        setLoad(true);
            
    
        try{
            const header = {
                headers: {
                    authorization : localStorage.getItem('x')
                }
            }

            // Update Clearand Remarks
            await axios.post(`${baseURL}/api/clearance/issue/update/${id}/${remarks}`,{},header);

            setRecords((await axios.post(`${baseURL}/api/clearance/issue/get`, {d_id:location.state.dept , s_uid:props.studentInfo.s_username }, header)).data.data);

            setLoad(false);
            
        } catch(err) {
            props.history.push('/')
        }      
    }

    return(
        <Container fluid >

            <Dimmer active={load} inverted>
                <Loader inverted content='Loading' />
            </Dimmer>

            <Grid columns={3} divided>

                <Grid.Row>
                    <Grid.Column width={4}>
                        <Card fluid>
                            {/* <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} /> */}
                            <Card.Content>
                                <Card.Header>{props.studentInfo.s_ln}, {props.studentInfo.s_fn} {props.studentInfo.s_mn}</Card.Header>

                                <Card.Meta>
                                    <span className='date'>Enrolled: {props.studentInfo.ay_name} {props.studentInfo.sem_name}</span>
                                </Card.Meta>

                                <Card.Meta>
                                    <span className='date'>{props.studentInfo.s_yr} {props.studentInfo.s_sec} {props.studentInfo.s_crs === 'NONE'? '':props.studentInfo.s_crs} </span>
                                </Card.Meta>

                                <Card.Meta>
                                    <span className='date'>Username: {props.studentInfo.s_username}</span>
                                </Card.Meta>

                                <Card.Description>
                                </Card.Description>

                            </Card.Content>
                        </Card>
                    </Grid.Column>

                    <Grid.Column >
                        <Button onClick={onSaveIssue} color='green'>Issue</Button> 

                        <Message hidden={insertErr} negative>
                            <Message.Header>We're sorry, please select at least 1</Message.Header>
                            <p>You have no selected items</p>
                        </Message>

                        <Message hidden={insertOk} positive>
                            <Message.Header>Successfully Issued</Message.Header>
                            <p>Requirements saved</p>
                        </Message>
                        
                        <Table fixed compact>

                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Missing Requirement</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                            
                                { requirements.map((it, ix)=>{
                                    return(
                                        <Reqi key={it.id} data={it} onClick={onSelected}/>
                                    )
                                })}

                            </Table.Body>
                        </Table>
                    </Grid.Column>

                    <Grid.Column >                        
                        
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>Issued Records</Card.Header>
                            </Card.Content>  

                            { records.map((it,ix)=>{
                               return(
                                <IssuedRecordItem key={it.ci_id || ''}
                                    context={it.context || ''}
                                    issue_by={it.issue_by || ''}
                                    status_by={it.status_by || ''}
                                    ci_status={it.ci_status || ''}
                                    ci_id={it.ci_id}
                                    onRemarkClick={onRemarkClick}
                                />
                               )
                            })}

                        </Card>

                    </Grid.Column>

                </Grid.Row>

            </Grid>
        </Container>
    )
}


const IssuedRecordItem = (props) => {
    //enum('RESOLVED','PENDING','CONSIDERED')
    return(
        <Card.Content>                             
            <Card fluid>
                <Card.Content>
                    <h4 style={{padding:'0px',margin:'0px'}}>{ props.context || '' }</h4>
                    <Card.Meta>Issuer: {props.issue_by}</Card.Meta>
                    <Card.Meta>Remarker: {props.status_by}</Card.Meta>
                </Card.Content>

                <Card.Content extra>

                    <div className='ui three buttons'>
                        <Button onClick={props.onRemarkClick.bind(this,props.ci_id, 'RESOLVED')} 
                            active={props.ci_status === 'RESOLVED'? true:false}
                            inverted color='green'>
                            Pass
                        </Button>

                        <Button onClick={props.onRemarkClick.bind(this,props.ci_id, 'CONSIDERED')} 
                            active={props.ci_status === 'CONSIDERED'? true:false} 
                            inverted  color='blue'>
                            Accept
                        </Button>

                        <Button onClick={props.onRemarkClick.bind(this,props.ci_id, 'PENDING')} 
                             active={props.ci_status === 'PENDING'? true:false} 
                             inverted color='red'>
                             Fail
                        </Button>
                    </div>
                </Card.Content>
            </Card>                                
        </Card.Content>
    )
}

const Reqi = (props) => {
    const {data} = props;

    return(        
        <Table.Row   onClick={props.onClick.bind(this, `${data.id}`)} positive={ data.selected? true: false}>
            <Table.Cell>
                <Checkbox toggle checked={ data.selected? true: false}/> <span style={{marginLeft:'5px'}}>{data.context}</span> 
            </Table.Cell>
        </Table.Row>
    )

}

export default withRouter(ModalScrollingExample)