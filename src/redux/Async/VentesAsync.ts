import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import {APP_URL} from "../../../process.env"

export const VentesAsync =  createAsyncThunk(
    "get-ventes",async()=>{
       
        try {
            const result = await axios.get(`${APP_URL}/ventes`)
            return result.data
        } catch (error) {
            
        }
    }
)
export const AddVentesAsync =  createAsyncThunk(
    "add-ventes",async(data)=>{
        try {
            const result = await axios.post(`${APP_URL}/ventes`,data)
            return result.data
        } catch (error) {
                return error.response
        }
    }
)
export const AddMoreVentesAsync =  createAsyncThunk(
    "add-more-ventes",async(data)=>{
        try {
            const result = await axios.post(`${APP_URL}/ventes/more`,data)
            return result.data
        } catch (error) {
                return error.response
        }
    }
)
export const UpdateVentesAsync =  createAsyncThunk(
    "up-ventes",async(data : any)=>{
        try {
            const result = await axios.patch(`${APP_URL}/ventes/${data[0]}`,data[1])
            return result.data
        } catch (error) {
                return error.response
        }
    }
)