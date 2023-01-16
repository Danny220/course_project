import {NgModule} from "@angular/core";
import {AlertComponent} from "./alert/alert.component";
import {LoadingSpinnerComponent} from "./loading-spinner/loading-spinner.component";
import {PlaceholderDirective} from "./directives/placeholder.directive";
import {DropdrownDirective} from "./directives/dropdown.directive";
import {CommonModule} from "@angular/common";
import {LoggingService} from "../logging.service";

const imports = [

]

@NgModule({
  declarations: [
    AlertComponent,
    LoadingSpinnerComponent,
    PlaceholderDirective,
    DropdrownDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CommonModule,
    AlertComponent,
    LoadingSpinnerComponent,
    PlaceholderDirective,
    DropdrownDirective
  ],
  providers: [LoggingService]
})
export class SharedModule {}
