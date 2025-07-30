import React,{useEffect, useMemo, useState} from 'react'
import '../Dashboard/Dashboard.css';
import './Reports.css'
import Appbar from '../../components/Appbar/Appbar';
import axios from 'axios';
import RefreshIcon from '@mui/icons-material/Refresh';
import LoadSpinner from '../../components/LoadSpinner/LoadSpinner';
import {Tooltip} from '@mui/material';
import {Dialog,DialogTitle,DialogContent,DialogActions} from '@mui/material';
import { Typography  } from '@mui/material';
import Button from '@mui/material/Button';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { fetchCSVhandledData, fetchChildParts, fetchDefectInspectedRecordWise, fetchDefectInspectionWise, fetchDetailedView, fetchFailedInspectionWise, fetchInspectedRecordsWise, fetchRecordWise, fetchReportsInspections, fetchSuccessfulInspectedRecordWise, getAllFailedParts, handleGroupParts, resultMapping } from '../../API/api';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Export from '../../images/Export.svg';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import * as XLSXStyle from 'xlsx-js-style';
import {  Dropdown, message, Space ,Menu} from 'antd';
export default function Reports() {

    const [loader,setLoader] = useState(false)
    const [dashboardALert,setDashboardAlert] = useState(false)

    const navigate = useNavigate();


    const [dashboardDate,setDashboardDate] = useState(localStorage.getItem('reportsDate') || new Date().toISOString().slice(0, 10))

    const handleDashboardDate = (event) => {
      if(event.target.value){
      setDashboardDate(event.target.value);
      localStorage.setItem('reportsDate',event.target.value)
      setDefectPage(0)
      }
      else{
        setDashboardAlert(true)
      }
    };
    


      const refreshData = () =>{
        alert('data generated')
      }


      const [reportsData, setReportsData] = useState(
        [
        {
            "id": 1260,
            "model": 'YHB23D2BP0600000',
            "variant": 'YHC',
            "childcount": 21,
            "partcount": 21,
            "shift": "A",
            "datetime": "10 Apr 2024, 10:38 AM",
            "status": false,
            "action": "View Details"
          },
          {
            "id": 1260,
            "model": 'YHB23D2BP0600000',
            "variant": 'YHC',
            "childcount": 21,
            "partcount": 21,
            "shift": "A",
            "datetime": "10 Apr 2024, 10:38 AM",
            "status": true,
            "action": "View Details"
          },
          {
            "id": 1260,
            "model": 'YHB23D2BP0600000',
            "variant": 'YHC',
            "childcount": 21,
            "partcount": 21,
            "shift": "A",
            "datetime": "10 Apr 2024, 10:38 AM",
            "status": true,
            "action": "View Details"
          },
          {
            "id": 1260,
            "model": 'YHB23D2BP0600000',
            "variant": 'YHC',
            "childcount": 21,
            "partcount": 21,
            "shift": "A",
            "datetime": "10 Apr 2024, 10:38 AM",
            "status": true,
            "action": "View Details"
        },
        {
            "id": 1260,
            "model": 'YHB23D2BP0600000',
            "variant": 'YHC',
            "childcount": 21,
            "partcount": 21,
            "shift": "A",
            "datetime": "10 Apr 2024, 10:38 AM",
            "status": false,
            "action": "View Details"
        },
        {
            "id": 1260,
            "model": 'YHB23D2BP0600000',
            "variant": 'YHC',
            "childcount": 21,
            "partcount": 21,
            "shift": "A",
            "datetime": "10 Apr 2024, 10:38 AM",
            "status": false,
            "action": "View Details"
        },
        {
            "id": 1260,
            "model": 'YHB23D2BP0600000',
            "variant": 'YHC',
            "childcount": 21,
            "partcount": 21,
            "shift": "A",
            "datetime": "10 Apr 2024, 10:38 AM",
            "status": true,
            "action": "View Details"
        },
      ]
      );

      const [defectPage, setDefectPage] = useState(0);

      const handleDefectPageChange = (newPage) => {
        // localStorage.setItem("reportsPage",newPage);
        setDefectPage(newPage);
      };

      const [shift,setShift] = useState('All Shifts')

      const [exportType,setExportType] = useState(false)
      const handleExport = () =>{
        setExportType((prevExportType) => !prevExportType)
      }

      const [fileType,setFileType] = useState('')
      const handleFileType = (type) =>{
        setFileType(type)
        if (type == 'PDF') {
            handlepdf();
            setFileType('');
          } else if (type == 'CSV') {
            handlecsv();
            setFileType('');
          }
      }

    //   const dataArray1 = pdfData.map((data) => [data.id, data.tray_id, data.date, data.time, data.reloaded_count, data.picked_count, data.notpicked_count, `http://localhost:5000/images/${localStorage.token}/${data.snapshot}`]);

      const handlepdf = () => {
        // alert('pdf')
        // if (localStorage.getItem('fromDate') && localStorage.getItem('toDate') && localStorage.getItem('fromDate')!='' && localStorage.getItem('toDate')!='') {
        //   if (localStorage.getItem('fromDate') <= localStorage.getItem('toDate')) {
        //     const doc = new jsPDF();
        //     doc.addImage(denso, 'JPEG', 10, 20, 35, 10);
    
        //     doc.setDrawColor(0);
        //     doc.setLineWidth(0.1);
        //     doc.line(10, 35, 200, 35);
    
        //     // Add date, time
        //     doc.setFontSize(14);
        //     doc.setTextColor("#000000");
        //     doc.setFillColor("#182047");
        //     doc.autoTable({
        //       body: [
        //         ['Created On: '+ getCurrentDate(new Date()), 'From: '+formatDate(localStorage.getItem('fromDate')), 'To: '+ formatDate(localStorage.getItem('toDate'))],
        //       ],
        //       startY: 40,
        //     });
    
        //     doc.autoTable({
        //       startY: 50,
        //       head: [['ID', 'Tray ID', 'Date', 'Time', 'Reloaded', 'Picked', 'Not Picked', 'Image']],
        //       body: dataArray1,
        //       rowPageBreak: 'avoid',
        //       didParseCell: function (data) {
        //         const rowHeight = data.row.section === 'head' ? 10 : 30;
        //         data.row.height = rowHeight;
        //         if (data.section === 'body' && data.column.index === 7) {
        //           data.cell.text = '';
        //         }
        //       },
        //       didDrawCell: function (data) {
        //         if (data.section === 'body' && data.column.index === 7) {
        //           const image = new Image();
        //           image.src = data.cell.raw;
    
        //           const imgWidth = 25;
        //           const imgHeight = 25;
    
        //           doc.addImage(
        //             image,
        //             'JPEG',
        //             data.cell.x + 0,
        //             data.cell.y + 2,
        //             imgWidth,
        //             imgHeight
        //           );
        //         }
        //       },
        //       columnStyles: {
        //         7: { cellWidth: 25 }
        //       }
        //     });
    
        //     doc.save(`${formatDate(localStorage.getItem('fromDate'))} To ${formatDate(localStorage.getItem('toDate'))}.pdf`);
        //   } else {
        //     setDialogText('First Date should be less than Second Date to download the PDF file.');
        //     setOpenDialog(true);
        //   }
        // } else {
        //   setDialogText('Select both the Dates to download the Pdf file.');
        //   setOpenDialog(true);
        // }
      };
    
    //   const dataArray = csvData.map((data) => [data.id, data.tray_id, data.date, data.time, data.reloaded_count, data.picked_count, data.notpicked_count]);

      const handlecsv = () => {
        // if (localStorage.getItem('fromDate') && localStorage.getItem('toDate') && localStorage.getItem('fromDate')!='' && localStorage.getItem('toDate')!='') {
        //   if (localStorage.getItem('fromDate') <= localStorage.getItem('toDate')) {
            // const columnHeadings = ['ID', 'Tray ID', 'Date', 'Time', 'Reloaded', 'Picked', 'Not Picked'];
            // const csvContent = "data:text/csv;charset=utf-8," + [columnHeadings, ...dataArray].map(row => row.join(',')).join('\n');
            // const encodedUri = encodeURI(csvContent);
    
            // const link = document.createElement("a");
            // link.setAttribute("href", encodedUri);
            // // link.setAttribute("download", `${formatDate(localStorage.getItem('fromDate'))} To ${formatDate(localStorage.getItem('toDate'))}.csv`);
            // link.style.display = "none";
    
            // document.body.appendChild(link);
            // link.click();
    
            // document.body.removeChild(link);
            // alert('csv')
        //   } else {
        //     setDialogText('First Date should be less than Second Date to download the CSV file.');
        //     setOpenDialog(true);
        //   }
        // } else {
        //   setDialogText('Select both the Dates to download the CSV file.');
        //   setOpenDialog(true);
        // }
      };
      const [selectedItem1,setSelectedItem1] = useState('Select Incident Type');
      useMemo(() => {
                async function called(){
                  setLoader(true);
                      let data = {
                            selectedDate: dashboardDate,
                            shift:shift
                      }
                      if(shift == "All Shifts"){
                        data = {
                          selectedDate: dashboardDate
                        } 
                      }
                      
                      const res = await fetchReportsInspections(data);
                      console.log(JSON.stringify(res));
                      if(res?.data?.message){
                        console.log(selectedItem1);
                        if(selectedItem1 == 'Total Incidents'){
                          const updatedData = res?.data?.message;
                          setReportsData(updatedData);
                        } else {
                        console.log(selectedItem1)
                        
                        const updateData = selectedItem1 ? res?.data?.message?.filter((item) => item?.IncidentType === (selectedItem1 == "Scissor Lift Safety" ? "Trolley SoP" : selectedItem1)) : res?.data?.message;
                        setReportsData(updateData);
                        }
                        // if(res?.data?.message?.length < ((localStorage?.getItem("reportsPage") || defectPage) * 5)) {
                         
                        //   localStorage.setItem("reportsPage",0);
                        //   setDefectPage(0);
                        // }
                      }else{
                        // localStorage.setItem("reportsPage",0);
                        // setDefectPage(0);
                        setReportsData([]);
                      }
                      setLoader(false);
                }
                called();
      },[dashboardDate,shift,selectedItem1]);
      const [searchTerm, setSearchTerm] = useState('');
      const filteredData = reportsData;

      const handleDetailedView = async (record_id) => {
                const data = {
                  record_id: record_id
                }
                const res = await fetchDetailedView(data);    
                console.log(res);
      }
      const generateLargeDataArray = (rowCount) => {
        const templateRow = ['1', 'MA3BNC62SRB747592', 'YHB4ED23P7400000', '01/01/2024 23:00', '9574-00', 'SPEEDOMETER', 'AC', 'OK', 'SPEEDOMETER', 'AC', 'OK', 'SPEEDOMETER', 'AC', 'OK', 'SPEEDOMETER', 'AC', 'OK'];
        const dataArray = [];
        for (let i = 0; i < rowCount; i++) {
            dataArray.push([...templateRow]);
        }
        return dataArray;
    };
    const dataArray = generateLargeDataArray(1000);
    const handleCSVdata =async () => {
         let remainingparts = [];
         const allPartsResult = "BZ_SW_1(S),BZ_SW_1(A),BZ_SW_1(R),BZ_SW_2(S),BZ_SW_2(A),BZ_SW_2(R),BZ_SW_3(S),BZ_SW_3(A),BZ_SW_3(R),BZ_SW_4(S),BZ_SW_4(A),BZ_SW_4(R),BZ_SW_5(S),BZ_SW_5(A),BZ_SW_5(R),BZ_SW_6(S),BZ_SW_6(A),BZ_SW_6(R),BZ_SW_7(S),BZ_SW_7(A),BZ_SW_7(R),BZ_SW_8(S),BZ_SW_8(A),BZ_SW_8(R),BZ_SW_9(S),BZ_SW_9(A),BZ_SW_9(R),CVR_BOX_IN(S),CVR_BOX_IN(A),CVR_BOX_IN(R),CVR_BOX_OUT(S),CVR_BOX_OUT(A),CVR_BOX_OUT(R),BZ_AS_SW(S),BZ_AS_SW(S),BZ_AS_SW(R),ACC_SKT(S),ACC_SKT(A),ACC_SKT(R),SW_ST_VNT(S),SW_ST_VNT(A),SW_ST_VNT(R),USB_SKT(S),USB_SKT(A),USB_SKT(R),CONT_HVAC(S),CONT_HVAC(A),CONT_HVAC(R),CT_COIL(S),CT_COIL(A),CT_COIL(R),CLMN_CVR(S),CLMN_CVR(A),CLMN_CVR(R),IP_LWR(S),IP_LWR(A),IP_LWR(R),IP_UPR(S),IP_UPR(A),IP_UPR(R),OR_IP_DR(S),OR_IP_DR(A),OR_IP_DR(R),OR_IP_CTR(S),OR_IP_CTR(A),OR_IP_CTR(R),SW_LGT(S),SW_LGT(A),SW_LGT(R),SW_WIP(S),SW_WIP(A),SW_WIP(R),SNSR_AUTO(S),SNSR_AUTO(A),SNSR_AUTO(R),SNSR_SUN(S),SNSR_SUN(A),SNSR_SUN(R),SW_HZD(S),SW_HZD(A),SW_HZD(R),GAR_DR_OUT(S),GAR_DR_OUT(A),GAR_DR_OUT(R),GAR_DR_IN(S),GAR_DR_IN(A),GAR_DR_IN(R),GAR_ASST(S),GAR_ASST(A),GAR_ASST(R),CVR_DRVR(S),CVR_DRVR(A),CVR_DRVR(R),LBL_ACC(S),LBL_ACC(A),LBL_ACC(R),LVR_VT_RH(S),LVR_VT_RH(A),LVR_VT_RH(R),LVR_VT_LH(S),LVR_VT_LH(A),LVR_VT_LH(R),LVR_VT_CTR(S),LVR_VT_CTR(A),LVR_VT_CTR(R),SW_TRNK(S),SW_TRNK(A),SW_TRNK(R),NOZ_DEM_LH(S),NOZ_DEM_LH(A),NOZ_DEM_LH(R),NOZ_DEM_RH(S),NOZ_DEM_RH(A),NOZ_DEM_RH(R),CVR_CTR-UPR(S),CVR_CTR-UPR(A),CVR_CTR-UPR(R),WIR_CHR(S),WIR_CHR(A),WIR_CHR(R),GAR_IP_CTR(S),GAR_IP_CTR(R),GAR_IP_CTR(A)"
         remainingparts = allPartsResult.split(',').map((item) => item.trim());
          const columnHeadings = [ 'DATE', 'SHIFT', 'MODEL','PSN','CHASSIS NUMBER',...remainingparts,'BATCH RESULT'];
                     let data = {
                        selectedDate: dashboardDate,
                        shift: shift
                     }
                  if(shift == "All Shifts"){
                          data = {  selectedDate: dashboardDate};
                  }
                  let childPartNames = [];
                  let values = [];
                  const res1 = await fetchChildParts();
                  
                  if(res1?.data?.message?.length > 0){
                    childPartNames = res1?.data?.message;
                  }
                 let mapPartCodes = childPartNames?.reduce((acc, item) => {
                        acc[String(item.partCode).trim()] = item.partName;
                        return acc;
                      }, {});
                
             
  
              
                  const res = await fetchCSVhandledData(data);
  
                  if(res?.data?.message?.length > 0){
                       
                        values = res?.data?.message;  
                        console.log(values);
                      values = values.map(subArray => 
                         
                          subArray.map((element,index) => {
                            if(index == 3) return element;
                            const mappedElement = resultMapping[String(element).trim()] || element;
                            if(index == 0){
                               return (  (() => {
                                // Parse the timestamp string into a Date object
                                let timestamp = new Date(element);
  
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
                              })())
                            } else if( index == (subArray?.length - 1)) {
                                    if(element == 0) return "NG";
                                    else return "OK";
                            }
                            else{
                                return mappedElement;
                            }
                           
                          }
                        
                        )
                       // subArray.shift();
                      
                        );
                  }
           
        const ws_data = [columnHeadings, ...values]; // Sheet data including headings
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
            ws[cellAddress].s = headerStyle;
        }
        // Apply styles to all cells and specific background color pattern
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
        // Calculate and set column widths
        ws['!cols'] = ws_data[0].map((col, i) => ({
            wch: Math.max(...ws_data.map(row => row[i]?.toString().length || 0)) + 2
        }));
        // Set row heights
        ws['!rows'] = Array(ws_data.length).fill({ hpx: 44 });
        ws['!rows'][0] = { hpx: 26 };
        // Append worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        // Generate file and trigger download
        const wbout = XLSXStyle.write(wb, { bookType: 'xlsx', type: 'binary', bookSST: true, cellStyles: true });
        const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = 'data.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        function s2ab(s) {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
      //  generateExcelReports();
    };

    const generateExcelReports = async () => {
      let data = {
        selectedDate: dashboardDate,
        shift: shift
     }
  // if(shift == "All Shifts"){
  //         data = {  selectedDate: dashboardDate};
  // }
  //     // Fetch the data from the API
  //     const res = await getAllFailedParts(data);
      
      if (true) {
          // Prepare the worksheet data from the API response
         // console.log(res?.data?.message);
          // const backendData = res?.data?.message;
          
          // Define worksheet headers
          const headers = [
              "ID", "DateTime", "Shift", "Incident Type", "Camera Name"
          ];
          
          // Prepare data rows
          const rows = [];
     reportsData.forEach(item => {
                  rows.push([
                      item.id,
                      new Date(item?.datetime)?.toLocaleString(),
                      item?.shift,
                      item?.IncidentType,
                      item?.cameraName
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
          link.download = 'data.xlsx';
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
  const handleMenuClick1 =async (e) => {
    const clickedItem = items.find(item => item.key == e.key);
    if (clickedItem) {
      setSelectedItem1(clickedItem.label);
     // setSelectedItem1((prevItem) => [...prevItem,{label: "All Models",key:"-1"}]);
    }
};

const [items,setItems] = useState([
  {
      label: 'Total Incidents',
      key: '1',
  },
  {
    label: 'PPE Cap',
    key: '2',
  },
  {
    label: 'PPE Gloves',
    key: '3',
  },
  {
    label: 'Scissor Lift Safety',
    key: '4',
  },
  {
    label: 'Accident Scenario',
    key: '5',
  },
  {
    label: 'SoP Stopper',
    key:'6',
  }
]);
      
  const menuProps1 = (
    <Menu onClick={handleMenuClick1}>
      {items?.map((event,index) => (
        <Menu.Item key={event?.key}>{event?.label}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <>
      <Appbar title="Dashboard" />
      <div className='dashboard_main' >
        <div className='dashboard_content_1'>
          <div className='title_date'>
            <div className='title-icon-overview' style={{marginTop:'39px'}}>
              <p className='dashboard_overview_head'>Reports</p>
            </div>
            {/* <div className='dashboard_date_filter' style={{marginTop:'30px'}}>
              <KeyboardArrowLeftIcon style={{color:'#3B4453',width:'18px',height:'18px',cursor:'pointer'}} onClick={handlePreviousDate} />
              <input type='date' max={new Date().toISOString().slice(0, 10)} className='dashboard_date' value={dashboardDate} onChange={handleDashboardDate} />
              {dashboardDate == new Date().toISOString().slice(0, 10) ? <KeyboardArrowRightIcon style={{width:'18px',height:'18px',opacity: 0.2, cursor: 'not-allowed'}} /> : <KeyboardArrowRightIcon style={{color:'#3B4453',width:'18px',height:'18px',cursor:'pointer'}} onClick={handleNextDate} /> }
              <Tooltip title='Reload'>
                <div className='refresh_data' onClick={refreshData}><RefreshIcon /></div>
              </Tooltip>
            </div> */}
          </div>
          <div className='overview_shift'>
            <div className={shift == 'All Shifts' ? 'all' : 'overview_shift_wise'} onClick={()=>{setShift('All Shifts');setDefectPage(0)}}>All Shifts</div>
            <div className={shift == 'shiftA' ? 'a' : 'overview_shift_wise'} onClick={()=>{setShift('shiftA');setDefectPage(0)}}>Shift A</div>
            <div className={shift == 'shiftB' ? 'b' : 'overview_shift_wise'} onClick={()=>{setShift('shiftB');setDefectPage(0)}}>Shift B</div>
          </div>
        </div>


        <div className='dashboard_content_1' style={{marginTop:'24px'}}>
          <div className='overview'>
            <div className='overview_head' style={{height:'40px'}}>
                {/* search bar (mui) */}
                <Dropdown overlay={menuProps1} className='analytics_models_dropdown'>
                        <Button>
                            <Space className='analytics_models_dropdown_button'>
                                {selectedItem1}
                                <DownOutlined />
                            </Space>
                        </Button>
                </Dropdown>
                <div className='dashboard_date_filter' style={{margin:'0px',gap:'12px'}}>
                <button className='reports_export' style={{width:'max-content'}} onClick={() => generateExcelReports()} >
                        <p>Export Accident Scenrios</p>
                        <img src={Export} alt='export' style={{width:'16px',height:'16px'}}/>
                    </button>
                   
                    
                    <input type='date' max={new Date().toISOString().slice(0, 10)} className='dashboard_date' value={dashboardDate} onChange={handleDashboardDate} style={{background:'#f4f5f6'}} />
                    
                    <Tooltip title='Reload'>
                        <div className='refresh_data' onClick={refreshData} style={{background:'#f4f5f6'}}><RefreshIcon /></div>
                    </Tooltip>
                </div>
            </div>
            <div className='overview-table-container' style={{marginTop:'32px'}}>
              <table className='table'>
              <thead>
                  <tr>
                    <th>ID</th>
                    <th>Incident Type</th>
                    {/* <th>PART COUNT</th> */}
                    <th>SHIFT</th>
                    <th>DATE & TIME</th>
                    <th>Camera Name</th>
                  </tr>
                </thead>
                {loader ? (
                  <tbody>
                    <tr>
                      <td align="center" colSpan={9}>
                        <LoadSpinner height='100%' />
                      </td>
                    </tr>
                  </tbody>
                ) : filteredData?.length ? (
                  <>
                    <tbody>
                    {filteredData?.slice(defectPage * 5, (defectPage + 1) * 5).map((data, index) => {
                        return (
                          <tr key={index} className='tr-light'>
                           <td>{index + 1}</td>
                            <td style={{color:'#395DAB',fontWeight:'600',cursor:'pointer'}} >{data?.IncidentType}</td>
                           
                            <td>{data?.shift}</td>
                            <td>
                              {new Date(data?.datetime)?.toLocaleString()}
                          </td>

                            <td>
                             
                                <p style={{fontWeight:'500',fontSize:'14px',lineHeight:'20px',letterSpacing:'1%'}}>{data?.cameraName}</p>
                               
                            </td>
                              </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <td colSpan={9} style={{padding:'0px'}}>
                        <div className='tfoot'>
                          <p style={{fontSize:'14px',fontWeight:'500',lineHeight:'20px',letterSpacing:'1%',color:'#A0A8B0'}}>Page {defectPage + 1} of {Math.ceil(filteredData.length / 5)}</p>
                          <div className='paginated_right'>
                            {defectPage === 0 ? <ChevronLeftIcon style={{ opacity: 0.2, cursor: 'not-allowed' }} /> : <ChevronLeftIcon onClick={() => handleDefectPageChange(defectPage - 1)} style={{ cursor: 'pointer',color:'#707784' }} />}
                            {Array.from({ length: Math.ceil(filteredData.length / 5) }).map((_, index) => {
                              // Calculate the start and end pages for the current group of 5 pages
                              const startPage = Math.floor(defectPage / 5) * 5; // Calculate the start page of the current group
                              const endPage = Math.min(startPage + 4, Math.ceil(filteredData.length / 5) - 1); // Calculate the end page of the current group
                              
                              // Render page numbers within the current group
                              if (index >= startPage && index <= endPage) {
                                return (
                                  <div className={index === defectPage ? 'pagenum' : 'pagenum1'} key={index} onClick={() => handleDefectPageChange(index)}>
                                    <p>{index + 1}</p>
                                  </div>
                                );
                              }
                              // Render null for page numbers outside the current group
                              return null;
                            })}
                            {defectPage + 1 === Math.ceil(filteredData.length / 5) ? <ChevronRightIcon style={{ opacity: 0.2, cursor: 'not-allowed' }} /> : <ChevronRightIcon onClick={() => handleDefectPageChange(defectPage + 1)} style={{ cursor: 'pointer',color:'#707784' }} />}
                          </div>
                        </div>
                      </td>
                    </tfoot>
                  </>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan={9}>
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

      {/* Dialog for note */}
      <Dialog open={dashboardALert} onClose={() => setDashboardAlert(false)}  
        PaperProps={{
        style: {
          background:  '#ffffff' ,
        },
      }}>
        <DialogTitle sx={{color:'#FF5630',fontSize:'24px',fontWeight:'bold'}}>Note!!!</DialogTitle>
        <DialogContent>
          <Typography sx={{color:'#101623',fontSize:'20px'}}>Date field can't be empty.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDashboardAlert(false)} color="primary" sx={{fontWeight:'bold',fontSize:'18px'}} variant='contained'>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
