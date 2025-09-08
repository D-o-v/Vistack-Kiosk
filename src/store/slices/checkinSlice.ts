import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkinAPI, CheckinRequest, AccessCodeCheckinRequest } from '../../api/endpoints';

interface CheckinState {
  checkins: any[];
  currentCheckin: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: CheckinState = {
  checkins: [],
  currentCheckin: null,
  loading: false,
  error: null,
};

export const guestCheckin = createAsyncThunk(
  'checkin/guestCheckin',
  async (data: CheckinRequest, { rejectWithValue }) => {
    try {
      const response = await checkinAPI.guestCheckin(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Check-in failed');
    }
  }
);

export const accessCodeCheckin = createAsyncThunk(
  'checkin/accessCodeCheckin',
  async (data: AccessCodeCheckinRequest, { rejectWithValue }) => {
    try {
      const response = await checkinAPI.accessCodeCheckin(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Check-in failed');
    }
  }
);

export const getCheckins = createAsyncThunk(
  'checkin/getCheckins',
  async (_, { rejectWithValue }) => {
    try {
      const response = await checkinAPI.getCheckins();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch check-ins');
    }
  }
);

const checkinSlice = createSlice({
  name: 'checkin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCheckin: (state) => {
      state.currentCheckin = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Guest checkin
      .addCase(guestCheckin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(guestCheckin.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCheckin = action.payload;
      })
      .addCase(guestCheckin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Access code checkin
      .addCase(accessCodeCheckin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(accessCodeCheckin.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCheckin = action.payload;
      })
      .addCase(accessCodeCheckin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get checkins
      .addCase(getCheckins.fulfilled, (state, action) => {
        state.checkins = action.payload;
      });
  },
});

export const { clearError, clearCurrentCheckin } = checkinSlice.actions;
export default checkinSlice.reducer;