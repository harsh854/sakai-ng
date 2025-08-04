import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Device } from '../models/device.interface';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private devices: Device[] = [];

  constructor() { }

  generateTenantId(): string {
    // Generate a unique tenant ID
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8);
    return `TENANT_${timestamp}_${random}`.toUpperCase();
  }

  checkDeviceIdExists(deviceId: string): Observable<boolean> {
    // Simulate API call to check if device ID already exists
    const exists = this.devices.some(device => device.deviceId === deviceId);
    return of(exists).pipe(delay(300));
  }

  registerDevice(device: Omit<Device, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>): Observable<Device> {
    // Generate unique IDs and timestamps
    const newDevice: Device = {
      ...device,
      id: this.generateUniqueId(),
      tenantId: this.generateTenantId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Simulate API call delay
    return of(newDevice).pipe(
      delay(1000),
      map(device => {
        this.devices.push(device);
        return device;
      })
    );
  }

  getDevices(): Observable<Device[]> {
    return of(this.devices).pipe(delay(300));
  }

  getDeviceById(id: string): Observable<Device | null> {
    const device = this.devices.find(d => d.id === id);
    return of(device || null).pipe(delay(300));
  }

  updateDevice(id: string, updates: Partial<Device>): Observable<Device | null> {
    const deviceIndex = this.devices.findIndex(d => d.id === id);
    if (deviceIndex === -1) {
      return of(null);
    }

    this.devices[deviceIndex] = {
      ...this.devices[deviceIndex],
      ...updates,
      updatedAt: new Date()
    };

    return of(this.devices[deviceIndex]).pipe(delay(500));
  }

  deleteDevice(id: string): Observable<boolean> {
    const deviceIndex = this.devices.findIndex(d => d.id === id);
    if (deviceIndex === -1) {
      return of(false);
    }

    this.devices.splice(deviceIndex, 1);
    return of(true).pipe(delay(300));
  }

  private generateUniqueId(): string {
    return `device_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
