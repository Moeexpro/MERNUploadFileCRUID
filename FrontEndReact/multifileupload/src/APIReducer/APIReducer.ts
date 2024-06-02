import axios from "axios";
import { apiPaths } from "../Enums";


export const uploadFilesAPI = async(payload : {
    filebase64? : string;
    fileName? : string;
}) => {
try{
    const resp = await axios.post(`${apiPaths.base}${apiPaths.uploadFiles}`,payload, {
        
        headers: {
            "Access-Control-Allow-Origin" : "*",
            "Content-Type" : "application/json",
            Accept : "application/json"
        }
    });
    if(resp.status === 200)
    {
        return resp?.data?.message;
    }
}
catch(error : any)
{
    return error.message;
}
}

export const getFilesAPI = async() => {
try{
     console.log(apiPaths.base);
    const resp = await axios.get(`${apiPaths.base}${apiPaths.getFiles}`,{
        headers: {
            "Access-Control-Allow-Origin" : "*",
            "Content-Type" : "application/json",
            Accept : "application/json"
        }
    });
    if(resp.status === 200)
    {
        return resp?.data?.data;
    }
}
catch(error : any)
{
    return error.message;
}
}

export const deleteFileAPI = async(id : string) => {
try {
   const resp = await axios.delete(`${apiPaths.base}${apiPaths.deleteFile}/${id}`,{
        headers: {
            "Access-Control-Allow-Origin" : "*",
            "Content-Type" : "application/json",
            Accept : "application/json"
        }
    });
    if(resp.status === 200)
    {
        return resp?.data?.message;
    }
}
catch(error : any)
{
    console.log("Error",error.message);
}
}