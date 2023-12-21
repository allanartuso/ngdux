import { Component } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store, createAction, props } from '@ngrx/store';
import { withLatestFrom } from 'rxjs';

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(store: Store, actions$: Actions) {
    actions$.pipe(withLatestFrom(store)).subscribe(([action, store]) => {
      console.log(action);
      console.log(store);
    });

    const action = createAction(`[dashboard.cars API] Load dashboard.cars`, props<{ id: string }>());
    const newAction = {
      ...action({ id: '1' }),
      bankletContextId: 'hey'
    };
    setTimeout(() => {
      store.dispatch(newAction);
    }, 2000);
  }
}
