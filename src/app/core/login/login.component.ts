import { Component, OnInit } from '@angular/core';
import { HlmInputDirective } from '../../../../components/ui-input-helm/src/lib/hlm-input.directive';
import { HlmLabelDirective } from '../../../../components/ui-label-helm/src/lib/hlm-label.directive';
import { HlmButtonDirective } from '../../../../components/ui-button-helm/src/lib/hlm-button.directive';
import { provideIcons } from '@ng-icons/core';
import { lucideFacebook, lucideGithub, lucideMail } from '@ng-icons/lucide';
import { HlmIconComponent } from '../../../../components/ui-icon-helm/src/lib/hlm-icon.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Cookies from 'js-cookie';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    HlmInputDirective,
    HlmLabelDirective,
    HlmButtonDirective,
    HlmIconComponent,
    CommonModule,
    FormsModule
  ],
  providers: [provideIcons({
    lucideMail,
    lucideFacebook,
    lucideGithub
  })],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userEmail?: string;
  userPassword?: string;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) { }

  ngOnInit() {
  }

  login() {
    this.afAuth.signInWithEmailAndPassword(this.userEmail!, this.userPassword!)
      .then(result => {
        Cookies.set('user', JSON.stringify(result.user));
        this.router.navigate(['/panel']);
      })
      .catch(error => {
        let errorMsg = '';
        if (error.code === 'auth/invalid-email') {
          errorMsg = 'O e-mail fornecido é inválido.';
        } else if (error.code === 'auth/user-disabled') {
          errorMsg = 'Esta conta de usuário foi desativada.';
        } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          errorMsg = 'Usuário ou senha incorretos.';
        } else {
          errorMsg = 'Ocorreu um erro ao tentar fazer login.';
        }
        console.error(errorMsg);
      });
  }

  loginWithGoogle() {
    this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(result => {
        Cookies.set('user', JSON.stringify(result.user));
        this.router.navigate(['/panel'])
      })
      .catch(error => {
        console.error('Erro ao logar com o Google', error);
      });
  }
    
  loginWithGitHub() {
    this.afAuth.signInWithPopup(new firebase.auth.GithubAuthProvider())
    .then((result) => {
      Cookies.set('user', JSON.stringify(result.user));
      this.router.navigate(['/panel'])
    }).catch((error) => {
      console.error(error);
    });
  }

  logout() {
    this.afAuth.signOut()
      .then(() => {
        Cookies.remove('user');
        this.router.navigate(['/']);
      })
      .catch(error => {
        console.error('Erro ao fazer logout', error);
      });
  }

}
