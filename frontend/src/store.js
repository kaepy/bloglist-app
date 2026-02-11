import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer";
import blogReducer from "./reducers/blogReducer";

//import notificationReducer from "./reducers/notificationReducer";

// Configure the Redux store with the notification reducer
const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
  },
});

// console.log(store.getState());

export default store; // Export the configured store
