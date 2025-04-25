import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environment';

// Define the structure of a model
interface Model {
  id: number; // or number, depending on your data
  name: string;
  display_name: string;
}

// Define the structure of a camera
interface Camera {
  id: number; // or number, depending on your data
  name: string;
}

@Component({
  selector: 'app-assign-models',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './assign-models.component.html',
  styleUrls: ['./assign-models.component.scss']
})
export class AssignModelsComponent implements OnInit {
  assignForm: FormGroup;
  cameras: Camera[] = []; // Explicitly define type
  models: Model[] = []; // Explicitly define type

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    // Initialize form group
    this.assignForm = this.fb.group({
      camera: ['', Validators.required],
      models: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Load cameras and models when the component initializes
    this.loadCameras();
    this.loadModels();
  }

  onSubmit() {
    if (this.assignForm.invalid) {
      alert('Please select a camera and at least one model.');
      return;
    }
  
    const { camera, models } = this.assignForm.value;
  
    this.http.post(`${environment.apiUrl}/assign_models`, { camera_id: camera, model_ids: models }).subscribe({
      next: () => {
        alert('Models assigned successfully!');
      },
      error: (err) => {
        console.error('Error assigning models:', err);
        alert(err.error.message || 'Failed to assign models. Please try again.');
      },
    });
  }
  
  loadCameras() {
    this.http.get<Camera[]>(`${environment.apiUrl}/list_cameras`).subscribe({
      next: (data) => (this.cameras = data),
      error: (err) => {
        console.error('Error loading cameras:', err);
        alert('Failed to load cameras. Please try again.');
      },
    });
  }
  
  loadModels() {
    this.http.get<Model[]>(`${environment.apiUrl}/list_models`).subscribe({
      next: (data) => (this.models = data),
      error: (err) => {
        console.error('Error loading models:', err);
        alert('Failed to load models. Please try again.');
      },
    });
  }
  

  // Open the streaming page for the selected camera
  startStream(cameraId: number) {
    const streamUrl = `${environment.apiUrl}/stream/${cameraId}`;
    window.open(streamUrl, '_blank');
  }
  
}
