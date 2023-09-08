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
import { cilDinner, cilPencil, cilPeople, cilTrash, cilUser } from '@coreui/icons'
import Modal from 'react-bootstrap/Modal';


export default class Dashboard extends React.Component {
    constructor() {
        super()
        this.state = {
            user: [],
            token: "",
        }
        if (localStorage.getItem("token")) {
            this.state.token = localStorage.getItem("token")
        } else {
            window.location = "/#/login"
        }
    }

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    getUserLogin = () => {
        axios.get(`http://localhost:8000/api/user`, this.headerConfig())
        .then(res => {
            this.setState({
                user: res.data.user
            })
        })
        .catch(err => {
            console.log(err.message)
        })
        console.log(this.state.user)
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    componentDidMount(){
        this.getUserLogin()
    }

    render(){
        return (         
            <CRow>
                <CCol xs>
                    <CCard className="" style={{height: '200px'}} >
                        <CCardBody>    
                            <CCol className='d-flex align-items-center justify-content-center mt-5'>
                                <CRow>
                                    <div> 
                                        <h2 className="card-title mb-0">Welcome {this.state.user.name} !</h2>
                                        <div className=" text-medium-emphasis mb-5 text-capitalize align-middle">You have successfully logged as {this.state.user.role}</div>
                                    </div> 
                                </CRow>
                            </CCol>                                            
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        )
    }
}
