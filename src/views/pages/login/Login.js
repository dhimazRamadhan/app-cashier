import React from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import axios from 'axios'
import Swal from 'sweetalert2'

export default class Login extends React.Component{
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      validation: [],
      setValidation: []
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleLogin = (e) => {
    e.preventDefault()
    let form = new FormData()
    form.append("username", this.state.username)
    form.append("password", this.state.password)

    axios.post(`http://localhost:8000/api/login`, form)
      .then(res => {
        //set item
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.user.role);
        Swal.fire({
          title: 'Success!',
          html: 'Login successfully!',
          icon: 'success'
        })
        window.location = '/#/dashboard'
      })
      .catch((err) => {
        Swal.fire({
          title: 'Failed to login!',
          html: 'Incorrect email or password!',
          icon: 'error'
        })
        console.log(err.message)
    })
  }

  componentDidMount(){
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }

  render(){
    return (
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={8}>
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm onSubmit={(e) => this.handleLogin(e)}>
                      <h1>Login</h1>
                      <p className="text-medium-emphasis">Please login !</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput placeholder="Username" name='username' value={this.state.username} onChange={this.handleChange}/>
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Password"
                          name='password'
                          value={this.state.password}
                          onChange = {this.handleChange}
                        />
                      </CInputGroup>
                      <CRow>
                        <CCol xs={6}>
                          <CButton color="primary" className="px-4" type='submit' > 
                            Login
                          </CButton>
                        </CCol>
                        <CCol xs={6} className="text-right">
                          {/* <CButton color="link" className="px-0">
                            Forgot password?
                          </CButton> */}
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
                <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                  <CCardBody className="text-center">
                    <div>
                      <h2>Register</h2>
                      <p>
                          Don't have an account? Please register to continue the application.                      
                      </p>
                      <Link to="/register">
                        <CButton color="primary" className="mt-3" active tabIndex={-1}>
                          Register now !
                        </CButton>
                      </Link>
                    </div>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    )
  }
}