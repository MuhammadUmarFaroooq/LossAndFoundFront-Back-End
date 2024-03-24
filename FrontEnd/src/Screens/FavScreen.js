import useLikeStore from '../Zustand_store/LikeStore';
import PostItem from '../Screens/PostItem';
import {View, FlatList} from 'react-native';
import { backgroundColors } from '../constants/AppDetail';
import { COLORS } from '../constants/theme';

function FavScreen({navigation}) {
  const renderFoundPostRow = ({item}) => {
    return (
      <PostItem
        item={item}
        onPress={() => navigation.navigate('DetailsPage', {itemId: item._id})}
        isFound={true}
      />
    );
  };

  console.log('hi'); // This will be logged every time MusicRoute renders

  const {likedImages} = useLikeStore();
  console.log(likedImages);
  return (
    <View style={{backgroundColor:COLORS.white}}>
      <FlatList
        renderItem={renderFoundPostRow}
        data={likedImages}
        keyExtractor={item => item._id.toString()}
      />
    </View>
  );
}
export default FavScreen;
