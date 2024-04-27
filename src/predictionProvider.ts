import { IPredictionHistoryTable, IPredictionProvider } from "./interfaces";

export class PredictionProvider implements IPredictionProvider {


    private predictionHistoryTable: IPredictionHistoryTable;

    constructor(){
        this.predictionHistoryTable = {};
    }

    public getPrediction(instruction: number): boolean {
        const instructionBits: number[] = this.getInstructionBits(instruction);
        return Boolean(this.predictionHistoryTable[instructionBits[instructionBits.length - 1]]);
    }

    public updatePrediction(instruction: number, prediction: boolean): void {
        const instructionBits: number[] = this.getInstructionBits(instruction);
        this.predictionHistoryTable[instructionBits[instructionBits.length - 1]] = prediction;
    }

    private getInstructionBits(instruction: number): number[] {
        return String(instruction).split("").map((bit: string) => parseInt(bit));
    }

}