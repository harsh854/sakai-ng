import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { LocationHierarchy, State, District, LocationSuggestion, Coordinates } from '../models/device.interface';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private locationData: LocationHierarchy = {
    states: [
      {
        name: 'Maharashtra',
        code: 'MH',
        districts: [
          { name: 'Mumbai', code: 'MUM' },
          { name: 'Pune', code: 'PUN' },
          { name: 'Nagpur', code: 'NAG' },
          { name: 'Thane', code: 'THA' },
          { name: 'Aurangabad', code: 'AUR' },
          { name: 'Solapur', code: 'SOL' },
          { name: 'Nashik', code: 'NAS' }
        ]
      },
      {
        name: 'Karnataka',
        code: 'KA',
        districts: [
          { name: 'Bangalore', code: 'BAN' },
          { name: 'Mysore', code: 'MYS' },
          { name: 'Hubli', code: 'HUB' },
          { name: 'Mangalore', code: 'MAN' },
          { name: 'Belgaum', code: 'BEL' },
          { name: 'Gulbarga', code: 'GUL' }
        ]
      },
      {
        name: 'Tamil Nadu',
        code: 'TN',
        districts: [
          { name: 'Chennai', code: 'CHE' },
          { name: 'Coimbatore', code: 'COI' },
          { name: 'Madurai', code: 'MAD' },
          { name: 'Tiruchirappalli', code: 'TIR' },
          { name: 'Salem', code: 'SAL' },
          { name: 'Tirunelveli', code: 'TIN' }
        ]
      },
      {
        name: 'Gujarat',
        code: 'GJ',
        districts: [
          { name: 'Ahmedabad', code: 'AHM' },
          { name: 'Surat', code: 'SUR' },
          { name: 'Vadodara', code: 'VAD' },
          { name: 'Rajkot', code: 'RAJ' },
          { name: 'Bhavnagar', code: 'BHA' },
          { name: 'Jamnagar', code: 'JAM' }
        ]
      },
      {
        name: 'Rajasthan',
        code: 'RJ',
        districts: [
          { name: 'Jaipur', code: 'JAI' },
          { name: 'Jodhpur', code: 'JOD' },
          { name: 'Kota', code: 'KOT' },
          { name: 'Bikaner', code: 'BIK' },
          { name: 'Udaipur', code: 'UDA' },
          { name: 'Ajmer', code: 'AJM' }
        ]
      }
    ]
  };

  constructor() { }

  getStates(): Observable<State[]> {
    return of(this.locationData.states).pipe(delay(300));
  }

  getDistrictsByState(stateCode: string): Observable<District[]> {
    const state = this.locationData.states.find(s => s.code === stateCode);
    return of(state ? state.districts : []).pipe(delay(300));
  }

  searchLocationSuggestions(query: string, state: string, district: string): Observable<LocationSuggestion[]> {
    // Simulate location suggestions - in real implementation, this would call Google Places API
    const mockSuggestions: LocationSuggestion[] = [
      {
        address: `${query}, ${district}, ${state}`,
        coordinates: { latitude: 19.0760 + Math.random() * 0.1, longitude: 72.8777 + Math.random() * 0.1 }
      },
      {
        address: `${query} Road, ${district}, ${state}`,
        coordinates: { latitude: 19.0760 + Math.random() * 0.1, longitude: 72.8777 + Math.random() * 0.1 }
      },
      {
        address: `${query} Area, ${district}, ${state}`,
        coordinates: { latitude: 19.0760 + Math.random() * 0.1, longitude: 72.8777 + Math.random() * 0.1 }
      }
    ];

    return of(mockSuggestions.filter(s => 
      s.address.toLowerCase().includes(query.toLowerCase())
    )).pipe(delay(500));
  }

  getCoordinatesFromAddress(address: string): Observable<Coordinates> {
    // Mock coordinates - in real implementation, this would use Google Geocoding API
    const mockCoordinates: Coordinates = {
      latitude: 19.0760 + Math.random() * 0.1,
      longitude: 72.8777 + Math.random() * 0.1
    };
    
    return of(mockCoordinates).pipe(delay(300));
  }
}
