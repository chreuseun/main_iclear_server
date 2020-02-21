import React, {useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Table, Modal, Button, Form } from 'semantic-ui-react'
import Axios from 'axios';
import baseuri from '../../../../../../../res/baseuri';

const TableExampleStriped = (props) => {

  const [subjectItemData, setSubjectItemData] = useState({});
  const [modalOpen, setModalOpen] = useState(false)

  const SubjectItems = () => {
    
      return(
        <Table.Body>
          {
            props.subjectDetails.map((object, index)=>{
              return(
                <Table.Row key={object.id}
                  onClick={()=>{onSubjectItemClick({subjectDetail:object})}}
                >
                  <Table.Cell>{object.name}</Table.Cell>
                  <Table.Cell>{object.code}</Table.Cell>
                  <Table.Cell>{object.yearlevel}</Table.Cell>
                  <Table.Cell>{object.course}</Table.Cell>
                </Table.Row>
              )
            })
          }
        </Table.Body>
      )
  } 

  const onSubjectItemClick = ({subjectDetail}) => {
    console.log(subjectDetail);
    setSubjectItemData(subjectDetail);
    setModalOpen(true)
  }

  const onCloseModal = () => {
    setModalOpen(false)
    setSubjectItemData({});
  }

  return(
    <React.Fragment>

      <Table striped selectable>

        {/* Header */}
        <Table.Header>

          <Table.Row>

            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Code</Table.HeaderCell>
            <Table.HeaderCell>Yearlevel</Table.HeaderCell>
            <Table.HeaderCell>Course</Table.HeaderCell>

          </Table.Row>

        </Table.Header>

        {/* Table body */}
        <SubjectItems/>

      </Table>

      {modalOpen && <ModalAddSubject subjectItemData={subjectItemData} modalOpen={modalOpen} onCloseModal={onCloseModal}/>}

    </React.Fragment>
  )
}

const ModalAddSubject = (props) => {

  const history = useHistory();
  const [sections, setSections] = useState('');
  const [teachers, setTeachers] = useState('');
  const [SubTeacherList, setSubTeacherList] = useState([]);

  const effect = async(UpdateHook) => {
    try{
        const headers = {
          headers:{
            authorization: localStorage.getItem('x')
          }
        }

      let fetchSection = await Axios.get(`${baseuri}/api/subjclass/section?yearlevel=${props.subjectItemData.yearlevel}&course=${props.subjectItemData.course}&el_id=${props.subjectItemData.educ_level_id}`, headers);
      let fetchTeachers = await Axios.get(`${baseuri}/api/subjclass/teachers`, headers);

      let fetchhSubTeacher = await Axios.get(`${baseuri}/api/subjclass/teachers/subjects?subject_detail_id=${props.subjectItemData.id}`, headers);

      if(UpdateHook){

        setSections(fetchSection.data.data);
        setSubTeacherList(fetchhSubTeacher.data.data);

        let parseTeacher = fetchTeachers.data.data.map((obj, idx)=>{
          return(
            {
              key:obj.id,
              value:obj.id,
              text:obj.fullname
            }
          )
        });

        setTeachers(parseTeacher);
      }

    } catch(err){
      // localStoarage.clearItem()
      history.push('/'); // Push to home page
    }
  }

  useEffect(() => {
    let UpdateHook = true

    effect(UpdateHook)

    return () => {
      console.log('Modal; Unmounting')
      UpdateHook = false;
    };

  }, []);

  const onUpdateListSubectWithTeacher = async() => {
    try{
      
      const headers = {
        headers:{
          authorization: localStorage.getItem('x')
        }
      }

      let fetchhSubTeacher = await Axios.get(`${baseuri}/api/subjclass/teachers/subjects?subject_detail_id=${props.subjectItemData.id}`, headers);

      setSubTeacherList(fetchhSubTeacher.data.data);

    } catch(err){
      localStorage.clearItem();
      history.push('/');
    }
  };

  return(
    <Modal size={'fullscreen'} open={props.modalOpen}>
        <Modal.Header>

          {props.subjectItemData.name}{' - ('}{props.subjectItemData.code} {') - '} { props.subjectItemData.yearlevel } {' - '} { props.subjectItemData.course } {'-'}{ props.subjectItemData.el_name }

          <Button 
              onClick={()=>{props.onCloseModal()}}
              floated="right" inverted color='red'>
              Close   
          </Button>
        
        </Modal.Header>

        <Modal.Content>

          <FormAddSubjectTeacher subjectItemData={props.subjectItemData} sections={sections} teachers={teachers} onUpdateListSubectWithTeacher={onUpdateListSubectWithTeacher}/>

          <TableListCreatedSubjectWithTeacher SubTeacherList={SubTeacherList} />

        </Modal.Content>

      </Modal>
  )
}

