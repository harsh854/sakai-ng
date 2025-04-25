import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { environment } from '../environment';

@Component({
  selector: 'app-upload-model',
  standalone: true,
  imports: [
    ToastModule, CommonModule, ReactiveFormsModule, ProgressSpinnerModule],
  templateUrl: './upload-model.component.html',
  styleUrls: ['./upload-model.component.scss'],
  providers: [MessageService],
})
export class UploadModelComponent {
  modelForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private messageService: MessageService
  ) {
    this.modelForm = this.fb.group({
      modelFile: [null],
      displayName: ['', Validators.required] // <-- added this
    });
    
  }

  // Handle file selection
  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedExtensions = /(\.pt)$/i;
      if (!allowedExtensions.exec(file.name)) {
        this.messageService.add({
          severity: 'error',
          summary: 'Invalid File',
          detail: 'Please upload a .pt file.',
        });
        return;
      }
      this.selectedFile = file;
    }
  }
  
  isUploading = false;

  onSubmit(): void {
    if (!this.selectedFile || !this.modelForm.value.displayName) {
      this.messageService.add({
        severity: 'error',
        summary: 'Missing Info',
        detail: 'Please select a file and enter a display name.',
      });
      return;
    }
  
    this.isUploading = true;
    const formData = new FormData();
    formData.append('model_file', this.selectedFile);
    formData.append('display_name', this.modelForm.value.displayName); 
  
    this.http.post(`${environment.apiUrl}/upload_model`, formData).subscribe({
      next: (response) => {
        console.log('Upload Successful:', response);
        this.messageService.add({
          severity: 'success',
          summary: 'Upload Successful',
          detail: 'Model uploaded successfully!',
        });
        this.isUploading = false;
        this.onReset();
      },
      error: (err) => {
        console.error('Upload Failed:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Upload Failed',
          detail: err.error.message || 'An error occurred while uploading.',
        });
        this.isUploading = false;
      },
    });
  }
  
  
  
  // Reset form and file selection
  onReset(): void {
    this.selectedFile = null;
    this.modelForm.reset();
    (document.getElementById('modelFile') as HTMLInputElement).value = '';
  }
  
} 
