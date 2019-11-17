import React, {useState, useEffect} from 'react';
import {withRouter, Link} from 'react-router-dom';
import axios from 'axios'
import {  Grid, Button, Header, Message } from 'semantic-ui-react';
import baseURL from '../../../../../../res/baseuri';

const MyActivityCard = (props) => {

    const { location, history } = props
 
    const [didMount, setDidMount] = useState(false);
    const [myDeptList, setMyDeptList] = useState([]);

    useEffect(()=>{
        setDidMount(true);
        let updateHook = true;

        const fetchApi = async()=>{
            try{
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                }

                const resultActivity = await axios.get(`${baseURL}/api/activity/user`, header);
                
                if(updateHook)
                {
                    // setDeptList(result.data.data);
                    setMyDeptList(resultActivity.data.data);
                }
                console.log( `Activity Card:` ,resultActivity.data.data)
                
            } catch(err) {
                // history.push('/')
            }
        }

        fetchApi();

        return () => (updateHook = false)
    },[])

    const GridMyActList = () => {
        
        return( 
        <Grid stackable columns={2}>     

            <MyVioDeptItem {...props} location={location} deptArray={myDeptList}/>    

        </Grid>)
    }

    return(
        <React.Fragment>

            <div>
                <Header as='h2'>
                    Manage Activity Event Attendance System
                    <Header.Subheader>
                        Manage our student violation records
                    </Header.Subheader>
                </Header>
                            
            </div>
            <hr></hr>            
  
              {
                myDeptList && myDeptList.length > 0 ?
                <GridMyActList/> :
                <MessageEmpty/>
            }

                {/* <MyDepartmentsItem location={location} deptArray={myDeptList}/> */}
  
        </React.Fragment>
    )   
}


const MyVioDeptItem = (props) => {

    return (
        <React.Fragment>
            {
                props.deptArray.map((it, ix)=>{
                    return(
                        <Grid.Column key={ix}>
                            
                            <Button  
                                as={Link}
                                to={props.location.pathname + `/${it.d_id}`}
                                onClick={()=>{console.log(it.d_name, ' link: ', props.location.pathname + `/${it.d_id}`)}}
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

const MessageEmpty =  () => {
    return(
        <Message warning>
            <Message.Header>Sorry, no departments is assigned to you.</Message.Header>
            <p>0 Results found, Visit our Admin/IT for your eligibility of dept. assignment</p>
        </Message>
    )
}

export default withRouter(MyActivityCard);