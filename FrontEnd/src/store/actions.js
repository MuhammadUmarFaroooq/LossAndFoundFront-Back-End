
export const setItems = (items) => {
  return {
    type: 'SET_ITEMS',
    payload: items,
  };
};

export const searchItems = (keyword) => {
  return {
    type: 'SEARCH_ITEMS',
    payload: keyword,
  };
};

export const applyFilters = (filters) => {
  return {
    type: 'APPLY_FILTERS',
    payload: filters,
  };
};

export const fetchRecommendations = () => {
  return {
    type: 'FETCH_RECOMMENDATIONS',
  };
};
// actions.js

export const setUserId = (userId) => {
  return {
    type: 'SET_USER_ID',
    payload: userId,
  };
};

export const setReceiverId = (receiverId) => {
  return {
    type: 'SET_RECEIVER_ID',
    payload: receiverId,
  };
};

export const setPostId = (postId) => {
  return {
    type: 'SET_POST_ID',
    payload: postId,
  };
};