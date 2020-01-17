//import dialogflow configuration
//chat text response from dialogflow
const chatbot = require('../chatbot/chatbot');

module.exports = app =>{

    //route handlers, add callback fn
    
    //route to get dummy data
    app.get('/', (req, res)=>{
        res.send({'hello' :'john'})
        });

    app.get('/api/intents', (req, res)=>{
        res.send({'hello' :'peter'})
        });
        
    //routes to send request to dialogflow
    
    //text query request
    app.post('/api/df_text_query', async (req, res)=>{

        let responses = await chatbot.textQuery(req.body.text, req.body.parameters);
        //res.send(responses[0].queryResult);
        res.send(responses);
          
        });
        
        //event query requests
        app.post('/api/df_event_query', (req, res)=>{
            res.send({'do' :'event query'})
        });

}