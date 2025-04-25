import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'CCTV Camera Management',
                items: [
                    { label: 'Configure Camera', icon: 'pi pi-cog', routerLink: ['/'] },
                    { label: 'Upload Model', icon: 'pi pi-upload', routerLink: ['/upload-model'] },
                    { label: 'Assign Models', icon: 'pi pi-check-square', routerLink: ['/assign-model'] },
                    { label: 'Cameras List', icon: 'pi pi-list', routerLink: ['/camera-list'] },
                    { label: 'Camera History', icon: 'pi pi-history', routerLink: ['/camera-history'] },
                    { label: 'Models List', icon: 'pi pi-list', routerLink: ['/model-list'] },
                    
                    
                   
                    // { 
                    //     label: 'Attendance System', 
                    //     icon: 'pi pi-fw pi-id-card', 
                    //     routerLink: ['/administration'], 
                    //     items: [
                    //         { label: 'Register New User', icon: 'pi pi-user-plus', routerLink: ['/administration/register'] },
                    //         { label: 'Generate Attendance Report', icon: 'pi pi-file', routerLink: ['/administration/attendance-report'] },
                    //         { label: 'Punch Attendance', icon: 'pi pi-clock', routerLink: ['/administration/punch-attendance'] }
                    //     ]
                    // }
                ]
            },
            
        ];
    }
}   