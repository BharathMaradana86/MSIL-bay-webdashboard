import React, { useEffect, useRef, useState } from "react";
import Appbar from "../../components/Appbar/Appbar";
import "../Dashboard/Dashboard.css";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
import { Button, Dropdown, Space, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { getRecent5Events } from "../../API/api";

export default function LiveStreaming() {
  const [loader, setLoader] = useState(true);
  const [selectedItem1, setSelectedItem1] = useState("in1");
  const [selectedItem2, setSelectedItem2] = useState("bay");
  const [incidents, setIncidents] = useState([]);
  const [error, setError] = useState(null);
  // dropdown for selecting the camera/zones for live streaming
  const cameras = ["out1", "in1"];
  const modules = ["ppe", "bay", "scissor safety", "zebra", "blur","person safety","person safety_out","bay_out","ppe_out","numberplate_out","stopper_out"];
  console.log("selectedItem1", selectedItem1);
  console.log("selectedItem2", selectedItem2);
  const statusMenu = (
    <Menu onClick={({ key }) => setSelectedItem1(key)}>
      {cameras.map((zone) => (
        <Menu.Item key={zone}>{zone}</Menu.Item>
      ))}
    </Menu>
  );
  const statusMenu1 = (
    <Menu onClick={({ key }) => setSelectedItem2(key)}>
      {modules.map((zone) => (
        <Menu.Item key={zone}>{zone}</Menu.Item>
      ))}
    </Menu>
  );

  useEffect(() => {
    if (selectedItem1 && selectedItem2) {
      setLoader(true);

      const intervalId = setInterval(async () => {
        try {
          const res = await getRecent5Events({
            moduleName: selectedItem2,
            cameraName: selectedItem1,
          });
          console.log("res", res);

          if (res?.data?.message?.length) {
            const filterData = await Promise.all(
              res.data.message
                .map(async (item) => ({
                  title: item?.IncidentType,
                  timestamp: item?.created_on
                    ? new Date(item.created_on).toLocaleString()
                    : new Date().toLocaleString(),
                }))
            );
            console.log("filterData", filterData, selectedItem1, selectedItem2);
            setIncidents(filterData); // no need to clear first
          } else {
            setIncidents([]);
          }
        } catch (error) {
          console.error("Error fetching events:", error);
        } finally {
          setLoader(false);
        }
      }, 10000); // 10 second interval

      // Cleanup on unmount or dependency change
      return () => clearInterval(intervalId);
    }
  }, [selectedItem1, selectedItem2]);

  // change in module or zone ( state variable )
  // will update the endpoint accordingly
  const [endpoint, setEndpoint] = useState("http://192.168.3.42:5000/cam1");
  // will update the endpoint accordingly

  const module_port =
    {
      ppe: 7001,
      "scissor safety": 7002,
      bay: 7003,
      blur: 7004,
      zebra: 7005,
      "person safety": 7006,
      "person safety_out": 7015,
      "bay_out": 7010,
      "ppe_out": 7011,
      "numberplate_out": 7012,
      "stopper_out": 7013
    }[selectedItem2] || null;
  const endpoint1 = `http://192.168.3.42:${module_port}/video_feed/${selectedItem1}`;
  console.log(endpoint1);
  const imgRef = useRef(null);

  const handleFullscreen = () => {
    if (imgRef.current.requestFullscreen) {
      imgRef.current.requestFullscreen();
    } else if (imgRef.current.webkitRequestFullscreen) {
      imgRef.current.webkitRequestFullscreen(); // Safari
    } else if (imgRef.current.msRequestFullscreen) {
      imgRef.current.msRequestFullscreen(); // IE11
    }
  };
  return (
    <>
      <Appbar title="Dashboard" />
      <div className="w-full dashboard_main">
        <div className="w-full dashboard_content_1">
          <div className="title_date">
            <div className="title-icon-overview" style={{ marginTop: "39px" }}>
              <p className="dashboard_overview_head" style={{marginLeft: '-180px'}}>Live Streaming</p>
            </div>
          </div>
        </div>

        <div
          className="mt-6 bg-white px-6 py-6 rounded-xl w-full"
          style={{ marginBottom: "24px" }}
        >
          <div className="w-full flex flex-row justify-between items-center relative">
            <div className="text-gray-500 font-semibold text-xl">
              Choose the Required Zone to access the Live Stream Footage
            </div>
            <div className="absolute right-0 flex flex-row gap-3">
              <Dropdown
                overlay={statusMenu}
                className="analytics_models_dropdown"
              >
                <Button>
                  <Space className="analytics_models_dropdown_button">
                    {selectedItem1 || "Select Camera"}
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
              <Dropdown
                overlay={statusMenu1}
                className="analytics_models_dropdown"
              >
                <Button>
                  <Space className="analytics_models_dropdown_button">
                    {selectedItem2 || "Select Module"}
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3 w-full">
          <div className="relative col-span-9 bg-white rounded-2xl h-[60vh]">
            {loader ? (
              <div className="w-full h-full flex flex-col justify-center items-center">
                <LoadSpinner />
                <div className="text-gray-500 text-medium mt-3">
                  {!selectedItem1
                    ? "Please choose the Camera and Module"
                    : "Loading..."}
                </div>
              </div>
            ) : selectedItem1 ? (
              <div className="w-full h-full ">
                <img
                  ref={imgRef}
                  onClick={handleFullscreen}
                  src={`http://192.168.3.42:${module_port}/video_feed/${selectedItem1}`}
                  alt="livestream"
                  height="100%"
                  className="w-full h-full object-contain rounded-2xl "
                />
              </div>
            ) : (
              <p className="h-full text-gray-400 font-medium flex flex-col items-center justify-center">
                No Live Stream Available
              </p>
            )}
          </div>

          <div className="col-span-3 overflow-y-auto px-4 py-3 bg-white rounded-2xl h-[60vh]">
            <div className="text-xl font-semibold">
              Live Real-Time Incidents
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {incidents.length > 0 ? (
              incidents.map((incident, index) => (
                <div
                  key={index}
                  className="bg-orange-50 rounded-lg my-1.5 px-3 py-1 border-2"
                >
                  <div className="text-md text-orange-500 font-semibold">
                    {incident.title}
                  </div>
                  <div className="text-gray-600 text-sm font-medium">
                    {incident.timestamp}
                  </div>
                </div>
              ))
            ) : (
              <p className="h-80 text-gray-400 font-medium flex flex-col items-center justify-center">
                No Live Incidents
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}