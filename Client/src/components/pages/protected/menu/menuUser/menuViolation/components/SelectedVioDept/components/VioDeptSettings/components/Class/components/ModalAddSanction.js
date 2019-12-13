import React, { useState } from 'react';
import { Button, Modal, Form } from 'semantic-ui-react';
import { withRouter,} from 'react-router-dom';
import axios from 'axios';
import baseURL from '../../../../../../../../../../../../../res/baseuri';

const ModalAddSanction = (props) => {
    
    const {match, location, history} = props;
    const [desc, setDesc] = useState(''); //description
    const [open, setOpen] = useState(false);

    const onSaveClick = () => {

        const fetchData = async() => {
            try{
            
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                };
                
                const violationDept = await axios.post(`${baseURL}/api/violation/user/${location.state.dept}/class/${props.rowData.id}/sanction/add`, {desc}, header)
             
                console.log(violationDept.data.data  || '')
               
                if(violationDept.data.data.insertId){
                    alert('Sanction Added')
                    props.onClose();
                    setOpen(false)
                }else {
                    alert('Adding failed')
                }

            } catch(err) {
                console.log(err)
                history.push('/')
            }
        }

        if( 
            (desc !== '' && desc) && 
            (props.rowData.id !== '' && props.rowData.id) && 
            (location.state.dept !== '' && location.state.dept)
        ){
            fetchData();
        } else{
            alert('all fields required...')
        }
        
    }

    const closing = () => {
        console.log('closing')
        setDesc('')
        setOpen(false)
        
    }

    const opening = () => {
        console.log('opening')
        setDesc('')
        setOpen(true)
    }

    return(
        <Modal

        open={open}
        onClose={closing}
        onOpen={opening}
        size='large'
        trigger={
          <Button primary icon>Add New Sanction</Button>
        }
      >
        <Modal.Header>Add New Sanction:  {props.rowData.id}</Modal.Header>
        <Modal.Content>

            <Form>
                <Form.TextArea label='Description' placeholder='Description of sanction...' onChange={(e)=>{setDesc(e.target.value)}} value={desc} />
            </Form>

        </Modal.Content>
        <Modal.Actions>
          <Button secondary  content='Save' onClick={onSaveClick}/>
        </Modal.Actions>
      </Modal>
    )
}

export default withRouter(ModalAddSanction)