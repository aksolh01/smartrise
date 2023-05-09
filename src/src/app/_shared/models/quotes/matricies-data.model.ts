/* eslint-disable */

function between(value: number, min: number, max: number) {
    if (value >= min && value <= max) {
return true;
}
    return false;
}

export class HorsePowerRatingForOverheadTraction {
    //The values below are mapped from "Assuming Overhead HP and Quoting a New Motor.pdf" file
    //from the first table
    private _dataSource: any = {
        1000: {
            50: 3,
            75: 3,
            100: 5,
            125: 5,
            150: 5,
            200: 7.5,
            250: 10,
            300: 10,
            350: 12.5,
        },
        1500: {
            50: 3,
            75: 5,
            100: 7.5,
            125: 7.5,
            150: 7.5,
            200: 10,
            250: 12.5,
            300: 12.5,
            350: 15,
        },
        2000: {
            50: 5,
            75: 7.5,
            100: 7.5,
            125: 10,
            150: 10,
            200: 12.5,
            250: 15,
            300: 20,
            350: 20,
            400: 25,
            450: 30,
            500: 30,
        },
        2500: {
            50: 5,
            75: 7.5,
            100: 10,
            125: 12.5,
            150: 12.5,
            200: 15,
            250: 20,
            300: 25,
            350: 25,
            400: 30,
            450: 40,
            500: 40,
        },
        3000: {
            50: 7.5,
            75: 10,
            100: 12.5,
            125: 12.5,
            150: 15,
            200: 20,
            250: 25,
            300: 25,
            350: 30,
            400: 40,
            450: 40,
            500: 50,
        },
        3500: {
            50: 7.5,
            75: 10,
            100: 12.5,
            125: 15,
            150: 20,
            200: 25,
            250: 25,
            300: 30,
            350: 40,
            400: 40,
            450: 50,
            500: 50,
        },
        4000: {
            50: 10,
            75: 12.5,
            100: 15,
            125: 20,
            150: 20,
            200: 25,
            250: 30,
            300: 40,
            350: 40,
            400: 50,
            450: 60,
            500: 60,
        },
        4500: {
            50: 10,
            75: 12.5,
            100: 20,
            125: 20,
            150: 25,
            200: 30,
            250: 40,
            300: 40,
            350: 50,
            400: 50,
            450: 60,
            500: 75,
        },
        5000: {
            50: 12.5,
            75: 15,
            100: 20,
            125: 25,
            150: 25,
            200: 30,
            250: 40,
            300: 50,
            350: 50,
            400: 60,
            450: 75,
            500: 75,
        },
        6000: {
            50: 12.5,
            75: 20,
            100: 25,
            125: 30,
            150: 30,
            200: 40,
            250: 50,
            300: 50,
            350: 60,
            400: 75,
            450: null,
            500: null,
        },
        7000: {
            50: 15,
            75: 20,
            100: 25,
            125: 30,
            150: 40,
            200: 50,
            250: 60,
            300: 60,
            350: 75,
            400: null,
            450: null,
            500: null,
        },
        8000: {
            50: 20,
            75: 25,
            100: 30,
            125: 40,
            150: 40,
            200: 50,
            250: 60,
            300: 75,
            350: 75,
            400: null,
            450: null,
            500: null,
        },
        10000: {
            50: null,
            75: null,
            100: 40,
            125: 50,
            150: 50,
            200: 60,
            250: 75,
            300: null,
            350: null,
            400: null,
            450: null,
            500: null,
        },
        12000: {
            50: null,
            75: null,
            100: 40,
            125: 50,
            150: 60,
            200: 75,
            250: null,
            300: null,
            350: null,
            400: null,
            450: null,
            500: null,
        },
        15000: {
            50: null,
            75: null,
            100: 50,
            125: 75,
            150: 75,
            200: null,
            250: null,
            300: null,
            350: null,
            400: null,
            450: null,
            500: null,
        },
        20000: {
            50: null,
            75: null,
            100: 75,
            125: null,
            150: null,
            200: null,
            250: null,
            300: null,
            350: null,
            400: null,
            450: null,
            500: null,
        },
    };

