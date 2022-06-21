import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData: {},
};

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    addUserData: (state, action) => {
        let data = state.userData;
        let payload = action.payload;
        state.userData = {...payload};
    }
  },
});

export const { addUserData} = dataSlice.actions;

export default dataSlice.reducer;