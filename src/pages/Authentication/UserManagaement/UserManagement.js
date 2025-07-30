import React, { useEffect, useState } from 'react'
import Appbar from '../../../components/Appbar/Appbar'
import './UserManagement.css'
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Add from '../../../images/Plus.svg';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material';
import LoadSpinner from '../../../components/LoadSpinner/LoadSpinner';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {Dialog,DialogTitle,DialogContent,DialogActions} from '@mui/material';
import Cross1 from '../../../images/Cross1.svg';
import { Select } from 'antd';
import ok from '../../../images/ok.svg'
import ng from '../../../images/ng.svg'
import { getAllUsers, handleDeleteUser, handleRegister } from '../../../API/api';
import Delete_Icon from '../../../images/Trash.svg';

export default function UserManagement() {

    const navigate = useNavigate()

    const [loader,setLoader] = useState(false)

    const [userData,setUserData] = useState([
        {
            "ID" : 1,
            "Email": 'supriya@eternalrobotics.com',
            "Role": "Admin",
            "Access": [
                "Add","Remove","Modify","Read"
            ]
        },
        {
            "ID" : 2,
            "Email": 'yaswanth@eternalrobotics.com',
            "Role": "SuperAdmin",
            "Access": [
                "Add","Remove","Modify","Read"
            ]
        },
        {
            "ID" : 3,
            "Email": 'bharath@eternalrobotics.com',
            "Role": "Operator",
            "Access": [
                "Read"
            ]
        },
        {
            "ID" : 1,
            "Email": 'supriya@eternalrobotics.com',
            "Role": "Admin",
            "Access": [
                "Add","Remove","Modify","Read"
            ]
        },
        {
            "ID" : 2,
            "Email": 'yaswanth@eternalrobotics.com',
            "Role": "SuperAdmin",
            "Access": [
                "Add","Remove","Modify","Read"
            ]
        },
        {
            "ID" : 3,
            "Email": 'bharath@eternalrobotics.com',
            "Role": "Operator",
            "Access": [
                "Read"
            ]
        },
        {
            "ID" : 1,
            "Email": 'supriya@eternalrobotics.com',
            "Role": "Admin",
            "Access": [
                "Add","Remove","Modify","Read"
            ]
        },
        {
            "ID" : 2,
            "Email": 'yaswanth@eternalrobotics.com',
            "Role": "SuperAdmin",
            "Access": [
                "Add","Remove","Modify","Read"
            ]
        },
        {
            "ID" : 3,
            "Email": 'bharath@eternalrobotics.com',
            "Role": "Operator",
            "Access": [
                "Read"
            ]
        }
    ])

    const [usersPage, setUsersPage] = useState(0);
    const handleUsersPageChange = (newPage) => {
      setUsersPage(newPage);
    };

    const [searchTerm, setSearchTerm] = useState('');
    const filteredData = userData?.filter((data) =>
      data?.email?.toLowerCase().includes(searchTerm?.toLowerCase()) || data?.roles?.toLowerCase().includes(searchTerm?.toLowerCase())
    );
    useEffect(() => {
                    async function called() {
                        const res = await getAllUsers();
                        if(res?.data?.message){
                            setUserData(res?.data?.message);
                        }
                    }
                    called();   
    },[]);

    const handleDelete =async (data) => {
                const res_1 = await handleDeleteUser(data);
                const res = await getAllUsers();
                if(res?.data?.message){
                    setUserData(res?.data?.message);
                }
    }
    const [dialog,setDialog] = useState(false)

    const [newUsers, setNewUsers] = useState([
        {name:'', mail: '', password: '', role: '',department: '' }
    ]);

    const handleMailChange = (index, event) => {
        const updatedUsers = [...newUsers];
        updatedUsers[index].mail = event.target.value;
        setNewUsers(updatedUsers);
    };

    const handleDepartmentChange = (index, event) => {
        const updatedUsers = [...newUsers];
        updatedUsers[index].department = event.target.value;
        setNewUsers(updatedUsers);
    };

    const handleNameChange = (index, event) => {
        const updatedUsers = [...newUsers];
        updatedUsers[index].name = event.target.value;
        setNewUsers(updatedUsers);
    };

    const handlePasswordChange = (index, event) => {
        const updatedUsers = [...newUsers];
        updatedUsers[index].password = event.target.value;
        setNewUsers(updatedUsers);
    };

    const handleRoleChange = (index, newRole) => {
        const updatedUsers = [...newUsers];
        updatedUsers[index].role = newRole;
        setNewUsers(updatedUsers);
    };

    const handleAddUserField = () => {
        setNewUsers([...newUsers, {name:'', mail: '', password: '', role: '',department: '' }]);
    };

    const handleRemoveUserField = (index) => {
        const updatedUsers = [...newUsers];
        updatedUsers.splice(index, 1);
        setNewUsers(updatedUsers);
    };

    const handleCancelDialog = () => {
        setDialog(false);
        setNewUsers([ {name:'', mail: '', password: '', role: '',department: '' }]);
    };

    const handleSubmitDialog = async () => {
        console.log(newUsers);
        const res = await handleRegister(newUsers[0]);

        setDialog(false);
        const res1 = await getAllUsers();
        if(res1?.data?.message) {
            setUserData(res1?.data?.message);
        }
        // Reset the new users state after submission
        setNewUsers([ {name:'', mail: '', password: '', role: '',department: '' }]);
    };

      const roles = ["admin","user"]

      // Define permissions for each role
        const rolePermissions = {
            "Admin": {
            add: true,
            remove: true,
            modify: false,
            read: true
            },
            "Super Admin": {
            add: true,
            remove: true,
            modify: true,
            read: true
            },
            "Operator": {
            add: false,
            remove: false,
            modify: false,
            read: true
            }
        };

      const [permissionDialog,setPermissionDialog] = useState(false)

      const [roleValue, setRoleValue] = useState('Super Admin');

    const handleRoleValueChange = (newRole) => {
        setRoleValue(newRole);
    };

      // Access settings based on selected role
    const accessSettings = rolePermissions[roleValue];
     
    

  return (
    <>
        <Appbar title="Dashboard" />
        <div className='user_main'>
            <div>
                <div className='user_head_main_box'>
                    <div className='user_head_box'>
                        <Tooltip title='Back to Overview'>
                            <HomeIcon onClick={ () => navigate('/')} style={{cursor:'pointer'}}/>
                        </Tooltip>
                        <NavigateNextIcon />
                        <p className='user_head_text'>User management</p>
                    </div>
                    <div className='user_head_right_box'>

                        {/* search bar (mui) */}
                        <Paper
                            component="form"
                            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 346,backgroundColor:'#fff',height:40 ,borderRadius:'6px',boxShadow:'none'}}
                            >
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Search by Mail ID, User Role"
                                inputProps={{ 'aria-label': 'Search by Email, Role' }}
                                onChange={(e) => {setSearchTerm(e.target.value); setUsersPage(0);}}
                                value={searchTerm}
                            />  
                            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                                <SearchIcon />
                            </IconButton>
                        </Paper>

                        <button className='configure_add_models_button' onClick={()=>setDialog(true)}>
                            <img src={Add} alt='addparts' />
                            <p>Add User</p>
                        </button>

                    </div>
                </div>

                <div className='user_list_table_container'>
                    <p className='user_list_table_head_text'>Users</p>
                    <table className='user_list_table'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Mail ID</th>
                                <th>User Role</th>
                                <th>Department</th>
                                <th>Operations</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        {loader ? 
                            (
                                <tbody>
                                    <tr>
                                        <td align="center" colSpan={4}>
                                            <LoadSpinner height='100%' />
                                        </td>
                                    </tr>
                                </tbody>
                            ) : filteredData?.length ? 
                            (
                                <>
                                    <tbody className='user_list_sub_table'>
                                        {filteredData?.slice(usersPage * 5, (usersPage + 1) * 5).map((data, index) => {
                                            return (
                                            <tr key={index} className='user_list_sub_table_tr'>
                                                <td>{index+1}</td>
                                                <td>{data?.name}</td>
                                                <td>{data?.email}</td>
                                                <td style={{color:'#395DAB',fontWeight:'600',cursor:'pointer'}} >{data?.roles == "admin" ? "Admin" : "User"}</td>
                                                <td>{data?.department}</td>
                                                <td className='user_list_sub_table_access'>{data?.roles == "admin" ?
                                                      ( <> <div className='user_list_sub_table_icon_text'>
                                                            <AddCircleOutlineIcon sx={{color:'#85939d'}}/>
                                                            <p key={index}>Add</p>
                                                        </div>
                                                        <div className='user_list_sub_table_icon_text'>
                                                            <HighlightOffIcon sx={{color:'#85939d'}}/>
                                                            <p key={index}>Remove</p>
                                                        </div> 
                                                        <div className='user_list_sub_table_icon_text'>
                                                            <SettingsIcon sx={{color:'#85939d'}}/>
                                                            <p key={index}>Modify</p>
                                                        </div> 
                                                        <div className='user_list_sub_table_icon_text'>
                                                            <VisibilityIcon sx={{color:'#85939d'}}/>
                                                            <p key={index}>Read</p>
                                                        </div>  </>) :  ( <div className='user_list_sub_table_icon_text'>
                                                            <VisibilityIcon sx={{color:'#85939d'}}/>
                                                            <p key={index}>Read</p>
                                                        </div> )                                                       
                                                    }</td>

                                                    <td onClick={() => handleDelete({email: data?.email})}><img src={Delete_Icon} alt='delete_icon' /></td>
                                                   
                                            </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot>
                                        <td colSpan={6} style={{padding:'0px'}}>
                                            <div className='tfoot'>
                                            <p style={{fontSize:'14px',fontWeight:'500',lineHeight:'20px',letterSpacing:'1%',color:'#A0A8B0'}}>Page {usersPage + 1} of {Math.ceil(filteredData.length / 5)}</p>
                                            <div className='paginated_right'>
                                                {usersPage === 0 ? <ChevronLeftIcon style={{ opacity: 0.2, cursor: 'not-allowed' }} /> : <ChevronLeftIcon onClick={() => handleUsersPageChange(usersPage - 1)} style={{ cursor: 'pointer',color:'#707784' }} />}
                                                {Array.from({ length: Math.ceil(filteredData.length / 5) }).map((_, index) => {
                                                // Calculate the start and end pages for the current group of 5 pages
                                                const startPage = Math.floor(usersPage / 5) * 5; // Calculate the start page of the current group
                                                const endPage = Math.min(startPage + 4, Math.ceil(filteredData.length / 5) - 1); // Calculate the end page of the current group
                                                
                                                // Render page numbers within the current group
                                                if (index >= startPage && index <= endPage) {
                                                    return (
                                                    <div className={index === usersPage ? 'pagenum' : 'pagenum1'} key={index} onClick={() => handleUsersPageChange(index)}>
                                                        <p>{index + 1}</p>
                                                    </div>
                                                    );
                                                }
                                                // Render null for page numbers outside the current group
                                                return null;
                                                })}
                                                {usersPage + 1 === Math.ceil(filteredData.length / 5) ? <ChevronRightIcon style={{ opacity: 0.2, cursor: 'not-allowed' }} /> : <ChevronRightIcon onClick={() => handleUsersPageChange(usersPage + 1)} style={{ cursor: 'pointer',color:'#707784' }} />}
                                            </div>
                                            </div>
                                        </td>
                                    </tfoot>
                                </>
                            ) : 
                            (
                                <tbody>
                                    <tr>
                                    <td colSpan={6}>
                                        <h2 style={{textAlign:'center'}}>No Users</h2>
                                    </td>
                                    </tr>
                                </tbody>
                            )}
                    </table>
                </div>
            </div>
        </div>

        

    {/* dialog box for adding users*/}

    <Dialog open={dialog}
     PaperProps={{
      style: {
        background:  '#fff' ,
        padding:'24px',
        margin:'0px',
        borderRadius:'10px',
        boxShadow:' 0 4px 16px 0 rgba(0, 0, 0, 0.08)',
        border:'solid 1px #f4f5f6',
        width: '960px',
        height: '635px'
      },
    }}>



        <DialogTitle sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:'0px',margin:'0px 0px 14px 0px'}}>
            <div className='dialog_title_left'>
                <div className='dialog_title_box' style={{width:'8px'}}></div>
                <p className='dialog_title_text' style={{fontFamily:'Inter', color:'#101623'}}>Add User</p>
            </div>
            <div className='dialog_title_right' onClick={()=> setDialog(false)} style={{cursor:'pointer'}}>
                <img src={Cross1} alt='cross1' />
            </div>
        </DialogTitle>



        <DialogContent sx={{padding:'0px',margin:'0px'}}>
            <div className='dialog_line'></div> 

            <div className='configure_dialog_content_main' style={{margin:'16px 0px',gap:'16px'}}>
            {newUsers.map((user, index) => (
                <React.Fragment key={index}>
                     <div className='dialog_edit_input'>
                    <p className='dialog_edit_input_text'>Name</p>
                    <input type='text' className='dialog_edit_input_field' value={user.name} onChange={(e) => handleNameChange(index, e)} />
                </div>
                <div className='dialog_edit_input'>
                    <p className='dialog_edit_input_text'>Mail ID</p>
                    <input type='text' className='dialog_edit_input_field' value={user.mail} onChange={(e) => handleMailChange(index, e)} />
                </div>
                <div className='dialog_edit_input'>
                    <p className='dialog_edit_input_text'>Password</p>
                    <input type='text' className='dialog_edit_input_field' value={user.password} onChange={(e) => handlePasswordChange(index, e)} />
                </div>
            
                <div className="dialog_edit_input">
                    <div className='dialog_edit_input_permission_list' >
                        <p className="dialog_edit_input_text">User Role</p>
                        {/* <p className="dialog_edit_input_permission_text" onClick={() => setPermissionDialog(true)} style={{cursor:'pointer'}}>View User Permission</p> */}
                    </div>
                    <Select
                        mode="single"
                        showSearch
                        allowClear
                        placeholder="Search by User Role"
                        value={user.role}
                        onChange={(newRole) => handleRoleChange(index, newRole)}
                        style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '8px',
                        border: 'solid 1px #D3D6DA',
                        backgroundColor: '#fff',
                        fontFamily: 'Inter',
                        fontSize: '16px',
                        fontWeight: 'normal',
                        fontStretch: 'normal',
                        fontStyle: 'normal',
                        lineHeight: '1.38',
                        letterSpacing: 'normal',
                        textAlign: 'left',
                        color: '#232B39',
                        height:'48px'
                        }}
                        options={roles?.map((item) => ({
                            value: item,
                            label: item == "admin" ? "Admin" : "User",
                        }))}
                        dropdownStyle={{ zIndex: 1300 }}
                        notFoundContent={null}
                    />
                    {newUsers.length > 1 && (
                        <div className="dialog_edit_input" style={{ cursor: 'pointer', marginTop: '10px' }}>
                            <p className="dialog_edit_input_add_part" onClick={() => handleRemoveUserField(index)} style={{ color: '#FF5630' }}>
                                - Remove User
                            </p>
                        </div>
                    )}
                </div>
                <div className='dialog_edit_input'>
                    <p className='dialog_edit_input_text'>Department</p>
                    <input type='text' className='dialog_edit_input_field' value={user.department} onChange={(e) => handleDepartmentChange(index, e)} />
                </div>
                </React.Fragment>
            ))}
            
                {/* <div className="dialog_edit_input" style={{cursor:'pointer'}}>
                    <p className="dialog_edit_input_add_part" onClick={handleAddUserField}>
                        + Add Another User
                    </p>
                </div> */}
            </div> 


        </DialogContent>


      <DialogActions sx={{padding:'0px', display:'flex',flexDirection:'row',gap:'12px',margin:'0px'}}>

        <button onClick={handleCancelDialog} style={{margin:'0px' }} type='button' className='config_cancel_button' >
            Cancel
        </button>

        <button onClick={handleSubmitDialog} style={{margin:'0px', pointerEvents: newUsers.some(user => !user.mail || !user.password || !user.role) && 'none', backgroundColor : newUsers.some(user => !user.mail || !user.password || !user.role) ? '#e5e7eb' : '#395dab' , color: newUsers.some(user => !user.mail || !user.password || !user.role) ? '#101623' : '#fff' }} type='button' className='config_submit_button' >
            Save Users
        </button>

      </DialogActions>

    </Dialog>

    {/* dialog box for adding users */}



     {/* dialog box for viewing permissions*/}

     <Dialog open={permissionDialog}
     PaperProps={{
      style: {
        background:  '#fff' ,
        padding:'24px',
        margin:'0px',
        borderRadius:'10px',
        boxShadow:' 0 4px 16px 0 rgba(0, 0, 0, 0.08)',
        border:'solid 1px #f4f5f6',
        width: '960px',
        height: '545px'
      },
    }}>



        <DialogTitle sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:'0px',margin:'0px 0px 14px 0px'}}>
            <div className='dialog_title_left'>
                <div className='dialog_title_box' style={{width:'8px'}}></div>
                <p className='dialog_title_text' style={{fontFamily:'Inter', color:'#101623'}}>User Permissions</p>
            </div>
            <div className='dialog_title_right' onClick={()=> setPermissionDialog(false)} style={{cursor:'pointer'}}>
                <img src={Cross1} alt='cross1' />
            </div>
        </DialogTitle>



        <DialogContent sx={{padding:'0px',margin:'0px'}}>
            <div className='dialog_line'></div> 

            <Select
                mode="single"
                showSearch
                allowClear
                placeholder="Search by User Role"
                value={roleValue}
                onChange={(newRole) => handleRoleValueChange(newRole)}
                style={{
                width: '100%',
                padding: '8px',
                borderRadius: '8px',
                border: 'solid 1px #D3D6DA',
                backgroundColor: '#fff',
                fontFamily: 'Inter',
                fontSize: '16px',
                fontWeight: 'normal',
                fontStretch: 'normal',
                fontStyle: 'normal',
                lineHeight: '1.38',
                letterSpacing: 'normal',
                textAlign: 'left',
                color: '#232B39',
                height:'48px',
                marginTop:'24px'
                }}
                options={roles?.map((item) => ({
                    value: item,
                    label: item,
                }))}
                dropdownStyle={{ zIndex: 1300 }}
                notFoundContent={null}
            />

            <div className='dialog_settings_box'>
                <p className='dialog_settings_box_text'>Settings</p>
            </div>

            <div className='dialog_settings_items'>
                <div className='dialog_settings_item'>
                <p className='dialog_settings_item_text'>Add</p>
                {accessSettings.add ? <img src={ok} alt='ok' /> : <img src={ng} alt='ng'  />}
                </div>
                <div className='dialog_settings_item'>
                <p className='dialog_settings_item_text'>Remove</p>
                {accessSettings.remove ? <img src={ok} alt='ok' /> : <img src={ng} alt='ng'  />}
                </div>
                <div className='dialog_settings_item'>
                <p className='dialog_settings_item_text'>Modify</p>
                {accessSettings.modify ? <img src={ok} alt='ok' /> : <img src={ng} alt='ng' />}
                </div>
                <div className='dialog_settings_item'>
                <p className='dialog_settings_item_text'>Read</p>
                {accessSettings.read ? <img src={ok} alt='ok' /> : <img src={ng} alt='ng'  />}
                </div>
            </div>

        </DialogContent>


      <DialogActions sx={{padding:'0px', display:'flex',flexDirection:'row',gap:'12px',margin:'0px'}}>


        <button onClick={() => setPermissionDialog(false)} style={{margin:'0px',backgroundColor:'#395dab',color:'#fff' }} type='button' className='config_submit_button' >
            OK
        </button>

      </DialogActions>

    </Dialog>

    {/* dialog box for viewing permissions */}

    </>
  )
}
