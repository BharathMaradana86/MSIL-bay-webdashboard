import axios from "axios";


//getRecent5Events
export const getRecent5Events = async (data) => {
    try {
        console.log("data", data);
        const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/reports/getRecent5Events`,data).catch(err => console.log(err))
        return res;
    } catch (error) {
        
    }
}

export const getRecent5Events_1 = async (data) => {
    try {
        console.log("data", data);
        const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/reports/getRecent5Events_1`,data).catch(err => console.log(err))
        return res;
    } catch (error) {
        
    }
}

export const fetchRecordWise = async (data) => {
            try {
                const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/overview/records`,data).catch(err => console.log(err))
                return res;
            } catch (error) {
                
            }
}

export const fetchInspectedRecordsWise = async (data) => {
    try {
        const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/overview/inspectedrecords`,data);
        return res;
    } catch (error) {
        
    }
}

export const fetchSuccessfulInspectedRecordWise = async (data) => {
    try {
        const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/overview/successfulinspectedrecords`,data);
        return res;
    } catch (error) {
        
    }
}

export const getBayWiseData = async (data) => {
    try {
        const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/overview/baywise`,data).catch(err => console.log(err))
        return res;
    } catch (error) {
        
    }
}

export const fetchDefectInspectedRecordWise = async (data) => {
    try {
        const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/overview/defectinspectedrecords`,data);
        console.log(JSON.stringify(res));
        return res;
    } catch (error) {
        
    }
}

export const fetchFailedInspectionWise = async (data) => {
    try {
        const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/overview/failedmodels`,data);
        return res;
    } catch (error) {
        
    }
}

export const fetchFailedInspectionFeedbackWise = async (data) => {
    try {
        const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/overview/failedFeedbackModels`,data);
        return res;
    } catch (error) {
        
    }
}

export const fetchDefectInspectionWise = async (data) => {
    try {
        const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/overview/DefectPartTypesWise`,data);
        return res;
    } catch (error) {
        
    }
}

export const fetchUninspectedPartWise = async (data) => {
    try {
        const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/overview/uninspectedParts`,data);
        return res;
    } catch (error) {
        
    }
}

export const getHandleCSV = async (data) => {
    try{
    const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/reports/handleBaycsv`,data);
    return res;
    } catch(error){

    }
}

export const fetchReportsInspections = async (data) => {
    try {
        const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/reports/generate`,data);
        return res;
    } catch (error) {
        
    }
}

export const fetchDetailedView = async (data) => {
        try {
            const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/reports/getDetailedView`,data);
            return res;
        } catch (error) {
            
        }
}

export const fetchCSVhandledData = async (data) => {
        try {
            const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/reports/handleCSVfiledata`,data);
            return res;
        } catch (error) {
            
        }
}


export const fetchChildParts = async () => {
    try {
        const res = await axios.get(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/reports/getAllParts`);
        return res;
    } catch (error) {
        
    }
}


export const handleInspectedData = async (data) => {
    try {
        const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/reports/getDetailedView`,data);
        return res;
    } catch (error) {
        
    }
}

export const handleModelInspectedData = async (data) => {
    try {
        const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/reports/getModelDetailedView`,data);
        return res;
    } catch (error) {
        
    }
}

export const handleModelInspectedData_1 = async (data) => {
    try {
        const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/reports/getModelDetailedView_1`,data);
        return res;
    } catch (error) {
        
    }
}


export const getModelDetailedViewCount = async (data) => {
    try {
        const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/reports/getModelDetailedViewCount`,data);
        return res;
    } catch (error) {
        
    }
}

export const fetchAllModelDetails = async () => {

    try {
        const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/configure/getAllModelsDetails`);
        return res
    } catch (error) {
        
    }

}

export const handleAddModel = async (data) => {

            try {
                const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/configure/addModel`,data);
                return res;
            } catch (error) {
                
            }

}

export const handleAddChildParts = async (data) => {

            try {
                const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/configure/addChildParts`,data);
                return res;
            } catch (error) {
                
            }

}

export const fetchAllChildParts = async (data) => {

            try {
                let no = '1'
                if(data?.ModelID){
                    no  = data?.ModelID;
                }
                const res = await axios.get(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/configure/getChildParts/${no}`);
                return res;
            } catch (error) {
                
            }

}

export const  handleGetModel = async () => {

            try {
                const res = await axios.get(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/configure/getAllModels`);
                return res;
            } catch (error) {
                
            }

}

export const getTotalVehicle = async (data) => {

            try {
                const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/analytics/getTotalVehicle`,data);
                return res;
            } catch (error) {
                
            }

}


export const getVehicleInspected = async (data) => {

            try {
                const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/analytics/getVehicleInspected`,data);
                return res;
            } catch (error) {
                
            }
}

export const DefectInspectedRecords = async (data) => {

            try {
                const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/analytics/DefectInspectedRecords`,data);
                return res;
            } catch (error) {
                
            }

}

export const getInspectionSummary = async (data) => {
            
            try {
                const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/analytics/getInspectionSummary`,data);
                return res;
            } catch (error) {
                
            }

}

export const getModelSummary = async (data) => {

            try {
                const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/analytics/getModelSummary`,data);
                return res;
            } catch (error) {

            }

}

