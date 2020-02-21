import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Menu, Modal } from 'semantic-ui-react';
import { withRouter, Link} from 'react-router-dom';
import baseURL from '../../../../../../../../../../../../../res/baseuri';
import axios from 'axios';

const FormInsertViolation = (props) => {
    const { location ,match, history } = props
  
    const [didMount, setDidMount] = useState(false);
    const [open, setOpen] = useState(true);
  
    useEffect(() => {

        setDidMount(true);
        let UpdateHook = true;

        return () => (UpdateHook=false)

    },[])
    
    if(!didMount){
        return null;
    }

    return(
    <React.Fragment>
        <Modal open={true} size='fullscreen' >
            <Modal.Header>Insert New Violation 
                <Button floated={"right"} onClick={()=>{props.onClose()}} negative>Close</Button>
            </Modal.Header>
            <Modal.Content>

                <FormInsert {...props}/>

            </Modal.Content>        
        </Modal>
    </React.Fragment>
    
    )
}


const FormInsert = (props) => {

    const { location ,match, history } = props
    const [didMount, setDidMount] = useState(false);
    const [name, setName] = useState('');

    const [cls, setCls] = useState('');
    const [desc, setDesc] = useState('');
    const [classList, setClassList] = useState([]);

    useEffect(() => {

        console.log(location);
        console.log(match);
        console.log(history)

        setDidMount(true);
        let UpdateHook = true;

        const fetchData = async() => {
            try{
            
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                };
                
                const violationDept = await axios.get(`${baseURL}/api/violation/user/${location.state.dept}/class`, header)

                if(UpdateHook){

                    let optionVioDept = violationDept.data.data.map((it, ix) => {
                        return(
                            {
                                text : it.name,
                                key : it.id,
                                value : it.id
                            }
                        )
                    })
                    
                    setClassList( optionVioDept || [] )
                }

            } catch(err) {
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

    const onSaveVioClick = (e) => {
        e.preventDefault()
        
        console.log(
            name,
            cls,
            desc
            
        )

        const addViolation = async() => {
            try{
            
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                };

                let body = {
                    name,
                    desc,
                    cls
                }
                
                const addResponse = await axios.post(`${baseURL}/api/violation/user/${location.state.dept}/violations/add`, body, header)

                console.log(addResponse.data.data)

                if(addResponse.data.data) {
                    alert('New Violation added...')
                    // run a  close modal function 
                    setCls(''); setDesc(''); setName('');
                    props.onClose()
                }

            } catch(err) {
                console.log(err)
                history.push('/')
            }
        }

        if(
            name !== '' &&
            cls !== '' &&
            desc !== ''
        ) {
            addViolation();
        } else {
            alert('All fields required...')
            console.log('No data')
        }

        
    }

    const onChangeClass = (e,{value}) => {
        setCls(`${value}`)
    }


    return(
        <Form>  

            <Form.Input fluid label='Violation Name' placeholder='Violation Name'
                style={{maxWidth:'300px'}}
                value={name}
                onChange={(e)=>{
                    const { value } = e.target;
                    setName(value);
                }

                    }
                maxLength={45}
            />

            <Form.Select
                fluid
                label='Class'
                placeholder='Class'
                options={
                    classList
                }
                style={{maxWidth:'300px'}}
                onChange={onChangeClass}

                search
                selection
            />

            <Form.TextArea label='Description' placeholder='Tell us more about the violation...'
                value={desc}
                onChange={(e)=>{setDesc(e.target.value)}} 
                maxLength={255}
            />

            <div>
                <Menu secondary>
                    <Menu.Menu position='right'>
                        <Menu.Item>
                            <Button animated='fade' secondary onClick={onSaveVioClick}>
                                <Button.Content visible>{'Save Changes'}</Button.Content>
                                <Button.Content hidden> {'Save Changes'}</Button.Content>
                            </Button>
                        </Menu.Item>
                        
                    </Menu.Menu>
                </Menu>
            </div>
    </Form>
    )
}

export default withRouter(FormInsertViolation)