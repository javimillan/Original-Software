import { Routes } from '@angular/router';
import { PacienteComponent } from './paciente/paciente.component';
import { StarterComponent } from './starter/starter.component';
import { FullComponent } from './layouts/full/full.component';

export const AppRoutes: Routes = [{
  path: '',
  component: FullComponent,
  children: [

      { path: '', redirectTo: '/starter', pathMatch: 'full' },
      { path: 'paciente', component: PacienteComponent },
      { path: 'starter', component: StarterComponent }

]
}];
