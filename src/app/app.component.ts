import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'IngresoEgresoApp';

  constructor(private auth:AuthService){
    this.auth.initAuthListener()
  }
}
