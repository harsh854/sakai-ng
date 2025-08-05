import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MessageService } from 'primeng/api';

interface CameraField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  controlName: string;
  validators?: any[];
}

@Component({
  selector: 'app-camera-config',
  templateUrl: './camera-config.component.html',
  styleUrls: ['./camera-config.component.css'],
  providers: [MessageService]
})
export class CameraConfigComponent implements OnInit {
  cameraForm: FormGroup;
  submitted = false;
  isLoading = false;

  fields: CameraField[] = [
    {
      id: 'cameraName',
      label: 'Camera Name',
      type: 'text',
      placeholder: 'Enter camera name (e.g., Front Door Camera)',
      controlName: 'cameraName'
    },
    {
      id: 'ipAddress',
      label: 'IP Address',
      type: 'text',
      placeholder: 'Enter IP address (e.g., 192.168.1.100)',
      controlName: 'ipAddress'
    },
    {
      id: 'port',
      label: 'Port',
      type: 'number',
      placeholder: 'Enter port number (e.g., 8080)',
      controlName: 'port'
    },
    {
      id: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'Enter username for authentication',
      controlName: 'username'
    },
    {
      id: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter password for authentication',
      controlName: 'password'
    },
    {
      id: 'streamUrl',
      label: 'Stream URL',
      type: 'url',
      placeholder: 'Enter RTSP/HTTP stream URL',
      controlName: 'streamUrl'
    },
    {
      id: 'resolution',
      label: 'Resolution',
      type: 'text',
      placeholder: 'Enter resolution (e.g., 1920x1080)',
      controlName: 'resolution'
    },
    {
      id: 'frameRate',
      label: 'Frame Rate (FPS)',
      type: 'number',
      placeholder: 'Enter frame rate (e.g., 30)',
      controlName: 'frameRate'
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {
    this.cameraForm = this.createForm();
  }

  ngOnInit(): void {
    // Initialize form with default values or load existing configuration
    this.loadExistingConfiguration();
  }

  private createForm(): FormGroup {
    const formControls: { [key: string]: any } = {};
    
    this.fields.forEach(field => {
      const validators = [Validators.required];
      
      // Add specific validators based on field type
      switch (field.controlName) {
        case 'ipAddress':
          validators.push(this.ipAddressValidator);
          break;
        case 'port':
          validators.push(Validators.min(1), Validators.max(65535));
          break;
        case 'streamUrl':
          validators.push(Validators.pattern(/^(rtsp|http|https):\/\/.+/));
          break;
        case 'frameRate':
          validators.push(Validators.min(1), Validators.max(120));
          break;
        case 'resolution':
          validators.push(Validators.pattern(/^\d+x\d+$/));
          break;
      }
      
      formControls[field.controlName] = ['', validators];
    });

    return this.formBuilder.group(formControls);
  }

  // Custom validator for IP address
  private ipAddressValidator(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (!value) return null;
    
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(value) ? null : { invalidIp: true };
  }

  // Getter for easy access to form controls
  get f() {
    return this.cameraForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.cameraForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please correct the errors in the form before submitting.',
        life: 5000
      });
      
      // Focus on the first invalid field
      this.focusFirstInvalidField();
      return;
    }

    this.isLoading = true;
    
    // Simulate API call
    setTimeout(() => {
      this.saveCameraConfiguration();
    }, 2000);
  }

  private saveCameraConfiguration(): void {
    try {
      const formData = this.cameraForm.value;
      
      // Here you would typically make an API call to save the configuration
      console.log('Saving camera configuration:', formData);
      
      // Simulate successful save
      this.messageService.add({
        severity: 'success',
        summary: 'Configuration Saved',
        detail: `Camera "${formData.cameraName}" has been successfully configured.`,
        life: 5000
      });

      this.isLoading = false;
      this.submitted = false;
      
      // Optionally reset form or navigate to another page
      // this.cameraForm.reset();
      
    } catch (error) {
      this.isLoading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Save Failed',
        detail: 'An error occurred while saving the camera configuration. Please try again.',
        life: 5000
      });
    }
  }

  onReset(): void {
    this.submitted = false;
    this.cameraForm.reset();
    
    this.messageService.add({
      severity: 'info',
      summary: 'Form Reset',
      detail: 'All fields have been cleared.',
      life: 3000
    });
  }

  private loadExistingConfiguration(): void {
    // This method would typically load existing configuration from a service
    // For demonstration, we'll set some default values
    
    const defaultConfig = {
      cameraName: '',
      ipAddress: '',
      port: 8080,
      username: '',
      password: '',
      streamUrl: '',
      resolution: '1920x1080',
      frameRate: 30
    };

    // Uncomment to load default values
    // this.cameraForm.patchValue(defaultConfig);
  }

  private focusFirstInvalidField(): void {
    const firstInvalidField = document.querySelector('.ng-invalid[formControlName]') as HTMLElement;
    if (firstInvalidField) {
      firstInvalidField.focus();
      firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // Method to test camera connection (optional feature)
  testConnection(): void {
    if (this.f['ipAddress'].invalid || this.f['port'].invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Connection Details',
        detail: 'Please provide valid IP address and port before testing connection.',
        life: 4000
      });
      return;
    }

    this.messageService.add({
      severity: 'info',
      summary: 'Testing Connection',
      detail: 'Attempting to connect to the camera...',
      life: 3000
    });

    // Simulate connection test
    setTimeout(() => {
      const isConnected = Math.random() > 0.3; // 70% success rate for demo
      
      if (isConnected) {
        this.messageService.add({
          severity: 'success',
          summary: 'Connection Successful',
          detail: 'Successfully connected to the camera.',
          life: 4000
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Connection Failed',
          detail: 'Unable to connect to the camera. Please check your settings.',
          life: 5000
        });
      }
    }, 2000);
  }

  // Method to get field validation status
  isFieldValid(fieldName: string): boolean {
    const field = this.f[fieldName];
    return field.valid && (field.dirty || field.touched);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.f[fieldName];
    return field.invalid && (field.dirty || field.touched || this.submitted);
  }

  getFieldErrorMessage(fieldName: string): string {
    const field = this.f[fieldName];
    
    if (field.errors) {
      if (field.errors['required']) {
        const fieldLabel = this.fields.find(f => f.controlName === fieldName)?.label || fieldName;
        return `${fieldLabel} is required.`;
      }
      if (field.errors['invalidIp']) {
        return 'Please enter a valid IP address.';
      }
      if (field.errors['min']) {
        return `Value must be at least ${field.errors['min'].min}.`;
      }
      if (field.errors['max']) {
        return `Value must not exceed ${field.errors['max'].max}.`;
      }
      if (field.errors['pattern']) {
        switch (fieldName) {
          case 'streamUrl':
            return 'Please enter a valid stream URL (rtsp://, http://, or https://).';
          case 'resolution':
            return 'Please enter resolution in format: 1920x1080.';
          default:
            return 'Please enter a valid value.';
        }
      }
    }
    
    return '';
  }
}