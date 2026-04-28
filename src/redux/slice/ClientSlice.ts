import { createSlice } from "@reduxjs/toolkit";
import { StockAsync } from "../Async/stockAsync";
import { VentesAsync } from "../Async/VentesAsync";
import { AddClientAsync, AsyncDeletedClient, ClientAsync, UpdateClientAsync } from "../Async/ClientAsync";

export const ClientSlice = createSlice({
    name: "client",
    initialState: { loading: false, data: [] },
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(ClientAsync.pending, (state, action) => {
                state.loading = true
            })
            .addCase(ClientAsync.fulfilled, (state, action) => {
                state.loading = false
                
                action.payload != undefined  ? state.data = action.payload : []

            })
    },
})
export const AddClientSlice = createSlice({
    name: "add-client",
    initialState: { loading: false, data: "" },
    reducers: {
        changeAddClient(state, _action) {
            state.data = ""
        }
    },
    extraReducers(builder) {
        builder
            .addCase(AddClientAsync.pending, (state, action) => {
                state.loading = true
            })
            .addCase(AddClientAsync.fulfilled, (state, action) => {
                state.loading = false
                action.payload != undefined ? state.data = (action.payload)[0] : ""

            })
    },
})
export const UpdateClientSlice = createSlice({
    name: "up-client",
    initialState: { loading: false, data: [], status: "" },
    reducers: {
        changeStatusClient(state, _action) {
            state.status = ""
        }
    },
    extraReducers(builder) {
        builder
            .addCase(UpdateClientAsync.pending, (state, action) => {
                state.loading = true
            })
            .addCase(UpdateClientAsync.fulfilled, (state, action) => {
                state.loading = false
                //   action.payload != undefined ? state.data = action.payload : []
                action.payload != undefined ? state.status = action.payload : ""

            });
        builder
            .addCase(AsyncDeletedClient.pending, (state, action) => {
                state.loading = true
            })
            .addCase(AsyncDeletedClient.fulfilled, (state, action) => {
                state.loading = false
                action.payload != undefined ? state.status = action.payload : ""

            });
    },
})
export const {changeAddClient} = AddClientSlice.actions
export const {changeStatusClient} = UpdateClientSlice.actions