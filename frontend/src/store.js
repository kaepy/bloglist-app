import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer";

//import notificationReducer from "./reducers/notificationReducer";

// Configure the Redux store with the notification reducer
const store = configureStore({
  reducer: {
    notification: notificationReducer,
  },
});

// console.log(store.getState());

export default store; // Export the configured store
