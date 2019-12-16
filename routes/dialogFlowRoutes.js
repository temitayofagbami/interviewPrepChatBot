//import diagflow module
const dialogflow = require('dialogflow'); 
//import  config file to get configuration  paramaeters(googleid, diaflowagentsessionid) for session path from
const config = require('../config/keys'); 
//create a dialogflow client session
const sessionClient =  new dialogflow.sessionClient(); //initialize sessionclinet
//define session path with paraeters from config file
const sessionPath =  sessionClient.sessionPath(config.googleProjectID, config.dialogFlowSessionID);

module.exports = app =>{

    //route handlers, add callback fn
    app.get('/', (req, res)=>{
    res.send({'hello' :'there'})
        });
        
        //routes to send request to dialogflow
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

            res.send({'do' :'text query'})
        });
        
        app.post('/api/df_event_query', (req, res)=>{
            res.send({'do' :'event query'})
        });

}