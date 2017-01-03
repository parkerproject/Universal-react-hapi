import React, { Component } from 'react';
import Header from '../components/Header';
// import Radium, { Style } from 'radium';


class App extends Component {

	componentWillMount() {

	}

	componentDidUpdate() {

	}

	render() {
		return (
  <div>
    <Header />
    {this.props.children}
  </div>
		);
	}
}

export default App;
