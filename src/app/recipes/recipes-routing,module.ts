import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../auth/auth.guard";
import {RecipesComponent} from "./recipes.component";
import {RecipeSelectMsgComponent} from "./recipe-select-msg/recipe-select-msg.component";
import {RecipeDetailComponent} from "./recipe-detail/recipe-detail.component";
import {RecipesResolverService} from "./recipes-resolver.service";
import {RecipeEditComponent} from "./recipe-edit/recipe-edit.component";

const routes: Routes = [
  // Recipes
  {
    canActivate: [AuthGuard],
    path: '',
    component: RecipesComponent,
    children: [
      // recipes /
      {
        path: '',
        component: RecipeSelectMsgComponent
      },
      // recipes / detail
      {
        path: 'detail/:id',
        component: RecipeDetailComponent,
        resolve: [RecipesResolverService]
      },
      // recipes / new
      {
        path: 'new',
        component: RecipeEditComponent
      },
      // recipes / (id) / edit
      {
        path: 'edit/:id',
        component: RecipeEditComponent,
        resolve: [RecipesResolverService]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule {

}
