import React, { Component } from "react";
import axios from "axios/index";
import Message from "./Message"

//define Chatbot class component
//using components becuse it allow states
//states are values that change over time
class Chatbot extends Component{
    //constructor
    //set the inital state in constructor
    constructor(props){
        super(props);

        //set initial state of chatbot messages
        this.state = {
        messages: []
        };
    }
    //service methods to send http request to backend route handlers
    async df_text_query(queryText){
        //add message that from user to state object
        let says = {
            speaker: "user",
            msg: {
                text: {
                    text: queryText
                }
            }
        };
        //append this user and message to state
        this.setState({messages: [...this.state.messages, says]});
        //make http post request with httpclient 
        //get response
        const res = await axios.post('/api/df_text_query',  {text: queryText});
        //deserialize response fufilmentmessages
        ////append this bot and message to state
        for (let msg of res.data.fulfillmentMessages) {
            let says = {
                speaker: 'bot',
                msg: msg
            }
            this.setState({messages: [...this.state.messages, says]});
        }
    }
     //service methods to send event query request 
     async df_event_query(eventName) {

        const res = await axios.post('/api/df_event_query',  {event: eventName});
        for (let msg of res.data.fulfillmentMessages) {
            let says = {
                speaker: 'bot',
                msg: msg
            }

            this.setState({ messages: [...this.state.messages, says]});
        }
    };
    
//mount
componentDidMount() {
    this.df_text_query('Welcome to bot');
}
    //render messages from messages in message tag
    //pass in message array
    renderMessages(stateMessages){
        if (stateMessages) {
            return stateMessages.map((message, i) => {
                    return <Message key = {i} speaker={message.speaker} text={message.msg.text.text}/>;
                });
           
        } else {
            return null;
        }
    }

    render(){
        return(
            <div style = {{height: 400, width: 400, float: 'right'}}>
                <div id = "chatbot" style = {{height: '100%', width: '100%', overflow: 'auto'}}>
                    <h3>Chatbot is here</h3>
                    {this.renderMessages(this.state.messages)}
                    <input type="text" name="userinput" className ="card-panel blue lighten-5"></input>
                    </div>
                </div>
        )
    }
}

export default Chatbot;