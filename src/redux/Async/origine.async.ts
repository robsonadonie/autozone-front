import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"
import {APP_URL} from "../../../process.env"

export const OrigineAsyncThunk = createAsyncThunk(
    "origin", async()=>{
        try {
            const result = await axios.get(`${APP_URL}/origines/all/1`)
            return await result.data
        } catch (error) {
            
        }
    }
)
export const AddOrigineAsyncThunk = createAsyncThunk(
    "add-origin", async(data:FormData)=>{
        try {
            const result = await axios.post(`${APP_URL}/origines`,data)
            return await result.data
        } catch (error) {
            
        }
    }
)
export const UpOrigineAsyncThunk = createAsyncThunk(
    "up-origin", async(data:FormData)=>{
        try {
            const result = await axios.patch(`${APP_URL}/origines/${data[0]}`,data[1])
            return await result.data
        } catch (error) {
            
        }
    }
)