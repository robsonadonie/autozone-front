import { createSlice } from "@reduxjs/toolkit";
import { ModeleAsyncThunk } from "../Async/modele.async";
export const ModeleSlice = createSlice({
    name : "Modele",
    initialState : {loading : false,data : []},
    reducers : {},
    extraReducers(builder) {
        builder
        .addCase(ModeleAsyncThunk.pending,(state,_action)=>{
            state.loading = true
        })
        .addCase(ModeleAsyncThunk.fulfilled,(state,action)=>{
          state.loading = false
          action.payload != undefined ? state.data = action.payload : []
      })
      .addCase(ModeleAsyncThunk.rejected,(_state,_action)=>{
      })
    },
})