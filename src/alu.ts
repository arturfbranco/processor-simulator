import { IAlu, IBypassBuffer, IProcessor } from "./interfaces";
import { shouldLogState } from "./logger";

export class Alu implements IAlu {

    private bypassBuffer: IBypassBuffer;

    constructor(bypassBuffer: IBypassBuffer){
        this.bypassBuffer = bypassBuffer;
    }

    public add(processor: IProcessor): void {
        const executeStage = processor.getPipeline().execute;
        if(executeStage === null){
            return;
        }

        const operand2FromBuffer: number | undefined = this.bypassBuffer.readFromBuffer(parseInt(executeStage.operand2!));
        const operand3FromBuffer: number | undefined = this.bypassBuffer.readFromBuffer(parseInt(executeStage.operand3!));

        if((operand2FromBuffer || operand3FromBuffer) && shouldLogState()){
            console.log("Bypass buffer hit!\n");
        }

        const [operand2, operand3] = executeStage.aluInputs ?? [];

        const usedOperand2 = operand2FromBuffer ?? operand2;
        const usedOperand3 = operand3FromBuffer ?? operand3;

        const result = usedOperand2 + usedOperand3;
        executeStage.result = result;
        this.storeResultInBypassBuffer(processor, parseInt(executeStage.operand1!));
    }

    public addi(processor: IProcessor): void {
        const executeStage = processor.getPipeline().execute;
        if(executeStage === null){
            return;
        }

        const operand2FromBuffer: number | undefined = this.bypassBuffer.readFromBuffer(parseInt(executeStage.operand2!));

        if(operand2FromBuffer && shouldLogState()){
            console.log("Bypass buffer hit!\n");
        }

        const [operand2, operand3] = executeStage.aluInputs ?? [];

        const usedOperand2 = operand2FromBuffer ?? operand2;

        const result = usedOperand2 + operand3;
        executeStage.result = result;
        this.storeResultInBypassBuffer(processor, parseInt(executeStage.operand1!));
    }

    public sub(processor: IProcessor): void {
        const executeStage = processor.getPipeline().execute;
        if(executeStage === null){
            return;
        }

        const operand2FromBuffer: number | undefined = this.bypassBuffer.readFromBuffer(parseInt(executeStage.operand2!));
        const operand3FromBuffer: number | undefined = this.bypassBuffer.readFromBuffer(parseInt(executeStage.operand3!));

        if((operand2FromBuffer || operand3FromBuffer) && shouldLogState()){
            console.log("Bypass buffer hit!\n");
        }

        const [operand2, operand3] = executeStage.aluInputs ?? [];

        const usedOperand2 = operand2FromBuffer ?? operand2;
        const usedOperand3 = operand3FromBuffer ?? operand3;

        const result = usedOperand2 - usedOperand3;
        executeStage.result = result;
        this.storeResultInBypassBuffer(processor, parseInt(executeStage.operand1!));
    }

    public subi(processor: IProcessor): void {
        const executeStage = processor.getPipeline().execute;
        if(executeStage === null){
            return;
        }

        const operand2FromBuffer: number | undefined = this.bypassBuffer.readFromBuffer(parseInt(executeStage.operand2!));

        if(operand2FromBuffer && shouldLogState()){
            console.log("Bypass buffer hit!\n");
        }
        const [operand2, operand3] = executeStage.aluInputs ?? [];

        const usedOperand2 = operand2FromBuffer ?? operand2;

        const result = usedOperand2 - operand3;
        executeStage.result = result;
        this.storeResultInBypassBuffer(processor, parseInt(executeStage.operand1!));
    }

    public j(processor: IProcessor): void {
        return;
    }

    public beq(processor: IProcessor): void {
        const executeStage = processor.getPipeline().execute;
        if(executeStage === null){
            return;
        }

        const operand1FromBuffer: number | undefined = this.bypassBuffer.readFromBuffer(parseInt(executeStage.operand1!));
        const operand2FromBuffer: number | undefined = this.bypassBuffer.readFromBuffer(parseInt(executeStage.operand2!));

        if((operand1FromBuffer ?? operand2FromBuffer) && shouldLogState()){
            console.log("Bypass buffer hit!\n");
        }

        const [operand1, operand2, operand3] = executeStage.aluInputs ?? [];

        const usedOperand1 = operand1FromBuffer ?? operand1;
        const usedOperand2 = operand2FromBuffer ?? operand2;

        const usePredictionProvider: boolean = Boolean(process.argv[3]);

        if(usedOperand1 === usedOperand2){
            if(shouldLogState()){
                console.log("Branch taken!\n");
            }

            if(usePredictionProvider){
                if(!executeStage.branchTaken){
                    processor.getPredictionProvider().updatePrediction(executeStage.instructionNumber, true)
                    this.invalidateFetchAndDecodeInstructions(processor);
                    this.bypassBuffer.invalidateLastRegistries();
                }
            } else {
                this.invalidateFetchAndDecodeInstructions(processor);
                this.bypassBuffer.invalidateLastRegistries();
            }

            if(!usePredictionProvider ?? !executeStage.branchTaken){
                processor.setPc(processor.getPc() + operand3);
            }
        } else {
            if(usePredictionProvider){
                if(executeStage.branchTaken){
                    processor.getPredictionProvider().updatePrediction(executeStage.instructionNumber, false)
                    this.invalidateFetchAndDecodeInstructions(processor);
                    this.bypassBuffer.invalidateLastRegistries();
                }
            }
        }
        this.storeResultInBypassBuffer(processor);
    }

    public stahl(processor: IProcessor): void {
        this.storeResultInBypassBuffer(processor);
    }

    private invalidateFetchAndDecodeInstructions(processor: IProcessor): void {
        processor.setPc(processor.getPipeline().execute!.instructionNumber);
        processor.getPipeline().fetch = null;
        processor.getPipeline().decode = null;
    }

    private storeResultInBypassBuffer(processor: IProcessor, targetRegister?: number): void {
        const executeStage = processor.getPipeline().execute;
        if(executeStage === null){
            return;
        }
        this.bypassBuffer.storeInBuffer(targetRegister, executeStage.result!);
    }

}