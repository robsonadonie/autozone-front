import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"
import {APP_URL} from "../../../process.env"

export const SerieAsyncThunk = createAsyncThunk(
    "serie", async()=>{
        try {
            const result = await axios.get(`${APP_URL}/product-family/level/4`)
            return await result.data
        } catch (error) {
            
        }
    }
)
export const AddSerieAsyncThunk = createAsyncThunk(
    "add-serie", async(data)=>{
        try {
            const result = await axios.post(`${APP_URL}/product-family`,data)
            return await result.data
        } catch (error) {
            
        }
    }
)