import { BaseParams } from "./baseParams";

export class PartSearchParams extends BaseParams {
  partNumber: string;
  modelNumber: string;
  price?: number;
  description: string;
  inactiveFlag?: boolean;
    
}