import { createStore, combineReducers } from "redux";

import langReducer from "./langReducer";
import userReducer from "./userReducer";
import goalReducer from "./goalReducer";

const rootReducer = combineReducers({
  lang: langReducer,
  user: userReducer,
  userGoal: goalReducer
});

const taStore = () => createStore(rootReducer);

export const mapStatetoProps = state => {
  return {
    store: state
  };
};

export const mapDispatchToProps = dispatch => {
  return {
    setLang: lang => dispatch({ type: lang }),

    logUserIn: data => dispatch({ type: "login", payload: data }),
    logUserOut: () => dispatch({ type: "logout", payload: null }),

    addUserGoal: (goal) => dispatch({ type: 'addgoal', payload: goal}) //goal = [{key:'aaa',name:'aaaaaaaaaa'}]
  };
};

export default taStore;
