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

                const result = await axios.post(`${baseURL}/api/department/getone`, {id:match.params.dept}, header);
                console.log(result.data.sqlResult[0]   )
                if(xa)
                {
                    // setDeptList(result.data.data);
                    setMyDeptList(result.data.sqlResult[0]);
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
                            {''|| myDeptList.d_name}
                    </Header>

                    <Segment attached>
                        <Grid stackable columns={1}> 
                
                            <Grid.Column key={1}>
                                
                                <Button  
                                    as={Link}
                                    to={location.pathname + `/clr`}
                                    onClick={()=>{console.log('Cleerance')}}
                                     color='red' 
                                    size='huge' 
                                    fluid>Clearance
                                </Button>
                                                                    
                            </Grid.Column>   
                            
                            <Grid.Column key={2}>
                                
                                <Button  
                                    as={Link}
                                    to={location.pathname + `/req`}
                                    onClick={()=>{console.log('requirements')}}
                                     color='green'
                                    size='huge' 
                                    fluid>Requirements
                                </Button>
                                                                    
                            </Grid.Column>   
                        </Grid>
                    </Segment> 

                </Grid.Column> 
        </React.Fragment>
        
    )
    
}

export default withRouter(MyDepartments);

