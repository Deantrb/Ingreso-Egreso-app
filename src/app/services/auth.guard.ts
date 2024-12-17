import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CanActivate, CanMatch, Route, UrlSegment, Router } from '@angular/router';
import { Observable, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanMatch {
  constructor(private auth: AuthService, private router: Router) {}

  // Método canMatch debe aceptar route y segments
  canMatch(route: Route, segments: UrlSegment[]): Observable<boolean> {
    console.log(route,segments)
    return this.auth.isAuth().pipe(
      tap((state) => {
        if (!state) {
          this.router.navigate(['/login']);
        }
      }),
      take(1)
    );
  }

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
