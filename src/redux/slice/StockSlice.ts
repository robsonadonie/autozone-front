import { createSlice } from "@reduxjs/toolkit";
import { AddStockAsync, DelStockAsync, StockAsync, UpStockAsync } from "../Async/stockAsync";

export const StockSlice = createSlice({
    name :"stock",
    initialState : {loading :false ,data : []},
    reducers :{},
    extraReducers(builder) {
        builder
        .addCase(StockAsync.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(StockAsync.fulfilled,(state,action)=>{
            (action.payload != undefined) ? state.data = action.payload : []
            state.loading = false
            
        })
         .addCase(StockAsync.rejected,(state,action)=>{
            

        })
    },
})
export const AddStockSlice = createSlice({
    name :"add-stock",
    initialState : {loading :false ,data : []},
    reducers :{},
    extraReducers(builder) {
        builder
        .addCase(AddStockAsync.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(AddStockAsync.fulfilled,(state,action)=>{
            state.loading = false
        //   action.payload != undefined ? state.data = action.payload : []

        })
    },
})
export const UpStockSlice = createSlice({
    name :"up-stock",
    initialState : {loading :false ,status :""},
    reducers :{
        changeStatusStock(state,_action){
            state.status =""
        }
    },
    extraReducers(builder) {
        builder
        .addCase(UpStockAsync.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(UpStockAsync.fulfilled,(state,action)=>{
            state.loading = false
          action.payload != undefined ? state.status = action.payload : ""

        });
        builder
        .addCase(DelStockAsync.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(DelStockAsync.fulfilled,(state,action)=>{
            state.loading = false
          action.payload != undefined ? state.status = action.payload : ""

        });
    },
})
export const {changeStatusStock} = UpStockSlice.actions