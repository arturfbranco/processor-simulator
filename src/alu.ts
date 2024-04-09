import { IAlu, IProcessor } from "./interfaces";

export class Alu implements IAlu {

    public add(processor: IProcessor): void {
        const executeStage = processor.getPipeline().execute;
        if(executeStage === null){
            return;
        }
        const operand1 = processor.getRegisters().readFromRegister(parseInt(executeStage.operand2 || ""));
        const operand2 = processor.getRegisters().readFromRegister(parseInt(executeStage.operand3 || ""));
        const result = operand1 + operand2;
        executeStage.result = result;
    }

    public addi(processor: IProcessor): void {
        const executeStage = processor.getPipeline().execute;
        if(executeStage === null){
            return;
        }
        const operand1 = processor.getRegisters().readFromRegister(parseInt(executeStage.operand2 || ""));
        const operand2 = parseInt(executeStage.operand3 || "");
        const result = operand1 + operand2;
        executeStage.result = result;
    }

    public sub(processor: IProcessor): void {
        const executeStage = processor.getPipeline().execute;
        if(executeStage === null){
            return;
        }
        const operand1 = processor.getRegisters().readFromRegister(parseInt(executeStage.operand2 || ""));
        const operand2 = processor.getRegisters().readFromRegister(parseInt(executeStage.operand3 || ""));
        const result = operand1 - operand2;
        executeStage.result = result;
    }

    public subi(processor: IProcessor): void {
        const executeStage = processor.getPipeline().execute;
        if(executeStage === null){
            return;
        }
        const operand1 = processor.getRegisters().readFromRegister(parseInt(executeStage.operand2 || ""));
        const operand2 = parseInt(executeStage.operand3 || "");
        const result = operand1 - operand2;
        executeStage.result = result;
    }

    public j(processor: IProcessor): void {
        const executeStage = processor.getPipeline().execute;
        if(executeStage === null){
            return;
        }
        processor.setPc(parseInt(executeStage.operand1 || ""));
    }

    public beq(processor: IProcessor): void {
        const executeStage = processor.getPipeline().execute;
        if(executeStage === null){
            return;
        }
        const operand1 = processor.getRegisters().readFromRegister(parseInt(executeStage.operand1 || ""));
        const operand2 = processor.getRegisters().readFromRegister(parseInt(executeStage.operand2 || ""));
        const operand3 = parseInt(executeStage.operand3 || "");
        if(operand1 === operand2){
            processor.setPc(processor.getPc() + operand3);
        }
    }
}