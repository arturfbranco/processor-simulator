import { IRegisterBank } from "./interfaces";

export class RegisterBank implements IRegisterBank {
    private registers: number[];

    constructor(){
        this.registers = new Array(32).fill(0);
    }

    public storeInRegister(register: number, value: number): void {
        if(register === 0){
            throw new Error("Register 0 cannot be written to");
        }
        this.registers[register] = value;
    }

    public readFromRegister(register: number): number {
        if(register >= this.registers.length){
            throw new Error("Register does not exist");
        }
        return this.registers[register];
    }

    public printRegisters(): void {
        console.log(`Register bank:\n${this.registers.join(" | ")}`);
    }
}