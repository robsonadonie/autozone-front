import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import {APP_URL} from "../../../process.env"

export const AboutAsyncThunk = createAsyncThunk(
    "about",
    async ()=>{
        try {
            const result = await  axios.get(`${APP_URL}/about`)
            return result.data
        } catch (error) {
            
        }
    }
)
export const UpdateAboutAsyncThunk = createAsyncThunk(
    "update-about",
    async (data)=>{
        
        try {
            if(data[0] == undefined){

                const result = await  axios.patch(`${APP_URL}/about/404`,data[1])
                return result.data
            }else{
                const result = await  axios.patch(`${APP_URL}/about/${data[0]}`,data[1])
                return result.data

            }
        } catch (error) {
            
        }
    }
)
