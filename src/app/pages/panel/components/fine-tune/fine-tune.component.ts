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
  selector: 'app-fine-tune',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fine-tune.component.html',
  styleUrls: ['./fine-tune.component.css']
})
export class FineTuneComponent implements OnInit {

  files: any;
  models: any;
  fineTunes: any;
  fileToUpload: File | null = null;
  formGroup!: FormGroup;
  drawerOpen = false;
  selectedItem: any = null;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.formGroup = this.fb.group({
      model: [''],
      file: [''],
    });
  }

  ngOnInit() {
    this.getAllModels();
    this.getAllFiles();
    this.getAllFineTunes();
  }

  getAllModels() {
    this.http.get<any>('https://api.openai.com/v1/models', {
      headers: {
        "Authorization": `Bearer ${environment.OPENAI_API_KEY}`
      }
    }).subscribe(models => {
      this.models = models;
      console.log(models);
    });
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

  getAllFineTunes() {
    this.http.get<any>('https://api.openai.com/v1/fine_tuning/jobs', {
      headers: {
        "Authorization": `Bearer ${environment.OPENAI_API_KEY}`
      }
    }).subscribe(fineTunes => {
      this.fineTunes = fineTunes;
      console.log(fineTunes);
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

  getTest() {
    this.http.get('https://teste.4selet.com.br/api/buscas/dados-zoom/LgFicv02HSHuuMukdska3hLqUBAsZ1Er4QPSeSsO', {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 206990e331c4fd47f68494777a6aee4c43a5af6e4b3c431eb4fdc06822347d8a93639cbebce290b1e7e30c670fdb0347242225e7c8fa736ed4fabc318e46aa73"
      }
    }).subscribe(response => {
      console.log(response);
    });
  }

  openNews(link: string) {
    window.open(link, '_blank');
  }

  fileSelected(event: any): void {
    this.fileToUpload = event.target.files[0];
  }
  
  uploadSelectedFile(): void {
    if (this.fileToUpload && this.formGroup.get('model')?.value) {
      this.uploadFile(this.fileToUpload, this.formGroup.get('model')?.value);
    } else {
      alert('Please select a file and enter a model.');
    }
  }

  getFileName(fileId: string) {
    if(!this.files) {
      return '-';
    } 
    return this.files.data.find((file: any) => file.id === fileId)?.filename;
  }

  toggleDrawer(item?: any) {
    this.drawerOpen = !this.drawerOpen;
    if (item) {
      this.selectedItem = item;
    }
  }

}
