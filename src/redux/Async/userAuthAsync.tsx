import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import {APP_URL} from "../../../process.env"

export const userAuthAsync =  createAsyncThunk(
    "get-UserAuth",async()=>{
        try {
            const result = await axios.get(`${APP_URL}/auth`)
            return result.data
        } catch (error) {
            
        }
    }
)
export const OneUserAsync =  createAsyncThunk(
    "get-OneUser",async(id : any)=>{
        try {
            if(id != 0){
                const result = await axios.get(`${APP_URL}/auth/${id}`)
                return result.data

            }else{
                return undefined
            }
        } catch (error) {
            if (!error.response) {
                return 'Le serveur est injoignable';
              }
        }
    }
)
export const AsyncDeletedUser =  createAsyncThunk(
    "del-cltsc",async(id:number)=>{
        try { 
            const result = await axios.delete(`${APP_URL}/auth/${id}`)
            return result.data
        } catch (error) {
            
        }
    }
)

export const LoginAsync =  createAsyncThunk(
    "login",async(data)=>{
        try {
            const result = await axios.post(`${APP_URL}/auth/login`,data)
            return result.data
        } catch (error) {
            
        }
    }
)


export const UpdateuserAuthAsync =  createAsyncThunk(
    "up-UserAuth",async(data)=>{
        try {
            
            const result = await axios.patch(`${APP_URL}/auth/${data[1]}`,data[0])
            return result.data
        } catch (error) {
            
        }
    }
)
export const AdduserAuthAsync =  createAsyncThunk(
    "add-UserAuth",async(data)=>{
        try {
            const result = await axios.post(`${APP_URL}/auth/register`,data)
            return result.data
        } catch (error) {
            
        }
    }
)