const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

stdout.write('You are welcome, enter the message:\n');

stdin.on('data', (chunk) => {
    const bigData = chunk.toString().toLowerCase().trim()
    if (bigData === 'exit') {
        process.exit();
    } else {
        writeStream.write(chunk);
    }
});

process.on('exit', () =>  console.log('Good Bye!'));
process.on('SIGINT', () =>  process.exit());