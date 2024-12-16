import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CanActivate, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.auth.isAuth().pipe(
      tap((state) => {
        if (!state) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
