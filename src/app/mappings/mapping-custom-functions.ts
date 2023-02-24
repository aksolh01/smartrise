export function ToNullableNumber(value: string | number | null | undefined) {
    if(value === '' || value === null || value === undefined) {
        return null;
    }
    return Number(value);
}
