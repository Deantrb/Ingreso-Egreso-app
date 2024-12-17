import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {IngresoEgreso} from "../models/ingreso-egreso.model";
import {AuthService} from "./auth.service";
import {map} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class IngresoEgresoService {


    constructor(private firestore: AngularFirestore, private auth: AuthService) {
    }

    crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
        const uid = this.auth.user?.uid
        delete  ingresoEgreso.uid;
        return this.firestore.doc(`${uid}/ingresos-egresos`)
            .collection('items')
            .add({...ingresoEgreso})

    }

    initIngresosEgresosListener(uid: string) {
        return this.firestore.collection(`${uid}/ingresos-egresos/items`)
            .snapshotChanges()
            .pipe(
                map(snapshot => snapshot.map(doc => ({
                        uid: doc.payload.doc.id, ...doc.payload.doc.data() as any
                    })
                ))
            )
    }

    borrarIngresoEgreso(uidItem:string){
        const uid = this.auth.user!.uid
        return this.firestore.doc(`${uid}/ingresos-egresos/items/${uidItem}`).delete()
    }
}
