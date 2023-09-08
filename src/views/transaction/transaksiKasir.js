import React from 'react'
import axios from 'axios'
import {
    CAvatar,
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDinner, cilList, cilMoney, cilPencil, cilPizza, cilTrash, cilPlus, cilChart, cilCart, cilClipboard, cilCheck, cilCheckAlt } from '@coreui/icons'
import Modal from 'react-bootstrap/Modal';
import {Button, Col, Form, FormGroup, FormLabel, ModalBody, Row} from 'react-bootstrap'
import Swal from 'sweetalert2'

export default class TransaksiKasir extends React.Component {
    constructor() {
        super();
        this.state = {
            transaction : [],
            detailTransaksi: [],
            isModalOpen: false,
            isModalAddOpen : false,
            isModalPayOpen: false,
            detail: [],
            total: [],
            user:[],
            token: "",
            user_id: "",
            seat_id: "",
            name: "",
            seat: [],
            menu: [],
            qty: "",
            menu_id: "",
            total: 0,
            totalDetail: "",
            customer_name: "",
            count: "",
            cash: "",
            transaction_id: ""
        }
        if (localStorage.getItem("role") != 'cashier') {
            Swal.fire({
                title: 'Permission denied!',
                html: 'Only cashier roles can access this page',
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

    handleAddDetail = async (e) => {
        e.preventDefault();
        const selectMenu = this.state.menu.find(menuNama => menuNama.id == parseInt(this.state.id_menu));
        const newDetail = {
            id_menu: this.state.id_menu,
            qty: this.state.qty,
            nama: selectMenu.nama,
            subtotal: selectMenu.harga * this.state.qty
        }

        await this.setState({ detail: [...this.state.detail, newDetail] });

        let total = 0;
        this.state.detail.forEach((item) => {
            total += item.subtotal;
        });
        await this.setState({ total: total });

        this.setState({
            id_menu: "",
            qty: "",
        })
    }

    handleClose = () => {
        this.setState({
            isModalOpen : false
        })
    }
    
    handleAddClose = () => {
        this.setState({
            isModalAddOpen : false
        })
    }

    handlePayClose = () => {
        this.setState({
            isModalPayOpen : false
        })
    }

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    getTransactions = () => {
        axios.get(`http://localhost:8000/api/user`, this.headerConfig())
        .then(res => {
            let id = res.data.user.id
            axios.get(`http://localhost:8000/api/getByCashier/`+id, this.headerConfig())
            .then(res => {
                this.setState({
                    transaction: res.data.data,
                    count: res.data.count
                })
            })
            .catch(err => {
                console.log(err.message)
            })
        })       
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    handleMenuChange = (e) => {
        const menu_id = e.target.value;
        this.setState({ menu_id });
    }

    getMejaKosong = () => {
        axios.get(`http://localhost:8000/api/mejaKosong`, this.headerConfig())
        .then(res => {
            this.setState({
                meja: res.data.data,
            })
        })
        .catch(err => {
            console.log(err.message)
        })
    }

    getMenu = () => {
        axios.get(`http://localhost:8000/api/getMenus`, this.headerConfig())
        .then(res => {
            this.setState({
                menu: res.data.data,
            })
        })
        .catch(err => {
            console.log(err.message)
        })
    }

    handleEdit = (selectedItem) => {
        this.setState({
            isModalOpen : true,
        })
    } 

    handleShowDetail = (id) => {
        axios.get(`http://localhost:8000/api/getDetail/` + id, this.headerConfig())
        .then(res => {
            this.setState({
                detailTransaksi: res.data.data,
                totalDetail: res.data.total
            })
        })
        .catch(err => {
            console.log(err.message)
        })
        this.setState({
            isModalOpen : true,
        })
    }

    handleAddTransaksi = () => {
        this.getMejaKosong()
        this.setState({
            isModalAddOpen: true,
            nama_pelanggan: "",
            id_meja: "",
            id_menu: "",
            qty: "",
            detail: [],
            total: ""
        })
    }

    handleOpenPayment = (id) => {
        axios.get(`http://localhost:8000/api/getDetail/` + id, this.headerConfig())
        .then(res => {
            this.setState({
                id_transaksi: res.data.data[0].id_transaksi,
                totalDetail: res.data.total,
                isModalPayOpen : true,
                tunai: ""
            })
        })
        .catch(err => {
            console.log(err.message)
        })
        console.log(this.state.id_transaksi)
    }

    handleSave = (e) => {
        e.preventDefault();
        const data = {
            id_user: this.state.id_user,
            id_meja: this.state.id_meja,
            nama_pelanggan: this.state.nama_pelanggan,
            detail: this.state.detail
        };

        axios.post('http://localhost:8000/api/transaksi', data, this.headerConfig())
        .then(res => {
            this.getTransaksi()
            this.setState({isModalAddOpen: false})
            Swal.fire({
                title: 'Berhasil !',
                html: res.data.message,
                icon: 'success'
            })
        })
        .catch((error) => {
            console.log(error);
        });
    }

    renderStatus = (status) => {
        if(status == 'unpaid'){
            return(
                <div className="badge bg-danger text-wrap" style={{width: '6rem'}}>
                    Unpaid
                </div>
            )
        } else if (status == 'paid'){
            return(
                <div className="badge bg-success text-wrap" style={{width: '6rem'}}>
                    Paid
                </div>
            )
        }
    }

    renderAction = (status, id) => {
        if(status == 'unpaid'){
            return(
                <CButton className='mx-1 btn btn-danger btn-sm' style={{width:"50px", color:"white"}} onClick={() => this.handleOpenPayment(id,status)}><CIcon icon={cilMoney}/>
                </CButton>
            )
        } else if (status == 'paid'){
            return(
                <CButton className='mx-1 btn btn-success btn-sm' style={{width:"50px", color:"white"}} disabled><CIcon icon={cilCheckAlt}/>
                </CButton>
            )
        }
    }

    handlePay = (e) => {
        e.preventDefault()
        let form = new FormData()
        form.append("tunai", this.state.tunai)
        axios.post('http://localhost:8000/api/pembayaran/'+ this.state.id_transaksi, form, this.headerConfig())
        .then(res => {
            this.getMejaKosong()
            this.getTransaksi()
            Swal.fire({
                title: 'Berhasil !',
                html: 'Pembayaran Berhasil',
                icon: 'success'
            })
            this.setState({isModalPayOpen: false})
        })
        .catch((error) => {
            Swal.fire({
                title: 'Gagal !',
                html: res.data.message,
                icon: 'warning'
            })
        });
    }

    componentDidMount(){
        this.getTransactions()
        this.getMejaKosong()
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
                                    Transaksi Kasir
                                </h4>
                                <div className="small text-medium-emphasis mb-5">{this.state.count} Data</div>
                            </CCol>
                            <CCol md="7">
                                <CButton className="btn btn-primary btn float-end" onClick={() => this.handleAddTransaksi()}>Tambah Data <CIcon icon={cilPlus}/></CButton>
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
                                        <CTableHeaderCell className="text-center">Nama Kasir</CTableHeaderCell>
                                        <CTableHeaderCell className="text-center">No Meja</CTableHeaderCell>
                                        <CTableHeaderCell className="text-center">Nama Pelanggan</CTableHeaderCell>
                                        {/* <CTableHeaderCell className="text-center">Total</CTableHeaderCell> */}
                                        <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                                        <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {this.state.transaction.map((item) => {
                                        return(
                                        <CTableRow key={item.id}>    
                                        <CTableDataCell className='text-center'>
                                            <div>#</div>
                                        </CTableDataCell>                               
                                        <CTableDataCell className='text-center'>
                                            <div>{item.id}</div>
                                        </CTableDataCell>
                                        <CTableDataCell className='text-center'>
                                            <div>{item.transaction_date}</div>
                                        </CTableDataCell>
                                        <CTableDataCell className='text-center'>
                                            <div>{item.name}</div>
                                        </CTableDataCell>
                                        <CTableDataCell className='text-center'>
                                            <div>{item.seat_id}</div>
                                        </CTableDataCell>
                                        <CTableDataCell className='text-center'>
                                            <div>{item.customer_name}</div>
                                        </CTableDataCell>    
                                        <CTableDataCell className='text-center'>
                                            {this.renderStatus(item.status)}                                      
                                        </CTableDataCell>
                                        <CTableDataCell className='text-center'>
                                            <div className='text-center'>
                                                <CButton className='mx-1 btn btn-secondary btn-sm' style={{width:"50px", color:"white"}} onClick={() => this.handleShowDetail(item.id)}>
                                                    <CIcon icon={cilClipboard} className='sm'/>                                                     
                                                </CButton>
                                            {this.renderAction(item.status, item.id)}
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

{/* =                <Modal show={this.state.isModalOpen} onHide={this.handleClose}>
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
                                <td>Rp. {this.state.totalDetail}</td>
                            </tr> 
                        </tbody>
                    </table>   
                    </Modal.Body>
                </Modal>

                <Modal show={this.state.isModalAddOpen} onHide={this.handleAddClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Form Pesanan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form onSubmit={(e) => this.handleSave(e)}>
                        <ModalBody>
                            <Form.Group className='mb-3'>
                                <Form.Label>Nama Pelannggan</Form.Label>
                                <Form.Control type='text' name='nama_pelanggan' value={this.state.nama_pelanggan} onChange={this.handleChange} required></Form.Control>
                                <Form.Control type='text' name='id_user' value={this.state.id_user} onChange={this.handleChange} hidden></Form.Control>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label >No Meja Tersedia</Form.Label>
                                <Form.Select value={this.state.id_meja} name='id_meja' onChange={this.handleChange} required>
                                <option></option>
                                {this.state.meja.map((item) => {
                                    return(
                                        <option key={item.id} value={item.id}>{item.id}</option>
                                    )
                                })}
                                </Form.Select>
                            </Form.Group> 
                            <FormGroup className='mb-3'>
                                <Row>
                                    <Col md="6">
                                        <Form.Label>
                                            Menu
                                        </Form.Label>
                                        <Form.Select name="id_menu" onChange={this.handleMenuChange} value={this.state.id_menu}>
                                            <option></option>
                                            {this.state.menu.map((item) => {
                                                return(
                                                    <option key={item.id} value={item.id}>{item.nama}</option>
                                                )
                                            })}
                                        </Form.Select>
                                    </Col>
                                    <Col md="6">
                                        <Form.Label>
                                            Qty
                                        </Form.Label>
                                        <Form.Control type='number' name='qty' onChange={this.handleChange} value={this.state.qty}></Form.Control>
                                    </Col>
                                </Row>
                                <Button className='btn btn-success mt-3' onClick={this.handleAddDetail} >Tambahkan Menu <CIcon icon={cilCart}/></Button>
                                <br />
                                    <table className='table mt-4 table-bordered' align='middle'>
                                        <thead>
                                            <tr>
                                                <th>Menu</th>
                                                <th>Qty</th>
                                                <th>Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.detail.map((detail, index) => (
                                            <tr key={index}>
                                                <td>{detail.nama}</td>
                                                <td>{detail.qty}</td>
                                                <td>Rp. {detail.subtotal}</td>
                                            </tr>
                                            ))}
                                            <tr> 
                                                <th colSpan="2" style={{ textAlign: "right" }}>Total:</th>
                                                <td>Rp. {this.state.total}</td>
                                            </tr> 
                                        </tbody>
                                    </table>                                
                            </FormGroup>
                        </ModalBody>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose}>
                            Close
                            </Button>
                            <Button variant="primary" type="submit">
                            Save
                            </Button>
                        </Modal.Footer>
                    </Form>
                    </Modal.Body>
                </Modal>
            
                <Modal show={this.state.isModalPayOpen} onHide={this.handlePayClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Form Pembayaran</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form onSubmit={(e) => this.handlePay(e)}>
                        <ModalBody>
                            <Form.Group className='mb-3'>
                                <Form.Label>Id</Form.Label>
                                <Form.Control type='text' disabled value={this.state.id_transaksi}/>
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Total</Form.Label>
                                <Form.Control type='text' disabled value={`Rp. ${this.state.totalDetail}`} />
                            </Form.Group>
                            <Form.Group className='mb-3'>
                                <Form.Label>Tunai</Form.Label>
                                <Form.Control type='number' name='tunai' value={this.state.tunai} onChange={this.handleChange}/>
                            </Form.Group>
                        </ModalBody>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handlePayClose}>
                            Close
                            </Button>
                            <Button variant="primary" type="submit">
                            Save
                            </Button>
                        </Modal.Footer>
                    </Form>
                    </Modal.Body>
                </Modal> */}
            </CRow>
        )
    }
}


