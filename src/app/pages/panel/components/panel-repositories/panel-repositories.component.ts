import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { provideIcons } from '@ng-icons/core';

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
  lucideGitPullRequestClosed,
  lucideLock,
  lucideEye,
  lucideCircle,
  lucideGitBranch,
  lucideMoreVertical,
  lucideArrowUpRight
} from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
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


@Component({
  selector: 'app-panel-repositories',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    SharedModule,
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
    HlmButtonDirective,
    HlmIconComponent,
  ],
  providers: [
    provideIcons({
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
      lucideGitPullRequestClosed,
      lucideLock,
      lucideEye,
      lucideCircle,
      lucideGitBranch,
      lucideMoreVertical,
      lucideArrowUpRight,
    }),
  ],
  templateUrl: './panel-repositories.component.html',
  styleUrls: ['./panel-repositories.component.css']
})
export class PanelRepositoriesComponent implements OnInit {

  repos: any [] = [];
  private originalRepos: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getRepos();
  }

  getRepos() {
    const headers = new HttpHeaders({
      Authorization: 'Bearer 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',
    });

    this.http.get<any[]>('https://api.github.com/user/repos', { headers }).subscribe(repos => {
      this.repos = repos.map(repo => ({ ...repo, lastCommit: null }));
      this.originalRepos = [...this.repos];
      this.repos.forEach(repo => {
        this.getLastCommit(repo, headers);
      });
      console.log(this.repos)
    });
  }

  getLastCommit(repo: any, headers: HttpHeaders) {
    this.http
      .get<any[]>(`https://api.github.com/repos/${repo.full_name}/commits`, { headers })
      .subscribe(commits => {
        if (commits.length > 0) {
          const index = this.repos.findIndex(r => r.id === repo.id);
          this.repos[index].lastCommit = commits[0];
        }
      });
  }

  href(repo: any) {
    window.open(repo.html_url, '_blank');
  }

  filterCommitsByPrivacy(privacy?: boolean) {
    if (privacy === undefined) {
      this.repos = [...this.originalRepos];
      return;
    }
    if (!this.originalRepos) {
      this.originalRepos = [...this.repos];
    }
    this.repos = this.originalRepos.filter(repo => repo.private === privacy);
  }

}
