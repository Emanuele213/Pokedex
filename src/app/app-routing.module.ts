import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomePokemonComponent } from './home-pokemon/home-pokemon.component';
import { StaticPokemonComponent } from './static-pokemon/static-pokemon.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // manda sempre su questa pagina
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomePokemonComponent, canActivate: [AuthGuard] },
  { path: 'static/:id', component: StaticPokemonComponent, canActivate: [AuthGuard]},
  { path: '404', component: NotFoundComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/404' } // Rotta generica per gestire URL non validi
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
