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

  searchStartDate = '';
  searchEndDate = '';

  constructor(
    private _accountService: AccountService,
    private _formBuilder: FormBuilder,
    private _attendanceService: AttendanceService,
  ) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      search: ['', Validators.required],
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
    const { search } = this.form.value;

    //* Search muna if nag exist in per day
    this._attendanceService.searchAttendanceTable(search, '', '', this.getAttendanceId()[0]).subscribe({
      next: (updateFaculty) => {
        this.activeAttendance = updateFaculty.map((x) => x);
      },
      error: (error) => console.log(error),
    });
  }

  onStartDate(startDate: any) {
    this.searchStartDate = startDate.toString();
    this._attendanceService
      .searchAttendanceTable('', this.searchStartDate, this.searchEndDate, '')
      .subscribe({
        next: (response: any) => (this.activeAttendance = response.map((x) => x)),
      });
  }

  onEndDate(endDate: any) {
    this.searchEndDate = endDate.toString();
    this._attendanceService
      .searchAttendanceTable('', this.searchStartDate, this.searchEndDate, '')
      .subscribe({
        next: (response: any) => (this.activeAttendance = response.map((x) => x)),
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
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    worksheet.getCell('A1').value = 'Faculty Name';
    const cellA1 = worksheet.getCell('A1');
    cellA1.font = {
      bold: true,
    };

    worksheet.getCell('B1').value = 'Subject';
    const cellB1 = worksheet.getCell('B1');
    cellB1.font = {
      bold: true,
    };

    worksheet.getCell('C1').value = 'Time In';
    const cellC1 = worksheet.getCell('C1');
    cellC1.font = {
      bold: true,
    };

    worksheet.getCell('D1').value = 'Time Out';
    const cellD1 = worksheet.getCell('D1');
    cellD1.font = {
      bold: true,
    };
    
    worksheet.getCell('E1').value = 'Date';
    const cellE1 = worksheet.getCell('E1');
    cellE1.font = {
      bold: true,
    };

    let ctr = 0;
    // Loop to generate values in row 2
    for (let row = 2; row <= this.activeAttendance.length + 1; row++) {
      for (let col = 1; col <= 5; col++) {
        worksheet.getCell(`A${row}`).value = this.activeAttendance[ctr].teachName;
        worksheet.getCell(`B${row}`).value = this.activeAttendance[ctr].subject;
        worksheet.getCell(`C${row}`).value = this.activeAttendance[ctr].timeIn;
        worksheet.getCell(`D${row}`).value = this.activeAttendance[ctr].timeOut;
        worksheet.getCell(`E${row}`).value = this.date;
      }
      ctr++;
    }

    workbook.xlsx.writeBuffer().then((buffer: any) => {
      this.saveAsExcelFile(buffer, 'attendance.xlsx');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
  }
}
