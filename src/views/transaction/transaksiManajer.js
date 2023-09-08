import React from 'react'
import axios from 'axios'
import { useState } from "react";
import Swal from 'sweetalert2';

import {
    CAvatar,
    CButton,
    CButtonGroup,
    CCard,
    CForm,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CFormSelect,
    CInputGroup,
    CProgress,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CFormInput,
    CFormLabel
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDinner, cilList, cilPencil, cilPizza, cilTrash, cilSearch, cilFilter, cilClipboard } from '@coreui/icons'
import Modal from 'react-bootstrap/Modal';


export default class createTransaksi extends React.Component {
    constructor() {
        super();
        this.state = {
            transaksi : [],
            isModalOpen: false,
            kasir: [],
            param: "",
            detailTransaksi:[],
            total: ""
        }
        if (localStorage.getItem("role") != 'manajer') {
            Swal.fire({
                title: 'Izin Ditolak!',
                html: 'Maaf Hanya Role Manajer Yang Bisa Mengakses Menu Ini',
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

    handleClose = () => {
        this.setState({
            isModalOpen : false
        })
    }
    

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    getTransaksi = () => {
        axios.get(`http://localhost:8000/api/transaksi`, this.headerConfig())
        .then(res => {
            this.setState({
                transaksi: res.data.data
            })
        })
        .catch(err => {
            console.log(err.message)
        })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleEdit = (selectedItem) => {
        this.setState({
            isModalOpen : true,
        })
    } 

    getKasir = () => {
        axios.get(`http://localhost:8000/api/getKasir`)
        .then(res => {
            this.setState({
                kasir: res.data.data
            })
        })
        .catch(err => {
            console.log(err.message)
        })
    }

    handleFilter = (e) => {
        e.preventDefault()  

        if (this.state.param == "all") {
            this.getTransaksi()
        } else {
            let form = new FormData()
            form.append("param", this.state.param)
            axios.post(`http://localhost:8000/api/filterTransaksiKasir`,form)
            .then(res => {
                this.setState({
                    transaksi: res.data.data
                })
            })
            .catch(err => {
                console.log(err.message)
            })
        }
    }

    handleShowDetail = (id) => {
        axios.get(`http://localhost:8000/api/getDetail/` + id, this.headerConfig())
        .then(res => {
            this.setState({
                detailTransaksi: res.data.data,
                total: res.data.total
            })
        })
        .catch(err => {
            console.log(err.message)
        })
        this.setState({
            isModalOpen : true,
        })
    }

    renderStatus = (status) => {
        if(status == 'belum_bayar'){
            return(
                <div className="badge bg-danger text-wrap" style={{width: '6rem'}}>
                    Belum Bayar
                </div>
            )
        } else if (status == 'lunas'){
            return(
                <div className="badge bg-success text-wrap" style={{width:"6rem"}}>
                    Lunas
                </div>
            )
        }
    }

    componentDidMount(){
        this.getTransaksi()
        this.getKasir()
    }

    render(){
        return (         
            <CRow>
                <CCol xs>
                    <CCard className="mb-4">
                    <CCardBody>
                        <CRow>
                            <CCol md="4">
                            <h4 id="traffic" className="card-title mb-5">
                                Data Transaksi
                            </h4>
                                {/* search button */}
                                <CForm onSubmit={(e) => this.handleFilter(e)}>
                                    <CFormLabel>Filter Berdasarkan Kasir</CFormLabel>
                                    <CInputGroup>
                                        <CFormSelect name="param" onChange={this.handleChange} value={this.state.param}>
                                            <option value={"all"}>
                                                Semua
                                            </option>
                                            {this.state.kasir.map((item, index) => {
                                                return(
                                                    <option key={index} value={item.id}>{item.nama}</option>
                                                )
                                            })}
                                        </CFormSelect>
                                        <CButton type='submit' className='btn border border-secondary' style={{backgroundColor:"transparent"}}>
                                            <CIcon icon={cilFilter} className="light" style={{color:'black'}}/>
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
                                        <CIcon icon={cilList} />
                                        </CTableHeaderCell>
                                        <CTableHeaderCell className="text-center" >ID Transaksi</CTableHeaderCell>
                                        <CTableHeaderCell className="text-center">Tanggal Transaksi</CTableHeaderCell>
                                        <CTableHeaderCell className="text-center">ID Kasir</CTableHeaderCell>
                                        <CTableHeaderCell className="text-center">No Meja</CTableHeaderCell>
                                        <CTableHeaderCell className="text-center">Nama Pelanggan</CTableHeaderCell>
                                        <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                                        <CTableHeaderCell className="text-center">Detail</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {this.state.transaksi.map((item, index) => {
                                        return(
                                        <CTableRow key={index}>    
                                        <CTableDataCell className='text-center'>
                                            <div>#</div>
                                        </CTableDataCell>                               
                                        <CTableDataCell className='text-center'>
                                            <div>{item.id}</div>
                                        </CTableDataCell>
                                        <CTableDataCell className='text-center'>
                                            <div>{item.tgl_transaksi}</div>
                                        </CTableDataCell>
                                        <CTableDataCell className='text-center'>
                                            <div>{item.username}</div>
                                        </CTableDataCell>
                                        <CTableDataCell className='text-center'>
                                            <div>{item.id_meja}</div>
                                        </CTableDataCell>
                                        <CTableDataCell className='text-center'>
                                            <div>{item.nama_pelanggan}</div>
                                        </CTableDataCell>                      
                                        <CTableDataCell className='text-center'>
                                            {this.renderStatus(item.status)}
                                        </CTableDataCell>
                                        <CTableDataCell className='text-center'>
                                            <CButton style={{backgroundColor:"transparent"}} className='border border-0' onClick={() => this.handleShowDetail(item.id)}>
                                                <CIcon icon={cilClipboard} style={{color:"blue"}} className='sm' size='xl'/> 
                                            </CButton>
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
                        <Modal.Title>List Detail Transaksi</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <table className='table mt-4 table-bordered' align='middle'>
                        <thead>
                            <tr>
                                <th scope="col">Menu</th>
                                <th scope="col">Qty</th>
                                <th scope="col">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.detailTransaksi.map((item, index) => {
                                return(
                                    <tr key={index}> 
                                        <td>{item.nama}</td>
                                        <td>{item.qty}</td>
                                        <td>Rp. {item.subtotal}</td>
                                    </tr>                 
                                )
                            })} 
                            <tr> 
                                <th colSpan="2" style={{ textAlign: "right" }}>Total:</th>
                                <td>Rp. {this.state.total}</td>
                            </tr> 
                        </tbody>
                    </table>   
                    </Modal.Body>
                </Modal>
            </CRow>
        )
    }
}