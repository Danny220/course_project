import {NgModule} from "@angular/core";
import {AuthComponent} from "./auth.component";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";

const paths = [
  {
    path: '',
    component: AuthComponent
  },
]

@NgModule({
  imports: [
    RouterModule.forChild(paths)
  ]
})
export class AuthRoutingModule {}
