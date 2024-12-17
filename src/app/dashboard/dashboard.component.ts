import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "../app.reducer";
import {filter, Subscription} from "rxjs";
import {IngresoEgresoService} from "../services/ingreso-egreso.service";
import {setItems, unSetItems} from "../ingreso-egreso/ingreso-egreso.actions";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: ``
})
export class DashboardComponent implements OnInit, OnDestroy {
  userSub: Subscription | undefined;
  ingSub: Subscription | undefined;

  constructor(private store: Store<AppState>,
              private ingresoEgresoService: IngresoEgresoService) {
  }

  ngOnInit() {
    this.userSub = this.store.select('user')
      .pipe(filter(auth => auth.user !== null))
      .subscribe(({user}) => {

        this.ingSub = this.ingresoEgresoService.initIngresosEgresosListener(user!.uid)
          .subscribe((ie) => {
          this.store.dispatch(setItems({items : ie}))
        })
      })
  }

  ngOnDestroy() {
    this.store.dispatch(unSetItems())
    this.ingSub?.unsubscribe()
    this.userSub?.unsubscribe()
  }
}
