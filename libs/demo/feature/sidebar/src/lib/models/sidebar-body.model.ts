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
        icon: 'list',
        display: true,
        link: '/users'
      },
      {
        name: 'Create User',
        icon: 'add',
        display: true,
        link: '/users/new'
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
        icon: 'list',
        display: true,
        link: '/properties'
      },
      {
        name: 'Create Property',
        icon: 'add',
        display: true,
        link: '/properties/new'
      }
    ]
  },
  {
    name: 'Cars',
    icon: 'local_taxi',
    display: true,
    link: '/cars',
    children: [
      {
        name: 'Cars',
        icon: 'list',
        display: true,
        link: '/cars'
      }
      // {
      //   name: 'Create Car',
      //   icon: 'add',
      //   display: true,
      //   link: '/cars/new'
      // }
    ]
  },
  {
    name: 'Agents',
    icon: 'real_estate_agent',
    display: true,
    link: '/agents',
    children: [
      {
        name: 'Agents',
        icon: 'list',
        display: true,
        link: '/agents'
      }
      // {
      //   name: 'Create Car',
      //   icon: 'add',
      //   display: true,
      //   link: '/agents/new'
      // }
    ]
  }
];
