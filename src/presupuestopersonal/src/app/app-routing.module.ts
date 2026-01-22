import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'transacciones',
    pathMatch: 'full'
  },
  {
    path: 'transacciones',
    loadChildren: () => import('./pages/transacciones/transacciones.module')
      .then(m => m.TransaccionesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
