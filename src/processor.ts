import { IAlu, ILoader, IProcessor, IRegisterBank, Opcodes, PipelineStages } from "./interfaces";
import { cloneDeep } from "lodash";

export class Processor implements IProcessor {

    private pc: number;
    private programMemory: string[] | null;
    private programLoader: ILoader;
    private registers: IRegisterBank;
    private pipeline: PipelineStages;
    private alu: IAlu;

    constructor(loader: ILoader, registerBank: IRegisterBank, alu: IAlu) {
        this.pc = 0;
        this.programMemory = null;
        this.programLoader = loader;
        this.registers = registerBank;
        this.alu = alu;
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

    public getPipeline(): PipelineStages {
        return this.pipeline;
    }

    public getRegisters(): IRegisterBank {
        return this.registers;
    }

    public getPc(): number {
        return this.pc;
    }

    public setPc(pc: number): void {
        this.pc = pc;
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
            return;
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

        const [opcode, operand1, operand2, operand3] = this.pipeline.decode?.unprocessedInstruction?.split(" ") || [];
        this.pipeline.decode = {
            opcode,
            operand1,
            operand2,
            operand3
        }
    }

    private runExecute(): void {

        if(this.pipeline.execute === null || !this.pipeline.execute.opcode){
            return;
        }
        switch(this.pipeline.execute?.opcode){
            case Opcodes.ADD:
                this.alu.add(this);
                break;
            case Opcodes.ADDI:
                this.alu.addi(this);
                break;
            case Opcodes.SUB:
                this.alu.sub(this);
                break;
            case Opcodes.SUBI:
                this.alu.subi(this);
                break;
            case Opcodes.J:
                this.alu.j(this);
                break;
            case Opcodes.BEQ:
                this.alu.beq(this);
                break;
            case Opcodes.STAHL:
                break;    
            default:
                throw new Error("Invalid opcode");
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
            this.registers.storeInRegister(parseInt(this.pipeline.writeback?.operand1 || ""), this.pipeline.writeback.result);
        }
    }

    private shouldStoreInRegister(): boolean {
        return this.pipeline.writeback?.opcode === Opcodes.ADD || 
               this.pipeline.writeback?.opcode === Opcodes.ADDI || 
               this.pipeline.writeback?.opcode === Opcodes.SUB || 
               this.pipeline.writeback?.opcode === Opcodes.SUBI;
    }

    private pushInstructions(): void {
        this.pipeline.writeback = cloneDeep(this.pipeline.memory);
        this.pipeline.memory = cloneDeep(this.pipeline.execute);
        this.pipeline.execute = cloneDeep(this.pipeline.decode);
        this.pipeline.decode = cloneDeep(this.pipeline.fetch);
        this.pipeline.fetch = null;
    }
    
    private printPipeline(): void {
        console.log(this.pipeline);
    }
}