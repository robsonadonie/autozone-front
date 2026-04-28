import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"
import {APP_URL} from "../../../process.env"

export const MarkAsyncThunk = createAsyncThunk(
    "mark", async()=>{
        try {
            const result = await axios.get(`${APP_URL}/product-family/level/1`)
            return await result.data
        } catch (error) {
            
        }
    }
)
export const AddMarkAsyncThunk = createAsyncThunk(
    "add-mark", async(data)=>{
        try {
            const result = await axios.post(`${APP_URL}/product-family`,data)
            return await result.data
        } catch (error) {
        }
    }
)
export const DelMarkAsyncThunk = createAsyncThunk(
    "del-mark", async(id)=>{
        try {
            const result = await axios.delete(`${APP_URL}/product-family/${id}`)
            return await result.data
        } catch (error) {
            
        }
    }
)
export const UpMarkAsyncThunk = createAsyncThunk(
    "up-mark", async(data)=>{
        try {
            const result = await axios.patch(`${APP_URL}/product-family/${data[0]}`,data[1])
            return await result.data
        } catch (error) {
            
        }
    }
)