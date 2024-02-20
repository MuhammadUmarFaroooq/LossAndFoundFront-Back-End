// Your React Native component
import React, {useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchData} from './dataSlice';

const YourComponent = () => {
  const dispatch = useDispatch();
  const {data, loading, error} = useSelector(state => state.data);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View>
      <Text>Data: {JSON.stringify(data)}</Text>
      {/* Your component UI */}
    </View>
  );
};

export default YourComponent;
