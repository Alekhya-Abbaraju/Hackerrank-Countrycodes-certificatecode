'use strict';

const fs = require('fs');
const https = require('https');

process.stdin.resume();
process.stdin.setEncoding('utf-8');

let inputString = '';
let currentLine = 0;

process.stdin.on('data', function(inputStdin) {
    inputString += inputStdin;
});

process.stdin.on('end', function() {
    inputString = inputString.split('\n');

    main();
});

function readLine() {
    return inputString[currentLine++];
}
async function getCountryName(code) {
    let pageNumber = 1;
    while (true) {
        const url = `https://jsonmock.hackerrank.com/api/countries?page=${pageNumber}`;
        const responseBody = await fetchData(url);
        for (const countryData of responseBody.data) {
            if (countryData.alpha2Code.toLowerCase() === code.toLowerCase()) {
                return countryData.name;
            }
        }
        if (responseBody.total_pages === pageNumber) {
            throw new Error("Country code not found.");
        }
        pageNumber++;
    }
}
async function fetchData(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                try {
                    const responseBody = JSON.parse(data);
                    resolve(responseBody);
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

    // API endpoint: https://jsonmock.hackerrank.com/api/countries?page=<PAGE_NUMBER>

async function main() {
  const ws = fs.createWriteStream(process.env.OUTPUT_PATH);

  const code = readLine().trim();

  const name = await getCountryName(code);

  ws.write(`${name}\n`);

}
