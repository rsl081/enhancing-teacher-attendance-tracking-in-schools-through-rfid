export interface User {
  id?: string;
  userPhoto?: string;
  email?: string;
  displayName?: string;
  token?: string;
  subject?: string;
  rfid?: string;
  createdAt?: string;
  role?: string;
  isApproved?: boolean;
}

export interface UserRoot {
  count: number;
  data: User[];
}
