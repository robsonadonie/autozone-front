import { createSlice } from "@reduxjs/toolkit";
import { AddjournauxAsync, DeljournauxAsync, journauxAsync, UpjournauxAsync } from "../Async/journauxAsync";

export const journauxSlice = createSlice({
    name :"journaux",
    initialState : {loading :false ,data : []},
    reducers :{},
    extraReducers(builder) {
        builder
        .addCase(journauxAsync.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(journauxAsync.fulfilled,(state,action)=>{
            state.loading = false
          action.payload != undefined ? state.data = action.payload : []

        })
         .addCase(journauxAsync.rejected,(state,action)=>{
            

        })
    },
})
export const AddjournauxSlice = createSlice({
    name :"add-journaux",
    initialState : {loading :false ,type : ""},
    reducers :{
        changeType(state,_action){
            state.type =""
        }
    },
    extraReducers(builder) {
        builder
        .addCase(AddjournauxAsync.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(AddjournauxAsync.fulfilled,(state,action)=>{
            state.loading = false
          action.payload != undefined ? state.type = action.payload : ""

        })
    },
})
export const  {changeType} = AddjournauxSlice.actions
export const DeljournauxSlice = createSlice({
    name :"del-journaux",
    initialState : {loading :false  ,type : ""},
    reducers :{
        changeDeleteType(state,_action){
            state.type =""
        }
    },
    extraReducers(builder) {
        builder
        .addCase(DeljournauxAsync.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(DeljournauxAsync.fulfilled,(state,action)=>{
            state.loading = false
          action.payload != undefined ? state.type = action.payload : ""
        })
    },
})
export const  {changeDeleteType} =  DeljournauxSlice.actions
export const UpjournauxSlice = createSlice({
    name :"up-journaux",
    initialState : {loading :false ,statusJornals : ""},
    reducers :{
        changeStatusJornals(state,_action){

        }
    },
    extraReducers(builder) {
        builder
        .addCase(UpjournauxAsync.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(UpjournauxAsync.fulfilled,(state,action)=>{
            state.loading = false
          action.payload != undefined ? state.statusJornals = action.payload : ""

        })
    },
})
export const {changeStatusJornals} =  UpjournauxSlice.actions