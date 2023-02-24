import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { IConsolidatedResource } from '../_shared/models/job';

@Injectable({
  providedIn: 'root',
})
export class TimerService implements OnDestroy {
  baseUrl = environment.apiUrl;
  updateStatus$;
  arr: any[] = [];

  private updateSatus = new Subject<IConsolidatedResource>();
  private stopPolling = new Subject<void>();

  constructor(private httpClient: HttpClient) {
    this.updateStatus$ = this.updateSatus.asObservable();
    setInterval(this._callStatus, 10000);
    // setInterval((arr: number[]) => {
    //   if (arr) {
    //     arr.forEach((o) => this._callStatusItem(o));
    //   }
    // } ,10000);

    // const res$ = timer(1, 10000).pipe(
    //   switchMap(() =>
    //     this._callStatus
    //       )
    //       .pipe(
    //         map((newResource) => {}),
    //         retry(),
    //         tap(console.log),
    //         share(),
    //         takeUntil(this.stopPolling)
    //       )
    //   )
    // );
  }

  ngOnDestroy() {
    this.stopPolling.next();
  }

  onCreateRequest(resouce: any) {
    this.arr.push({ id: resouce.resourceFileId });
    localStorage.setItem('abc', JSON.stringify(this.arr));
  }

  private _callStatus() {
    const value = localStorage.getItem('abc');

    if (value) {
      const abcd = JSON.parse(value);

      abcd.forEach(element => {
        const id = element.id;


        this.httpClient
          .get<IConsolidatedResource>(
            `${this.baseUrl}resourceFile/consolidatedResource/${id}`
          )
          .subscribe(
            (response) => {
              this.updateSatus.next(response);
            },
            () => { }
          );

      });
    }

    // if (this.arr) {
    //   this.arr.forEach((o) => );
    // }
  }

  // private _callStatusItem(resourceFileId: number) {

  // }

  // refreshResource(): Observable<IConsolidatedResource> {
  //   return this.res$.pipe(tap(() => console.log('data sent to subscriber')));
  // }
}
