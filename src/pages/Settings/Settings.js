import React,{useEffect, useMemo,useContext, useState} from 'react'
import '../Dashboard/Dashboard.css';
import '../Reports/Reports.css';
import './Settings.css';
import Appbar from '../../components/Appbar/Appbar';
import axios from 'axios';
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner';
import Cross1 from '../../images/Cross1.svg';
import {Tooltip} from '@mui/material';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {Dialog,DialogTitle,DialogContent,DialogActions} from '@mui/material';
import { Typography  } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utils/Auth.context';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import Button from '@mui/material/Button';
import 'jspdf-autotable'
import taco from '../../images/dashboard.png'
import {
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import { Image, Space, Switch } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { getAllPartsCodes, updateByPass } from '../../API/api';


export default function Settings() {

    const [loader,setLoader] = useState(false)

    const { UserCredentials,handleLoginContext } = useContext(AuthContext);
    const navigate = useNavigate();
    const [openInvalidCredentialsDialog, setOpenInvalidCredentialsDialog] = useState(false);
    const [openEmailNotFoundDialog, setOpenEmailNotFoundDialog] = useState(false);  
    const [email,setEmail] = useState("")
    const [password,setPassword]= useState("")
    const [formErrors, setFormErrors] = useState({
      email: "",
      password: "",
    });
    if(UserCredentials) {
          if(UserCredentials[0]?.roles !== "admin") {
            console.log("usercred",UserCredentials);
                navigate('/');
          }
    }

      const [partsData, setPartsData] = useState(
        [
          {
            "part_id": '1',
            "part_code": '54667427AOYR',
            "part_name": 'Safari',
            "active_flag": 1,
          },
          {
            "part_id": '2',
            "part_code": '54667427AOYR',
            "part_name": 'Safari',
            "active_flag": 1
          },
          {
            "part_id": '3',
            "part_code": '54667427AOYR',
            "part_name": 'Safari',
            "active_flag": 1
          },
          {
            "part_id": '4',
            "part_code": '54667427AOYR',
            "part_name": 'Safari',
            "active_flag": 1
          },
          {
            "part_id": '5',
            "part_code": '54667427AOYR',
            "part_name": 'Safari',
            "active_flag": 1
          },
          {
            "part_id": '6',
            "part_code": '54667427AOYR',
            "part_name": 'Safari',
            "active_flag": 1
          },
          {
            "part_id": '7',
            "part_code": '54667427AOYR',
            "part_name": 'Safari',
            "active_flag": 1
          },
          {
            "part_id": '8',
            "part_code": '54667427AOYR',
            "part_name": 'Safari',
            "active_flag": 1
          },
      ]
      );
      const [passwordVisible, setPasswordVisible] = useState(false);
      const toggleVisibility = () => {
        setPasswordVisible(!passwordVisible);
      };  
      useEffect(() => {
              async function called(){
                const res = await getAllPartsCodes();
                if(res?.data) {
                  const value = (res?.data?.message)?.filter((item) => item?.active_flag !== 0);
                  console.log(value);
                  setPartsData(value);
                }
              }
              called()
      },[])



    const [dialog,setDialog] = useState(false)
    const [dialog1,setDialog1] = useState(true);
      const [searchTerm, setSearchTerm] = useState('');
      const filteredData = partsData?.filter((data) =>
        data?.part_code?.toLowerCase().includes(searchTerm?.toLowerCase()) || data?.part_name?.toLowerCase().includes(searchTerm?.toLowerCase())
      );

      const [defectPage, setDefectPage] = useState(0);

      const handleDefectPageChange = (newPage) => {
        setDefectPage(newPage);
      };

      const [goToNumber,setGoToNumber] = useState('')

      const pageValue = goToNumber ? parseInt(goToNumber) > Math.ceil(filteredData.length / 5) ? Math.ceil(filteredData.length / 5) - 1 : parseInt(goToNumber) < 1 ? 0 : parseInt(goToNumber)-1 : 0
  
      const handleSwitchChange = async (checked, index, data) => {
      
        const updatedData = [...partsData];
        console.log(updatedData)
        updatedData[index].active_flag = checked ? 1 : 0;
        setPartsData(updatedData);
        let value = checked == false ? -1 : 1;
        const result = await updateByPass({id:data?.part_id,activeFlag: value});
        const update = await getAllPartsCodes();
       // console.log(updatedData);
      };

      useEffect(() => {
        
        const checkAuthentication = () => {
            const expirationTime = localStorage.getItem('authExpiration1');
            
            if ( expirationTime && Date.now() < expirationTime) {
                
                setDialog1(false);
            } else {
               
                
               setDialog1(true);
            }
        };
    
        checkAuthentication();
    }, [navigate]);
    
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
        const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes from now
        localStorage.setItem('authExpiration1', expirationTime);
          setDialog1(false);
      }
    }
}


  return (
    <>
      <Appbar title="Dashboard" />
      <div className='dashboard_main' >
        <div className='dashboard_content_1'>
          <div className='title_date'>
            <div className='title-icon-overview' style={{marginTop:'39px'}}>
              <p className='dashboard_overview_head'>Configure Child Parts</p>
            </div>
          </div>
        </div>


        <div className='dashboard_content_1' style={{marginTop:'24px'}}>
          <div className='overview'>
            <div className='overview_head responsive_reports_head' style={{height:'40px'}}>
              {/* search bar (mui) */}
              <Paper
              component="form"
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 356,backgroundColor:'#f4f5f6',boxShadow:'none',height:40 }} className='reposnsive_search_bar'
              >
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                  <SearchIcon />
                </IconButton>
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search by Part Code, Part Name"
                  inputProps={{ 'aria-label': 'Search by Part Code, Part Name' }}
                  onChange={(e) =>{ setSearchTerm(e.target.value); setDefectPage(0);}}
                  value={searchTerm}
                />  
              </Paper>
            </div>
            <div className='overview-table-container' style={{marginTop:'32px'}}>
              <table className='table'>
                <thead>
                  <tr>
                  <th>Image</th>
                  <th>Part Code</th>
                    <th>Part Name</th>
                    <th>Inspect Part</th>
                  </tr>
                </thead>
                {loader ? (
                  <tbody>
                    <tr>
                      <td align="center" colSpan={9}>
                        <LoadSpinner height='100%' />
                      </td>
                    </tr>
                  </tbody>
                ) : filteredData?.length ? (
                  <>
                    <tbody>
                  <Image.PreviewGroup
                    preview={{
                      onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                    }}
                  >
                    {filteredData?.slice(defectPage * 5, (defectPage + 1) * 5).map((data, index) => {
                      return (
                        <tr key={index} className='tr-light'>
                        
                          <td>
                            <Image 
                              style={{borderRadius:'8px',flexGrow:'0',width:'80px',height:'80px',objectFit:'contain'}}
                              src={`http://${process.env.REACT_APP_IP_ADDRESS}:5000/partImages/${data?.part_code || 'unknown_part'}.png`}
                              alt='img'
                                  preview={{
                                    toolbarRender: (
                                    _,
                                    {
                                        transform: { scale },
                                        actions: { onFlipY, onFlipX, onRotateLeft, onRotateRight, onZoomOut, onZoomIn },
                                    },
                                    ) => (
                                    <Space size={12} className="toolbar-wrapper">
                                      <SwapOutlined rotate={90} onClick={onFlipY} />
                                      <SwapOutlined onClick={onFlipX} />
                                      <RotateLeftOutlined onClick={onRotateLeft} />
                                      <RotateRightOutlined onClick={onRotateRight} />
                                      <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                                      <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
                                    </Space>
                                    ),
                                }}
                            />
                          </td>
                          <td>{data?.part_code}</td>
                          <td>{data?.part_name}</td>
                          <td>
                            <Switch
                              checkedChildren={<CheckOutlined />}
                              unCheckedChildren={<CloseOutlined />}
                              checked={data?.active_flag === 1}
                              onChange={(checked) => handleSwitchChange(checked, ((data?.part_id)%3000) - 1,data)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </Image.PreviewGroup>

                    </tbody>
                    <tfoot>
                      <td colSpan={9} style={{padding:'0px'}}>
                        <div className='tfoot'>
                          <p style={{fontSize:'14px',fontWeight:'500',lineHeight:'20px',letterSpacing:'1%',color:'#A0A8B0'}}>Page {defectPage + 1} of {Math.ceil(filteredData.length / 5)}</p>
                          <div className='paginated_right'>
                            {defectPage === 0 ? <ChevronLeftIcon style={{ opacity: 0.2, cursor: 'not-allowed' }} /> : <ChevronLeftIcon onClick={() => handleDefectPageChange(defectPage - 1)} style={{ cursor: 'pointer',color:'#707784' }} />}
                            {Array.from({ length: Math.ceil(filteredData.length / 5) }).map((_, index) => {
                              // Calculate the start and end pages for the current group of 5 pages
                              const startPage = Math.floor(defectPage / 5) * 5; // Calculate the start page of the current group
                              const endPage = Math.min(startPage + 4, Math.ceil(filteredData.length / 5) - 1); // Calculate the end page of the current group
                              
                              // Render page numbers within the current group
                              if (index >= startPage && index <= endPage) {
                                return (
                                  <div className={index === defectPage ? 'pagenum' : 'pagenum1'} key={index} onClick={() => handleDefectPageChange(index)}>
                                    <p>{index + 1}</p>
                                  </div>
                                );
                              }
                              // Render null for page numbers outside the current group
                              return null;
                            })}
                            {defectPage + 1 === Math.ceil(filteredData.length / 5) ? <ChevronRightIcon style={{ opacity: 0.2, cursor: 'not-allowed' }} /> : <ChevronRightIcon onClick={() => handleDefectPageChange(defectPage + 1)} style={{ cursor: 'pointer',color:'#707784' }} />}
                            <p className='input_pagination_text'>Go to</p>
                            <form onSubmit={(event)=>{event.preventDefault(); setDefectPage(pageValue)}} >
                              <input type='number' className='input_pagination' value={goToNumber} onChange={(event)=> setGoToNumber(event.target.value)} />
                            </form>
                            <p className='input_pagination_text'>Page</p>
                          </div>
                        </div>
                      </td>
                    </tfoot>
                  </>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan={9}>
                        <h2 style={{textAlign:'center'}}>No Data</h2>
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
        <Dialog open={dialog1}
     PaperProps={{
      style: {
        background:  '#fff' ,
        padding:'24px',
        margin:'0px',
        borderRadius:'10px',
        boxShadow:' 0 4px 16px 0 rgba(0, 0, 0, 0.08)',
        border:'solid 1px #f4f5f6',
        width: '960px',
        height: '506px'
      },
    }}>



        <DialogTitle sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:'0px',margin:'0px 0px 14px 0px'}}>
            <div className='dialog_title_left'>
                <div className='dialog_title_box' style={{width:'8px'}}></div>
                <p className='dialog_title_text' style={{fontFamily:'Inter', color:'#101623'}}>Enter Your Credential</p>
            </div>
            <div className='dialog_title_right' onClick={()=> navigate('/')} style={{cursor:'pointer'}}>
                <img src={Cross1} alt='cross1' />
            </div>
        </DialogTitle>



        <DialogContent sx={{padding:'0px',margin:'0px'}}>
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
                    </div>
                    <button className='btn' type='submit' >Enter</button>
                </form>
           
        </DialogContent>


     
    </Dialog>
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
      </div> 
    </>
  )
}