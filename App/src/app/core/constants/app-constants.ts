import { MenuItem } from "../models/menu.modal";

export const systemRolesConst = [
  {id:1, value: 'Customer'},
  {id:2, value: 'Librarian'},
];

export const adminMenuConst: MenuItem[] = [
  {
      id: 1,
      label: 'MENU',
      isTitle: true
  },
  {
      id: 2,
      label: 'Dashboard',
      icon: 'bx-home-circle',
      link: '/admin/home',
  },
  {
    id: 3,
    label: 'Manage Books',
    icon: 'mdi mdi-book-open-page-variant-outline',
    subItems:[
      {
        id: 3.1,
        label: 'Add Book',
        link: '/admin/add-book',
        parentId: 3
      },
      {
        id: 3.2,
        label: 'Book List',
        link: '/admin/view-book',
        parentId: 3
      },
    ]
  },
  {
    id: 4,
    label: 'checked-out Books',
    icon: 'mdi mdi-book-lock-open',
    link: '/home/checked-book',
  },
];

export const userMenuConst: MenuItem[] = [
  {
      id: 1,
      label: 'MENU',
      isTitle: true
  },
  {
      id: 2,
      label: 'Dashboard',
      icon: 'bx-home-circle',
      link: '/user/home',
  },
  {
      id: 3,
      label: 'View Books',
      icon: 'mdi mdi-book-open-page-variant-outline',
      link: '/user/view-book',
  },
  {
    id: 3,
    label: 'Assigned Books',
    icon: 'mdi mdi-book-lock-open',
    link: '/home/checked-book',
  },
];

export enum BookStatus
{
	Available,
	CheckedOut
}

export enum UserRole
{
	Customer = "Customer",
	Librarian = "Librarian"
}
