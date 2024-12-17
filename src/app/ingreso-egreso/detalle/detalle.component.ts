import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "../../app.reducer";
import {Subscription} from "rxjs";
import {IngresoEgreso} from "../../models/ingreso-egreso.model";
import {IngresoEgresoService} from "../../services/ingreso-egreso.service";
import Swal from "sweetalert2";
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: `
  th,td{
    text-align: center;
  }
  .table{
    border: 1px solid #80808045;
    border-collapse: collapse;
    border-radius: 8px;

  }

  `
})
export class DetalleComponent implements OnInit, OnDestroy {
  ingEgrSubs: Subscription | undefined

  ingresosEgresos: IngresoEgreso[] = []

  constructor(private store: Store<AppStateWithIngreso>,private ingresoEgresoService:IngresoEgresoService) {
  }

  ngOnInit() {
    this.ingEgrSubs = this.store.select('ingresosEgresos')
      .subscribe(({items}) => {
        this.ingresosEgresos = items
      })
  }

  ngOnDestroy() {
    this.ingEgrSubs?.unsubscribe()
  }
  borrar(uid:string|undefined){
    this.ingresoEgresoService.borrarIngresoEgreso(uid!)
      .then(()=> Swal.fire('Borrado','Item borrado','success'))
      .catch((err)=>{Swal.fire('Error', err.message,'error')})
  }
}
