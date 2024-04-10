import { IDecoder, IProcessor, Instruction } from "./interfaces";

export class Decoder implements IDecoder {
    public decode(processor: IProcessor): void {

        const {decode: decodeInstruction} = processor.getPipeline();

        if(decodeInstruction === null){
            return;
        }

        const [opcode, operand1, operand2, operand3] = decodeInstruction.unprocessedInstruction?.split(" ") || [];
        processor.getPipeline().decode = {
            opcode,
            operand1,
            operand2,
            operand3
        }

        switch(opcode){

            case "add":
                this.decodeAdd(processor);
                break;
            case "addi":
                this.decodeAddi(processor);           
                break;
            case "sub":
                this.decodeSub(processor);
                break;
            case "subi":
                this.decodeSubi(processor);
                break;
            case "j":
                this.decodeJ(processor);
                break;
            case "beq":
                this.decodeBeq(processor);
                break;
            case "stahl":
                this.decodeStahl(processor);
                break;
            default:
                throw new Error("Invalid opcode");
        }
    }

    private decodeAdd(processor: IProcessor): void {
        const decodeStage = processor.getPipeline().decode;
        if(decodeStage === null){
            return;
        }
        const operand2 = this.getRegisterValue(processor, decodeStage.operand2);
        const operand3 = this.getRegisterValue(processor, decodeStage.operand3);
        decodeStage.aluInputs = [operand2, operand3];
        decodeStage.handler = processor.getAlu().add.bind(processor.getAlu());
    }

    private decodeAddi(processor: IProcessor): void {
        const decodeStage = processor.getPipeline().decode;
        if(decodeStage === null){
            return;
        }
        const operand2 = this.getRegisterValue(processor, decodeStage.operand2);
        const operand3 = parseInt(decodeStage.operand3 || "");
        decodeStage.aluInputs = [operand2, operand3];
        decodeStage.handler = processor.getAlu().addi.bind(processor.getAlu());
    }

    private decodeSub(processor: IProcessor): void {
        const decodeStage = processor.getPipeline().decode;
        if(decodeStage === null){
            return;
        }
        const operand2 = this.getRegisterValue(processor, decodeStage.operand2);
        const operand3 = this.getRegisterValue(processor, decodeStage.operand3);
        decodeStage.aluInputs = [operand2, operand3];
        decodeStage.handler = processor.getAlu().sub.bind(processor.getAlu());
    }

    private decodeSubi(processor: IProcessor): void {
        const decodeStage = processor.getPipeline().decode;
        if(decodeStage === null){
            return;
        }
        const operand2 = this.getRegisterValue(processor, decodeStage.operand2);
        const operand3 = parseInt(decodeStage.operand3 || "");
        decodeStage.aluInputs = [operand2, operand3];
        decodeStage.handler = processor.getAlu().subi.bind(processor.getAlu());
    }

    private decodeJ(processor: IProcessor): void {
        const decodeStage = processor.getPipeline().decode;
        if(decodeStage === null){
            return;
        }
        const operand1 = parseInt(decodeStage.operand1 || "");
        processor.setPc(operand1);
        processor.getPipeline().fetch = null;
    }

    private decodeBeq(processor: IProcessor): void {
        const decodeStage = processor.getPipeline().decode;
        if(decodeStage === null){
            return;
        }
        const operand1 = this.getRegisterValue(processor, decodeStage.operand1);
        const operand2 = this.getRegisterValue(processor, decodeStage.operand2);
        const operand3 = parseInt(decodeStage.operand3 || "");
        decodeStage.aluInputs = [operand1, operand2, operand3];
        decodeStage.handler = processor.getAlu().beq.bind(processor.getAlu());
    }

    private decodeStahl(processor: IProcessor): void {
        return;
    }

    private getRegisterValue(processor: IProcessor, register?: string): number {
        return processor.getRegisters().readFromRegister(parseInt(register || ""));
    }
}