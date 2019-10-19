import React, {useState, useEffect} from 'react';
import {withRouter, Link} from 'react-router-dom';
import axios from 'axios'
import {  Grid, Button } from 'semantic-ui-react';
import baseURL from '../../../../../../res/baseuri';

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
            <Grid stackable columns={2}>            
                <MyDepartmentsItem location={location} deptArray={myDeptList}/>
            </Grid>
        </React.Fragment>
        
    )
    
}

const MyDepartmentsItem = (props) => {

    return (
        <React.Fragment>
            {
                props.deptArray.map((it, ix)=>{
                    return(
                        <Grid.Column key={ix}>
                            
                            <Button  
                                as={Link}
                                to={props.location.pathname + `/${it.d_id}`}
                                onClick={()=>{console.log(it.d_id)}}
                                key={it.d_id} 
                                inverted 
                                color='blue'
                                size='massive'
                                fluid>{it.d_name}</Button>
                                                                
                        </Grid.Column>   

                        
                 )})
            }

        </React.Fragment>
    )
}

export default withRouter(MyDepartments);

