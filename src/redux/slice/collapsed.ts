import { createSlice } from "@reduxjs/toolkit"

export const CollapseSlice = createSlice({
    name :"collapsed",
    initialState : {statue :false},
    reducers :{
        changeCollapse(state,action){
                state.statue = !state.statue
        }
    },
})
export const {changeCollapse} = CollapseSlice.actions