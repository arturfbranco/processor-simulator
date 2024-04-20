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
    getAlu(): IAlu;
    getPredictionProvider(): IPredictionProvider;
    getPc(): number;
    setPc(pc: number): void;
    getHalt(): boolean;
    emptyPipeline(): boolean;
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
    instructionNumber: number
    unprocessedInstruction?: string;
    opcode?: string;
    operand1?: string;
    operand2?: string;
    operand3?: string;
    handler?: (processor: IProcessor) => void;
    aluInputs?: number[];
    result?: number;
    branchTaken?: boolean;
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
    stahl(processor: IProcessor): void;
}

export interface IBypassBuffer {
    storeInBuffer(register?: number, value?: number): void;
    readFromBuffer(register: number): number | undefined;
    invalidateLastRegistries(): void;
}

export interface IBypassBufferData {
    register?: number;
    value?: number;
}
export interface IDecoder {
    decode(processor: IProcessor): void;
}

export interface IPredictionHistoryTable {
    [instructionBit: number]: boolean;
}

export interface IPredictionProvider {
    getPrediction(instruction: number): boolean;
    updatePrediction(instruction: number, prediction: boolean): void;
}

