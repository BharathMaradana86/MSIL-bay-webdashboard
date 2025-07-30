import React,{useContext, useState} from 'react'
import {Tooltip} from '@mui/material';
import './Appbar.css';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import suzuki from '../../images/suzuki1.png';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Logout from '@mui/icons-material/Logout';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import hypervise_head_blue from '../../images/hypervise-blue.png';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { handleSignOut } from '../../API/api';
import { AuthContext } from '../../utils/Auth.context';

export default function Appbar() {
  const navigate = useNavigate();
  const { UserCredentials } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [dialog,setDialog] = useState(false)

  const logout =async () =>{
    const res = await handleSignOut([]);
    localStorage.clear();
    navigate('/Login');
  }

  return (
    <>
      <div className='nav' >            

        {/* <div style={{display:'flex',flexDirection:'row',gap:'93px'}}>  */}
        <img src={hypervise_head_blue} alt='hypervise' style={{height:'36px', width:'141px',cursor:'pointer',marginTop:'17px',marginLeft:'32px'}} onClick={()=>navigate('/')}/>

{/* 
            <Paper
              component="form"
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400,backgroundColor:'#f4f5f7',marginTop:'10px',marginBottom:'10px' }}
            >
              <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="What are you looking for"
                inputProps={{ 'aria-label': 'what are you looking for' }}
              />  
            </Paper>
          </div> */}

        {/* right-side components */}
        <div className='right-list-items'>
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2, borderRadius:0}}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
              >
                {/* large screen menu */}
                <div className='profile_main'>
                  <img src={suzuki} alt='suzuki' style={{backgroundColor:'#afadb1',borderRadius:'30px'}} />
                  <div className='profile_sub'>
                    <p style={{fontWeight:'bold',fontSize:'14px',color:'#101623',lineHeight:'20px',letterSpacing:'1%',textAlign:'left'}}>MSIL</p>
                    <p style={{fontSize:'12px',lineHeight:'16px',letterSpacing:'1%',color:'#A0A8B0'}}> {UserCredentials && UserCredentials[0] && UserCredentials[0]?.roles == "admin" ? "Admin" : "User"}
                    </p>
                  </div>
                  <ExpandMoreIcon style={{width:'24px',height:'24px',color:'#A0A8B0',marginLeft:'20px'}} />
                </div>

                {/* responsive menu */}
                <div className='responsive_profile_main'>
                  <img src={suzuki} alt='suzuki' style={{backgroundColor:'#afadb1',borderRadius:'30px'}} />
                  <p style={{fontWeight:'bold',fontSize:'14px',color:'#101623',lineHeight:'20px',letterSpacing:'1%',textAlign:'left'}}>MSIL</p>
                  <ExpandMoreIcon style={{width:'24px',height:'24px',color:'#A0A8B0'}} />
                </div>

              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={() => {
                  handleClose();
                }
              } sx={{color:'#232b39',fontSize:'16px',fontWeight:'500',lineHeight:'22px'}} className='responsive_menuitem'>
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small"  style={{color:'#232b39'}}/>
                </ListItemIcon>
               {UserCredentials && UserCredentials[0] && UserCredentials[0]?.roles == "admin" ? "Admin" : "User"}
              </MenuItem>
              <MenuItem onClick={() => {
                  navigate('/reset')
                }
              }  sx={{color:'#232b39',fontSize:'16px',fontWeight:'500',lineHeight:'22px'}}>
                Change Password
              </MenuItem>

             
              
              {/* <MenuItem onClick={() => {
                  setDialog(true);
                }
              } sx={{color:'#232b39',fontSize:'16px',fontWeight:'500',lineHeight:'22px'}}>
                Service Managaement
              </MenuItem> */}

            { UserCredentials && UserCredentials[0] && UserCredentials[0]?.roles == "admin" && ( <MenuItem onClick={() => {
                  navigate('/user')
                }
              } sx={{color:'#232b39',fontSize:'16px',fontWeight:'500',lineHeight:'22px'}}>
                <ListItemIcon>
                  <AccountCircleIcon fontSize="small"  style={{color:'#232b39'}}/>
                </ListItemIcon>
                User Portal
              </MenuItem>)}
              <MenuItem onClick={() => {
                  handleClose();
                  logout();
                }
              } sx={{color:'#FF5630',fontSize:'16px',fontWeight:'500',lineHeight:'22px'}}>
                <ListItemIcon>
                  <Logout fontSize="small"  style={{color:'#FF5630'}}/>
                </ListItemIcon>
                Signout
              </MenuItem>
            </Menu>
        </div> 
      </div>
    </>
  )
}
