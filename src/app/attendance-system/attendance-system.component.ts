import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-attendance-system',
  templateUrl: './attendance-system.component.html',
  styleUrls: ['./attendance-system.component.scss']
})
export class AttendanceSystemComponent implements OnInit {
  totalUsers: number = 100; // Sample data, this should come from an API
  attendanceToday: number = 25; // Sample data, this should come from an API

  constructor(private router: Router) {}

  ngOnInit() {
    // Load attendance data (this is just sample data for now)
    this.loadAttendanceData();
  }

  // Simulate loading attendance data
  loadAttendanceData() {
    // In a real-world scenario, you'd make an HTTP request here to get the data
    this.totalUsers = 150; // Replace with actual API data
    this.attendanceToday = 50; // Replace with actual API data
  }

}
