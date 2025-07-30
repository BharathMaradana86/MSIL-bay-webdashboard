import React, { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";
import Appbar from "../../components/Appbar/Appbar";
import axios from "axios";
import RefreshIcon from "@mui/icons-material/Refresh";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
import { Tooltip } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { Image } from "antd";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import CallMadeIcon from "@mui/icons-material/CallMade";
import { FaHelmetSafety } from "react-icons/fa6";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Sort from "../../images/SortAscending.svg";
import { useNavigate } from "react-router-dom";
import SouthEastIcon from "@mui/icons-material/SouthEast";
import workInjury from "../../images/work-injury.png";
import warning from "../../images/warning (1).png";
import gloves from "../../images/image.png";
import trollyAdd from "../../images/trolly.png";
import {
  fetchDefectInspectedRecordWise,
  fetchDefectInspectionWise,
  fetchFailedInspectionWise,
  fetchInspectedRecordsWise,
  fetchRecordWise,
  fetchSuccessfulInspectedRecordWise,
  fetchUninspectedPartWise,
  getRecent5Events,
  getRecent5Events_1,
  resultMapping,
} from "../../API/api";

export default function Dashboard() {
  const notify = () => console.log("wow");

  const [loader, setLoader] = useState(false);
  const [dashboardALert, setDashboardAlert] = useState(false);

  const navigate = useNavigate();

  const [dashboardDate, setDashboardDate] = useState(
    localStorage.getItem("dashboardDate") ||
      new Date().toISOString().slice(0, 10)
  );

  const handleDashboardDate = (event) => {
    if (event.target.value) {
      setDashboardDate(event.target.value);
      localStorage.setItem("dashboardDate", event.target.value);
      setDefectPage(0);
      setFailedPage(0);
      setUninspectedPage(0);
    } else {
      setDashboardAlert(true);
    }
  };

  const handlePreviousDate = () => {
    if (dashboardDate) {
      const previousDate = new Date(dashboardDate); // Create a new Date object
      previousDate.setDate(previousDate.getDate() - 1); // Subtract one day
      // Format the date to yyyy-mm-dd
      const formattedDate = previousDate.toISOString().split("T")[0];

      setDashboardDate(formattedDate); // Set the state to the previous date
      // console.log(formattedDate);
      setDefectPage(0);
      setFailedPage(0);
      setUninspectedPage(0);
    }
  };

  const handleNextDate = () => {
    if (dashboardDate) {
      const nextDate = new Date(dashboardDate); // Create a new Date object
      nextDate.setDate(nextDate.getDate() + 1); // add one day
      // Format the date to yyyy-mm-dd
      const formattedDate = nextDate.toISOString().split("T")[0];

      setDashboardDate(formattedDate); // Set the state to the previous date
      // console.log(formattedDate);
      setDefectPage(0);
      setFailedPage(0);
      setUninspectedPage(0);
    }
  };

  const [totalvehicles, setTotalVehicles] = useState(600);
  const [vehiclesInspected, setVehiclesInspected] = useState(588);
  const [vehiclesUninspected, setVehiclesUninspected] = useState(2);
  const [vehiclePercent, setVehiclePercent] = useState(0);
  const [successfulInspections, setSuccessfulInspections] = useState(578);
  const [failedInspections, setFailedInspections] = useState(10);
  const [defects, setDefects] = useState(24);
  const [defectPer100, setDefectPer100] = useState(0);

  const refreshData = () => {
    alert("data generated");
  };

  const [failedData, setFailedData] = useState([
    {
      psn: 1260,
      model: "YHB23D2BP0600000",
      chassisno: "MA3BNC62SRC777834",
      partcount: 21,
      shift: "A",
      datetime: "10 Apr 2024, 10:38 AM",
      status: "Failed",
      action: "Details",
    },
    {
      psn: 1260,
      model: "YHB23D2BP0600000",
      chassisno: "MA3BNC62SRC777834",
      partcount: 21,
      shift: "A",
      datetime: "10 Apr 2024, 10:38 AM",
      status: "Failed",
      action: "Details",
    },
    {
      psn: 1260,
      model: "YHB23D2BP0600000",
      chassisno: "MA3BNC62SRC777834",
      partcount: 21,
      shift: "A",
      datetime: "10 Apr 2024, 10:38 AM",
      status: "Failed",
      action: "Details",
    },
    {
      psn: 1260,
      model: "YHB23D2BP0600000",
      chassisno: "MA3BNC62SRC777834",
      partcount: 21,
      shift: "A",
      datetime: "10 Apr 2024, 10:38 AM",
      status: "Failed",
      action: "Details",
    },
    {
      psn: 1260,
      model: "YHB23D2BP0600000",
      chassisno: "MA3BNC62SRC777834",
      partcount: 21,
      shift: "A",
      datetime: "10 Apr 2024, 10:38 AM",
      status: "Failed",
      action: "Details",
    },
    {
      psn: 1260,
      model: "YHB23D2BP0600000",
      chassisno: "MA3BNC62SRC777834",
      partcount: 21,
      shift: "A",
      datetime: "10 Apr 2024, 10:38 AM",
      status: "Failed",
    },
    {
      psn: 1260,
      model: "YHB23D2BP0600000",
      chassisno: "MA3BNC62SRC777834",
      partcount: 21,
      shift: "A",
      datetime: "10 Apr 2024, 10:38 AM",
      status: "Failed",
      action: "Details",
    },
  ]);

  const [defectsData, setDefectsData] = useState([
    {
      psn: 1260,
      model: "YHB23D2BP0600000",
      chassisno: "MA3BNC62SRC777834",
      partcode: "39105M77S00-5PK",
      shift: "A",
      datetime: "10 Apr 2024, 10:38 AM",
      status: "Missing",
      action: "Details",
    },
    {
      psn: 1260,
      model: "YHB23D2BP0600000",
      chassisno: "MA3BNC62SRC777834",
      partcode: "39105M77S00-5PK",
      shift: "A",
      datetime: "10 Apr 2024, 10:38 AM",
      status: "Incorrect",
      action: "Details",
    },
    {
      psn: 1260,
      model: "YHB23D2BP0600000",
      chassisno: "MA3BNC62SRC777834",
      partcode: "39105M77S00-5PK",
      shift: "A",
      datetime: "10 Apr 2024, 10:38 AM",
      status: "Flipped",
      action: "Details",
    },
    {
      psn: 1260,
      model: "YHB23D2BP0600000",
      chassisno: "MA3BNC62SRC777834",
      partcode: "39105M77S00-5PK",
      shift: "A",
      datetime: "10 Apr 2024, 10:38 AM",
      status: "Failed",
      action: "Details",
    },
    {
      psn: 1260,
      model: "YHB23D2BP0600000",
      chassisno: "MA3BNC62SRC777834",
      partcode: "39105M77S00-5PK",
      shift: "A",
      datetime: "10 Apr 2024, 10:38 AM",
      status: "Failed",
      action: "Details",
    },
    {
      psn: 1260,
      model: "YHB23D2BP0600000",
      chassisno: "MA3BNC62SRC777834",
      partcode: "39105M77S00-5PK",
      shift: "A",
      datetime: "10 Apr 2024, 10:38 AM",
      status: "Failed",
      action: "Details",
    },
    {
      psn: 1260,
      model: "YHB23D2BP0600000",
      chassisno: "MA3BNC62SRC777834",
      partcode: "39105M77S00-5PK",
      shift: "A",
      datetime: "10 Apr 2024, 10:38 AM",
      status: "Failed",
      action: "Details",
    },
    {
      psn: 1260,
      model: "YHB23D2BP0600000",
      chassisno: "MA3BNC62SRC777834",
      partcode: "39105M77S00-5PK",
      shift: "A",
      datetime: "10 Apr 2024, 10:38 AM",
      status: "Failed",
      action: "Details",
    },
    {
      psn: 1260,
      model: "YHB23D2BP0600000",
      chassisno: "MA3BNC62SRC777834",
      partcode: "39105M77S00-5PK",
      shift: "A",
      datetime: "10 Apr 2024, 10:38 AM",
      status: "Failed",
      action: "Details",
    },
    {
      psn: 1260,
      model: "YHB23D2BP0600000",
      chassisno: "MA3BNC62SRC777834",
      partcode: "39105M77S00-5PK",
      shift: "A",
      datetime: "10 Apr 2024, 10:38 AM",
      status: "Failed",
      action: "Details",
    },
    {
      psn: 1260,
      model: "YHB23D2BP0600000",
      chassisno: "MA3BNC62SRC777834",
      partcode: "39105M77S00-5PK",
      shift: "A",
      datetime: "10 Apr 2024, 10:38 AM",
      status: "Failed",
      action: "Details",
    },
    {
      psn: 1260,
      model: "YHB23D2BP0600000",
      chassisno: "MA3BNC62SRC777834",
      partcode: "39105M77S00-5PK",
      shift: "A",
      datetime: "10 Apr 2024, 10:38 AM",
      status: "Failed",
      action: "Details",
    },
  ]);

  const [uninspectedvehicles, setUninspectedData] = useState([
    {
      psn: 1260,
      model: "YHB23D2BP0600000",
      chassisno: "MA3BNC62SRC777834",
      partcode: "39105M77S00-5PK",
      shift: "A",
      datetime: "10 Apr 2024, 10:38 AM",
      status: "Failed",
      action: "Details",
    },
    {
      psn: 1260,
      model: "YHB23D2BP0600000",
      chassisno: "MA3BNC62SRC777834",
      partcode: "39105M77S00-5PK",
      shift: "A",
      datetime: "10 Apr 2024, 10:38 AM",
      status: "Failed",
      action: "Details",
    },
  ]);

  const [failedPage, setFailedPage] = useState(0);

  const handleFailedPageChange = (newPage) => {
    setFailedPage(newPage);
  };

  const [defectPage, setDefectPage] = useState(0);

  const handleDefectPageChange = (newPage) => {
    setDefectPage(newPage);
  };

  const [uninspectedPage, setUninspectedPage] = useState(0);

  const handleUninpspectedPageChange = (newPage) => {
    setUninspectedPage(newPage);
  };

  const [shift, setShift] = useState("All Shifts");
  const [selectedZone, setSelectedZone] = useState("F Zone");
  const [selectedCamera, setSelectedCamera] = useState("Camera1");
  const [peopleActionType, setPeopleActionType] = useState("Accident Scenerios");

  const zones = ["F Zone", "G Zone", "H Zone"];
  const cameras = ["Camera1", "Camera2", "Camera3"];

  // useEffect(() => {
  //             async function called(){
  //                       try {
  //                               let shiftFilter = ''
  //                               if(shift !== "All Shifts"){
  //                                 shiftFilter = shift;
  //                               }
  //                               const response = await fetchRecordWise({"selectedDate": dashboardDate,shift:shiftFilter});
  //                               if(response?.data){
  //                                 setTotalVehicles(response?.data?.result[0]?.total);
  //                               }
  //                               const response_1 = await fetchInspectedRecordsWise({"selectedDate": dashboardDate,shift:shiftFilter});
  //                               if(response_1?.data){
  //                                 setVehiclesInspected(response_1?.data?.result[0]?.total);
  //                                 setVehiclesUninspected(Math.abs((response_1?.data?.result[0]?.total) - (response?.data?.result[0]?.total)));
  //                               }
  //                               const response_2 = await fetchSuccessfulInspectedRecordWise({"selectedDate": dashboardDate,shift:shiftFilter});
  //                               if(response_2?.data){
  //                                 setSuccessfulInspections(response_2?.data?.result[0]?.total);
  //                                 setFailedInspections(Math.abs((response_1?.data?.result[0]?.total) - (response_2?.data?.result[0]?.total)));
  //                               }
  //                               const response_3 = await fetchDefectInspectedRecordWise({"selectedDate": dashboardDate,shift:shiftFilter});
  //                               if(response_3?.data){
  //                                 setDefects(response_3?.data?.result);
  //                                 if((response_1?.data?.result[0]?.total) !== 0)    setDefectPer100(((response_3?.data?.result)/((response_1?.data?.result[0]?.total))) * 100);
  //                                 else setDefectPer100(0);
  //                               }
  //                               const FailedInsectionsData = await fetchFailedInspectionWise({"selectedDate": dashboardDate,shift:shiftFilter});
  //                               if(FailedInsectionsData?.data?.result){
  //                                 setFailedData(FailedInsectionsData?.data?.result);
  //                               }

  //                               const DefectInsectionsData = await fetchDefectInspectionWise({"selectedDate": dashboardDate,shift:shiftFilter});
  //                               if(DefectInsectionsData?.data?.result){

  //               let updatedData = (DefectInsectionsData?.data?.result)?.filter((item) => (item?.Result !==1) );
  //               setDefectsData(updatedData);

  //                               }

  //                             if((response?.data?.result[0]?.total) !== 0)  setVehiclePercent(((response_1?.data?.result[0]?.total)/(response?.data?.result[0]?.total)) * 100);
  //                             else setVehiclePercent(0);

  //                       } catch (error) {

  //                       }finally{

  //                       }
  //             }

  //             called();
  // },[])
  const [rates, setRates] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
  const [recentEvent, setRecentEvent] = useState([]);
  const [ranges, setRanges] = useState([
    {
      title: "Total Incidents",
      icon: (
        <img
          src={warning}
          style={{
            width: "28.38px",
            height: "25px",
            color: "#ff7252",
          }}
        />
      ),
    },
    {
      title: "PPE Cap Missing",
      icon: (
        <FaHelmetSafety
          style={{
            width: "28.38px",
            height: "25px",

            color: "#ff5630",
          }}
        />
      ),
    },

    {
      title: "PPE Gloves Missing",
      icon: (
        <img
          src={gloves}
          style={{
            width: "28.38px",
            height: "25px",
            color: "#ff5630",
          }}
        />
      ),
    },
    {
      title: "Scissor Lift Safety",
      icon: (
        <img
          src={trollyAdd}
          style={{
            width: "28.38px",
            height: "25px",
            color: "#ff5630",
          }}
        />
      ),
    },
    {
      title: "Accident Issues",
      icon: (
        <img
          src={workInjury}
          style={{
            width: "28.38px",
            height: "25px",
            color: "#ff5630",
          }}
        />
      ),
    },
    {
      title: "Bay Time Exceeded",
      icon: (
        <img
          src={workInjury}
          style={{
            width: "28.38px",
            height: "25px",
            color: "#ff5630",
          }}
        />
      ),
    },
    {
      title: "SOP Stopper",
      icon: (
        <img
          src={warning}
          style={{
            width: "28.38px",
            height: "25px",
            color: "#ff7252",
          }}
        />
      ),
    },
    {
      title: "Recent Incident",
      icon: (
        <img
          src={warning}
          style={{
            width: "28.38px",
            height: "25px",
            color: "#ff7252",
          }}
        />
      ),
      check: (
        <>
          <Image.PreviewGroup
            preview={{
              onChange: (current, prev) =>
                console.log(`current index: ${current}, prev index: ${prev}`),
            }}
          >
            <Image
              src={`http://${process.env.REACT_APP_IP_ADDRESS}:5000/images/${recentEvent[0]?.record_id}.jpg`}
              alt="image is loading..."
              style={{ width: "80px", height: "80px" }}
            />
          </Image.PreviewGroup>{" "}
          <p className="text-sm">
            Incident Type:{" "}
            {`${
              recentEvent
                ? recentEvent[0]?.title
                  ? recentEvent[0]?.title
                  : "Not Defined"
                : "Loading..."
            }`}
          </p>
          <p className="text-sm">
            Timestamp:{" "}
            {`${
              recentEvent
                ? recentEvent[0]?.timestamp
                  ? recentEvent[0]?.timestamp
                  : "Not Defined"
                : "Loading..."
            }`}
          </p>
        </>
      ),
    },
  ]);

  const [recentIncidents, setRecentIncidents] = useState([]);

  useEffect(() => {
    async function called() {
      try {
        let shiftFilter = "";
        if (shift !== "All Shifts") {
          shiftFilter = shift;
        }
        const response = await fetchRecordWise({
          selectedDate: dashboardDate,
          shift: shiftFilter,
          zone: selectedZone,
          camera: selectedCamera,
        });
        console.log(dashboardDate, shift, response);
        if (response?.data) {
          // here from backend recordWise endpoint will be comming where we need to map the data and store in ranges values according to the title matching
          const result = response?.data?.result;
          let total = 0;
          const updatedRanges = ranges.map((range, index) => {
            const matchingData = result.find(
              (item) => item.title == range.title
            );

            return {
              ...range,
              count: matchingData ? matchingData.count : 0,
            };
          });

          setRanges(updatedRanges);
          setRecentIncidents(response?.data?.recordWise);
          notify();
        }
        // const response_1 = await fetchInspectedRecordsWise({
        //   selectedDate: dashboardDate,
        //   shift: shiftFilter,
        // });
      } catch (error) {
      } finally {
      }
    }

    called();
  }, [dashboardDate, shift, selectedZone, selectedCamera]);

  const [sort, setSort] = useState(false);
  const handleSortClick = () => {
    setSort((prevSort) => !prevSort);
  };
  const [sortType, setSortType] = useState("Descending");
  const handleSorting = (type) => {
    setSortType(type);
  };

  const [sort_1, setSort_1] = useState(false);
  const handleSortClick_1 = () => {
    setSort_1((prevSort) => !prevSort);
  };
  const [sortType_1, setSortType_1] = useState("Descending");
  const handleSorting_1 = (type) => {
    setSortType_1(type);
  };
  const [sortType_2, setSortType_2] = useState("Descending");
  const handleSorting_2 = (type) => {
    setSortType_2(type);
  };
  const sortData = (data, sortType) => {
    return data;
  };
  const sortedFailedData = useMemo(
    () => sortData(recentIncidents, sortType_1),
    [recentIncidents, sortType_1]
  );

  const sortedDefectsData = useMemo(
    () => sortData(defectsData, sortType),
    [defectsData, sortType]
  );
  const sortedUninspectedData = useMemo(
    () => sortData(uninspectedvehicles, sortType_2),
    [uninspectedvehicles, sortType_2]
  );
  const [searchTerm, setSearchTerm] = useState("");
  const filteredData = sortedFailedData?.filter(
    (data) =>
      data?.IncidentType?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      data?.shift?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const [searchTerm_1, setSearchTerm_1] = useState("");
  const filteredData_1 = sortedDefectsData?.filter(
    (data) =>
      data?.PSN?.toLowerCase().includes(searchTerm_1?.toLowerCase()) ||
      data?.Model?.toLowerCase().includes(searchTerm_1?.toLowerCase()) ||
      data?.ChassisNumber?.toLowerCase().includes(searchTerm_1?.toLowerCase())
  );

  const [searchTerm_2, setSearchTerm_2] = useState("");
  const filteredData_2 = sortedUninspectedData?.filter(
    (data) =>
      data?.PSN?.toLowerCase().includes(searchTerm_1?.toLowerCase()) ||
      data?.Model?.toLowerCase().includes(searchTerm_1?.toLowerCase()) ||
      data?.ChassisNumber?.toLowerCase().includes(searchTerm_1?.toLowerCase())
  );

  useEffect(() => {
    // setLoader(true);

    const intervalId = setInterval(async () => {
      try {
        const res = await getRecent5Events_1();
        console.log("res", res);

        if (res?.data?.message?.length) {
          const filterData = await Promise.all(
            res.data.message.map(async (item) => ({
              record_id: item?.record_id,
              title: item?.IncidentType,
              timestamp: item?.datetime
                ? new Date(item.datetime).toLocaleString()
                : new Date().toLocaleString(),
            }))
          );
          console.log("filterData", filterData);
          setRecentEvent(filterData); // no need to clear first
        } else {
          setRecentEvent([]);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoader(false);
      }
    }, 3000); // 10 second interval

    // Cleanup on unmount or dependency change
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <ToastContainer />
      <Appbar title="Dashboard" />
      <div className="dashboard_main">
        <div className="dashboard_content_1">
          <div className="title_date">
            <div className="title-icon-overview" style={{ marginTop: "39px" }}>
              <p className="dashboard_overview_head">Overview</p>
            </div>
            <div
              className="dashboard_date_filter"
              style={{ marginTop: "30px" }}
            >
              <KeyboardArrowLeftIcon
                style={{
                  color: "#3B4453",
                  width: "18px",
                  height: "18px",
                  cursor: "pointer",
                }}
                onClick={handlePreviousDate}
              />
              <input
                type="date"
                max={new Date().toISOString().slice(0, 10)}
                className="dashboard_date"
                value={dashboardDate}
                onChange={handleDashboardDate}
              />
              {dashboardDate == new Date().toISOString().slice(0, 10) ? (
                <KeyboardArrowRightIcon
                  style={{
                    width: "18px",
                    height: "18px",
                    opacity: 0.2,
                    cursor: "not-allowed",
                  }}
                />
              ) : (
                <KeyboardArrowRightIcon
                  style={{
                    color: "#3B4453",
                    width: "18px",
                    height: "18px",
                    cursor: "pointer",
                  }}
                  onClick={handleNextDate}
                />
              )}
              
              {/* Zone and Camera Filters - Inline with Date */}
              <div style={{ display: "flex", alignItems: "center", gap: "15px", marginLeft: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "500", color: "#707784" }}>Zone:</label>
                  <select
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value)}
                    style={{
                      padding: "6px 10px",
                      border: "1px solid #E4E7EB",
                      borderRadius: "4px",
                      fontSize: "12px",
                      backgroundColor: "#ffffff",
                      color: "#101623",
                      minWidth: "90px",
                      cursor: "pointer"
                    }}
                  >
                    {zones.map((zone, index) => (
                      <option key={index} value={zone}>{zone}</option>
                    ))}
                  </select>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "500", color: "#707784" }}>Camera:</label>
                  <select
                    value={selectedCamera}
                    onChange={(e) => setSelectedCamera(e.target.value)}
                    style={{
                      padding: "6px 10px",
                      border: "1px solid #E4E7EB",
                      borderRadius: "4px",
                      fontSize: "12px",
                      backgroundColor: "#ffffff",
                      color: "#101623",
                      minWidth: "90px",
                      cursor: "pointer"
                    }}
                  >
                    {cameras.map((camera, index) => (
                      <option key={index} value={camera}>{camera}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <Tooltip title="Reload">
                <div className="refresh_data" onClick={refreshData}>
                  <RefreshIcon />
                </div>
              </Tooltip>
            </div>
          </div>
          <div className="overview_shift">
            <div
              className={shift == "All Shifts" ? "all" : "overview_shift_wise"}
              onClick={() => {
                setShift("All Shifts");
                setDefectPage(0);
                setFailedPage(0);
                setUninspectedPage(0);
              }}
            >
              All Shifts
            </div>
            <div
              className={shift == "shiftA" ? "a" : "overview_shift_wise"}
              onClick={() => {
                setShift("shiftA");
                setDefectPage(0);
                setFailedPage(0);
                setUninspectedPage(0);
              }}
            >
              Shift A
            </div>
            <div
              className={shift == "shiftB" ? "b" : "overview_shift_wise"}
              onClick={() => {
                setShift("shiftB");
                setDefectPage(0);
                setFailedPage(0);
                setUninspectedPage(0);
              }}
            >
              Shift B
            </div>
          </div>

          {/* <div className="overview_shift">
            <div
              className={
                peopleActionType == "Accident Scenerios"
                  ? "all"
                  : "overview_shift_wise"
              }
              onClick={() => {
                setPeopleActionType("Accident Scenerios");
                setDefectPage(0);
                setFailedPage(0);
                setUninspectedPage(0);
              }}
              style={{ width: "150px" }}
            >
              Accident Scenerios
            </div>
            <div
              className={
                peopleActionType == "PPE Adherence"
                  ? "a"
                  : "overview_shift_wise"
              }
              onClick={() => {
                setPeopleActionType("PPE Adherence");
                setDefectPage(0);
                setFailedPage(0);
                setUninspectedPage(0);
              }}
              style={{ width: "150px" }}
            >
              PPE Adherence
            </div>
            <div
              className={
                peopleActionType == "Trolly Handling"
                  ? "b"
                  : "overview_shift_wise"
              }
              onClick={() => {
                setPeopleActionType("Trolly Handling");
                setDefectPage(0);
                setFailedPage(0);
                setUninspectedPage(0);
              }}
              style={{ width: "150px" }}
            >
              Trolly Handling
            </div>
            <div
              className={
                peopleActionType == "Person near Vehicle"
                  ? "c"
                  : "overview_shift_wise"
              }
              onClick={() => {
                setPeopleActionType("Person near Vehicle");
                setDefectPage(0);
                setFailedPage(0);
                setUninspectedPage(0);
              }}
              style={{ width: "190px" }}
            >
              Person near Vehicle
            </div>
          </div> */}
          {loader ? (
            <LoadSpinner height="100vh" />
          ) : (
            <div className="content-box">
              {ranges?.map((item, index) => {
                if (item?.title === "Recent Incident") {
                  return (
                    <div className="content">
                      <div className="overview_matter">
                        <div className="overview_sub_matter">
                          <p
                            style={{
                              fontSize: "14px",
                              lineHeight: "20px",
                              letterSpacing: "1%",
                              color: "#707784",
                            }}
                          >
                            {item?.title}
                          </p>
                          <p
                            style={{
                              color: "#101623",
                              height: "30px",
                              fontSize: "36px",
                              fontWeight: "bold",
                              lineHeight: "44px",
                              letterSpacing: "-1%",
                              wordBreak: "break-all",
                            }}
                          >
                            {item?.check ? item?.check : 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="content">
                    <div
                      className="icon_bg"
                      style={{ backgroundColor: "#ffeecc" }}
                    >
                      {item?.icon}
                    </div>
                    <div className="overview_matter">
                      <div className="overview_sub_matter">
                        <p
                          style={{
                            fontSize: "14px",
                            lineHeight: "20px",
                            letterSpacing: "1%",
                            color: "#707784",
                          }}
                        >
                          {item?.title}
                        </p>
                        <p
                          style={{
                            color: "#101623",
                            fontSize: "36px",
                            fontWeight: "bold",
                            lineHeight: "44px",
                            letterSpacing: "-1%",
                            wordBreak: "break-all",
                          }}
                        >
                          {item?.count ? item?.count : 0}
                        </p>
                      </div>
                      <p
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: "2px",
                          fontSize: "14px",
                          color: "#707784",
                          lineHeight: "20px",
                          letterSpacing: "1%",
                        }}
                      >
                        {rates[0] < 0 ? (
                          <SouthEastIcon
                            style={{ fontSize: "16px", color: "#FF5630" }}
                          />
                        ) : (
                          <CallMadeIcon
                            style={{ fontSize: "16px", color: "#36B37E" }}
                          />
                        )}
                        <span
                          style={{
                            color: rates[0] >= 0 ? "#36B37E" : "#FF5630",
                          }}
                        >
                          {rates && Math.abs(rates[0])}%
                        </span>{" "}
                        vs yesterday
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div
          className="dashboard_content_1"
          style={{
            width: "1200px",
            display: "flex",
            flexDirection: "row",
            gap: "20px",
          }}
        >
          <div className="overview" style={{ flex: 1 }}>
            <div
              className="overview_head"
              style={{ justifyContent: "flex-start" }}
            >
              <div className="overview_head_div"></div>
              <p className="overview_head_text">
                Recent Incidents ({filteredData?.length})
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0px",
                flexGrow: "0",
                marginTop: "24px",
              }}
            >
              {/* search bar (mui) */}
              <Paper
                component="form"
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: 346,
                  backgroundColor: "#f4f5f6",
                  boxShadow: "none",
                  height: 40,
                }}
              >
                <IconButton
                  type="button"
                  sx={{ p: "10px" }}
                  aria-label="search"
                >
                  <SearchIcon />
                </IconButton>
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Search by Incident Type"
                  inputProps={{ "aria-label": "Search by Incident Type" }}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setFailedPage(0);
                  }}
                  value={searchTerm}
                />
              </Paper>

              <div className="overview_search_sort">
                <div
                  className="overview_search_sort_inner"
                  onClick={handleSortClick_1}
                >
                  <p>Sort</p>
                  <img
                    src={Sort}
                    alt="sort"
                    style={{ width: "20px", height: "20px" }}
                  />
                </div>
                {sort_1 && (
                  <div className="sort_sub_div">
                    <p
                      onClick={() => {
                        handleSorting_1("Ascending");
                        handleSortClick_1();
                      }}
                      style={{ color: sortType_1 == "Ascending" && "#395DAB" }}
                    >
                      Sort Ascending(Time)
                    </p>
                    <p
                      onClick={() => {
                        handleSorting_1("Descending");
                        handleSortClick_1();
                      }}
                      style={{ color: sortType_1 == "Descending" && "#395DAB" }}
                    >
                      Sort Descending(Time)
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="overview-table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Incident Type</th>
                    {/* <th>PART COUNT</th> */}
                    <th>SHIFT</th>
                    <th>DATE & TIME</th>
                    <th>Camera</th>
                    <th>BAY ( Truck No )</th>
                    <th>Image</th>
                  </tr>
                </thead>
                {loader ? (
                  <tbody>
                    <tr>
                      <td align="center" colSpan={8}>
                        <LoadSpinner height="100%" />
                      </td>
                    </tr>
                  </tbody>
                ) : filteredData?.length ? (
                  <>
                    <tbody>
                      {filteredData
                        ?.slice(failedPage * 5, (failedPage + 1) * 5)
                        .map((data, index) => {
                          let count = failedPage * 5 + index + 1;
                          return (
                            <tr key={index} className="tr-light">
                              <td>{count}</td>
                              <td
                                style={{
                                  color: "#395DAB",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                }}
                              >
                                {data?.IncidentType == "Trolley SoP"
                                  ? "Scissor Lift Safety"
                                  : data?.IncidentType}
                              </td>
                              <td>{data?.shift}</td>
                              {/* <td>{((data?.PartTypes)?.split(','))?.length}</td> */}
                              {/* <td>{(data?.created_on)?.split('T')?.[0]} {(data?.created_on)?.split('T')?.[1]?.replace("Z","")}</td> */}
                              <td>
                                {data?.datetime &&
                                  (() => {
                                    // Parse the timestamp string into a Date object
                                    let timestamp = new Date(data.datetime);

                                    // Add 5 hours and 30 minutes to the timestamp
                                    timestamp.setHours(
                                      timestamp.getHours() + 5
                                    );
                                    timestamp.setMinutes(
                                      timestamp.getMinutes() + 30
                                    );

                                    // Format the adjusted timestamp into the desired format (YYYY-MM-DDTHH:mm:ss)
                                    let adjustedTimestamp =
                                      timestamp.toISOString();

                                    // Remove the ".00Z" at the end
                                    adjustedTimestamp = adjustedTimestamp.slice(
                                      0,
                                      -5
                                    );

                                    // Split the adjusted timestamp into date and time components
                                    let [date, time] =
                                      adjustedTimestamp.split("T");

                                    // Return the formatted date and time
                                    return `${date} ${time}`;
                                  })()}
                              </td>

                              <td>
                                <div className="overview_status">
                                  <p
                                    style={{
                                      fontWeight: "500",
                                      fontSize: "14px",
                                      lineHeight: "20px",
                                      letterSpacing: "1%",
                                    }}
                                  >
                                    {data?.cameraName}
                                  </p>
                                </div>
                              </td>
                              <td
                                style={{
                                  color: "#395DAB",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                }}
                              >
                                <Image.PreviewGroup
                                  preview={{
                                    onChange: (current, prev) =>
                                      console.log(
                                        `current index: ${current}, prev index: ${prev}`
                                      ),
                                  }}
                                >
                                  {/* <p>{`http://${process.env.REACT_APP_IP_ADDRESS}:5000/images/${data.recordId}.jpg`}</p> */}
                                  <Image
                                    src={`http://${process.env.REACT_APP_IP_ADDRESS}:5000/images/${data.recordId}.jpg`}
                                    alt="image is loading...."
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      borderRadius: "5px",
                                    }}
                                  />
                                </Image.PreviewGroup>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                    <tfoot>
                      <td colSpan={8} style={{ padding: "0px" }}>
                        <div className="tfoot">
                          <p
                            style={{
                              fontSize: "14px",
                              fontWeight: "500",
                              lineHeight: "20px",
                              letterSpacing: "1%",
                              color: "#A0A8B0",
                            }}
                          >
                            Page {failedPage + 1} of{" "}
                            {Math.ceil(filteredData.length / 5)}
                          </p>
                          <div className="paginated_right">
                            {failedPage === 0 ? (
                              <ChevronLeftIcon
                                style={{ opacity: 0.2, cursor: "not-allowed" }}
                              />
                            ) : (
                              <ChevronLeftIcon
                                onClick={() =>
                                  handleFailedPageChange(failedPage - 1)
                                }
                                style={{ cursor: "pointer", color: "#707784" }}
                              />
                            )}
                            {Array.from({
                              length: Math.ceil(filteredData.length / 5),
                            }).map((_, index) => {
                              // Calculate the start and end pages for the current group of 5 pages
                              const startPage = Math.floor(failedPage / 5) * 5; // Calculate the start page of the current group
                              const endPage = Math.min(
                                startPage + 4,
                                Math.ceil(filteredData.length / 5) - 1
                              ); // Calculate the end page of the current group

                              // Render page numbers within the current group
                              if (index >= startPage && index <= endPage) {
                                return (
                                  <div
                                    className={
                                      index === failedPage
                                        ? "pagenum"
                                        : "pagenum1"
                                    }
                                    key={index}
                                    onClick={() =>
                                      handleFailedPageChange(index)
                                    }
                                  >
                                    <p>{index + 1}</p>
                                  </div>
                                );
                              }
                              // Render null for page numbers outside the current group
                              return null;
                            })}
                            {failedPage + 1 ===
                            Math.ceil(filteredData.length / 5) ? (
                              <ChevronRightIcon
                                style={{ opacity: 0.2, cursor: "not-allowed" }}
                              />
                            ) : (
                              <ChevronRightIcon
                                onClick={() =>
                                  handleFailedPageChange(failedPage + 1)
                                }
                                style={{ cursor: "pointer", color: "#707784" }}
                              />
                            )}
                          </div>
                        </div>
                      </td>
                    </tfoot>
                  </>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan={8}>
                        <h2 style={{ textAlign: "center" }}>No Data</h2>
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog for note */}
      <Dialog
        open={dashboardALert}
        onClose={() => setDashboardAlert(false)}
        PaperProps={{
          style: {
            background: "#ffffff",
          },
        }}
      >
        <DialogTitle
          sx={{ color: "#FF5630", fontSize: "24px", fontWeight: "bold" }}
        >
          Note!!!
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#101623", fontSize: "20px" }}>
            Date field can't be empty.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDashboardAlert(false)}
            color="primary"
            sx={{ fontWeight: "bold", fontSize: "18px" }}
            variant="contained"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