    getHP(capacity: any, speed: any) {
        let minCapacity = 0;
        let minSpeed = 0;
        for (const capacityKey in this._dataSource) {

            const maxCapacity = Number(capacityKey);
            if (between(capacity, minCapacity + 1, maxCapacity)) {

                const speedArray = this._dataSource[maxCapacity];
                for (const speedKey in speedArray) {

                    const maxSpeed = Number(speedKey);
                    if (between(speed, minSpeed + 1, maxSpeed)) {
                        return speedArray[maxSpeed];
                    }
                    minSpeed = maxSpeed;
                }
            }
            minCapacity = maxCapacity;
        }
        return null;
    }
}

export class OverheadChartHPTraction {
    private _dataSource: any = {
        1000: {
            50: 3,
            75: 3,
            100: 5,
            125: 5,
            150: 5,
            200: 7.5,
            250: 10,
            300: 10,
            350: 12.5,
            400: null,
            450: null,
            500: null,
        },
        1500: {
            50: 3,
            75: 5,
            100: 7.5,
            125: 7.5,
            150: 7.5,
            200: 10,
            250: 12.5,
            300: 12.5,
            350: 15,
            400: null,
            450: null,
            500: null,
        },
        2000: {
            50: 5,
            75: 7.5,
            100: 7.5,
            125: 10,
            150: 10,
            200: 12.5,
            250: 15,
            300: 20,
            350: 20,
            400: 25,
            450: 30,
            500: 30,
        },
        2500: {
            50: 5,
            75: 7.5,
            100: 10,
            125: 12.5,
            150: 12.5,
            200: 15,
            250: 20,
            300: 25,
            350: 25,
            400: 25,
            450: 30,
            500: 30,
        },
        3000: {
            50: 7.5,
            75: 10,
            100: 12.5,
            125: 12.5,
            150: 15,
            200: 20,
            250: 25,
            300: 25,
            350: 30,
            400: 30,
            450: 40,
            500: 40,
        },
        3500: {
            50: 7.5,
            75: 10,
            100: 12.5,
            125: 45,
            150: 20,
            200: 25,
            250: 25,
            300: 30,
            350: 40,
            400: 40,
            450: 40,
            500: 50,
        },
        4000: {
            50: 10,
            75: 12.5,
            100: 15,
            125: 20,
            150: 20,
            200: 25,
            250: 30,
            300: 40,
            350: 40,
            400: 40,
            450: 50,
            500: 50,
        },
        4500: {
            50: 10,
            75: 12.5,
            100: 20,
            125: 20,
            150: 25,
            200: 30,
            250: 40,
            300: 40,
            350: 50,
            400: 50,
            450: 60,
            500: 60,
        },
        5000: {
            50: 12.5,
            75: 15,
            100: 20,
            125: 25,
            150: 25,
            200: 30,
            250: 40,
            300: 50,
            350: 50,
            400: 60,
            450: 75,
            500: 75,
        },
        6000: {
            50: 12.5,
            75: 20,
            100: 25,
            125: 30,
            150: 30,
            200: 40,
            250: 50,
            300: 50,
            350: 60,
            400: 75,
            450: null,
            500: null,
        },
        7000: {
            50: 15,
            75: 20,
            100: 25,
            125: 30,
            150: 40,
            200: 50,
            250: 60,
            300: 60,
            350: 75,
            400: null,
            450: null,
            500: null,
        },
        8000: {
            50: 20,
            75: 25,
            100: 30,
            125: 40,
            150: 40,
            200: 50,
            250: 60,
            300: 75,
            350: 75,
            400: null,
            450: null,
            500: null,
        },
        10000: {
            50: null,
            75: null,
            100: 40,
            125: 50,
            150: 50,
            200: 60,
            250: 75,
            300: null,
            350: null,
            400: null,
            450: null,
            500: null,
        },
        12000: {
            50: null,
            75: null,
            100: 40,
            125: 50,
            150: 60,
            200: 75,
            250: null,
            300: null,
            350: null,
            400: null,
            450: null,
            500: null,
        },
        15000: {
            50: null,
            75: null,
            100: 50,
            125: 75,
            150: 75,
            200: null,
            250: null,
            300: null,
            350: null,
            400: null,
            450: null,
            500: null,
        },
        20000: {
            50: null,
            75: null,
            100: 75,
            125: null,
            150: null,
            200: null,
            250: null,
            300: null,
            350: null,
            400: null,
            450: null,
            500: null,
        },
    };

