import { Routes } from '@angular/router';

import { Home } from './component/shared/home/home';
import { LoginComponent } from './component/shared/login/login.component';
import { Logout } from './component/shared/logout/logout';
import { UskiVisitasPage } from './component/uski/pages/visitas/visitas.page';
import { UskiVisitasNewPage } from './component/uski/pages/visitas-new/visitas-new.page';
import { UskiVisitasViewPage } from './component/uski/pages/visitas-view/visitas-view.page';
import { UskiAdminPage } from './component/uski/pages/admin/admin.page';
import { UskiAdminRemovePage } from './component/uski/pages/admin-remove/admin-remove.page';
import { UskiAdminViewPage } from './component/uski/pages/admin-view/admin-view.page';
import { UskiAdminEditPage } from './component/uski/pages/admin-edit/admin-edit.page';
import { AdminGuard } from './guards/admin.guard';
import { PendingChangesGuard } from './guards/pending-changes.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: Logout },

  // Vladislav Uski
  { path: 'visitas', component: UskiVisitasPage },
  { path: 'visitas/new', component: UskiVisitasNewPage, canDeactivate: [PendingChangesGuard] },
  { path: 'visitas/view/:id', component: UskiVisitasViewPage },
  { path: 'visitas/dashboard', component: UskiAdminPage, canActivate: [AdminGuard] },
  { path: 'visitas/dashboard/view/:id', component: UskiAdminViewPage, canActivate: [AdminGuard] },
  {
    path: 'visitas/dashboard/edit/:id',
    component: UskiAdminEditPage,
    canActivate: [AdminGuard],
    canDeactivate: [PendingChangesGuard],
  },
  { path: 'visitas/dashboard/remove/:id', component: UskiAdminRemovePage, canActivate: [AdminGuard] },

  { path: '**', redirectTo: '' },
];
