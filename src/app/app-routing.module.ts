import {NgModule} from "@angular/core";
import {PreloadAllModules, RouterModule, Routes} from "@angular/router";
import {environment} from "../environments/environment";

const appRoutes: Routes = [
  // Index => Recipes
  {
    path: '',
    redirectTo: '/recipes',
    pathMatch: 'full'
  },
  {
    path: 'recipes',
    loadChildren: ():any => import('./recipes/recipes.module')
      .then(m => m.RecipesModule)
  },
  {
    path: 'shopping-list',
    loadChildren: ():any => import('./shopping-list/shopping-list.module')
      .then(m => m.ShoppingListModule)
  },
  {
    path: 'auth',
    loadChildren: ():any => import('./auth/auth.module')
      .then(m => m.AuthModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      preloadingStrategy: PreloadAllModules,
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {

}
