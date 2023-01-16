import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {ShoppingListComponent} from "./shopping-list.component";

const routes = [
  // Shopping List
  {
    path: '',
    component: ShoppingListComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingListRoutingModule {

}
