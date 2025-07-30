import React from 'react'
import './MobileMenu.css'
import HomeIcon from '@mui/icons-material/Home';
import InsightsIcon from '@mui/icons-material/Insights';
import SummarizeIcon from '@mui/icons-material/Summarize';
import {useNavigate} from 'react-router-dom';
import {Tooltip} from '@mui/material';


export default function MobileMenu() {
    const navigate = useNavigate();

  return (
      <div className='menu_container' style={{backgroundColor:'#3182CE'}}>
        <Tooltip title="Dashboard">
            <HomeIcon className='iconhead_1' fontSize='large' onClick={()=>navigate('/')} />
        </Tooltip>
        <Tooltip title="Analytics">
            <InsightsIcon className='iconhead_1' fontSize='large' onClick={()=>navigate('/analytics')} />
        </Tooltip>
        <Tooltip title="Reports">
            <SummarizeIcon className='iconhead_1' fontSize='large' onClick={()=>navigate('/reports')} />
        </Tooltip>
      </div>
  )
}
