// dataSlice.js
import {createSlice} from '@reduxjs/toolkit';
import {createAsyncThunk} from '@reduxjs/toolkit';

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchDataRequest: state => {
      state.loading = true;
      state.error = null;
    },
    fetchDataSuccess: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    fetchDataFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const fetchData = createAsyncThunk(
  'data/fetchData',
  async (_, {dispatch}) => {
    try {
      // Make API call here, e.g., using fetch or Axios
      const response = await fetch('https://api.example.com/data');
      const data = await response.json();
      return data;
    } catch (error) {
      // Thunk automatically dispatches the failure action
      throw error;
    }
  },
);

export const {fetchDataRequest, fetchDataSuccess, fetchDataFailure} =
  dataSlice.actions;

export default dataSlice.reducer;
