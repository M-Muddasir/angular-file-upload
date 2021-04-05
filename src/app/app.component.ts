import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  userForm: FormGroup;
  isPhotoError = false;
  image: string;
  submitted : boolean = false;
  uploadError: string = '';
  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.newForm();
  }

  newForm = function () {
    this.userForm = this.fb.group({
      photo         : ['', Validators.compose([Validators.required])]
    })
  }

  PostData() {
    this.submitted = true;
    if(!this.userForm.valid) {
      return false;
    }
    if (this.userForm.get('photo').invalid) {
      this.isPhotoError = true;
    }
    this.uploadError = '';
    const formData = new FormData();
    formData.append('photo', this.userForm.get('photo').value);
    this.http.post('http://localhost:8082/upload', formData).subscribe(resp => {
      if(resp['status'] != 'success') {
        this.uploadError = resp['statusMessage'];
        return;
      }
      this.router.navigate(['/users'])
    }, (resp)=> {
      this.uploadError = 'Some error occured please try later';
      console.log(resp);
    });


  }

  onFileSelect(file: Event) {
    this.userForm.patchValue({ photo: file });
    this.userForm.get('photo').updateValueAndValidity();
  }
}