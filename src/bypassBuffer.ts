import { IBypassBuffer, IBypassBufferData } from "./interfaces";

export class BypassBuffer implements IBypassBuffer {

    private buffer: IBypassBufferData[];

    constructor(){
        this.buffer = [];
    }

    storeInBuffer(register?: number | undefined, value?: number | undefined): void {
        if(this.buffer.length === 3) {
            this.buffer.shift();
        }
        this.buffer.push({register, value});
    }
    readFromBuffer(register: number): number | undefined {
        return this.buffer.find((data) => data.register === register)?.value;
    }

}