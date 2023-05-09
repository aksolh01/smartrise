export function JsonIgnore() {
    return function(target: Object, propertyKey: string) {
        Reflect.defineMetadata('JsonIgnore', true, target, propertyKey);
    };
}
