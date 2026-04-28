import { createSlice } from "@reduxjs/toolkit";
import { StockAsync } from "../Async/stockAsync";
import { AddMoreVentesAsync, AddVentesAsync, UpdateVentesAsync, VentesAsync } from "../Async/VentesAsync";

export const VentesSlice = createSlice({
    name :"ventes",
    initialState : {loading :false ,data : []},
    reducers :{},
    extraReducers(builder) {
        builder
        .addCase(VentesAsync.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(VentesAsync.fulfilled,(state,action)=>{
            state.loading = false
          action.payload != undefined ? state.data = action.payload : []

        })
    },
})
export const UpVentesSlice = createSlice({
    name :"upventes",
    initialState : {loading :false ,status : ""},
    reducers :{
        changeUpdateStatus(state,_action){
            state.status = ""
        }
    },
    extraReducers(builder) {
        builder
        .addCase(UpdateVentesAsync.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(UpdateVentesAsync.fulfilled,(state,action)=>{
            state.loading = false
            state.status = action.payload
        })
    },
})
export const AddVentesSlice = createSlice({
    name :"add-ventes",
    initialState : {loading :false ,venteIds:[],msg :""},
    reducers :{
        changeMsg(state,action){
            state.venteIds = []
        }
    },
    extraReducers(builder) {
        builder
        .addCase(AddVentesAsync.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(AddVentesAsync.fulfilled,(state,action)=>{
            state.loading = false
            if(typeof(action.payload) == "string"){

                state.msg = String(action.payload)
            }else{
    
                state.venteIds = action.payload
            }
            
            
        });

        builder
        .addCase(AddMoreVentesAsync.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(AddMoreVentesAsync.fulfilled,(state,action)=>{
            state.loading = false
        if(typeof(action.payload) == "string"){

            state.msg = String(action.payload)
        }else{

            state.venteIds = action.payload
        }


        })
        .addCase(AddMoreVentesAsync.rejected,(state,action)=>{

        })
        
    },
    
})
export const{ changeMsg} = AddVentesSlice.actions
export const{ changeUpdateStatus} = UpVentesSlice.actions