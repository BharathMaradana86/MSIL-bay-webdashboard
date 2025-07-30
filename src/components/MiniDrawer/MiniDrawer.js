import React, { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import "./MiniDrawer.css";
import hypervise_head_blue from "../../images/hypervise-blue.png";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import InsightsIcon from "@mui/icons-material/Insights";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import axios from "axios";
import MobileMenu from "../MobileMenu/MobileMenu";
import Home_Blue from "../../images/home-blue.svg";
import Home_Black from "../../images/home-black.svg";
import Reports_Blue from "../../images/reports-blue.svg";
import Reports_Black from "../../images/reports-black.svg";
import Configure_Dark from "../../images/Configure_Dark.svg";
import Configure_Light from "../../images/Configure_Light.svg";
import { AiOutlineHeatMap } from "react-icons/ai";
import Analytics_Dark from "../../images/Analytics_Dark.svg";
import { VscFeedback } from "react-icons/vsc";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import Analytics_Light from "../../images/Analytics_Light.svg";
import { handleSignOut } from "../../API/api";
import { AuthContext } from "../../utils/Auth.context";
import Eye from "../../images/Eye_2.svg";
// import Eye_Black from "../../images/eye_black.svg";

function MiniDrawer() {
  const { UserCredentials } = useContext(AuthContext);
  const navigate = useNavigate();
  const innerWidth = window.innerWidth < 701;

  const [datacred, setDatacred] = React.useState();

  const logout = async () => {
    const res = await handleSignOut([]);
    localStorage.setItem("token", null);
    navigate("/Login");
    // const link = document.createElement('a');
    // link.href = '/login';
    // link.click();
  };

  return (
    <>
      {innerWidth && <MobileMenu />}

      {!innerWidth ? (
        <div className="minidrawer_div">
          <div className="list-element-parent">
            <div className="list-element" onClick={() => navigate("/")}>
              <img
                src={Home_Blue}
                alt="home"
                style={{ width: "24px", height: "24px" }}
                className="icon_light_blue"
              />
              <img
                src={Home_Black}
                alt="home"
                style={{ width: "24px", height: "24px" }}
                className="icon_light_black"
              />
              <p className="list-element-text">Overview</p>
            </div>
            {/* <div className='list-element' onClick={() => navigate('/analytics')}>
                <img src={Analytics_Dark} alt='home' style={{width:'24px',height:'24px'}} className='icon_light_blue' />
                <img src={Analytics_Light} alt='home' style={{width:'24px',height:'24px'}} className='icon_light_black' />
                <p className='list-element-text'>Analytics</p>
            </div> */}
            <div className="list-element" onClick={() => navigate("/reports")}>
              <img
                src={Reports_Blue}
                alt="home"
                style={{ width: "24px", height: "24px" }}
                className="icon_light_blue"
              />
              <img
                src={Reports_Black}
                alt="home"
                style={{ width: "24px", height: "24px" }}
                className="icon_light_black"
              />
              <p className="list-element-text">Reports</p>
            </div>
            <div
              className="list-element"
              onClick={() => navigate("/baymonitoring")}
            >
               {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon_light_blue">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 6c-4.09 0-7.585 2.488-9 6 1.415 3.512 4.91 6 9 6s7.584-2.488 9-6c-1.416-3.512-4.91-6-9-6zm0 10c-2.258 0-4.09-1.792-4.09-4S9.741 8 12 8s4.09 1.792 4.09 4-1.832 4-4.09 4zm0-6.4c-1.358 0-2.455 1.072-2.455 2.4 0 1.328 1.097 2.4 2.455 2.4s2.454-1.072 2.454-2.4c0-1.328-1.096-2.4-2.454-2.4z" fill="#A0A8B0"/>
              </svg> */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 6c-4.09 0-7.585 2.488-9 6 1.415 3.512 4.91 6 9 6s7.584-2.488 9-6c-1.416-3.512-4.91-6-9-6zm0 10c-2.258 0-4.09-1.792-4.09-4S9.741 8 12 8s4.09 1.792 4.09 4-1.832 4-4.09 4zm0-6.4c-1.358 0-2.455 1.072-2.455 2.4 0 1.328 1.097 2.4 2.455 2.4s2.454-1.072 2.454-2.4c0-1.328-1.096-2.4-2.454-2.4z" fill="#A0A8B0"/>
              </svg>
              <p className="list-element-text">Bay Monitoring</p>
            </div>
              <div
              className="list-element"
              onClick={() => navigate("/bayHeatMap")}
            >
               {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="icon_light_blue">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 6c-4.09 0-7.585 2.488-9 6 1.415 3.512 4.91 6 9 6s7.584-2.488 9-6c-1.416-3.512-4.91-6-9-6zm0 10c-2.258 0-4.09-1.792-4.09-4S9.741 8 12 8s4.09 1.792 4.09 4-1.832 4-4.09 4zm0-6.4c-1.358 0-2.455 1.072-2.455 2.4 0 1.328 1.097 2.4 2.455 2.4s2.454-1.072 2.454-2.4c0-1.328-1.096-2.4-2.454-2.4z" fill="#A0A8B0"/>
              </svg> */}
              <AiOutlineHeatMap />
              <p className="list-element-text">Live Bay Status</p>
            </div>
            <div
              className="list-element"
              onClick={() => navigate("/livestreaming")}
            >
              <img
                src={Configure_Dark}
                alt="home"
                style={{ width: "24px", height: "24px" }}
                className="icon_light_blue"
              />
              <img
                src={Configure_Light}
                alt="home"
                style={{ width: "24px", height: "24px" }}
                className="icon_light_black"
              />
              <p className="list-element-text">Live Streaming</p>
            </div>
            {/*             
            <div className='list-element' onClick={() => navigate('/Feedback')}>
                 <VscFeedback alt='home' style={{width:'24px',height:'24px'}}/>
                <p className='list-element-text'>Failed FeedBack</p>
            </div>
             */}
            {/* {UserCredentials && UserCredentials[0] && UserCredentials[0]?.roles == "admin" &&  (<div className='list-element' onClick={() => navigate('/configure')}>
                <img src={Configure_Dark} alt='home' style={{width:'24px',height:'24px'}} className='icon_light_blue' />
                <img src={Configure_Light} alt='home' style={{width:'24px',height:'24px'}} className='icon_light_black' />
                <p className='list-element-text'>Configure</p>
            </div>)} */}
            {/* <div className='list-element' onClick={() => navigate('/parts')}>
             
                <SettingsApplicationsIcon sx={{color:'#707784'}}/>
                <p className='list-element-text'>Parts</p>
            </div> */}
          </div>
          <div className="list-element-1" onClick={logout}>
            <LogoutIcon style={{ color: "#FF5630" }} />
            <p>Sign Out</p>
          </div>
        </div>
      ) : (
        <></>
      )}

      <Outlet />
    </>
  );
}

export default MiniDrawer;
