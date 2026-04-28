import { createSlice } from "@reduxjs/toolkit";
import { AddEntreStockAsync, EntreStockAsync } from "../Async/EntreStockAsync";

export const EntreStockSlice = createSlice({
    name: "entre-stock",
    initialState: { loading: false, data: [] },
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(EntreStockAsync.pending, (state, action) => {
                state.loading = true
            })
            .addCase(EntreStockAsync.fulfilled, (state, action) => {
                state.loading = false
                action.payload != undefined ? state.data = action.payload : []

            })
    },
})
export const AddEntreStockSlice = createSlice({
    name: "add-entrestock",
    initialState: { status: "", loading: false, data: [] },
    reducers: {
        changeEntreStatus(state,_action) {
            state.status =''
        }
    },
    extraReducers(builder) {
        builder
            .addCase(AddEntreStockAsync.pending, (state, action) => {
                state.loading = true
            })
            .addCase(AddEntreStockAsync.fulfilled, (state, action) => {
                state.loading = false
                state.status = action.payload
                
                //   action.payload != undefined ? state.data = action.payload : []

            })
    },
})
export const {changeEntreStatus} = AddEntreStockSlice.actions
// export const UpStockSlice = createSlice({
//     name :"up-stock",
//     initialState : {loading :false ,data : []},
//     reducers :{},
//     extraReducers(builder) {
//         builder
//         .addCase(UpStockAsync.pending,(state,action)=>{
//             state.loading = true
//         })
//         .addCase(UpStockAsync.fulfilled,(state,action)=>{
//             state.loading = false
//         //   action.payload != undefined ? state.data = action.payload : []

//         })
//     },
// })