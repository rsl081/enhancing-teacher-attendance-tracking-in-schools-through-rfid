import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/core/services/account.service';
import { AttendanceService } from 'src/app/core/services/attendance.service';


@Component({
  selector: 'app-front-end',
  templateUrl: './front-end.component.html',
  styleUrls: ['./front-end.component.scss'],
})
export class FrontEndComponent implements OnInit {
  dateText = '';
  form: FormGroup;

  displayNameFaculty = '';
  userPhoto = '';
  timeIn: any;
  timeOut: any;

  id: string;

  constructor(
    private _formBuilder: FormBuilder,
    private _attendanceService: AttendanceService,
    private _accountService: AccountService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      rfid: ['', Validators.required],
    });

    this._attendanceService.getGetTimeAndDate().subscribe({
      next: (v) => {
        if (v.date == '') {
          this.dateText = '-/-/-';
        } else {
          this.dateText = v.date;
          this.fetchSearchAttendance(this.dateText);
        }
      },
    });

    this._attendanceService.attendanceUpdateNeeded.subscribe(() => {
      this.fetchSearchAttendance(this.getDate());
    });
  }

  fetchSearchAttendance(date: any) {
    this._attendanceService.searchAttendanceDate(date).subscribe({
      next: (attendance: any) => {
        this.setAttendanceId(attendance.data.map((x) => x.id));
      },
      error: (error) => alert(error.message),
    });
  }

  onAddFaculty() {
    const { rfid } = this.form.value;

    this._accountService.getAllFaculty(rfid).subscribe({
      next: (f: any) => {

        const id = f.map((x) => x.id);
        this.userPhoto = f.map((x) => x.userPhoto);

        const displayNameFaculty = f.map((x) => x.displayName);
        this.displayNameFaculty = f.map((x) => x.displayName);

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
            const isNowUpdated = updateFaculty.map((x) => x.isNowUpdated);
            const isLooping = updateFaculty.map((x) => x.isLooping);
           

            if (rfid == '') {
              //* Create once per day
              let faculty = {
                teachName: displayNameFaculty[0],
                subject: subjectFaculty[0],
                rfid: rfidFaculty[0],
                timeOut: null,
                numberOfHour: 0,
                isNowUpdated: true,
                isLooping: false,
                attendanceDateId: this.getAttendanceId()[0],
              };
             

              this._attendanceService.createAttendance(faculty).subscribe({
                next: (value) => {
                  let timeInSplit = value.timeIn.split('T')[1].split('+')[0];
                  const timeInNewFormat = new Date('1970-01-01T' + timeInSplit); // Create a Date object
                  this.timeIn = this.datePipe.transform(timeInNewFormat, 'hh:mm a'); // Create a Date object
                  this.timeOut = '';
                },
                complete: () => {
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
                isNowUpdated: isNowUpdated[0],
                isLooping: isLooping[0]
              };

              
              
              if (faculty.isNowUpdated === true && faculty.isLooping === false) {
                console.log(faculty.isNowUpdated);
                console.log('isLooping ' + faculty.isLooping);
                faculty.isNowUpdated = false;
                faculty.isLooping = true;

                this._attendanceService.updateAttendance(faculty).subscribe({
                  next: (value) => {
                    let timeInSplit = value.timeOut.split('T')[1].split('+')[0];
                    const timeInNewFormat = new Date('1970-01-01T' + timeInSplit + '+07:30'); // Create a Date object
                    this.timeOut = this.datePipe.transform(timeInNewFormat, 'hh:mm a'); // Create a Date object
                  },
                  complete: () => {
                    this._attendanceService.attendanceUpdateNeeded.next();
                  },
                  error: (error) => console.log(error),
                });
              } 
              else if (faculty.isLooping === true) {
          
                console.log('isLooping.......' );

                faculty.timeIn = time;
                faculty.timeOut = timeOut[0];

                faculty.isLooping = !faculty.isLooping;

                this._attendanceService.updateAttendance(faculty).subscribe({
                  next: (value) => {
                    let timeInSplit = value.timeIn.split('T')[1].split('+')[0];
                    const timeInNewFormat = new Date('1970-01-01T' + timeInSplit + '+07:30'); // Create a Date object
                    this.timeIn = this.datePipe.transform(timeInNewFormat, 'hh:mm a'); // Create a Date object
                    this.timeOut = '';
                  },
                  complete: () => {
                    this._attendanceService.attendanceUpdateNeeded.next();
                  },
                  error: (error) => console.log(error),
                });

              } else {
                console.log('isLooping nooww');
                
                faculty.timeIn = timeIn[0];
                faculty.timeOut = time;
                faculty.isLooping = !faculty.isLooping;

                this._attendanceService.updateAttendance(faculty).subscribe({
                  next: (value) => {
                    let timeInSplit = value.timeOut.split('T')[1].split('+')[0];
                    const timeInNewFormat = new Date('1970-01-01T' + timeInSplit + '+07:30'); // Create a Date object
                    this.timeOut = this.datePipe.transform(timeInNewFormat, 'hh:mm a'); // Create a Date object
                  },
                  complete: () => {
                    this._attendanceService.attendanceUpdateNeeded.next();
                  },
                  error: (error) => console.log(error),
                });
              }

            }
          },
          error: (error) => console.log(error),
        });
      },
    });
  }

  setAttendanceId(id: string) {
    this.id = id;
  }

  getAttendanceId() {
    return this.id;
  }

  getDate() {
    return this.dateText;
  }
}