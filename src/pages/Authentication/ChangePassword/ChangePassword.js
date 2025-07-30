import React,{useContext, useState} from 'react'
import hypervise_blue from '../../../images/hypervise-blue.png'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import {Dialog,DialogTitle,DialogContent,DialogActions} from '@mui/material';
import { Typography  } from '@mui/material'
import Button from '@mui/material/Button';
import { handleChangePassword } from '../../../API/api';
import { AuthContext } from '../../../utils/Auth.context';

export default function ChangePassword() {
  const { UserCredentials } = useContext(AuthContext);
  const [checked, setChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
  };  
  const navigate = useNavigate()
   // localStorage.clear();


    const width = window.innerWidth <1000
    const width510 = window.innerWidth<530
    const [passwordVisible, setPasswordVisible] = useState(false);

  const toggleVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };


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
        newPassword:password
      }
     // console.log(UserCredentails);
      if(UserCredentials && UserCredentials[0]?.roles !== "admin" && UserCredentials[0]?.email !== email) {
                    setOpenEmailNotFoundDialog(true);
      } else {
      const res = await handleChangePassword(data);
      if(res?.data?.message == "Email Not Found") {
            setOpenEmailNotFoundDialog(true);
      } else {
      navigate('/');
      }
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
                    <span style={{fontSize:'18px',fontWeight:'600',lineHeight:'24px',color:'#101623'}}>Please Change your password</span>
                </div>
                <form className='form' onSubmit={login}>
                    <div className='field'>
                        <p style={{color:'#3b4453',fontSize:'14px',fontWeight:'600',lineHeight:'20px',letterSpacing:'1%'}}>Email</p>
                        <input style={{backgroundColor:'#f4f5f6'}} type='text' placeholder='Enter your mail' className='input' value={email} 
                        onChange={(e) => setEmail(e.target.value)}/>
                        {formErrors.email ? <p style={{color:'red'}}>{formErrors.email}</p> : <></> }
                    </div>
                    <div className='field' style={{position:'relative'}}>
                        <p style={{color:'#3b4453',fontSize:'14px',fontWeight:'600',lineHeight:'20px',letterSpacing:'1%'}}>New Password</p>
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

                    <button className='btn' type='submit' >Change Password</button>
                </form>
                
            </div>
        </div>
       </div>
      

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
