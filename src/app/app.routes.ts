import { Routes } from '@angular/router';
import { ListaComponent } from './clientes/lista/lista.component';
import { FormularioComponent } from './clientes/formulario/formulario.component';

export const routes: Routes = [
  { path: '', redirectTo: 'clientes', pathMatch: 'full' },
  { path: 'clientes', component: ListaComponent },
  { path: 'clientes/:id', component: FormularioComponent },
  { path: '', redirectTo: '/clientes', pathMatch: 'full' }
];
