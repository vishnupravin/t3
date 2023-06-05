import ActionTypes from './ActionTypes';

export const addAllItems = item => ({
  type: ActionTypes.addAllItems,
  payload: item,
});
export const handleLoginState = state => ({
  type: ActionTypes.changeLogin,
  payload: state,
});
export const addToCart = item => ({
  type: ActionTypes.addItem,
  payload: item,
});
export const addFreeItem = item => ({
  type: ActionTypes.addFreeItem,
  payload: item,
});
export const removeromCart = index => ({
  type: ActionTypes.removeItem,
  payload: index,
});
export const reduxAddaddonsItem = index => ({
  type: ActionTypes.reduxAddaddonsItem,
  payload: index,
});
export const deleteItem = item => ({
  type: ActionTypes.deleteItem,
  payload: item,
});
export const updateItems = item => ({
  type: ActionTypes.updateItems,
  payload: item,
});
export const removingFromSQl = item => ({
  type: ActionTypes.removefromsql,
  payload: item,
});
