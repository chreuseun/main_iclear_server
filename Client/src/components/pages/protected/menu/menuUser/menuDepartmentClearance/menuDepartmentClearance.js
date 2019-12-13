import React, { useEffect, useState } from 'react'
import { Table, Segment, Container,  Radio, Header, Button, Input,Loader, Dimmer, Modal} from 'semantic-ui-react'
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import baseURL from '../../../../../../res/baseuri';

// Component
import IssueClearanceModal from '../../../../protected/menu/menuUser/menuDepartmentClearance/IssueClearanceModal'


function ManageAcadYear(props) {

    const { match, location, history } = props

    const [didMount, setDidMount] = useState(false)
    const [deptList, setDeptList] = useState([]);
    const [context, setContext] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [ShowForm, setShowForm] = useState(false);
    const [depinfo, setDepInfo] = useState({});
    const [DepStd,setDepStd] = useState([]);

    useEffect( () => {
        console.log('UserDetails: ', location.state)
       
        setDidMount(true);
        let xa = true;
     
        const x = async()=>{
            try{

                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                }

                const detStd_ = (await axios.get(`${baseURL}/api/departments/${location.state.dept}/std`, header))

                console.log(detStd_.data.data)

                if(xa)
                {
                    setDepInfo(detStd_.data.data.dep);
                    setDepStd(detStd_.data.data.students)
                    setIsLoading(false)
                }
             
            } catch(err) {
                props.history.push('/')
            }
            
        }
        x();

        return () => (xa=false)
        
      }, []);

    if(!didMount) {
        return null
    }
  
    const ComponentdepStudentsList = DepStd.map((it, idx) => {
        
        return(
            <ModalClearancePane userDetails={props.userDetails} key={it.s_username} item={it}/>
        )
    })

    // ***************************************************************************
    const addBtnOnClick = () => {
            setShowForm(!ShowForm);
    }

    const saveReqOnClick = async() => {
        if(context.trim() !== ''){
            try{
                setIsLoading(true)
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                }

         
                const add = await axios.post(`${baseURL}/api/departments/req/add`,{d_id: location.state.dept, context},header);
                console.log(add.data.data)

                // final step
                const result = await axios.get(`${baseURL}/api/departments/${location.state.dept}/req/get`,header);
                setDeptList(result.data.data);

                setContext('')
                alert('Added')

                setIsLoading(false)
                
            } catch(err) {
                props.history.push('/')
            }
        } else {
            alert('Requiment field required..')
            setIsLoading(false)
        }

        
    }

    return(
        <Container>

            <Dimmer  active={isLoading} inverted>
                <Loader inverted content='Loading'/>
            </Dimmer>

            <Header textAlign='center'>Issue Clearance:{depinfo.d_name || ''}</Header>

            <Segment style={{ overflow: 'auto', maxHeight: '1000vh' }}>
           
                <Segment.Group horizontal>   

                <Table color='red' striped compact selectable>
                    <Table.Header>
                        <Table.Row>      
                            <Table.HeaderCell>Sys No.</Table.HeaderCell>                  
                            <Table.HeaderCell>UID</Table.HeaderCell>                        
                            <Table.HeaderCell>Student</Table.HeaderCell>
                            <Table.HeaderCell>Section</Table.HeaderCell>
                            <Table.HeaderCell>Course-Yr.</Table.HeaderCell>
                            <Table.HeaderCell>S.Y.-Sem</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {ComponentdepStudentsList}
                    </Table.Body>
                </Table>                 
             
                </Segment.Group>
            </Segment>
        </Container>  
    )
}


const ModalClearancePane = (props) => {
    return(
        <Modal trigger={StdRow(props.item)} size='fullscreen'>
            <Modal.Header>Issue Clearance</Modal.Header>

            <Modal.Content >
                <IssueClearanceModal userDetails={props.userDetails} studentInfo={props.item}/>
            </Modal.Content>

            <Modal.Actions>
            
            </Modal.Actions>
        </Modal>
    )
}

const StdRow = (item) => {
    return(
        <Table.Row key={item.s_username}  >
            <Table.Cell>{item.s_id}</Table.Cell>
            <Table.Cell>{item.s_username}</Table.Cell>
            <Table.Cell>{`${item.s_ln}, ${item.s_fn} ${item.s_mn}`}</Table.Cell>
            <Table.Cell>{item.s_sec}</Table.Cell>
            <Table.Cell>{`${item.s_crs} - ${item.s_yr}`}</Table.Cell>
            <Table.Cell>{`${item.ay_name} - ${item.sem_name}`}</Table.Cell>
        </Table.Row>
    )
}

export default withRouter(ManageAcadYear)