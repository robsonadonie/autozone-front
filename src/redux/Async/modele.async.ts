import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"
import {APP_URL} from "../../../process.env"

export const ModeleAsyncThunk = createAsyncThunk(
    "modele", async()=>{
        try {
            const result = await axios.get(`${APP_URL}/product-family/level/2`)
            return await result.data
        } catch (error) {
            
        }
    }
)