import { createSlice } from "@reduxjs/toolkit";
import { AddOrigineAsyncThunk, OrigineAsyncThunk, UpOrigineAsyncThunk } from "../Async/origine.async";
export const AddOrigineSlice = createSlice({
    name : "add-origine",
    initialState : {loading : false,status : {}},
    reducers : {},
    extraReducers(builder) {
        builder
        .addCase(AddOrigineAsyncThunk.pending,(state,_action)=>{
            state.loading = true
        })
        .addCase(AddOrigineAsyncThunk.fulfilled,(state,action)=>{
          state.loading = false
      })
      .addCase(AddOrigineAsyncThunk.rejected,(_state,_action)=>{
      })
    },
})
export const OrigineSlice = createSlice({
    name : "origine",
    initialState : {loading : false,data : []},
    reducers : {},
    extraReducers(builder) {
        builder
        .addCase(OrigineAsyncThunk.pending,(state,_action)=>{
            state.loading = true
        })
        .addCase(OrigineAsyncThunk.fulfilled,(state,action)=>{
          state.loading = false
          action.payload != undefined ? state.data = action.payload : []
      })
      .addCase(OrigineAsyncThunk.rejected,(_state,_action)=>{
      })
    },
})
export const UpOrigineSlice = createSlice({
    name : "up-origine",
    initialState : {loading : false,data : []},
    reducers : {},
    extraReducers(builder) {
        builder
        .addCase(UpOrigineAsyncThunk.pending,(state,_action)=>{
            state.loading = true
        })
        .addCase(UpOrigineAsyncThunk.fulfilled,(state,action)=>{
          state.loading = false
          action.payload != undefined ? state.data = action.payload : []
      })
      .addCase(UpOrigineAsyncThunk.rejected,(_state,_action)=>{
      })
    },
})