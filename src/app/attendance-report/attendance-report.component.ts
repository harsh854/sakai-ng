import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { environment } from '../environment';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';


@Component({
    selector: 'app-attendance-report',
    standalone:true,
    imports:[
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        TableModule,       
        DividerModule,     
        MessageModule,     
        ToastModule
    ],
    templateUrl: './attendance-report.component.html',
    styleUrls: ['./attendance-report.component.scss']
})
export class AttendanceReportComponent implements OnInit {
    attendanceForm!: FormGroup;
    submitted = false;
    attendanceData: any[] = [];

    constructor(
        private fb: FormBuilder,
        private http: HttpClient
    ) {}

    ngOnInit(): void {
        this.attendanceForm = this.fb.group({
            employeeName: ['', Validators.required],
            employeeId: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required]
        });
    }

    onSubmit(): void {
        // Check if the form is invalid
        if (this.attendanceForm.invalid) {
            alert('Please fill in all required fields correctly.');
            return;
        }
    
        // Retrieve form data
        const formData = this.attendanceForm.value;
    
        // Display a confirmation for debugging purposes (optional)
        console.log('Form data submitted:', formData);
    
        // Fetch attendance data from the backend
        this.fetchAttendanceData(formData);
    }
    onReset(): void {
        this.submitted = false;
        this.attendanceForm.reset();
      }

    fetchAttendanceData(formData: any): void {
        this.http.post<any[]>(`${environment.apiUrl}/attendance`, formData).subscribe(
            data => {
                this.attendanceData = data;
            },
            error => {
                console.error('Error fetching attendance data:', error);
                this.attendanceData = [];
            }
        );
    }
    
}
