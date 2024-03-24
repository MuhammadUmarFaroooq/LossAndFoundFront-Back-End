// LikeStore.js
import {create} from 'zustand';

const useLikeStore = create(set => ({
  likedImages: [],
  addLikedImage: image => {
    console.log('Adding liked image:', image);
    set(state => ({likedImages: [...state.likedImages, image]}));
  },
  removeLikedImage: image => {
    console.log('Removing liked image:', image);
    set(state => ({
      likedImages: state.likedImages.filter(likedImage => likedImage !== image),
    }));
  },
}));

export default useLikeStore;
