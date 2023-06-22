import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HomePokemonComponent } from './home-pokemon/home-pokemon.component';
import { StaticPokemonComponent } from './static-pokemon/static-pokemon.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { BetterHighlightDirective } from './better-highlight/better-highlight.directive';
import { OpenMenuDirective } from './openMenu/open-menu.directive';


@NgModule({
  declarations: [
    AppComponent,
    HomePokemonComponent,
    StaticPokemonComponent,
    NotFoundComponent,
    BetterHighlightDirective,
    OpenMenuDirective,
    
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
