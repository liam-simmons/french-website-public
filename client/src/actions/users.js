import api from "../api";
import userLoggedIn from "../reducers/user";
import { USER_LOGGED_IN, USER_LOGGED_OUT } from "../types";
import configuration from "../configuration";

export const signup = data => dispatch =>
  api.user.signup(data).then(user => {
    localStorage[configuration.JWT_TOKEN_NAME] = user.token;
    dispatch(userLoggedIn({ type: USER_LOGGED_IN, user: user }));
  });

export const login = data => dispatch =>
  api.user.login(data).then(user => {
    localStorage[configuration.JWT_TOKEN_NAME] = user.token;
    dispatch(userLoggedIn({ type: USER_LOGGED_IN, user: user }));
  });

export const createTestAccount = () => dispatch =>
  api.user.createTestAccount().then(user => {
    localStorage[configuration.JWT_TOKEN_NAME] = user.token;
    dispatch(userLoggedIn({ type: USER_LOGGED_IN, user: user }));
  });
export const checkAuthorized = () => dispatch => {
  if (!localStorage[configuration.JWT_TOKEN_NAME]) return;
  api.user.checkAuthorized().then(user => {
    dispatch(userLoggedIn({ type: USER_LOGGED_IN, user: user }));
  });
};
export const signout = () => dispatch => {
  api.user.signout().then(() => {
    localStorage.removeItem(configuration.JWT_TOKEN_NAME);
    dispatch(userLoggedIn({ type: USER_LOGGED_OUT }));
  });
};
