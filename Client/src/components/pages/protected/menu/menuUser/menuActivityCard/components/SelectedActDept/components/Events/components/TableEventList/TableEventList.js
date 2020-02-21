import React, { useEffect, useState } from 'react';
import { Grid, Header, Button, Table, Menu, Message, Segment, Modal, Form, Loader, Dimmer } from 'semantic-ui-react';
import { withRouter, Link} from 'react-router-dom';
import baseURL from '../../../../../../../../../../../../res/baseuri';
import axios from 'axios';

const TableEventList = (props) => {
    
    const {location, match, history } = props;
    const [load, setLoad] = useState(false);

    useEffect(()=>{ 
        

        const fetchData = async() => {
            try{
            
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                };
                
                // /activity/user
                console.log()

                const fetchElDept = await axios.get(`${baseURL}/api/activity/${location.state.dept}/events`, header);

                console.log( `all Events: ` , fetchElDept.data.data)



            } catch(err) {
                // localStorage.removeItem('x')
                console.log(err)
                history.push('/')
            }
        }

        fetchData();

    }, [])

    return(
        <React.Fragment>

            <Table compact='very' selectable>
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Datails</Table.HeaderCell>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>S.Y.</Table.HeaderCell>
                    <Table.HeaderCell>Sem</Table.HeaderCell>
                    <Table.HeaderCell>Dept.</Table.HeaderCell>                    
                    <Table.HeaderCell>Creator</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
{/*                     

                    <Table.HeaderCell>JSON</Table.HeaderCell> */}

                </Table.Row>
                </Table.Header>
            
                <Table.Body>


                    {props.eventList.map((it, ix)=>{
                        
                        return(
                            <Table.Row key={it.id} >
                                <Table.Cell>{it.name}</Table.Cell>
                                <Table.Cell>{it.evt_name}</Table.Cell>
                                <Table.Cell>{it.ay_name}</Table.Cell>
                                <Table.Cell>{it.sem_name}</Table.Cell>
                                <Table.Cell>{it.student_department}</Table.Cell>  
                                <Table.Cell>{it.lastname}, {it.firstname} {it.middlename}</Table.Cell>    

                                <Table.Cell >
                                    <Button primary>
                                        Edit
                                    </Button>
                                </Table.Cell>

                                <Table.Cell>
                                    <Button onClick={()=>{props.openNewLink(it.id)}}>
                                        Scan
                                    </Button>
                                </Table.Cell>

                            </Table.Row>
                        )
                    })}

                                
                </Table.Body>
            </Table>

        </React.Fragment>
      )
}

export default withRouter(TableEventList);
