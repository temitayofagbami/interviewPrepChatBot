const dialogflow = require('dialogflow');
const config = require('../routes/config/key'); 

const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(config.googleProjectID, config.dialogFlowSessionID);


module.exports = app => {

    app.get('/', (req, res) => {
        res.send({'hello': 'Johnny'})
    });

    app.get('/api/intents', (req, res)=>{
        res.send({'hello' :'peter'})
        });

    app.post('/api/df_text_query', async(req, res) => {

        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: req.body.text,
                    languageCode: config.dialogFlowSessionLanguageCode
                }
            }
        };
        
        try{
        let responses = await sessionClient
        .detectIntent(request);

    res.send(responses[0].queryResult)
        }
        catch(error){
            res.send({'err': error.message})
        }
        
    });
}