import React, {useState, useEffect} from 'react';
import {withRouter, Link} from 'react-router-dom';
import axios from 'axios'
import {  Grid, Segment, Button, Header } from 'semantic-ui-react';
import baseURL from '../../../../../../../res/baseuri';

const MyDepartments = (props) => {

    const { match, location, history } = props
    const [D, setD] = useState('');
    const [didMount, setDidMount] = useState(false);
    const [myDeptList, setMyDeptList] = useState([]);

    useEffect(()=>{
        setDidMount(true);
        let xa = true;
     
        const x = async()=>{
            try{

                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                }

                const result = await axios.get(`${baseURL}/api/departments/user`, header);
                
                if(xa)
                {
                    // setDeptList(result.data.data);
                    setMyDeptList(result.data.data);
                }
                console.log(result.data.data)
                
            } catch(err) {
                history.push('/')
            }
            
        }
        x();

        return () => (xa=false)
    },[])

    return(
        <React.Fragment>
            <Grid.Column textAlign='center' style={{maxWidth:'700px', margin:'auto'}}>
                    <Header as='h2' attached='top' textAlign='center'  style={{ margin:'auto'}}>
                            {'Registrar - College'}
                    </Header>

                    <Segment attached>
                        <Grid stackable columns={1}> 
                
                            <Grid.Column key={1}>
                                
                                <Button  onClick={()=>{console.log('issue')}}  inverted color='red'  size='massive' fluid>Clearance</Button>
                                                                    
                            </Grid.Column>   
                            
                            <Grid.Column key={2}>
                                
                                <Button  onClick={()=>{console.log('requirements')}}  inverted color='green'  size='massive' fluid>Requirements</Button>
                                                                    
                            </Grid.Column>   
                        </Grid>
                    </Segment>             
                </Grid.Column> 

            
        </React.Fragment>
        
    )
    
}



export default withRouter(MyDepartments);