    //The values below are mapped from "Assuming Overhead HP and Quoting a New Motor.pdf" file
    getHP(capacity: any, speed: any) {
        let minCapacity = 0;
        let minSpeed = 0;
        for (const capacityKey in this._dataSource) {

            const maxCapacity = Number(capacityKey);
            if (between(capacity, minCapacity + 1, maxCapacity)) {

                const speedArray = this._dataSource[maxCapacity];
                for (const speedKey in speedArray) {

                    const maxSpeed = Number(speedKey);
                    if (between(speed, minSpeed + 1, maxSpeed)) {
                        return speedArray[maxSpeed];
                    }
                    minSpeed = maxSpeed;
                }
            }
            minCapacity = maxCapacity;
        }
        return null;
    }
}

export class HWBasementMachineChart {
    private _dataSource: any = {
        1000: {
            50: 3,
            75: 3,
            100: 5,
            125: 5,
            150: 7.5,
            200: 7.5,
            250: 10,
            300: 10,
            350: 12.5,
            400: 15,
            450: 15,
            500: null,
        },
        1500: {
            50: 3,
            75: 5,
            100: 7.5,
            125: 7.5,
            150: 10,
            200: 12.5,
            250: 12.5,
            300: 15,
            350: 20,
            400: 20,
            450: 20,
            500: 30,
        },
        2000: {
            50: 5,
            75: 7.5,
            100: 7.5,
            125: 10,
            150: 12.5,
            200: 15,
            250: 20,
            300: 20,
            350: 25,
            400: 25,
            450: 30,
            500: 40,
        },
        2500: {
            50: 5,
            75: 7.5,
            100: 10,
            125: 12.5,
            150: 15,
            200: 20,
            250: 25,
            300: 25,
            350: 30,
            400: 40,
            450: 40,
            500: 40,
        },
        3000: {
            50: 7.5,
            75: 10,
            100: 12.5,
            125: 15,
            150: 15,
            200: 25,
            250: 30,
            300: 30,
            350: 40,
            400: 40,
            450: 50,
            500: 50,
        },
        3500: {
            50: 7.5,
            75: 10,
            100: 15,
            125: 20,
            150: 20,
            200: 25,
            250: 30,
            300: 40,
            350: 40,
            400: 50,
            450: 50,
            500: 60,
        },
        4000: {
            50: 10,
            75: 12.5,
            100: 20,
            125: 20,
            150: 25,
            200: 30,
            250: 40,
            300: 40,
            350: 50,
            400: 50,
            450: 60,
            500: 75,
        },
        4500: {
            50: 10,
            75: 15,
            100: 20,
            125: 25,
            150: 25,
            200: 40,
            250: 40,
            300: 50,
            350: 50,
            400: 60,
            450: 75,
            500: 75,
        },
        5000: {
            50: 12.5,
            75: 20,
            100: 20,
            125: 25,
            150: 30,
            200: 40,
            250: 50,
            300: 50,
            350: 60,
            400: 60,
            450: 75,
            500: null,
        },
        6000: {
            50: 12.5,
            75: 20,
            100: 25,
            125: 30,
            150: 40,
            200: 50,
            250: 50,
            300: 60,
            350: 75,
            400: 75,
            450: null,
            500: null,
        },
        7000: {
            50: 15,
            75: 25,
            100: 30,
            125: 40,
            150: 40,
            200: 50,
            250: 60,
            300: 75,
            350: 75,
            400: null,
            450: null,
            500: null,
        },
        8000: {
            50: 20,
            75: 25,
            100: 30,
            125: 40,
            150: 50,
            200: 60,
            250: 75,
            300: 75,
            350: null,
            400: null,
            450: null,
            500: null,
        },
        10000: {
            50: null,
            75: null,
            100: 40,
            125: 50,
            150: 60,
            200: 75,
            250: null,
            300: null,
            350: null,
            400: null,
            450: null,
            500: null,
        },
        12000: {
            50: null,
            75: null,
            100: 50,
            125: 60,
            150: 75,
            200: null,
            250: null,
            300: null,
            350: null,
            400: null,
            450: null,
            500: null,
        },
        15000: {
            50: null,
            75: null,
            100: 60,
            125: 75,
            150: null,
            200: null,
            250: null,
            300: null,
            350: null,
            400: null,
            450: null,
            500: null,
        },
        20000: {
            50: null,
            75: null,
            100: 75,
            125: null,
            150: null,
            200: null,
            250: null,
            300: null,
            350: null,
            400: null,
            450: null,
            500: null,
        },
    };

