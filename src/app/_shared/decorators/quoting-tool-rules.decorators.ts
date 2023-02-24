export function Confirmable(target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    // Again, cache the original method for later use
    descriptor.value = async function(...args) {
        console.log(target);
    };
    return descriptor;
}
