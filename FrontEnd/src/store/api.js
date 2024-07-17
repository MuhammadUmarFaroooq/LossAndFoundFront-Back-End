import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setItems } from './actions';
import { API } from '../constants/theme';

export const fetchAllPosts = () => {
    return async (dispatch) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${API}/posts/getAllPosts`, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            dispatch(setItems(response.data.posts));
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };
};
