export type AuthenticatedUser = {
  sub: string;
  email: string;
  fullName: string;
  roles: string[];
};
