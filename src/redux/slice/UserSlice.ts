import { createSlice } from "@reduxjs/toolkit";
import { StockAsync } from "../Async/stockAsync";
import { VentesAsync } from "../Async/VentesAsync";
import { AddUserAsync, UserAsync, UpdateUserAsync } from "../Async/UserAsync";
import { AdduserAuthAsync, AsyncDeletedUser, LoginAsync, OneUserAsync, UpdateuserAuthAsync } from "../Async/userAuthAsync";
import { AddClientSlice } from "./ClientSlice";

export const UserSlice = createSlice({
    name :"User",
    initialState : {loading :false ,data : []},
    reducers :{},
    extraReducers(builder) {
        builder
        .addCase(UserAsync.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(UserAsync.fulfilled,(state,action)=>{
            state.loading = false
          action.payload != undefined ? state.data = action.payload : []

        })
    },
})
export const OneUserSlice = createSlice({
    name :"One-User",
    initialState : {loading :false ,data : {},error:null},
    reducers :{},
    extraReducers(builder) {
        builder
        .addCase(OneUserAsync.pending,(state,action)=>{
            state.loading = true
            state.error =null;
        })
        .addCase(OneUserAsync.fulfilled,(state,action)=>{
            state.loading = false
          action.payload != undefined ? state.data = action.payload : {}
          state.error =null;
          if(action.payload == "use-not-found"){
            state.error = "use-not-found"
          }

        })
        .addCase(OneUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = "refused";
      });
    },
})
export const LoginSlice = createSlice({
    name :"login",
    initialState : {loading :false ,status : "",token:{token:""}},
    reducers :{
        changeLogin(state,_action){
            state.status = ""
            state.token = {token:""}
        }
    },
    extraReducers(builder) {
        builder
        .addCase(LoginAsync.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(LoginAsync.fulfilled,(state,action)=>{
            state.loading = false;
            if( typeof(action.payload) == "object"){
                state.token = action.payload
            }else if(typeof(action.payload) == "string" ){
                state.status = action.payload
            }
        

        });
    },
})
export const AddUserSlice = createSlice({
    name :"add-UserAuth",
    initialState : {loading :false ,status : ""},
    reducers :{
        changeAddUser(state,_action){
            state.status =""
        }
    },
    extraReducers(builder) {
        builder
        .addCase(AdduserAuthAsync.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(AdduserAuthAsync.fulfilled,(state,action)=>{
            state.loading = false
          action.payload != undefined ? state.status = action.payload : ""

        });
        builder
        .addCase(AsyncDeletedUser.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(AsyncDeletedUser.fulfilled,(state,action)=>{
            state.loading = false
          action.payload != undefined ? state.status = action.payload : ""

        });
        builder
        .addCase(UpdateuserAuthAsync.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(UpdateuserAuthAsync.fulfilled,(state,action)=>{
            state.loading = false
          action.payload != undefined ? state.status = action.payload : ""

        });
    },
})
export const {changeLogin} = LoginSlice.actions 
export const {changeAddUser} = AddUserSlice.actions 
export const UpdateUserSlice = createSlice({
    name :"up-User",
    initialState : {loading :false ,data : []},
    reducers :{},
    extraReducers(builder) {
        builder
        .addCase(UpdateUserAsync.pending,(state,action)=>{
            state.loading = true
        })
        .addCase(UpdateUserAsync.fulfilled,(state,action)=>{
            state.loading = false
        //   action.payload != undefined ? state.data = action.payload : []

        })
    },
})