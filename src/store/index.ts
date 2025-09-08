import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import checkinSlice from './slices/checkinSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    checkin: checkinSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;