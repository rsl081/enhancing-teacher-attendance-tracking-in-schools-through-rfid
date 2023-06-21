import { Component, Input } from '@angular/core';
import { Nft } from '../../dashboard/models/nft';
import { User } from 'src/app/core/models/user';

@Component({
  selector: '[faculty-table-item]',
  templateUrl: './faculty-table-item.component.html',
  styleUrls: ['./faculty-table-item.component.scss'],
})
export class FacultyTableItemComponent {
  @Input() faculty = <User>{};
}
