import { Routes } from '@angular/router';
import { HomeComponent } from './pages/public/components/home/home.component';
import { PanelHomeComponent } from './pages/panel/components/panel-home/panel-home.component';
import { PanelBaseComponent } from './pages/panel/components/panel-base/panel-base.component';
import { AdminHomeComponent } from './pages/admin/components/admin-home/admin-home.component';
import { AdminBaseComponent } from './pages/admin/components/admin-base/admin-base.component';
import { PublicBaseComponent } from './pages/public/components/public-base/public-base.component';
import { AuthGuard } from './services/auth-guard/auth.guard';
import { PanelRepositoriesComponent } from './pages/panel/components/panel-repositories/panel-repositories.component';

export const routes: Routes = [
    {
        path: '',
        component: PublicBaseComponent,
        children: [
            { path: '', component: HomeComponent },
        ],
    },
    {
        path: 'panel',
        component: PanelBaseComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: PanelHomeComponent },
            { path: 'repos', component: PanelRepositoriesComponent },
        ],
    },
    {
        path: 'admin',
        component: AdminBaseComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: AdminHomeComponent },
        ],
    },
    { path: '', redirectTo: 'public', pathMatch: 'full' },
    { path: 'auth', loadChildren: () => import('./core/core.module').then(m => m.CoreModule), canActivate: [AuthGuard]}
];
