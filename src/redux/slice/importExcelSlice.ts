import { createSlice } from "@reduxjs/toolkit";
import { AboutAsyncThunk, UpdateAboutAsyncThunk } from "../Async/aboutAsyncThunk";
import { importExcelAsync } from "../Async/importExcelAsync";
 
export const importExcelSlice = createSlice({
    name: "r",
    initialState: { loading: false, status: "" ,fileReturned:null},
    reducers: {
        changeStatusExcel(state,_action){
            state.fileReturned =null
        }
    },
    extraReducers(builder) {
        builder
            .addCase(importExcelAsync.pending, (state, _action) => {
                state.loading = true
            })
            .addCase(importExcelAsync.fulfilled, (state, action) => {
                state.loading = false
                
                  action.payload != undefined ? state.fileReturned = action.payload : null

            })
    },
})
export const {changeStatusExcel} = importExcelSlice.actions