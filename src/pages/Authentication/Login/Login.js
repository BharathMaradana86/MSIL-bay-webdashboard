import React,{useContext, useState} from 'react'
import './Login.css'
import hypervise_blue from '../../../images/hypervise-blue.png'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import {Dialog,DialogTitle,DialogContent,DialogActions} from '@mui/material';
import { Typography  } from '@mui/material'
import Button from '@mui/material/Button';
import { AuthContext } from '../../../utils/Auth.context';

export default function Login() {

  const { handleLoginContext } = useContext(AuthContext);
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
  };  
  const navigate = useNavigate()
    localStorage.clear();


    const width = window.innerWidth <1000
    const width510 = window.innerWidth<530
    const [passwordVisible, setPasswordVisible] = useState(false);

  const toggleVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };


  const [openInvalidCredentialsDialog, setOpenInvalidCredentialsDialog] = useState(false);
  const [openEmailNotFoundDialog, setOpenEmailNotFoundDialog] = useState(false);


  const [email,setEmail] = useState("")
  const [password,setPassword]= useState("")

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });





localStorage.setItem('token',null)

async function login(event){
  event.preventDefault();
  let errors = {};
  let isValid = true;

  if (!email) {
    errors.email = "Please enter your email.";
    isValid = false;
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email address.";
      isValid = false;
    }
  }

  // Validate password
  if (!password) {
    errors.password = "Please enter your password.";
    isValid = false;
  }

  setFormErrors(errors);
  if(isValid){
  const data= {
        email:email,
        password:password
      }
      const res =await handleLoginContext(data);
      if(res?.data == "Email Not Found! Please Register") {
            setOpenEmailNotFoundDialog(true);
      } else if(res?.data == "Password Wrong") {
            setOpenInvalidCredentialsDialog(true);
      } else {
           if(res?.data) localStorage.accessToken = res?.data?.accessToken;
           navigate('/');
      }
    }
}

  return (
    <>
      <div className='login_main' style={{display:'grid',gridTemplateColumns:width ? '100%' : '60% 40%',position:'relative'}}>
        {width ? <></>: <div className='login_submain image-bg'>
        </div> }
        <div className='login_submain' style={{backgroundColor:'#ffffff',width:'100%'}}>
            <div className='login_details' style={{width:width510?'80%':'428px',paddingTop:'50px',paddingBottom:'50px'}}>
                <div className='image-hype-main'>
                     <img src={hypervise_blue} alt='hypervise' style={{width:'156.42px',height:'39.94px',marginLeft:'8.88px',marginTop:'7.77px'}} className='image-hype' loading='lazy'/>
                </div>
                <div className='head'>
                    <span style={{fontSize:'36px',fontWeight:'bold',lineHeight:'44px',letterSpacing:'-1%',color:'#101623'}}>Hi There!</span>
                    <span style={{fontSize:'18px',fontWeight:'600',lineHeight:'24px',color:'#101623'}}>Welcome Back To Hypervise Dashboard</span>
                </div>
                <form className='form' onSubmit={login}>
                    <div className='field'>
                        <p style={{color:'#3b4453',fontSize:'14px',fontWeight:'600',lineHeight:'20px',letterSpacing:'1%'}}>Email</p>
                        <input style={{backgroundColor:'#f4f5f6'}} type='text' placeholder='Enter your mail' className='input' value={email} 
                        onChange={(e) => setEmail(e.target.value)}/>
                        {formErrors.email ? <p style={{color:'red'}}>{formErrors.email}</p> : <></> }
                    </div>
                    <div className='field' style={{position:'relative'}}>
                        <p style={{color:'#3b4453',fontSize:'14px',fontWeight:'600',lineHeight:'20px',letterSpacing:'1%'}}>Password</p>
                        <input style={{backgroundColor:'#f4f5f6'}} placeholder='Enter your password' type={passwordVisible ? 'text' : 'password'} className='input' value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                        {formErrors.password ? <p style={{color:'red'}}>{formErrors.password}</p> : <></>}
                        <span className='icon'
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: formErrors.password ? '53%' : '74%',
                                transform: 'translateY(-60%)',
                                cursor: 'pointer',
                                color: '#3b4453',
                                fontWeight: 'bold' 
                            }}
                            onClick={toggleVisibility}
                            >
                            {passwordVisible ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon /> }
                        </span>
                    </div>
                    <div className='foot'>
                   <div style={{display:'flex',fontSize:'16px',flexDirection:'row',gap:'6px',width:'136px',height:'22px',color:'#3b4453',lineHeight:'22px',alignItems:'center',fontWeight:'400'}}><input type='checkbox' checked={checked} style={{ width:'20px',height:'20px', boxShadow: 'none'}}   onChange={handleCheckboxChange}/>Remember me</div> 
                    <p style={{fontSize:'16px',color:'#101623',fontWeight:'600',lineHeight:'22px'}}>Forgot password?</p>
                </div>
                    <button className='btn' type='submit' >Log in</button>
                </form>
                
            </div>
        </div>
       </div>
      
      <Dialog open={openInvalidCredentialsDialog} onClose={() => setOpenInvalidCredentialsDialog(false)}  
        PaperProps={{
        style: {
          background:  '#ffffff' ,
        },
      }}>
          <DialogTitle sx={{color:'#FF5630',fontWeight:'600'}}>Invalid Credentials</DialogTitle>
          <DialogContent>
            <Typography sx={{color:'#101623'}}>Invalid credentials. Please try again.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenInvalidCredentialsDialog(false)} color="primary" sx={{fontWeight:'bold'}} variant='contained'>
              OK
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for "Email not found" */}
        <Dialog open={openEmailNotFoundDialog} onClose={() => setOpenEmailNotFoundDialog(false)}
         PaperProps={{
          style: {
            background:  '#ffffff' ,
          },
        }} >
          <DialogTitle sx={{color:'#FF5630',fontWeight:'600'}}>Email not found</DialogTitle>
          <DialogContent>
            <Typography sx={{color:'#101623'}}>The provided email address was not found. Please check your email or sign up for an account.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEmailNotFoundDialog(false)} color="primary" sx={{fontWeight:'bold'}} variant='contained'>
              OK
            </Button>
          </DialogActions>
        </Dialog>
    </>
    
  )
}
