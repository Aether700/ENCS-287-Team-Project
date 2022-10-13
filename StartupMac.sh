#! bin/bash

function pause(){
   read -p "$*"
}

cd Nodejs
node ../src/Core.js
pause 'Press any key to close'