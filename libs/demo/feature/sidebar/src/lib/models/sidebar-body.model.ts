import { MenuItem } from '@demo/shared/ui-sidebar';

export const BODY_ITEMS: MenuItem[] = [
  {
    name: 'Home',
    icon: 'home',
    link: '/home'
  },
  {
    name: 'Users',
    icon: 'person',
    display: true,
    link: '/users',
    children: [
      {
        name: 'Users',
        icon: 'contact_mail',
        display: true,
        link: '/users'
      },
      {
        name: 'Create User',
        icon: 'contact_mail',
        display: true,
        link: '/users/create'
      }
    ]
  },
  {
    name: 'Properties',
    icon: 'apartment',
    display: true,
    link: '/properties',
    children: [
      {
        name: 'Properties',
        icon: 'contact_mail',
        display: true,
        link: '/properties'
      },
      {
        name: 'Create User',
        icon: 'contact_mail',
        display: true,
        link: '/properties/create'
      }
    ]
  }
];
