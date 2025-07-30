import { useState, useEffect } from "react";
import Appbar from "../../components/Appbar/Appbar";
import { ToastContainer } from "react-toastify";
import truck from "../../images/truck.png";
import "../Dashboard/Dashboard.css";

const BayHeatMap = () => {
  const [selectedZone, setSelectedZone] = useState("F Zone");
  const [selectedCamera, setSelectedCamera] = useState("Camera1");
  const [activeTable, setActiveTable] = useState("heatmap");
  const [fullScreenTable, setFullScreenTable] = useState(null);
  const [currentBayPage, setCurrentBayPage] = useState(1);
  const [currentIncidentPage, setCurrentIncidentPage] = useState(1);

  const baysPerPage = 5;
  const incidentsPerPage = 2;

  // Recent Incident Alerts Data
  const recentIncidents = [
    {
      id: 1,
      type: "Safety Violation",
      severity: "High",
      bay: "A6-57",
      truck: "MH12AB1234",
      time: "2 min ago",
      description: "Worker not wearing safety helmet detected in bay area",
      zone: "F Zone"
    },
    {
      id: 2,
      type: "Equipment Issue",
      severity: "Medium",
      bay: "A6-57",
      truck: "MH14CD5678",
      time: "5 min ago",
      description: "Hydraulic lift malfunction reported during unloading process",
      zone: "F Zone"
    },
    {
      id: 3,
      type: "Unauthorized Access",
      severity: "High",
      bay: "A6-57",
      truck: "MH16GH3456",
      time: "8 min ago",
      description: "Unauthorized personnel detected in restricted bay area",
      zone: "F Zone"
    },
    {
      id: 4,
      type: "PPE Violation",
      severity: "Medium",
      bay: "A6-57",
      truck: "MH11IJ7890",
      time: "12 min ago",
      description: "Missing safety vest detected during truck inspection",
      zone: "F Zone"
    },
    {
      id: 5,
      type: "Emergency Stop",
      severity: "High",
      bay: "A6-57",
      truck: "MH13KL2345",
      time: "15 min ago",
      description: "Emergency stop activated due to proximity sensor alert",
      zone: "F Zone"
    },
    {
      id: 6,
      type: "Maintenance Alert",
      severity: "Low",
      bay: "A6-57",
      truck: "MH15MN6789",
      time: "18 min ago",
      description: "Scheduled maintenance reminder for bay lighting system",
      zone: "G Zone"
    }
  ];
  const [bays, setBays] = useState([
    { id: 1, bayId: "A6-57", status: "Occupied", truck: "MH12AB1234", eta: "10 min", occupancy: "85%", zone: "F Zone", camera: "Camera1", dockedTime: "02:15:30", incidentCount: "3" },
    { id: 2, bayId: "A6-57", status: "Occupied", truck: "MH14CD5678", eta: "5 min", occupancy: "92%", zone: "F Zone", camera: "Camera1", dockedTime: "01:45:22", incidentCount: "1" },
    { id: 3, bayId: "A6-57", status: "Available", truck: "MH09EF9012", eta: "15 min", occupancy: "78%", zone: "F Zone", camera: "Camera1", dockedTime: "00:00:00", incidentCount: "0" },
    { id: 4, bayId: "A6-57", status: "Occupied", truck: "MH16GH3456", eta: "3 min", occupancy: "95%", zone: "F Zone", camera: "Camera1", dockedTime: "03:22:15", incidentCount: "2" },
    { id: 5, bayId: "A6-57", status: "Available", truck: "MH11IJ7890", eta: "20 min", occupancy: "67%", zone: "F Zone", camera: "Camera1", dockedTime: "00:00:00", incidentCount: "0" },
    { id: 6, bayId: "A6-57", status: "Occupied", truck: "MH13KL2345", eta: "8 min", occupancy: "88%", zone: "F Zone", camera: "Camera1", dockedTime: "01:30:45", incidentCount: "1" },
    { id: 7, bayId: "A6-57", status: "Available", truck: "MH15MN6789", eta: "12 min", occupancy: "73%", zone: "F Zone", camera: "Camera1", dockedTime: "00:00:00", incidentCount: "0" },
    { id: 8, bayId: "A6-57", status: "Occupied", truck: "MH17OP0123", eta: "6 min", occupancy: "91%", zone: "F Zone", camera: "Camera1", dockedTime: "02:05:18", incidentCount: "4" },
    { id: 9, bayId: "A6-57", status: "Available", truck: "MH18QR4567", eta: "18 min", occupancy: "82%", zone: "F Zone", camera: "Camera1", dockedTime: "00:00:00", incidentCount: "0" },
    { id: 10, bayId: "A6-57", status: "Occupied", truck: "MH19ST8901", eta: "4 min", occupancy: "89%", zone: "F Zone", camera: "Camera1", dockedTime: "01:12:33", incidentCount: "2" },
    { id: 11, bayId: "A6-57", status: "Available", truck: "MH20UV2345", eta: "25 min", occupancy: "71%", zone: "F Zone", camera: "Camera1", dockedTime: "00:00:00", incidentCount: "0" },
    { id: 12, bayId: "A6-57", status: "Available", truck: "MH21AB3456", eta: "14 min", occupancy: "74%", zone: "F Zone", camera: "Camera1", dockedTime: "00:00:00", incidentCount: "0" },
    { id: 13, bayId: "A6-57", status: "Occupied", truck: "MH22CD7890", eta: "7 min", occupancy: "87%", zone: "F Zone", camera: "Camera1", dockedTime: "01:55:42", incidentCount: "1" },
    { id: 14, bayId: "A6-57", status: "Available", truck: "MH23EF1234", eta: "16 min", occupancy: "69%", zone: "F Zone", camera: "Camera1", dockedTime: "00:00:00", incidentCount: "0" },
    { id: 15, bayId: "A6-57", status: "Occupied", truck: "MH24GH5678", eta: "9 min", occupancy: "93%", zone: "F Zone", camera: "Camera1", dockedTime: "02:40:12", incidentCount: "3" },
    { id: 16, bayId: "A6-57", status: "Available", truck: "MH25IJ9012", eta: "11 min", occupancy: "76%", zone: "G Zone", camera: "Camera2", dockedTime: "00:00:00", incidentCount: "0" },
    { id: 17, bayId: "A6-57", status: "Occupied", truck: "MH26KL3456", eta: "13 min", occupancy: "84%", zone: "G Zone", camera: "Camera2", dockedTime: "01:25:58", incidentCount: "2" },
    { id: 18, bayId: "A6-57", status: "Available", truck: "MH27MN7890", eta: "17 min", occupancy: "68%", zone: "H Zone", camera: "Camera3", dockedTime: "00:00:00", incidentCount: "0" },
  ]);

  const filteredBays = bays.filter(bay => 
    bay.zone === selectedZone && bay.camera === selectedCamera
  );

  // Pagination logic for bays
  const totalBayPages = Math.ceil(filteredBays.length / baysPerPage);
  const startBayIndex = (currentBayPage - 1) * baysPerPage;
  const endBayIndex = startBayIndex + baysPerPage;
  const currentBays = filteredBays.slice(startBayIndex, endBayIndex);

  // Pagination logic for incidents
  const totalIncidentPages = Math.ceil(recentIncidents.length / incidentsPerPage);
  const startIncidentIndex = (currentIncidentPage - 1) * incidentsPerPage;
  const endIncidentIndex = startIncidentIndex + incidentsPerPage;
  const currentIncidents = recentIncidents.slice(startIncidentIndex, endIncidentIndex);

  const handleBayPageChange = (pageNumber) => {
    setCurrentBayPage(pageNumber);
  };

  const handleIncidentPageChange = (pageNumber) => {
    setCurrentIncidentPage(pageNumber);
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentBayPage(1);
  }, [selectedZone, selectedCamera]);


  const heatMapData = [
    { etaToA: "5 min", bayName: "A6-57", truckDocket: "MH12AB1234", status: "Available", occupancy: "85%", avgOccupancyDuration: "45 min" },
    { etaToA: "3 min", bayName: "A6-57", truckDocket: "MH14CD5678", status: "Occupied", occupancy: "92%", avgOccupancyDuration: "38 min" },
    { etaToA: "8 min", bayName: "A6-57", truckDocket: "MH09EF9012", status: "Available", occupancy: "78%", avgOccupancyDuration: "52 min" },
    { etaToA: "2 min", bayName: "A6-57", truckDocket: "MH16GH3456", status: "Occupied", occupancy: "95%", avgOccupancyDuration: "41 min" },
    { etaToA: "12 min", bayName: "A6-57", truckDocket: "MH11IJ7890", status: "Available", occupancy: "67%", avgOccupancyDuration: "48 min" },
    { etaToA: "7 min", bayName: "A6-57", truckDocket: "MH21XY3456", status: "Occupied", occupancy: "89%", avgOccupancyDuration: "43 min" },
    { etaToA: "15 min", bayName: "A6-57", truckDocket: "MH22ZA7890", status: "Available", occupancy: "72%", avgOccupancyDuration: "50 min" },
    { etaToA: "4 min", bayName: "A6-57", truckDocket: "MH23BC4567", status: "Occupied", occupancy: "88%", avgOccupancyDuration: "46 min" },
    { etaToA: "9 min", bayName: "A6-57", truckDocket: "MH24DE8901", status: "Available", occupancy: "75%", avgOccupancyDuration: "49 min" },
    { etaToA: "6 min", bayName: "A6-57", truckDocket: "MH25FG2345", status: "Occupied", occupancy: "91%", avgOccupancyDuration: "42 min" },
  ];

  const alertsData = [
    { alertValue: "High", bayName: "A6-57", truckNo: "MH12AB1234", eventType: "Safety Violation", shift: "Morning", dateTimeStamp: "2024-01-15 09:30", incidentImage: "View" },
    { alertValue: "Medium", bayName: "A6-57", truckNo: "MH14CD5678", eventType: "Equipment Issue", shift: "Afternoon", dateTimeStamp: "2024-01-15 14:45", incidentImage: "View" },
    { alertValue: "Low", bayName: "A6-57", truckNo: "MH09EF9012", eventType: "Maintenance", shift: "Evening", dateTimeStamp: "2024-01-15 18:20", incidentImage: "View" },
    { alertValue: "High", bayName: "A6-57", truckNo: "MH16GH3456", eventType: "Security Alert", shift: "Night", dateTimeStamp: "2024-01-15 22:15", incidentImage: "View" },
    { alertValue: "Medium", bayName: "A6-57", truckNo: "MH11IJ7890", eventType: "PPE Violation", shift: "Morning", dateTimeStamp: "2024-01-16 08:45", incidentImage: "View" },
    { alertValue: "High", bayName: "A6-57", truckNo: "MH13KL2345", eventType: "Unauthorized Access", shift: "Afternoon", dateTimeStamp: "2024-01-16 13:30", incidentImage: "View" },
    { alertValue: "Low", bayName: "A6-57", truckNo: "MH15MN6789", eventType: "Routine Check", shift: "Evening", dateTimeStamp: "2024-01-16 19:15", incidentImage: "View" },
    { alertValue: "High", bayName: "A6-57", truckNo: "MH17OP0123", eventType: "Emergency Stop", shift: "Night", dateTimeStamp: "2024-01-16 23:45", incidentImage: "View" },
  ];

  const topAlerts = [
    { alertId: "PPE", bay: "BAY-02", frequency: "15", mostUsedTime: "Morning, Monday" },
    { alertId: "Fire Extincite", bay: "BAY-05", frequency: "8", mostUsedTime: "Afternoon, Tuesday" },
    { alertId: "Shopper", bay: "BAY-01", frequency: "12", mostUsedTime: "Evening, Wednesday" },
    { alertId: "Scissor Lift", bay: "BAY-07", frequency: "6", mostUsedTime: "Morning, Thursday" },
    { alertId: "Person Near Moving Truck", bay: "BAY-03", frequency: "9", mostUsedTime: "Afternoon, Friday" },
    { alertId: "Red Hat Colors", bay: "BAY-04", frequency: "4", mostUsedTime: "Evening, Saturday" },
    { alertId: "Safety Harness", bay: "BAY-06", frequency: "11", mostUsedTime: "Morning, Sunday" },
    { alertId: "Tool Missing", bay: "BAY-08", frequency: "7", mostUsedTime: "Afternoon, Monday" },
    { alertId: "Improper Lifting", bay: "BAY-09", frequency: "5", mostUsedTime: "Evening, Tuesday" },
    { alertId: "Zone Violation", bay: "BAY-10", frequency: "13", mostUsedTime: "Night, Wednesday" },
  ];

  const zones = ["F Zone", "G Zone", "H Zone"];
  const cameras = ["Camera1", "Camera2", "Camera3"];

  const handleAddBay = () => {
    const nextId = bays.length + 1;
    const newBay = { 
      id: nextId, 
      bayId: "A6-57", 
      status: "Available",
      truck: `MH${Math.floor(Math.random() * 20 + 1)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 9000 + 1000)}`,
      eta: `${Math.floor(Math.random() * 25 + 1)} min`,
      occupancy: `${Math.floor(Math.random() * 30 + 60)}%`,
      zone: selectedZone,
      camera: selectedCamera,
      dockedTime: "00:00:00",
      incidentCount: "0"
    };
    
    setBays((prev) => [...prev, newBay]);
    
    // Navigate to last page to show the new bay
    const newFilteredLength = filteredBays.length + 1;
    const newLastPage = Math.ceil(newFilteredLength / baysPerPage);
    setCurrentBayPage(newLastPage);
  };

  const handleDeleteBay = (id) => {
    setBays((prev) => prev.filter((bay) => bay.id !== id));
  };

  const toggleBayStatus = (id) => {
    setBays((prev) =>
      prev.map((bay) =>
        bay.id === id
          ? { ...bay, status: bay.status === "Available" ? "Occupied" : "Available" }
          : bay
      )
    );
  };

  const handleTableClick = (tableType) => {
    setFullScreenTable(tableType);
  };

  const closeFullScreen = () => {
    setFullScreenTable(null);
  };

  // Full Screen Table Component
  const FullScreenTable = ({ type, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-2xl w-11/12 h-5/6 flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">
            {type === 'heatmap' ? 'Heat Map Table' : type === 'alerts' ? 'Alerts Log' : 'Top Alerts - Safety & Bay Monitoring'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          {type === 'heatmap' ? (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Eta to A</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Bay Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Truck Docket</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Occupancy</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Average Occupancy Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {heatMapData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">{row.etaToA}</td>
                    <td className="px-4 py-3 text-gray-800">{row.bayName}</td>
                    <td className="px-4 py-3 text-gray-800">{row.truckDocket}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        row.status === "Occupied"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-800">{row.occupancy}</td>
                    <td className="px-4 py-3 text-gray-800">{row.avgOccupancyDuration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : type === 'alerts' ? (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Alert Value</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Bay Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Truck No</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Event Type</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Shift</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Date Time Stamp</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Incident Image</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {alertsData.map((alert, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        alert.alertValue === "High"
                          ? "bg-red-100 text-red-800"
                          : alert.alertValue === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {alert.alertValue}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-800">{alert.bayName}</td>
                    <td className="px-4 py-3 text-gray-800">{alert.truckNo}</td>
                    <td className="px-4 py-3 text-gray-800">{alert.eventType}</td>
                    <td className="px-4 py-3 text-gray-800">{alert.shift}</td>
                    <td className="px-4 py-3 text-gray-800">{alert.dateTimeStamp}</td>
                    <td className="px-4 py-3 text-blue-600 cursor-pointer hover:underline">{alert.incidentImage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Alert ID</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Bay</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Frequency</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Most Alert Time in a Day Name</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topAlerts.map((alert, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">{alert.alertId}</td>
                    <td className="px-4 py-3 text-gray-800">{alert.bay}</td>
                    <td className="px-4 py-3 text-gray-800">{alert.frequency}</td>
                    <td className="px-4 py-3 text-gray-800">{alert.mostUsedTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ToastContainer />
      <Appbar title="Truck Monitoring System" />
      
      {/* Full Screen Table Overlay */}
      {fullScreenTable && (
        <FullScreenTable 
          type={fullScreenTable} 
          onClose={closeFullScreen}
        />
      )}

      <div
        className="bg-gray-100 min-h-screen"
        style={{
          paddingLeft: "272px",
          paddingTop: "102px",
          paddingRight: "32px",
          paddingBottom: "32px",
        }}
      >
        <div className="flex flex-row gap-6" style={{ width: "100%", height: "calc(100vh - 134px)" }}>
          {/* Left Panel - Live Bay Status */}
          <div className="bg-white shadow-lg rounded-xl" style={{ width: "60%", height: "100%", padding: "16px" }}>
            {/* Compact Header with Filters */}
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-md font-semibold text-gray-800">Live Bay Status</h2>
                  <p className="text-xs text-gray-500">Zone: {selectedZone} | Camera: {selectedCamera}</p>
                </div>
                
                {/* Compact Filters */}
                <div className="flex gap-2">
                  <select
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white min-w-[70px]"
                  >
                    {zones.map((zone, index) => (
                      <option key={index} value={zone}>{zone}</option>
                    ))}
                  </select>
                  <select
                    value={selectedCamera}
                    onChange={(e) => setSelectedCamera(e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white min-w-[80px]"
                  >
                    {cameras.map((camera, index) => (
                      <option key={index} value={camera}>{camera}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <button
                onClick={handleAddBay}
                className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors font-medium"
              >
                + Add Bay
              </button>
            </div>

            {/* Compact Assembly Shop Display */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 mb-3 text-center border border-blue-200">
              <h3 className="text-lg font-bold text-gray-800">Assembly Shop - A</h3>
              <p className="text-xs text-gray-600">{selectedZone} • {filteredBays.length} Bays Active</p>
            </div>

            {/* Bay Cards with Horizontal Layout + Pagination */}
            <div className="flex-1 flex flex-col">
              {/* Horizontal Bay Cards Layout */}
              <div className="flex-1 mb-4">
                <div className="flex gap-3 justify-start">
                  {currentBays.map((bay) => (
                    <div
                      key={bay.id}
                      className={`relative flex-shrink-0 border-2 rounded-lg p-2 text-center cursor-pointer transition-all duration-300 hover:scale-105 shadow-sm ${
                        bay.status === "Occupied"
                          ? "border-orange-400 bg-orange-50 border-dashed"
                          : "border-green-400 bg-green-50 border-dashed"
                      }`}
                      style={{ width: '130px', minHeight: '220px' }}
                      onClick={() => toggleBayStatus(bay.id)}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBay(bay.id);
                        }}
                        className="absolute top-0.5 right-0.5 text-gray-400 hover:text-red-500 font-bold w-3 h-3 flex items-center justify-center rounded-full hover:bg-red-100"
                        style={{ fontSize: '12px' }}
                        title="Remove Bay"
                      >
                        ×
                      </button>
                      
                      {/* Bay ID */}
                      <div className="font-bold text-gray-800 mb-1" style={{ fontSize: '14px' }}>{bay.bayId}</div>
                      
                      {/* Status */}
                      <div className={`font-semibold mb-1 ${
                        bay.status === "Occupied" ? "text-orange-600" : "text-green-600"
                      }`} style={{ fontSize: '11px' }}>
                        {bay.status === "Occupied" ? "Occupied" : "Vacant"}
                      </div>
                      
                      {/* Truck Icon */}
                      <div className="flex justify-center mb-1">
                        <img src={truck} alt="Truck" className="h-4 w-auto object-contain" />
                      </div>
                      
                      {/* Current Truck Details Section */}
                      <div className="bg-gray-200 rounded px-1 py-1 mb-1 text-left">
                        <div className="font-semibold text-gray-700" style={{ fontSize: '10px', lineHeight: '1.2' }}>Current Truck Details:</div>
                        <div className="text-gray-600" style={{ fontSize: '10px', lineHeight: '1.2' }}>
                          Vehicle No: <span className="font-medium">{bay.status === "Occupied" ? bay.truck.slice(-4) : "....."}</span>
                        </div>
                        <div className="text-gray-600" style={{ fontSize: '10px', lineHeight: '1.2' }}>
                          Docked Time: <span className="font-medium">{bay.dockedTime}</span>
                        </div>
                      </div>
                      
                      {/* Overall Bay Summary Section */}
                      <div className="bg-blue-100 rounded px-1 py-1 text-left">
                        <div className="font-semibold text-gray-700" style={{ fontSize: '10px', lineHeight: '1.2' }}>Overall Bay Summary</div>
                        <div className="text-gray-600" style={{ fontSize: '10px', lineHeight: '1.2' }}>
                          Occupancy %: <span className="font-medium">{bay.occupancy}</span>
                        </div>
                        <div className="text-gray-600" style={{ fontSize: '10px', lineHeight: '1.2' }}>
                          Safety Incident Event Count: <span className="font-medium">{bay.incidentCount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bay Pagination Controls */}
              {totalBayPages > 1 && (
                <div className="flex justify-end items-center gap-2 mb-4">
                  <button
                    onClick={() => handleBayPageChange(currentBayPage - 1)}
                    disabled={currentBayPage === 1}
                    className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Prev
                  </button>
                  
                  {Array.from({ length: totalBayPages }, (_, i) => i + 1).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={() => handleBayPageChange(pageNumber)}
                      className={`px-2 py-1 text-xs rounded ${
                        currentBayPage === pageNumber
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handleBayPageChange(currentBayPage + 1)}
                    disabled={currentBayPage === totalBayPages}
                    className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              )}

              {/* Recent Incident Alerts Headlines */}
              <div className="mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-gray-800">🚨 Recent Incident Alerts</h4>
                  <div className="h-px bg-gray-300 flex-1"></div>
                </div>
                
                <div className="mb-4">
                  <div className="overflow-x-auto overflow-y-hidden">
                    <div className="flex gap-3 justify-start" style={{ minWidth: 'max-content' }}>
                      {currentIncidents.map((incident) => (
                        <div
                          key={incident.id}
                          className={`flex-shrink-0 border-l-4 rounded-r-lg p-2 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden ${
                            incident.severity === "High"
                              ? "border-red-500 bg-red-50"
                              : incident.severity === "Medium"
                              ? "border-yellow-500 bg-yellow-50"
                              : "border-blue-500 bg-blue-50"
                          }`}
                          style={{ width: '250px', height: '90px' }}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-1">
                              <span className={`px-1 py-0.5 rounded-full font-bold ${
                                incident.severity === "High"
                                  ? "bg-red-200 text-red-800"
                                  : incident.severity === "Medium"
                                  ? "bg-yellow-200 text-yellow-800"
                                  : "bg-blue-200 text-blue-800"
                              }`} style={{ fontSize: '9px' }}>
                                {incident.severity}
                              </span>
                              <span className="text-gray-500" style={{ fontSize: '9px' }}>{incident.time}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-gray-700 font-semibold" style={{ fontSize: '9px' }}>Bay: {incident.bay}</div>
                            </div>
                          </div>
                          
                          <div className="mb-1">
                            <h5 className="font-semibold text-gray-800 truncate" style={{ fontSize: '10px' }}>{incident.type}</h5>
                            <div className="text-gray-600" style={{ fontSize: '9px' }}>
                              Timestamp: <span className="font-medium">{incident.time}</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center text-gray-500" style={{ fontSize: '8px' }}>
                            <span>Bay: <strong>{incident.bay}</strong></span>
                            <span>Truck: <strong>{incident.truck.slice(-4)}</strong></span>
                            <span>Zone: <strong>{incident.zone}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Incident Pagination Controls */}
                {totalIncidentPages > 1 && (
                  <div className="flex justify-end items-center gap-2 mb-2">
                    <button
                      onClick={() => handleIncidentPageChange(currentIncidentPage - 1)}
                      disabled={currentIncidentPage === 1}
                      className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Prev
                    </button>
                    
                    {Array.from({ length: totalIncidentPages }, (_, i) => i + 1).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        onClick={() => handleIncidentPageChange(pageNumber)}
                        className={`px-2 py-1 text-xs rounded ${
                          currentIncidentPage === pageNumber
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handleIncidentPageChange(currentIncidentPage + 1)}
                      disabled={currentIncidentPage === totalIncidentPages}
                      className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </div>

              {/* Compact Summary Stats */}
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="flex justify-center gap-6">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs font-medium text-gray-600">
                      Available: {filteredBays.filter(bay => bay.status === "Available").length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="text-xs font-medium text-gray-600">
                      Occupied: {filteredBays.filter(bay => bay.status === "Occupied").length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    <span className="text-xs font-medium text-gray-600">
                      Total: {filteredBays.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Tables */}
          <div className="bg-white shadow-lg rounded-xl flex flex-col" style={{ width: "40%", height: "100%", padding: "20px" }}>
            {/* Table Navigation */}
            <div className="flex mb-4 bg-gray-100 rounded-lg p-1 flex-shrink-0">
              <button
                onClick={() => setActiveTable("heatmap")}
                className={`flex-1 py-2 px-2 rounded-md text-xs font-medium transition-colors ${
                  activeTable === "heatmap"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                📊 Heat Map
              </button>
              <button
                onClick={() => setActiveTable("alerts")}
                className={`flex-1 py-2 px-2 rounded-md text-xs font-medium transition-colors ${
                  activeTable === "alerts"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                🚨 Alerts Log
              </button>
              <button
                onClick={() => setActiveTable("topAlerts")}
                className={`flex-1 py-2 px-2 rounded-md text-xs font-medium transition-colors ${
                  activeTable === "topAlerts"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                ⚠️ Top Alerts
              </button>
            </div>

            {/* Table Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {activeTable === "heatmap" && (
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-3 flex-shrink-0">
                    <h4 className="text-md font-semibold text-gray-800">Heat Map Table</h4>
                    <button
                      onClick={() => handleTableClick('heatmap')}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      Expand →
                    </button>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-2 py-2 text-left font-medium text-gray-600 text-xs">Eta to A</th>
                          <th className="px-2 py-2 text-left font-medium text-gray-600 text-xs">Bay</th>
                          <th className="px-2 py-2 text-left font-medium text-gray-600 text-xs">Truck</th>
                          <th className="px-2 py-2 text-left font-medium text-gray-600 text-xs">Status</th>
                          <th className="px-2 py-2 text-left font-medium text-gray-600 text-xs">Occupancy</th>
                          <th className="px-2 py-2 text-left font-medium text-gray-600 text-xs">Duration</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {heatMapData.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-2 py-2 text-gray-800 text-xs">{row.etaToA}</td>
                            <td className="px-2 py-2 text-gray-800 text-xs">{row.bayName}</td>
                            <td className="px-2 py-2 text-gray-800 text-xs">{row.truckDocket.slice(-4)}</td>
                            <td className="px-2 py-2">
                              <span className={`px-1 py-0.5 rounded-full text-xs font-medium ${
                                row.status === "Occupied"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-green-100 text-green-800"
                              }`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="px-2 py-2 text-gray-800 text-xs">{row.occupancy}</td>
                            <td className="px-2 py-2 text-gray-800 text-xs">{row.avgOccupancyDuration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTable === "alerts" && (
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-3 flex-shrink-0">
                    <h4 className="text-md font-semibold text-gray-800">Alerts Log</h4>
                    <button
                      onClick={() => handleTableClick('alerts')}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      Expand →
                    </button>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-2 py-2 text-left font-medium text-gray-600 text-xs">Alert</th>
                          <th className="px-2 py-2 text-left font-medium text-gray-600 text-xs">Bay</th>
                          <th className="px-2 py-2 text-left font-medium text-gray-600 text-xs">Truck</th>
                          <th className="px-2 py-2 text-left font-medium text-gray-600 text-xs">Event</th>
                          <th className="px-2 py-2 text-left font-medium text-gray-600 text-xs">Shift</th>
                          <th className="px-2 py-2 text-left font-medium text-gray-600 text-xs">Image</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {alertsData.map((alert, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-2 py-2">
                              <span className={`px-1 py-0.5 rounded-full text-xs font-medium ${
                                alert.alertValue === "High"
                                  ? "bg-red-100 text-red-800"
                                  : alert.alertValue === "Medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}>
                                {alert.alertValue}
                              </span>
                            </td>
                            <td className="px-2 py-2 text-gray-800 text-xs">{alert.bayName}</td>
                            <td className="px-2 py-2 text-gray-800 text-xs">{alert.truckNo.slice(-4)}</td>
                            <td className="px-2 py-2 text-gray-800 text-xs">{alert.eventType}</td>
                            <td className="px-2 py-2 text-gray-800 text-xs">{alert.shift}</td>
                            <td className="px-2 py-2 text-blue-600 cursor-pointer hover:underline text-xs">{alert.incidentImage}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTable === "topAlerts" && (
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-3 flex-shrink-0">
                    <h4 className="text-md font-semibold text-gray-800">Top Alerts - Safety & Bay Monitoring</h4>
                    <button
                      onClick={() => handleTableClick('topAlerts')}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      Expand →
                    </button>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-2 py-2 text-left font-medium text-gray-600 text-xs">Alert ID</th>
                          <th className="px-2 py-2 text-left font-medium text-gray-600 text-xs">Bay</th>
                          <th className="px-2 py-2 text-left font-medium text-gray-600 text-xs">Frequency</th>
                          <th className="px-2 py-2 text-left font-medium text-gray-600 text-xs">Most Alert Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {topAlerts.map((alert, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-2 py-2 text-gray-800 text-xs">{alert.alertId}</td>
                            <td className="px-2 py-2 text-gray-800 text-xs">{alert.bay}</td>
                            <td className="px-2 py-2 text-gray-800 text-xs">{alert.frequency}</td>
                            <td className="px-2 py-2 text-gray-800 text-xs">{alert.mostUsedTime}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BayHeatMap;
