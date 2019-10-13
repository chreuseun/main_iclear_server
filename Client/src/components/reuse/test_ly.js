import React, { useState } from 'react'
import csv from 'csvtojson';
import {  Container, Button } from 'semantic-ui-react'

const Test = (props) => {

  const [Fpath, setFpath] =  useState('');
  const [CsvArr, setCsvArr] =  useState([]);

  const parseCSV = async(e) => {
      e.preventDefault()

      // console.log(e.target.files[0])

      var reader = new FileReader();



      function a() {
        return(
          new Promise((res, rej)=>{
            
            reader.readAsText(e.target.files[0])

            reader.onload = function(e) {
              if(reader.result){
                res(reader.result)
              } else {
                rej('');
              }
            }

          })
        )
      }

      let data = await a()

      let output = await csv({noheader:true, output: "json " }).fromString(data);
      
      let selected_educLevel =  `${1}`; // FROM API
      let activeAcadYear = `${1}`; // FROM API
      let activeSem = `${1}`; // FROM API


      function b() {
        return(
          new Promise((res, rej) => {
            
            if(output){
              let data2= ( output.slice( 1, output.length).map((it, ix) => {

                  if(it.field1 !== "") {
                    return (
                              [
                                it.field1, // id
                                selected_educLevel, // educ_level_id
                                `GS${it.field1}`, // username
                                `$2y$14$0KXJgXTja40eZLNTf7oSy.y6buQOKuuCKcSK87Hh3cNjHzaU95fa6`, // password
                                it.field2, // image_url
                                it.field3, // studfname
                                it.field4, // studmname
                                it.field5, // studlname
                                it.field6, // course
                                it.field7, // yearlevel
                                it.field9, // cpnum
                                it.field10, // familyphone
                                it.field11, // gender
                                it.field8,  // section
                                activeAcadYear, // acad_year_id
                                activeSem, // semester_id
                              ]
                    )
                  }    
                })
              );

              res(data2)
            } else {
              rej([])
            }

          })
        )
      }

      setCsvArr( await b());

      console.log(CsvArr)
  }

  return(
    <div>
      <Container textAlign="center">
        CSV to JSON
        <hr/>

        <input type="file" onChange={(e)=>{parseCSV(e)}}/>
        <Button onClick={()=>{console.log(CsvArr)}}>Click</Button>
      </Container>
    </div>
  ) 
}

export default Test;