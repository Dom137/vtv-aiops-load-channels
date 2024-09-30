// API Key: wbkm1iQj5IS6krf74yrUUGAWywlvfNGJdn3efSB9

const xlsx = require('xlsx');
const axios = require('axios');

const DEF_FILE = '/Users/dominiclehr/Data/Projects/Vodafone/VTV-ASM/EPG/createChannels/opco-data/Linear_DE.xlsx';
const DEF_NA_VAL = 'n/a';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const endpoint = 'https://aiops-topology-rest-observer-cp4aiops.apps.tta.cp4ai.de/1.0/rest-observer/rest/resources';
const headers = {
    'accept': 'application/json',
    'X-TenantID': 'cfd95b7e-3bc7-4006-a4a8-a73a79c71255',
    'JobId': 'vtv-channel-load',
    'Content-Type': 'application/json',
    'Authorization': ' Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkRHbzdoRmpWRWhsZFNXZ0paMnQ0QU43cmxnUXY4bU5EYmsza0RCb0xoN2MifQ.eyJ1c2VybmFtZSI6ImRvbTEzNyIsInJvbGUiOiJBZG1pbiIsInBlcm1pc3Npb25zIjpbIndhaW9wc19tYW5hZ2VfaW50ZWdyYXRpb25zIiwid2Fpb3BzX3ZpZXdfaW50ZWdyYXRpb25zIiwid2Fpb3BzX3ZpZXdfb3BlcmF0aW9uYWxfZGF0YSIsIndhaW9wc191cGRhdGVfYWxsX3N0b3JpZXMiLCJ3YWlvcHNfcmVzb2x2ZV9hbGxfc3RvcmllcyIsIndhaW9wc192aWV3X3RvcG9sb2dpZXMiLCJ3YWlvcHNfbWFuYWdlX3RvcG9sb2d5X3RlbXBsYXRlcyIsIndhaW9wc19tYW5hZ2VfdG9wb2xvZ3lfY29tbWVudHMiLCJ3YWlvcHNfbWFuYWdlX2FwcGxpY2F0aW9ucyIsIndhaW9wc19tYW5hZ2VfYnVzaW5lc3NfY29udGV4dCIsIndhaW9wc19tYW5hZ2VfdG9wb2xvZ3lfdG9vbHMiLCJ3YWlvcHNfbWFuYWdlX3RvcG9sb2d5X3ByZXNlbnRhdGlvbiIsIndhaW9wc19tYW5hZ2VfdG9wb2xvZ3lfcnVsZXMiLCJ3YWlvcHNfbWFuYWdlX2FkdmFuY2VkX3RvcG9sb2d5X3NldHRpbmdzIiwid2Fpb3BzX3ZpZXdfYWltb2RlbHNfc3RhdHVzIiwid2Fpb3BzX21hbmFnZV9haW1vZGVscyIsIndhaW9wc192aWV3X29wZXJhdGlvbmFsX3BvbGljaWVzIiwid2Fpb3BzX2VkaXRfb3BlcmF0aW9uYWxfcG9saWNpZXMiLCJ3YWlvcHNfZGVsZXRlX29wZXJhdGlvbmFsX3BvbGljaWVzIiwic2VjdXJlX3R1bm5lbF9uZXR3b3JrIiwic2VjdXJlX3R1bm5lbF9wb3J0X2ZvcndhcmRpbmciLCJzZWN1cmVfdHVubmVsX2Nvbm5lY3Rvcl9pbnN0YWxsIiwic2VjdXJlX3R1bm5lbF9jcmVhdGVfdGVtcGxhdGUiLCJzZWN1cmVfdHVubmVsX3JlbmV3X2NlcnQiLCJzZWN1cmVfdHVubmVsX3ZpZXdfYXVkaXRfbG9nIiwid2Fpb3BzX3VzZV9ydW5ib29rcyIsIndhaW9wc19hdXRob3JfcnVuYm9va3MiLCJ3YWlvcHNfbWFuYWdlX3J1bmJvb2tzIiwid2Fpb3BzX2FkbWluaXN0ZXJfcnVuYm9va3MiLCJ3YWlvcHNfdXNlX2luc2lnaHRzX2Rhc2hib2FyZCIsIndhaW9wc19hZG1pbl9pbnNpZ2h0c19kYXNoYm9hcmQiLCJ3YWlvcHNfbWFuYWdlX3RvcG9sb2d5X3JvdXRpbmVzIiwiYWRtaW5pc3RyYXRvciIsImNhbl9wcm92aXNpb24iLCJtb25pdG9yX3BsYXRmb3JtIiwiY29uZmlndXJlX3BsYXRmb3JtIiwidmlld19wbGF0Zm9ybV9oZWFsdGgiLCJjb25maWd1cmVfYXV0aCIsIm1hbmFnZV91c2VycyIsIm1hbmFnZV9ncm91cHMiLCJtYW5hZ2Vfc2VydmljZV9pbnN0YW5jZXMiLCJzaWduX2luX29ubHkiXSwiZ3JvdXBzIjpbMTAwMDEsMTAwMDBdLCJzdWIiOiJkb20xMzciLCJpc3MiOiJLTk9YU1NPIiwiYXVkIjoiRFNYIiwidWlkIjoiMTAwMDMzMTAwNCIsImF1dGhlbnRpY2F0b3IiOiJleHRlcm5hbCIsImRpc3BsYXlfbmFtZSI6IkRvbTEzNyIsImFwaV9yZXF1ZXN0IjpmYWxzZSwiaWF0IjoxNzI3Njg1Mjg2LCJleHAiOjE3Mjc3Mjg0ODZ9.tKZKSZrF2H6Q39VCWBWapghTEBvkI3bh7Q3JgAPqskGEvqw1gJxdNYxHpGZDIjmnFnx-x19JkBB2f0InPoWx4Gb3J5uccTVUXbaqfq9mzqeAGyQhT8Uk94LUKtIjuIvCTKKfX-gusS4OFhB8iCulJ6qP1w9u70WWwHArLULz3SnhxQ74WoXW-gcgkDtezPohm-sWmcUsfN2kBOSae3lT4ia8D2BhZ758feFVWPNELvy60HKvUy_ol-kVhlUhKeCMEmpOaqhAiwIMOtEsnu8MMPz-xtCUdLKvAqftCD5NuenLSM8RIjkyCnpQBp279iYgyJ7cu4PcDfDbKNrzeS0TCw'
};

