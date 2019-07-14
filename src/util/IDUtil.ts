const CHARACTER_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789012345678901234567890123456789012345678901'

export function generateID(length : number) : string {
    let id = '';

    for (let i = 0 ; i < length ; i++) {
        const characterIndex = Math.floor(Math.random() * CHARACTER_SET.length);
        id += CHARACTER_SET[characterIndex];
    }

    return id;
}