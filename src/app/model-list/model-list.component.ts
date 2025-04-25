import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { environment } from '../environment';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-model-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DialogModule,
    FormsModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    ToastModule,
    InputTextModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './model-list.component.html',
  styleUrl: './model-list.component.scss'
})
export class ModelListComponent implements OnInit {
  models: any[] = [];
  selectedModel: any = null;
  displayEditDialog: boolean = false;
  newDisplayName: string = '';
  newModelFile: File | null = null;
  isUpdating: boolean = false;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.fetchModels();
  }

  fetchModels(): void {
    this.http.get<any[]>(`${environment.apiUrl}/list_models`).subscribe({
      next: (data) => {
        this.models = data;
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch models.',
        });
      },
    });
  }

  openEditDialog(model: any): void {
    this.selectedModel = model;
    this.newDisplayName = model.display_name;
    this.newModelFile = null;
    this.displayEditDialog = true;
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.pt')) {
      this.newModelFile = file;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid File',
        detail: 'Please select a .pt file.',
      });
    }
  }

  updateModel(): void {
    if (!this.newDisplayName.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Display name is required.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('display_name', this.newDisplayName);
    if (this.newModelFile) {
      formData.append('model_file', this.newModelFile);
    }

    this.isUpdating = true;

    this.http
      .put(`${environment.apiUrl}/update_model/${this.selectedModel.id}`, formData)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Model updated successfully.',
          });
          this.displayEditDialog = false;
          this.fetchModels();
          this.isUpdating = false;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message || 'Update failed.',
          });
          this.isUpdating = false;
        },
      });
  }

  confirmDelete(model: any): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${model.display_name}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteModel(model.id);
      },
    });
  }

  deleteModel(modelId: number): void {
    this.http.delete(`${environment.apiUrl}/delete_model/${modelId}`).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Model deleted successfully.',
        });
        this.fetchModels();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message || 'Deletion failed.',
        });
      },
    });
  }
}