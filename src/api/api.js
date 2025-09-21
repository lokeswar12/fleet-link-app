import axios from 'axios';

export const apiCalls = async (apiObj) =>{
    try{
        const configData = {
            url:apiObj?.url,
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method:apiObj?.method,
            data:apiObj?.data,
            params:apiObj?.params
        }
        const response = await axios(configData)
        return response?.data
    } catch (error){
        console.error(`Error in making ${apiObj?.url}`, error.message)
    }
}   