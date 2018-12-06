import React, {Component} from 'react';
import Connect from '../views/Connect';
import Transfer from '../views/Transfer';
import Waiting from '../views/Waiting';
import EthereumIdentitySDK from 'universal-login-sdk';
import {utils, providers, Wallet, Contract} from 'ethers';
import Clicker from '../../abi/Clicker';
import config from '../../config/config';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {view: 'connect'};
    this.provider = new providers.JsonRpcProvider(config.jsonRpcUrl);
    this.sdk = new EthereumIdentitySDK(config.relayerUrl, this.provider);
    this.clickerContractAddress = config.clickerContractAddress;
    this.tokenContractAddress = config.tokenContractAddress;
    this.clickerContract = new Contract(
      this.clickerContractAddress,
      Clicker.interface,
      this.provider
    );
  }

  async update(event) {
    const {value} = event.target;
    this.setState({value});
  }

  onChange(event) {
    const {value} = event.target;
    this.setState({to: value});
  }

  onCancelClick() {
    this.subscription.remove();
    this.setState({view: 'connect'});
  }

  async onKlickClick() {
    const message = {
      to: this.clickerContractAddress,
      from: this.contractAddress,
      value: 0,
      data: new utils.Interface(Clicker.interface).functions.press.encode([]),
      gasToken: this.tokenContractAddress,
      gasPrice: 110000000000000,
      gasLimit: 1000000

    };
    await this.sdk.execute(message, this.privateKey);
  }

  async onNextClick() {
    const name = `${this.state.value}`;
    const contractAddress = await this.sdk.identityExist(name);
    this.contractAddress = contractAddress;
    this.identity = {name};
    if (contractAddress) {
      this.setState({view: 'waiting'});
      const privateKey = await this.sdk.connect(contractAddress);
      this.privateKey = privateKey;
      this.state.view === 'transfer';
      const {address} = new Wallet(this.privateKey);
      const filter = {contractAddress, key: address};
      this.subscription = this.sdk.subscribe('KeyAdded', filter, () => {
        this.identity = {
          name,
          privateKey: this.privateKey,
          address: contractAddress
        };
        this.setState({view: 'transfer'});
      });
    } else {
      alert(`Identity ${name} does not exist.`);
    }
  }

  async componentDidMount() {
    if (await this.sdk.start()) {
      this.emitter.emit('setView', 'MainScreen');
    }
  }

  componentWillUnmount() {
    this.subscription.remove();
    this.sdk.stop();
  }

  render() {
    if (this.state.view === 'connect') {
      return (<Connect onChange={this.update.bind(this)} onNextClick={this.onNextClick.bind(this)}/>);
    } if (this.state.view === 'transfer') {
      return (<Transfer onChange={this.onChange.bind(this)} onClick={this.onKlickClick.bind(this)}/>);
    } if (this.state.view === 'waiting') {
      return (<Waiting identity={this.identity} onCancelClick={this.onCancelClick.bind(this)}/>)
    }
  }
}


export default App;
