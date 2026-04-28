import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import {APP_URL} from "../../../process.env"

export const journauxAsync =  createAsyncThunk(
    "get-journaux",async()=>{
        try {
            const result = await axios.get(`${APP_URL}/journaux`)
            return result.data
        } catch (error) {
            
        }
    }
)
export const AddjournauxAsync =  createAsyncThunk(
    "add-journaux",async(data)=>{
        try {
            const result = await axios.post(`${APP_URL}/journaux`,data)
            return result.data
        } catch (error) {
            
        }
    }
)
export const DeljournauxAsync =  createAsyncThunk(
    "del-journaux",async(id)=>{
        
        try {
            const result = await axios.delete(`${APP_URL}/journaux/${id}`)
            return result.data
        } catch (error) {
            
        }
    }
)
export const UpjournauxAsync =  createAsyncThunk(
    "up-journaux",async(data)=>{
        
        try {
            const result = await axios.patch(`${APP_URL}/journaux/${data[0]}`,data[1])
            return result.data
        } catch (error) {
            
        }
    }
)