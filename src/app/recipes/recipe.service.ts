import {Recipe} from "./recipe.model";
import {Injectable} from "@angular/core";
import {Ingredient} from "../shared/Ingredient.model";
import {Subject} from "rxjs";
import {Store} from "@ngrx/store";
import * as slActions from "../shopping-list/store/shopping-list.actions";
import * as fromApp from "../store/app.reducer";

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  id = 3;
  // recipes: Recipe[] = [
  //   new Recipe(
  //     'Noodles fritti alle verdure',
  //     'I noodles fritti alle verdure sono un primo piatto della cucina asiatica. ' +
  //     'Nella ricetta che vi proponiamo i noodles vengono fritti, ma questo tipo di pasta si presta ' +
  //     'anche ad essere lessata e poi saltata in padella con il sugo per essere insaporita. I noodles ' +
  //     'sono molto diffusi in tutta l’Asia e hanno un’origine molto antica: la loro preparazione ' +
  //     'ottenuti da una lavorazione di farina, sale e acqua, risalirebbe addirittura al 1200. Di ' +
  //     'noodles ne esistono moltissime varietà a seconda della regione e possono essere preparati ' +
  //     'secondo molteplici ricette, proprio come avviene con la pasta tradizionale.',
  //     "https://www.giallozafferano.it/images/10-1049/Noodles-fritti-alle-verdure_780x520_wm.jpg",
  //     [
  //       new Ingredient("Noodles", 200),
  //       new Ingredient("Peperoni rossi", 1),
  //       new Ingredient("Funghi champignon", 80),
  //       new Ingredient("Peperoncino", 1),
  //       new Ingredient("Cipollotto fresco", 1),
  //       new Ingredient("Salsa di soia", 50),
  //       new Ingredient("Sale fino", -1),
  //       new Ingredient("Peperoni verdi", 1),
  //       new Ingredient("Carote", 1),
  //       new Ingredient("Germogli di soia", 80),
  //       new Ingredient("Aglio", 2),
  //       new Ingredient("Olio extravergine d'oliva", 3),
  //       new Ingredient("Aceto di mele", 1),
  //       new Ingredient("Olio di semi di arachide", 1),
  //     ]),
  //   new Recipe(
  //     'Arancini al ragù bianco',
  //     'Gli arancini al ragù bianco sono una variante senza pomodoro dei classici arancini di riso, vanto della cucina siciliana e da sempre oggetto di dibattito per quanto riguarda il genere maschile o femminile del loro nome. In questa ricetta non ci soffermiamo sulla definizione di arancino o arancina, ma ci affidiamo all’esperienza dello chef stellato Pino Cuttaia per realizzarli a regola d’arte! Partendo dalla preparazione del ripieno di carne, arricchito con piselli, prosciutto, mozzarella e una speciale besciamella, fino alla cottura del riso allo zafferano, vedremo insieme tutti i passaggi per dare forma a queste irresistibili bontà fritte, dall’involucro croccante e dorato. Ottimi sia come antipasto che come piatto unico, gli arancini al ragù bianco fanno venire l’acquolina in bocca solo a vederli!',
  //     "https://www.tavolartegusto.it/wp/wp-content/uploads/2019/04/Arancini-di-riso-Arancine-Ricetta-Arancini-di-riso-.jpg",
  //     [
  //       new Ingredient("Riso Carnaroli", 1),
  //       new Ingredient("Parmigiano Reggiano DOP", 200),
  //       new Ingredient("Olio EVO", 30),
  //       new Ingredient("Zafferano", 3),
  //       new Ingredient("Acqua", 1250),
  //       new Ingredient("Burro", 140),
  //       new Ingredient("Sale fino", 30)
  //     ])
  // ];

  private recipes: Recipe[] = [];

  constructor(
    private store: Store<fromApp.AppState>
  ){}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]){
    // this.slService.addIngredients(ingredients);
    this.store.dispatch(new slActions.AddIngredients(ingredients));
  }

  getRecipe(i: number): any {
    return this.recipes[i];
  }

  getRecipes(){
    return this.recipes.slice();
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    console.log(recipe.name);
    this.recipesChanged.next(this.recipes.slice());
    this.id++;
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
