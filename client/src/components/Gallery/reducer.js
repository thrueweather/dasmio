import { getItem } from "utils";

const initialState = {
  page: 1,
  perPage: 15,
  photos: getItem(48),
  photo: null,
  editModal: false,
  errorModal: false,
  refetch: false,
  loader: false,
  numObjects: 0
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "UPLOAD_PHOTO":
      return {
        ...state,
        photo: action.photo,
        editModal: true
      };
    case "SAVE_PHOTO":
      return {
        ...state,
        photos: [...action.photos, ...getItem(48)],
        loader: false,
        numObjects: action.numObjects
      };
    case "TOGGLE_EDIT_MODAL":
      return {
        ...state,
        [action.modal]: !state[action.modal],
        ...action.action
      };
    case "TOGGLE_REFETCH":
      return {
        ...state,
        refetch: !state.refetch,
        editModal: false
      };
    case "TOGGLE_ERROR_MODAL":
      return {
        ...state,
        errorModal: !state.errorModal
      };
    case "TOGGLE_LOADER":
      return {
        ...state,
        loader: !state.loader
      };
    case "CHANGE_PAGE":
      return {
        ...state,
        page: action.page
      };
    default:
      return state;
  }
};

export { initialState, reducer };
