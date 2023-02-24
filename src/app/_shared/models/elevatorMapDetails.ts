export interface IElevatorMapAreaDetails {
    title: string;
    parts: IElevatorMapAreaPartDetails[];
}

export interface IElevatorMapAreaPartDetails {
    name: string;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
}
