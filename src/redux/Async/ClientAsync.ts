import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import {APP_URL} from "../../../process.env"

export const ClientAsync =  createAsyncThunk(
    "get-clients",async()=>{
        try {
            const result = await axios.get(`${APP_URL}/client`)
            return result.data
        } catch (error) {
            
        }
    }
)
export const AsyncDeletedClient =  createAsyncThunk(
    "del-clt",async(id:number)=>{
        try { 
            const result = await axios.delete(`${APP_URL}/client/${id}`)
            return result.data
        } catch (error) {
            
        }
    }
)
export const UpdateClientAsync =  createAsyncThunk(
    "up-client",async(data)=>{
        try {
            const result = await axios.patch(`${APP_URL}/client/${data[1]}`,data[0])
            return result.data
        } catch (error) {
            
        }
    }
)
export const AddClientAsync =  createAsyncThunk(
    "add-client",async(data)=>{
        try {
            const result = await axios.post(`${APP_URL}/client`,data)
            return result.data
        } catch (error) {
            
        }
    }
)