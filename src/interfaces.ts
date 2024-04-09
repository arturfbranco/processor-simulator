export enum Opcodes {
    ADD = "add",
    ADDI = "addi",
    SUB = "sub",
    SUBI = "subi",
    J = "j",
    BEQ = "beq",
    STAHL = "stahl"
}

export interface IProcessor {
    loadProgram(): void;
    clockPulse(): void;
    getRegisters(): IRegisterBank;
    getPipeline(): PipelineStages;
    getPc(): number;
    setPc(pc: number): void;
}

export interface ILoader {
    loadFromFile(): string[];
}

export interface IRegisterBank {
    storeInRegister(register: number, value: number): void;
    readFromRegister(register: number): number;
    printRegisters(): void;
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

export interface IAlu {
    add(processor: IProcessor): void;
    addi(processor: IProcessor): void;
    sub(processor: IProcessor): void;
    subi(processor: IProcessor): void;
    j(processor: IProcessor): void;
    beq(processor: IProcessor): void;
}