    //The values below are mapped from "HW Basement Machine chart.pdf" file
    getHP(capacity: any, speed: any) {
        let minCapacity = 0;
        let minSpeed = 0;
        for (const capacityKey in this._dataSource) {

            const maxCapacity = Number(capacityKey);
            if (between(capacity, minCapacity + 1, maxCapacity)) {

                const speedArray = this._dataSource[maxCapacity];
                for (const speedKey in speedArray) {

                    const maxSpeed = Number(speedKey);
                    if (between(speed, minSpeed + 1, maxSpeed)) {
                        return speedArray[maxSpeed];
                    }
                    minSpeed = maxSpeed;
                }
            }
            minCapacity = maxCapacity;
        }
        return null;
    }
}

export class TDI200MiniGearless1stSection {
    //The values below are mapped from "TDI-200-TSM_TMGL-Manual-Rev-14-February-2019 - Mini Gearless.pdf" file
    //from the first table
    getHP(capacity: any, speed: any) {
        if (speed <= 200 && capacity <= 5000) {
            return 17.6;
        }

        if (speed <= 350 && capacity <= 3500) {
            return 21.8;
        }

        if (speed <= 350 && capacity <= 5000) {
            return 31.2;
        }

        if (speed <= 400 && capacity <= 2500) {
            return 17.6;
        }

        if (speed <= 500 && capacity <= 3500) {
            return 31.2;
        }

        if (speed <= 500 && capacity <= 5000) {
            return 44.6;
        }

        if (speed <= 700 && capacity <= 2500) {
            return 31.2;
        }

        return null;
    }

    //The values below are mapped from "TDI-200-TSM_TMGL-Manual-Rev-14-February-2019 - Mini Gearless.pdf" file
    //from the first table
    getFLA(capacity: number, speed: number): number {
        if (speed <= 200 && capacity <= 5000) {
            return 27.6;
        }

        if (speed <= 350 && capacity <= 3500) {
            return 32.9;
        }

        if (speed <= 350 && capacity <= 5000) {
            return 46.9;
        }

        if (speed <= 400 && capacity <= 2500) {
            return 27.6;
        }

        if (speed <= 500 && capacity <= 3500) {
            return 46.5;
        }

        if (speed <= 500 && capacity <= 5000) {
            return 67;
        }

        if (speed <= 700 && capacity <= 2500) {
            return 46.9;
        }

        return null;
    }

    //The values below are mapped from "TDI-200-TSM_TMGL-Manual-Rev-14-February-2019 - Mini Gearless.pdf" file
    //from the first table
    getMotorVolts(capacity: number, speed: number): number {
        if (speed <= 200 && capacity <= 5000) {
            return 350;
        }

        if (speed <= 350 && capacity <= 3500) {
            return 350;
        }

        if (speed <= 350 && capacity <= 5000) {
            return 350;
        }

        if (speed <= 400 && capacity <= 2500) {
            return 350;
        }

        if (speed <= 500 && capacity <= 3500) {
            return 350;
        }

        if (speed <= 500 && capacity <= 5000) {
            return 350;
        }

        if (speed <= 700 && capacity <= 2500) {
            return 350;
        }

        return null;
    }
}

export class TDI200MiniGearlessOtherSections {

