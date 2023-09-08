import React from 'react'
import axios from 'axios'
import {Button, Form} from 'react-bootstrap'
import Swal from 'sweetalert2'

import {
    CAvatar,
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CInputGroup,
    CProgress,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDinner, cilPencil, cilTrash, cilPlus } from '@coreui/icons'
import Modal from 'react-bootstrap/Modal';
import { check } from 'prettier'

export default class Seat extends React.Component {
    constructor() {
        super();
        this.state = {
            seats : [],
            isModalOpen: false,
            seat_id: "",
            number: "",
            status: "",
            action: "insert",
            token: "",
            check:[],
            countSeats: ""
        }
        if (localStorage.getItem("role") != 'admin') {
            Swal.fire({
                title: 'Permission Denied!',
                html: 'Only admin roles can access this page',
                icon: 'error'
            })
            window.location = '/#/dashboard'
        }
        if (localStorage.getItem("token")) {
            this.state.token = localStorage.getItem("token")
        } 
        else {
            window.location = "/#/login"
        }
    }

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    getSeat = () => {
        axios.get(`http://localhost:8000/api/getSeats`, this.headerConfig())
        .then(res => {
            this.setState({
                seats: res.data.data,
                countSeats: res.data.count
            })
        })
        .catch(err => {
            console.log(err.message)
        })
    }
    
    handleClose = () => {
        this.setState({
            isModalOpen : false
        })
    }
    
    handleAdd = () => {
        this.setState({
            isModalOpen: true,
            number: "",
            status: "",
            action: "insert",
        })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleEdit = (item) => {
        console.log(item.id)
        this.setState({
            isModalOpen : true,
            seat_id: item.id,
            number: item.number,
            status: item.status,
            action: "update"
        })
    } 

    handleSave = (e) => {
        e.preventDefault()  
        let form = new FormData()
        form.append("number", this.state.number) 

        if(this.state.action == "insert") {
            axios.post(`http://localhost:8000/api/addSeat`, form, this.headerConfig())
            .then(res => {
                this.getSeat()
                this.handleClose()
                Swal.fire({
                    title: 'Success !',
                    html: res.data.message,
                    icon: 'success'
                })
            })
            .catch(err => {
                console.log(err.message)
            })
        }
        else if(this.state.action == "update"){
            axios.post(`http://localhost:8000/api/updateSeat/`+this.state.seat_id, form, this.headerConfig())
            .then(res => {
                this.getSeat()
                this.handleClose()
                Swal.fire({
                    title: 'Success !',
                    html: res.data.message,
                    icon: 'success'
                })
            })
            .catch(err => {
                console.log(err.message)
            })
        }
    }

    handleDrop = (id) => {
        Swal.fire({
            title: 'Are you sure you to delete this data?',
            text: 'You cannot restore this data!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if(result.isConfirmed){
                axios.delete(`http://localhost:8000/api/deleteSeat/`+ id, this.headerConfig())
                .then(res => {
                    this.getSeat()
                    Swal.fire({
                        title: 'Success !',
                        html: res.data.message,
                        icon: 'success'
                    })
                })
                .catch(err => {
                    console.log(err.message)
                })
            }
        }) 
    }

    componentDidMount(){
        this.getSeat()
    }

    render(){
        return (         
            <CRow>
                <CCol xs>
                    <CCard className="mb-4">
                    <CCardBody>
                        <CRow>
                            <CCol md="5">
                                <h4 id="traffic" className="card-title mb-0">
                                    Seats Data
                                </h4>
                                <div className="small text-medium-emphasis mb-5">{this.state.countSeats} Data</div>
                            </CCol>
                            <CCol md="7">
                                <CButton className="btn btn-primary btn float-end" onClick={() => this.handleAdd()}>Add Data</CButton>
                            </CCol>
                        </CRow>
                        <CRow className='mt-4'>
                            <CTable align="middle" className="mb-0 border" hover responsive>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell className="text-center">
                                        <CIcon icon={cilDinner} />
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="text-center" >Seat ID</CTableHeaderCell>
                                        <CTableHeaderCell className="text-center">Seat Number</CTableHeaderCell>
                                        <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                                        <CTableHeaderCell className="text-center">Edit | Delete</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {this.state.seats.map((item, index) => {
                                        return(
                                        <CTableRow key={index}>                                   
                                        <CTableDataCell className='text-center'>
                                            <div>#</div>
                                        </CTableDataCell>
                                        <CTableDataCell className='text-center'>
                                            <div>{item.id}</div>
                                        </CTableDataCell>
                                        <CTableDataCell className='text-center'>
                                            <div>{item.number}</div>
                                        </CTableDataCell>
                                        <CTableDataCell className='text-center'>
                                            <div>{item.status}</div>
                                        </CTableDataCell>
                                        <CTableDataCell className='text-center'>
                                            <div className='text-center'>
                                                <CButton className='border border-0' onClick={() => this.handleEdit(item)}  style={{backgroundColor:"transparent"}}>
                                                    <CIcon icon={cilPencil} className='sm' style={{color:"blue"}} size={'lg'}/> 
                                                </CButton>
                                                <CButton className='border border-0' onClick={() => this.handleDrop(item.id)} style={{backgroundColor:"transparent"}}>
                                                    <CIcon icon={cilTrash} style={{color:"red"}} size={'lg'}/>
                                                </CButton>
                                            </div>
                                        </CTableDataCell> 
                                    </CTableRow>
                                    )
                                    })}                         
                                </CTableBody>
                            </CTable>
                        </CRow>
                        <br />
                    </CCardBody>
                    </CCard>
                </CCol>

                <Modal show={this.state.isModalOpen} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Seat Data Form</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={(e) => this.handleSave(e)}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label >Seat Number</Form.Label>
                            <Form.Control type="text" name="number" placeholder="" value={this.state.number} onChange={this.handleChange} required/>
                        </Form.Group>  
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select label="status" disabled value={this.state.status} required>
                                <option>Avaible</option>
                                <option>Not Avaible</option>
                            </Form.Select>
                        </Form.Group>     
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                        Close
                        </Button>
                        <Button variant="primary" type="submit">
                        Save
                        </Button>
                    </Modal.Footer>
                    </Form>
                </Modal>
            </CRow>
        )
    }
}
