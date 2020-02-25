import React, { useRef, useEffect } from 'react';
import ReactToPrint from 'react-to-print';
 
class ComponentToPrint extends React.Component {
  render (){
   return(
     <TransposeToFunction/>
   )
  }
}

const TransposeToFunction = () => {
  useEffect(()=>{
    console.log('MOUNT TEST')
    return (() => {
      console.log('UNMOUNTING THIS PAGE')
    })
  },[]);

  return (
    <table>
      <thead>
        <th>column 1</th>
        <th>column 2</th>
        <th>column 3</th>
      </thead>
      <tbody>
        <tr>
          <td>data 1</td>
          <td>data 2</td>
          <td>data 3</td>
        </tr>
        <tr>
          <td>data 1</td>
          <td>data 2</td>
          <td>data 3</td>
        </tr>
        <tr>
          <td>data 1</td>
          <td>data 2</td>
          <td>data 3</td>
        </tr>
      </tbody>
    </table>
  )
}
 
const Example = () => {
  const componentRef = useRef();
  return (
    <div>
      <div style={{ display: "none" }}>
        <ComponentToPrint style={{display:'none'}} ref={componentRef} />
      </div>
    
      <hr/>

      <ReactToPrint
        trigger={() => <button>Print this out!</button>}
        content={() => componentRef.current}
      />
     
    </div>
  );
};
export default Example;
