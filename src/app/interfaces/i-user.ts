export interface iUser {
  id: number;
  username: string;
  password: string;
  email: string;
  name: string;
  surname: string;
  phoneNumber: string;
  avatar: string;
  roles: Role[];
}

export enum Role {
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_RESELLER = 'ROLE_RESELLER',
}
