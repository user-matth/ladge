import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {

  files: any;
  fileToUpload: File | null = null;
  formGroup!: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.formGroup = this.fb.group({
      purpose: ['fine-tune']
    });
  }

  ngOnInit() {
    this.getAllFiles();
  }

  getAllFiles() {
    this.http.get<any>('https://api.openai.com/v1/files', {
      headers: {
        "Authorization": `Bearer ${environment.OPENAI_API_KEY}`
      }
    }).subscribe(files => {
      this.files = files;
      console.log(files);
    });
  }

  uploadFile(file: File, purpose: string) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('purpose', purpose);

    this.http.post('https://api.openai.com/v1/files', formData, {
      headers: {
        "Authorization": `Bearer ${environment.OPENAI_API_KEY}`
      },
      reportProgress: true,
      observe: 'events'
    }).subscribe(event => {
      this.getAllFiles();
      console.log(event);
    });
  }

  openNews(link: string) {
    window.open(link, '_blank');
  }

  fileSelected(event: any): void {
    this.fileToUpload = event.target.files[0];
  }
  
  uploadSelectedFile(): void {
    if (this.fileToUpload && this.formGroup.get('purpose')?.value) {
      this.uploadFile(this.fileToUpload, this.formGroup.get('purpose')?.value);
    } else {
      alert('Please select a file and enter a purpose.');
    }
  }

  removeFile() {  
    this.fileToUpload = null;
  }

}
