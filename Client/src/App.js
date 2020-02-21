import React, {useEffect} from 'react';
import {  Route, Switch, Redirect } from 'react-router-dom'
import { Menu as men  } from 'semantic-ui-react';


// < -COMPONENTS- >
import Login from '../src/components/pages/login/login'
import MenuPage from '../src/components/pages/protected/menu/menu'
// import Test from '../src/components/reuse/test_ly'
// import LauncherScanner from './components/pages/protected/menu/menuUser/menuActivityCard/components/SelectedActDept/components/Events/components/LaunchScanner/LaunchScanner';

// NAVBAR ADMIN
import NavbarAdmin from './components/reuse/navbar/mainmenu/NavbarAdmin';


// USER departments
import DepartmentSelection from './components/pages/protected/menu/menuUser/menuRefactorUser/DepartmentSelection';
import SelectedDepartment from './components/pages/protected/menu/menuUser/menuRefactorUser/SelectedDepartments';
import ManageDepRequirements from './components/pages/protected/menu/menuUser/menuRefactorUser/ManageDeptRequirements';
import RefMenuDepartmentClearance from './components/pages/protected/menu/menuUser/menuRefactorUser/RefMenuDepartmentClearance';
import RefRegisterSubject from './components/pages/protected/menu/menuUser/menuRefactorSubject/RefRegisterSubject';

// USER violation 
import RefMainViolation from './components/pages/protected/menu/menuUser/menuRefactorViolation/RefMainViolation';
import RefSelectedVioDept from './components/pages/protected/menu/menuUser/menuRefactorViolation/RefSelectedVioDept';
import RefVioDeptSettings from './components/pages/protected/menu/menuUser/menuRefactorViolation/RefVioDepSettings';

// USER activity
import RefMainActCard from './components/pages/protected/menu/menuUser/menuRefactorActivity/RefMainActCard';
import RefSelectedActDept from './components/pages/protected/menu/menuUser/menuRefactorActivity/RefSelectedActDept'
import Scanner from './components/pages/protected/menu/menuUser/menuActivityCard/components/SelectedActDept/components/Events/components/LaunchScanner/LaunchScanner';

// Class
// import RefSubjectList from './components/pages/protected/menu/menuTeacher/RefactorSubject/RefSubjectList'

// Class (Overhaul)
import NewSelectedSubject from './components/pages/protected/menu/menuTeacher/NewSubject/SelectedSubject.js/SelectedSubject';

const  App = (props) => {

  useEffect(()=>{
    console.log('App.js - useEffect')
  },[])
  
  LocalDataCheck();

  // redirect to Login Screen
  const RedirectToLogin = () => {
    return(
      <Redirect
        to={{
          pathname: "/"
        }}
      />
    )
  }

  return (
    
      <div className="App">
        <Switch>
          
          <Route path="/" exact render={ (props) => <Login {...props}/> }/>
          <Route path="/menu" exact render={ (props) => <MenuPage/> }/>

          {/* ADMIN */}
          <Route path={'/menu/newuser'} exact render={ (props) => <NavbarAdmin {...props} /> } />
          <Route path={'/menu/configaccount'} exact render={ (props) => <NavbarAdmin {...props}/> } />

          <Route path={'/menu/newdepartment'} exact render={ (props) => <NavbarAdmin {...props}/> } />
          <Route path={'/menu/configdepartment'} exact render={ (props) => <NavbarAdmin {...props}/> } />

          <Route path={'/menu/config_semester'} exact render={ (props) => <NavbarAdmin {...props}/> } />
          <Route path={'/menu/config_acad_year'} exact render={ (props) => <NavbarAdmin {...props}/> } />

          <Route path={'/menu/uploadstudent'} exact render={ (props) => <NavbarAdmin {...props}/> } />
          <Route path={'/menu/students'} exact render={ (props) => <NavbarAdmin {...props}/> } />
          {/* ADMIN */}

          {/* USER */}
          <Route exact path={'/menu/dep' }              render={(props) => <DepartmentSelection  {...props}/>} />

          {/* DEPARTMENTS */}
          <Route exact path={'/menu/dep/:dept'}         render={(props) => <SelectedDepartment {...props}/>} /> 
          <Route exact path={'/menu/dep/:dept/req'}     render={(props) => <ManageDepRequirements {...props}/>} /> 
          <Route exact path={'/menu/dep/:dept/clr'}     render={(props) => <RefMenuDepartmentClearance {...props} />} /> 
          <Route exact path={'/menu/dep/:dept/sub'}     render={(props) => <RefRegisterSubject {...props} text={'subject'}/>} />
          {/* DEPARTMENTS */}

          {/* VIOLATION SYSTEM */}
          <Route  exact path={ '/menu/viol'} render={(props) => <RefMainViolation {...props}/>}/>
          <Route  exact path={'/menu/viol/:dept'} render={(props) => <RefSelectedVioDept {...props}/>}/ >  
          <Route  exact path={'/menu/viol/:dept/settings'} render={(props) => <RefVioDeptSettings {...props}/>}/>  
          {/* VIOLATION SYSTEM */}

          {/* ACTIVITY */}
          <Route  exact path={'/menu/act'}       render={(props) => <RefMainActCard {...props}/> }/>
          <Route  exact path={'/menu/act/:dept'} render={(props) => <RefSelectedActDept {...props}/> }/>

          {/* <Route  exact path={'/menu/act/:dept/scan'}  render={(props) => <NavbarUser {...props}/>} /> */}
          {/* ACTIVITY */}

          {/* SUBJECT TEACHER */}
          <Route  exact path={'/menu/subject/:subject_id'}  render={(props) => <NewSelectedSubject {...props} text={'/menu/subject/:subject_id'}/>} />

          <Route exact path={'/scanner'} render={(props) => <Scanner {...props} />}  />
          {/* USER */}
          <Route exact path={'/test'} render={()=><SamplePage/>} />
          <Route exact path={'/test/scan'} render={()=><SamplePage/>} />
          <Route path='*' exact={true} render={ (props) => <RedirectToLogin {...props}/> }/>

        </Switch>
      </div>  

  );
}

const LocalDataCheck = () => {
  console.log('Token: ' ,localStorage.getItem('x'))
}

const SamplePage = (props) => {
  return(
    <div>
      {props.text}
    </div>
  )
}

export default App;

  