import React, {useState, useEffect} from 'react';
import {withRouter, Link} from 'react-router-dom';
import axios from 'axios'
import {  Grid, Button, Header, Image, Icon } from 'semantic-ui-react';
import baseURL from '../../../../../../res/baseuri';

const MyViolations = (props) => {

    const { location, history } = props
 
    const [didMount, setDidMount] = useState(false);
    const [myDeptList, setMyDeptList] = useState([]);

    useEffect(()=>{
        setDidMount(true);
        let xa = true;

        const x = async()=>{
            try{
                // const header = {
                //     headers: {
                //         authorization : localStorage.getItem('x')
                //     }
                // }

                // const result = await axios.get(`${baseURL}/api/departments/user`, header);
                
                // if(xa)
                // {
                //     // setDeptList(result.data.data);
                //     setMyDeptList(result.data.data);
                // }
                // console.log(result.data.data)
                
            } catch(err) {
                // history.push('/')
            }
        }

        x();

        return () => (xa=false)
    },[])

    return(
        <React.Fragment>

            <div>
                <Header as='h2'>
                    Manage Violation System
                    <Header.Subheader>
                        Manage our student violation records
                    </Header.Subheader>
                </Header>
                            
            </div>
            <hr></hr>
            <Grid stackable columns={2}>            
  
                <Grid.Column>
                    <Button>
                        Violation 1
                    </Button>
                </Grid.Column>

                <Grid.Column>
                    <Button>
                        Violation 2
                    </Button>
                </Grid.Column>

                <Grid.Column>
                    <Button>
                        Violation 3
                    </Button>
                </Grid.Column>

                <Grid.Column>
                    <Button>
                        Violation 4
                    </Button>
                </Grid.Column>

                {/* <MyDepartmentsItem location={location} deptArray={myDeptList}/> */}
            </Grid>
        </React.Fragment>
    )   
}



export default withRouter(MyViolations);

