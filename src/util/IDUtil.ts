const CHARACTER_SET = 'abcdefghijklmnopqrstuvwxyz01234567890123456789'

export function generateID(length : number) : string {
    let id = '';

    for (let i = 0 ; i < length ; i++) {
        const characterIndex = Math.floor(Math.random() * CHARACTER_SET.length);
        id += CHARACTER_SET[characterIndex];
    }

    return id;
}