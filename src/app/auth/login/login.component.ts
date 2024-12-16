import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import {Store} from "@ngrx/store";
import {AppState} from "../../app.reducer";
import * as ui from "../../shared/ui.actions";
import {Subscription} from "rxjs";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: ``,
})
export class LoginComponent  implements OnInit, OnDestroy {
  loginGroup: FormGroup = new FormGroup({});
  cargando:boolean =false;
  uiSubscripcion:Subscription | undefined
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private store:Store<AppState>
  ) {}
  ngOnInit(): void {
    this.loginGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.uiSubscripcion = this.store.select('ui').subscribe(ui=> this.cargando = ui.isLoading )
  }

  ngOnDestroy() {
    this.uiSubscripcion?.unsubscribe( )
  }

  login() {
    if (this.loginGroup.invalid) return;

    this.store.dispatch(ui.isLoading())

    // Swal.fire({
    //   title: 'Espere un momento...',
    //   didOpen:() => {
    //     Swal.showLoading();
    //   }
    // });
    const { email, password } = this.loginGroup.value;
    this.auth
      .loginUser(email, password)
      .then((credenciales) => {
        setTimeout(() => {
          // Swal.close()
          this.store.dispatch(ui.stopLoading())
          this.router.navigate(['/']);
        }, 4000);

      })
      .catch((err) => {
        this.store.dispatch(ui.stopLoading())
        const mssg = err.message
          .replace('Firebase: ', '')
          .replace('(auth/invalid-credential).', '');
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: mssg,
        });
      });
  }
}
