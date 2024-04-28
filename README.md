processor-simulator

Requires NodeJS installed.

Setup:

1. npm run build
2. To run the program in terminal: node build/index.js RELATIVE_PATH_TO_PROGRAM_FILE
3. 
   To run the program in VS Code: in Debug tab, click Launch Program

Prediction method:
The program accepts a second argument to state the prediction method to be used in conditional branches. If its value equals null, it will always consider branches as "not taken"; if it exists a prediction table history will be used.


Branches:

master: final version

v1: processor version without any hazard management.

v2: processor with data hazard management using bypass.

v3: processor with data hazard (bypass) and control hazard (branch not taken) management.

