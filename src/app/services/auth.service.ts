import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs';
import { Usuario } from '../models/usuario.models';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    public auth: AngularFireAuth,
    public firestore: AngularFirestore
  ) {}

  initAuthListener() {
    this.auth.authState.subscribe((user) => {
      console.log(user);
      console.log(user?.uid);
      console.log(user?.email);
    });
  }

  crearUser(name: string, email: string, password: string) {
    return this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
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
