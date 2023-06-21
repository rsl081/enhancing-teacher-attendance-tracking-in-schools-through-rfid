import { Component, Input, OnInit } from '@angular/core';
import { Nft } from '../../dashboard/models/nft';
import { User } from 'src/app/core/models/user';
import { AccountService } from 'src/app/core/services/account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';

@Component({
  selector: '[faculty-table-item]',
  templateUrl: './faculty-table-item.component.html',
  styleUrls: ['./faculty-table-item.component.scss'],
})
export class FacultyTableItemComponent implements OnInit {
  isEditFacultyDialogOpen = false;
  isImgDialogOpen = false;
  @Input() faculty = <User>{};
  form: FormGroup;
  uploader: FileUploader;
  baseURL = environment.apiUrl;

  constructor(private _accountService: AccountService, private _formBuilder: FormBuilder) {}
  ngOnInit(): void {
    this.form = this._formBuilder.group({
      rfid: ['', Validators.required],
      displayName: ['', Validators.required],
      subject: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
    this.initializeUploader();
  }

  uploadImage() {
    this.uploadProfilePhoto(this.faculty.id);
  }

  uploadProfilePhoto(id: any) {
    if (this.uploader.queue.length) {
      this.uploader.setOptions({
        url: this.baseURL + 'account/add-photo/' + id,
      });
      this.uploader.uploadAll();
    }
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseURL + 'account/add-photo',
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
    });

    this.uploader.onAfterAddingFile = (file: FileItem) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response) => {
      alert('Successfully Updated');
      console.log(response);
      this._accountService.userUpdateNeeded.next(this.faculty);
    };

    this.uploader.onErrorItem = (item) => {
      if (!item.isSuccess) {
        // this.toaster.error('Upload failed');
      }
    };
  }

  deleteItem(id: any) {
    this._accountService.deleteFaculty(id).subscribe({
      complete: () => {
        alert('Successfully Deleted');
        this._accountService.userUpdateNeeded.next(this);
      },
      error: (error) => alert(error.message),
    });
  }

  toggleFacultyDialog() {
    this.isEditFacultyDialogOpen = !this.isEditFacultyDialogOpen;
  }

  editItemProduct(rfid: string, displayName: string, subject: string, email: string) {
    this.form.get('rfid').setValue(rfid);
    this.form.get('displayName').setValue(displayName);
    this.form.get('subject').setValue(subject);
    this.form.get('email').setValue(email);

    this.toggleFacultyDialog();
  }

  onEditFaculty() {
    const { rfid, displayName, subject, email } = this.form.value;

    const faculty = {
      rfid: rfid,
      displayName: displayName,
      subject: subject,
      email: email,
    };

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this._accountService.editFaculty(faculty).subscribe({
      complete: () => {
        alert('Successfully Updated');
        this._accountService.userUpdateNeeded.next(faculty);
        this.toggleFacultyDialog();
      },
    });
  }

  toggleImgDialog() {
    this.isImgDialogOpen = !this.isImgDialogOpen;
  }
}