export const getDefectSummary = async (data) => {

            try {
                const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/analytics/getDefectSummary`,data);
                return res;
            } catch (error) {
                
            }

}

export const getDailyData = async (data) => {

            try {
                const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/analytics/getDailyData`,data);
                return res;
            } catch (error) {
                
            }

}

export const handleDeleteChild = async (data,data1) => {

            try {
                
                const res = await axios.put(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/configure/DeleteChildPart/${data?.entity_hierarchy_id}/${data1?.userName}`);
                return res;
            } catch (error) {
                
            }

}


export const DeleteModel = async (data) => {

            try {
                const res = await axios.put(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/configure/DeleteModel/${data?.ModelID}/${data?.userName}`)
            } catch (error) {
                
            }

}

export const editModel = async (data) => {

            try {
                const res = await axios.put(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/configure/editModel`,data);
                return res;
            } catch (error) {

            }

}

export const handleGroupParts = async () => {

            try {
                const res = await axios.get(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/reports/handleGroupParts`);
                return res;
            } catch (error) {
                
            }

}

export const handleMetaData = async (data) => {

    try {
        const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/reports/metaData`,data);
        return res;
    } catch (error) {
        
    }

}

export const handleLogin = async (data) => {
    
    try {
        const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/auth/signIn`,data, { withCredentials: true });
        return res;
    } catch (error) {
        console.log(error);
        if(error?.response?.data?.message == 'All fields are required') {
            return {data: 'All fields are required'};
    } else if(error?.response?.data?.message == 'Email Not Found! Please Register') {
        return {data: 'Email Not Found! Please Register'};
    } else if(error?.response?.data?.message == 'Password Wrong') {
        return {data: 'Password Wrong'};
    }
    }

}

export const handleRegister = async (data) => {

    try {
        const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/auth/register`,data);
        return res;
    } catch (error) {
        
    }

}

export const handleRefreshToken = async (data) => {

    try {
        const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/auth/refreshToken`,[], { withCredentials: true })
        return res;
    } catch (error) {

        return {data: 'ACCESS DENIED'};
    }

}

export const handleMyProfile = async (data) => {

    try {
        const res = await axios.get(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/auth/myProfile`,{
            headers: {
                'x-token' : localStorage.accessToken
            }
        }, { withCredentials: true });
        return res;
    } catch (error) {
        console.log("error catch",error);
        if(error?.response?.data?.message == 'Forbidden') {
                return {data: 'ACCESS DENIED'};
        } else if(error?.response?.data?.message == 'Email Not Found! Please Register') {
            return {data: 'Email Not Found! Please Register'};
        } else if(error?.response?.data?.message == 'Password Wrong') {
            return {data: 'Password Wrong'};
        } else {
            console.log("catached")
           return handleRefreshToken();
        }
    }
}

export const handleSignOut = async (x) => {

    try {
        console.log("data");
        const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/auth/signOut`,[], { withCredentials: true }).catch((err) => console.log(err));
        console.log(res);
        return "res";
    } catch (error) {
        console.log(error);
    }
}

export const getAllUsers = async () => {

    try {
        const res = await axios.get(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/auth/getAllUsers`);
        return res;
    } catch (error) {
        
    }

}


export const handleChangePassword = async (data) => {

    try {
        const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/auth/changePassword`,data);
        return res;
    } catch (error) {
        
    }

}


export const handleDeleteUser = async (data) => {

    try {
        console.log(data);
        const res = await axios.put(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/auth/deleteUser`,data);
        return res;
    } catch (error) {
        
    }

}


export const getAllVehicles = async () => {

    try {
        const res = await axios.get(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/configure/getAllVehicles`);
        return res;
    } catch (error) {
        
    }


}

export const getAllPartsCodes = async () => {
    try {
        const res = await axios.get(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/settings/allPartCodes`);
        return res;
    } catch (error) {
        
    }
}

export const updateByPass = async (data) => {
    try {
        const res = await axios.put(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/settings/updateByPass`,data);
        return res;
    } catch (error) {
        
    }
}

export const getAllFailedParts = async (data) => {
    try {
        const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/reports/allFailedParts`,data);
        return res;
    } catch (error) {

    }
}

export const getIndividualModelInspectionCount = async (data) => {
    try {
        const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/reports/getIndividualModelInspectionCount`,data);
        return res;
    } catch (error) {

    }
}

export const getBayHeatWise = async (data) => {
    try {
        const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/overview/bayHeatWise`,data);
        return res;
    } catch (error) {  
        console.log(error)
    } 
}
export const updateInactiveModels = async (data) => {
    try {
        const res = await axios.post(`http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/configure/updateInactiveModels`,data);
        return res;
    } catch (error) {
        
    }
}
//SETTING THE JWT TOKEN IN USER'S BROWSER
export const authenticate = (data, next) => {
    // Storing JWT token in user's browser
    if(typeof window !== "undefined"){
        localStorage.setItem("jwt", JSON.stringify(data));
        next();
    }
}

export const resultMapping = {
        "0": "INCORRECT PART",
        "1": "SUCCESS",
        "2": "MISSING",
        "3": "FLIP",
        "4": "INCORRECT POSITION",
        "5": "NOT EVALUATED",
        "6": "MISSING SCREW"
}