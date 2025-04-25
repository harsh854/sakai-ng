import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-camera-history',
  imports: [
    TableModule,
    CommonModule
  ],
  templateUrl: './camera-history.component.html',
  styleUrl: './camera-history.component.scss'
})
export class CameraHistoryComponent implements OnInit {
  cameraHistory: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCameraHistory();
  }

  fetchCameraHistory() {
    this.http.get<any[]>(`${environment.apiUrl}/get_camera_model_history`).subscribe({
      next: (data) => {
        this.cameraHistory = data;
      },
      error: (err) => {
        console.error('Failed to load camera history', err);
      }
    });
  }
}