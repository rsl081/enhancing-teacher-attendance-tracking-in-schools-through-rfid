import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
    {
      group: 'Menu',
      separator: false,
      items: [
        {
          icon: 'assets/icons/outline/user-group.svg',
          label: 'Attendance',
          route: '/attendance',
        },
        {
          icon: 'assets/icons/outline/users.svg',
          label: 'Faculty',
          route: '/faculty',
        },
      ],
    },
  ];
}
