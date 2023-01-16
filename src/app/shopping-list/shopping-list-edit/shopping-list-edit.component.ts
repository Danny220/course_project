import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Ingredient } from '../../shared/Ingredient.model';
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import * as slActions from"../store/shopping-list.actions";
import * as fromApp from "../../store/app.reducer"

@Component({
  selector: 'app-shopping-list-edit',
  templateUrl: './shopping-list-edit.component.html',
})
export class ShoppingListEditComponent implements OnInit,
                                                  OnDestroy{
  @ViewChild('f') slForm?: NgForm;
  subscription?: Subscription;
  editMode = false;
  editedItem: Ingredient = new Ingredient('?', 1);

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.subscription = this.store.select('shoppingList').subscribe({
      next: stateData => {
        if (stateData.editedIgIndex > -1) {
          this.editMode = true;
          this.editedItem = stateData.editedIngredient;
          this.slForm.setValue({
            name: this.editedItem.name,
            amount: this.editedItem.amount,
          })
        } else {
          this.editMode = false;
        }
      }
    });
  }

  onAddItem(form: NgForm){
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      // this.slService.updateIngredient(
        // this.editIndex, newIngredient);
      this.store.dispatch(new slActions.UpdateIngredient(newIngredient));
    } else {
      // this.slService.addIngredient(newIngredient);
      this.store.dispatch(new slActions.AddIngredient(
        newIngredient
      ));
    }
    this.editMode = false;
    form.reset();
  }
  onClear() {
    this.slForm?.reset();
    this.editMode = false;
    this.store.dispatch(
      new slActions.StopEdit()
    );
  }
  onDelete(){
    // this.slService.deleteIngredient(this.editIndex);
    this.store
      .dispatch(new slActions.DeleteIngredient());
    this.onClear();
  }
  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.store.dispatch(
      new slActions.StopEdit()
    );
  }
}
