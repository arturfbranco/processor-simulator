import { IAlu, IDecoder, ILoader, IPredictionProvider, IProcessor, IRegisterBank, Opcodes, PipelineStages } from "./interfaces";
import { cloneDeep } from "lodash";
import { shouldLogState } from "./logger";

export class Processor implements IProcessor {

    private pc: number;
    private programMemory: string[] | null;
    private programLoader: ILoader;
    private registers: IRegisterBank;
    private pipeline: PipelineStages;
    private predictionProvider: IPredictionProvider;
    private alu: IAlu;
    private decoder: IDecoder;
    private halt: boolean;

    constructor(loader: ILoader, registerBank: IRegisterBank, alu: IAlu, decoder: IDecoder, predictionProvider: IPredictionProvider) {
        this.pc = 0;
        this.programMemory = null;
        this.programLoader = loader;
        this.registers = registerBank;
        this.alu = alu;
        this.predictionProvider = predictionProvider;
        this.decoder = decoder;
        this.pipeline = {
            fetch: null,
            decode: null,
            execute: null,
            memory: null,
            writeback: null
        }
        this.halt = false;
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

    public getAlu(): IAlu {
        return this.alu;
    }

    public getPredictionProvider(): IPredictionProvider {
        return this.predictionProvider;
    }

    public getPc(): number {
        return this.pc;
    }

    public getHalt(): boolean {
        return this.halt;
    }

    public setPc(pc: number): void {
        this.pc = pc;
    }

    public emptyPipeline(): boolean {
        if (this.pipeline.fetch === null && this.pipeline.decode === null &&
            this.pipeline.execute === null && this.pipeline.memory === null &&
            this.pipeline.writeback === null) {
                return true;
            }
        return false;
    }

    private runStages(): void {
        if(shouldLogState()){
            console.log(`Running stages for PC: ${this.pc}...\n`);
        }
        this.runWriteback();
        this.runMemory();
        this.runExecute();
        this.runDecode();
        this.runFetch();
    }

    private runFetch(): void {
        
        if(this.programMemory === null){
            throw new Error("Program memory is empty");
        }

        if(this.pc >= this.programMemory.length){
            this.halt = true;
            return;
        }

        this.pipeline.fetch = {
            instructionNumber: this.pc,
            unprocessedInstruction: this.programMemory[this.pc]
        }
        this.pc++;
    }

    private runDecode(): void {
        this.decoder.decode(this);
    }

    private runExecute(): void {
        if(this.pipeline.execute === null || !this.pipeline.execute.handler){
            return;
        }
        this.pipeline.execute.handler(this);  
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
        if(shouldLogState()){
            console.log(this.pipeline);
            this.registers.printRegisters();
        }
    }
}