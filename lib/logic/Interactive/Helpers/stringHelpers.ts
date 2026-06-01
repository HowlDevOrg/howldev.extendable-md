export function getInnerString(key: string): any {
    return key.slice(1, key.length - 1);
}
export function isQuotedString(key: string) {
    return key.startsWith('"') && key.endsWith('"');
}
