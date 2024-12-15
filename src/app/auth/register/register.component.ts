import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { errorContext } from 'rxjs/internal/util/errorContext';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: ``,
})
export class RegisterComponent implements OnInit {
  registroGroup: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registroGroup = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  crearUsuario() {
    if (this.registroGroup.invalid) return;

    Swal.fire({
      title: 'Espere un momento...',
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const { name, email, password } = this.registroGroup.value;
    this.auth
      .crearUser(name, email, password)
      .then((credenciales) => {
        Swal.close()
        this.router.navigate(['/login']);
      })
      .catch((err) => {
        const mssg = err.message.replace('Firebase: ', '');
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: mssg,
        });
      });
  }
}
