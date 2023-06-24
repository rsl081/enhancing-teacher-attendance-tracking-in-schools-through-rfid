import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AttendanceService } from 'src/app/core/services/attendance.service';

@Component({
  selector: '[attendance-table]',
  templateUrl: './attendance-table.component.html',
  styleUrls: ['./attendance-table.component.scss'],
})
export class AttendanceTableComponent implements OnInit {
  isAddFacultyDialogOpen = false;
  isDropDownOpen = false;
  activeAttendance: any[];
  date: any;
  currentDate: any;
  form: FormGroup;
  test:any;

  constructor(private _formBuilder: FormBuilder, private _attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      rfid: ['', Validators.required],
      displayName: ['', Validators.required],
      subject: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    // this.fetchAttendance()
    //   .then((date) => {
    //     this.date = date;
    //   })
    //   .catch((error) => {
    //     alert(error.message);
    //   });

    //  this.fetchSearchAttendance()
    //    .then((activeAttendance: any) => {
    //      console.log(activeAttendance);
    //      this.activeAttendance = activeAttendance;
    //    })
    //    .catch((error) => {
    //      alert(error.message);
    //    });

    this.fetchAttendance();
    this._attendanceService.attendanceUpdateNeeded.subscribe(() => {
      this.fetchSearchAttendance(this.getDate());
    });

  }

  fetchAttendance(): void {

    this._attendanceService.getAttendance().subscribe({
      next: (attendance) => {
        this.currentDate = attendance.data.map((x) => x.dateCreated.split('T')[0]);
        this.date = this.currentDate[0].split('T')[0];
        this.fetchSearchAttendance(this.date);
      },
      error: (error) => alert(error.message),
    });
  }

  fetchSearchAttendance(date: any) {
    this._attendanceService.searchAttendance(date).subscribe({
      next: (attendance: any) => {
        this.activeAttendance = attendance.data.flatMap(x => x.attendances);
      },
      error: (error) => alert(error.message),
    });
  }

  toggleDropDown() {
    this.isDropDownOpen = !this.isDropDownOpen;
  }

  toggleFacultyDialog() {
    this.isAddFacultyDialogOpen = !this.isAddFacultyDialogOpen;
  }

  onAddFaculty() {
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

    // this._accountService.registerFaculty(faculty).subscribe({
    //   complete: () => {
    //     alert('Successfully Created');
    //     this._accountService.userUpdateNeeded.next(faculty);
    //     this.toggleFacultyDialog();
    //   },
    // });
  }

  setDate(d: string) {
    this.date = d;
    this._attendanceService.attendanceUpdateNeeded.next();
  }

  getDate() {
    return this.date;
  }
}

