import React,{useState, useEffect} from 'react';
import { withRouter, BrowserRouter, Route, Switch, Link} from "react-router-dom";
import { Button, Menu, Input, Segment, Header, Modal, Image } from 'semantic-ui-react';
import axios from 'axios'
import baseURL from '../../../../../../res/baseuri';

// path : '/menu/dep/:dept/sub'


const RegisterSubject = (props)  => {
    const { match ,location, history } = props;
    const [submenu , setSubmenu] = useState('List')
    const [didMount, setDidMount] = useState(false);
    const [depDetails, setDepDetails] = useState(false);
    const [openModal, setOpenModel] = useState(false);

    useEffect(()=>{

        console.log('Match: ', match)
        console.log('Location: ', location)
        console.log('History: ', history)

        setDidMount(true);
        let xa = true;

        const x = async()=>{
            try{
                

                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                }

                // {id:match.params.dept}
                const result = await axios.post(`${baseURL}/api/department/getone`, { id:location.state.dept }, header);
                
                console.log(result.data.sqlResult[0])

                if(xa)
                {
                    // setDeptList(result.data.data);
                    setDepDetails(result.data.sqlResult[0]);
                }

            } catch(err) {
                history.push('/')
            }
            
        }
        x();

        return () => (xa=false)
    },[])

    if(!didMount) {
        return null
    }

    // SubMenu
    const Selection = () => {
        return(
            <React.Fragment>
                <div>
                    
                    <Menu attached='top' tabular>
                        <Menu.Item
                            name='List'
                            active={submenu === 'List'}
                        />
                        <Menu.Item
                            name='Sub'
                        />
                    </Menu>
        
                    <Segment attached='bottom'>

                    <div>
                        <Menu secondary>
                            
                            <Menu.Menu position='right'>
                                <Menu.Item>
                                    <Button secondary>
                                        Add Subject
                                    </Button>
                                </Menu.Item>
                                
                            </Menu.Menu>
                        </Menu>
                    </div>
               

                        <img src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
                    </Segment>
                </div>
          </React.Fragment>
        )
    }

    const ModalAddSubject = () => {
        return(
            <Modal >
            <Modal.Header>Select a Photo</Modal.Header>
            <Modal.Content image>
              <Image wrapped size='medium' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' />
              <Modal.Description>
                <Header>Default Profile Image</Header>
                <p>
                  We've found the following gravatar image associated with your e-mail
                  address.
                </p>
                <p>Is it okay to use this photo?</p>
              </Modal.Description>
            </Modal.Content>
          </Modal>
        )
    }

    return (
        <div>

            <div>
                <Header as='h2'>
                        {depDetails.d_name || ''}
                    <Header.Subheader>
                        Assign Subjects to teachers
                    </Header.Subheader>
                </Header>
            </div>
            <hr/>

            <Selection/>

            <ModalAddSubject/>
        </div>
    )
}

export default withRouter(RegisterSubject)
