import { createSlice } from "@reduxjs/toolkit";
import { StockAsync } from "../Async/stockAsync";
import { VentesAsync } from "../Async/VentesAsync";
import { ExportAsyncThunk  } from "../Async/ExportAsync";

 
export const UpdateExportSlice = createSlice({
    name: "up-Export",
    initialState: { loading: false, data: "", status: "" },
    reducers: {
        changeStatusExport(state, _action) {
            state.status = ""
            state.data = ""
        }
    },
    extraReducers(builder) {
        builder
            .addCase(ExportAsyncThunk.pending, (state, action) => {
                state.loading = true
            })
            .addCase(ExportAsyncThunk.fulfilled, (state, action) => {
                state.loading = false
                
                //   action.payload != undefined ? state.data = action.payload : []
                action.payload.data.filePath != undefined ? state.data = action.payload.data.filePath : ""
                action.payload.status != undefined ? state.status = action.payload.status : ""

            });
        
    },
})
export const {changeStatusExport} = UpdateExportSlice.actions