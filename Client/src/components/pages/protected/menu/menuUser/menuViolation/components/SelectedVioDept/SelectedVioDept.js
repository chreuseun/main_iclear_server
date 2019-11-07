import React, { useEffect, useState } from 'react';
import { Grid, Header, Button, Table, Menu, Message, Segment } from 'semantic-ui-react';
import { withRouter, Link} from 'react-router-dom';
import baseURL from '../../../../../../../../res/baseuri';
import axios from 'axios';

// modalAddNewStudent


const SelectedVioDept = (props) => {

    
    const { location ,match, history } = props

    const [didMount, setDidMount] = useState(false);
    const [vioDeptTitle, setVioDeptTitle] = useState({});
    const [studentList, setStudentList] = useState([]);

    useEffect(() => {

        setDidMount(true);
        let UpdateHook = true;

        const fetchData = async() => {
            try{
            
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                };
                //api/violation/user/117
                const result = await axios.get(`${baseURL}/api/violation/user/${match.params.dept}`,header);
                const violationDept = await axios.post(`${baseURL}/api/department/getone`, {id:match.params.dept||''},header)

                if(UpdateHook){
                    setVioDeptTitle(violationDept.data.sqlResult[0] || {})
                    setStudentList(result.data.data || [])
                }

            } catch(err) {
                // localStorage.removeItem('x')
                console.log(err)
                history.push('/')
            }
        }

        fetchData();

        return () => (UpdateHook=false)

    },[])
    
    if(!didMount){
        return null;
    }

    const StudentList = () => {
        return(
            <React.Fragment>
                {studentList.map((it, ix)=>{
                    return(
                        <Table.Row key={it.s_username}>
                            
                            <Table.Cell>{it.s_username}</Table.Cell>
                            <Table.Cell>{`${it.s_ln}, ${it.s_fn} ${it.s_mn}`}</Table.Cell>
                            <Table.Cell>{it.s_yr}</Table.Cell>
                            <Table.Cell>{it.s_sec}</Table.Cell>
                            <Table.Cell>{it.s_crs}</Table.Cell>
                            <Table.Cell>{it.s_dept}</Table.Cell>
                            <Table.Cell>{it.ay_name}</Table.Cell>
                            <Table.Cell>{it.sem_name}</Table.Cell>
                            
                            {/* <Table.Cell>{JSON.stringify(it)}</Table.Cell> */}
                        </Table.Row>
                    )
                })}
            </React.Fragment>
        )
    }

    return(
        <React.Fragment>
            <div>
                <Header as='h2'>
                    { vioDeptTitle.d_name || '' } {'-'} { vioDeptTitle.el_name || '' }
                    <Header.Subheader>
                        Manage our student violation records and dept. settings
                    </Header.Subheader>
                </Header>
                            
            </div>

            <hr></hr>

            <br/>

            <div>
                <Menu secondary>
                    <Menu.Menu position='right'>
                        <Menu.Item>
                            <Button animated='fade'
                                as={Link}
                                to={props.location.pathname + `/settings`}
                            >
                                <Button.Content visible>{'Settings'}</Button.Content>
                                <Button.Content hidden> {'Settings'}</Button.Content>
                            </Button>
                        </Menu.Item>
                        
                    </Menu.Menu>
                </Menu>
            </div>

            <br/>

            <Grid >

                <Grid.Row  >
                    <Grid.Column>        
                        <Segment style={{ overflow: 'auto', maxHeight: '1000vh' }}>
                            <Segment.Group horizontal>
                                
                                <Table compact>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>UID</Table.HeaderCell>
                                            <Table.HeaderCell>Name</Table.HeaderCell>
                                            <Table.HeaderCell>Yr.</Table.HeaderCell>
                                            <Table.HeaderCell>Section</Table.HeaderCell>
                                            <Table.HeaderCell>Course</Table.HeaderCell>
                                            <Table.HeaderCell>Department</Table.HeaderCell>
                                            <Table.HeaderCell>S.Y.</Table.HeaderCell>
                                            <Table.HeaderCell>Semester</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>

                                    <Table.Body>
                                        {<StudentList/>}
                                    </Table.Body>
                                </Table>

                            </Segment.Group>
                        </Segment>
                                
                         

                    </Grid.Column>
                </Grid.Row>

            </Grid>

        </React.Fragment>
    )
}


const MessageEmpty =  () => {
    return(
        <Message warning>
            <Message.Header>Sorry, no departments is assigned to you.</Message.Header>
            <p>0 Results found, Visit our Admin/IT for your eligibility of dept. assignment</p>
        </Message>
    )
}

export default withRouter(SelectedVioDept)

