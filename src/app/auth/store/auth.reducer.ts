import {User} from "../user.model";
import * as AuthActions from "./auth.actions";

export interface State {
  user: User | null;
  authError: string | null;
  loading: boolean;
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false,
}

export function authReducer(state = initialState,
                            action: AuthActions.AuthActions) {
  console.log(state);
  switch (action.type) {
    case AuthActions.AUTHENTICATE_SUCCESS:
      const user = new User(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
      );
      return {
        ...state,
        user: user,
        loading: false,
      }
    case AuthActions.LOGOUT:
      return {
        ...state,
        authError: null,
        user: null
      }
    case AuthActions.LOGIN_START:
    case AuthActions.SIGNUP_START: 
      return {
        ...state,
        loading: true,
        authError: null,
      }
    case AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        authError: action.payload,
        loading: false,
      }
    case AuthActions.CLEAR_ERROR:
      return {
        ...state,
        authError: null,
      }
    default:
      return state;
  }
}
