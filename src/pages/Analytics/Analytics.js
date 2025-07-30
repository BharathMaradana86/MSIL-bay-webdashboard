import React,{useState,useEffect, useMemo} from 'react'
import './Analytics.css'
import Appbar from '../../components/Appbar/Appbar'
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Space ,Menu} from 'antd';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import Percent from '../../images/Percent_1.svg'
import Warning from '../../images/Warning_1.svg'
import Eye from '../../images/Eye_1.svg';
import Vehicle from '../../images/Vehicle_1.svg'
import { CircularProgressbarWithChildren,buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { tableBodyClasses } from '@mui/material';
import DefectsChart from './Charts/DefectsChart';
import DailyInspectionChart from './Charts/DailyInspectionChart';
import { DefectInspectedRecords, getAllVehicles, getDailyData, getDefectSummary, getInspectionSummary, getModelSummary, getTotalVehicle, getVehicleInspected, handleGetModel } from '../../API/api';
const { RangePicker } = DatePicker;


export default function Analytics() {

    const today = dayjs().startOf('day');
        const [selectedItem, setSelectedItem] = useState('All Models');
        const [selectedItem1,setSelectedItem1] = useState('All Vehicles');
        const [masterModels,setmasterModels] = useState('All Models');
        const [range,setRange] = useState([today,today]);
        const handleMenuClick1 =async (e) => {
            console.log('click', e);
            const clickedItem = vehicles.find(item => item.key == e.key);
            if (clickedItem) {
              setSelectedItem1(clickedItem.label);
              if(clickedItem.label === "All Vehicles") {
                console.log(clickedItem.label);
                setItems(masterModels);
                setItems((prevItem) => [...prevItem,{label:"All Models",key: -1}]);
              } else {
              console.log(items);
              let filteredData = await masterModels?.filter(item => item.label.slice(0, 3) === clickedItem?.label.slice(0, 3));
              setItems(filteredData);
              setItems((prevItem) => [...prevItem,{label:"All Models",key: -1}]);
              }
             // setSelectedItem1((prevItem) => [...prevItem,{label: "All Models",key:"-1"}]);
            }
        };
        const handleMenuClick = (e) => {
            console.log('click', e);
            const clickedItem = items.find(item => item.key == e.key);
            if (clickedItem) {
              setSelectedItem(clickedItem.label);
            }
            
        };
        const [vehicles,setVehicles] = useState([
            {
                label: 'All Models',
                key: '1',
            },
            {
              label: '1st menu item',
              key: '2',
            },
            {
              label: '2nd menu item',
              key: '3',
            },
            {
              label: '3rd menu item',
              key: '4',
            },
            {
              label: '4rd menu item',
              key: '5',
            },
          ]);
      const [items,setItems] = useState([
        {
            label: 'All Models',
            key: '1',
        },
        {
          label: '1st menu item',
          key: '2',
        },
        {
          label: '2nd menu item',
          key: '3',
        },
        {
          label: '3rd menu item',
          key: '4',
        },
        {
          label: '4rd menu item',
          key: '5',
        },
      ]);
      const menuProps =(
        <Menu onClick={handleMenuClick}>
          {items.map((item) => (
            <Menu.Item key={item.key}>{item.label}</Menu.Item>
          ))}
        </Menu>
      );
      const menuProps1 = (
        <Menu onClick={handleMenuClick1}>
          {vehicles.map((vehicle) => (
            <Menu.Item key={vehicle.key}>{vehicle.label}</Menu.Item>
          ))}
        </Menu>
      );
      const [fromDate,setFromDate] = useState();
      const [toDate,setToDate] = useState();
      const onRangeChange = (dates, dateStrings) => {
        if (dates) {
          console.log('From: ', dates[0], ', to: ', dates[1]);
          console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
          setFromDate(dateStrings[0]);
          setToDate(dateStrings[1]);
          setRange(dates)

        } else {
          console.log('Clear');
        }
      };
      
      const rangePresets = [
        {
          label: 'Yesterday',
          value: [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')],
        },
        {
          label: 'Day Before Yesterday',
          value: [dayjs().subtract(2, 'day').startOf('day'), dayjs().subtract(2, 'day').endOf('day')],
        },
        {
          label: 'This Week',
          value: [dayjs().startOf('week'), dayjs()],
        },
        {
          label: 'This Month',
          value: [dayjs().startOf('month'), dayjs()],
        },
        {
          label: 'This Year',
          value: [dayjs().startOf('year'), dayjs()],
        },
      ];

      const [shift,setShift] = useState('All Shifts')

      const [percentages, setPercentages] = useState([0, 0]); // Initial values
      
      useEffect(() => {
          // Simulating data fetch from backend
          const fetchData = async () => {
                        const veh = await getAllVehicles();
                        if(veh?.data?.message) {
                            console.log(veh);
                        const values1 = await (veh?.data?.message)?.map((item,index) => { return {label: item?.Vehicles, key:index }})
                        setVehicles(values1);
                        setVehicles((prevItem) => [...prevItem,{label: "All Vehicles",key: "-1"}])
                        const res = await handleGetModel();
                        if(res?.data?.message) {

                            const values = await (res?.data?.message)?.map((item,index) =>{ return { label: item?.Model, key: index } });
                            setItems(values);
                            setmasterModels(values);
                            setItems((prevItem) => [...prevItem,{label: "All Models",key:"-1"}]);
                           
                        }
                }

          };
  
          fetchData();
      }, []);
      
      const [totalVehicles,settv] = useState("0");
      const [vehicleInspected,setvi] = useState("0");
      const [defects,setDefects] = useState("0");
      const [pieData,setpd] = useState([{"Success":"0","NOT_Success":"0","MISSING":"0","FLIP":"0","INCORRECT_POSITION":"0","NOT_EVALUATED":"0","MISSING_SCREW":"0"}]); 
      const [mapItems,setmpi] = useState([{"code":"YHB23D2BP0600000","SUCCESS":"0","NOT_SUCCESS":"1","MISSING":"0","FLIP":"0","INCORRECT_POSITION":"0","NOT_EVALUATED":"0"},{"code":"YHB23D7CP0700000","SUCCESS":"0","NOT_SUCCESS":"1","MISSING":"0","FLIP":"0","INCORRECT_POSITION":"0","NOT_EVALUATED":"0"}]);
      const [defectSummary,setDefectSummary] = useState([0,0,0,0]);
      const [dailyData,setdailyData] = useState([]);
      useEffect(() => {

                    async function called(){
                                       
                        if(selectedItem && fromDate && toDate) {
                                           
                                            let data = {
                                                fromDate: fromDate,
                                                toDate: toDate,
                                                vehicle: selectedItem1,
                                                model: selectedItem
                                            }
                                            if(shift !== "All Shifts") {data = {
                                                fromDate: fromDate,
                                                toDate: toDate,
                                                shift: shift,
                                                vehicle: selectedItem1,
                                                model: selectedItem
                                            }}
                                            
                                            const res = await getTotalVehicle(data);
                                            if(res?.data?.message){
                                                    settv(res?.data?.message?.length);
                                            }
                                            const res1 = await getVehicleInspected(data);
                                            if(res1?.data?.message) {
                                                    setvi(res1?.data?.message?.length);
                                            }
                                            const res2 = await DefectInspectedRecords(data);
                                            console.log("defect"+JSON.stringify(res2));
                                            if(res2?.data?.message >= 0) {
                                                    setDefects(res2?.data?.message);
                                            }
                                            const res3 = await getInspectionSummary(data);
                                            if(res3?.data?.message){
                                                console.log(JSON.stringify(res3?.data?.message));
                                                    setpd(res3?.data?.message);
                                            }
                                            const res4 = await getModelSummary(data);
                                            if(res4?.data?.message){
                                                console.log(JSON.stringify(res4?.data?.message));
                                                setmpi(res4?.data?.message);
                                            }
                                            const res5 = await getDefectSummary(data);
                                            if(res5?.data?.message) {
                                                    const result = (res5?.data?.message)[0];
                                            
                                                  const xAxis = [(result?.MISSING) ? (result?.MISSING) : 0,(result?.INCORRECT_POSITION) ? (result?.INCORRECT_POSITION) : 0,result?.FLIP ? result?.FLIP : 0,(result?.MISSING_SCREW) ? (result?.MISSING_SCREW) : 0];
                                                  setDefectSummary(xAxis);
                                            }
                                            const res6 = await getDailyData(data);
                                            console.log(JSON.stringify(res6?.data?.message));
                                            if(res6?.data?.message){
                                                const success = [];
                                                const failure = [];
                                                const date = [];
                                              
                                                const result = (res6?.data?.message)?.map((item) =>{ success.push(item?.Success);
                                                            failure.push(`-${item?.NOT_Success}`);
                                                            date.push(item?.datetime);

                                                });
                                                 console.log(result)
                                                 console.log(success,failure,date)
                                                setdailyData([success,failure,date]);
                                            }

                        }
                                       
                    }
                    called();
      },[fromDate,toDate,shift,selectedItem,selectedItem1,range]);
      const radius = 85;
      const circumference = 2 * Math.PI * radius;
  
      const [firstPercent, secondPercent] = percentages;
      const firstDasharray = (firstPercent / 100) * circumference;
      const secondDasharray = (secondPercent / 100) * circumference;

      
    //   const mapItems = Array.from({ length: 10 }, (_, index) => ({
    //     id: index,
    //     code: `YHB23D2BP0600001${index}`,
    //     value1: 10,  
    //     value2: 5,  
    //   }));


     // console.log((Math.ceil((pieData[0]?.Success)/(pieData[0]?.Success + pieData[0]?.NOT_Success)) * 100))

  return (
    <div>
        <Appbar />
        <div className='analytics_main'>
            <div>
            <div className='analytics_title_filters'>
                <p className='analytics_title_text'>Analytics</p>
                <div className='analytics_filters'>
                    <Dropdown overlay={menuProps1} className='analytics_models_dropdown'>
                        <Button>
                            <Space className='analytics_models_dropdown_button'>
                                {selectedItem1}
                                <DownOutlined />
                            </Space>
                        </Button>
                    </Dropdown>
                   <Dropdown overlay={menuProps} className='analytics_models_dropdown'>
                        <Button>
                            <Space className='analytics_models_dropdown_button_1'>
                                {selectedItem}
                                <DownOutlined />
                            </Space>
                        </Button>
                    </Dropdown>
                    <RangePicker presets={rangePresets}  format="YYYY/MM/DD HH"  value={range} showTime={{ format: 'HH' }} onChange={onRangeChange} className='analytics_models_dropdown' />
                </div>
            </div>

            <div className='overview_shift' style={{marginTop:'23px'}}>
                <div className={shift == 'All Shifts' ? 'all' : 'overview_shift_wise'} onClick={()=>setShift('All Shifts')}>All Shifts</div>
                <div className={shift == 'shiftA' ? 'a' : 'overview_shift_wise'} onClick={()=>setShift('shiftA')}>Shift A</div>
                <div className={shift == 'shiftB' ? 'b' : 'overview_shift_wise'} onClick={()=>setShift('shiftB')}>Shift B</div>
            </div>


            <div className='analytics_content_box'>
                <div className='analytics_content'>
                    <div className='analytics_icon_bg' style={{backgroundColor:'#DAE3F5'}}>
                        <img src={Vehicle} alt='vehicle'  />
                    </div>
                    <div className='analytics_matter'>
                        <p className='analytics_matter_text_1'>Total Vehicles</p>
                        <p className='analytics_matter_text_2'>{totalVehicles ? totalVehicles : 0}</p>
                    </div>
                </div>
                <div className='analytics_content'>
                    <div className='analytics_icon_bg' style={{backgroundColor:'#d7f0e5'}}>
                        <img src={Eye} alt='vehicle'  />
                    </div>
                    <div className='analytics_matter'>
                        <p className='analytics_matter_text_1'>Vehicles Inspected</p>
                        <p className='analytics_matter_text_2'>{vehicleInspected ? vehicleInspected : 0}</p>
                    </div>
                </div>
                <div className='analytics_content'>
                    <div className='analytics_icon_bg' style={{backgroundColor:'#fec'}}>
                        <img src={Warning} alt='vehicle'  />
                    </div>
                    <div className='analytics_matter'>
                        <p className='analytics_matter_text_1'>Total Defects</p>
                        <p className='analytics_matter_text_2'>{defects ? defects : 0}</p>
                    </div>
                </div>
                <div className='analytics_content'>
                    <div className='analytics_icon_bg' style={{backgroundColor:'#ffddd6'}}>
                        <img src={Percent} alt='vehicle'  />
                    </div>
                    <div className='analytics_matter'>
                        <p className='analytics_matter_text_1'>Defects Per 100 Vehicles</p>
                        <p className='analytics_matter_text_2'>{(vehicleInspected !== 0 && defects !== 0) ? (Math.round((defects/vehicleInspected)*100)) : 0}%</p>
                    </div>
                </div>
            </div>


            <div className='analytics_charts'>
                <div className='analytics_chart_1'>
                    <div className='analytics_chart'>

                        <div className='analytics_chart_head'>
                            <div className='analytics_chart_head_empty_div'></div>
                            <p className='analytics_chart_head_text'>Inspection Summary</p>
                        </div>

                        <div className='analytics_chart_1_content'>
                            <div className='analytics_circular_progress_bar'>
                                {console.log(pieData[0]?.Success / (pieData[0]?.Success + pieData[0]?.NOT_Success))}
                                { ((parseInt(pieData[0]?.Success)) + parseInt(pieData[0]?.NOT_Success)) > 0 ?  <CircularProgressbarWithChildren value={(parseInt(pieData[0]?.Success)) == 0 ? ((parseInt(pieData[0]?.NOT_Success)) / ((parseInt(pieData[0]?.NOT_Success)) + (parseInt(pieData[0]?.Success))) * 100) : ((parseInt(pieData[0]?.Success)) / ((parseInt(pieData[0]?.NOT_Success)) + (parseInt(pieData[0]?.Success))) * 100)  }
                                styles={buildStyles({
                                    pathColor:  parseInt(pieData[0]?.Success) == 0 ? '#D3D6DA' : '#395DAB',
                                    trailColor: '#D3D6DA',
                                  })}>
                                    <div className='analytics_circular_progress_bar_content'>
                                        <p className='analytics_circular_progress_bar_content_text'>Total Inspections</p>
                                        <p className='analytics_circular_progress_bar_content_count'>{(pieData && pieData[0] && ( parseInt(pieData[0]?.Success))+ (parseInt(pieData[0]?.NOT_Success))) ? (( parseInt(pieData[0]?.Success))+ (parseInt(pieData[0]?.NOT_Success))) : 0 }</p>
                                    </div>
                                </CircularProgressbarWithChildren> :
                                <div className='analytics_circular_progress_bar_content' >
                                <p className='analytics_circular_progress_bar_content_text'>Total Inspections</p>
                                <p className='analytics_circular_progress_bar_content_count'>{(pieData && pieData[0] && ( parseInt(pieData[0]?.Success))+ (parseInt(pieData[0]?.NOT_Success))) ? (( parseInt(pieData[0]?.Success))+ (parseInt(pieData[0]?.NOT_Success))) : 0 }</p>
                                </div>
                                }
                            </div>
                            <div className='analytics_sidebar_content'>
                                <div className='analytics_sidebar_content_items'>
                                    <div className='analytics_sidebar_content_item'>
                                        <div className='analytics_sidebar_content_item_symbol' style={{backgroundColor:'#395dab'}}></div>
                                        <p className='analytics_sidebar_content_item_text'>Successful Inspections</p>
                                    </div>
                                    <p className='analytics_sidebar_content_item_count'>{(pieData && pieData[0] && pieData[0]?.Success) ? pieData[0].Success : 0}</p>
                                </div>
                                <div className='analytics_sidebar_content_items'>
                                    <div className='analytics_sidebar_content_item'>
                                        <div className='analytics_sidebar_content_item_symbol' style={{backgroundColor:'#d3d6da'}}></div>
                                        <p className='analytics_sidebar_content_item_text'>Failed Inspections</p>
                                    </div>
                                    <p className='analytics_sidebar_content_item_count'>{(pieData && pieData[0] && pieData[0]?.NOT_Success) ? pieData[0]?.NOT_Success : 0}</p>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div className='analytics_chart' style={{paddingBottom:'56px'}}>
                        <div className='analytics_chart_head'>
                            <div className='analytics_chart_head_empty_div'></div>
                            <p className='analytics_chart_head_text'>Defects Summary</p>
                        </div>
                        <div className='analytics_bar_chart_1'>
                            <DefectsChart data={defectSummary}/>
                        </div>
                    </div>
                </div>
                <div className='analytics_chart_2'>
                    <div className='analytics_chart_head'>
                        <div className='analytics_chart_head_empty_div'></div>
                        <p className='analytics_chart_head_text'>Model Summary</p>
                    </div>
                    <div className='analytics_chart_2_content'>
                        <div className='analytics_chart_2_sub_content'>

                        {mapItems.map((item) => (
                            <div key={item.id} className='analytics_chart_2_sub_content_elements'>
                            <p className='analytics_chart_2_sub_content_elements_text'>{item.code}</p>
                            <div className='analytics_chart_2_sub_content_element'>
                                <div className='analytics_chart_2_sub_content_element_child'>
                                    <div
                                        className='analytics_chart_2_sub_content_sub_element_child_div' 
                                        style={{ backgroundColor: '#395dab',width: (parseInt(item?.Success) == 0) ? '10px' : (parseInt(item?.NOT_Success) == 0) ? '296px' :  (parseInt(item?.NOT_Success) > parseInt(item?.Success)) ? (parseInt(item?.Success) / parseInt(item?. NOT_Success)) * 296  : '296px'   }}
                                    ></div>
                                    <p className='analytics_chart_2_sub_content_sub_element_child_div_text'>{item?.Success}</p>
                                </div>
                                <div className='analytics_chart_2_sub_content_element_child'>
                                    <div
                                        className='analytics_chart_2_sub_content_sub_element_child_div'
                                        style={{ backgroundColor: '#d3d6da',width: (parseInt(item?.NOT_Success) == 0) ? '10px' : (parseInt(item?.Success) == 0) ? '296px' :  (parseInt(item?.Success) > parseInt(item?.NOT_Success)) ? (parseInt(item?.NOT_Success) / parseInt(item?. Success)) * 296  : '296px'    }}
                                    ></div>
                                    <p className='analytics_chart_2_sub_content_sub_element_child_div_text'>{item?.NOT_Success}</p>
                                </div>
                            </div>
                            </div>
                        ))}

                            

                        </div>
                        <div className='analytics_chart_2_sub_content_1'>
                            <div className='analytics_chart_2_sub_content_1_line'></div>
                            <div className='analytics_chart_2_sub_content_items'>
                                <div className='analytics_chart_2_sub_content_item'>
                                    <div className='analytics_chart_2_sub_content_item_symbol' style={{backgroundColor:'#395dab'}}></div>
                                    <p className='analytics_chart_2_sub_content_item_text'>Successful Inspections</p>
                                </div>
                                <div className='analytics_chart_2_sub_content_item'>
                                    <div className='analytics_chart_2_sub_content_item_symbol' style={{backgroundColor:'#d3d6da'}}></div>
                                    <p className='analytics_chart_2_sub_content_item_text'>Failed Inspections</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='analytics_charts_1'>
                <div className='analytics_chart_head'>
                    <div className='analytics_chart_head_empty_div'></div>
                    <p className='analytics_chart_head_text'>Daily Inspections</p>
                </div>
                <div className='analytics_charts_1_bar_chart'>
                    <DailyInspectionChart dailyData={dailyData}/>
                </div>
                <div className='analytics_charts_1_bar_chart_footer'>
                    <div className='analytics_charts_1_bar_chart_footer_item'>
                        <div className='analytics_charts_1_bar_chart_footer_item_symbol' style={{backgroundColor:'#395dab'}}></div>
                        <p className='analytics_charts_1_bar_chart_footer_item_text'>Successful Inspections</p>
                    </div>
                    <div className='analytics_charts_1_bar_chart_footer_item'>
                        <div className='analytics_charts_1_bar_chart_footer_item_symbol' style={{backgroundColor:'#d3d6da'}}></div>
                        <p className='analytics_charts_1_bar_chart_footer_item_text'>Failed Inspections</p>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
  )
}
