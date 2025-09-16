import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-post-popup',
  imports: [ReactiveFormsModule],
  templateUrl: './post-popup.html',
})
export class PostPopup implements OnInit {
  @Input() handleClose!: () => void;
  @Input() isOpen!: boolean;

  postForm!: FormGroup;

  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  ngOnInit() {
    this.postForm = this.fb.group({
      title: [''],
      body: [''],
    });
  }

  onSubmit() {
    const payload = this.postForm.value;

    this.http.post('https://jsonplaceholder.typicode.com/posts', {...payload, userId: 1}).subscribe(() => {
      this.postForm.reset();
      this.handleClose();
      this.toastr.success("Post created successfully", 'Success')
    });
  }
}
