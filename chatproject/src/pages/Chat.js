import React, { Component } from "react";
import Header from "../components/Header";
import { auth } from "../helpers/auth";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { firestore } from '../services/firebase'


export default class Chat extends Component {
    constructor(props) {
      super(props);
      this.state = {
        user: auth.currentUser,
        chats: [],
        content: '',
        readError: null,
        writeError: null,
        loadingChats: false
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.myRef = React.createRef();
    }

    async componentDidMount() {
        const chatCollection = collection(firestore, "chats");
        const chatQuery = query(chatCollection, orderBy("timestamp"));
    
        try {
          const unsubscribe = onSnapshot(chatQuery, (querySnapshot) => {
            const chats = [];
            querySnapshot.forEach((doc) => {
              chats.push(doc.data());
            });
            this.setState({ chats });
            const chatArea = this.myRef.current;
            chatArea.scrollBy(0, chatArea.scrollHeight);
            this.setState({ loadingChats: false });
          });
    
          // Unsubscribe when the component unmounts to avoid memory leaks
          return () => unsubscribe();
        } catch (error) {
          this.setState({ readError: error.message, loadingChats: false });
        }
      }
      

      handleChange(event) {
        this.setState({
          content: event.target.value
        });
      }
    
      async handleSubmit(event) {
        event.preventDefault();
        this.setState({ writeError: null });
        const chatCollection = collection(firestore, "chats");
    
        try {
          await addDoc(chatCollection, {
            content: this.state.content,
            timestamp: new Date(),
            uid: this.state.user.uid,
          });
    
          this.setState({ content: "" });
        } catch (error) {
          this.setState({ writeError: error.message });
        }
      }
      

      formatTime(timestamp) {
        const d = new Date(timestamp);
        const time = `${d.getDate()}/${(d.getMonth()+1)}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
        return time;
      }

      render() {
        return (
          <div>
            <Header />
    
            <div className="chat-area" ref={this.myRef}>
              {/* loading indicator */}
              {this.state.loadingChats ? <div className="spinner-border text-success" role="status">
                <span className="sr-only">Loading...</span>
              </div> : ""}
              {/* chat area */}
              {this.state.chats.map(chat => {
                return <p key={chat.timestamp} className={"chat-bubble " + (this.state.user.uid === chat.uid ? "current-user" : "")}>
                  {chat.content}
                  <br />
                  <span className="chat-time float-right">{this.formatTime(chat.timestamp)}</span>
                </p>
              })}
            </div>
            <form onSubmit={this.handleSubmit} className="mx-3">
              <textarea className="form-control" name="content" onChange={this.handleChange} value={this.state.content}></textarea>
              {this.state.readError ? <p className="text-danger">{this.state.readError}</p> : null}
              <button type="submit" className="btn btn-submit px-5 mt-4">Send</button>
            </form>
            <div className="py-5 mx-3">
              Login in as: <strong className="text-info">{this.state.user.email}</strong>
            </div>
          </div>
        );
      }
    }