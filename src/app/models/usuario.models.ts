export class Usuario {

  static fromFirebase(user:any){
    return  new Usuario(user.uid,user.nombre,user.email)
  }
  constructor(
    public uid: any,
    public nombre: any,
    public email: any,
  ) {}
}
