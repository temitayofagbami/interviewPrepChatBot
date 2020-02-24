import React, { Component } from "react";
import axios from "axios/index";
import Message from "./Message";
import Card from "./Card";
import QuickReplies from './QuickReplies';
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
        //bind 'this' to handle keypress and quick replies
        // This binding is necessary to make `this` work in the callback
        this._handleKeyPress = this._handleKeyPress.bind(this);  
        this._handleQuickReplyPayload = this._handleQuickReplyPayload.bind(this);
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
    //renders card response
    renderCards(cards) {
        return cards.map((card, i) => <Card key={i} payload={card.structValue}/>);
    }
//render a message
//handles reponse for renderMessages and rendercards and quick replies
    renderOneMessage(message, i){
        if (message.msg && message.msg.text && message.msg.text.text) {
            return <Message key={i} speaker={message.speaker} text={message.msg.text.text}/>;
        } else if (message.msg && message.msg.payload.fields.cards) { //message.msg.payload.fields.cards.listValue.values

            return <div key={i}>
                <div className="card-panel grey lighten-5 z-depth-1">
                    <div style={{overflow: 'hidden'}}>
                        <div className="col s2">
                            <a href="/" className="btn-floating btn-large waves-effect waves-light red">{message.speaker}</a>
                        </div>
                        <div style={{ overflow: 'auto', overflowY: 'scroll'}}>
                            <div style={{ height: 300, width:message.msg.payload.fields.cards.listValue.values.length * 270}}>
                                {this.renderCards(message.msg.payload.fields.cards.listValue.values)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             } else if (message.msg &&
                message.msg.payload &&
                message.msg.payload.fields &&
                message.msg.payload.fields.quick_replies
            ) {
                return <QuickReplies
                    text={message.msg.payload.fields.text ? message.msg.payload.fields.text : null}
                    key={i}
                    replyClick={this._handleQuickReplyPayload}
                    speaker={message.speaker}
                    payload={message.msg.payload.fields.quick_replies.listValue.values}/>;
        }
    
    }
    //render messages from messages in message tag
    //pass in message array
    renderMessages(stateMessages){
        if (stateMessages) {
            return stateMessages.map((message, i) => {
             return this.renderOneMessage(message, i);
            
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
    //quick replies payload event handling
    _handleQuickReplyPayload(event, payload, text) {
        event.preventDefault();
        event.stopPropagation();
        //call service method to process text
        this.df_text_query(text);

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