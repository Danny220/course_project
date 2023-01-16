import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {RecipeService} from "../recipe.service";
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer'
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number = 0;
  editMode: boolean = false;
  recipeForm?: FormGroup;
  trackByFn(index, item) {
    return index;
  }
  constructor(private route: ActivatedRoute,
              private recipeService: RecipeService,
              private router: Router,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        console.log(this.editMode);
        this.initForm();
        }
      );
  }

  onCancel(){
    if (this.editMode) {
      this.router.navigate(['../../', 'detail', this.id],
        {relativeTo: this.route});
    } else {
      this.router.navigate(['../']);
    }
  }
  recipeIngredients = new FormArray([]);
  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';

    // this.recipeArray = this.recipeForm!.controls['ingredients'];

    if (this.editMode) {
      // const recipe = this.recipeService.getRecipe(this.id);
      this.store.select('recipes')
      .pipe(
        map(
          recipeState => {
            return recipeState.recipes.find(
              (recipe, index) => {
                return index === this.id;
              }
            )
          }
        )
      ).subscribe(
        {
          next: recipe => {
            recipeName = recipe.name;
            recipeImagePath = recipe.imagePath;
            recipeDescription = recipe.description;
            if (recipe['ingredients']) {
              let amount = 0;
              for (let ingredient of recipe.ingredients) {
                if (ingredient.amount > 0) {
                  amount = ingredient.amount;
                } else { amount = 0; }
                this.recipeIngredients.push(
                  new FormGroup({
                  'name': new FormControl(ingredient.name,
                    [Validators.required, Validators.minLength(3)]),
                  'amount': new FormControl(amount,
                    [Validators.required,
                    Validators.pattern(/^[0-9]+[0-9]*$/)]),
                  }));
              }
            }
          }
        }
      )
    }

    // this.recipeIngredients.push(
    //   new FormGroup(({
    //     'name': new FormControl(null, Validators.required),
    //     'amount': new FormControl(null, [Validators.required,
    //       Validators.pattern(/^[0-9]+[0-9]*$/)]),
    //   }))
    // );

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName,
        Validators.required),
      'imagePath': new FormControl(recipeImagePath,
        Validators.required),
      'description': new FormControl(recipeDescription,
        Validators.required),
      'ingredients': this.recipeIngredients,
    })
  }
  get controls() {
    let x = (<any>this.recipeForm?.controls['ingredients'].value);
    return x;
  }
  onSubmit() {
    // const newRecipe = new Recipe(
    //   this.recipeService.id,
    //   this.recipeForm.value['name'],
    //   this.recipeForm.value['description'],
    //   this.recipeForm.value['imagePath'],
    //   this.recipeForm.value['ingredients'],
    // );
    if (this.editMode) {
      console.log('> ' + this.recipeForm.value);
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    } else {
      console.log('+ ' + this.recipeForm.value);
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.onCancel();
  }

  onAddIngredient() {
    this.recipeIngredients.push(
      new FormGroup({
        'name': new FormControl(null,
          [Validators.required, Validators.minLength(3)]),
        'amount': new FormControl(null,
          [Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)]),
      })
    );
  }

  get ingForm() {
    return (this.recipeIngredients as FormArray).controls;
  }

  onDeleteIngredient(i: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(i);
  }
}
