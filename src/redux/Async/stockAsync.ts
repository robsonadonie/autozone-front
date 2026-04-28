import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import {APP_URL} from "../../../process.env"

export const StockAsync =  createAsyncThunk(
    "get-stock",async()=>{
        try {
            const result = await axios.get(`${APP_URL}/stock`)
            return result.data
        } catch (error) {
            
        }
    }
)
export const AddStockAsync =  createAsyncThunk(
    "add-stock",async(data)=>{
        try {
            const result = await axios.post(`${APP_URL}/stock`,data)
            return result.data
        } catch (error) {
            
        }
    }
)
export const UpStockAsync =  createAsyncThunk(
    "up-stock",async(data)=>{
        
        try {
            const result = await axios.patch(`${APP_URL}/stock/${data[0]}`,data[1])
            return result.data
        } catch (error) {
            
        }
    }
)
export const DelStockAsync =  createAsyncThunk(
    "del-stock",async(id)=>{
        
        try {
            const result = await axios.delete(`${APP_URL}/stock/${id}`)
            return result.data
        } catch (error) {
            
        }
    }
)