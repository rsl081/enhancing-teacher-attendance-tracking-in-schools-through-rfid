import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/core/services/account.service';
import { AttendanceService } from 'src/app/core/services/attendance.service';
import * as ExcelJS from 'exceljs/dist/exceljs.min.js'

@Component({
  selector: '[attendance-table]',
  templateUrl: './attendance-table.component.html',
  styleUrls: ['./attendance-table.component.scss'],
})
export class AttendanceTableComponent implements OnInit {
  submitted = false;
  isAddFacultyDialogOpen = false;
  isDropDownOpen = false;
  activeAttendance: any[];
  date: any;
  currentDate: any;
  form: FormGroup;
  id: string;
  timeOut: string;
  isDisabled: boolean = false;
  isBgGray: boolean = false;
  attendanceText: string;

  constructor(
    private _accountService: AccountService,
    private _formBuilder: FormBuilder,
    private _attendanceService: AttendanceService,
  ) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      rfid: ['', Validators.required],
      displayName: ['', Validators.required],
      subject: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.fetchAttendance();
    this._attendanceService.attendanceUpdateNeeded.subscribe(() => {
      this.fetchSearchAttendance(this.getDate());
    });

    this.attendanceText = 'Create Attendance Log';
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
    this._attendanceService.searchAttendanceDate(date).subscribe({
      next: (attendance: any) => {
        this.activeAttendance = attendance.data.flatMap((x) => x.attendances);
        this.setAttendanceId(attendance.data.map((x) => x.id));

        let dateToCompare = attendance.data.map((x) => x.dateCreated.split('T')[0]);
        if (this.date == dateToCompare[0]) {
          this.isDisabled = true;
          this.isBgGray = true;
          this.attendanceText = "Attendance's Log";
          console.log('exist');
        } else {
          this.isDisabled = false;
          this.isBgGray = false;
          this.attendanceText = 'Create Attendance Log';
          console.log('not exist');
        }
      },
      error: (error) => alert(error.message),
    });
  }

  setAttendanceId(id: string) {
    this.id = id;
  }

  getAttendanceId() {
    return this.id;
  }

  toggleDropDown() {
    this.isDropDownOpen = !this.isDropDownOpen;
  }

  onAddFaculty() {
    this.submitted = false;
    const { rfid } = this.form.value;

    this._accountService.getAllFaculty(rfid).subscribe({
      next: (f: any) => {
        const id = f.map((x) => x.id);
        const displayNameFaculty = f.map((x) => x.displayName);
        const subjectFaculty = f.map((x) => x.subject);
        const rfidFaculty = f.map((x) => x.rfid);

        let time = '';
        this._attendanceService.getGetTimeAndDateNow().subscribe({
          next: (t) => {
            time = t;
          },
        });

        //* Done checking if the id exist
        if (id[0] == null) {
          this.form.reset();
          alert('Not yet registered');
          return;
        }

        //* Search muna if nag exist in per day
        this._attendanceService.searchAttendance(rfidFaculty, this.getAttendanceId()[0]).subscribe({
          next: (updateFaculty) => {
            const timeOut = updateFaculty.map((x) => x.timeOut);
            const timeIn = updateFaculty.map((x) => x.timeIn);
            const id = updateFaculty.map((x) => x.id);
            const rfid = updateFaculty.map((x) => x.rfid);

            if (rfid == '') {
              //* Create once per day
              let faculty = {
                teachName: displayNameFaculty[0],
                subject: subjectFaculty[0],
                rfid: rfidFaculty[0],
                timeOut: null,
                numberOfHour: 0,
                attendanceDateId: this.getAttendanceId()[0],
              };

              

              this._attendanceService.createAttendance(faculty).subscribe({
                complete: () => {
                  this.form.reset();
                  this._attendanceService.attendanceUpdateNeeded.next();
                },
                error: (error) => console.log(error),
              });
            } else {
              const timestamp1: any = new Date(time);
              const timestamp2: any = new Date(timeIn[0]);

              // Calculate the difference in milliseconds
              const timeDiffInHours = timestamp1 - timestamp2;

              // Convert milliseconds to seconds
              const hours = Math.floor(timeDiffInHours / (1000 * 60 * 60));

              let faculty = {
                id: id[0],
                teachName: displayNameFaculty[0],
                subject: subjectFaculty[0],
                rfid: rfidFaculty[0],
                timeIn: timeIn[0],
                timeOut: time,
                numberOfHour: hours,
                attendanceDateId: this.getAttendanceId()[0],
              };

              console.log('faculty!' + faculty.timeOut);

              this._attendanceService.updateAttendance(faculty).subscribe({
                complete: () => {
                  this.form.reset();
                  this._attendanceService.attendanceUpdateNeeded.next();
                },
                error: (error) => console.log(error),
              });
            }
          },
          error: (error) => console.log(error),
        });
      },
    });
  }

  getDate() {
    return this.date;
  }

  onDateChange(selectedDate: string) {
    this.date = selectedDate;
    this._attendanceService.attendanceUpdateNeeded.next();
  }

  toggleAttendanceDialog() {
    // console.log('date==' + this.getDate());
    const date = {
      dateCreated: this.getDate(),
    };

    this._attendanceService.createAttendanceDate(date).subscribe({
      complete: () => {
        alert('Successfully Created');
        this.isDisabled = true;
        this.isBgGray = true;
        this.attendanceText = "Attendance's Log";
        this._attendanceService.attendanceUpdateNeeded.next();
      },
    });
  }

  exportToExcel() {
    //  for (let row = 0; row <= this.activeAttendance.length; row++) {
    //    console.log(this.activeAttendance[0].teachName);
    //  }
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    worksheet.getCell('A1').value = 'Faculty Name';
    worksheet.getCell('B1').value = 'Subject';
    worksheet.getCell('C1').value = 'Time In';
    worksheet.getCell('D1').value = 'Time Out';
    worksheet.getCell('E1').value = 'No Of Hours';
    
    let ctr = 0
    // Loop to generate values in row 2
    for (let row = 2; row <= this.activeAttendance.length + 1; row++) {
      for (let col = 1; col <= 5; col++) {
        worksheet.getCell(`A${row}`).value = this.activeAttendance[ctr].teachName;
        worksheet.getCell(`B${row}`).value = this.activeAttendance[ctr].subject;
        worksheet.getCell(`C${row}`).value = this.activeAttendance[ctr].timeIn;
        worksheet.getCell(`D${row}`).value = this.activeAttendance[ctr].timeOut;
        worksheet.getCell(`E${row}`).value = this.activeAttendance[ctr].numberOfHour;
      }
      ctr++;
    }

    workbook.xlsx.writeBuffer().then((buffer: any) => {
      this.saveAsExcelFile(buffer, 'attendance.xlsx');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
  }

}
