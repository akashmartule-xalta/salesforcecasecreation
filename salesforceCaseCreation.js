const axios = require("axios");

async function salesforceIntegration(submittedFormData1) {
    // Define your Salesforce API endpoint and access token
    const apiEndpoint = 'https://xaltatechnologies56-dev-ed.develop.my.salesforce.com/services/data/v52.0/sobjects/Case';
    const accessToken = '00D5g00000KgwCD!AQIAQKf4AtItPgPGjce_qTLSQRQdjWTWkCRjbDOKfx85YE6djxwSsRMMs4POLlAtMtHpoorSw15oYJF3bx3VhyBTiMZJGTe5';

    // Define the case data you want to create
    const caseData = {
        Subject: submittedFormData1.subject,
        Status: submittedFormData1.status,
        priority: submittedFormData1.priority,
    };

    // Set the headers, including the authorization header
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
    };

    // Return a Promise
    // return new Promise((resolve, reject) => {
    //     axios
    //         .post(apiEndpoint, caseData, { headers })
    //         .then((response) => {
    //             const caseId = response.data.id;
    //             const caseUrl = `https://xaltatechnologies56-dev-ed.develop.my.salesforce.com/${caseId}`;
    //             console.log("Case created successfully. URL:", caseUrl);
    //             // setTimeout(()=>{
    //             //     console.log("after 10000");
    //             // },10000)
    //             resolve(caseUrl);
    //         })
    //         .catch((error) => {
    //             console.error("Error creating case:", error);
    //             reject(error);
    //         });
    // });

    return await axios
        .post(apiEndpoint, caseData, { headers })
        .then((response) => {
            const caseId = response.data.id;
            const caseUrl = `https://xaltatechnologies56-dev-ed.develop.my.salesforce.com/${caseId}`;
            console.log("Case created successfully. URL:", caseUrl);
            // setTimeout(()=>{
            //     console.log("after 10000");
            // },10000)
            return caseUrl;
        })
        .catch((error) => {
            console.error("Error creating case:", error);
            reject(error);
        });
}

module.exports = {
    salesforceIntegration
};
