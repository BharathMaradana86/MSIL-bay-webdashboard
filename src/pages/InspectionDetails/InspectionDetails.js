import React, { useState, useEffect, useMemo, useRef } from "react";
import "./InspectionDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import Appbar from "../../components/Appbar/Appbar";
import Arrow from "../../images/ph_arrow-left-bold.svg";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  handleInspectedData,
  handleMetaData,
  resultMapping,
} from "../../API/api";
import {
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { Image, Space, Modal } from "antd";
import ImageGallary from "./ImageGallary";

export default function InspectionDetails() {
  const { id, ParamsData } = useParams();
  const [data, setdata] = useState(useParams());
  const images = [Arrow, Arrow, Arrow];
  const [loader, setLoader] = useState(false);
  const [defectPage, setDefectPage] = useState(0);

  const handleDefectPageChange = (newPage) => {
    setDefectPage(newPage);
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeIndexBottom, setActiveIndexBottom] = useState(null);
  const [activeIndexUp, setActiveIndexUp] = useState(null);
  const [activeIndexTop, setActiveIndexTop] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const handleImageClick = (type, index) => {
    switch (type) {
      case "bottom":
        setActiveIndexBottom(index);
        setActiveIndexUp(null); // Reset other types' active indexes
        setActiveIndexTop(null);
        break;
      case "up":
        setActiveIndexUp(index);
        setActiveIndexBottom(null);
        setActiveIndexTop(null);
        break;
      case "top":
        setActiveIndexTop(index);
        setActiveIndexBottom(null);
        setActiveIndexUp(null);
        break;
      default:
        setActiveIndexUp(null);
        setActiveIndexBottom(null);
        setActiveIndexTop(null);
    }
    setIsPreviewVisible(true);
  };
  const [reportsData, setReportsData] = useState([
    {
      psn: 1260,
      image: Arrow,
      partcode: "39105M77S00-5PK",
      partname: "PANEL,INSTRUMENT MAIN UPPER",
      identification: "Brown Color",
      defecttype: "Incorrect",
    },
    {
      psn: 1260,
      image: Arrow,
      partcode: "39105M77S00-5PK",
      partname: "PANEL,INSTRUMENT MAIN UPPER",
      identification: "Brown Color",
      defecttype: "Incorrect",
    },
    {
      psn: 1260,
      image: Arrow,
      partcode: "39105M77S00-5PK",
      partname: "PANEL,INSTRUMENT MAIN UPPER",
      identification: "Brown Color",
      defecttype: "Incorrect",
    },
    {
      psn: 1260,
      image: Arrow,
      partcode: "39105M77S00-5PK",
      partname: "PANEL,INSTRUMENT MAIN UPPER",
      identification: "Brown Color",
      defecttype: "Incorrect",
    },
    {
      psn: 1260,
      image: Arrow,
      partcode: "39105M77S00-5PK",
      partname: "PANEL,INSTRUMENT MAIN UPPER",
      identification: "Brown Color",
      defecttype: "Incorrect",
    },
    {
      psn: 1260,
      image: Arrow,
      partcode: "39105M77S00-5PK",
      partname: "PANEL,INSTRUMENT MAIN UPPER",
      identification: "Brown Color",
      defecttype: "Incorrect",
    },
    {
      psn: 1260,
      image: Arrow,
      partcode: "39105M77S00-5PK",
      partname: "PANEL,INSTRUMENT MAIN UPPER",
      identification: "Brown Color",
      defecttype: "Incorrect",
    },
  ]);

  const navigate = useNavigate();

  // Go back to the previous route if the user navigates back
  const handleGoBack = () => {
    window.close();
  };

  const [ModelDetails, setModelDetails] = useState("");
  const [metaData, setMetaData] = useState([]);
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [imageRef, setImageRef] = useState(null);
  useMemo(() => {
    let userData = data["data"];
    userData = JSON.parse(userData);
    setModelDetails(userData);
    console.log(JSON.stringify(userData));
    async function called() {
      console.log(userData?.id);
      const res = await handleInspectedData({ record_id: userData?.id });
      if (res?.data?.message?.length > 0) {
        console.log(res?.data?.message);
        let updatedData = res?.data?.message?.filter(
          (item) => item?.Result !== 1
        );
        setReportsData(updatedData);
      } else {
        setReportsData([]);
      }
      const res1 = await handleMetaData({
        date: userData?.datetime?.replace("T", " ")?.split(" ")[0],
        ChassisNumber: userData?.ChassisNumber,
        ModelName: userData?.Model,
      });
      //console.log("res" + JSON.stringify(res1));
      if (res1?.data) {
        setMetaData(res1?.data);
      }
    }
    called();
  }, [data]);

  const BoundingBoxOverlay = ({ boundingBoxes, imageRef }) => (
    <div className="bounding-box-overlay" style={{ zIndex: "100000" }}>
      {boundingBoxes.map((box, idx) => {
        const [x1, y1, x2, y2] = box.bbox;
        console.log(left, right);

        const imageWidth = 1000;
        const imageHeight = 750;

        const nx = (x1 / imageWidth) * 100; // Position X relative to image width
        const ny = (y1 / imageHeight) * 100; // Position Y relative to image height
        const nw = ((x2 - x1) / imageWidth) * 100; // Width relative to image width
        const nh = ((y2 - y1) / imageHeight) * 100; // Height relative to image height

        const { label, color } = box.final_details;

        // Convert color array to CSS color format (rgb or hex)
        const cssColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

        return (
          <div
            key={idx}
            className="bounding-box"
            style={{
              position: "absolute",
              left: `${nx}px`,
              top: `${ny}px`,
              width: `${nw}px`,
              height: `${nh}px`,
              borderColor: cssColor,
              borderWidth: "1px",
              borderStyle: "solid",
              zIndex: 100000,
            }}
          >
            <span
              style={{
                position: "absolute",
                backgroundColor: cssColor,
                color: "#fff",
                padding: "2px",
                fontSize: "6px",
              }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );

  const handleImageLoad = (event, index, type) => {
    const img = event.target;
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    const rect = img.getBoundingClientRect();
    const x = rect.left + window.scrollX;
    const y = rect.top + window.scrollY;

    console.log(`Image dimensions: ${width}x${height}`);
    console.log(`Image position: x=${x}, y=${y}`);
  };

  const handlePreviewChange = (visible) => {
    //console.log(`Preview changed from ${prev} to ${current}`);
    setIsPreviewVisible(visible);
    // No need to reset active indexes or visibility here
  };
  // State to store image dimensions
  // const [imageDimensions, setImageDimensions] = useState({});

  const handleGroupChange = (current, prev) => {
    console.log(current, prev);
    let totalImages = ModelDetails?.ImageCount;

    let parts = totalImages;
    if (current < parts) {
      handleImageClick("bottom", current + 1);
    } else if (current >= parts && current < 2 * parts) {
      if ((current + 1) % parts == 0) {
        handleImageClick("up", parts);
      } else handleImageClick("up", (current + 1) % parts);
    } else {
      if ((current + 1) % parts == 0) {
        handleImageClick("top", parts);
      } else handleImageClick("top", (current + 1) % parts);
    }
  };

  console.log("Model details", ModelDetails);

  return (
    <>
      <Appbar />
      <div className="inspection_main">
        <div>
          <div className="inspection_main_head">
            <img
              src={Arrow}
              alt="arrow"
              style={{ height: "24px", width: "24px", cursor: "pointer" }}
              onClick={handleGoBack}
            />
            <p>Inspection Details</p>
          </div>
          <div className="inspection_sub">
            <div className="inspection_sub_div_main">
              <div className="inspection_sub_div">
                <div className="item">
                  {/* <p className="item_1">MODEL NUMBER</p> */}
                  <p className="item_1">INCIDENT TYPE:</p>
                  <p className="item_2">{ModelDetails?.IncidentType}</p>
                </div>
                <div className="item">
                  {/* <p className="item_1">MODEL DESCRIPTION</p> */}
                  <p className="item_1">CAMERA CAPTURED:</p>
                  <p className="item_2">{ModelDetails?.cameraName}</p>
                </div>
                <div className="item">
                  {/* <p className="item_1">CHASSIS NUMBER:</p> */}
                  <p className="item_1">CAPTURED SHIFT:</p>
                  <p className="item_2">{ModelDetails?.shift}</p>
                </div>
                <div className="item">
                  <p className="item_1">INSPECTION DATE & TIME</p>
                  <p className="item_2">
                    {ModelDetails?.created_on &&
                      (() => {
                        const timestamp = new Date(ModelDetails.created_on);
                        timestamp.setHours(timestamp.getHours() + 5);
                        timestamp.setMinutes(timestamp.getMinutes() + 30);

                        const day = timestamp.getDate();
                        const month = timestamp.toLocaleString("default", {
                          month: "long",
                        });
                        const year = timestamp.getFullYear();
                        const hours = timestamp.getHours();
                        const minutes = timestamp.getMinutes();

                        // Add ordinal suffix
                        const getDaySuffix = (d) => {
                          if (d > 3 && d < 21) return "th";
                          switch (d % 10) {
                            case 1:
                              return "st";
                            case 2:
                              return "nd";
                            case 3:
                              return "rd";
                            default:
                              return "th";
                          }
                        };

                        const formattedTime = timestamp.toLocaleTimeString(
                          "en-US",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          }
                        );

                        return `${day}${getDaySuffix(
                          day
                        )} ${month} ${year} ${formattedTime}`;
                      })()}
                  </p>
                </div>
              </div>
              {/* <div className="inspection_sub_div">
                <div className="item">
                  <p className="item_1">PSN</p>
                  <p className="item_2">{ModelDetails?.PSN}</p>
                </div>
                <div className="item">
                  <p className="item_1">SHIFT</p>
                  <p className="item_2">{ModelDetails?.Shift?.split(" ")[1]}</p>
                </div>
                <div className="item">
                  <p className="item_1">STATUS</p>
                  <p
                    className="item_2"
                    style={{
                      color:
                        ModelDetails?.ModelResult == 1 ? "#36b37e" : "#ff5630",
                    }}
                  >
                    {ModelDetails?.ModelResult == 1 ? "Success" : "Failed"}
                  </p>
                </div>
                <div className="item">
                  <p className="item_1">DEFECTS</p>
                  <p className="item_2">{reportsData?.length}</p>
                </div>
              </div> */}
            </div>
            <p className="inspection_image_text">INSPECTION IMAGES</p>
            {/* <div className='inspection_images'> */}

            <div className="inspection_images">
              {/* <Image.PreviewGroup
      preview={{
        onChange: handleGroupChange,
        onVisibleChange: handlePreviewChange,
      }}
    >
      {['bottom', 'up', 'top'].map((type) => (
        <div key={type}>
          {Array.from({ length: ModelDetails?.ImageCount }, (_, idx) => (
            <React.Fragment key={`${type}-${idx}`}>
              <Image
                style={{ borderRadius: '8px', flexGrow: '0', width: '80px', height: '80px' }}
                src={`http://${process.env.REACT_APP_IP_ADDRESS}:5000/modelLevel/${ModelDetails?.ChassisNumber}_${ModelDetails?.Model}_${type}_${idx + 1}.jpg`}
                alt={`Image ${idx + 1}`}
                
                onClick={() => handleImageClick(type,idx+1)}
                onLoad={(e) => handleImageLoad(e, idx+1, type)}
              />
              {isPreviewVisible &&
                ((type === 'bottom' && activeIndexBottom == idx+1) ||
                  (type === 'up' && activeIndexUp == idx+1) ||
                  (type === 'top' && activeIndexTop == idx+1)) && (
                  <BoundingBoxOverlay
                    boundingBoxes={metaData[`${ModelDetails?.ChassisNumber}_${ModelDetails?.Model}_${type}_${idx + 1}`]}
                    imageRef={imageRef}
                  />
                )}
            </React.Fragment>
          ))}
        </div>
      ))}
    </Image.PreviewGroup> */}
              <ImageGallary
                ModelDetails={ModelDetails}
                metaData={metaData || []}
              />
            </div>

            {/* {(Array.from({ length: ModelDetails?.ImageCount }, (_, index) => index)).map((image,index) => {
                  return(
                      <img src={`http://${process.env.REACT_APP_IP_ADDRESS}:5000/modelLevel/${ModelDetails?.Model}_${ModelDetails?.ChassisNumber}_${index}`} alt='pic' className='inspected_image' />
                  )
              })} */}
            {/* </div> */}
            {/* <p className="inspection_defect_text">
              Defects ({reportsData?.length})
            </p> */}

            {/* <div className="overview-table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>IMAGE</th>
                    <th>PART CODE</th>
                    <th>PART NAME</th>

                    <th>DEFECT TYPE</th>
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
                ) : reportsData?.length ? (
                  <>
                    <tbody>
                      <Image.PreviewGroup
                        preview={{
                          onChange: (current, prev) =>
                            console.log(
                              `current index: ${current}, prev index: ${prev}`
                            ),
                        }}
                      >
                        {reportsData
                          ?.slice(defectPage * 5, (defectPage + 1) * 5)
                          .map((data, index) => {
                            return (
                              <tr key={index} className="tr-light">
                                <td>{index}</td>
                                <td>
                                  <Image
                                    key={index}
                                    style={{
                                      borderRadius: "8px",
                                      flexGrow: "0",
                                      width: "80px",
                                      height: "80px",
                                    }}
                                    src={`http://${
                                      process.env.REACT_APP_IP_ADDRESS
                                    }:5000/partImages/${
                                      data?.PartCode || "unknown_part"
                                    }.png`}
                                    fallback={`http://${process.env.REACT_APP_IP_ADDRESS}:5000/partImages/unknown_part.png`}
                                    preview={{
                                      toolbarRender: (
                                        _,
                                        {
                                          transform: { scale },
                                          actions: {
                                            onFlipY,
                                            onFlipX,
                                            onRotateLeft,
                                            onRotateRight,
                                            onZoomOut,
                                            onZoomIn,
                                          },
                                        }
                                      ) => (
                                        <Space
                                          size={12}
                                          className="toolbar-wrapper"
                                        >
                                          <SwapOutlined
                                            rotate={90}
                                            onClick={onFlipY}
                                          />
                                          <SwapOutlined onClick={onFlipX} />
                                          <RotateLeftOutlined
                                            onClick={onRotateLeft}
                                          />
                                          <RotateRightOutlined
                                            onClick={onRotateRight}
                                          />
                                          <ZoomOutOutlined
                                            disabled={scale === 1}
                                            onClick={onZoomOut}
                                          />
                                          <ZoomInOutlined
                                            disabled={scale === 50}
                                            onClick={onZoomIn}
                                          />
                                        </Space>
                                      ),
                                    }}
                                  />
                                </td>
                                <td>{data?.PartCode}</td>
                                <td>{data?.PartName}</td>

                                <td>{resultMapping[data?.Result]}</td>
                              </tr>
                            );
                          })}
                      </Image.PreviewGroup>
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
                            Page {defectPage + 1} of{" "}
                            {Math.ceil(reportsData.length / 5)}
                          </p>
                          <div className="paginated_right">
                            {defectPage === 0 ? (
                              <ChevronLeftIcon
                                style={{ opacity: 0.2, cursor: "not-allowed" }}
                              />
                            ) : (
                              <ChevronLeftIcon
                                onClick={() =>
                                  handleDefectPageChange(defectPage - 1)
                                }
                                style={{ cursor: "pointer", color: "#707784" }}
                              />
                            )}
                            {Array.from({
                              length: Math.ceil(reportsData.length / 5),
                            }).map((_, index) => {
                              // Calculate the start and end pages for the current group of 5 pages
                              const startPage = Math.floor(defectPage / 5) * 5; // Calculate the start page of the current group
                              const endPage = Math.min(
                                startPage + 4,
                                Math.ceil(reportsData.length / 5) - 1
                              ); // Calculate the end page of the current group

                              // Render page numbers within the current group
                              if (index >= startPage && index <= endPage) {
                                return (
                                  <div
                                    className={
                                      index === defectPage
                                        ? "pagenum"
                                        : "pagenum1"
                                    }
                                    key={index}
                                    onClick={() =>
                                      handleDefectPageChange(index)
                                    }
                                  >
                                    <p>{index + 1}</p>
                                  </div>
                                );
                              }
                              // Render null for page numbers outside the current group
                              return null;
                            })}
                            {defectPage + 1 ===
                            Math.ceil(reportsData.length / 5) ? (
                              <ChevronRightIcon
                                style={{ opacity: 0.2, cursor: "not-allowed" }}
                              />
                            ) : (
                              <ChevronRightIcon
                                onClick={() =>
                                  handleDefectPageChange(defectPage + 1)
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
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
