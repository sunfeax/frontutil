import { Routes } from '@angular/router';
import { Home } from './component/shared/home/home';
import { RoutedAdminPlist } from './component/blog/routed-admin-plist/routed-admin-plist';
import { RoutedAdminView } from './component/blog/routed-admin-view/routed-admin-view';
import { RoutedUserPlist } from './component/blog/routed-user-plist/routed-user-plist';
import { RoutedUserView } from './component/blog/routed-user-view/routed-user-view';
import { RoutedAdminEdit } from './component/blog/routed-admin-edit/routed-admin-edit';
import { RoutedAdminNew } from './component/blog/routed-admin-new/routed-admin-new';
import { RoutedAdminRemove } from './component/blog/routed-admin-remove/routed-admin-remove';
import { UskiVisitasPage } from './component/uski/pages/visitas/visitas.page';
import { UskiAdminPage } from './component/uski/pages/admin/admin.page';
import { UskiAdminRemovePage } from './component/uski/pages/admin-remove/admin-remove.page';
import { UskiAdminViewPage } from './component/uski/pages/admin-view/admin-view.page';
import { UskiVisitasNewPage } from './component/uski/pages/visitas-new/visitas-new.page';
import { UskiVisitasViewPage } from './component/uski/pages/visitas-view/visitas-view.page';


export const routes: Routes = [
  { path: '', component: Home },
  { path: 'blog', component: RoutedUserPlist },
  { path: 'blog/post/:id', component: RoutedUserView },
  { path: 'blog/plist', component: RoutedAdminPlist },
  { path: 'blog/view/:id', component: RoutedAdminView },
  { path: 'blog/new', component: RoutedAdminNew },
  { path: 'blog/edit/:id', component: RoutedAdminEdit },
  { path: 'blog/remove/:id', component: RoutedAdminRemove },

  // Vladislav Uski
  // public
  { path: 'visitas', component: UskiVisitasPage},
  { path: 'visitas/new', component: UskiVisitasNewPage },
  { path: 'visitas/view/:id', component: UskiVisitasViewPage },
  // admin
  { path: 'visitas/dashboard', component: UskiAdminPage },
  { path: 'visitas/dashboard/view/:id', component: UskiAdminViewPage },
  { path: 'visitas/dashboard/remove/:id', component: UskiAdminRemovePage },

];
