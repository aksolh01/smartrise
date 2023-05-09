export interface ICustomerAdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailConfirmed: boolean;
  isDeactivated: boolean;
  customerIsDeleted: boolean;
}
