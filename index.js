const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Replace these with your actual Slack signing secret and token
const slackSigningSecret = "3c74e504950d09274e398b2fd6bccee2";
const slackBotToken = "xoxb-5994587263730-6025418437684-IQicFRW9bgeiFzUIa5WitBlE";

let submittedFormData = {};


//**************************************************************************/
// ********** salsh command *****  MODAL Opened *****************************

app.post("/case", async (req, res) => {
  const triggerId = req.body?.trigger_id;
  console.log(req.body)
  // Send the JSON data as a modal
  const data = await axios.post(
    "https://slack.com/api/views.open",
    {
      trigger_id: triggerId,
      view: {
        "type": "modal",
        "callback_id": "modal-identifier",
        "title": {
          "type": "plain_text",
          "text": "New Case",
          "emoji": true
        },
        "submit": {
          "type": "plain_text",
          "text": "Submit",
          "emoji": true
        },
        "close": {
          "type": "plain_text",
          "text": "Cancel",
          "emoji": true
        },
        "blocks": [
          {
            "type": "input",
            "block_id": "contactNameBlock", // Add a unique block ID
            "element": {
              "type": "plain_text_input",
              "action_id": "contactNameInput"
            },
            "label": {
              "type": "plain_text",
              "text": "Contact Name",
              "emoji": true
            }
          },
          {
            "type": "input",
            "element": {
              "type": "plain_text_input",
              "action_id": "plain_text_input-action"
            },
            "label": {
              "type": "plain_text",
              "text": "Account Name",
              "emoji": true
            }
          },
          {
            "type": "input",
            "element": {
              "type": "static_select",
              "placeholder": {
                "type": "plain_text",
                "text": "Select an item",
                "emoji": true
              },
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "New",
                    "emoji": true
                  },
                  "value": "value-0"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Working",
                    "emoji": true
                  },
                  "value": "value-1"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Escalated",
                    "emoji": true
                  },
                  "value": "value-2"
                }
              ],
              "action_id": "static_select-action"
            },
            "label": {
              "type": "plain_text",
              "text": "Status",
              "emoji": true
            }
          },
          {
            "type": "input",
            "element": {
              "type": "static_select",
              "placeholder": {
                "type": "plain_text",
                "text": "Select an item",
                "emoji": true
              },
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "High",
                    "emoji": true
                  },
                  "value": "value-0"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "medium*",
                    "emoji": true
                  },
                  "value": "value-1"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Low",
                    "emoji": true
                  },
                  "value": "value-2"
                }
              ],
              "action_id": "static_select-action"
            },
            "label": {
              "type": "plain_text",
              "text": "priority",
              "emoji": true
            }
          },
          {
            "type": "input",
            "element": {
              "type": "plain_text_input",
              "action_id": "plain_text_input-action"
            },
            "label": {
              "type": "plain_text",
              "text": "Subject",
              "emoji": true
            }
          }
        ]
      },
    },
    {
      headers: {
        "Authorization": `Bearer ${slackBotToken}`,
        "Content-Type": "application/json; charset=utf-8",
      },
    }
  )
  res.status(200).send({});

});

//********************************************************************** */
// ************* AFTER CLICK ON SUBMIT THIS WILL CALL **********************


