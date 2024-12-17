import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: ``,
})
export class SidebarComponent {
  userSub: Subscription | undefined;
  nameUser: string | undefined;

  constructor(
    private auth: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}
  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }
  ngOnInit(): void {
    this.userSub = this.store
      .select('user').pipe(
        filter(({user})=>user!==null)
      )
      .subscribe(({user}) => this.nameUser = user?.nombre);
  }

  logout() {
    this.auth.logout().then(()=>{
      this.router.navigate(['/login']);
    })
  }
}
