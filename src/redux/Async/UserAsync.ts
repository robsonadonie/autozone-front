import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import {APP_URL} from "../../../process.env"

export const UserAsync =  createAsyncThunk(
    "get-User",async()=>{
        try {
            const result = await axios.get(`${APP_URL}/person`)
            return result.data
        } catch (error) {
            
        }
    }
)
export const UpdateUserAsync =  createAsyncThunk(
    "up-User",async(data)=>{
        try {
            
            const result = await axios.patch(`${APP_URL}/user/${data[1]}`,data[0])
            return result.data
        } catch (error) {
            
        }
    }
)

export const AddUserAsync =  createAsyncThunk(
    "add-User",async(data)=>{
        try {
            const result = await axios.post(`${APP_URL}/user`,data)
            return result.data
        } catch (error) {
            
        }
    }
)