import React, { Component } from "react";
import axios from "axios/index";
import Message from "./Message"
import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';


// create global Cookie object created when chatbot is opened
const cookies = new Cookies();

//define Chatbot class component
//using components becuse it allow states
//states are values that change over time
class Chatbot extends Component{
    messagesEnd;
    //constructor
    //set the inital state in constructor
    constructor(props){
        super(props);
        //bind 'this' to handle keypress
        // This binding is necessary to make `this` work in the callback
      //  this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
        this._handleKeyPress = this._handleKeyPress.bind(this);  
       
      //set initial state of chatbot messages
        this.state = {
        messages: [],
        };

        //add unique id generator to cookie
        if (cookies.get('userID') === undefined) {
            cookies.set('userID', uuid(), { path: '/' });
        }
    
        console.log(cookies.get('userID'));
    }
    //service methods to send HTTP request to backend route handlers
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
        
        //make http post request using axios httpclient 
        //to backend 
        //backend will send request to dialogflow
        //also sending the cookie id to back end 
      
        //cookie userid will be used to create a dialogflow session
        //get response back from dialogflow
      // const res = await axios.post('/api/df_text_query',  {text: queryText});
       const res = await axios.post('/api/df_text_query',  {text: queryText, userID: cookies.get('userID')});
 
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

        //const res = await axios.post('/api/df_event_query',  {event: eventName});
        const res = await axios.post('/api/df_event_query',  {event: eventName, userID: cookies.get('userID')});

        for (let msg of res.data.fulfillmentMessages) {
            let says = {
                speaker: 'bot',
                msg: msg
            }

            this.setState({ messages: [...this.state.messages, says]});
        }
    };
    
  //mount bots welcome message
    componentDidMount() {
     
        //add message that from bot to state object
        let says = {
            speaker: "bot",
            msg: {
                text: {
                    text: "Hello!!. I am the bot. How can help you?"
                }
            }
        };
        //append the bot and message to state
        this.setState({messages: [...this.state.messages, says]});
        this.setState({userquery: ''});
    }
    //allow
    componentDidUpdate() {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }
    //render messages from messages in message tag
    //pass in message array
    renderMessages(stateMessages){
        if (stateMessages) {
            return stateMessages.map((message, i) => {
                    
                    return <Message key = {i} speaker={message.speaker} text={message.msg.text.text}/> ;
                });
           
        } else {
            return null;
        }

       
    }
   

    //key press event handling 
    _handleKeyPress(e){
        //if key is enter
        if(e.key === 'Enter'){
            //call service method to process text 
            this.df_text_query(e.target.value);
            //then clear text
           e.target.value = '';
        }
    }
  
   

    render(){
        return(
            <div style = {{height: 400, width: 400, float: 'right'} }> 
                 <h4 className="card-panel teal lighten-2">Chat</h4>
                <div id = "chatbot" style = {{ minHeight: 388, maxHeight: 388, width: '100%', overflow: 'auto'}}>
                    {this.renderMessages(this.state.messages)}
                    <div ref={(el) => { this.messagesEnd = el; }}
                         style={{ float:"left", clear: "both" }}>
                    </div>
                    <input type="text" name="userinput" className ="card-panel blue lighten-5" placeholder = 'Enter message ...' onKeyPress = {this._handleKeyPress} ></input>
                </div>
            </div>
               
        )
    }
}

export default Chatbot;