//import diagflow module
const dialogflow = require('dialogflow'); 
//import  config file to get configuration  paramaeters(googleprojectID, diaflowagentsessionid) for session path
const config = require('../routes/config/key'); 
// Instantiate a DialogFlow client.
const sessionClient = new dialogflow.SessionsClient();
//define session path with parameters from config file
const sessionPath =  sessionClient.sessionPath(config.googleProjectID, config.dialogFlowSessionID);

module.exports = app =>{

    //route handlers, add callback fn
    app.get('/', (req, res)=>{
    res.send({'hello' :'there'})
        });
        
    //routes to send request to dialogflow
    
    //text query request
    app.post('/api/df_text_query', (req, res)=>{
            //create the  request to be send to dialogflow
            const request = {
                session: sessionPath,
                queryInput: {
                    text: {
                    text: req.body.text, //query to be send to dialogflow
                    languageCode: config.dialogFlowSessionLanguageCode,
                    },
                },
             };
            // Send request and log result
             sessionClient
             .detectIntent(request)
             .then(responses => {
                 console.log('Detected intent');
                 const result = responses[0].queryResult;
                 console.log(`  Query: ${result.queryText}`);
                 console.log(`  Response: ${result.fulfillmentText}`);
                 if (result.intent) {
                     console.log(`  Intent: ${result.intent.displayName}`);
                 } else {
                     console.log(`  No intent matched.`);
                 }
             })
             .catch(err => {
                 console.error('ERROR:', err);
             });
            res.send({'do' :'text query'})
        });
        
        //event query requests
        app.post('/api/df_event_query', (req, res)=>{
            res.send({'do' :'event query'})
        });

}