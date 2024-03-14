import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { BrnCommandImports } from '@spartan-ng/ui-command-brain';
import { HlmCommandImports } from '@spartan-ng/ui-command-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  BrnPopoverComponent,
  BrnPopoverContentDirective,
  BrnPopoverTriggerDirective,
} from '@spartan-ng/ui-popover-brain';
import { HlmPopoverContentDirective } from '@spartan-ng/ui-popover-helm';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronsUpDown, lucideCheck, lucideSearch } from '@ng-icons/lucide';
import { HlmAvatarComponent, HlmAvatarFallbackDirective, HlmAvatarImageDirective } from '@spartan-ng/ui-avatar-helm';
import {
  lucideUserCircle,
  lucideLayers,
  lucideMessageSquare,
  lucideCode,
  lucideMail,
  lucideLogOut,
  lucideSmile,
  lucideCog,
  lucideGithub,
  lucideKeyboard,
  lucideUser,
  lucidePlus,
  lucidePlusCircle,
  lucideHelpCircle,
} from '@ng-icons/lucide';
import { BrnMenuTriggerDirective } from '@spartan-ng/ui-menu-brain';
import {
  HlmMenuComponent,
  HlmMenuGroupComponent,
  HlmMenuItemDirective,
  HlmMenuItemIconDirective,
  HlmMenuItemSubIndicatorComponent,
  HlmMenuLabelComponent,
  HlmMenuSeparatorComponent,
  HlmMenuShortcutComponent,
  HlmSubMenuComponent,
} from '@spartan-ng/ui-menu-helm';
import Cookies from 'js-cookie';
import { Router } from '@angular/router';

type Framework = { label: string; value: string };

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    BrnCommandImports,
    HlmCommandImports,
    HlmIconComponent,
    HlmButtonDirective,
    BrnPopoverComponent,
    BrnPopoverTriggerDirective,
    HlmPopoverContentDirective,
    BrnPopoverContentDirective,
    NgForOf,
    HlmAvatarImageDirective, 
    HlmAvatarComponent, 
    HlmAvatarFallbackDirective,
    BrnMenuTriggerDirective,
    HlmMenuComponent,
    HlmSubMenuComponent,
    HlmMenuItemDirective,
    HlmMenuItemSubIndicatorComponent,
    HlmMenuLabelComponent,
    HlmMenuShortcutComponent,
    HlmMenuSeparatorComponent,
    HlmMenuItemIconDirective,
    HlmMenuGroupComponent,
  ],
  providers: [provideIcons({ 
    lucideChevronsUpDown, 
    lucideSearch, 
    lucideCheck,
    lucideUser,
    lucideLayers,
    lucideCog,
    lucideKeyboard,
    lucideUserCircle,
    lucideSmile,
    lucidePlus,
    lucideGithub,
    lucideHelpCircle,
    lucideCode,
    lucideLogOut,
    lucideMail,
    lucideMessageSquare,
    lucidePlusCircle,
  })],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  @Input() public variant = 'public';
  currentUser: any | null = null;

  constructor(
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loadUserFromCookies();
  }

  loadUserFromCookies() {
    const user = Cookies.get('user');
    if (user) {
      this.currentUser = JSON.parse(user);
    }
  }

  public currentAccount = signal<Framework | undefined>(undefined);
  public state = signal<'closed' | 'open'>('closed');

  stateChanged(state: 'open' | 'closed') {
    this.state.set(state);
  }

  commandSelected(framework: Framework) {
    this.state.set('closed');
    if (this.currentAccount()?.value === framework.value) {
      this.currentAccount.set(undefined);
    } else {
      this.currentAccount.set(framework);
    }
  }

  logout() {
    Cookies.remove('user');
    this.router.navigate(['/']);
  }
}
