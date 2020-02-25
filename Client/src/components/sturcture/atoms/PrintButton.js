import React from 'react';
import {Button} from 'semantic-ui-react';
import ReactToPrint from 'react-to-print';

const PrintButton = ({componentToPrint}) => {
  return(
      <>
          <ReactToPrint
              trigger={() => <Button secondary>Print</Button>}
              content={() => componentToPrint.current}
          />
      </>
  )
}

export default PrintButton;
