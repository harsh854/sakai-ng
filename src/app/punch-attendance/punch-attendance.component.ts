import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { environment } from '../environment';

@Component({
  selector: 'app-punch-attendance',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    FormsModule
  ],
  templateUrl: './punch-attendance.component.html',
  styleUrls: ['./punch-attendance.component.scss']
})
export class PunchAttendanceComponent {
  customMessage: string = '';
  language: string = 'english';
  videoFeedUrl: string = '';
  isVideoFeedActive: boolean = false;

  // Method to start facial recognition and set video feed URL
  startRecognition() {
    // Construct the video feed URL with query parameters
    const rtsp_url1 = 0; 
    this.videoFeedUrl = `${environment.apiUrl}/video_feed?custom_message=${encodeURIComponent(this.customMessage)}&language=${encodeURIComponent(this.language)}&rtsp=${encodeURIComponent(rtsp_url1)}`;
    console.log("Video feed URL:", this.videoFeedUrl); // Debug
    this.isVideoFeedActive = true;
  }

  // Method to stop facial recognition and hide video feed
  stopRecognition() {
    this.videoFeedUrl = '';
    this.isVideoFeedActive = false;
  }
}
