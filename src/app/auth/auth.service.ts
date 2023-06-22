import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInFlag = false;

  login(username: string, password: string): boolean {
    if (username === 'emanuele@gmail.com' && password === '1234') {
      // Salva il token di autenticazione nel localStorage o in un cookie
      localStorage.setItem('token', 'jwt-token');
      this.isLoggedInFlag = true;
      return true;
    }
    return false;
  }

  logout(): void {
    // Rimuovi il token di autenticazione dal localStorage o dal cookie
    localStorage.removeItem('token');
    this.isLoggedInFlag = false;
  }

  isAuthenticated(): boolean {
    // Verifica se l'utente è autenticato controllando il token di autenticazione nel localStorage o nel cookie
    // In questo esempio, il flag isLoggedInFlag viene utilizzato per semplificare la logica
    return this.isLoggedInFlag;
  }
}
