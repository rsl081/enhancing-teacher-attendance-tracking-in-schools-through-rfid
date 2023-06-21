import { Component, OnInit } from '@angular/core';
import { Nft } from '../../dashboard/models/nft';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/core/services/account.service';
import { User } from 'src/app/core/models/user';

@Component({
  selector: '[faculty-table]',
  templateUrl: './faculty-table.component.html',
  styleUrls: ['./faculty-table.component.scss'],
})
export class FacultyTableComponent implements OnInit {
  isAddFacultyDialogOpen = false;
  public activeFaculty: User[] = [];
  form: FormGroup;

  constructor(private _formBuilder: FormBuilder, private _accountService: AccountService) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      rfid: ['', Validators.required],
      displayName: ['', Validators.required],
      subject: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.fetchFaculty();
    this._accountService.userUpdateNeeded.subscribe(() => {
      this.fetchFaculty();
    });
  }

  fetchFaculty(): void {
    this._accountService.getAllFaculty().subscribe({
      next: (faculty) => {
        this.activeFaculty = faculty;   
      },
      error: (error) => alert(error.message),
    });
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

    this._accountService.registerFaculty(faculty).subscribe({
      complete: () => {
        alert('Successfully Created');
        this._accountService.userUpdateNeeded.next(faculty);
        this.toggleFacultyDialog();
      },
    });
  }
}
