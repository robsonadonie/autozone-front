import { createSlice } from "@reduxjs/toolkit";
import { SerieAsyncThunk } from "../Async/serie.async";
import { AddMarkAsyncThunk } from "../Async/mark.async";
export const SerieSlice = createSlice({
    name : "Serie",
    initialState : {loading : false,data : []},
    reducers : {},
    extraReducers(builder) {
        builder
        .addCase(SerieAsyncThunk.pending,(state,_action)=>{
            state.loading = true
        })
        .addCase(SerieAsyncThunk.fulfilled,(state,action)=>{
          state.loading = false
          action.payload != undefined ? state.data = action.payload : []
      })
      .addCase(SerieAsyncThunk.rejected,(_state,_action)=>{
      })
    },
})
export const AddSerieSlice = createSlice({
    name : "add-Serie",
    initialState : {loading : false,data : []},
    reducers : {},
    extraReducers(builder) {
        builder
        .addCase(AddMarkAsyncThunk.pending,(state,_action)=>{
            state.loading = true
        })
        .addCase(AddMarkAsyncThunk.fulfilled,(state,action)=>{
          state.loading = false
        //   action.payload != undefined ? state.data = action.payload : []
      })
      .addCase(AddMarkAsyncThunk.rejected,(_state,_action)=>{
      })
    },
})