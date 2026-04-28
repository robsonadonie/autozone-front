import { createSlice } from "@reduxjs/toolkit";
import { AddMarkProductAsyncThunk, MarkProductAsyncThunk } from "../Async/productMark.async";
export const MarkProductSlice = createSlice({
    name : "mark-prod",
    initialState : {loading : false,data : []},
    reducers : {},
    extraReducers(builder) {
        builder
        .addCase(MarkProductAsyncThunk.pending,(state,_action)=>{
            state.loading = true
        })
        .addCase(MarkProductAsyncThunk.fulfilled,(state,action)=>{
          state.loading = false
          action.payload != undefined ? state.data = action.payload : []
      })
      .addCase(MarkProductAsyncThunk.rejected,(_state,_action)=>{
      })
    },
})
export const AddMarkSlice = createSlice({
    name : "add-Mark-prod",
    initialState : {loading : false,status :{}},
    reducers : {},
    extraReducers(builder) {
        builder
        .addCase(AddMarkProductAsyncThunk.pending,(state,_action)=>{
            state.loading = true
        })
        .addCase(AddMarkProductAsyncThunk.fulfilled,(state,action)=>{
          state.loading = false
      })
      .addCase(AddMarkProductAsyncThunk.rejected,(_state,_action)=>{
      })
    },
})