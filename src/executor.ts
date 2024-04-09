import { ILoader, IProcessor, IRegisterBank } from "./interfaces";
import { Processor } from "./processor";
import { ProgramLoader } from "./programLoader";
import { RegisterBank } from "./registerBank";
import { Prompt } from 'prompt-sync'

const buildProcessor = (): IProcessor => {
    const programFilePath: string = process.argv[2];
    const loader: ILoader = new ProgramLoader(programFilePath);
    const registerBank: IRegisterBank = new RegisterBank();
    return new Processor(loader, registerBank);
}

const clock = (processor: IProcessor): void => {
    processor.clockPulse();
}

export const main = (): void => {
    try{
        const processor: IProcessor = buildProcessor();
        const prompt: Prompt = require('prompt-sync')();
        
        prompt("Press any key to load the program from file.\n");
        processor.loadProgram();
        
        prompt("Press any key to start the clock.\n");
        
        while(true){
            clock(processor);
            prompt("Press any key to continue the clock or press 'q' to quit.\n");
        }
    } catch(e){
        console.error(e);
        return;
    }
}


