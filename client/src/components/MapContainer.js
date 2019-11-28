import React, {Component} from 'react';
import {Map,GoogleApiWrapper,Marker} from 'google-maps-react';


export class MapContainer extends Component{
  constructor(){
      super();
      this.state={
        coordinations:{latitude:'',longitude:''}
      }
  }

  componentDidMount(){
    this.setState({coordinations:this.props.coords})
  }

  componentDidUpdate(prevProps,prevState){
    if(prevProps.coords!==this.props.coords){
        this.setState({coordinations:this.props.coords})
    }
  }

  logout(){
    this.props.logout();
  }

  render(){
    const mapStyles={
     // marginTop:"10px",
      width:"400px",
      height:"400px",
      zIndex:"3"
    }
      return(<div className="map"  >
      <div style={{padding:"5px"}}>
      <img src={this.props.url} alt="profile image" width="40px" height="40px" />
      <span style={{marginLeft:"10px"}}>{this.props.user}</span>
      <a href="#" style={{float:"right"}} onClick={this.logout.bind(this)}>Logout</a></div>
      <div  >
      <Map google={this.props.google} zoom={15} style={mapStyles} center={{lat:`${this.state.coordinations.latitude}`, lng:`${this.state.coordinations.longitude}`}}  >
      <Marker position={{lat:`${this.state.coordinations.latitude}`,lng:`${this.state.coordinations.longitude}` }} />
      </Map>
      </div>      
      </div>)
  }
}

export default GoogleApiWrapper({
  apiKey:'AIzaSyAPAqRsMq537MKfdmzQIvJye63ghOS9aYY'
})(MapContainer);

