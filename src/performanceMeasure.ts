export const measurePerformance = (callback: () => void) => {
    const start = performance.now();
    callback();
    const end = performance.now();
    console.log(`Execution time: ${end - start}ms`);
}