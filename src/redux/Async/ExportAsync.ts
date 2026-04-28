import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import {APP_URL} from "../../../process.env"

export const ExportAsyncThunk = createAsyncThunk(
    "stock/export-excel",
    async (num : string)=>{
        try {
            const result = await  axios.get(`${APP_URL}/stock/export/${num}`)
            return result.data
        } catch (error) {
            
        }
    }
)
 
 