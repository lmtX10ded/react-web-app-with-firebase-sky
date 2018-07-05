import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import firebase from './firebase.js'

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentItem: '',
      username: '',
      items:[]
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
  this.setState({
    [e.target.name]: e.target.value
  });
}
handleSubmit(e) {
  e.preventDefault();
  const itemsRef = firebase.database().ref('items');
  const item = {
    title: this.state.currentItem,
    user: this.state.username
  }
  itemsRef.push(item);
  this.setState({
    currentItem: '',
    username: ''
  });
  itemsRef.on('value', (snapshot) => {
    console.log(snapshot.val());
  });
}
removeItem(itemId) {
  const itemRef = firebase.database().ref(`/items/${itemId}`);
  itemRef.remove();
}
componentDidMount() {
  const itemsRef = firebase.database().ref('items');
  itemsRef.on('value', (snapshot) => {
    let items = snapshot.val();
    let newState = [];
    for (let item in items) {
      newState.push({
        id: item,
        title: items[item].title,
        user: items[item].user
      });
    }
    this.setState({
      items: newState
    });
  });
}
  render() {
    return (
      <div className='container-fluid'>

        <div className='row'>
            <div className='col'>
              {<h1 className='txt-ctr'>Notes</h1>}
            </div>
        </div>

        <div className='container'>

          <div className='row'>
              <div className='col'></div>
                <div className='col-md col-sm-12 p-050'>
                  <div className='border-gray-lightest-1 radius-5 p-100'>
                      <form onSubmit={this.handleSubmit}>
                        <input type="text" name="username" placeholder="Heading" onChange={this.handleChange} value={this.state.username} className='w-100 my-100 txt-black border-btm-gray-lightest-1' />
                        <input type="text" name="currentItem" placeholder="Content" onChange={this.handleChange} value={this.state.currentItem} className='w-100 my-100 txt-black border-btm-gray-lightest-1' />
                        <button className='btn-default btn-black'>Add Item</button>
                      </form>
                  </div>
            </div>
            <div className='col'></div>
          </div>

          <div className='row'>
          {this.state.items.map((item) => {
            return (
            <div className="col-md-4 col-sm-12 p-050">
              <div className='border-gray-lightest-1 radius-5 p-050'>
                      {/*item.id*/}
                      {/*<p><b>{item.user}</b>&#39;s flight name is: {item.title}</p>*/}
                      <p className='border-btm-gray-lightest-1 txt-ctr pb-050'><b>{item.user}</b></p>
                      <p className='py-025'>{item.title}</p>
                      <button className='mt-100 btn-default btn-gray-lightest' onClick={() => this.removeItem(item.id)}>Remove</button>
              </div>
            </div>
            )})}
          </div>

        </div>

      </div>
    );
  }
}
export default App;
