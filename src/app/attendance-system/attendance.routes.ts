import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterNewUserComponent } from '../register-new-user/register-new-user.component';
import { AttendanceReportComponent } from '../attendance-report/attendance-report.component';
import { PunchAttendanceComponent } from '../punch-attendance/punch-attendance.component';

const routes: Routes = [
    { path: 'register', component: RegisterNewUserComponent },
    { path: 'attendance-report', component: AttendanceReportComponent },
    {path: 'punch-attendance', component: PunchAttendanceComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AttendanceRoutingModule {}