// Add Subject teacher
const FormAddSubjectTeacher = (props) => {

  const [valTeacher, setvalTeacher] = useState('');
  const [valSection, setvalSection] = useState('');
  
  const onSubmitSaveSubjectTeacher = async() => {

    if(valTeacher === '' || valSection === ''){
      alert('Please Select data on Dropdown')
      return
    }

    try{

      let header = {
        headers:{
          authorization: localStorage.getItem('x')
        }
      }
      
      let dataBody = {
        teacher_account_id : valTeacher,
        subject_detail_id : props.subjectItemData.id,
        educ_level_id : props.subjectItemData.educ_level_id,
        course : props.subjectItemData.course,
        section : valSection,
        yearlevel : props.subjectItemData.yearlevel
      }

      let PostSubjectWithTeacher = await Axios.post(`${baseuri}/api/subjclass/teachers/subject/add`, dataBody, header);

      if(PostSubjectWithTeacher.data.data.msg === 'Teacher Added on the Subject'){
        alert(`Teacher added on the Subject on Section ${valSection}`);
        setvalSection('');
        setvalTeacher('');

        props.onUpdateListSubectWithTeacher()
      }else if(PostSubjectWithTeacher.data.data.msg === 'Subject Entry Already Exist'){
        alert( PostSubjectWithTeacher.data.data.msg );
      }
      else{
        alert(`Adding teacher failed please`);
      }

    }catch(err){
      console.log('error')
    }

  }

  const onChangeSection = (e, {value}) => {
    setvalSection(value);
  }

  const onChangeTeacher = (e, {value}) => {
    setvalTeacher(value);
  }

  return(
    <Form>

      <Form.Group widths='equal'>

        <Form.Select
          onChange={onChangeSection}
          fluid
          label='Section'
          placeholder='Section'
          options={props.sections || []}
          value = {valSection}
          search
        />

        <Form.Select
          onChange={onChangeTeacher}
          fluid
          label='Subject Teacher'
          placeholder='Subject Teacher'
          options={props.teachers || []}
          value = {valTeacher}
          search
        />

      </Form.Group>

      <Form.Button secondary
        onClick={onSubmitSaveSubjectTeacher}
      >Submit</Form.Button>

    </Form>
  )
}

// component table of subjct list
const TableListCreatedSubjectWithTeacher = (props) => {

  const TableListBody = () => {
    return(

        <React.Fragment>

          {
            props.SubTeacherList.map(( itm ,idx )=>{
              return(
                <Table.Row key={itm.id}>
                  <Table.Cell>{itm.subdet_name}</Table.Cell>
                  <Table.Cell>{itm.subdet_code}</Table.Cell>
                  <Table.Cell>{itm.section}</Table.Cell>
                  <Table.Cell>{itm.teac_name}</Table.Cell>
                  <Table.Cell>{itm.ay_name}{'-'}{itm.sem_name}</Table.Cell>
                </Table.Row>
              )
            })
          }

        </React.Fragment>

    )
  }


  return(

    <Table celled>

      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Subject</Table.HeaderCell>
          <Table.HeaderCell>Code</Table.HeaderCell>
          <Table.HeaderCell>Section</Table.HeaderCell>
          <Table.HeaderCell>Teacher</Table.HeaderCell>
          <Table.HeaderCell>Academic Year</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        <TableListBody/>
      </Table.Body>

    </Table>

  )

}

export default TableExampleStriped