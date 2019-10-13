import React, { useState } from 'react'
import csv from 'csvtojson';
import {  Container } from 'semantic-ui-react'
import { async } from 'q';

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

      csv({noheader:true, output: "json " })
      .fromString(data)
      .then((csvRow)=>{ 
          console.log(csvRow) 
          // console.log(csvRow.slice(1, csvRow.length))
          setCsvArr(csvRow)


          let selected_educLevel =  `${1}`;
          let activeAcadYear = `${1}`;
          let activeSem = `${1}`;

          let data2 = csvRow.slice(1, csvRow.length).map((it, ix) => {

            if(it.field1 !== "") {
              return ({
                "id" : it.field1, // id
                "educ_level_id" : selected_educLevel, // educ_level_id
                "username" : `GS${it.field1}`, // username
                "password" : `$2y$14$0KXJgXTja40eZLNTf7oSy.y6buQOKuuCKcSK87Hh3cNjHzaU95fa6`, // password
                "image_url" : it.field2, // image_url
                "studfname" : it.field3, // studfname
                "studmname" : it.field4, // studmname
                "studlname" : it.field5, // studlname
                "course" : it.field6, // course
                "yearlevel" : it.field7, // yearlevel
                "cpnum" : it.field9, // cpnum
                "familyphone" : it.field10, // familyphone
                "gender" : it.field11, // gender
                "section" : it.field8,  // section
                
               
                
                
                acad_year_id : activeAcadYear, // acad_year_id
                semester_id : activeSem, // semester_id

                /*
                  id
                  educ_level_id
                  username
                  password
                  image_url
                  studfname
                  studmname
                  studlname
                  course
                  yearlevel
                  cpnum
                  familyphone
                  gender
                  section
                  acad_year_id
                  semester_id
                */
              })
            }
          })

          console.log(data2)
      })
     
     
      // let data =  


      console.log(data)
      // csv({
      //   noheader:true,
      //   output: "csv"
      // })
      // .fromString(Fpath)
      // .then((csvRow)=>{ 
      //     console.log(csvRow) // => [["1","2","3"], ["4","5","6"], ["7","8","9"]]
      // })
  }


    // console.log(e.target.files[0])
    




  return(
    <div>
      <Container textAlign="center">
        CSV to JSON
        <hr/>

        <input type="file" onChange={(e)=>{parseCSV(e)}}/>
      </Container>
    </div>
  ) 
}

export default Test;