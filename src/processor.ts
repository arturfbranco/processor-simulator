import { ILoader, IProcessor, IRegisterBank, Opcodes, PipelineStages } from "./interfaces";

export class Processor implements IProcessor {

    private pc: number;
    private programMemory: string[] | null;
    private programLoader: ILoader;
    private registers: IRegisterBank;
    private pipeline: PipelineStages;

    constructor(loader: ILoader, registerBank: IRegisterBank) {
        this.pc = 0;
        this.programMemory = null;
        this.programLoader = loader;
        this.registers = registerBank;
        this.pipeline = {
            fetch: null,
            decode: null,
            execute: null,
            memory: null,
            writeback: null
        }
    }

    public loadProgram(): void {
        this.programMemory = this.programLoader.loadFromFile();
    }


    public clockPulse(): void {
        this.runStages();
        this.printPipeline();
        this.pushInstructions();
    }

    private runStages(): void {
        this.runFetch();
        this.runDecode();
        this.runExecute();
        this.runMemory();
        this.runWriteback();
    }

    private runFetch(): void {
        
        if(this.programMemory === null){
            throw new Error("Program memory is empty");
        }

        if(this.pc >= this.programMemory.length){
            throw new Error("Program counter out of bounds");
        }

        this.pipeline.fetch = {
            unprocessedInstruction: this.programMemory[this.pc]
        }
        this.pc++;
    }

    private runDecode(): void {

        if(this.pipeline.decode === null){
            return;
        }

        const [opcode, operand1, operand2, operand3] = this.pipeline.fetch?.unprocessedInstruction?.split(" ") || [];
        this.pipeline.decode = {
            opcode: opcode,
            operand1: operand1,
            operand2: operand2,
            operand3: operand3
        }
    }

    private runExecute(): void {

        if(this.pipeline.execute === null){
            return;
        }
        switch(this.pipeline.decode?.opcode){
            case Opcodes.ADD:
                this.add();
                break;
            case Opcodes.ADDI:
                this.addi();
                break;
            case Opcodes.SUB:
                this.sub();
                break;
            case Opcodes.SUBI:
                this.subi();
                break;
            case Opcodes.J:
                this.j();
                break;
            case Opcodes.BEQ:
                this.beq();
                break;
            default:
                throw new Error("Invalid opcode");
        }        
    }

    private add(): void {
        const operand1 = this.registers.readFromRegister(parseInt(this.pipeline.decode?.operand2 || ""));
        const operand2 = this.registers.readFromRegister(parseInt(this.pipeline.decode?.operand3 || ""));
        const result = operand1 + operand2;
        this.pipeline.execute = {
            result: result
        }
    }

    private addi(): void {
        const operand1 = this.registers.readFromRegister(parseInt(this.pipeline.decode?.operand2 || ""));
        const operand2 = parseInt(this.pipeline.decode?.operand3 || "");
        const result = operand1 + operand2;
        this.pipeline.execute = {
            result: result
        }
    }

    private sub(): void {
        const operand1 = this.registers.readFromRegister(parseInt(this.pipeline.decode?.operand2 || ""));
        const operand2 = this.registers.readFromRegister(parseInt(this.pipeline.decode?.operand3 || ""));
        const result = operand1 - operand2;
        this.pipeline.execute = {
            result: result
        }
    }

    private subi(): void {
        const operand1 = this.registers.readFromRegister(parseInt(this.pipeline.decode?.operand2 || ""));
        const operand2 = parseInt(this.pipeline.decode?.operand3 || "");
        const result = operand1 - operand2;
        this.pipeline.execute = {
            result: result
        }
    }

    private j(): void {
        this.pc = parseInt(this.pipeline.decode?.operand1 || "");
    }

    private beq(): void {
        const operand1 = this.registers.readFromRegister(parseInt(this.pipeline.decode?.operand1 || ""));
        const operand2 = this.registers.readFromRegister(parseInt(this.pipeline.decode?.operand2 || ""));
        const operand3 = parseInt(this.pipeline.decode?.operand3 || "");
        if(operand1 === operand2){
            this.pc += operand3;
        }
    }

    private runMemory(): void {
        return;
    }

    private runWriteback(): void {
        if(this.pipeline.writeback === null){
            return;
        }

        if(this.shouldStoreInRegister() && typeof this.pipeline.writeback.result === "number"){
            this.registers.storeInRegister(parseInt(this.pipeline.decode?.operand1 || ""), this.pipeline.writeback.result);
        }
    }

    private shouldStoreInRegister(): boolean {
        return this.pipeline.writeback?.opcode === Opcodes.ADD || 
               this.pipeline.writeback?.opcode === Opcodes.ADDI || 
               this.pipeline.writeback?.opcode === Opcodes.SUB || 
               this.pipeline.writeback?.opcode === Opcodes.SUBI;
    }

    private pushInstructions(): void {
        this.pipeline.writeback = this.pipeline.memory;
        this.pipeline.memory = this.pipeline.execute;
        this.pipeline.execute = this.pipeline.decode;
        this.pipeline.decode = this.pipeline.fetch;
        this.pipeline.fetch = null;
    }
    
    private printPipeline(): void {
        console.log(this.pipeline);
    }
}