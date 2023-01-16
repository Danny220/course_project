import {Ingredient} from "../../shared/Ingredient.model";
import * as slActions from "./shopping-list.actions";

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIgIndex: number;
}

const initalState: State = {
  ingredients: [
    new Ingredient('Mele', 5),
    new Ingredient('Pomodori', 10),
  ],
  editedIngredient: null,
  editedIgIndex: -1
};

export function shoppingListReducer
(state: State = initalState,
 action: slActions.ShoppingListActions) {
  switch (action.type) {
    case slActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      };
    case slActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload]
      };
    case slActions.UPDATE_INGREDIENT:
      const ingredient = state.ingredients[state.editedIgIndex];
      const updatedIngredient = {
        ...ingredient,
        ...action.payload
      };
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedIgIndex] = updatedIngredient;

      return {
        ...state,
        ingredients: updatedIngredients,
        editedIgIndex: -1,
        editedIngredient: null,
      };
    case slActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((ig,i) => {
          return i !== state.editedIgIndex;
        }),
        editedIgIndex: -1,
        editedIngredient: null,
      };
    case slActions.START_EDIT:
      return {
        ...state,
        editedIgIndex: action.payload,
        editedIngredient: {...state.ingredients[action.payload]}
      };
    case slActions.STOP_EDIT:
      return {
        ...state,
        editedIgIndex: -1,
        editedIngredient: null
      };
    default:
      return state;
  }
}


