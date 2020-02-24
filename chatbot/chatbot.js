 
'use strict'
//import diagflow module
const dialogflow = require('dialogflow'); 
//import  config file to get configuration  paramaeters(googleprojectID, diaflowagentsessionid) for session path
const config = require('../routes/config/key'); 
//import mongoose
const mongoose = require('mongoose');
//import Registration
require('../models/Registration');
//register Registration model
const Registration = mongoose.model('registration');

// Instantiate a DialogFlow client.
const sessionClient = new dialogflow.SessionsClient();
//define session path with parameters from config file and userID from cookie
//const sessionPath =  sessionClient.sessionPath(config.googleProjectID, config.dialogFlowSessionID + userID);



//chat bot text query function
//take text from chatbot , create request and returns response
module.exports = {
textQuery: async function(text, userID, parameters){
    //define session path with parameters from config file and userID from cookie
    let sessionPath =  sessionClient.sessionPath(config.googleProjectID, config.dialogFlowSessionID + userID);
    let self = module.exports;

    //create the  request to be send to dialogflow
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
            text: text, //query to be send to dialogflow
            languageCode: config.dialogFlowSessionLanguageCode,
            },
        },

        //takes in parameters from chat bot
        queryParams:{
            payload: {
                data : parameters
            }
        }
     };
    
   
    // Send request and log result

     let responses = await sessionClient
        .detectIntent(request);

    responses =  await self.handleAction(responses);
    
    return responses;
    },
//fn to handle responses
    handleAction : function(responses){
        return responses;
    },

    //fn to save registration in db
    saveRegistration: async function(fields){

        //create a registration object
        //pass user registation details 
        const registration =  new Registration({
            name: fields.name.stringValue,
            address: fields.address.stringValue,
            phone: fields.phone.stringValue,
            email: fields.email.stringValue,
            registerDate: Date.now()
        });
        //save the user registration in db
        try{
            let reg = await registration.save();
            console.log(reg);
        } catch (err){
            console.log(err);
        }
    }

}




