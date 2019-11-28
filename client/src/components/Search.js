import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Panel from './Panel';





class Search extends Component {
    constructor() {
        super();
        this.state = {
            radius: 10,
            location: '',
            info: [],
            loginStatus: false,
        }
        //this.toggle=React.createRef()
    }



    componentDidUpdate(prevProps, prevState) {
        // console.log(prevProps,prevState,this.props)//Object { status: false } Object { radius: 10, location: "", info: [], loginStatus: false }Object { status: true }
        if (prevProps.status !== this.props.status) {
            if (prevState.location == '') {
                this.state.loginStatus = !this.state.loginStatus;
            } else {
                this.state.loginStatus = !this.state.loginStatus;
                this.update()
            }


        }
    }
   

    change(e) {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value })
    }

    update() {
        const { location, radius } = this.state
        axios.get(`/api/business/search?location=${location}&radius=${radius}`)
            .then((res) => {
                //console.log(res.data)
                this.setState({ info: res.data.businesses })
            })
            .catch((err) => {
                alert(err.response.data)
            })
    }

    search(e) {
        e.preventDefault();
        const { location, radius } = this.state
        axios.get(`/api/business/search?location=${location}&radius=${radius}`)
            .then((res) => {
                console.log(res.data)
                this.setState({ info: res.data.businesses })
            })
            .catch((err) => {
                alert(err.response.data)
            })
    }


    render() {
        
        return (<div className="search">
            <h2  >Search</h2>
            <form className="searchForm">
                <label>Search By Location:</label>
                <input type='text' name="location" id="location" onChange={this.change.bind(this)} />
                <label>Radius(mile):</label>
                <input type='Number' name="radius" id="radius" defaultValue="10" onChange={this.change.bind(this)} />
                <button type="submit" onClick={this.search.bind(this)}><FontAwesomeIcon icon={faSearch} size="1x" ></FontAwesomeIcon></button>
            </form>
            <div className="display">
                {this.state.info.map((item, index) => {
                    return (
                        <div key={index} >
                                <Panel user={this.props.user} status={this.state.loginStatus} item={item} index={index} location={this.props.location} />                           
                        </div>)
        })}
            </div>
        </div >)
    }
}

export default Search;

