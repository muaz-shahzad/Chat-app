import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  name: "",
  onlineUser: [],
  socketConnection: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
    },
    logout: (state) => {
      state.id = "";
      state.name = "";
    },
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload;
    },
    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload;
    },
  },
});

export const { setUser, logout, setOnlineUser,setSocketConnection } = userSlice.actions;

export default userSlice.reducer;
