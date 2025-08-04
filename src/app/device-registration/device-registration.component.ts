import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Services and Models
import { LocationService } from '../services/location.service';
import { DeviceService } from '../services/device.service';
import { State, District, LocationSuggestion, Device } from '../models/device.interface';

@Component({
  selector: 'app-device-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    AutoCompleteModule,
    PasswordModule,
    CardModule,
    DividerModule,
    MessageModule,
    MessagesModule,
    ProgressSpinnerModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './device-registration.component.html',
  styleUrls: ['./device-registration.component.scss']
})
export class DeviceRegistrationComponent implements OnInit, OnDestroy {
  registrationForm!: FormGroup;
  private destroy$ = new Subject<void>();

  // Location Data
  states: State[] = [];
  districts: District[] = [];
  locationSuggestions: LocationSuggestion[] = [];
  selectedLocationSuggestion: LocationSuggestion | null = null;

  // Loading States
  isLoadingStates = false;
  isLoadingDistricts = false;
  isLoadingLocationSuggestions = false;
  isSubmitting = false;
  isCheckingDeviceId = false;

  // Form State Management
  fieldsEnabled = false;
  deviceIdExists = false;

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private deviceService: DeviceService,
    private messageService: MessageService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadStates();
    this.setupFormSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.registrationForm = this.fb.group({
      deviceId: ['', [Validators.required, Validators.minLength(3)]],
      nvrIp: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/)]],
      nvrId: [{ value: '', disabled: true }, [Validators.required]],
      nvrPassword: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(6)]],
      state: ['', [Validators.required]],
      district: [{ value: '', disabled: true }, [Validators.required]],
      address: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(10)]],
      pincode: [{ value: '', disabled: true }, [Validators.pattern(/^[0-9]{6}$/)]]
    });
  }

  private setupFormSubscriptions(): void {
    // State selection handler
    this.registrationForm.get('state')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(stateCode => {
        if (stateCode) {
          this.loadDistrictsByState(stateCode);
          this.registrationForm.get('district')?.enable();
          this.registrationForm.get('district')?.setValue('');
        } else {
          this.registrationForm.get('district')?.disable();
          this.disableOtherFields();
        }
      });

    // District selection handler
    this.registrationForm.get('district')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(districtCode => {
        if (districtCode) {
          this.enableOtherFields();
        } else {
          this.disableOtherFields();
        }
      });

    // Device ID validation
    this.registrationForm.get('deviceId')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(deviceId => {
          if (deviceId && deviceId.length >= 3) {
            this.isCheckingDeviceId = true;
            return this.deviceService.checkDeviceIdExists(deviceId);
          }
          return [];
        })
      )
      .subscribe(exists => {
        this.isCheckingDeviceId = false;
        this.deviceIdExists = exists;
        
        if (exists) {
          this.registrationForm.get('deviceId')?.setErrors({ exists: true });
          this.messageService.add({
            severity: 'warn',
            summary: 'Device ID Exists',
            detail: 'This device ID is already registered.'
          });
        }
      });

    // Address field for location suggestions
    this.registrationForm.get('address')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(address => {
        if (address && address.length >= 3) {
          this.searchLocationSuggestions(address);
        } else {
          this.locationSuggestions = [];
        }
      });
  }

  private loadStates(): void {
    this.isLoadingStates = true;
    this.locationService.getStates()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (states) => {
          this.states = states;
          this.isLoadingStates = false;
        },
        error: (error) => {
          this.isLoadingStates = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load states'
          });
        }
      });
  }

  private loadDistrictsByState(stateCode: string): void {
    this.isLoadingDistricts = true;
    this.districts = [];
    
    this.locationService.getDistrictsByState(stateCode)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (districts) => {
          this.districts = districts;
          this.isLoadingDistricts = false;
        },
        error: (error) => {
          this.isLoadingDistricts = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load districts'
          });
        }
      });
  }

  searchLocationSuggestions(query: string): void {
    const stateCode = this.registrationForm.get('state')?.value;
    const districtCode = this.registrationForm.get('district')?.value;
    
    if (!stateCode || !districtCode) return;

    const state = this.states.find(s => s.code === stateCode)?.name || '';
    const district = this.districts.find(d => d.code === districtCode)?.name || '';

    this.isLoadingLocationSuggestions = true;
    this.locationService.searchLocationSuggestions(query, state, district)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (suggestions) => {
          this.locationSuggestions = suggestions;
          this.isLoadingLocationSuggestions = false;
        },
        error: (error) => {
          this.isLoadingLocationSuggestions = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load location suggestions'
          });
        }
      });
  }

  private enableOtherFields(): void {
    this.fieldsEnabled = true;
    this.registrationForm.get('nvrIp')?.enable();
    this.registrationForm.get('nvrId')?.enable();
    this.registrationForm.get('nvrPassword')?.enable();
    this.registrationForm.get('address')?.enable();
    this.registrationForm.get('pincode')?.enable();
  }

  private disableOtherFields(): void {
    this.fieldsEnabled = false;
    this.registrationForm.get('nvrIp')?.disable();
    this.registrationForm.get('nvrId')?.disable();
    this.registrationForm.get('nvrPassword')?.disable();
    this.registrationForm.get('address')?.disable();
    this.registrationForm.get('pincode')?.disable();
  }

  onLocationSuggestionSelect(event: any): void {
    const suggestion = event.value as LocationSuggestion;
    this.selectedLocationSuggestion = suggestion;
    this.registrationForm.get('address')?.setValue(suggestion.address);
  }

  onSubmit(): void {
    if (this.registrationForm.valid && !this.deviceIdExists) {
      this.isSubmitting = true;
      
      const formValue = this.registrationForm.getRawValue();
      const stateObj = this.states.find(s => s.code === formValue.state);
      const districtObj = this.districts.find(d => d.code === formValue.district);

      const device: Omit<Device, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'> = {
        deviceId: formValue.deviceId,
        nvrIp: formValue.nvrIp,
        nvrId: formValue.nvrId,
        nvrPassword: formValue.nvrPassword,
        location: {
          state: stateObj?.name || '',
          district: districtObj?.name || '',
          address: formValue.address,
          pincode: formValue.pincode
        },
        coordinates: this.selectedLocationSuggestion?.coordinates
      };

      this.deviceService.registerDevice(device)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (registeredDevice) => {
            this.isSubmitting = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `Device registered successfully! Tenant ID: ${registeredDevice.tenantId}`
            });
            this.resetForm();
          },
          error: (error) => {
            this.isSubmitting = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to register device. Please try again.'
            });
          }
        });
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.registrationForm.controls).forEach(key => {
      const control = this.registrationForm.get(key);
      if (control?.enabled) {
        control.markAsTouched();
      }
    });
  }

  resetForm(): void {
    this.registrationForm.reset();
    this.disableOtherFields();
    this.selectedLocationSuggestion = null;
    this.locationSuggestions = [];
    this.districts = [];
    this.deviceIdExists = false;
  }

  // Getter methods for template
  get isFormValid(): boolean {
    return this.registrationForm.valid && !this.deviceIdExists;
  }

  getFieldError(fieldName: string): string {
    const field = this.registrationForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} is too short`;
      if (field.errors['pattern']) {
        if (fieldName === 'nvrIp') return 'Please enter a valid IP address';
        if (fieldName === 'pincode') return 'Please enter a valid 6-digit pincode';
      }
      if (field.errors['exists']) return 'This device ID already exists';
    }
    return '';
  }
}
