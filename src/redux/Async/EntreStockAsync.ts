import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import {APP_URL} from "../../../process.env"

export const EntreStockAsync =  createAsyncThunk(
    "get-entrestock",async()=>{
        try {
            const result = await axios.get(`${APP_URL}/achats`)
            return result.data
        } catch (error) {
            
        }
    }
)
export const AddEntreStockAsync =  createAsyncThunk(
    "add-entrestock",async(data)=>{
        try {
            const result = await axios.post(`${APP_URL}/achats`,data)
            return result.data
        } catch (error) {
            
        }
    }
)
// export const UpStockAsync =  createAsyncThunk(
//     "up-stock",async(data)=>{
//         try {
//             const result = await axios.patch(`${APP_URL}/stock/${data[0]}`,data[1])
//             return result.data
//         } catch (error) {
            
//         }
//     }
// )