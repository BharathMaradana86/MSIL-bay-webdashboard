import React, { useContext, useEffect, useMemo, useState } from "react";
import Appbar from "../../components/Appbar/Appbar";
import "../Dashboard/Dashboard.css";
import "../Configure/Configure.css";
import "../Analytics/Analytics.css";
import vehicle from "../../images/vehicle.png";
import vehicle1 from "../../images/vehicle1.png";
import percent from "../../images/percent.png";
import WarningCircle from "../../images/WarningCircle.png";
import Export from '../../images/Export.svg';
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Button, Dropdown, message, Space, Menu } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { getBayWiseData, getHandleCSV } from "../../API/api";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Tooltip } from "@mui/material";
import * as XLSX from 'xlsx';
import * as XLSXStyle from 'xlsx-js-style';

export default function BayMonitoring() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allData, setAllData] = useState([]);
  const [page, setPage] = useState(0);
  const [loader, setLoader] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedItem1, setSelectedItem1] = useState("All Statuses");
  const [metricData, setMetricData] = useState([
    {
      name: "Total Bay Count",
      value: 1,
      image: vehicle
    },
    {
      name: "Available Occupied & Vacant Bay Count",
      value: 0,
      image: vehicle1
    },
    {
      name: "Average Occupency Time",
      value: 1,
      image: vehicle
    },
    {
      name: "Average Unloading Time",
      value: 0,
      image: vehicle1
    },
    {
      name: "Average Loading Time",
      value: 0,
      image: percent
    },
    {
      name: "Average Wait Time",
      value: "0 mins",
      image: WarningCircle
    },
    {
      name: "Average Vacant Time",
      value: 0,
      image: vehicle
    },
    {
      name: "Total Alerts",
      value: 0,
      image: vehicle
    }
  ]);
  const statusOptions = ["Bay Occupied", "Bay Available", "Under Maintenance"];

  const handleMenuClick1 = ({ key }) => {
    setSelectedItem1(key);

    if (key === "All Statuses") {
      setFilteredData(allData);
    } else {
      const filtered = allData.filter((item) => item?.bayStatus === key);
      setFilteredData(filtered);
    }
  };
  function processBayData(events) {
    const grouped = {};

    // Group by BayName
    events.forEach(event => {
      const bay = event.BayName;
      if (!grouped[bay]) grouped[bay] = [];
      grouped[bay].push({
        type: event.BayId === 'bay_in' ? 'IN' : 'OUT',
        timestamp: new Date(event.timestamp),
        raw: event
      });
    });

    const report = [];

    for (const bay in grouped) {
      const bayEvents = grouped[bay];

      // Sort by timestamp
      bayEvents.sort((a, b) => a.timestamp - b.timestamp);

      const inTimes = [];
      const outTimes = [];
      const eventLog = [];

      bayEvents.forEach(event => {
        eventLog.push({
          bayEvent: event.type,
          bayName: bay,
          timestamp: event.timestamp.toISOString()
        });

        if (event.type === 'IN') inTimes.push(event.timestamp);
        else if (event.type === 'OUT') outTimes.push(event.timestamp);
      });
      console.log(inTimes, outTimes);
      // Pair up IN/OUT and compute durations
      const durations = [];
      const pairs = Math.min(inTimes.length, outTimes.length);
      for (let i = 0; i < pairs; i++) {
        durations.push((outTimes[i] - inTimes[i]) / 1000); // seconds
      }

      const avgDuration = durations.length
        ? durations.reduce((sum, d) => sum + d, 0) / durations.length
        : 0;

      const isOccupied = inTimes.length > outTimes.length;

      // Add last IN and OUT times if available
      const lastBayIn = inTimes.length ? inTimes[inTimes.length - 1].toISOString() : null;
      const lastBayOut = outTimes.length ? outTimes[outTimes.length - 1].toISOString() : null;

      report.push({
        bayName: bay,
        isOccupied,
        vehicleCount: inTimes.length,
        averageOccupancyTimeSeconds: avgDuration.toFixed(2),
        lastBayIn,
        lastBayOut,
        events: eventLog,
        timestamp: bayEvents.length ? bayEvents[bayEvents.length - 1].timestamp.toISOString() : null
      });
    }

    return report;
  }

  const [dashboardDate, setDashboardDate] = useState(
    localStorage.getItem("dashboardDate") ||
    new Date().toISOString().slice(0, 10)
  );

  const handlePreviousDate = () => {
    if (dashboardDate) {
      const previousDate = new Date(dashboardDate); // Create a new Date object
      previousDate.setDate(previousDate.getDate() - 1); // Subtract one day
      // Format the date to yyyy-mm-dd
      const formattedDate = previousDate.toISOString().split("T")[0];

      setDashboardDate(formattedDate); // Set the state to the previous date

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

    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = (new Date()).toISOString().split("T")[0];
        const res = await getBayWiseData({ selectedDate: dashboardDate, shift: "All Shifts" });
        console.log(res);
        if (res?.data?.result) {
          localStorage.setItem("occupied", res?.data?.result?.occupiedBays);
          setMetricData([
            {
              name: "Total Bay Count",
              value: res?.data?.result?.totalBays ?? 1,
              image: vehicle
            },
            {
              name: "Available Bay Count",
              value: res?.data?.result?.availabelBays ?? 0,
              image: vehicle1
            },
            {
              name: "Occupied Bay Count",
              value: res?.data?.result?.occupiedBays ?? 0,
              image: percent
            },
            {
              name: "Average Bay Utilization",
              value: `${res?.data?.result?.averageData ?? 0} Mins`,
              image: WarningCircle
            },
            {
              name: "Total Docked Vehicles",
              value: res?.data?.result?.totalDockedVehicles ?? 0,
              image: vehicle
            }
          ]);
        }
        if (res?.data?.result?.results) {
          console.log("bay-monitring data", res?.data?.result?.results);
          // Filter the data to remove duplicates based on BayId and also need to find the bayIn and bayOut also bayOut timestamp
          const data = [];
          console.log("timest", res?.data?.result?.results);
          const formattedData = res?.data?.result?.results?.forEach((item, index) => {
            data.push({
              bayId: 3001,
              bayName: item?.BayName?? "A6-57",
              bayIn: item?.timestamp ?? "--:--",
              bayOut: item?.timestamp1 ?? "--:--",
              loading: item?.bayLoading_tsp ?? "--:--",
              unloading: item?.bayUnloading_tsp ?? "--:--",
              numberPlate: item?.numberPlate ?? "--:--",
              bayVehicleDocked: item?.timestamp1? "Completed" : item?.bayLoading_tsp? "Loading" : item?.bayUnloading_tsp? "Un-Loading" : "Docked" 
            })
          });
          setAllData(data);
          setLoader(false);
        }

      } catch (error) {

      }
    }
    fetchData();
  }, [dashboardDate]);

  useEffect(() => {
    const results = allData;
    setFilteredData(results);
  }, [searchTerm, allData]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const statusMenu = (
    <Menu onClick={handleMenuClick1}>
      <Menu.Item key="All Statuses">All Statuses</Menu.Item>
      {statusOptions.map((status) => (
        <Menu.Item key={status}>{status}</Menu.Item>
      ))}
    </Menu>
  );


  const handleDashboardDate = (event) => {
    if (event.target.value) {
      setDashboardDate(event.target.value);
      localStorage.setItem("dashboardDate", event.target.value);
    } else {
      // setDashboardAlert(true);
    }
  };

  const generateExcelReports = async () => {
    let data = {
      selectedDate: dashboardDate
    }

    // Fetch the data from the API
    const res = await getHandleCSV(data);

    if (res?.data?.success) {
      // Prepare the worksheet data from the API response


      // Define worksheet headers
      const headers = [
        "S.No",
        "Bay Name",
        "Bay IN Timestamp",
        "Bay Out Timestamp",
        "Bay Duration",
        "Docked Status"
      ];

      // Prepare data rows
      const rows = [];

      res?.data?.message?.forEach((item, index) => {
        // Format bayIn & bayOut
        const formatTime = (timestamp) => {
          if (!timestamp?.includes("T")) return timestamp ?? "--:--";
          const [date, time] = timestamp.split("T");
          const cleanedTime = time.replace("Z", "").split(".")[0];
          return `${date} ${cleanedTime}`;
        };

        const bayInFormatted = formatTime(item?.timestamp);
        const bayOutFormatted = formatTime(item?.timestamp1);

        // Calculate duration
        let bayDuration = "--:--";
        if (item?.timestamp && item?.timestamp1) {
          const diffMs = new Date(item.timestamp1) - new Date(item.timestamp);
          const diffMin = diffMs / (60 * 1000);
          bayDuration = !isNaN(diffMin) ? `${diffMin.toFixed(2)} Min` : "--:--";
        }

        rows.push([
          index + 1,
          "A6-57",
          bayInFormatted,
          bayOutFormatted,
          bayDuration,
          !item?.timestamp1 ? "Docked" : "Un-Docked"
        ]);
      });




      // Combine headers and data rows
      const ws_data = [headers, ...rows];

      // Create a new workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(ws_data);

      // Define styles
      const borderStyle = { style: "thin", color: { rgb: "101623" } };
      const headerStyle = {
        font: { bold: true },
        fill: { fgColor: { rgb: "94c8ff" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle }
      };
      const defaultCellStyle = {
        alignment: { horizontal: "center", vertical: "center" },
        border: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle }
      };
      const specialBgColorStyle = { fill: { fgColor: { rgb: "e7e6e5" } } };

      // Apply header styles
      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!ws[cellAddress]) ws[cellAddress] = {};
        ws[cellAddress].s = headerStyle;
      }

      // Apply styles to all cells
      for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[cellAddress]) ws[cellAddress] = { t: 's', v: '' };
          ws[cellAddress].s = defaultCellStyle;
          if (C > 4 && ((C - 5) % 6) < 3) {
            ws[cellAddress].s = { ...ws[cellAddress].s, ...specialBgColorStyle };
          }
        }
      }

      // Set column widths
      ws['!cols'] = ws_data[0].map((_, i) => ({
        wch: Math.max(...ws_data.map(row => row[i]?.toString().length || 0)) + 2
      }));

      // Set row heights
      ws['!rows'] = Array(ws_data.length).fill({ hpx: 44 });
      ws['!rows'][0] = { hpx: 26 };

      // Append worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      // Generate file and trigger download
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary', cellStyles: true });
      const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${dashboardDate}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Helper function to convert string to ArrayBuffer
      function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      }
    } else {
      console.error("Failed to fetch data for the report");
    }
  }

  return (
    <>
      <Appbar title="Dashboard" />
      <div className="dashboard_main">
        <div className="dashboard_content_1">
          <div className="title_date" style={{ marginLeft: "0px", marginRight: "0px" }}>
            <div className="title-icon-overview" style={{ marginTop: "39px" }}>
              <p className="dashboard_overview_head" >Bay Monitoring</p>
            </div>

            <div
              className="dashboard_date_filter"
              style={{ marginTop: "30px" }}
            >
              <button className='reports_export' style={{ width: 'max-content' }} onClick={() => generateExcelReports()} >
                <p>Export</p>
                <img src={Export} alt='export' style={{ width: '16px', height: '16px' }} />
              </button>

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
              <Tooltip title="Reload">
                <div className="refresh_data" onClick={() => window.location.reload()}>
                  <RefreshIcon />
                </div>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="content-box w-full">
          {
            metricData.map((item, index) => {
              return (
                <div className="content" style={{ width: '280px' }}>
                  <div className="icon_bg" style={{ backgroundColor: "#DAE3F5" }}>
                    <img
                      src={item?.image}
                      alt="vehicle"
                      style={{
                        margintop: "2.81",
                        marginLeft: "0.31",
                        width: "19.38px",
                        height: "15px",
                      }}
                    />
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
                        {item?.name}
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
                        {item?.value}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
          }


        </div>

        <div className="mt-6 overview w-full" style={{ marginBottom: "24px" }}>
          <div className="w-full flex flex-row justify-between items-center relative">
            <div
              className="overview_head"
              style={{ justifyContent: "flex-start" }}
            >
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
                  placeholder="Search by Bay Information"
                  inputProps={{ "aria-label": "Search by Bay Information" }}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(0);
                  }}
                  value={searchTerm}
                />
              </Paper>
            </div>
            <div className="absolute right-0">
              <Dropdown
                overlay={statusMenu}
                className="analytics_models_dropdown"
              >
                <Button>
                  <Space className="analytics_models_dropdown_button">
                    {selectedItem1}
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
            </div>
            <div></div>
          </div>

          <div className="overview-table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Bay Name</th>
                  <th>Number Plate</th>
                  <th>Bay IN Timestamp</th>
                  <th>Bay Out Timestamp</th>
                  <th>Un-Loading Start Time</th>
                  <th>Loading Start Time</th>
                  <th>Un-Loading Duration</th>
                  <th>Loading Duration</th>
                  
                  <th>Bay Duration</th>
                  <th>Docked Status</th>
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
                      ?.slice(page * 5, (page + 1) * 5)
                      .map((item, index) => {
                        return (
                          <tr key={index} className="tr-light">
                            <td>{index + 1}</td>
                            <td
                              className="configure_model_name"
                              onClick={() => {
                                console.log("clicked on the bay", index + 1);
                              }}
                            >
                              {item?.bayName}
                            </td>

                            {/* bayId: 3001,
                                      bayName: "Bay 1",
                                      bayIn: item?.timestamp ?? "--:--",
                                      bayOut: item?.timestamp ?? "--:--",
                                      bayVehicleDocked:  item?.BayId == 'bay_in' ? "Docked" : "Un-Docked" */}
                            <td>{item?.numberPlate}</td>
                            <td>{item?.bayIn?.split('T')[0]} {item?.bayIn?.split('T')[1]?.replace('Z', '')?.split('.')?.[0]}</td>
                            <td>{item?.bayOut?.split('T')[0]} {item?.bayOut?.split('T')[1]?.replace('Z', '')?.split('.')?.[0]}</td>
                            <td>{item?.unloading?.split('T')[0]} {item?.unloading?.split('T')[1]?.replace('Z', '')?.split('.')?.[0]}</td>
                           <td>{item?.loading?.split('T')[0]} {item?.loading?.split('T')[1]?.replace('Z', '')?.split('.')?.[0]}</td>
     <td>{(item.loading && item.unloading) ? !(isNaN((new Date(item?.loading) - new Date(item?.unloading)) / (60 * 1000))) ? ((new Date(item?.loading) - new Date(item?.unloading)) / (60 * 1000))?.toFixed(2) : "--:--" : "--:--"} Min</td>

      <td>{(item.loading && item.bayOut) ? !(isNaN((new Date(item?.bayOut) - new Date(item?.loading)) / (60 * 1000))) ? ((new Date(item?.bayOut) - new Date(item?.loading)) / (60 * 1000))?.toFixed(2) : "--:--" : "--:--"} Min</td>

                            <td>{(item.bayIn && item.bayOut) ? !(isNaN((new Date(item?.bayOut) - new Date(item?.bayIn)) / (60 * 1000))) ? ((new Date(item?.bayOut) - new Date(item?.bayIn)) / (60 * 1000))?.toFixed(2) : "--:--" : "--:--"} Min</td>
                            <td className="text-center">
                              {item?.bayVehicleDocked}
                            </td>
                            {/* <td>
                              <div
                                className={`${
                                  item?.bayStatus === "Occupied"
                                    ? "bg-green-100 text-green-600"
                                    : item?.bayStatus === "Under Maintenance"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-orange-100 text-orange-600"
                                } font-semibold rounded-full w-40 text-center px-4 py-2`}
                              >
                                {item?.bayStatus === "Occupied" ? "Bay Occupied" : "Bay Available"}
                              </div>
                            </td> */}
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
                          Page {page + 1} of{" "}
                          {Math.ceil(filteredData.length / 5)}
                        </p>
                        <div className="paginated_right">
                          {page === 0 ? (
                            <ChevronLeftIcon
                              style={{
                                opacity: 0.2,
                                cursor: "not-allowed",
                              }}
                            />
                          ) : (
                            <ChevronLeftIcon
                              onClick={() => handlePageChange(page - 1)}
                              style={{
                                cursor: "pointer",
                                color: "#707784",
                              }}
                            />
                          )}
                          {Array.from({
                            length: Math.ceil(filteredData.length / 5),
                          }).map((_, index) => {
                            // Calculate the start and end pages for the current group of 5 pages
                            const startPage = Math.floor(page / 5) * 5; // Calculate the start page of the current group
                            const endPage = Math.min(
                              startPage + 4,
                              Math.ceil(filteredData.length / 5) - 1
                            ); // Calculate the end page of the current group

                            // Render page numbers within the current group
                            if (index >= startPage && index <= endPage) {
                              return (
                                <div
                                  className={
                                    index === page ? "pagenum" : "pagenum1"
                                  }
                                  key={index}
                                  onClick={() => handlePageChange(index)}
                                >
                                  <p>{index + 1}</p>
                                </div>
                              );
                            }
                            // Render null for page numbers outside the current group
                            return null;
                          })}
                          {page + 1 === Math.ceil(filteredData.length / 5) ? (
                            <ChevronRightIcon
                              style={{
                                opacity: 0.2,
                                cursor: "not-allowed",
                              }}
                            />
                          ) : (
                            <ChevronRightIcon
                              onClick={() => handlePageChange(page + 1)}
                              style={{
                                cursor: "pointer",
                                color: "#707784",
                              }}
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
    </>
  );
}
