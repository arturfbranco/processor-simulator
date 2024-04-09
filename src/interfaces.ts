export enum Opcodes {
    ADD = "ADD",
    ADDI = "ADDI",
    SUB = "SUB",
    SUBI = "SUBI",
    J = "J",
    BEQ = "BEQ"
}

export interface IProcessor {
    loadProgram(): void;
    clockPulse(): void;    
}

export interface ILoader {
    loadFromFile(): string[];
}

export interface IRegisterBank {
    storeInRegister(register: number, value: number): void;
    readFromRegister(register: number): number;
}

export interface Instruction {
    unprocessedInstruction?: string;
    opcode?: string;
    operand1?: string;
    operand2?: string;
    operand3?: string;
    result?: number;
}

export interface PipelineStages {
    fetch: Instruction | null;
    decode: Instruction | null;
    execute: Instruction | null;
    memory: Instruction | null;
    writeback: Instruction | null;
}