    getMotorHP(capacity: any, speed: any, mainLineVoltage: number) {
        let result: number | null = null;

        if (this.isLowVoltage(mainLineVoltage)) {
            result = this.getMotorHPForLowVoltage(capacity, speed);
        } else if (this.isHighVoltage(mainLineVoltage)) {
            result = this.getMotorHPForHighVoltage(capacity, speed);
        }

        if (result !== null) {
            return result;
        }

        return this.getMotorHPRegardlessVoltage(capacity, speed);
    }

    getFLA(capacity: any, speed: any, mainLineVoltage: number) {
        let result: number | null = null;

        if (this.isLowVoltage(mainLineVoltage)) {
            result = this.getFLAForLowVoltage(capacity, speed);
        } else if (this.isHighVoltage(mainLineVoltage)) {
            result = this.getFLAForHighVoltage(capacity, speed);
        }

        if (result !== null) {
            return result;
        }

        return this.getFLARegardlessVoltage(capacity, speed);
    }

    getMotorVolts(capacity: any, speed: any, mainLineVoltage: number) {
        let result: number | null = null;

        if (this.isLowVoltage(mainLineVoltage)) {
            result = this.getMotorVoltageForLowVoltage(capacity, speed);
        } else if (this.isHighVoltage(mainLineVoltage)) {
            result = this.getMotorVoltageForHighVoltage(capacity, speed);
        }

        if (result !== null) {
            return result;
        }

        return this.getMotorVoltsRegardlessVoltage(capacity, speed);
    }

    private isLowVoltage(mainLineVoltage: number) {
        return [208, 220, 230, 240].some(value => value === mainLineVoltage);
    }

    private isHighVoltage(mainLineVoltage: number) {
        return [416, 440, 460, 480, 575, 600].some(value => value === mainLineVoltage);
    }

    private getMotorHPForLowVoltage(capacity: number, speed: number): number | null {
        const speedValues = [150, 200, 350, 500, 700];
        const capacityValues = [2500, 3000, 3500];
        const motorHpValues = [
            [6.7, 12.6, 12.6],
            [10.6, 12.6, 12.6],
            [18.7, 19.4, 22.3],
            [33, 33, 33],
            [45.6, 45.6, 45.6],
        ];

        const speedIndex = speedValues.findIndex(element => element >= speed);

        const capacityIndex = capacityValues.findIndex(element => element >= capacity);

        if (speedIndex === -1 || capacityIndex === -1) {
            return null;
        }

        return motorHpValues[speedIndex][capacityIndex];
    }

    private getMotorHPForHighVoltage(capacity: number, speed: number): number | null {
        const speedValues = [150, 200, 350, 500, 700];
        const capacityValues = [2500, 3000, 3500, 4000, 4500, 5000];
        const motorHpValues = [
            [6.7, 12.6, 12.6, 31.9, 31.9, 49.1],
            [10.6, 12.6, 12.6, 31.9, 31.9, 49.1],
            [18.7, 19.4, 22.3, 31.9, 31.9, 49.1],
            [27.7, 27.7, 33, 49.1, 49.1, 49.1],
            [45.6, 45.6, 45.6, null, null, null],
        ];

        const speedIndex = speedValues.findIndex(element => element >= speed);

        const capacityIndex = capacityValues.findIndex(element => element >= capacity);

        if (speedIndex === -1 || capacityIndex === -1) {
            return null;
        }

        return motorHpValues[speedIndex][capacityIndex];
    }

    private getMotorHPRegardlessVoltage(capacity: number, speed: number): number | null {
        const speedValues = [350, 400, 500, 600, 700, 800, 1000, 1200, 1400, 1600];
        const capacityValues = [2500, 3000, 3500, 4000, 4500, 5000, 8000];
        const motorHpValues = [
            [26, 26, 26, 26, 78.7, 78.7, 78.7],
            [17.6, 37, 37, 37, 78.7, 78.7, 78.7],
            [37, 37, 37, 37, 78.7, 78.7, 78.7],
            [94, 94, 94, 94, 94, 94, 94],
            [31.2, 52.1, 52.1, 52.1, 68.8, 68.8, 109.8],
            [54.9, 54.9, 54.9, 78.4, 78.4, 78.4, null],
            [49, 78.7, 78.7, 78.7, null, null, null],
            [94, 94, 94, 94, null, null, null],
            [68.8, 109.8, 109.8, 109.8, null, null, null],
            [78.4, null, null, null, null, null, null],
        ];

        const speedIndex = speedValues.findIndex(element => element >= speed);

        const capacityIndex = capacityValues.findIndex(element => element >= capacity);

        if (speedIndex === -1 || capacityIndex === -1) {
            return null;
        }

        return motorHpValues[speedIndex][capacityIndex];
    }

