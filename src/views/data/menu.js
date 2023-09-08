import React from 'react'
import axios from 'axios'
import {Button, Form, InputGroup} from 'react-bootstrap'
import Swal from 'sweetalert2'
import DataTable from 'react-data-table-component';

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
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CInputGroupText,
    CFormInput,
    CForm
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilFilter, cilPencil, cilPizza, cilPlus, cilSearch, cilTrash } from '@coreui/icons'
import Modal from 'react-bootstrap/Modal';

const columns = [
    {
        name: 'ID',
        selector: 'id',
        sortable: true,
    },
    {
        name: 'Name',
        selector: 'name',
        sortable: true,
    },
    {
        name: 'Type',
        selector: 'type',
        sortable: true,
    },
    {
        name: 'Description',
        selector: 'description',
        sortable: true,
    },
    {
        name: 'Image',
        cell: row => <img src={`http://localhost:8000/storage/${row.image}`} width='50px' alt={row.name} />,
    },
    {
        name: 'Price',
        selector: 'price',
        sortable: true,
    },
    {
        name: 'Actions',
        cell: row => (
            <div>
                <button onClick={() => this.handleEdit(row)}>Edit</button>
                <button onClick={() => this.handleDrop(row.id)}>Delete</button>
            </div>
        ),
    },
];

export default class Menu extends React.Component {
    constructor() {
        super();
        this.state = {
            menu : [],
            isModalOpen: false,
            name: "",
            type: "",
            description: "",
            image: null,
            price: "",
            action: "insert",
            token: "",
            keyword: "",
            countMenu: ""
        }
        if (localStorage.getItem("role") != 'admin') {
            Swal.fire({
                title: 'Permission denied!',
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

    getMenu = () => {
        axios.get(`http://localhost:8000/api/getMenus`, this.headerConfig())
        .then(res => {
            this.setState({
                menu: res.data.data,
                countMenu: res.data.count
            })
        })
        .catch(err => {
            console.log(err.message)
        })
    }

    handleSearch = (e) => {
        e.preventDefault()  
        let form = new FormData()
        form.append("keyword", this.state.keyword)
        axios.post(`http://localhost:8000/api/searchMenu`,form, this.headerConfig())
        .then(res => {
            this.setState({
                menu: res.data.data,
                countMenu: res.data.count
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

    handleFile = (e) => {
        this.setState({
            image: e.target.files[0]
        })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleEdit = (item) => {
        this.setState({
            isModalOpen : true,
            menu_id: item.id,
            name: item.name ,
            type: item.type,
            description: item.description,
            image: item.image,
            price: item.price,
            action : "update",
        })
        console.log(this.state.item.image)
    } 

    handleAdd = () => {
        this.setState({
            isModalOpen : true,
            name: "",
            type: "",
            description: "",
            image: null,
            price: "",
            action : "insert"
        })
    }

    handleSave = (e) => {
        e.preventDefault()  
        let form = new FormData()
        form.append("name", this.state.name)
        form.append("type", this.state.type) 
        form.append("description", this.state.description) 
        form.append("image", this.state.image) 
        form.append("price", this.state.price) 

        if(this.state.action == "insert") {
            axios.post(`http://localhost:8000/api/addMenu`, form, this.headerConfig())
            .then(res => {
                this.getMenu()
                this.handleClose()
                Swal.fire({
                    title: 'Success!',
                    html: res.data.message,
                    icon: 'success'
                })
            })
            .catch(err => {
                console.log(err.message)
            })
        }

        else if(this.state.action == "update"){
            axios.post(`http://localhost:8000/api/updateMenu/`+this.state.menu_id, form, this.headerConfig())
            .then(res => {
                this.getMenu()
                this.handleClose()
                Swal.fire({
                    title: 'Success!',
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
                axios.delete(`http://localhost:8000/api/deleteMenu/`+ id, this.headerConfig())
                .then(res => {
                    this.getMenu()
                    Swal.fire({
                        title: 'Success!',
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
        this.getMenu()
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
                                        Menus Data
                                    </h4>
                                    <div className="small text-medium-emphasis mb-5">{this.state.countMenu} Data</div>
                                </CCol>
                                <CCol md="7">
                                    <CButton className="btn btn-primary btn float-end" onClick={() => this.handleAdd()}>Add Data</CButton>
                                </CCol>
                            </CRow>
                            <CRow>                           
                                <CCol md="12">
                                    {/* search button */}
                                    <CForm onSubmit={(e) => this.handleSearch(e)}>
                                        <CInputGroup>
                                            <CFormInput type="text" placeholder="Search by name / description" name="keyword" onChange={this.handleChange} value={this.state.keyword}/> 
                                            <CButton type='submit' className='btn border border-secondary' style={{backgroundColor:"transparent"}}>
                                                <CIcon icon={cilSearch} className="light" style={{color:'black'}}/>
                                            </CButton>
                                        </CInputGroup>
                                    </CForm>
                                </CCol>
                            </CRow>
                            <CRow className='mt-4'>
                                <CTable align="middle" className="mb-0 border" hover responsive>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell className="text-center" style={{width: "50px"}}>
                                            <CIcon icon={cilPizza} />
                                            </CTableHeaderCell>
                                            <CTableHeaderCell className="text-center">ID</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center">Name</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center">Type</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center">Description</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center">Image</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center">Price</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center">Edit | Delete</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {this.state.menu.map((item, index) => {
                                            return(
                                            <CTableRow key={index}>   
                                            <CTableDataCell className='text-center'>
                                                <div>#</div>
                                            </CTableDataCell>                               
                                            <CTableDataCell className='text-center'>
                                                <div>{item.id}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className='text-center'>
                                                <div>{item.name}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className='text-center'>
                                                <div style={{textTransform: "capitalize"}}>{item.type}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className='text-center' style={{width: "300px"}}>
                                                <div>{item.description}</div>
                                            </CTableDataCell>
                                            <CTableDataCell className='text-center'>
                                                <div><img src={`http://localhost:8000/storage/${item.image}`} width='150px'/> </div>
                                            </CTableDataCell>
                                            <CTableDataCell className='text-center'>
                                                <div>Rp.{item.price}</div>
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
                    <Modal.Title>Form Menu Data</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={(e) => this.handleSave(e)}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label >Menu Name</Form.Label>
                            <Form.Control type="text" name="name" placeholder="" value={this.state.name} onChange={this.handleChange} required/>
                        </Form.Group>  
                        <Form.Group className="mb-3">
                            <Form.Label>Type</Form.Label>
                            <Form.Select name="type" value={this.state.type} onChange={this.handleChange} required>
                                <option></option>
                                <option value={'food'}>Food</option>
                                <option value={'drink'}>Drink</option>
                            </Form.Select>
                        </Form.Group>  
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" name="description" placeholder="" value={this.state.description} onChange={this.handleChange} required/>
                        </Form.Group>   
                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="file" placeholder="" name='image' onChange={this.handleFile} required/>
                        </Form.Group> 
                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="text" name="price" placeholder="" value={this.state.price} onChange={this.handleChange} required/>
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