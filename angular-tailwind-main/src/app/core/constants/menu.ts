import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
    {
      group: 'Base',
      separator: false,
      items: [
        {
          icon: 'assets/icons/outline/chart-pie.svg',
          label: 'Dashboard',
          route: '/dashboard',
          children: [{ label: 'Nfts', route: '/dashboard/nfts' }],
        },
        {
          icon: 'assets/icons/outline/lock-closed.svg',
          label: 'Auth',
          route: '/auth',
          children: [
            { label: 'Sign up', route: '/auth/sign-up' },
            { label: 'Sign in', route: '/auth/sign-in' },
            { label: 'Forgot Password', route: '/auth/forgot-password' },
            { label: 'New Password', route: '/auth/new-password' },
            { label: 'Two Steps', route: '/auth/two-steps' },
          ],
        },
      ],
    },

    {
      group: 'Menu',
      separator: false,
      items: [
        {
          icon: 'assets/icons/outline/user-group.svg',
          label: 'Attendance',
          route: '/settings',
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