    private getFLAForLowVoltage(capacity: number, speed: number): number | null {
        const speedValues = [150, 200, 350, 500, 700];
        const capacityValues = [2500, 3000, 3500];
        const flaValues = [
            [26.5, 42.8, 42.8],
            [35.8, 42.8, 42.8],
            [61.5, 61.5, 70.4],
            [121, 121, 121],
            [173, 173, 173],
        ];

        const speedIndex = speedValues.findIndex(element => element >= speed);

        const capacityIndex = capacityValues.findIndex(element => element >= capacity);

        if (speedIndex === -1 || capacityIndex === -1) {
            return null;
        }

        return flaValues[speedIndex][capacityIndex];
    }

    private getFLAForHighVoltage(capacity: number, speed: number): number | null {
        const speedValues = [150, 200, 350, 500, 700];
        const capacityValues = [2500, 3000, 3500, 4000, 4500, 5000];
        const flaValues = [
            [13.5, 20.3, 20.3, 49, 49, 68.5],
            [17.7, 20.3, 20.3, 49, 49, 68.5],
            [30.4, 29.8, 35.2, 49, 49, 68.5],
            [42, 42, 56, 68.5, 68.5, 68.5],
            [76, 76, 76, null, null, null],
        ];

        const speedIndex = speedValues.findIndex(element => element >= speed);

        const capacityIndex = capacityValues.findIndex(element => element >= capacity);

        if (speedIndex === -1 || capacityIndex === -1) {
            return null;
        }

        return flaValues[speedIndex][capacityIndex];
    }

    private getFLARegardlessVoltage(capacity: number, speed: number): number | null {
        const speedValues = [350, 400, 500, 600, 700, 800, 1000, 1200, 1400, 1600];
        const capacityValues = [2500, 3000, 3500, 4000, 4500, 5000, 8000];
        const flaValues = [
            [48, 48, 48, 48, 127, 127, 127],
            [27.6, 64, 64, 64, 127, 127, 127],
            [64, 64, 64, 64, 127, 127, 127],
            [148, 148, 148, 148, 148, 148, 148],
            [46.9, 85, 85, 85, 98.5, 98.5, 178],
            [79, 79, 79, 113, 113, 113, null],
            [74, 127, 127, 127, null, null, null],
            [94, 94, 94, 94, null, null, null, null],
            [68.8, 109.8, 109.8, 109.8, null, null, null],
            [78.4, null, null, null, null, null, null],
        ];

        const speedIndex = speedValues.findIndex(element => element >= speed);

        const capacityIndex = capacityValues.findIndex(element => element >= capacity);

        if (speedIndex === -1 || capacityIndex === -1) {
            return null;
        }

        return flaValues[speedIndex][capacityIndex];
    }

    private getMotorVoltageForLowVoltage(capacity: number, speed: number): number | null {
        const speedValues = [150, 200, 350, 500, 700];
        const capacityValues = [2500, 3000, 3500];
        const motorVoltsValues = [
            [145, 160, 160],
            [160, 160, 160],
            [160, 160, 160],
            [145, 145, 145],
            [140, 140, 140],
        ];

        const speedIndex = speedValues.findIndex(element => element >= speed);

        const capacityIndex = capacityValues.findIndex(element => element >= capacity);

        if (speedIndex === -1 || capacityIndex === -1) {
            return null;
        }

        return motorVoltsValues[speedIndex][capacityIndex];
    }

