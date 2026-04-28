import { createSlice } from "@reduxjs/toolkit";
import { AddMarkAsyncThunk, DelMarkAsyncThunk, MarkAsyncThunk, UpMarkAsyncThunk } from "../Async/mark.async";
export const MarkSlice = createSlice({
    name : "mark",
    initialState : {loading : false,data : []},
    reducers : {},
    extraReducers(builder) {
        builder
        .addCase(MarkAsyncThunk.pending,(state,_action)=>{
            state.loading = true
        })
        .addCase(MarkAsyncThunk.fulfilled,(state,action)=>{
          state.loading = false
          action.payload != undefined ? state.data = action.payload : []
      })
      .addCase(MarkAsyncThunk.rejected,(_state,_action)=>{
      })
    },
})
export const AddMarkSlice = createSlice({
    name : "add-Mark",
    initialState : {loading : false,status :{}},
    reducers : {},
    extraReducers(builder) {
        builder
        .addCase(AddMarkAsyncThunk.pending,(state,_action)=>{
            state.loading = true
        })
        .addCase(AddMarkAsyncThunk.fulfilled,(state,action)=>{
          state.loading = false
      })
      .addCase(AddMarkAsyncThunk.rejected,(_state,_action)=>{
      });
        builder
        .addCase(DelMarkAsyncThunk.pending,(state,_action)=>{
            state.loading = true
        })
        .addCase(DelMarkAsyncThunk.fulfilled,(state,action)=>{
          state.loading = false
      })
      .addCase(DelMarkAsyncThunk.rejected,(_state,_action)=>{
      });

    },
})
export const UpMarkSlice = createSlice({
    name : "up-family",
    initialState : {loading : false },
    reducers : {},
    extraReducers(builder) {
        builder
        .addCase(UpMarkAsyncThunk.pending,(state,_action)=>{
            state.loading = true
        })
        .addCase(UpMarkAsyncThunk.fulfilled,(state,action)=>{
          state.loading = false
          action.payload != undefined ? state.data = action.payload : []
      })
      .addCase(UpMarkAsyncThunk.rejected,(_state,_action)=>{
      })
    },
})