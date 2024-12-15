import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: ``,
})
export class LoginComponent implements OnInit {
  loginGroup: FormGroup = new FormGroup({});
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loginGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginGroup.invalid) return;
    Swal.fire({
      title: 'Espere un momento...',
      didOpen:() => {
        Swal.showLoading();
      }
    });
    const { email, password } = this.loginGroup.value;
    this.auth
      .loginUser(email, password)
      .then((credenciales) => {
        setTimeout(() => {
          Swal.close()
          this.router.navigate(['/']);
        }, 4000);

      })
      .catch((err) => {
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
