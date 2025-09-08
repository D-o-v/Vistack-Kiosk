import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { checkinAPI, visitorAPI, CheckinRequest, AccessCodeCheckinRequest } from '../../api/endpoints';

interface CheckinState {
  checkins: any[];
  currentCheckin: any | null;
  visitorLookup: any | null;
  loading: boolean;
  lookupLoading: boolean;
  error: string | null;
}

const initialState: CheckinState = {
  checkins: [],
  currentCheckin: null,
  visitorLookup: null,
  loading: false,
  lookupLoading: false,
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

export const lookupVisitor = createAsyncThunk(
  'checkin/lookupVisitor',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await visitorAPI.lookup(query);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Visitor not found');
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
    clearVisitorLookup: (state) => {
      state.visitorLookup = null;
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
      })
      // Visitor lookup
      .addCase(lookupVisitor.pending, (state) => {
        state.lookupLoading = true;
        state.error = null;
      })
      .addCase(lookupVisitor.fulfilled, (state, action) => {
        state.lookupLoading = false;
        state.visitorLookup = action.payload;
      })
      .addCase(lookupVisitor.rejected, (state, action) => {
        state.lookupLoading = false;
        state.visitorLookup = null;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentCheckin, clearVisitorLookup } = checkinSlice.actions;
export default checkinSlice.reducer;