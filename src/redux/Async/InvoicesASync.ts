import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import {APP_URL} from "../../../process.env"

export const InvoicesAsync =  createAsyncThunk(
    "get-Invoicess",async()=>{
        try {
            const result = await axios.get(`${APP_URL}/facture`)
            
            return await result.data
        } catch (error) {
            
        }
    }
)
export const AddInvoicesAsync =  createAsyncThunk(
    "add-Invoices",async(data)=>{
        try {
            const result = await axios.post(`${APP_URL}/facture`,data)
            return result.data
        } catch (error) {
            
        }
    }
)
export const AddMoreInvoicesAsync =  createAsyncThunk(
    "add-more-Invoices",async(data)=>{
        try {
            const result = await axios.post(`${APP_URL}/facture/more`,data)
            return result.data
        } catch (error) {
            
        }
    }

)

export const DelInvoicesAsync =  createAsyncThunk(
    "del-Invoices",async(data)=>{
        try {
            const result = await axios.post(`${APP_URL}/facture/del`,data)
            return result.data
        } catch (error) {
            
        }
    }

)
 
export const UpInvoicesAsync =  createAsyncThunk(
    "up-Invoices",async(data)=>{
        
        try {
            const result = await axios.patch(`${APP_URL}/facture/${data[0]}`,data[1])
            return result.data
        } catch (error) {
            
        }
    }
)