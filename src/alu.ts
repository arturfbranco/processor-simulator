import { IAlu, IProcessor } from "./interfaces";

export class Alu implements IAlu {

    public add(processor: IProcessor): void {
        const executeStage = processor.getPipeline().execute;
        if(executeStage === null){
            return;
        }
        const [operand2, operand3] = executeStage.aluInputs || [];
        const result = operand2 + operand3;
        executeStage.result = result;
    }

    public addi(processor: IProcessor): void {
        const executeStage = processor.getPipeline().execute;
        if(executeStage === null){
            return;
        }
        const [operand2, operand3] = executeStage.aluInputs || [];
        const result = operand2 + operand3;
        executeStage.result = result;
    }

    public sub(processor: IProcessor): void {
        const executeStage = processor.getPipeline().execute;
        if(executeStage === null){
            return;
        }
        const [operand2, operand3] = executeStage.aluInputs || [];
        const result = operand2 - operand3;
        executeStage.result = result;
    }

    public subi(processor: IProcessor): void {
        const executeStage = processor.getPipeline().execute;
        if(executeStage === null){
            return;
        }
        const [operand2, operand3] = executeStage.aluInputs || [];
        const result = operand2 - operand3;
        executeStage.result = result;
    }

    public j(processor: IProcessor): void {
        return;
    }

    public beq(processor: IProcessor): void {
        const executeStage = processor.getPipeline().execute;
        if(executeStage === null){
            return;
        }
        const [operand1, operand2, operand3] = executeStage.aluInputs || [];
        if(operand1 === operand2){
            processor.setPc(processor.getPc() + operand3);
        }
    }

    public stahl(processor: IProcessor): void {
        return;
    }
}