app.post("/submitCase", async (req, res) => {
  // Parse the payload from the request body
  const payload = JSON.parse(req.body?.payload);

  // ***************************************** 
  // Extract the data you need from the payload

  const triggerId = payload.trigger_id;
  const viewId = payload.view.id;
  const teamId = payload.team.id;
  console.log(payload.view.id)
  const contactName = payload.view.state.values.contactNameBlock.contactNameInput.value;
  const accountName = payload.view.state.values.GtQRP["plain_text_input-action"].value;
  const status = payload.view.state.values.ixKfb["static_select-action"].selected_option.text.text;
  const priority = payload.view.state.values.q9e7D["static_select-action"].selected_option.text.text;
  const subject = payload.view.state.values.Y736l["plain_text_input-action"].value;

  //********************************************************************* */
  //*********** Store the extracted data in the submittedFormData variable

  submittedFormData = {
    contactName,
    accountName,
    status,
    priority,
    subject,
  };
  console.log("Submitted Data:", submittedFormData);
  console.log(submittedFormData.accountName);
  var caseUrl = "";
  console.log("hi");
  const { salesforceIntegration } = require("./salesforceCaseCreation");


  // ************************************************************************************
  // *********Extraction of caseCreatedUrl And CaseID**********************************
  // salesforceIntegration(submittedFormData)
  //   .then((caseCreatedUrl) => {
  //     console.log("a1", caseCreatedUrl);
  //     var regex = /\/([^/]+)$/;
  //     var match = regex.exec(caseCreatedUrl);
  //     var caseId = match[1];
  //     console.log(caseId); // This will print "5005g00000Ip8quAAA"


  //     // **************************** UPDATED MODAL AFTER SUBMIT ****************************
  //     // **************************************************************************************

  //     Promise.all([axios.post(
  //       "https://slack.com/api/views.update",
  //       {
  //         view_id: payload.view.id,
  //         view: {
  //           "type": "modal",
  //           "callback_id": "modal-identifier",
  //           "title": {
  //             "type": "plain_text",
  //             "text": "Case Created Succesfully",
  //             "emoji": true
  //           },
  //           "blocks": [
  //             {
  //               "type": "section",
  //               "block_id": "sectionBlockOnlyPlainText",
  //               "text": {
  //                 "type": "plain_text",
  //                 "text": "Case ID: ",
  //                 "emoji": true
  //               }
  //             },
  //             {
  //               "type": "section",
  //               "block_id": "sectionBlockWithLinkButton",
  //               "text": {
  //                 "type": "mrkdwn",
  //                 "text": "Click on button to view created case"
  //               },
  //               "accessory": {
  //                 "type": "button",
  //                 "text": {
  //                   "type": "plain_text",
  //                   "text": caseId,
  //                   "emoji": true
  //                 },
  //                 "value": "click_me_123",
  //                 "url": caseCreatedUrl,
  //                 "action_id": "button-action"
  //               }
  //             }
  //           ]
  //         }
  //       },
  //       {
  //         headers: {
  //           "Authorization": `Bearer ${slackBotToken}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     )
  //       .then(response => {
  //         console.log("New Modal opened:", response.data);
  //         // response.status(200).send({});
  //       })
  //       .catch(error => {
  //         console.error("Error opening new modal:", error);
  //         res.status(500).json({ error: "Failed to open new modal" });
  //       }),

  //     ], () => { return res.status(200).send({}) });
  //     return;
  //   })
  //   .catch((error) => {
  //     console.error("Error:", error);
  //   });

  const caseCreatedUrl = await salesforceIntegration(submittedFormData)
  console.log(caseCreatedUrl)

  var regex = /\/([^/]+)$/;
  var match = regex.exec(caseCreatedUrl);
  var caseId = match[1];
  console.log(caseId);

  const data = await axios.post(
    "https://slack.com/api/views.update",
    {
      view_id: payload.view.id,
      view: {
        "type": "modal",
        "callback_id": "modal-identifier",
        "title": {
          "type": "plain_text",
          "text": "Case Created Succesfully",
          "emoji": true
        },
        "blocks": [
          {
            "type": "section",
            "block_id": "sectionBlockOnlyPlainText",
            "text": {
              "type": "plain_text",
              "text": "Case ID: ",
              "emoji": true
            }
          },
          {
            "type": "section",
            "block_id": "sectionBlockWithLinkButton",
            "text": {
              "type": "mrkdwn",
              "text": "Click on button to view created case"
            },
            "accessory": {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": caseId,
                "emoji": true
              },
              "value": "click_me_123",
              "url": caseCreatedUrl,
              "action_id": "button-action"
            }
          }
        ]
      }
    },
    {
      headers: {
        "Authorization": `Bearer ${slackBotToken}`,
        "Content-Type": "application/json; charset=utf-8",
      },
    }
  )
  console.log(data)
  res.status(200).send({})
});

// res.status(200).send({
//   "type": "modal",
//   "callback_id": "modal-identifier",
//   "title": {
//     "type": "plain_text",
//     "text": "My App",
//     "emoji": true
//   },
//   "blocks": [
//     {
//       "type": "section",
//       "block_id": "sectionBlockOnlyPlainText",
//       "text": {
//         "type": "plain_text",
//         "text": "Case ID updated",
//         "emoji": true
//       }
//     },
//     {
//       "type": "section",
//       "block_id": "sectionBlockOnlyFields",
//       "fields": [
//         {
//           "type": "plain_text",
//           "text": caseCreatedUrl,
//           "emoji": true
//         }
//       ]
//     }
//   ]
// });


// ********************* PORT ***************
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
