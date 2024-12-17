import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {IngresoEgreso} from "../models/ingreso-egreso.model";
import {IngresoEgresoService} from "../services/ingreso-egreso.service";
import Swal from "sweetalert2";
import * as ui from "../shared/ui.actions";
import {AppState} from "../app.reducer";
import {Store} from "@ngrx/store";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: ``
})
export class IngresoEgresoComponent implements OnInit, OnDestroy{

  ingresoForm: FormGroup = new FormGroup({});
  tipo: string = 'ingreso'
  cargando: boolean = false;
  loadingSubscription: Subscription | undefined


  constructor(private fb: FormBuilder,
              private ingresoEgService: IngresoEgresoService,
              private store: Store<AppState>) {
  }

  ngOnInit() {
    this.ingresoForm = this.fb.group({
      description: ['', Validators.required],
      monto: ['', Validators.required],
    })
  }
  ngOnDestroy() {
    this.loadingSubscription?.unsubscribe()
  }

  guardar() {

    if (this.ingresoForm.invalid) return;
    this.store.dispatch(ui.isLoading())
    this.store.select('ui').subscribe((ui) => this.cargando = ui.isLoading)
    const {description, monto} = this.ingresoForm.value
    const ingresoEg = new IngresoEgreso(description, monto, this.tipo)

    this.ingresoEgService.crearIngresoEgreso(ingresoEg).then(() => {
      this.ingresoForm.reset()
      this.store.dispatch(ui.stopLoading())
      Swal.fire('Registro creado!', description, 'success');

    })
      .catch(err => {
        this.loadingSubscription?.unsubscribe()
        Swal.fire('Error', description, 'error')
      })
  }
}
