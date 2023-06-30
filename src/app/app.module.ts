import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HomePokemonComponent } from './home-pokemon/home-pokemon.component';
import { StaticPokemonComponent } from './static-pokemon/static-pokemon.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BetterHighlightDirective } from './better-highlight/better-highlight.directive';
import { OpenMenuDirective } from './openMenu/open-menu.directive';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { PopUpComponent } from './pop-up/pop-up.component';
import { TierListComponent } from './tier-list/tier-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePokemonComponent,
    StaticPokemonComponent,
    NotFoundComponent,
    BetterHighlightDirective,
    OpenMenuDirective,
    LoginComponent,
    PopUpComponent,
    TierListComponent,
    
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
