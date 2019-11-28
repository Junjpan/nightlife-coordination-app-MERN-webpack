
import React, { Component } from "react";
import Login from './components/Login';
import Search from './components/Search';
import MapContainer from './components/MapContainer';
import axios from 'axios';

//set up a global axios defaults
//axios.defaults.baseURL="http://localhost:5000" only used when you open the app in localhost



class App extends Component {
    constructor(){
        super();
        this.state={
            loginStatus:false,
            loginuser:'',
            coordinates:{},
            url:'https://cdn.pixabay.com/photo/2016/11/14/17/39/person-1824144_960_720.png'
        }
    }

    getStatus(info){
     this.setState({loginStatus:true,
                    loginuser:info.loginuser,
                  coordinates:{latitude: info.latitude, longitude:info.longitude}})
      if(info.url){
          this.setState({url:info.url})
      }            
    }

    logout(){  
        this.setState({
            loginStatus:false,
            loginuser:''
        })
    }

    location(coords){
        console.log(coords)
        this.setState({coordinates:coords})
    }

   

    render() {
        return (<div className="container">
                <Search status={this.state.loginStatus} user={this.state.loginuser} location={this.location.bind(this)}/>
                {this.state.loginStatus?<MapContainer user={this.state.loginuser} url={this.state.url} coords={this.state.coordinates} logout={this.logout.bind(this)} coords={this.state.coordinates}/>:<Login getStatus={this.getStatus.bind(this)}/>}
                </div>
        )
    }


}

export default App