import { Alu } from "./alu";
import { BypassBuffer } from "./bypassBuffer";
import { Decoder } from "./decoder";
import { IAlu, IDecoder, ILoader, IProcessor, IRegisterBank } from "./interfaces";
import { activateLogger, shouldLogState } from "./logger";
import { measurePerformance } from "./performanceMeasure";
import { PredictionProvider } from "./predictionProvider";
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
    const predictionProvider = new PredictionProvider();
    return new Processor(loader, registerBank, alu, decoder, predictionProvider);
}

const displayMenu = (): string => {
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

        const predictionProviderActive = Boolean(process.argv[3]);
        console.log(`Prediction provider ${predictionProviderActive ? "ENABLED" : "DISABLED"}.\n`);
        console.log("Should log processor state? (y/n)\n");
        const logProcessorState = prompt("");
        if(logProcessorState === 'y'){
            activateLogger();
        }
        
        prompt("Press ENTER to load the program from file.\n");
        processor.loadProgram();

        const firstInput = displayMenu();

        let shouldStop = true;
        
        if(firstInput === 'n'){
            shouldStop = false;
        } else if(firstInput === 'q'){
            return;
        }

        let shouldLoop = true;

        measurePerformance(() => {
            while(shouldLoop){
                clock(processor);
                let input;
                if(shouldStop){
                    input = displayMenu();
                }
    
                if(input === 'n'){
                    shouldStop = false;
                }
                if(input === 'q' || (processor.getHalt() && processor.emptyPipeline())){
                    shouldLoop = false;
                    processor.getRegisters().printRegisters();
                }
            }
        });

    } catch(e){
        console.error(e);
        return;
    }
}


