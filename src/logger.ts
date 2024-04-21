let shouldLog: boolean = false;

export const activateLogger = () => {
    shouldLog = true;
}

export const shouldLogState = () => {
    return shouldLog;
}