    private getMotorVoltageForHighVoltage(capacity: number, speed: number): number | null {
        const speedValues = [150, 200, 350, 500, 700];
        const capacityValues = [2500, 3000, 3500, 4000, 4500, 5000];
        const motorVoltsValues = [
            [290, 328, 328, 350, 350, 350],
            [328, 328, 328, 350, 350, 350],
            [328, 350, 328, 350, 350, 350],
            [350, 350, 320, 350, 350, 350],
            [320, 320, 320, null, null, null],
        ];

        const speedIndex = speedValues.findIndex(element => element >= speed);

        const capacityIndex = capacityValues.findIndex(element => element >= capacity);

        if (speedIndex === -1 || capacityIndex === -1) {
            return null;
        }

        return motorVoltsValues[speedIndex][capacityIndex];
    }

    private getMotorVoltsRegardlessVoltage(capacity: number, speed: number): number | null {
        const speedValues = [350, 400, 500, 600, 700, 800, 1000, 1200, 1400, 1600];
        const capacityValues = [2500, 3000, 3500, 4000, 4500, 5000, 8000];
        const motorVoltsValues = [
            [300, 300, 300, 300, 350, 350, 350],
            [350, 320, 320, 320, 350, 350, 350],
            [320, 320, 320, 320, 350, 350, 350],
            [350, 350, 350, 350, 350, 350, 350],
            [350, 320, 320, 320, 340, 340, 350],
            [340, 340, 340, 340, 340, 340, null],
            [340, 350, 350, 350, null, null, null],
            [350, 350, 350, 350, null, null, null, null],
            [340, 350, 350, 350, null, null, null],
            [340, null, null, null, null, null, null],
        ];

        const speedIndex = speedValues.findIndex(element => element >= speed);

        const capacityIndex = capacityValues.findIndex(element => element >= capacity);

        if (speedIndex === -1 || capacityIndex === -1) {
            return null;
        }

        return motorVoltsValues[speedIndex][capacityIndex];
    }
}

export class HWVVVFHoistMotorDataHPVoltsAndAmps575V {
    //The values below are mapped from "HW - VVVF Hoist Motor Data - HP, Volts & Amps - 575V.pdf" file
    //from the first section of the table
    getFLA(motorHP: any, motorVolts: any) {

        if (motorVolts > 600) {
return null;
}

        if (motorHP <= 5) {
            return 5.6;
        }
        if (motorHP <= 7.5) {
            return 8.4;
        }
        if (motorHP <= 10) {
            return 10.5;
        }
        if (motorHP <= 12.5) {
            return 11.9;
        }
        if (motorHP <= 15) {
            return 15.2;
        }
        if (motorHP <= 20) {
            return 20.1;
        }
        if (motorHP <= 25) {
            return 24.8;
        }
        if (motorHP <= 30) {
            return 28.1;
        }
        if (motorHP <= 40) {
            return 38.6;
        }
        if (motorHP <= 50) {
            return 46.5;
        }
        if (motorHP <= 60) {
            return 53.0;
        }
        if (motorHP <= 75) {
            return 66.7;
        }
        return null;
    }
}

export class HWVVVFHoistMotorDataHPVoltsAndAmps {
    getFLA(motorHP: any, motorVolts: any, motorRPM: number) {

        if (this._motorRPMIsBetween0And1050(motorRPM)) {
            return this._getFLAForRPMBetween0And1050(motorHP, motorVolts);
        }

        if (this._motorRPMIsBetween1051And1500(motorRPM)) {
            return this._getFLAForRPMBetween1051And1500(motorHP, motorVolts);
        }

        if (this._motorRPMIsGreaterThen1500(motorRPM)) {
            return this._getFLAForRPMGreaterThen1500(motorHP, motorVolts);
        }

        return null;
    }
    private _motorRPMIsGreaterThen1500(motorRPM: number) {
        return motorRPM > 1500;
    }
    private _motorRPMIsBetween1051And1500(motorRPM: number) {
        return motorRPM >= 1051 && motorRPM <= 1500;
    }
    private _motorRPMIsBetween0And1050(motorRPM: number) {
        return motorRPM >= 0 && motorRPM <= 1050;
    }

