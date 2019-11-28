import React, { Component } from 'react';
import { Spring } from 'react-spring/renderprops';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons';
import FBLogin from 'react-facebook-login/dist/facebook-login-render-props';
import axios from 'axios';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            loginpanel: false,
            newmemberpanel: false,
            username: '',
            password: '',
            city: '',
            fbIsLoggedIn:false,
            fbUserId:'',
            fbName:"",
            fbEmail:""

        }
    }

    login() {
        this.setState({
            loginpanel: true,
            newmemberpanel: false
        })
    }

    Fblogin(){
        axios.get('/api/member/facebooklogin')
             .then((res)=>{
                 console.log(res.data)
             })
             .catch((err)=>{
                 console.log(err)
             })
    }

    loginForm(e) {
        e.preventDefault();
        const { username, password } = this.state
        //login
        axios.get(`/api/member/login`, {
            params: {//to retreive the date from the server side, we use req.query not req.params
                username: this.state.username,
                password: this.state.password
            }
        })
            .then((res) => {
                //console.log(res.data)
                this.props.getStatus({
                    loginuser: res.data.username,
                    latitude: res.data.latitude,
                    longitude: res.data.longitude
                })
            })
            .catch((err) => {
                alert(err.response.data)
            })
    }

    //axios post data function

    //register
    submitRegisterForm(e) {
        e.preventDefault(e);
        const { city, username, password } = this.state;
        //get register's location
        function post(info) {
            axios.post('/api/member/register', info)
                .then((res) => {
                    alert("You are registered!")
                    //this.setState({loginSatus:true})
                    this.setState({
                        loginpanel: true,
                        newmemberpanel: false
                    })
                })
                .catch((err) => {
                    alert(err.response.data)
                })
        }
        getLocation();
        //people allow to access the location
        function showLocation(position) {
            const { latitude, longitude } = position.coords
            const info = {
                city, username, password, latitude, longitude
            };
            post(info)
        }

        //people denied the request for geolocation
        function showErr(err) {
            const latitude='37.0902';
            const  longitude='-95.7129';
            if(err){
                const info={
                    city,username,password,latitude, longitude
                }
                post(info)
            }
        }


        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showLocation, showErr);
            } else {
                alert('Geolocation is not supported by this browser')
            }

        }
    }
    register(e) {
        this.setState({
            loginpanel: false,
            newmemberpanel: true
        })
    }
    change(e) {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value })
    }

    ComponentClicked(){
        console.log('clicked')
    }

    responseFacebook(res){
 //if receive response from facebook, login inside to the app       
        if(res){
            this.props.getStatus({
                loginuser: res.name,
                latitude: '36.7783',
                longitude: '-119.4179',
                url:res.picture.data.url
            })
        }
        
    }

    render() {
        return (<div className="login" style={{ position: "relative" }}>
            <h2>Login</h2>
            <div style={{ textAlign: "center" }}>
                <p>Already a Member? <a href="#" onClick={this.login.bind(this)}>Login Now</a></p>
                {this.state.loginpanel ? <Spring from={{ opacity: 0 }} to={{ opacity: 1 }} config={{ delay: 200, duration: 1500 }}>{props => (<div style={props}>
                    <form onSubmit={this.loginForm.bind(this)}>
                        <div className="loginform" style={{ display: "flex", justifyContent: "space-around" }}>
                            <div>
                                <label>Username: </label>
                                <input type="text" name="username" id="username" onChange={this.change.bind(this)}></input> <br />
                                <label>Password: </label>
                                <input type="password" name="password" id="name" onChange={this.change.bind(this)}></input> <br />
                            </div>
                            <button type="submit" style={{ height: "25px", background: "rgb(63, 133, 143)" }}>Login</button>
                        </div>
                    </form>
                    <div><FBLogin appId='424456618497337' autoLoad={false} fields='name,picture,email' onClick={this.ComponentClicked.bind(this)} callback={this.responseFacebook.bind(this)} render={renderProps=>(<button style={{ height: "28px", width: "50%", background: "rgb(63, 133, 143)" }} onClick={renderProps.onClick}>Login With FaceBook <FontAwesomeIcon icon={faFacebookSquare} size="1x" style={{ color: "blue" }}></FontAwesomeIcon></button>)}/></div>
                </div>)}</Spring> : null}
                <hr style={{ color: "gray" }} />
                <p>Not Yet a Member? <a href="#" onClick={this.register.bind(this)}>Register Here</a></p>
                {this.state.newmemberpanel ? <Spring from={{ opacity: 0 }} to={{ opacity: 1 }} config={{ delay: 200, duration: 1500 }}>{props => (<div style={props}>
                    <form onSubmit={this.submitRegisterForm.bind(this)}>
                        <div className="loginform" style={{ display: "flex", justifyContent: "space-around" }}>
                            <div style={{ textAlign: "right" }}>
                                <label>Username: </label>
                                <input type="text" name="username" id="username" onChange={this.change.bind(this)} pattern=".{6,15}" title="6 to 15 charachter minimum" required></input> <br />
                                <label>Password: </label>
                                <input type="password" name="password" id="name" onChange={this.change.bind(this)} pattern=".{8,}" title="8 characters minimum" required></input> <br />
                                <label>City: </label>
                                <input type="text" name="city" id="city" onChange={this.change.bind(this)} title="Please input the current city you live in" required></input><br />
                            </div>
                            <button type="submit" style={{ height: "25px", background: "rgb(63, 133, 143)" }}>Register</button>
                        </div>
                    </form>
                </div>)}</Spring> : null}
            </div>
            <sub style={{ color: "gray", position: "absolute", bottom: "5px", left: "25%" }}>Login to access more functions of the app</sub>
        </div>)
    }
}

export default Login;