// Function to send POST request for each object
const sendPostRequest = async (data) => {
    const postData = {
        uniqueId: data.uniqueId,
        entityTypes: data.entityTypes,
        matchTokens: data.matchTokens,
        channelId: data.channelId,
        channelDesc: data.channelDesc, 
        channelPlatform: data.channelPlatform,
        epgContentTags: data.epgContentTags,
        name: data.channelName
    };

    try {
        const response = await axios.post(endpoint, postData, { headers });
        console.log(`Successfully sent data for channelId ${data.channelId} (${data.channelName}):`, response.status);
    } catch (error) {
        console.log(error);
        console.error(`Error sending data for channelId ${data.channelId} (${data.channelName}):`, error.response ? error.response.data : error.message);
    }
};
// Function to extract the opco name from the file name
const extractLettersAfterUnderscore = (filePath) => {
    const lastUnderscoreIndex = filePath.lastIndexOf('_');

    if (lastUnderscoreIndex !== -1 && lastUnderscoreIndex + 3 <= filePath.length) {
        const extractedLetters = filePath.substring(lastUnderscoreIndex + 1, lastUnderscoreIndex + 3);
        return extractedLetters;
    } else {
        return null; 
    }
}

// Function to check for undefined or null values and replace them with "n/a"
const checkValue = (value) => (value === undefined || value === null ) ? DEF_NA_VAL : value;

// Function to validate required fields before creating the event object
const validateData = (data) => {
    const { channelId, channelName, channelPlatform, epgContentTags } = data;

    // Check if critical values are populated
    if (channelId === DEF_NA_VAL) {
        console.error('Error: Missing channelId. Skipping this entry.');
        return false;
    }

    if (channelName === DEF_NA_VAL) {
        console.error(`Error: Missing channelName for channelId ${channelId}. Skipping this entry.`);
        return false;
    }

    if (channelPlatform === DEF_NA_VAL) {
        console.warn(`Warning: Missing channelPlatform for channelId ${channelId}. Defaulting to 'n/a'.`);
    }

    if (epgContentTags === DEF_NA_VAL) {
        console.warn(`Warning: Missing epgContentTags for channelId ${channelId}. Defaulting to 'n/a'.`);
    }

    return true; // Return true if validation passes
};

// Load the Excel file
const opcoLetter = extractLettersAfterUnderscore(DEF_FILE);
const workbook = xlsx.readFile(DEF_FILE);

const sheetName = 'Linear_' + opcoLetter;
const channelEntityType = 'channel';
const worksheet = workbook.Sheets[sheetName];

// Convert the worksheet to JSON format
const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

// Extract specific columns: C (2) D (3) E (4) S (18)
const extractedData = jsonData.slice(1).map(row => ({
    // unique ID is made up of the OPCO letters, the channel ID and the channel Name
    uniqueId: checkValue(opcoLetter) + '_' + checkValue(row[4]) + '_' + checkValue(row[2]),
    entityTypes: [channelEntityType],
    matchTokens: [checkValue(row[4]), checkValue(row[2])],
    channelOpco : opcoLetter,
    channelId: checkValue(row[4]),         // Column E
    channelName: checkValue(row[2]),       // Column C
    channelDesc: checkValue(row[3]),       // Column G
    channelPlatform: checkValue(row[18]),  // Column S
    epgContentTags: DEF_NA_VAL    // Column ???
}));

// Log the result
//console.log(extractedData[295]);
const data = extractedData[1];
if (validateData(data)) {
    console.log(data);
    //sendPostRequest(data);
}

// Loop through each extracted object and send it via POST
// extractedData.forEach(data =>  {
//     // Validate the data before creating an event object and sending it
//     if (validateData(data)) {
//         sendPostRequest(data);
//     }
// });
