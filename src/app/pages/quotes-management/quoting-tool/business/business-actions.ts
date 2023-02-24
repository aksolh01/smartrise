import { CarTractionFieldView } from '../../../../_shared/models/quotes/quote-view.model';

export interface IBusinessUIActions {
  updateVisibiltyStatus(instance: any, hide: boolean): void;
  revalidateField(instance: any, field: string);
  revalidate(instance: any);
  revalidateAll();
  errorMessage(message: string): void;
  updateCar(updateCarInfo: { ref: any; displayName: any });
}
