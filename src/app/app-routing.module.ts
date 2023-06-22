import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomePokemonComponent } from './home-pokemon/home-pokemon.component';
import { StaticPokemonComponent } from './static-pokemon/static-pokemon.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: '', component: HomePokemonComponent },
  { path: 'static/:id', component: StaticPokemonComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' } //rotta acchiappa tutto
];

@NgModule({
  declarations: [],
  exports: [RouterModule],
  imports: [
    CommonModule, RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule { }
