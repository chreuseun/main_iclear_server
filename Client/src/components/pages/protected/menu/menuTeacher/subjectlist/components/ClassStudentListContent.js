import React, { useState, useEffect } from 'react'
import axios from 'axios';
import baseURL from '../.../../../../../../../../res/baseuri';
import { withRouter } from 'react-router-dom';
import { Modal, Button } from 'semantic-ui-react'


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
                
                {classList.map((it,ix)=>{
                    return(
                        <div>{it.username}</div>
                    )
                })}

            </Modal.Content>

            <Modal.Actions>
                <Button negative>No</Button>
                <Button positive>Yes</Button>
            </Modal.Actions>
        </React.Fragment>
        
    )
}

export default withRouter(ItemContent)