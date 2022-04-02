import React, {Component} from 'react';
import TopNav from './TopNav.js';
import Web3 from 'web3';
import './App.css'
import Main from './Main.js';
import {
    BrowserRouter as Router,
} from "react-router-dom";

class App extends Component {
    async componentWillMount() {
        await this.loadWeb3();
        
    }

    async loadWeb3() {
        if(window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        } else if(window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert('Non-Ethereum browser detected. Your should consider trying MetaMask!')
        }
    }
    render () {
        return (
            <div>
                <Router>
                    <TopNav />
                    <Main />
                </Router>
            </div>
        );
    }
}

export default App;