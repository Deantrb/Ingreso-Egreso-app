import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {map, Subscription} from 'rxjs';
import {Usuario} from '../models/usuario.models';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {Store} from "@ngrx/store";
import {AppState} from "../app.reducer";
import * as authActions from "../auth/auth.actions";

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  firebaseUnsubscribe:Subscription|undefined
  constructor(
    public auth: AngularFireAuth,
    public firestore: AngularFirestore,
    private store: Store<AppState>,
  ) {
  }

  initAuthListener() {
    this.auth.authState.subscribe((user) => {
      console.log(user);
      if (user) {
       this.firebaseUnsubscribe = this.firestore.doc(`${user.uid}/usuario`).valueChanges().subscribe((fireUser:any) => {
          const user = Usuario.fromFirebase(fireUser)
          this.store.dispatch(authActions.setUser({user}))
        })
      } else {
        this.firebaseUnsubscribe?.unsubscribe()
        this.store.dispatch(authActions.unSetUser())
      }

    });
  }

  crearUser(name: string, email: string, password: string) {
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(({user}) => {
        const newUser = new Usuario(user!.uid, name, user!.email);
        return this.firestore.doc(`${user?.uid}/usuario`).set({...newUser})
      });
  }

  loginUser(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(map((fbUser) => fbUser !== null));
  }
}
