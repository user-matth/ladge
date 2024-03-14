import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import Cookies from 'js-cookie';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = Cookies.get('user');

    // Verifica se o usuário está tentando acessar a rota de login
    if (state.url === '/auth/login') {
      // Se o usuário já estiver logado, redireciona para o painel
      if (user) {
        this.router.navigate(['/panel']);
        return false;
      }
      return true; // Permite a navegação para a rota de login se não estiver logado
    }

    // Para outras rotas, verifica se o usuário não está logado e redireciona para o login
    if (!user) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    return true;
  }
}
