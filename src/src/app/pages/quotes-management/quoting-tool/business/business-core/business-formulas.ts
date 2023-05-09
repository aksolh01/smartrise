export function getAssumedSpeed(hp, capacity) {

    if (hp == null || capacity == null) {
return null;
}

    const exFpm = +(hp / capacity * 10000).toFixed(0);

    if (exFpm < 10) {
        return 10;
    }

    if (exFpm > 1400) {
        return 1400;
    }

    return exFpm;
}
export function getAssumedCapacity(hp, fpm) {

    if (hp == null || fpm == null) {
return null;
}

    const exCapacity = +(hp * 10000 / fpm).toFixed(0);

    if (exCapacity < 500) {
        return 500;
    }

    if (exCapacity > 20000) {
        return 20000;
    }

    return exCapacity;
}

export function getAssumedMotorHP(speed, capacity) {

    if (speed == null || capacity == null) {
return null;
}

    const exHP = +(speed * capacity / 10000).toFixed(0);

    if (exHP < 5) {
        return 5;
    }

    if (exHP > 100) {
        return 100;
    }

    return exHP;
}

export function isBetween(value: number, min: number, max: number) {
    if (isNaN(value) || value === null) {
        return null;
    }

    if (!(value >= min && value <= max)) {
        return `Value must be between ${min.toLocaleString('en-US')} and ${max.toLocaleString('en-US')}`;
    }
    return null;
}

export function isEmptyValue(value: any) {

    if (value === null || value === undefined) {
        return true;
    }

    if (!value?.toString()?.trim()) {
        return true;
    }
    return false;
}
