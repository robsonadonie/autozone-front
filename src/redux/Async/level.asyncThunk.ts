import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"
import {APP_URL} from "../../../process.env"

export const LevelAsyncThunk = createAsyncThunk(
    "level", async()=>{
        try {
            const result = await axios.get(`${APP_URL}/product-level/all/1`)
            return result.data
        } catch (error) {
            
        }
    }
)