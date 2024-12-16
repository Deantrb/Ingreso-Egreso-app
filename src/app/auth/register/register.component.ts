import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {AppState} from "../../app.reducer";
import * as ui from "../../shared/ui.actions";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: ``,
})
export class RegisterComponent implements OnInit, OnDestroy {
  registroGroup: FormGroup = new FormGroup({});
  uiSubscription:Subscription | undefined
  cargando:boolean = false;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private store:Store<AppState>
  ) {}

  ngOnInit(): void {
    this.registroGroup = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });


    this.uiSubscription = this.store.select('ui').subscribe(ui=> this.cargando = ui.isLoading )
  }

  ngOnDestroy() {
    this.uiSubscription?.unsubscribe()
  }
  crearUsuario() {
    if (this.registroGroup.invalid) return;
    this.store.dispatch(ui.isLoading())
    // Swal.fire({
    //   title: 'Espere un momento...',
    //   didOpen: () => {
    //     Swal.showLoading();
    //   },
    // });

    const { name, email, password } = this.registroGroup.value;
    this.auth
      .crearUser(name, email, password)
      .then((credenciales) => {
        this.store.dispatch(ui.stopLoading())
        // Swal.close()
        this.router.navigate(['/login']);
      })
      .catch((err) => {
        this.store.dispatch(ui.stopLoading())
        const mssg = err.message.replace('Firebase: ', '');
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: mssg,
        });
      });
  }
}
