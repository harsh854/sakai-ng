import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { environment } from '../environment';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-camera-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    TableModule,
    ConfirmDialogModule
  ],
  templateUrl: './camera-list.component.html',
  styleUrls: ['./camera-list.component.scss'],
  providers: [ConfirmationService,MessageService],
})
export class CameraListComponent implements OnInit {
  cameras: any[] = [];
  viewDialog = false;
  editDialog = false;
  selectedCamera: any;
  editForm: FormGroup<any> | null = null;
  // isClicked: boolean = false;

  editableFields = [
    { key: 'name', label: 'Name' },
    { key: 'ip', label: 'IP' },
    { key: 'port', label: 'Port' },
    { key: 'camera_number', label: 'Camera Number' },
    { key: 'user_id', label: 'User ID' },
    { key: 'password', label: 'Password' },
  ];
  viewFields = [
    { label: 'Name', key: 'name' },
    { label: 'IP', key: 'ip' },
    { label: 'Port', key: 'port' },
    { label: 'Camera Number', key: 'camera_number' },
    { label: 'User ID', key: 'user_id' },
    { label: 'Password', key: 'password' }
  ];

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadCameras();
  }

  loadCameras(): void {
    this.http.get<any[]>(`${environment.apiUrl}/list_cameras`).subscribe({
      next: (data) => {
        this.cameras = data;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load cameras.',
        });
      },
    });
  }

  onView(camera: any): void {
    this.selectedCamera = camera;
    this.viewDialog = true;
    // this.isClicked = true;
  }

  onEdit(camera: any): void {
    this.selectedCamera = camera;
    this.editForm = this.fb.group({
      name: [camera.name],
      ip: [camera.ip],
      port: [camera.port],
      camera_number: [camera.camera_number],
      user_id: [camera.user_id],
      password: [camera.password],
    });
    this.editDialog = true;
    // this.isClicked = true;
  }

  onUpdate(): void {
    if (!this.editForm) return;
    const updatedData = this.editForm.value;
    const cameraId = this.selectedCamera.id;

    this.http
      .put(`${environment.apiUrl}/update_camera/${cameraId}`, updatedData)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Camera updated successfully!',
          });
          this.editDialog = false;
          this.loadCameras();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Update Failed',
            detail: 'Could not update camera.',
          });
        },
      });
  }

  onDelete(id: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this camera?',
      header: 'Delete Camera',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        this.http.delete(`${environment.apiUrl}/delete_camera/${id}`).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'Camera deleted successfully!',
            });
            this.loadCameras();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Delete Failed',
              detail: 'Could not delete camera.',
            });
          },
        });
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: 'Deletion cancelled.',
        });
      },
    });
  }
  
}
