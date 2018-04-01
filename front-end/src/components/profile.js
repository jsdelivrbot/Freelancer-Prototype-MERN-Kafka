import React, {Component} from 'react';
import * as API from '../APIs/api';
import { checkSession } from '../actions/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Profile extends Component {
    constructor(props){
        super(props);
        this.state = {
            imageURL: '',
            message: '',
            isEditable: false
          };
        this.handleClick = this.handleClick.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
       console.log(this.props.checkSession());
        this.props.checkSession().then((res)=> {
            console.log(res);
            if(!this.props.isLoggedin || (this.props.match.params.user !== this.props.user)){
                this.props.history.push('/login');
            }
        });
        
    }

    handleUpload(){
        const data = new FormData();
        data.append('file', this.uploadInput.files[0]);
        data.append('filename', this.props.user);
        API.upload(data).then((response) => {
            response.json().then((body) => {
              this.setState({ imageURL: `http://localhost:3001/${body.file}` });
            console.log(body);
            });
          });
    }

    handleClick(){
        API.logout().then((res) => {
           if(res.status === 200){
            this.props.history.push('/login');
           }
        })
    }

    handleEdit(){
        this.setState({
            isEditable: !this.state.isEditable
        });
        setTimeout(()=> {
            if(this.state.isEditable) {
                document.getElementById('edit-profile').innerHTML = "View Profile"
            } else {
                document.getElementById('edit-profile').innerHTML = "Edit Profile"
            }
        }, 10);        
    }


    handleSubmit(event){
        event.preventDefault();
        API.updateProfile(this.refs.fname.value, 
                          this.refs.lname.value, 
                          this.refs.country.value, 
                          this.refs.location.value, 
                          this.refs.phone.value
                        ).then((response) => {
                            response.json().then((body) => {
                              this.setState({ message: 'Profile updated' });
                            });
                          });
    }

    render(){
        console.log(this.props);
        return(
            <div id= "profile">
                <h1>Hello, {this.props.match.params.user}</h1>
                <button className="menu-button" id="logout" onClick={this.handleClick} > Logout </button>
                <button className="menu-button" id="edit-profile" onClick={this.handleEdit} > Edit Profile </button>
                <div id="profile-picture"> 
                    <input ref={(ref) => {this.uploadInput = ref;}} type="file" />
                    <img id="pic" src={this.state.imageURL} alt="img" />
                </div>
                <button id="upload-button" onClick={this.handleUpload}> 
                    Upload
                </button>
                <form className="profile-form" onSubmit={this.handleSubmit}>
                    <div id="fields"> 
                        <label> First Name </label> <br/>
                        <input type="text" ref="fname" placeholder="First Name" /><br/>
                        <label> Last Name </label><br/>
                        <input type="text" ref="lname" placeholder="Last Name" /><br/>
                        <label> Location </label><br/>
                        <input type="text" ref="location" placeholder="Location" /><br/>
                        <label> Country </label><br/>
                        <input type="text" ref="country" placeholder="Country" /><br/>
                        <label> Phone Number </label><br/>
                        <input type="text" ref="phone" placeholder="Phone Number" />
                    </div>
                    <input type="submit" />
                </form>
                <p id="update-response"> {this.state.message} </p>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {  
        isLoggedin: state.session.isLoggedin,
        user: state.session.user
    };
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({ 
            checkSession: checkSession
        }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile); 