    private _getFLAForRPMBetween0And1050(motorHP: any, motorVolts: any) {
        //The values below are mapped from "HW - VVVF Hoist Motor Data - HP, Volts & Amps.pdf" file
        //from the first table specified for 900 RPM

        const motorHpValues = [5, 7.5, 10, 12.5, 15, 20, 25, 30, 40, 50, 60, 75];
        const motorVoltsValues = [208, 230, 480, 600];
        const motorFlaValues = [
            [21, 20, 10, 6.4],
            [30, 28, 14, 11.4],
            [33.4, 30.8, 15.4, 11.8],
            [45.4, 41, 20.5, 15.6],
            [54, 50, 25, 17.7],
            [68, 62.2, 31.1, 23],
            [84.8, 76.6, 38.3, 28.4],
            [93, 84, 42, 32.5],
            [124, 112, 56, 43],
            [148, 134, 67, 50],
            [166, 144, 71, null],
            [212, 188, 94, null]
        ];

        const motorHpIndex = motorHpValues.findIndex(element => element >= motorHP);

        const motorVoltsIndex = motorVoltsValues.findIndex(element => element >= motorVolts);

        if (motorHpIndex === -1 || motorVoltsIndex === -1) {
            return null;
        }

        return motorFlaValues[motorHpIndex][motorVoltsIndex];
    }

    private _getFLAForRPMBetween1051And1500(motorHP: any, motorVolts: any) {
        //The values below are mapped from "HW - VVVF Hoist Motor Data - HP, Volts & Amps.pdf" file
        //from the first table specified for 1200 RPM

        const motorHpValues = [5, 7.5, 10, 12.5, 15, 20, 25, 30, 40, 50, 60, 75];
        const motorVoltsValues = [208, 230, 480, 600];
        const motorFlaValues = [
            [15.9, 15.2, 7.6, 5.6],
            [24.2, 23.8, 11.9, 8.4],
            [30.6, 31, 15.5, 10.5],
            [34.3, 33.2, 16.6, 11.9],
            [43.3, 43, 21.5, 15.2],
            [52, 54.6, 27.3, 20.1],
            [71.6, 66.2, 33.1, 24.8],
            [83.4, 81.8, 40.9, 28.1],
            [103, 98.2, 49.1, 38.6],
            [130, 126, 63, 46.5],
            [152, 144.6, 72.3, 53],
            [184, 172, 86, 66.7]
        ];

        const motorHpIndex = motorHpValues.findIndex(element => element >= motorHP);

        const motorVoltsIndex = motorVoltsValues.findIndex(element => element >= motorVolts);

        if (motorHpIndex === -1 || motorVoltsIndex === -1) {
            return null;
        }

        return motorFlaValues[motorHpIndex][motorVoltsIndex];
    }

    private _getFLAForRPMGreaterThen1500(motorHP: any, motorVolts: any) {
        //The values below are mapped from "HW - VVVF Hoist Motor Data - HP, Volts & Amps.pdf" file
        //from the first table specified for 1800 RPM

        const motorHpValues = [5, 7.5, 10, 12.5, 15, 20, 25, 30, 40, 50, 60, 75];
        const motorVoltsValues = [208, 230, 480, 600];
        const motorFlaValues = [
            [15.5, 15, 7.5, 5.2],
            [24.3, 22.8, 11.4, 8.4],
            [28, 25.4, 12.7, 9.8],
            [33.4, 30, 15, 11.4],
            [40, 39.6, 19.8, 13.8],
            [54.2, 48.8, 24.4, 18.5],
            [68.6, 62.6, 31.3, 22.3],
            [78.2, 70.6, 35.3, 26.4],
            [102, 91, 45.5, 35.2],
            [128.5, 116, 58, 44.2],
            [152, 138, 69, 52.3],
            [188, 170, 85, 67.9]
        ];

        const motorHpIndex = motorHpValues.findIndex(element => element >= motorHP);

        const motorVoltsIndex = motorVoltsValues.findIndex(element => element >= motorVolts);

        if (motorHpIndex === -1 || motorVoltsIndex === -1) {
            return null;
        }

        return motorFlaValues[motorHpIndex][motorVoltsIndex];
    }
}
