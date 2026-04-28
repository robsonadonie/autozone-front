import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"
import {APP_URL} from "../../../process.env"

export const MarkProductAsyncThunk = createAsyncThunk(
    "mark-prod", async()=>{
        try {
            const result = await axios.get(`${APP_URL}/product-family/level/5`)
            return await result.data
        } catch (error) {
            
        }
    }
)
export const AddMarkProductAsyncThunk = createAsyncThunk(
    "add-mark-prod", async(data)=>{
        try {
            const result = await axios.post(`${APP_URL}/product-family`,data)
            return await result.data
        } catch (error) {
            
        }
    }
)