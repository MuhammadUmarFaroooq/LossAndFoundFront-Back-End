// dataSlice.js
import {createAsyncThunk} from '@reduxjs/toolkit';

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
