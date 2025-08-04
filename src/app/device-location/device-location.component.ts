import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { NVRGroup, Device, Channel } from '../device-location.model';
import * as L from 'leaflet';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-device-location',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, RippleModule],
  templateUrl: './device-location.component.html',
  styleUrls: ['./device-location.component.scss']
})
export class DeviceLocationComponent implements OnInit {
  nvrGroups: NVRGroup[] = [];
  deviceList: Device[] = [];
  selectedLat: number | null = null;
  selectedLng: number | null = null;
  showMap = false;
  expandedRowKeys: { [key: string]: boolean } = {};

  private map: L.Map | null = null;
  private deviceChannelsMap = new Map<string, Channel[]>();

  @ViewChild('table') table!: Table;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.overrideDefaultLeafletIcons();
    this.getDeviceLocations();
  }

  getDeviceLocations() {
    this.http.get<any[]>(`${environment.apiUrl}/device-nvr-locations`).subscribe(data => {
      const nvrMap = new Map<string, NVRGroup>();
      const deviceList: Device[] = [];

      data.forEach(device => {
        const deviceId = device.device_id;

        // Extract channels for this device
        const channels = device.nvr_health &&
          device.nvr_health.working &&
          Array.isArray(device.nvr_health.working.ChanStatus)
            ? device.nvr_health.working.ChanStatus.map((ch: any) => {
                const rawBitrate = ch.bitRate ?? 0;
                const bitrate = typeof rawBitrate === 'string' ? parseFloat(rawBitrate) : Number(rawBitrate);

                return {
                  channel_id: ch.chanNo ?? 'N/A',
                  name: ch.name ?? 'N/A',
                  online: ch.online ?? false,
                  recording: ch.record ?? false,
                  bitrate: isNaN(bitrate) ? 0 : bitrate,
                  signal: ch.signal ?? false
                };
              })
            : [];

        // Store channels for this device
        this.deviceChannelsMap.set(device.device_id, channels);

        // Add device to the list
        deviceList.push({
          device_id: device.device_id,
          device_ip: device.device_ip,
          location_name: device.location_name,
          district: device.district,
          state: device.state,
          latitude: device.latitude,
          longitude: device.longitude,
          nvr_ip: device.nvr_ip,
          nvr_health: device.nvr_health
        });

        // Group by NVR (keeping the original logic for potential future use)
        if (nvrMap.has(deviceId)) {
          const existing = nvrMap.get(deviceId)!;
          existing.devices.push(device);
          if (channels.length > 0) {
            existing.channels = channels;
          }
        } else {
          nvrMap.set(deviceId, {
            nvr_ip: device.nvr_ip,
            nvr_id: deviceId,
            devices: [device],
            channels: channels,
            nvr_health: device.nvr_health
          });
        }
      });

      this.nvrGroups = Array.from(nvrMap.values());
      this.deviceList = deviceList;
    });
  }

  getDeviceChannels(device: Device): Channel[] {
    return this.deviceChannelsMap.get(device.device_id) || [];
  }

  getDeviceNVRHealth(device: Device) {
    return device.nvr_health;
  }

  formatBitrate(bitrate: number): string {
    if (!bitrate || bitrate === 0) {
      return 'N/A';
    }
    
    if (bitrate >= 1000000) {
      return (bitrate / 1000000).toFixed(1) + ' Mbps';
    } else if (bitrate >= 1000) {
      return (bitrate / 1000).toFixed(1) + ' Kbps';
    } else {
      return bitrate + ' bps';
    }
  }

  filterGlobal(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.table.filterGlobal(input.value, 'contains');
  }

  viewOnMap(lat: number, lng: number): void {
    this.selectedLat = lat;
    this.selectedLng = lng;
    this.showMap = true;

    setTimeout(() => this.initializeMap(), 0);
  }

  initializeMap(): void {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    if (this.selectedLat !== null && this.selectedLng !== null) {
      this.map = L.map('leafletMap').setView([this.selectedLat, this.selectedLng], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(this.map);

      L.marker([this.selectedLat, this.selectedLng])
        .addTo(this.map)
        .bindPopup('Device Location')
        .openPopup();
    }
  }

  closeMap(): void {
    this.showMap = false;
    this.selectedLat = null;
    this.selectedLng = null;

    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  private overrideDefaultLeafletIcons() {
    const iconRetinaUrl = 'assets/leaflet/marker-icon-2x.png';
    const iconUrl = 'assets/leaflet/marker-icon.png';
    const shadowUrl = 'assets/leaflet/marker-shadow.png';

    (L.Icon.Default as any).mergeOptions({
      iconRetinaUrl,
      iconUrl,
      shadowUrl
    });
  }
}