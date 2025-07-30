import React, { useContext, useEffect, useMemo, useState } from "react";
import "./Configure.css";
import Appbar from "../../components/Appbar/Appbar";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import LoadSpinner from "../../components/LoadSpinner/LoadSpinner";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Add from "../../images/Plus.svg";
import Cross1 from "../../images/Cross1.svg";
import { Select } from "antd";
import Done_Icon from "../../images/Done.svg";
import {
  fetchAllChildParts,
  fetchAllModelDetails,
  handleAddChildParts,
  handleAddModel,
  handleGetModel,
  updateInactiveModels,
} from "../../API/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../utils/Auth.context";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { message } from "antd";
import axios from "axios";
let OPTIONS = [
  "Apples",
  "Nails",
  "Bananas",
  "Helicopters",
  "Sup",
  "Sai",
  "Pri",
  "Sun",
];

export default function Configure() {
  const { UserCredentials, handleLoginContext } = useContext(AuthContext);
  const [checked, setChecked] = useState(false);
  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
  };
  const [options, setOptions] = useState([]);
  const [positions, setpositions] = useState([]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const toggleVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const [openInvalidCredentialsDialog, setOpenInvalidCredentialsDialog] =
    useState(false);
  const [openEmailNotFoundDialog, setOpenEmailNotFoundDialog] = useState(false);

  const [openInvalidCredentialsDialog_1, setOpenInvalidCredentialsDialog_1] =
    useState(false);
  const [openEmailNotFoundDialog_1, setOpenEmailNotFoundDialog_1] =
    useState(false);
  const [modelData, setSelectedModelData] = useState({ code: "", name: "" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  if (UserCredentials) {
    if (UserCredentials[0]?.roles !== "admin") {
      console.log("usercred", UserCredentials);
      navigate("/");
    }
  }
  const [data, setData] = useState([
    {
      model: "YHB23D2BP0600000",
      partcount: 21,
      totalinspections: 21,
      failedinspections: 21,
    },
    {
      model: "YHB23D2BP0600000",
      partcount: 21,
      totalinspections: 21,
      failedinspections: 21,
    },
    {
      model: "YHB23D2BP0600000",
      partcount: 21,
      totalinspections: 21,
      failedinspections: 21,
    },
  ]);

  const [partInputs, setPartInputs] = useState([
    { position: "", part: "" }, // Initial state with empty strings
  ]);
  const handleAddPart = () => {
    setPartInputs([...partInputs, { position: "", part: "" }]); // Add new part input
  };
  const handlePartPositionChange = (index, newPosition) => {
    setPartInputs((prevInputs) =>
      prevInputs.map((input, i) =>
        i === index ? { ...input, position: newPosition } : input
      )
    );
  };
  const handlePartSelectionChange = (index, newPart) => {
    setPartInputs((prevInputs) =>
      prevInputs.map((input, i) =>
        i === index ? { ...input, part: newPart } : input
      )
    );
  };
  const numberArray = Array.from({ length: 130 }, (_, i) => i + 1);
  const [numbers, setNumbers] = useState(numberArray);
  const [searchTerm, setSearchTerm] = useState("");

  const [dialog, setDialog] = useState(false);
  const [dialog1, setDialog1] = useState(true);

  const [loader, setLoader] = useState(false);
  const [page, setPage] = useState(0);
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const [selectedItems, setSelectedItems] = useState([]);
  const filteredOptions = options?.filter((o) => !selectedItems.includes(o));

  const [modelNumber, setModelNumber] = useState("");
  const handleModelNumber = (event) => {
    setModelNumber(event.target.value);
  };

  const [modelDescription, setModelDescription] = useState("");
  const handleModelDescription = (event) => {
    setModelDescription(event.target.value);
  };

  const handleSubmitDialog = async () => {
    if (contentType == "Model") {
      setContentType("Part");
    } else {
      const finalResult = partInputs.map((input) => ({
        position: input.position,
        partCode: input.part,
      }));
      setPartInputs([{ position: "", part: "" }]);

      const res = await handleAddModel({
        code: modelNumber,
        name: modelDescription,
        userName: UserCredentials[0]?.name,
      });
      console.log("model result", res);
      if (
        res?.data?.message !== "Already Model is Present" &&
        res?.data?.message !== "Already Model is Present with inactiveflag"
      ) {
        const updatedFinalResult = finalResult.map((item) => {
          const matchingPart = partData.find(
            (part) => part.partCode === item.partCode
          );
          if (matchingPart) {
            return {
              ...item,
              partCode: matchingPart.partID,
            };
          }
          return item;
        });
        const res1 = await handleAddChildParts({
          modelid: res?.data?.message?.insertId,
          allChildParts: updatedFinalResult,
          userName: UserCredentials[0]?.name,
        });
      } else {
        // message.error('Model is already Present')
        console.log("need to activated");
        if (
          res?.data?.message !== "Already Model is Present with inactiveflag"
        ) {
          setSelectedModelData({ code: modelNumber, name: modelDescription });
          setOpenEmailNotFoundDialog_1(true);
        } else {
          message.error("Model is present with active state");
        }
      }
      //  const res2 = await handleGetModel();
      //   console.log(JSON.stringify(res2))
      //   const highestId = (res2?.data?.message || []).reduce((max, item) => {
      //     return item?.ModelID > max ? item.ModelID : max;
      // }, -Infinity); // -Infinity ensures that any item.id will be larger initially

      // console.log("Highest ID:", highestId);
      setContentType("Model");
      setModelDescription("");
      setModelNumber("");
      setSelectedItems([]);

      setDialog(false);
      await updateTheModels();
    }
  };

  const handleCancelDialog = () => {
    if (contentType == "Part") {
      setContentType("Model");
    } else {
      setContentType("Model");
      setDialog(false);
    }
  };

  const [contentType, setContentType] = useState("Model");
  const [partData, setpartData] = useState([]);

  useEffect(() => {
    async function called() {
      const res = await fetchAllModelDetails();

      if (res?.data?.message?.length > 0) {
        setData(res?.data?.message);
        filteredData = res?.data?.message;
      }

      const res1 = await fetchAllChildParts();

      if (res1?.data?.message) {
        console.log(JSON.stringify(res1));
        const partCodes = res1?.data?.message?.map(
          (item, index) => item?.partCode
        );
        setpartData(res1?.data?.message);
        setOptions(partCodes);
      }
    }

    called();
  }, []);

  let filteredData = data?.filter(
    (item) =>
      item?.Model?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      item?.code?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const handleFileUpload = async (event, modelID) => {
    const file = event.target.files[0];

    if (file) {
      console.log(modelID);
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        message.error("Only CSV files are allowed!");
        return;
      }
      if (modelID == "template") {
        modelID = file.name.split(".")[0];
      }
      // need to check if modelID is same of file name or not
      if (!file.name.includes(modelID)) {
        console.log(file.name, modelID);
        message.error("Model name should be same as file name");
        return;
      }
      console.log("Matching Model Name....");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("modelID", modelID);
      const uploadFile = await axios
        .post(
          `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/configure/uploadFile`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .catch((error) => {
          message.error(error.message);
        });
      if (uploadFile?.data?.success) {
        message.success("File Uploaded Successfully");
        // await updateTheModels();
      }
    } else {
      message.error("No File Selected");
    }
    window.location.reload();
  };

  const updateTheModels = async () => {
    const res = await fetchAllModelDetails();

    if (res?.data?.message?.length > 0) {
      //console.log(JSON.stringify(res));
      setData(res?.data?.message);
      filteredData = res?.data?.message;
    }

    const res1 = await fetchAllChildParts();

    if (res1?.data?.message) {
      // console.log(JSON.stringify(res1));
      const partCodes = res1?.data?.message?.map(
        (item, index) => item?.partCode
      );
      setpartData(res1?.data?.message);
      setOptions(partCodes);
    }
  };

  const updateDeletedModels = async () => {
    const res = await updateInactiveModels(modelData);
    if (res?.data?.success) {
      message.success("Please Refresh The Page. Model Got Activated");
    } else {
      message.error("Model Not Fount. Please retry again");
    }
  };

  useEffect(() => {
    const checkAuthentication = () => {
      const expirationTime = localStorage.getItem("authExpiration");

      if (expirationTime && Date.now() < expirationTime) {
        setDialog1(false);
      } else {
        console.log(" not authenticated");

        setDialog1(true);
      }
    };

    checkAuthentication();
  }, [navigate]);

  async function login(event) {
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
    if (isValid) {
      const data = {
        email: email,
        password: password,
      };
      const res = await handleLoginContext(data);
      if (res?.data == "Email Not Found! Please Register") {
        setOpenEmailNotFoundDialog(true);
      } else if (res?.data == "Password Wrong") {
        setOpenInvalidCredentialsDialog(true);
      } else {
        const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes from now
        localStorage.setItem("authExpiration", expirationTime);
        setDialog1(false);
      }
    }
  }

  const handleDownloadFiles = async (modelID) => {
    try {
      const response = await axios.get(
        `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/configure/downloadFile/${modelID}`,
        {
          responseType: "blob",
        }
      );
      console.log(response);
      // Create a Blob from the response
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link to trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = `${modelID}.csv`; // Ensure correct filename
      document.body.appendChild(a);
      a.click();

      // Cleanup
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {}
  };

  return (
    <div>
      <Appbar title="Dashboard" />
      <div className="configure_main">
        <div>
          <p className="configure_head_text">Configure</p>

          {/* parts table */}

          <div
            className="dashboard_content_1"
            style={{ width: "1136px", marginTop: "24px" }}
          >
            <div className="overview" style={{ marginBottom: "24px" }}>
              <div className="model_parts_table_head">
                <div
                  className="overview_head"
                  style={{ justifyContent: "flex-start" }}
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
                      placeholder="Search by Model"
                      inputProps={{ "aria-label": "Search by Model" }}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(0);
                      }}
                      value={searchTerm}
                    />
                  </Paper>
                </div>
                <button
                  className="configure_add_models_button"
                  onClick={() => setDialog(true)}
                >
                  <img src={Add} alt="addparts" />
                  <p>Add Model</p>
                </button>
              </div>

              <div
                className="overview-table-container"
                style={{ marginTop: "32px" }}
              >
                <table className="table">
                  <thead>
                    <tr>
                      <th>MODEL</th>
                      <th>PART COUNT</th>
                      <th>ACTION</th>
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
                                <td
                                  className="configure_model_name"
                                  onClick={() => {
                                    const jsonObject = {
                                      ModelID: item?.ModelID,
                                      Model: item?.Model || item?.code,
                                      ModelName: item?.ModelName,
                                    };
                                    navigate(
                                      `/model/overview/${JSON.stringify(
                                        jsonObject
                                      )}`
                                    );
                                  }}
                                >
                                  {item?.code || item?.Model}
                                </td>
                                <td>{item?.partcount}</td>
                                <td
                                  style={{
                                    display: "flex",
                                    gap: "12px",
                                  }}
                                >
                                  <button className="model_basic_info_head_edit_v1">
                                    <input
                                      type="file"
                                      id={`fileInput-${index}`}
                                      accept=".csv"
                                      name="file"
                                      style={{ display: "none" }}
                                      onChange={(e) =>
                                        handleFileUpload(
                                          e,
                                          item?.code || item?.Model
                                        )
                                      }
                                    />
                                    <label
                                      htmlFor={`fileInput-${index}`}
                                      style={{ display: "flex", gap: "12px" }}
                                    >
                                      <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M5.375 3.624 8 1l2.625 2.624M8 8V1.002M11 6h1.5a.5.5 0 0 1 .5.5V13a.5.5 0 0 1-.5.5h-9A.5.5 0 0 1 3 13V6.5a.5.5 0 0 1 .5-.5H5"
                                          stroke="#3B4453"
                                          stroke-width="1.6"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                        />
                                      </svg>

                                      <p className="model_basic_info_head_edit_text_v1">
                                        Upload
                                      </p>
                                    </label>
                                  </button>

                                  <button
                                    className="model_basic_info_head_edit_v1"
                                    onClick={() => {
                                      handleDownloadFiles(
                                        item?.code || item?.Model
                                      );
                                    }}
                                    style={{ width: "max-content" }}
                                  >
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 16 16"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M5.375 6.876 8 9.5l2.625-2.624M8 2.5v6.998M13.5 9.5V13a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V9.5"
                                        stroke="#395DAB"
                                        stroke-width="1.6"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                      />
                                    </svg>

                                    <p className="model_basic_info_head_edit_text_v1">
                                      Download
                                    </p>
                                  </button>

                                  {/* <button
                                      className="model_basic_info_head_edit_v1"
                                      onClick={() => setDialog(true)}
                                      style={{width:'max-content'}}
                                    >
                                     <svg width="22" height="22" viewBox="0 0 50 50"  xmlns="http://www.w3.org/2000/svg"><path d="M25 38c-5.1 0-9.7-3-11.8-7.6l1.8-.8c1.8 3.9 5.7 6.4 10 6.4 6.1 0 11-4.9 11-11s-4.9-11-11-11c-4.6 0-8.5 2.8-10.1 7.3l-1.9-.7c1.9-5.2 6.6-8.6 12-8.6 7.2 0 13 5.8 13 13s-5.8 13-13 13z"/><path d="M20 22h-8v-8h2v6h6z"/></svg>

                                      <p className='model_basic_info_head_edit_text_v1'>Revert</p>
                                    </button> */}
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
                              {page + 1 ===
                              Math.ceil(filteredData.length / 5) ? (
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

          {/* parts table */}
        </div>
      </div>

      {/* dialog box for adding models*/}

      <Dialog
        open={dialog1}
        PaperProps={{
          style: {
            background: "#fff",
            padding: "24px",
            margin: "0px",
            borderRadius: "10px",
            boxShadow: " 0 4px 16px 0 rgba(0, 0, 0, 0.08)",
            border: "solid 1px #f4f5f6",
            width: "960px",
            height: "506px",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0px",
            margin: "0px 0px 14px 0px",
          }}
        >
          <div className="dialog_title_left">
            <div className="dialog_title_box" style={{ width: "8px" }}></div>
            <p
              className="dialog_title_text"
              style={{ fontFamily: "Inter", color: "#101623" }}
            >
              Enter Your Credential
            </p>
          </div>
          <div
            className="dialog_title_right"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            <img src={Cross1} alt="cross1" />
          </div>
        </DialogTitle>

        <DialogContent sx={{ padding: "0px", margin: "0px" }}>
          <form className="form" onSubmit={login}>
            <div className="field">
              <p
                style={{
                  color: "#3b4453",
                  fontSize: "14px",
                  fontWeight: "600",
                  lineHeight: "20px",
                  letterSpacing: "1%",
                }}
              >
                Email
              </p>
              <input
                style={{ backgroundColor: "#f4f5f6" }}
                type="text"
                placeholder="Enter your mail"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {formErrors.email ? (
                <p style={{ color: "red" }}>{formErrors.email}</p>
              ) : (
                <></>
              )}
            </div>
            <div className="field" style={{ position: "relative" }}>
              <p
                style={{
                  color: "#3b4453",
                  fontSize: "14px",
                  fontWeight: "600",
                  lineHeight: "20px",
                  letterSpacing: "1%",
                }}
              >
                Password
              </p>
              <input
                style={{ backgroundColor: "#f4f5f6" }}
                placeholder="Enter your password"
                type={passwordVisible ? "text" : "password"}
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {formErrors.password ? (
                <p style={{ color: "red" }}>{formErrors.password}</p>
              ) : (
                <></>
              )}
              <span
                className="icon"
                style={{
                  position: "absolute",
                  right: "10px",
                  top: formErrors.password ? "53%" : "74%",
                  transform: "translateY(-60%)",
                  cursor: "pointer",
                  color: "#3b4453",
                  fontWeight: "bold",
                }}
                onClick={toggleVisibility}
              >
                {passwordVisible ? (
                  <VisibilityOutlinedIcon />
                ) : (
                  <VisibilityOffOutlinedIcon />
                )}
              </span>
            </div>
            <div className="foot"></div>
            <button className="btn" type="submit">
              Enter
            </button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialog}
        PaperProps={{
          style: {
            background: "#fff",
            padding: "24px",
            margin: "0px",
            borderRadius: "10px",
            boxShadow: " 0 4px 16px 0 rgba(0, 0, 0, 0.08)",
            border: "solid 1px #f4f5f6",
            width: "960px",
            height: "372px",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0px",
            margin: "0px 0px 14px 0px",
          }}
        >
          <div className="dialog_title_left">
            <div className="dialog_title_box" style={{ width: "8px" }}></div>
            <p
              className="dialog_title_text"
              style={{ fontFamily: "Inter", color: "#101623" }}
            >
              Add Model
            </p>
          </div>
          <div
            className="dialog_title_right"
            onClick={() => setDialog(false)}
            style={{ cursor: "pointer" }}
          >
            <img src={Cross1} alt="cross1" />
          </div>
        </DialogTitle>

        <DialogContent sx={{ padding: "0px", margin: "0px" }}>
          <div className="dialog_line"></div>
          {contentType == "Model" ? (
            <div className="configure_dialog_content_main">
              <div className="dialog_edit_input">
                <p className="dialog_edit_input_text">
                  Download The Sample Template Before Uploading
                </p>
                <button
                  className="model_basic_info_head_edit_v1"
                  onClick={() => {
                    handleDownloadFiles("template");
                  }}
                  style={{ width: "max-content" }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.375 6.876 8 9.5l2.625-2.624M8 2.5v6.998M13.5 9.5V13a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V9.5"
                      stroke="#395DAB"
                      stroke-width="1.6"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>

                  <p className="model_basic_info_head_edit_text_v1">Download</p>
                </button>
                <p
                  className="dialog_edit_input_text"
                  style={{ marginTop: "1rem" }}
                >
                  Upload New Model CSV File
                </p>
                <button className="model_basic_info_head_edit_v1">
                  <input
                    type="file"
                    id={`fileInput-`}
                    accept=".csv"
                    name="file"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileUpload(e, "template")}
                  />
                  <label
                    htmlFor={`fileInput-`}
                    style={{ display: "flex", gap: "12px" }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.375 3.624 8 1l2.625 2.624M8 8V1.002M11 6h1.5a.5.5 0 0 1 .5.5V13a.5.5 0 0 1-.5.5h-9A.5.5 0 0 1 3 13V6.5a.5.5 0 0 1 .5-.5H5"
                        stroke="#3B4453"
                        stroke-width="1.6"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>

                    <p className="model_basic_info_head_edit_text_v1">Upload</p>
                  </label>
                </button>
              </div>
            </div>
          ) : (
            <div className="configure_dialog_content_main">
              {partInputs.map((partInput, index) => (
                <React.Fragment key={index}>
                  <div className="dialog_edit_input">
                    <p className="dialog_edit_input_text">Part Number/ Name</p>
                    <Select
                      mode="single"
                      showSearch
                      allowClear
                      placeholder="Search by part number or name"
                      value={partInput.part}
                      onChange={(newPart) =>
                        handlePartSelectionChange(index, newPart)
                      }
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "8px",
                        border: "solid 1px #D3D6DA",
                        backgroundColor: "#fff",
                        fontFamily: "Inter",
                        fontSize: "16px",
                        fontWeight: "normal",
                        fontStretch: "normal",
                        fontStyle: "normal",
                        lineHeight: "1.38",
                        letterSpacing: "normal",
                        textAlign: "left",
                        color: "#232B39",
                        height: "48px",
                      }}
                      options={options?.map((item) => ({
                        value: item,
                        label: item,
                      }))}
                      dropdownStyle={{ zIndex: 1300 }}
                      notFoundContent={null}
                    />
                  </div>
                  <div className="dialog_edit_input">
                    <p className="dialog_edit_input_text">Part Position</p>
                    <Select
                      mode="single"
                      showSearch
                      allowClear
                      placeholder="Search by position"
                      value={partInput.position}
                      onChange={(newPosition) =>
                        handlePartPositionChange(index, newPosition)
                      }
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "8px",
                        border: "solid 1px #D3D6DA",
                        backgroundColor: "#fff",
                        fontFamily: "Inter",
                        fontSize: "16px",
                        fontWeight: "normal",
                        fontStretch: "normal",
                        fontStyle: "normal",
                        lineHeight: "1.38",
                        letterSpacing: "normal",
                        textAlign: "left",
                        color: "#232B39",
                        height: "48px",
                      }}
                      options={numberArray?.map((item) => ({
                        value: item,
                        label: item,
                      }))}
                      dropdownStyle={{ zIndex: 1300 }}
                      notFoundContent={null}
                    />
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            padding: "0px",
            display: "flex",
            flexDirection: "row",
            gap: "12px",
            margin: "0px",
          }}
        ></DialogActions>
      </Dialog>

      {/* dialog box for adding models */}

      <Dialog
        open={openInvalidCredentialsDialog}
        onClose={() => setOpenInvalidCredentialsDialog(false)}
        PaperProps={{
          style: {
            background: "#ffffff",
          },
        }}
      >
        <DialogTitle sx={{ color: "#FF5630", fontWeight: "600" }}>
          Invalid Credentials
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#101623" }}>
            Invalid credentials. Please try again.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenInvalidCredentialsDialog(false)}
            color="primary"
            sx={{ fontWeight: "bold" }}
            variant="contained"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for "Email not found" */}
      <Dialog
        open={openEmailNotFoundDialog}
        onClose={() => setOpenEmailNotFoundDialog(false)}
        PaperProps={{
          style: {
            background: "#ffffff",
          },
        }}
      >
        <DialogTitle sx={{ color: "#FF5630", fontWeight: "600" }}>
          Email not found
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#101623" }}>
            The provided email address was not found. Please check your email or
            sign up for an account.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenEmailNotFoundDialog(false)}
            color="primary"
            sx={{ fontWeight: "bold" }}
            variant="contained"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for "Model Active" */}
      <Dialog
        open={openEmailNotFoundDialog_1}
        onClose={() => setOpenEmailNotFoundDialog_1(false)}
        PaperProps={{
          style: {
            background: "#ffffff",
          },
        }}
      >
        <DialogTitle sx={{ color: "#FF5630", fontWeight: "600" }}>
          Model was Already Deleted !!!!
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#101623" }}>
            Do you want to Active the model again.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              updateDeletedModels();
            }}
            color="primary"
            sx={{ fontWeight: "bold" }}
            variant="contained"
          >
            Activate
          </Button>
          <Button
            onClick={() => {
              setOpenEmailNotFoundDialog_1(false);
              window.location.reload();
            }}
            color="primary"
            sx={{ fontWeight: "bold" }}
            variant="contained"
          >
            Refresh
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
