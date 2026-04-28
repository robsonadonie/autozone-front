import { createSlice } from "@reduxjs/toolkit";
import { AddInvoicesAsync, AddMoreInvoicesAsync, DelInvoicesAsync, InvoicesAsync, UpInvoicesAsync } from "../Async/InvoicesASync";

export const InvoicesSlice = createSlice({
    name :"Invoices",
    initialState : {loading :false ,data : []},
    reducers :{},
    extraReducers(builder) {
        builder
        .addCase(InvoicesAsync.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(InvoicesAsync.fulfilled,(state,action)=>{
            state.loading = false
          action.payload != undefined ? state.data = action.payload : []

        })
         .addCase(InvoicesAsync.rejected,(state,action)=>{
            

        })
    },
})
export const AddInvoicesSlice = createSlice({
    name :"add-Invoices",
    initialState : {loading :false ,data : [],status :""},
    reducers :{
        changeStatus (state,_action){
            state.status = ""
        }
    },
    extraReducers(builder) {
        builder
        .addCase(AddInvoicesAsync.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(AddInvoicesAsync.fulfilled,(state,action)=>{
            state.loading = false
            state.status = action.payload
        });
        builder
        .addCase(AddMoreInvoicesAsync.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(AddMoreInvoicesAsync.fulfilled,(state,action)=>{
            state.status = action.payload
            state.loading = false
        })
    },
})
export const {changeStatus} =  AddInvoicesSlice.actions
export const DelInvoicesSlice = createSlice({
    name :"del-Invoices",
    initialState : {loading :false ,status : ""},
    reducers :{
        changeDeleteInv(state,action){
            state.status =""
        }
    },
    extraReducers(builder) {
        builder
        .addCase(DelInvoicesAsync.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(DelInvoicesAsync.fulfilled,(state,action)=>{
            state.loading = false
          action.payload != undefined ? state.status = action.payload : ""

        })
    },
})
export const {changeDeleteInv} = DelInvoicesSlice.actions
export const UpInvoicesSlice = createSlice({
    name :"up-Invoices",
    initialState : {loading :false ,data : []},
    reducers :{},
    extraReducers(builder) {
        builder
        .addCase(UpInvoicesAsync.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(UpInvoicesAsync.fulfilled,(state,action)=>{
            state.loading = false
        //   action.payload != undefined ? state.data = action.payload : []

        })
    },
})