// Subject Teacher Landing Page

import React, { useEffect, useState } from 'react';
import { withRouter, BrowserRouter, Link, useHistory} from "react-router-dom";
import { Menu,  Container, Dropdown, Button, Header, Table } from 'semantic-ui-react';
import Axios from 'axios';
import baseuri from '../../../../res/baseuri';

const NavbarUser = (props) => {
    
    const { match, location, history } = props
    const [isLoading, setIsLoading] = useState(true);
    const [didMount ,setDidMount] = useState(false); 
    

    useEffect(()=>{
        setDidMount(true);
    },[]) 

    if(!didMount) {
        return null
    }

    const PushToTestLink = (pushData) => {
        history.push(pushData)
    }

    return(
        <React.Fragment>

            <BrowserRouter>

                <Menu color='blue' style={{}} stackable inverted  fixed='top'>
                    <Container>

                        <Link to="/menu">
                            <Menu.Item>
                                HOME 
                            </Menu.Item>
                        </Link>

                        <Menu.Menu position='right'>                            
                            <Dropdown item text={'Welcome, ' + props.userDetails.username}>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={()=>{localStorage.clear();history.push('/')}} >Sign-Out</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Menu>
                    </Container>  
                </Menu>

                <Container style={{marginTop:"100px",background:'#F8F8F8',padding:'20px'}}>

                    <SubjectTeacher PushToTestLink={PushToTestLink}/>

                </Container>

            </BrowserRouter>

        </React.Fragment>
    );
}

const SubjectTeacher = (props) => {


    return(
        <React.Fragment>

            <PageHeader/>

            <hr/>
            <br/>

            <TableSubjectList PushToTestLink={props.PushToTestLink} />

        </React.Fragment>
    )
}

const PageHeader = (props) => {

    return(
        <Header as='h2'>

            My Subject

            <Header.Subheader>
                Manage students subject clearance
            </Header.Subheader>
        </Header>
    )
}

const TableSubjectList = (props) => {

    const history = useHistory();

    const [ assignedSubject, setAssigneSubject ] = useState([]);

    const effect = async(updateHook) => {

        try{

            const header = {
                headers: {
                    authorization : localStorage.getItem('x')
                }
            }

            let fetchAssignedSubject =  await Axios.get(`${baseuri}/api/subjclass/teacher/subject`, header);

            console.log('fetchedData : ' , fetchAssignedSubject.data.data);

            if(updateHook){
                setAssigneSubject(fetchAssignedSubject.data.data);
            }

        }catch(err){
            history.push('/')
        }

    }

    useEffect(() => {
        let updateHook = true;

        effect(updateHook);

        return () => {
            updateHook = false;
        };
    }, [])



    const TableBody = () => {
        return(
            <React.Fragment>
                {
                    assignedSubject.map((itm, idx) => {
                        return(
                            <Table.Row 
                                key={itm.id}
                                onClick={()=> props.PushToTestLink({pathname: `/menu/subject/${itm.id}`}) }
                            >

                                <Table.Cell>{itm.subdet_name}{`(${itm.subdet_code})`}</Table.Cell>
                                <Table.Cell>{itm.yearlevel}{'-'}{itm.course}</Table.Cell>
                                <Table.Cell>{itm.section}</Table.Cell>
                                <Table.Cell>{itm.ay_name}{'-'}{itm.sem_name}</Table.Cell>
                                <Table.Cell>{itm.el_name}</Table.Cell>

                            </Table.Row>
                        )
                    })
                }
            </React.Fragment>
        )
    }

    return(
        <React.Fragment>

            <Header size='medium'>Assign Subject Class</Header>

            <Table singleLine>

                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Name(code)</Table.HeaderCell>
                        <Table.HeaderCell>Yr.</Table.HeaderCell>
                        <Table.HeaderCell>Section</Table.HeaderCell>
                        <Table.HeaderCell>Academic Year</Table.HeaderCell>
                        <Table.HeaderCell>Level</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    <TableBody/>
                </Table.Body>

            </Table>

      </React.Fragment>
    )
}

export default withRouter(NavbarUser);