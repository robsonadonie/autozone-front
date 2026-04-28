import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import {APP_URL} from "../../../process.env"


export const importExcelAsync =  createAsyncThunk(
    "import-excel",async(data)=>{
        try {
            const result = await axios.post(`${APP_URL}/stock/excel`,data)
            return result.data
        } catch (error) {
            
        }
    }
)