import React from 'react'
import './ManagementServices.css'
import {Dialog,DialogTitle,DialogContent,DialogActions} from '@mui/material';
import Cross1 from '../../images/Cross1.svg';

export default function ManaagementServices({dialog,setDialog}) {

    const statusData = [
        { service: 'Frontend', status: 'Running' },
        { service: 'Backend', status: 'Down' },
        { service: 'Database', status: 'Running' },
        { service: 'CV', status: 'Down' },
        { service: 'Cameras', status: 'Down' },
        { service: 'PLC', status: 'Down' }
      ];

  return (
    <>
       {/* dialog box for viewing service status*/}

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
        height: '545px'
      },
    }}>



        <DialogTitle sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:'0px',margin:'0px 0px 14px 0px'}}>
            <div className='dialog_title_left'>
                <div className='dialog_title_box' style={{width:'8px'}}></div>
                <p className='dialog_title_text' style={{fontFamily:'Inter', color:'#101623'}}>Current Status</p>
            </div>
            <div className='dialog_title_right' onClick={()=> setDialog(false)} style={{cursor:'pointer'}}>
                <img src={Cross1} alt='cross1' />
            </div>
        </DialogTitle>



        <DialogContent sx={{padding:'0px',margin:'0px'}}>
            <div className='dialog_line'></div> 

            <div className='dialog_settings_box'>
                <p className='dialog_settings_box_text' style={{width:'50%'}}>Service</p>
                <p className='dialog_settings_box_text' style={{width:'50%'}}>Status</p>
            </div>

            <div className='dialog_settings_items'>
                {statusData?.map((data,index) => {
                  return (
                  <div className='dialog_settings_item' key={index}>
                    <p className='dialog_settings_item_text'>{data?.service}</p>
                    <p className='dialog_settings_item_text services_btn' style={{backgroundColor : data?.status == 'Running' ? 'rgba(215, 240, 229, 0.5)' : 'rgba(255, 221, 214, 0.5)',color: data?.status == 'Running'? '#36b37e' : '#ff5630'}}>{data?.status}</p>
                  </div>
                )})}
            </div>

        </DialogContent>


      <DialogActions sx={{padding:'0px', display:'flex',flexDirection:'row',gap:'12px',margin:'0px'}}>


        <button onClick={() => setDialog(false)} style={{margin:'0px',backgroundColor:'#395dab',color:'#fff' }} type='button' className='config_submit_button' >
            Restart All Services
        </button>

        <button onClick={() => setDialog(false)} style={{margin:'0px',backgroundColor:'#395dab',color:'#fff' }} type='button' className='config_submit_button' >
            OK
        </button>

      </DialogActions>

    </Dialog>

    {/* dialog box for viewing service status */}
    </>
  )
}
