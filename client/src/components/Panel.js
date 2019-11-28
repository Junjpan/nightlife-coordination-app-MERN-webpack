import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client';




export class Panel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            viewpanel: false,
            message: "",
            comments: [],
            chatpanel: false,
            text: '',
            chatOutput:[],
            leaveChatRoom:false,
            client:{}
        }  
   
    }

    
    componentDidUpdate(prevProps,prevState){
//if logout, the chat room is closed
        if(prevProps.status!==this.props.status){
            this.setState({chatpanel:false})
        }
    }


    getLocation(item) {
        this.props.location(item.coordinates)
    }

    joinChatRoom() {
        this.setState({ chatpanel: true});
        const client=io();//const client=io('localhost:5000') when you run in localhost with two different server
    this.setState({client:client})        
        client.on('connect',()=>{
            var data={
                room:this.props.item.id,
                user:this.props.user
            }
            client.emit('join room',data)
        });

        client.on('join room',(data)=>{
            this.setState({chatOutput:[...this.state.chatOutput,data]})
        })

        client.on('leave room',(data)=>{
            this.setState({chatOutput:[...this.state.chatOutput,{user:data.user,message:data.message}]})
        })

        client.on('chatmessage',(data)=>{         
            this.setState({chatOutput:[...this.state.chatOutput,{user:data.user,message:data.message}]})
        })  


   
    }

    submitMsg(e) {
        e.preventDefault(); 
        const client=this.state.client;
        var chatMessage={
            user:this.props.user,
            message:this.state.text,
            room:this.props.item.id,
        }
        
        client.emit('chatmessage',chatMessage);

    }


    leaveChatRoom() {
        const client=this.state.client;

        
        var   data={
            room:this.props.item.id,
            user:this.props.user
        }
        client.emit('leave room',data)
        this.setState({chatpanel:false,
            chatOutput:[]})

    }

    leaveComment(id) {
        var comment = prompt('Please leave a comment:')
        axios.post(`/api/bar/comments/${id}`, { comments: comment, user: this.props.user })
            .then((res) => { console.log(res.data) })
            .catch((err) => {
                console.log(err)
            })
    }

    viewComments(id) {
        console.log(id)
        axios.get(`/api/bar/comments/${id}`)
            .then((res) => {
                console.log(res.data);
                this.setState({
                    message: res.data.message,
                    viewpanel: true,
                    comments: res.data.comments ? res.data.comments : []
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return() {
        this.setState({ viewpanel: false })
    }

    change(e) {
        e.preventDefault();
        this.setState({ text: e.target.value })
    }
    //submit chat message 
   
//
    render() {
        const viewpanel = (<div style={{ textAlign: "left", marginLeft: "10px", height: "310px", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><p style={{ color: "red" }}>{this.state.message}</p><button onClick={this.return.bind(this)} style={{ height: "25px", marginRight: "10px", background: "black", color: "white" }}>Return</button></div>
            <div>{this.state.comments.map((comment,index) => (<p key={index}>{comment.comments}&nbsp;-&nbsp;{comment.user}&nbsp;on&nbsp;{comment.date}</p>))}</div>
        </div>)

        const { item, index } = this.props;
//ref={`leave${this.props.index}`}
        return (
            <div className="item" style={{ display: "flex" }}>
                <div className="chatroom">
                    {this.state.chatpanel ? (<div style={{ overflow: "auto",background: "black", height: "310px" }}>
                        <button  id="leaveBTN" onClick={this.leaveChatRoom.bind(this)} style={{ height: "25px", background: "black", width: "70px", color: "white" }}>Leave</button>
                        <p style={{ fontSize: "10px", color: "white" }}>Note:Messages will be deleted as soon as you leave the chat room.Please don't share any private information here. You are soley responsible for any content post to the chat room.</p>
                        <div id="output" style={{fontSize:"12px"}}>{this.state.chatOutput.map((msg,index)=>(
                            <p key={index}><span style={{color:"blue"}}>{msg.user}</span>:{msg.message}</p>
                        ))}</div>
                        <form >
                            <div style={{display:"flex",justifyContent:"center"}}>
                            <input type="text" placeholder="Input message" name="message" id="message" onChange={this.change.bind(this)}></input>
                            <input  id="chatbutton" type="submit" onClick={this.submitMsg.bind(this)} value="Send" />
                            </div>
                        </form>
                    </div>) : <img className="itemImage" src={item.image_url} alt={item.name} width="100%" height="310px"></img>}
                </div>

                <div className="view">
                    {this.state.viewpanel ? viewpanel : (<div>
                        <b>{index + 1}.</b>&nbsp;{this.state.loginStatus ? (<b><a href={item.url} target="_blank">{item.name}</a></b>) : (<b>{item.name}</b>)}<br /><br />
                        <span style={{ color: "red" }}>{item.is_closed ? "Close" : "Open"}</span><br />
                        <i style={{ color: "white" }}>{item.categories.map((category, i) => { return (<p key={i} style={{ display: "inline" }}>{i == (item.categories.length - 1) ? category.title : category.title + ','}</p>) })}</i><br />
                        <span>Phone Number: {item.display_phone}</span><br />
                        <span>Address: {item.location.display_address[0] + item.location.display_address[1]}</span><br />
                        <span style={{ color: "blue" }}>Rating: {item.rating} stars</span><br />
                        <span>Distance:{Math.floor(item.distance / 1609.34)}&nbsp;miles<br /></span>
                        <button onClick={this.viewComments.bind(this, item.id)} style={{ height: "25px", background: "rgb(63, 133, 143)", width: "150px", color: "white" }}>View Comments</button>
                        {this.props.status ? (<div >
                            <button onClick={this.leaveComment.bind(this, item.id)} style={{ height: "25px", background: "black", width: "150px", color: "red" }}>Leave a Comment</button>
                            <div style={{ display: "flex", flexWrap: "wrap" }}>
                                <button onClick={this.getLocation.bind(this, item)} style={{ height: "25px", background: "black", color: "white", width: "100px" }}>Direction</button>
                                <button onClick={this.joinChatRoom.bind(this)} style={{ height: "25px", background: "black", width: "200px", color: "white" }}>Join the Chat Room</button>
                            </div></div>) : null}</div>)}
                </div>
            </div>
        )
    }
}

export default Panel
