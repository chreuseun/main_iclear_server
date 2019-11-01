import React, {useState, useEffect} from 'react';
import {withRouter, Link} from 'react-router-dom';
import axios from 'axios'
import {  Grid, Button, Header, Message } from 'semantic-ui-react';
import baseURL from '../../../../../../res/baseuri';

const MyDepartments = (props) => {

    const { location, history } = props
 
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

    const MessageEmpty =  () => {
        return(
            <Message warning>
                <Message.Header>Sorry, no departments is assigned to you.</Message.Header>
                <p>0 Results found, Visit our Admin/IT for your eligibility of dept. assignment</p>
            </Message>
        )
    }

    const MyDepartmentList = () => {
        return(
            <Grid stackable columns={2}>            
                <MyDepartmentsItem location={location} deptArray={myDeptList}/>
            </Grid>
        )
    }

    return(
        <React.Fragment>


            <div>
                <Header as='h2'>
                    Manage Departments
                    <Header.Subheader>
                        Manage our Department Clearance records & requirements
                    </Header.Subheader>
                </Header>
                            
            </div>
            <hr></hr>

            {
                myDeptList.length > 0 ?
                    <MyDepartmentList/>  : <MessageEmpty/>
            }

            
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
                                primary
                                size='huge'
                                fluid>{it.d_name}</Button>
                                                                
                        </Grid.Column>          
                 )})
            }



        </React.Fragment>
    )
}






export default withRouter(MyDepartments);

