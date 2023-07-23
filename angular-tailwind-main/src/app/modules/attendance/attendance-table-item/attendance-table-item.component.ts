import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { AttendanceService } from 'src/app/core/services/attendance.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: '[attendance-table-item]',
  templateUrl: './attendance-table-item.component.html',
  styleUrls: ['./attendance-table-item.component.scss'],
})
export class AttendanceTableItemComponent implements OnInit {
  isEditFacultyDialogOpen = false;
  isImgDialogOpen = false;
  @Input() attendance: any;
  form: FormGroup;
  uploader: FileUploader;
  baseURL = environment.apiUrl;
  faculty: any;

  constructor(
    private datePipe: DatePipe,
    private _attendanceService: AttendanceService, private _formBuilder: FormBuilder) {}
  ngOnInit(): void {
    this.form = this._formBuilder.group({
      rfid: ['', Validators.required],
      displayName: ['', Validators.required],
      subject: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
    this.initializeUploader();

      this.attendance.timeIn = this.attendance.timeIn.split('T')[1];
      const timeIn = new Date('1970-01-01T' + this.attendance.timeIn + '+07:30'); // Create a Date object

      this.attendance.timeIn = this.datePipe.transform(timeIn, 'hh:mm a'); // Format the Date object
      

      if (this.attendance.timeOut != null) {
        this.attendance.timeOut = this.attendance.timeOut.split('T')[1];
        const timeOut = new Date('1970-01-01T' + this.attendance.timeOut + '+07:30'); // Create a Date object
  
        this.attendance.timeOut = this.datePipe.transform(timeOut, 'hh:mm a'); // Format the Date object
      }
      
  }

  

  uploadImage() {
    this.uploadProfilePhoto(this.attendance.id);
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
      this._attendanceService.attendanceUpdateNeeded.next(this.attendance);
    };

    this.uploader.onErrorItem = (item) => {
      if (!item.isSuccess) {
        // this.toaster.error('Upload failed');
      }
    };
  }

  deleteItem(id: any) {
    this._attendanceService.deleteAttendance(id).subscribe({
      complete: () => {
        alert('Successfully Deleted');
        this._attendanceService.attendanceUpdateNeeded.next();
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

    // this._attendanceService.updateAttendance(faculty).subscribe({
    //   complete: () => {
    //     alert('Successfully Updated');
    //     this._attendanceService.attendanceUpdateNeeded.next();
    //     this.toggleFacultyDialog();
    //   },
    // });
  }

  toggleImgDialog() {
    this.isImgDialogOpen = !this.isImgDialogOpen;
  }
}
