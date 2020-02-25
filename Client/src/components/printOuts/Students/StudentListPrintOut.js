import React from 'react';
import {Table} from 'semantic-ui-react';
import logo from './../../../res/assets/dyci.jpg';


// for EXPORT  
class PrintOutTemplate extends React.Component {

  render () {
      const {data=[], title=''}= this.props 

      return (
          <>
              <PrintOut data={data} title={title}/>
          </>
      )
  }
}

const PrintOut = ({data=[], title}) => {
  
  var today  = new Date().toLocaleDateString("en-US")

  return(
          <div style={{margin:'auto', fontFamily:'arial'}}>
              {/* SCHOOL NAME */}
              <div style={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
                      
                  <div style={{display:'flex', flexDirection:'row',alignItems:'center',textAlign:'center',}}>
                      <img src={logo} alt={'logo'}style={{width:50, height:50}}/>

                      <div style={{marginLeft: 10}}>
                          <span style={{textAlign:'center', fontWeight:'bold',fontSize:'24sp'}}>Dr.Yanga's Colleges Incorporated</span>
                          <br/>
                          <small>Wakas, Bocaue, Bulacan #3016</small>
                      </div>
                  </div>
              </div>
              
             

              <h4 style={{textAlign:'center'}}>
                  {title}
              </h4>


              <span>
                  Printed at: <strong>{today}</strong>
              </span>

              <hr/>
              {/* Table */}
              <div style={{borderColor:'#272727', borderWidth:1/3}}>
                  <Table >
                      <Table.Header>
                      <Table.Row>
                          <Table.HeaderCell>Username</Table.HeaderCell>
                          <Table.HeaderCell>Name</Table.HeaderCell>
                          <Table.HeaderCell>Course</Table.HeaderCell>
                          <Table.HeaderCell>Section</Table.HeaderCell>
                          <Table.HeaderCell>Yearlevel</Table.HeaderCell>
                          <Table.HeaderCell>SchoolYear</Table.HeaderCell>
                      </Table.Row>
                      </Table.Header>

                      <Table.Body>


                          {data.map((it,ix)=>{
                              return(
                                  <Table.Row>
                                      <Table.Cell>{it.username}</Table.Cell>
                                      <Table.Cell>{`${it.studlname}, ${it.studfname}, ${it.studmname}`}</Table.Cell>
                                      <Table.Cell>{it.course}</Table.Cell>
                                      <Table.Cell>{it.section}</Table.Cell>
                                      <Table.Cell>{it.yearlevel}</Table.Cell>
                                      <Table.Cell>{`${it.sem_name} | ${it.ay_name}`}</Table.Cell>
                                  </Table.Row>
                              )
                          })}
                      
                      </Table.Body>
                  </Table>
              </div>
          </div>

    

  )
}

export default PrintOutTemplate;