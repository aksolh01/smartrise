/* eslint-disable @typescript-eslint/member-ordering */
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { StorageConstants } from '../_shared/constants';
import { IAccountUserRoles } from '../_shared/models/account-selection.model';
import {
  AccountUsersParams,
  IAccountUserLookup,
  IAccountUserPayload,
  IAccountUserResponse
} from '../_shared/models/account-user.model';
import { IAskForAccessDto } from '../_shared/models/ask-for-access-dto';
import { IChangePassword } from '../_shared/models/changePassword';
import {
  ICustomerUserPayload,
  ICustomerUserResponse
} from '../_shared/models/customer-user-by-customer-admin.model';
import {
  ICustomerUserBySmartriseResponse
} from '../_shared/models/customer-user-by-smartrise.model';
import { CustomerUsersParams } from '../_shared/models/customerUsersParams';
import { IAccount } from '../_shared/models/IAccount';
import {
  IAccountUserBySmartriseResponse,
  ICustomerUser
} from '../_shared/models/ICustomerUser';
import { ICustomerUserLookup } from '../_shared/models/ICustomerUserLookup';
import { IGetSmartriseUser } from '../_shared/models/IGetSmartriseUser';
import { IResetAnonymousPasswordDto } from '../_shared/models/IResetAnonymousPasswordDto';
import { ISmartriseUser } from '../_shared/models/ISmartriseUser';
import { ISmartriseUserLookup } from '../_shared/models/ISmartriseUserLookup';
import { IUser } from '../_shared/models/IUser';
import { IUserLookup } from '../_shared/models/IUserLookup';
import { Pagination } from '../_shared/models/pagination';
import { IPermission } from '../_shared/models/permission.model';
import { IResetPassword } from '../_shared/models/resetPassword';
import { IRole } from '../_shared/models/role';
import { SmartriseUsersParams } from '../_shared/models/smartriseUsersParams';
import { IRefreshToken } from '../_shared/models/token.model';
import { UpdateUserProfile } from '../_shared/models/UpdateUserProfile';
import { MultiAccountsService } from './multi-accounts-service';
import { TokenService } from './token.service';
import { IUserProfileInfo } from '../_shared/models/IUserProfileInfo';

@Injectable()
export class AccountService {
  baseUrl = environment.apiUrl;
  loadedUser: IUser;

  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();

  private stopImpersonate = new Subject<IUser>();
  stopImpersonate$ = this.stopImpersonate.asObservable();

