import React, {useState, useEffect} from 'react';
import {withRouter, Link} from 'react-router-dom';
import axios from 'axios'
import {  Grid, Segment, Button, Header } from 'semantic-ui-react';
import baseURL from '../../../../../../../res/baseuri';



// location.state.dept
const MyDepartments = (props) => {
    
    const {history, match, location} = props

    const [D, setD] = useState('');
    const [didMount, setDidMount] = useState(false);
    const [myDeptList, setMyDeptList] = useState([]);
    
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
                    setMyDeptList(result.data.sqlResult[0]);
                }

            } catch(err) {
                history.push('/')
            }
            
        }
        x();

        return () => (xa=false)
    },[])

    // to next page
    const pushTo = (path) => {
              
        var pushData = {
            pathname:`/menu/dep/${location.state.dept }/` + path,
            state:{ dept: location.state.dept }
        };

        console.log('SelectDepartment.js - '  ,pushData);

        // history.push(pushData)

        props.pushToLink(pushData);
    }

    const ButtonSubject = () => {
     
        
        if(myDeptList.is_subdep!=='reg'){
            return    null
        }

        return(
            
            <Grid.Column key={3}>
                            
                <Button  
                    onClick={()=>pushTo('sub')}
                    primary
                    size='huge' 
                    fluid>Subjects
                </Button>
                                                    
            </Grid.Column>   
        )
    }
        

    return(
        <React.Fragment>
            <Grid.Column textAlign='center' style={{maxWidth:'700px', margin:'auto'}}>
                    
                <Header as='h2' attached='top' textAlign='center'  style={{ margin:'auto'}}>
                        { myDeptList.d_name || ''}
                        {/* {JSON.stringify(myDeptList)} */}
                    
                </Header>

                <Segment attached>

                    <Grid stackable columns={1}> 
            
                        <Grid.Column key={1}>
                            
                            <Button  
                                onClick={()=>pushTo('clr')}
                                primary
                                size='huge' 
                                fluid>Clearance
                            </Button>
                                                                
                        </Grid.Column>   
                        
                        <Grid.Column key={2}>
                            
                            <Button  
                                onClick={()=>pushTo('req')}
                                primary
                                size='huge' 
                                fluid>Requirements
                            </Button>
                                                                
                        </Grid.Column>

                        <ButtonSubject/>


                    </Grid>
                    
                </Segment> 

            </Grid.Column> 
        </React.Fragment>
    )
    
}

export default withRouter(MyDepartments);

