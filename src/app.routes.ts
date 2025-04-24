import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { UploadModelComponent } from './app/upload-model/upload-model.component';
import { ConfigureCameraComponent } from './app/configure-camera/configure-camera.component';
import { AssignModelsComponent } from './app/assign-models/assign-models.component';
import { AttendanceSystemComponent } from './app/attendance-system/attendance-system.component';
import { CameraListComponent } from './app/camera-list/camera-list.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: ConfigureCameraComponent },
            {path: 'camera-list', component: CameraListComponent},
            {path: 'upload-model', component: UploadModelComponent},
            {path: 'assign-model', component: AssignModelsComponent},
            {path: 'administration', loadChildren: () => import('./app/attendance-system/attendance.routes').then(m => m.AttendanceRoutingModule)},
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
