// export interface Client {
//     id: number;
//     name: string;
//     email: string;
//     phone: string;
// }

export class Client {
    constructor(
        public id: number,
        public name: string,
        public email: string,
        public phone: string
    ) { }
}