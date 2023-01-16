import {NgModule} from "@angular/core";
import {ShoppingListComponent} from "./shopping-list.component";
import {ShoppingListEditComponent} from "./shopping-list-edit/shopping-list-edit.component";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {ShoppingListRoutingModule} from "./shopping-list-routing.module";
import {SharedModule} from "../shared/shared.module";
// import {LoggingService} from "../logging.service";

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingListEditComponent,
  ],
  imports: [
    FormsModule,
    RouterModule,
    ShoppingListRoutingModule,
    SharedModule
  ],
  // providers: [LoggingService]
})
export class ShoppingListModule {}
