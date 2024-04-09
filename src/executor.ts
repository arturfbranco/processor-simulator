import { Alu } from "./alu";
import { IAlu, ILoader, IProcessor, IRegisterBank } from "./interfaces";
import { Processor } from "./processor";
import { ProgramLoader } from "./programLoader";
import { RegisterBank } from "./registerBank";
import { Prompt } from 'prompt-sync'

const buildProcessor = (): IProcessor => {
    const programFilePath: string = process.argv[2];
    const loader: ILoader = new ProgramLoader(programFilePath);
    const registerBank: IRegisterBank = new RegisterBank();
    const alu: IAlu = new Alu();
    return new Processor(loader, registerBank, alu);
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
        
        let shouldLoop = true; 
        while(shouldLoop){
            clock(processor);
            const input = prompt("Press any key to continue the clock or press 'q' to quit.\n");
            if(input === 'q'){
                shouldLoop = false;
                processor.getRegisters().printRegisters();
            }
        }
    } catch(e){
        console.error(e);
        return;
    }
}


