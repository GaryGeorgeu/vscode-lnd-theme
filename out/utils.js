"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getAccessorDescriptors(value) {
    const descriptors = Object.getOwnPropertyDescriptors(value);
    return Object.entries(descriptors)
        .filter(([key, descriptor]) => typeof descriptor.get === 'function')
        .map(([key]) => key);
}
exports.getAccessorDescriptors = getAccessorDescriptors;
// https://stackoverflow.com/a/6969486
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
exports.escapeRegExp = escapeRegExp;
//# sourceMappingURL=utils.js.map