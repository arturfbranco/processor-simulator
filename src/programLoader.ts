import fs from 'fs';
import resolve from 'path';
import { ILoader } from './interfaces';

export class ProgramLoader implements ILoader {
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    public loadFromFile(): string[] {
        const fullPath = resolve.resolve(__dirname, this.filePath);
        const program = fs.readFileSync(fullPath, 'utf8').split('\n');
        console.log(`Loading program:\n ${program}`);
        return program
    }
}   