  private uploadProfilePictureStatusUpdate = new Subject<number>();
  uploadProfilePictureStatusUpdate$ =
    this.uploadProfilePictureStatusUpdate.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService,
    private multiAccountsService: MultiAccountsService
  ) { }

  getLinkedAccounts() {
    return this.http.get<IAccountUserRoles[]>(
      `${environment.apiUrl}account/linkedAccounts`
    );
  }

  uploadProfilePicture(picture: File) {
    const formData = new FormData();
    formData.append('file', picture, picture.name);

    this.http
      .post(`${environment.apiUrl}account/profile/upload`, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .subscribe((event) => {
        if (event.type === HttpEventType.UploadProgress) {
          console.log(Math.round((100 * event.loaded) / event.total));
        } else if (event.type === HttpEventType.Response) {
          if (parseInt(event.body['uploadStatus'], 10) === 1) {
            this.uploadProfilePictureStatusUpdate.next(100);
          } else {
            this.uploadProfilePictureStatusUpdate.next(-1);
          }
        }
      });
  }

  checkSession() {
    if (this.tokenService.tokenExpires()) {
      this.logout(false);
      this.notifySessionExpired();
      this.router.navigateByUrl('auth/login', {
        state: {
          sessionExpired: true,
        },
      });
      throw new Error('Session has been expired');
    }
  }

  notifySessionExpired() {
    localStorage.setItem(StorageConstants.SessionExpired, 'EXPIRED');
    localStorage.removeItem(StorageConstants.SessionExpired);
  }

  checkSessionExpiry() {
    return this.loadCurrentUser(this.tokenService.getToken());
  }

  loadCurrentUser(token: string = this.tokenService.getToken()): Observable<IUser> {
    if (token === null) {
      this.currentUserSource.next(null);
      return of(null);
    }
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<IUser>(this.baseUrl + 'account/whoAmI', { headers }).pipe(
      map((user: IUser) => {
        this.loadedUser = user;
        return user;
      })
    );
  }

  loadProfileInfo() {
    return this.http.get<IUserProfileInfo>(this.baseUrl + 'account/profile');
  }

  canGenerateCodeAfter(email: string): Observable<any> {
    return this.http
      .get(this.baseUrl + 'account/canGenerateCodeAfter?email=' + email)
      .pipe(map((result: any) => result));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  deleteProfilePhoto(photoGuid: string) {
    return this.http.delete(this.baseUrl + 'account/profile/deleteprofile').pipe(
      map((result: any) => {
        console.log(result);
      })
    );
  }

  login(values: any) {
    return this.http.post(this.baseUrl + 'account/login', values).pipe(
      tap((user: IUser) => {
        if (!user.is2StepVerificationRequired) {
          this.loadedUser = user;
          this.tokenService.saveToken(user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  verify(twoFactorDto: any) {
    return this.http
      .post(this.baseUrl + 'account/twoStepVerification', twoFactorDto)
      .pipe(
        tap((user: IUser) => {
          this.loadedUser = user;
          this.tokenService.saveToken(user.token);
          this.currentUserSource.next(user);
        })
      );
  }

  updateCustomerUserBySmartrise(user: any) {
    return this.http.put(
      this.baseUrl + 'account/customerUserBySmartrise',
      user
    );
  }

  regenerateCode(regenerateCodeDto: any) {
    return this.http.post<any>(
      this.baseUrl + 'account/regenerateCode',
      regenerateCodeDto
    );
  }

  updateUserLocal(user: IUser) {
    this.currentUserSource.next(user);
  }

  canLogout() {
    return true;
  }

  logoutFromAllTabs() {
    this.tokenService.shareSessionStorage('LOGOUT');
    this.router.navigateByUrl('auth/logout');
  }

  logout(shareSession: boolean = true, callback?: () => void) {
    this.loadedUser = null;
    this.currentUserSource.next(null);
    this.tokenService.clearToken();
    this.multiAccountsService.clearSelectedAccount();
    sessionStorage.removeItem('2FAIsActivated');
    if (shareSession) {
      this.tokenService.shareSessionStorage('LOGOUT');
    }
    if (callback) {
      callback();
    }
  }

  isLoggedIn() {
    return !!this.tokenService.getToken();
  }

  isLoggedInV2() {
    const token = this.tokenService.getToken();

    if (token === null) {
      this.currentUserSource.next(null);
      return of(null);
    }

    return of(true);
  }

  checkEmailExists(email: string) {
    return this.http.get(this.baseUrl + 'account/emailexists?email=' + email);
  }

  checkTwoStepVerification(twoFactorDto: any) {
    return this.http
      .post(this.baseUrl + 'account/checkTwoStepVerification', twoFactorDto)
      .pipe(map((user: any) => user));
  }

  confirm(value: any) {
    return this.http
      .post(this.baseUrl + 'account/confirmEmail', value)
      .pipe(map(() => {}));
  }

  getUserById(userId: string) {
    return this.http.get<IAccount>(this.baseUrl + 'account/accounts/' + userId);
  }

  resetPasswordRequest(id: string) {
    return this.http
      .post(`${this.baseUrl}account/resetPasswordRequest?adminUserId=${id}`, {
        observe: 'response',
      })
      .pipe(map((response) => response));
  }

  resetPassword(value: IResetPassword) {
    return this.http
      .post(this.baseUrl + 'account/ResetPassword', value, {
        observe: 'response',
      })
      .pipe(map((response) => response));
  }

  changePassword(changePassword: IChangePassword) {
    return this.http
      .post(this.baseUrl + 'account/changePassword', changePassword, {
        observe: 'response',
      })
      .pipe(map((response) => response));
  }

  updateProfile(updateUserProfile: UpdateUserProfile) {
    return this.http
      .put(this.baseUrl + 'account/user/profile', updateUserProfile, {
        observe: 'response',
      })
      .pipe(map((response) => response));
  }

  resendInvitationLink(customerId: number, userId: string) {
    return this.http
      .post(
        this.baseUrl + `account/${customerId}/resendInvitationLink/${userId}`,
        { observe: 'response' }
      )
      .pipe(map((response) => response));
  }

  userResendInvitationLink(userId: string) {
    return this.http
      .post(this.baseUrl + 'account/' + userId + '/resendInvitationLink', {
        observe: 'response',
      })
      .pipe(map((response) => response));
  }

  getSmartriseRoles() {
    return this.http
      .get<IRole[]>(this.baseUrl + 'account/roles/smartrise', {
        observe: 'response',
      })
      .pipe(
        map((response) =>
          response.body.map<IRole>((x) => ({
            ...x,
            selected: false,
          }))
        )
      );
  }

  getCustomerRoles() {
    return this.http
      .get<IRole[]>(this.baseUrl + 'account/roles/customer', {
        observe: 'response',
      })
      .pipe(
        map((response) =>
          response.body.map<IRole>((x) => ({
            ...x,
            selected: false,
          }))
        )
      );
  }

  createSmartriseUser(smartriseUser: ISmartriseUser) {
    return this.http
      .post(this.baseUrl + 'account/create/smartriseUser', smartriseUser, {
        observe: 'response',
      })
      .pipe(map((response) => response.body));
  }

  createCustomerUserByCustomerAdmin(customerUser: ICustomerUser) {
    return this.http
      .post(this.baseUrl + 'account/create/customerUser', customerUser, {
        observe: 'response',
      })
      .pipe(map((response) => response.body));
  }

  createAccountUserBySmartriseUser(
    customerUser: IAccountUserBySmartriseResponse
  ) {
    return this.http
      .post(
        this.baseUrl + 'account/create/accountUserBySmartrise',
        customerUser,
        {
          observe: 'response',
        }
      )
      .pipe(map((response) => response.body));
  }

  getSmartriseUsers(smartriseUsersParams: SmartriseUsersParams) {
    return this.http
      .post<Pagination<ISmartriseUserLookup>>(
        this.baseUrl + 'account/profiles/smartrise',
        smartriseUsersParams,
        { observe: 'response' }
      )
      .pipe(map((response) => response.body));
  }

  getAccountUsers(accountUsersParams: AccountUsersParams) {
    return this.http
      .post<Pagination<IAccountUserLookup>>(
        this.baseUrl + 'account/profiles/accountusers',
        accountUsersParams,
        { observe: 'response' }
      )
      .pipe(map((response) => response.body));
  }

  getCustomerAdminUsers(customerId: number) {
    return this.http
      .post<Pagination<ICustomerUserLookup>>(
        this.baseUrl + `account/profiles/customers/${customerId}`,
        null,
        { observe: 'response' }
      )
      .pipe(map((response) => response.body));
  }

  getCustomerUsersByCustomerAdmin(customerUsersParams: CustomerUsersParams) {
    return this.http
      .post<Pagination<ICustomerUserLookup>>(
        this.baseUrl + 'account/profiles/customers/',
        customerUsersParams,
        { observe: 'response' }
      )
      .pipe(map((response) => response.body));
  }

  getCustomerUserBySmartrise(userId: string, accountId: number) {
    return this.http
      .get<ICustomerUserBySmartriseResponse>(
        `${this.baseUrl}account/${userId}/profile/customeruserBySmartrise/${accountId}`,
        {
          observe: 'response',
        }
      )
      .pipe(map((response) => response.body));
  }

  getCustomerUsersForSmartriseUser(
    customerUsersParams: CustomerUsersParams,
    customerId: number
  ) {
    return this.http
      .post<Pagination<ICustomerUserLookup>>(
        `${this.baseUrl}account/profiles/${customerId}/users`,
        customerUsersParams,
        { observe: 'response' }
      )
      .pipe(map((response) => response.body));
  }

  getSmartriseUser(userId: string) {
    return this.http
      .get<IGetSmartriseUser>(this.baseUrl + 'account/' + userId + '/profile', {
        observe: 'response',
      })
      .pipe(map((response) => response.body));
  }

  getCustomerUserByCustomerAdmin(userId: string) {
    return this.http
      .get<ICustomerUserResponse>(
        this.baseUrl + 'account/' + userId + '/profile/customeruser',
        {
          observe: 'response',
        }
      )
      .pipe(map((response) => response.body));
  }

  getAccountUser(userId: string) {
    return this.http
      .get<IAccountUserResponse>(
        this.baseUrl + 'account/' + userId + '/profile/accountuser',
        {
          observe: 'response',
        }
      )
      .pipe(map((response) => response.body));
  }

  updateSmartriseUser(smartriseUser: { id: string; roles: string[] }) {
    return this.http
      .put(this.baseUrl + 'account/profile', smartriseUser, {
        observe: 'response',
      })
      .pipe(map((response) => response));
  }

  updateAccountUserBySmartrise(accountUser: IAccountUserPayload) {
    return this.http
      .put(this.baseUrl + 'account/accountUserBySmartrise', accountUser, {
        observe: 'body',
      })
      .pipe(map((response) => response));
  }

  resetUserPasswordRequest(id: string) {
    return this.http
      .post(this.baseUrl + 'account/' + id + '/resetPasswordRequest', {
        observe: 'response',
      })
      .pipe(map((response) => response));
  }

  deactivateUser(id: string) {
    return this.http
      .put(this.baseUrl + 'account/deactivate/' + id, { observe: 'response' })
      .pipe(map((response) => response));
  }

  activateUser(id: string) {
    return this.http
      .put(this.baseUrl + 'account/activate/' + id, { observe: 'response' })
      .pipe(map((response) => response));
  }

  impersonateLogin(adminAccountId: string) {
    return this.http
      .get<IUser>(`${this.baseUrl}account/impersonate/${adminAccountId}`, {
        observe: 'response',
      })
      .pipe(map((response) => response));
  }

  impersonateLogout() {
    return this.http
      .get<IUser>(this.baseUrl + 'account/impersonate/stop', {
        observe: 'response',
      })
      .pipe(map((response) => response));
  }

  getCustomerUsersAsLookup(id: number) {
    return this.http
      .get<IUserLookup[]>(
        this.baseUrl + 'account/customerusers?customerId=' + id.toString(),
        { observe: 'response' }
      )
      .pipe(map((response) => response.body));
  }

  getAllSmartriseUsers() {
    return this.http
      .get<IUserLookup[]>(this.baseUrl + 'account/smartriseusers', {
        observe: 'response',
      })
      .pipe(map((response) => response.body));
  }

  validateTokes(tokenValidation: any) {
    return this.http
      .post(this.baseUrl + 'account/tokenValidity', tokenValidation, {
        observe: 'response',
      })
      .pipe(map((response) => response));
  }

  resetAnonymousPasswordRequest(input: IResetAnonymousPasswordDto) {
    return this.http.post(
      `${this.baseUrl}account/resetAnonymousPasswordRequest`,
      input,
      { observe: 'response' }
    );
  }

  askForAccess(paylaod: IAskForAccessDto) {
    return this.http.post(
      `${this.baseUrl}account/askForAccess`, paylaod,
      { observe: 'response' }
    );
  }

  refreshToken() {
    return this.http
      .get<IRefreshToken>(this.baseUrl + 'account/refreshToken', {
        observe: 'response',
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          'Cache-Control': 'no-store',
        },
      })
      .pipe(map((response) => response.body));
  }

  changeUser() {
    // this.tokenService.saveToken(user.token);
    this.currentUserSource.next(this.loadedUser);
  }

  triggerStopImpersonate() {
    this.stopImpersonate.next(this.loadedUser);
  }

  lockAccount(params: any) {
    return this.http
      .get<any>(
        this.baseUrl +
          'account/lockUserAccount?email=' +
          params.email +
          '&token=' +
          params.token,
        {
          observe: 'response',
        }
      )
      .pipe(map((response) => response.body));
  }

  updateCustomerUserByCustomerAdmin(customerUser: ICustomerUserPayload) {
    return this.http
      .put(this.baseUrl + 'account/customerUser', customerUser, {
        observe: 'body',
      })
      .pipe(map((response) => response));
  }
}
