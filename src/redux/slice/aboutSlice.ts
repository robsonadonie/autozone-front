import { createSlice } from "@reduxjs/toolkit";
import { AboutAsyncThunk, UpdateAboutAsyncThunk } from "../Async/aboutAsyncThunk";

export const AboutSlice = createSlice({
    name: "about",
    initialState: { loading: false, data: {} },
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(AboutAsyncThunk.pending, (state, _action) => {
                state.loading = true
            })
            .addCase(AboutAsyncThunk.fulfilled, (state, action) => {
                state.loading = false
                  action.payload != undefined ? state.data = action.payload : {}

            })
    },
})
export const UpdateAboutSlice = createSlice({
    name: "update-about",
    initialState: { loading: false, status: "" },
    reducers: {
        changeStatusAbout(state,_action){
            state.status =""
        }
    },
    extraReducers(builder) {
        builder
            .addCase(UpdateAboutAsyncThunk.pending, (state, _action) => {
                state.loading = true
            })
            .addCase(UpdateAboutAsyncThunk.fulfilled, (state, action) => {
                state.loading = false
                  action.payload != undefined ? state.status = action.payload : ""
                
            })
    },
})
export const {changeStatusAbout} = UpdateAboutSlice.actions