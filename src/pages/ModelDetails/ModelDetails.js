import React,{useState,useEffect,useMemo, useContext} from 'react'
import './ModelDetails.css'
import '../InspectionDetails/InspectionDetails.css'
import { useNavigate, useParams } from 'react-router-dom';
import Appbar from '../../components/Appbar/Appbar';
import Arrow from '../../images/ph_arrow-left-bold.svg';
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Sort from '../../images/SortAscending.svg';
import Delete from '../../images/ph_trash-simple-bold.svg';
import Edit from '../../images/Pencil.svg';
import Delete_Icon from '../../images/Trash.svg';
import Add from '../../images/Plus.svg';
import Cross1 from '../../images/Cross1.svg';
import { DeleteModel, editModel, fetchAllChildParts, fetchAllModelDetails, getIndividualModelInspectionCount, getModelDetailedViewCount, handleAddChildParts, handleDeleteChild, handleGetModel, handleModelInspectedData, resultMapping } from '../../API/api';
import {
  RotateLeftOutlined,
  RotateRightOutlined,
  SwapOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import { Image, Space } from 'antd';
import {Dialog,DialogTitle,DialogContent,DialogActions} from '@mui/material';
import { Typography  } from '@mui/material'
import Button from '@mui/material/Button';
import { Select } from 'antd';
import { AuthContext } from '../../utils/Auth.context';
import axios from 'axios';
const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters','Sup', 'Sai', 'Pri', 'Sun'];

export default function ModelDetails() {
    const {id} = useParams();
    const [data,setdata] = useState(useParams());
    const { UserCredentials } = useContext(AuthContext);
    let userData_1 = (JSON.parse(data["data"]));
    const images = [Arrow,Arrow,Arrow]
    const [loader,setLoader] = useState(false)
    const [partsPage, setPartsPage] = useState(0);
    const [options,setOptions] = useState([]);
    const handlePartsPageChange = (newPage) => {
      setPartsPage(newPage);
    };

    const [dialog,setDialog] = useState(false)
    const [dialogType,setDialogType] = useState('')
    const [deletePart,setDeletePart] = useState('');
    const handleDialog = (type,data) =>{
        
      if(type == 'Delete Part'){
        setDeletePart(data)
      };
     
      setDialog(true)
      setDialogType(type)
    }
    const numberArray = Array.from({ length: 130 }, (_, i) => i + 1);
    const [numbers, setNumbers] = useState(numberArray);


    const [partsData, setPartsData] = useState(
        [
        {
            "sno": 1260,
            "image": Arrow,
            "partno": '39105M77S00-5PK',
            "partname": "PANEL,INSTRUMENT MAIN UPPER",
            "identification": "Brown Color",
            "defects": "Incorrect",
          },
          {
            "sno": 1260,
            "image": Arrow,
            "partno": '39105M77S00-5PK',
            "partname": "PANEL,INSTRUMENT MAIN UPPER",
            "identification": "Brown Color",
            "defects": "Incorrect",
          },
          {
            "sno": 1260,
            "image": Arrow,
            "partno": '39105M77S00-5PK',
            "partname": "PANEL,INSTRUMENT MAIN UPPER",
            "identification": "Brown Color",
            "defects": "Incorrect",
          },
          {
            "sno": 1260,
            "image": Arrow,
            "partno": '39105M77S00-5PK',
            "partname": "PANEL,INSTRUMENT MAIN UPPER",
            "identification": "Brown Color",
            "defects": "Incorrect",
        },
        {
            "sno": 1260,
            "image": Arrow,
            "partno": '39105M77S00-5PK',
            "partname": "PANEL,INSTRUMENT MAIN UPPER",
            "identification": "Brown Color",
            "defects": "Incorrect",
        },
        {
            "sno": 1260,
            "image": Arrow,
            "partno": '39105M77S00-5PK',
            "partname": "PANEL,INSTRUMENT MAIN UPPER",
            "identification": "Brown Color",
            "defects": "Incorrect",
        },
        {
            "sno": 1260,
            "image": Arrow,
            "partno": '39105M77S00-5PK',
            "partname": "PANEL,INSTRUMENT MAIN UPPER",
            "identification": "Brown Color",
            "defects": "Incorrect",
        },
      ]
      );

    
      const navigate = useNavigate();


  // Go back to the previous route if the user navigates back
  const handleGoBack = () => {
    if( id== 'reports'){
        navigate('/reports')
    }
    else{
        navigate('/configure')
    }
  };
  const [failedPage, setFailedPage] = useState(0);

  const handleFailedPageChange = (newPage) => {
    setFailedPage(newPage);
  };

  const [ModelDetails,setModelDetails] = useState('');
  const [totalinsp,setInspection] = useState("0");
  const [failedinsp,setfailedinsp] = useState("0");
  const [partData,setpartData] = useState([]);
  useMemo(() => {
          let userData = data["data"];
          userData = JSON.parse(userData);
          setModelDetails(userData);

          async function called(){
              console.log(failedPage);
              const res = await handleModelInspectedData({ModelID:userData?.ModelID,ModelName: userData?.Model,pageNumber: failedPage });
              const res1 = await fetchAllModelDetails();
              const res2 = await fetchAllChildParts({ModelID: userData?.ModelID});
              const res3 = await getIndividualModelInspectionCount({ModelCode: userData?.Model})
              if(res2?.data?.message){
                const partCodes = (res2?.data?.message)?.map((item,index) => item?.partCode);
                setpartData(res2?.data?.message);
                setOptions(partCodes);
              }
            if(res1?.data?.message?.length > 0){
              //  const value = (res1?.data?.message)?.find(obj => obj.Model == userData?.Model || obj.code == userData?.Model);
               
               // setInspection(value?.totalinspection);
            }
            if(res3?.data) {
                setInspection(res3?.data?.message);
            }
            console.log(JSON.stringify(res));
              if(res?.data?.message ){
                      let failedData = res?.data?.message[1];
                      let partsData = res?.data?.message[0];
                    
                     // const uniquePartCodes = new Set();

                      // Filter the data array to remove duplicate entries based on PartCode
                      // partsData = partsData?.filter(item => {
                      //     if (!uniquePartCodes.has(item.PartCode)) {
                      //         uniquePartCodes.add(item.PartCode);
                      //         return true;
                      //     }
                      //     return false;
                      // });

                      setPartsData(partsData);
                     // setfailedinsp(failedData?.length ? failedData?.length : 0);
                      setFailedData(failedData);
                      console.log(failedData);
                 }else{
                setFailedData([]);
                setPartsData([]);
              }
             
          }
          called();
  },[data,failedPage]);

  useEffect(() => {
    let userData = data["data"];
    userData = JSON.parse(userData);
    setModelDetails(userData);
      async function called() {
            const res = await getModelDetailedViewCount({ModelID:userData?.ModelID,ModelName: userData?.Model,pageNumber: failedPage });
            if(res?.data?.message){
              
                    setfailedinsp(res?.data?.message);
            } else {
              setfailedinsp(0);
            }
      }

            called();
  },[data]);

  const updateTheModels = async () => {
    let userData = data["data"];
    userData = JSON.parse(userData);
    setModelDetails(userData);

    async function called(){
        console.log(userData?.id)
        const res = await handleModelInspectedData({ModelID:userData?.ModelID,ModelName: userData?.Model,pageNumber: failedPage });
        const res1 = await fetchAllModelDetails();
        const res2 = await fetchAllChildParts({ModelID: userData?.ModelID});
        if(res2?.data?.message){
          const partCodes = (res2?.data?.message)?.map((item,index) => item?.partCode);
          setpartData(res2?.data?.message);
          setOptions(partCodes);
        }
      if(res1?.data?.message?.length > 0){
          const value = (res1?.data?.message)?.find(obj => obj.Model == userData?.Model || obj.code == userData?.Model);
         
          setInspection(value?.totalinspection);
      }
      console.log(JSON.stringify(res));
        if(res?.data?.message ){
                let failedData = res?.data?.message[1];
                let partsData = res?.data?.message[0];
              
               // const uniquePartCodes = new Set();

                // Filter the data array to remove duplicate entries based on PartCode
                // partsData = partsData?.filter(item => {
                //     if (!uniquePartCodes.has(item.PartCode)) {
                //         uniquePartCodes.add(item.PartCode);
                //         return true;
                //     }
                //     return false;
                // });

                setPartsData(partsData);
                setfailedinsp(failedData?.length ? failedData?.length : 0);
                setFailedData(failedData);
           }else{
          setFailedData([]);
          setPartsData([]);
        }
    }
    called();
  }

  const [failedData, setFailedData] = useState(
    [
    {
        "psn": 1260,
        "model": 'YHB23D2BP0600000',
        "chassisno": "MA3BNC62SRC777834",
        "partcount": 21,
        "shift": "A",
        "datetime": "10 Apr 2024, 10:38 AM",
        "status": "Failed",
        "action":"Details"
      },
      {
        "psn": 1260,
        "model": 'YHB23D2BP0600000',
        "chassisno": "MA3BNC62SRC777834",
        "partcount": 21,
        "shift": "A",
        "datetime": "10 Apr 2024, 10:38 AM",
        "status": "Failed",
        "action":"Details"
      },
      {
        "psn": 1260,
        "model": 'YHB23D2BP0600000',
        "chassisno": "MA3BNC62SRC777834",
        "partcount": 21,
        "shift": "A",
        "datetime": "10 Apr 2024, 10:38 AM",
        "status": "Failed",
        "action":"Details"
      },
      {
        "psn": 1260,
        "model": 'YHB23D2BP0600000',
        "chassisno": "MA3BNC62SRC777834",
        "partcount": 21,
        "shift": "A",
        "datetime": "10 Apr 2024, 10:38 AM",
        "status": "Failed",
        "action":"Details"
    },
    {
      "psn": 1260,
      "model": 'YHB23D2BP0600000',
      "chassisno": "MA3BNC62SRC777834",
      "partcount": 21,
      "shift": "A",
      "datetime": "10 Apr 2024, 10:38 AM",
      "status": "Failed",
      "action":"Details"
    },
    {
      "psn": 1260,
      "model": 'YHB23D2BP0600000',
      "chassisno": "MA3BNC62SRC777834",
      "partcount": 21,
      "shift": "A",
      "datetime": "10 Apr 2024, 10:38 AM",
      "status": "Failed",
    },
    {
      "psn": 1260,
      "model": 'YHB23D2BP0600000',
      "chassisno": "MA3BNC62SRC777834",
      "partcount": 21,
      "shift": "A",
      "datetime": "10 Apr 2024, 10:38 AM",
      "status": "Failed",
      "action":"Details"
    },
  ]
  );

  
 
  const [searchTerm, setSearchTerm] = useState('');
      const filteredData = partsData?.filter((data) =>
        data?.name?.toLowerCase().includes(searchTerm?.toLowerCase())
      );

      const [searchTerm_1, setSearchTerm_1] = useState('');
      const filteredData_1 = failedData?.filter((data) =>
        data?.PSN?.toLowerCase().includes(searchTerm_1?.toLowerCase()) || data?.Model?.toLowerCase().includes(searchTerm_1?.toLowerCase()) || data?.ChassisNumber?.toLowerCase().includes(searchTerm_1?.toLowerCase())
      );

      const [sort,setSort] = useState(false)
      const handleSortClick = () =>{
        setSort((prevSort) => !prevSort)
      }
      const [sortType,setSortType] = useState('Ascending')
      const handleSorting = (type) =>{
        setSortType(type)
      }


      // const handleFormSubmit = (event) =>{
      //   event.preventDefault()
      //   console.log(1);
      // }

      // const [parts, setParts] = useState([{ id: 1, value: '' }]);
      // const handleInputChange = (index, event) => {
      //   const newParts = parts.map((part, i) => {
      //     if (i === index) {
      //       return { ...part, value: event.target.value };
      //     }
      //     return part;
      //   });
      //   setParts(newParts);
      // };
    
      // const addPart = () => {
      //   setParts([...parts, { id: parts.length + 1, value: '' }]);
      // };

      const [selectedItems, setSelectedItems] = useState([]);
      const filteredOptions = options?.filter((o) => !selectedItems.includes(o));
      const [position,setPosition] = useState('');
      const [modelNumber,setModelNumber] = useState('')
      const handleModelNumber = (event) =>{
        setModelNumber(event.target.value)
      }

      const [modelDescription,setModelDescription] = useState('')
      const handleModelDescription = (event) =>{
        setModelDescription(event.target.value)
      }

      const [partInputs, setPartInputs] = useState([
        { position: '', part: '' }, // Initial state with empty strings
      ]);
      const handleAddPart = () => {
        setPartInputs([...partInputs, { position: '', part: '' }]); // Add new part input
      };
      const handlePartPositionChange = (index, newPosition) => {
        setPartInputs((prevInputs) =>
          prevInputs.map((input, i) => (i === index ? { ...input, position: newPosition } : input))
        );
      };
      const handlePartSelectionChange = (index, newPart) => {
        setPartInputs((prevInputs) =>
          prevInputs.map((input, i) => (i === index ? { ...input, part: newPart } : input))
        );
      };

      const handleSubmitDialog =async () =>{
        let userData = JSON.parse(data["data"]);
        if(dialogType == 'Add Part'){
            
          
          const finalResult = partInputs.map((input) => ({
            position: input.position,
            partCode: input.part,
          }));
          setPartInputs([{ position: '', part: '' }]);
             
          //   const ChildParts = partData?.filter((item,index) => finalResult.includes(item?.partCode));

            const updatedFinalResult = finalResult.map((item) => {
              const matchingPart = partData.find((part) => part.partCode === item.partCode);
              if (matchingPart) {
                return {
                  ...item,
                  partCode: matchingPart.partID,
                };
              }
              return item;
            });
            
            //console.log(updatedFinalResult);
           // const selectedChildParts = ChildParts?.map((item,index) => item?.partID);
            
            const res1 = await handleAddChildParts({ modelid: userData?.ModelID, allChildParts: updatedFinalResult,userName: UserCredentials[0]?.name});

            setSelectedItems([]);
            await updateTheModels();
            setDialog(false);
          
        }
        else if(dialogType == 'Edit Basic Information'){
          console.log("something")
          const res = await editModel({modelID: userData?.ModelID,code: modelNumber,name:modelDescription,userName: UserCredentials[0]?.name});
          navigate('/configure');
          await updateTheModels();
          setDialog(false);
          setModelNumber('');
          setModelDescription('');
          
        } if(dialogType == 'Delete Model') {
                const userData_3 = JSON.parse(data["data"]);
                const resDel = await DeleteModel({ModelID: userData_3?.ModelID,userName: UserCredentials[0]?.name});
                navigate('/configure');
                await updateTheModels();
                setDialog(false);
        } else if(dialogType == 'Delete Part') {

                  const res = await handleDeleteChild(deletePart,{userName: UserCredentials[0]?.name});
                  await updateTheModels();
                  setDeletePart({});
                  setDialog(false); 
        }
      }

      // const dropdownRender = (menu) => (
      //   <div>
      //     {menu}
      //     <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 8 }}>
      //       <Button
      //         type="primary"
      //         onClick={() => document.body.click()} // This will close the dropdown
      //       >
      //         Confirm
      //       </Button>
      //     </div>
      //   </div>
      // );
      const [openInvalidCredentialsDialog, setOpenInvalidCredentialsDialog] = useState(false);
      const [validate,setValidate] = useState([]);
      const [Partloader,setPartloader] = useState(false);
      const handleValidation = async () => {
        setOpenInvalidCredentialsDialog(true);
          setPartloader(true);
          let userData = data["data"];
          userData = JSON.parse(userData);
          try {
           // setPartloader(true);
              const data = await axios.get(`http://localhost:5005/validate/${userData?.Model}`);
              if(data?.data?.is_valid) {
                  setValidate([]);
              } else {
                setValidate(data?.data?.errors || []);
              }
              
          } catch (error) {
            
          } finally {
           
              setPartloader(false);
          }
      }
  return (

    <>
        <Appbar />
        <div className='inspection_main'>
          <div>
          <div className='model_inspection_main_head'>
            <div className='model_inspection_main_head_content'>
              <img src={Arrow} alt='arrow' style={{height:'24px',width:'24px',cursor:'pointer'}} onClick={handleGoBack}/>
              <p>Model Details</p>
            </div>
         {UserCredentials && UserCredentials[0] && UserCredentials[0]?.roles == "admin" &&  <button className='delete_model_button' onClick={() => handleDialog('Delete Model',{})}>
              <img src={Delete} alt='delete' />
              <p className='delete_model_button_text'>Delete Model</p>
            </button>}
          </div>

          {/* basic information div */}

          <div className='model_basic_info'>
            <div className='model_basic_info_head'>
              <div className='model_basic_info_head_text'>
                <div className='model_basic_info_head_text_div'></div>
                <p className='model_basic_info_head_text_para'>Basic Information</p>
              </div>
            {UserCredentials && UserCredentials[0] && UserCredentials[0]?.roles == "admin" &&(  <button className='model_basic_info_head_edit' onClick={()=>{
                const userdata = JSON.parse(data["data"]);
                setModelNumber(userdata?.Model);
                setModelDescription(userdata?.ModelName);
                handleDialog('Edit Basic Information',{});}}>
                <img src={Edit} alt='edit' />
                <p className='model_basic_info_head_edit_text'>Edit</p>
              </button>)}
            </div>
            <div className='model_basic_info_content'>
              <div className='model_basic_info_content_item'>
                <p className='model_basic_info_content_item_1'>MODEL NUMBER</p>
                <p className='model_basic_info_content_item_2'>{userData_1?.Model}</p>
              </div>
              <div className='model_basic_info_content_item'>
                <p className='model_basic_info_content_item_1'>MODEL DESCRIPTION</p>
                <p className='model_basic_info_content_item_2'>{userData_1?.ModelName}</p>
              </div>
              <div className='model_basic_info_content_item'>
                <p className='model_basic_info_content_item_1'>TOTAL INSPECTIONS</p>
                <p className='model_basic_info_content_item_2'>{totalinsp ? totalinsp : 0}</p>
              </div>
              <div className='model_basic_info_content_item'>
                <p className='model_basic_info_content_item_1'>FAILED INSPECTIONS</p>
                <p className='model_basic_info_content_item_2'>{failedinsp ? failedinsp : 0}</p>
              </div>
            </div>
          </div>

          {/* basic information div */}



          {/* parts table */}


          <div className='dashboard_content_1' style={{width:'1136px'}}>
          <div className='overview' style={{marginBottom:'24px'}}>
            <div className='model_parts_table_head'>
              <div className='overview_head' style={{justifyContent:'flex-start'}}>
                <div className='overview_head_div'>
                </div>
                <p className='overview_head_text'>Parts ({filteredData?.length})</p>
              </div>
              {UserCredentials && UserCredentials[0] && UserCredentials[0]?.roles == "admin" && (<div style={{display:'flex'}}> <button className='add_parts_button' onClick={()=>{
                
                handleDialog('Add Part',{})}}>
                <img src={Add} alt='addparts' />
                <p>Add Part</p>
              </button>
              <button className='add_parts_button' style={{backgroundColor:'green',marginLeft:'10px'}} onClick={()=>{
                
                handleValidation()}}>
               
                <p>Validate</p>
              </button>
              </div>
              )}
            </div>
            


              {/* search bar (mui) */}
              <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 346,backgroundColor:'#f4f5f6',boxShadow:'none',height:40,marginTop:'24px' }}
                >
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search by Part Name"
                    inputProps={{ 'aria-label': 'Search by Part Name' }}
                    onChange={(e) => {setSearchTerm(e.target.value); setPartsPage(0);}}
                    value={searchTerm}
                />  
                </Paper>


            <div className='overview-table-container' style={{marginTop:'16px'}}>
              <table className='table'>
                <thead>
                  <tr>
                    <th>S. NO</th>
                    <th>IMAGE</th>
                    <th>PART NO.</th>
                    {/* <th>PART COUNT</th> */}
                    <th>PART NAME</th>
                    <th>POSITION</th>
                    {UserCredentials && UserCredentials[0] && UserCredentials[0]?.roles == "admin" && ( <th>ACTIONS</th>)}
                  </tr>
                </thead>
                {loader ? (
                  <tbody>
                    <tr>
                      <td align="center" colSpan={8}>
                        <LoadSpinner height='100%' />
                      </td>
                    </tr>
                  </tbody>
                ) : filteredData?.length ? (
                  <>
                    <tbody>
                    <Image.PreviewGroup
                        preview={{
                          onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                        }}
                    >
                      {filteredData?.slice(partsPage * 5, (partsPage + 1) * 5).map((item, index) => {
                        return (
                          <tr key={index} className='tr-light'>
                            <td>{index+1}</td>
                            <td style={{cursor:'pointer'}}>

                            <Image key={index}
                                style={{borderRadius:'8px',flexGrow:'0',width:'80px',height:'80px'}}
                                src={`http://${process.env.REACT_APP_IP_ADDRESS}:5000/partImages/${item?.code}.png`}
                                preview={{
                                    toolbarRender: (
                                    _,
                                    {
                                        transform: { scale },
                                        actions: { onFlipY, onFlipX, onRotateLeft, onRotateRight, onZoomOut, onZoomIn },
                                    },
                                    ) => (
                                    <Space size={12} className="toolbar-wrapper">
                                        <SwapOutlined rotate={90} onClick={onFlipY} />
                                        <SwapOutlined onClick={onFlipX} />
                                        <RotateLeftOutlined onClick={onRotateLeft} />
                                        <RotateRightOutlined onClick={onRotateRight} />
                                        <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                                        <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
                                    </Space>
                                    ),
                                }}
                            />

                              {/* <img src={data?.image} alt='part'  style={{height:'80px',width:'80px',borderRadius:'8px'}}/> */}
                            </td>
                            <td>{item?.code}</td>
                            {/* <td>{((data?.PartTypes)?.split(','))?.length}</td> */}
                            <td>{item?.name}</td>
                                <td>{item?.position}</td>
                           {UserCredentials && UserCredentials[0] && UserCredentials[0]?.roles == "admin" && ( <td>
                              <div className='parts_delete_icon' onClick={() =>{
                                const userData_2 = JSON.parse(data["data"]);
                                const newObj = { ...item,ModelID: userData_2?.ModelID }
                                handleDialog('Delete Part',newObj)}}>
                                <img src={Delete_Icon} alt='delete_icon' />
                              </div>
                            </td>)}
                          </tr>
                        );
                      })}
                    </Image.PreviewGroup>
                    </tbody>
                    <tfoot>
                      <td colSpan={8} style={{padding:'0px'}}>
                        <div className='tfoot'>
                          <p style={{fontSize:'14px',fontWeight:'500',lineHeight:'20px',letterSpacing:'1%',color:'#A0A8B0'}}>Page {partsPage + 1} of {Math.ceil(filteredData.length / 5)}</p>
                          <div className='paginated_right'>
                            {partsPage === 0 ? <ChevronLeftIcon style={{ opacity: 0.2, cursor: 'not-allowed' }} /> : <ChevronLeftIcon onClick={() => handlePartsPageChange(partsPage - 1)} style={{ cursor: 'pointer',color:'#707784' }} />}
                            {Array.from({ length: Math.ceil(filteredData.length / 5) }).map((_, index) => {
                              // Calculate the start and end pages for the current group of 5 pages
                              const startPage = Math.floor(partsPage / 5) * 5; // Calculate the start page of the current group
                              const endPage = Math.min(startPage + 4, Math.ceil(filteredData.length / 5) - 1); // Calculate the end page of the current group
                              
                              // Render page numbers within the current group
                              if (index >= startPage && index <= endPage) {
                                return (
                                  <div className={index === partsPage ? 'pagenum' : 'pagenum1'} key={index} onClick={() => handlePartsPageChange(index)}>
                                    <p>{index + 1}</p>
                                  </div>
                                );
                              }
                              // Render null for page numbers outside the current group
                              return null;
                            })}
                            {partsPage + 1 === Math.ceil(filteredData.length / 5) ? <ChevronRightIcon style={{ opacity: 0.2, cursor: 'not-allowed' }} /> : <ChevronRightIcon onClick={() => handlePartsPageChange(partsPage + 1)} style={{ cursor: 'pointer',color:'#707784' }} />}
                          </div>
                        </div>
                      </td>
                    </tfoot>
                  </>
                ) : (
                  <tbody>
                    <tr >
                      <td colSpan={8} >
                        <h2 style={{textAlign:'center'}}>No Data</h2>
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>


          {/* parts table */}



          <div className='dashboard_content_1' style={{width:'1136px'}}>
          <div className='overview' style={{paddingTop:'24px'}}>
            <div className='overview_head' style={{justifyContent:'flex-start'}}>
              <div className='overview_head_div'>
              </div>
              <p className='overview_head_text'>Inspections ({totalinsp ? totalinsp : 0})</p>
            </div>

            <div style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:'0px',flexGrow:'0',marginTop:'24px'}}>


              {/* search bar (mui) */}
              <Paper
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 346,backgroundColor:'#f4f5f6',boxShadow:'none',height:40 }}
                >
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                    <SearchIcon />
                </IconButton>
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search by PSN, Chassis, Model"
                    inputProps={{ 'aria-label': 'Search by PSN, Chassis, Model' }}
                    onChange={(e) => {setSearchTerm_1(e.target.value); setFailedPage(0);}}
                    value={searchTerm_1}
                />  
                </Paper>

                {/* <div className='overview_search_sort'>
                <div className='overview_search_sort_inner' onClick={handleSortClick}>
                  <p>Sort</p>
                  <img src={Sort} alt='sort' style={{width:'20px',height:'20px'}} />
                </div>
                {sort && <div className='sort_sub_div'>
                  <p onClick={ () =>{
                    handleSorting('Ascending');
                    handleSortClick();
                  }
                }>Sort Ascending(Time)</p>
                  <p onClick={ () =>{
                    handleSorting('Descending');
                    handleSortClick();
                  }
                }>Sort Descending(Time)</p>
                </div>}
              </div> */}
            </div>


            <div className='overview-table-container'>
              <table className='table'>
                <thead>
                  <tr>
                    <th>PSN</th>
                    <th>MODEL</th>
                    <th>CHASSIS NO</th>
                    {/* <th>PART COUNT</th> */}
                    <th>SHIFT</th>
                    <th>DATE & TIME</th>
                    <th>STATUS</th>
                    {/* <th>ACTION</th> */}
                  </tr>
                </thead>
                {loader ? (
                  <tbody>
                    <tr>
                      <td align="center" colSpan={8}>
                        <LoadSpinner height='100%' />
                      </td>
                    </tr>
                  </tbody>
                ) : filteredData_1?.length ? (
                  <>
                    <tbody>
                      {filteredData_1?.map((data, index) => {
                        return (
                          <tr key={index} className='tr-light'>
                            <td>{data?.PSN}</td>
                            <td style={{color:'#395DAB',fontWeight:'600',cursor:'pointer'}}>{data?.Model}</td>
                            <td>{data?.ChassisNumber}</td>
                            {/* <td>{((data?.PartTypes)?.split(','))?.length}</td> */}
                            <td>{data?.Shift}</td>
                            <td>
                                    {data?.datetime && (() => {
                                      // Parse the timestamp string into a Date object
                                      let timestamp = new Date(data.datetime);

                                      // Add 5 hours and 30 minutes to the timestamp
                                      timestamp.setHours(timestamp.getHours() + 5);
                                      timestamp.setMinutes(timestamp.getMinutes() + 30);

                                      // Format the adjusted timestamp into the desired format (YYYY-MM-DDTHH:mm:ss)
                                      let adjustedTimestamp = timestamp.toISOString();
                                      
                                       // Remove the ".00Z" at the end
                                       adjustedTimestamp = adjustedTimestamp.slice(0, -5);

                                      // Split the adjusted timestamp into date and time components
                                      let [date, time] = adjustedTimestamp.split("T");

                                      // Return the formatted date and time
                                      return `${date} ${time}`;
                                    })()}
                          </td>

                            <td>
                              <div className='overview_status' style={{background:'none'}}>
                                <p style={{fontWeight:'500',fontSize:'14px',lineHeight:'20px',letterSpacing:'1%',color:'black'}}>{resultMapping[data?.Result]}</p>
                              </div>
                            </td>
                            {/* <td style={{color:'#395DAB',fontWeight:'600',cursor:'pointer'}} onClick={() => navigate(`/inspection/overview/${JSON.stringify(data)}`)}>
                              View Details
                            </td> */}
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <td colSpan={8} style={{padding:'0px'}}>
                        <div className='tfoot'>
                          <p style={{fontSize:'14px',fontWeight:'500',lineHeight:'20px',letterSpacing:'1%',color:'#A0A8B0'}}>Page {failedPage + 1} of {Math.ceil(totalinsp / 5)}</p>
                          <div className='paginated_right'>
                            {failedPage === 0 ? <ChevronLeftIcon style={{ opacity: 0.2, cursor: 'not-allowed' }} /> : <ChevronLeftIcon onClick={() => handleFailedPageChange(failedPage - 1)} style={{ cursor: 'pointer',color:'#707784' }} />}
                            {Array.from({ length: Math.ceil(totalinsp / 5) }).map((_, index) => {
                              // Calculate the start and end pages for the current group of 5 pages
                              const startPage = Math.floor(failedPage / 5) * 5; // Calculate the start page of the current group
                              const endPage = Math.min(startPage + 4, Math.ceil(totalinsp / 5) - 1); // Calculate the end page of the current group
                              
                              // Render page numbers within the current group
                              if (index >= startPage && index <= endPage) {
                                return (
                                  <div className={index === failedPage ? 'pagenum' : 'pagenum1'} key={index} onClick={() => handleFailedPageChange(index)}>
                                    <p>{index + 1}</p>
                                  </div>
                                );
                              }
                              // Render null for page numbers outside the current group
                              return null;
                            })}
                            {failedPage + 1 === Math.ceil(totalinsp / 5) ? <ChevronRightIcon style={{ opacity: 0.2, cursor: 'not-allowed' }} /> : <ChevronRightIcon onClick={() => handleFailedPageChange(failedPage + 1)} style={{ cursor: 'pointer',color:'#707784' }} />}
                          </div>
                        </div>
                      </td>
                    </tfoot>
                  </>
                ) : (
                  <tbody>
                    <tr >
                      <td colSpan={8} >
                        <h2 style={{textAlign:'center'}}>No Data</h2>
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
        </div>

        </div>



        {/* Dialog box for adding, editing and deleteing  */}

        <Dialog open={dialog}
         PaperProps={{
          style: {
            background:  '#fff' ,
            padding:'24px',
            margin:'0px',
            borderRadius:'10px',
            boxShadow:' 0 4px 16px 0 rgba(0, 0, 0, 0.08)',
            border:'solid 1px #f4f5f6',
            width: (dialogType == 'Edit Basic Information' || dialogType == 'Add Part') ? '504px' : '597px'
          },
        }}>

{ (dialogType == 'Edit Basic Information' || dialogType == 'Add Part') ? <DialogTitle sx={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:'0px',margin:'0px 0px 16.5px 0px'}}>
            <div className='dialog_title_left' style={{gap:'8px'}}>
              <div className='dialog_title_box'></div>
              <p className='dialog_title_text'>{dialogType}</p>
            </div>
            <div className='dialog_title_right' onClick={()=> setDialog(false)} style={{cursor:'pointer'}}>
              <img src={Cross1} alt='cross1' />
            </div>
          </DialogTitle> :
          <DialogTitle sx={{display:'flex',flexDirection:'row',gap:'8px',padding:'0px',margin:'0px 0px 16.5px 0px'}}>
            <div className='dialog_title_box'></div>
            <p className='dialog_title_text'>{dialogType}</p>
          </DialogTitle>
          }

          <DialogContent sx={{padding:'0px',margin:'0px'}}>

            {( dialogType == 'Edit Basic Information' || dialogType ==  'Add Part' ) && <div className='dialog_line'></div> }

            { (dialogType == 'Delete Model' || dialogType == 'Delete Part')  && <p className='delete_dialog_content'>{dialogType == 'Delete Part' ? 'Are you sure you want to delete this part?' : 'Are you sure you want to delete this model? This is a permanent action and cannot be reversed.'}</p> }
            
            { dialogType == 'Edit Basic Information' && <div className='dialog_edit_form'>
              <div className='dialog_edit_input'>
                <p className='dialog_edit_input_text'>Model Number</p>
                <input type='text' className='dialog_edit_input_field' value={modelNumber} onChange={handleModelNumber} />
              </div>
              <div className='dialog_edit_input'>
                <p className='dialog_edit_input_text'>Model Description</p>
                <input type='text' className='dialog_edit_input_field' value={modelDescription} onChange={handleModelDescription} />
              </div>
              </div>
              }

{ dialogType === 'Add Part' &&
             <div className="dialog_edit_form">
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
                     onChange={(newPart) => handlePartSelectionChange(index, newPart)}
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
                     options={options.map((item) => ({
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
                     onChange={(newPosition) => handlePartPositionChange(index, newPosition)}
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
                     options={numberArray.map((item) => ({
                       value: item,
                       label: item,
                     }))}
                     dropdownStyle={{ zIndex: 1300 }}
                     notFoundContent={null}
                   />
                 </div>
               </React.Fragment>
             ))}
             <div className="dialog_edit_input" style={{cursor:'pointer'}}>
               <p className="dialog_edit_input_add_part" onClick={handleAddPart}>
                 + Add Another Part
               </p>
             </div>
            </div>
            }
          </DialogContent>


          <DialogActions sx={{padding:'8px 0px 0px 0px', display:'flex',flexDirection:'row',gap:'16px',margin:'0px'}}>
            <button onClick={() => {setDialog(false); }} style={{margin:'0px'}} type='button' className={ (dialogType == 'Delete Model' || dialogType == 'Delete Part') ? 'dialog_delete_cancel_button' : 'dialog_add_cancel_button' } >
              Cancel
            </button>
            <button onClick={handleSubmitDialog} style={{margin:'0px',pointerEvents:( (dialogType == 'Edit Basic Information' && (modelNumber == '' || modelDescription == '')) ||(dialogType === 'Add Part' && partInputs.every((input) => !input.part)) ) && 'none', color:( (dialogType == 'Edit Basic Information' && (modelNumber == '' || modelDescription == '')) ||(dialogType == 'Add Part' && (dialogType === 'Add Part' && partInputs.every((input) => !input.part)) ) ) && '#101623', backgroundColor:( (dialogType == 'Edit Basic Information' && (modelNumber == '' || modelDescription == '')) ||(dialogType == 'Add Part' && (dialogType === 'Add Part' && partInputs.every((input) => !input.part)) ) ) && '#E5E7EB' }} type='submit' className={ (dialogType == 'Delete Model' || dialogType == 'Delete Part') ? 'dialog_delete_submit_button' : 'dialog_add_submit_button' }>
              {dialogType == 'Edit Basic Information' ? 'Save Changes' : dialogType == 'Add Part' ? 'Add Parts' : 'Delete'}
            </button>
          </DialogActions>


        </Dialog>

        {/* Dialog box for showing validation Data */}
        <Dialog open={openInvalidCredentialsDialog} onClose={() => setOpenInvalidCredentialsDialog(false)}  
        PaperProps={{
        style: {
          background:  '#ffffff' ,
        },
      }}>
          <DialogTitle sx={{color:'#FF5630',fontWeight:'600'}}>Validation Result</DialogTitle>
         {Partloader ? (<LoadSpinner height={'20px'}/>) : ( <DialogContent>
          {validate?.length == 0 ? <p style={{color:'green'}}>There are no errors.</p>  : ( <Typography sx={{color:'#101623'}}>{validate && validate?.map((value,index) => {
              return (
                <div style={{width:'100%'}}>
                  <p style={{width:'100%'}}>{value}</p>
                  <div style={{borderBottom:'1px solid black',width:'auto',height:'10px'}}></div>
                </div>
              )
            })
          }</Typography>)}
          </DialogContent>)}
          <DialogActions>
            <Button onClick={() => setOpenInvalidCredentialsDialog(false)} color="primary" sx={{fontWeight:'bold'}} variant='contained'>
              OK
            </Button>
          </DialogActions>
        </Dialog>

    </>
  )
}