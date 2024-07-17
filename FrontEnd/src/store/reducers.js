const initialState = {
  searchResults: [],
  items: [],
  recommendations: [],
  postId: null, // Initial value should be null or an appropriate default
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SEARCH_ITEMS':
      const keyword = action.payload.toLowerCase();
      const searchResults = state.items.filter(item =>
        item.name.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword) ||
        item.location.toLowerCase().includes(keyword) ||
        item.date.includes(keyword) ||
        item.keyword.toLowerCase().includes(keyword)
      );
      return {
        ...state,
        searchResults: [...searchResults],
      };
    case 'APPLY_FILTERS':
      const { category, location, date } = action.payload;
      const filteredResults = state.items.filter(item =>
        (category ? item.category === category : true) ||
        (location ? item.location === location : true) ||
        (date ? item.date === date : true)
      );
      return {
        ...state,
        searchResults: [...filteredResults],
      };
    case 'FETCH_RECOMMENDATIONS':
      return {
        ...state,
        recommendations: [...initialState.recommendations],
      };
    case 'SET_ITEMS':
      return {
        ...state,
        items: action.payload,
      };
    case 'SET_USER_ID':
      return {
        ...state,
        userId: action.payload,
      };
    case 'SET_RECEIVER_ID':
      return {
        ...state,
        receiverId: action.payload,
      };
    case 'SET_POST_ID':
      return {
        ...state,
        postId: action.payload, // Update postId in state
      };
   default:
        return state;
      }
      
};

export default reducer;
