export class Meeting {
    constructor (
        public id: number,
        public clientId: number,
        public clientName: string,
        public date: string,
        public time: string,
        public meetLength: string,
        public note: string,
        ) { }
}