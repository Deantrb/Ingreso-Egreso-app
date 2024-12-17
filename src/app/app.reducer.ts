
import * as ui from './shared/ui.reducers'
import {ActionReducerMap} from "@ngrx/store";
import * as auth from "./auth/auth.reducer"
import * as inEg from "./ingreso-egreso/ingreso-egreso.reducer"

export interface AppState{
  ui:ui.State,
  user:auth.State,
  // ingresosEgresos:inEg.State
}

export const appReducers: ActionReducerMap<AppState> = {
  ui:ui.uiReducer,
  user:auth.authReducer,
  // ingresosEgresos: inEg.ingresoEgresoReducer
}
