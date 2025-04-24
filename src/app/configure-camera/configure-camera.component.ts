import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment';

@Component({
  selector: 'app-configure-camera',
  standalone: true,
  imports: [
    ToastModule,CommonModule, ReactiveFormsModule],
  templateUrl: './configure-camera.component.html',
  styleUrls: ['./configure-camera.component.scss'],
  providers: [MessageService],
})
export class ConfigureCameraComponent implements OnInit {
  cameraForm!: FormGroup; // Form group to handle camera configuration
  submitted = false; // Tracks if the form has been submitted

  constructor(private fb: FormBuilder, private messageService: MessageService, private http: HttpClient) {}
  fields = [
    { id: 'name', label: 'Camera Name', type: 'text', placeholder: 'Enter Camera Name', controlName: 'name' },
    { id: 'ip', label: 'Camera IP', type: 'text', placeholder: 'Enter Camera IP', controlName: 'ip' },
    { id: 'port', label: 'Camera Port', type: 'number', placeholder: 'Enter Camera Port', controlName: 'port' },
    { id: 'camera_number', label: 'Camera Number', type: 'number', placeholder: 'Enter Camera Number', controlName: 'camera_number' },
    { id: 'user_id', label: 'User ID', type: 'text', placeholder: 'Enter User ID', controlName: 'user_id' },
    { id: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password', controlName: 'password' },
  ];
  
  ngOnInit(): void {
    // Initialize the form with default values and validators
    this.cameraForm = this.fb.group({
      name: ['', Validators.required],
      ip: ['', Validators.required],
      port: ['', Validators.required],
      camera_number: ['', Validators.required],
      user_id: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // Getter for easier access to form controls
  get f() {
    return this.cameraForm.controls;
  }

  // Handle form submission
  onSubmit(): void {
    this.submitted = true;

    if (this.cameraForm.valid) {
      const cameraData = this.cameraForm.value;

      // Send POST request to /add_camera endpoint
      this.http.post(`${environment.apiUrl}/add_camera`, cameraData)
        .subscribe(
          (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Camera configuration saved successfully!',
            });
            this.cameraForm.reset(); // Reset the form after successful submission
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to save camera configuration!',
            });
          }
        );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill out all required fields!',
      });
    }
  }

  onReset(): void {
    this.submitted = false;
    this.cameraForm.reset();
  }

}
