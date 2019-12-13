import React, { useEffect, useState } from 'react';
import { Grid, Header} from 'semantic-ui-react';
import { withRouter,} from 'react-router-dom';
import baseURL from '../../../../../../res/baseuri';
import axios from 'axios';

// modalAddNewStudent
import ModalAddNewSubject from './components/ModalAddNewSubject';
import ClassStudent from './components/ClassStudentList';

const SubjectList = (props) => {

    
    const { match, location, history } = props

    const [didMount, setDidMount] = useState(false);
    const [subList, setSubList] = useState([]);

    useEffect(() => {

        setDidMount(true);
        let xa = true;

        const fetchData = async() => {

            try{
            
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                };

                const result = await axios.get(`${baseURL}/api/class/${props.userDetails.id || ''}`,header);

                if(xa){
                    setSubList(result.data.data)
                }

            } catch(err) {
                // localStorage.removeItem('x')
                console.log(err)
                history.push('/')
            }
        }

        fetchData();

        return () => (xa=false)

    },[]);
    
    if(!didMount){
        return null;
    }

    const refreshSubjectList = () => {
        console.log('Run refresh function')


        const fetchData = async() => {

            try{
            
                const header = {
                    headers: {
                        authorization : localStorage.getItem('x')
                    }
                };

                const result = await axios.get(`${baseURL}/api/class/${props.userDetails.id || ''}`,header);

                setSubList(result.data.data)            

            } catch(err) {
                // localStorage.removeItem('x')
                console.log(err)
                history.push('/')
            }
        }

        fetchData();

    }

    return(
        <React.Fragment>
            
            <Grid padded>

                <Grid.Row >
                    <Grid.Column>        

                        <Header textAlign='center' size='huge' >
                            My Class 
                            <Header.Subheader>
                            Manage your class clearance and set section preferences
                            </Header.Subheader>
                        </Header>

                        {<ModalAddNewSubject refreshSubjectlist={refreshSubjectList} userDetails={props.userDetails}/> || <div>NoList </div>}
                    </Grid.Column>
                </Grid.Row>
            
                {
                    subList.map((it, ix) => {

                        const {id, name, ay_name, sem_name, el_name, yearlevel, course, section} = it || {}

                        return(                        
                            <ClassStudent key={id} userDetails={props.userDetails} it={it}/>
                        )
                    })
                }

            </Grid>

        </React.Fragment>
    )

}

export default withRouter(SubjectList)

