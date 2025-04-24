import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment';

@Component({
  selector: 'app-user-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-new-user.component.html',
  styleUrls: ['./register-new-user.component.scss'],
  providers: [MessageService]
})
export class RegisterNewUserComponent implements OnInit {

  registerForm!: FormGroup;
  submitted = false;
  capturedImageBlob: string | undefined;

  constructor(private fb: FormBuilder, private messageService: MessageService, private http: HttpClient) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      company_name: [''],
      employee_id: ['', Validators.required],
      employee_name: ['', Validators.required],
      department: [''],
      email: ['', [Validators.required, Validators.email]],
      date_of_birth: ['', Validators.required],
      joining_date: ['', Validators.required],
      marital_status: ['Single'],
      country: [''],
      designation: [''],
      marriage_anniversary: [''],
      preferred_language: [''],
      shift: [''],
      manager_name: [''],
      gender: ['', Validators.required],
      face_snapshot: ['']
    });
  }


  capturePhoto(): void {
    const videoElement = document.querySelector('#cameraFeed') as HTMLVideoElement;
    const canvasElement = document.createElement('canvas');
    const ctx = canvasElement.getContext('2d');

    if (videoElement && ctx) {
        // Set canvas size to match video dimensions
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;

        // Draw the current video frame on the canvas
        ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

        // Convert the canvas content to Base64 string
        const base64Image = canvasElement.toDataURL('image/png');

        // Update the form with the captured Base64 image
        this.registerForm.patchValue({ face_snapshot: base64Image });
        this.capturedImageBlob = base64Image; // Optional: For previewing in the UI
    } else {
        console.error('Video element or context not available.');
        alert('Unable to capture photo. Please try again.');
    }
}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e: any) => {
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 640; // Resize width
          canvas.height = (img.height / img.width) * 640;
          const context = canvas.getContext('2d');
          context?.drawImage(img, 0, 0, canvas.width, canvas.height);
          this.registerForm.patchValue({
            face_snapshot: canvas.toDataURL('image/png'),
          });
        };
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.valid) {
      const registerData = this.registerForm.value;
      console.log('Register Data:', registerData); // Debug form data

      // Send POST request to /submit endpoint
      this.http.post(`${environment.apiUrl}/submit`, registerData).subscribe(
        (response) => {
          console.log('Success response:', response);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User registered successfully!',
          });
          this.registerForm.reset(); // Reset the form after successful submission
          this.submitted = false; // Reset submission state
        },
        (error) => {
          console.error('Error:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to register user!',
          });
        }
      );
    } else {
      console.error('Form is invalid:', this.registerForm);
      console.log('Invalid fields and their errors:');
      Object.keys(this.registerForm.controls).forEach((key) => {
        const control = this.registerForm.get(key);
        if (control?.invalid) {
          console.log(`${key}:`, control.errors);
        }
      });

      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill out all required fields correctly!',
      });
    }
  }
}
