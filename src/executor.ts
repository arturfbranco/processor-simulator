import { Alu } from "./alu";
import { BypassBuffer } from "./bypassBuffer";
import { Decoder } from "./decoder";
import { IAlu, IDecoder, ILoader, IProcessor, IRegisterBank } from "./interfaces";
import { Processor } from "./processor";
import { ProgramLoader } from "./programLoader";
import { RegisterBank } from "./registerBank";
import { Prompt } from 'prompt-sync'

const prompt: Prompt = require('prompt-sync')();

const buildProcessor = (): IProcessor => {
    const programFilePath: string = process.argv[2];
    const loader: ILoader = new ProgramLoader(programFilePath);
    const registerBank: IRegisterBank = new RegisterBank();
    const alu: IAlu = new Alu(new BypassBuffer());
    const decoder: IDecoder = new Decoder();
    return new Processor(loader, registerBank, alu, decoder);
}

const displayMeny = (): string => {
    console.log(`
    1. Press ENTER to continue.\n
    2. Press 'n' + ENTER to run all program non stop.\n
    3. Press 'q' + ENTER to quit.\n`
    );
    return prompt("");
}

const clock = (processor: IProcessor): void => {
    processor.clockPulse();
}

export const main = (): void => {
    try{
        const processor: IProcessor = buildProcessor();
        
        prompt("Press ENTER to load the program from file.\n");
        processor.loadProgram();

        const firstInput = displayMeny();

        let shouldStop = true;
        
        if(firstInput === 'n'){
            shouldStop = false;
        } else if(firstInput === 'q'){
            return;
        }

        let shouldLoop = true; 
        while(shouldLoop){
            clock(processor);
            let input;
            if(shouldStop){
                input = displayMeny();
            }

            if(input === 'n'){
                shouldStop = false;
            }
            if(input === 'q' || (processor.getHalt() && processor.emptyPipeline())){
                shouldLoop = false;
                processor.getRegisters().printRegisters();
            }
        }
    } catch(e){
        console.error(e);
        return;
    }
}


