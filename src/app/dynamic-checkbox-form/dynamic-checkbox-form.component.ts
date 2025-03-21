import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { State, states } from './states';

@Component({
  selector: 'app-dynamic-checkbox-form',
  templateUrl: './dynamic-checkbox-form.component.html',
  styleUrls: ['./dynamic-checkbox-form.component.scss'],
  imports: [ReactiveFormsModule]
})
export class DynamicCheckboxComponent {
  protected states: State[] = states;
  protected selectAll = new FormControl(false, { nonNullable: true });
  protected form = new FormGroup(
    Object.fromEntries(
      this.states.map(
        option => [option.value, new FormControl(false, { nonNullable: true })]
      )
    )
  );

  constructor() {
    this.selectAll.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(checked => this.toggleAll(checked));
    this.form.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateSelectAll());
  }

  get selectedValues() {
    return Object.keys(this.form.value).filter(key => this.form.value[key]);
  }

  private toggleAll(checked: boolean) {
    const controlsArray = Object.keys(this.form.controls);
    controlsArray.forEach(key => {
      this.form.get(key)?.setValue(checked, { emitEvent: false });
    });
  }

  private updateSelectAll() {
    const allChecked = Object.values(this.form.value).every(value => value === true);
    if (this.selectAll.value !== allChecked) {
      this.selectAll.setValue(allChecked, { emitEvent: false });
    }
  }
}