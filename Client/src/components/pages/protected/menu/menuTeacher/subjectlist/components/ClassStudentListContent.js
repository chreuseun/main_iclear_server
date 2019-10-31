import React, { useState, useEffect } from 'react'
import axios from 'axios';
import baseURL from '../.../../../../../../../../res/baseuri';
import { withRouter } from 'react-router-dom';
import { Modal, Button, Table, Tab } from 'semantic-ui-react'


const ItemContent = (props) => {


    const { match, location, history } = props

    const [didMount, setDidMount] = useState(false);

    const [classList, setClassList] = useState([]);

    console.log('StudentList'  ,classList);

    useEffect(() => {

        setDidMount(true);
        let xa = true;

       

        const fetchData = async() => {

            try{
            
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                };

                const result = await axios.get(`${baseURL}/api/class/student/${props.class_id}`,header);

                if(xa){
                    setClassList(result.data.data)
                }

            } catch(err) {
                // localStorage.removeItem('x')
                console.log(err)
                history.push('/')
            }
        }

        fetchData();

        return () => (xa=false)

    }, []);

    if(!didMount){
        return null;
    }

    return(
        <React.Fragment>
            <Modal.Header> Student list</Modal.Header>

            <Modal.Content>

                <Table compact>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Status</Table.HeaderCell>
                            <Table.HeaderCell>Notes</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    
                    <Table.Body>
                        {classList.map((it,ix)=>{
                            return(

                                <Table.Row key={it.id}>
                                    <Table.Cell>{JSON.stringify(it)}</Table.Cell>
                                    <Table.Cell>Approved</Table.Cell>
                                    <Table.Cell>Requires call</Table.Cell>
                                </Table.Row>
                                
                            )
                        })}
                    </Table.Body>


                </Table>

            </Modal.Content>

            <Modal.Actions>
                <Button negative>No</Button>
                <Button positive>Yes</Button>
            </Modal.Actions>
        </React.Fragment>
        
    )
}

export default withRouter(ItemContent)