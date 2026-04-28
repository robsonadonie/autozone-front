import { createSlice } from "@reduxjs/toolkit";
import { LevelAsyncThunk } from "../Async/level.asyncThunk";

export const LevelSlice = createSlice({
    name : "level",
    initialState : {loading : false,data : []},
    reducers : {},
    extraReducers(builder) {
        builder
        .addCase(LevelAsyncThunk.pending,(state,_action)=>{
            state.loading = true
        })
        .addCase(LevelAsyncThunk.fulfilled,(state,action)=>{
          state.loading = false
          action.payload != undefined ? state.data = action.payload : []

      })
      .addCase(LevelAsyncThunk.rejected,(_state,_action)=>{
      })
    },
})