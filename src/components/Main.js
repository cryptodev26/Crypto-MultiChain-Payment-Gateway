import {  Button, InputGroup, FormControl,  Tabs, Tab, Card} from 'react-bootstrap';
import { RPCURL, usdcTokenAddress, wethAddress, DaiTokenAddress, walletPrivateKey, walletAddress, tokenABI, routerABI, routerAddress } from '../components/config';
import Web3 from 'web3';
import React from 'react';
const ethers = require('ethers')

const web3     = new Web3(new Web3.providers.HttpProvider(RPCURL));
const usdcTokenContract =  new web3.eth.Contract(tokenABI, usdcTokenAddress);
const daiTokenContract  =  new web3.eth.Contract(tokenABI, DaiTokenAddress)
const routerContract = new web3.eth.Contract(routerABI, routerAddress);



class Main extends React.Component {
    constructor(props){
        super(props)
        this.state={
            account             : [],
            linkedContract      : [],
            linkedAddress       : '',
            usdcBalance         :  0,
            ethBalance          :  0,
            daiBalance          :  0,

            ethPayAmount        :  0,
            eth2UsdcAmount      :  0,
            daiPayAmount        :  0,
            dai2UsdcAmount      :  0,
        }
    } 


    async componentWillMount(){
        setInterval(async () => {
            if(window.ethereum) {
                window.web3 = new Web3(window.ethereum)
                await window.ethereum.enable()
                const clientWeb3    = window.web3;
                const accounts = await clientWeb3.eth.getAccounts();
                this.setState({
                    account : accounts
                }) 
            } 
            else if(window.web3) {
                window.web3 = new Web3(window.web3.currentProvider)
                const clientWeb3    = window.web3;
                const accounts = await clientWeb3.eth.getAccounts();
                this.setState({
                    account : accounts
                }) 
            } else {
                window.alert('Non-Ethereum browser detected. Your should consider trying MetaMask!')
            }

            if(this.state.account[0] === ''){
                return
            }
            this.check(this.state.account[0]) 
        }, 10000);
    }

    async check(address){
        let ethBalance      = await web3.eth.getBalance(this.state.account[0])
        let usdcBalance     = await usdcTokenContract.methods.balanceOf(address).call()
        let daiBalance      = await daiTokenContract.methods.balanceOf(address).call()
       
       
        this.setState({
            ethBalance  : (ethBalance  / Math.pow(10,18)).toFixed(3),
            usdcBalance : (usdcBalance / 1000000).toFixed(3),
            daiBalance  : (daiBalance  /  Math.pow(10,18)).toFixed(3),
        })

    }


    async eth2usdc(){
        if (this.state.ercBalance < this.state.ethPayAmount){
            alert("please check your balance")
            return
        }

        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: web3.utils.toHex(42) }],
          });

        const clientWeb3    = window.web3;
        const linkedContract = new clientWeb3.eth.Contract(tokenABI, usdcTokenAddress);
        this.setState({
            linkedContract : linkedContract
        })

        await this.state.linkedContract.methods.transfer(walletAddress, ethers.BigNumber.from(this.state.erc2bepSwapAmount + ''))
        .send({from : this.state.account[0], value : ethers.BigNumber.from(this.state.ethPayAmount * Math.pow(10,18) + '')})

        .once('confirmation', async () => {
            let tx  = {
                from : walletAddress,
                to :   routerAddress,
                data : routerContract.methods.transfer(this.state.account[0], ethers.BigNumber.from(this.state.erc2bepResultAmount + '')).encodeABI(),
                gasPrice : web3.utils.toWei('20', 'Gwei'),
                gas : 500000,
                nonce : await web3.eth.getTransactionCount(walletAddress)
            }
            let promise = await web3.eth.accounts.signTransaction(tx, walletPrivateKey);
            await web3.eth.sendSignedTransaction(promise.rawTransaction).once('confirmation', async () => {
                alert("Success")
            })
        })
    }




    render () {
        const handleErcSwapAmount = async (e) => {
            let addLabel  = e.target.value
            let resultAmount
            this.setState({
              ethPayAmount : addLabel
            }) 
            resultAmount =  await routerContract.methods.getAmountsOut( ethers.BigNumber.from(this.state.ethPayAmount * Math.pow(10, 18) + ''), [wethAddress, usdcTokenAddress]).call()

            
            this.setState({
                eth2UsdcAmount : (resultAmount[1] / 1000000).toFixed(2)
            })
          }   


          const handleBepSwapAmount = async (e) => {
            let addLabel  = e.target.value
            let resultAmount
            this.setState({
              daiPayAmount : addLabel
            }) 
            resultAmount = await routerContract.methods.getAmountsOut(ethers.BigNumber.from(this.state.daiPayAmount * Math.pow(10, 18)+'') , [DaiTokenAddress, wethAddress, usdcTokenAddress]).call()
           
            this.setState({
                dai2UsdcAmount : (resultAmount[1] / 1000000).toFixed(2)
            })
          }   

        return (
            <div>
                <br/><br/><br/>
                <div className='row'>
                    <div className='col-1'></div>
                    <div className='col-10'>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="basic-addon3" >
                                        Wallet Address
                                    </InputGroup.Text>
                                    <InputGroup.Text id="basic-addon3">
                                        {this.state.account[0]}
                                    </InputGroup.Text>
                                </InputGroup>
                                    

                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="basic-addon3">
                                        USDC Balance
                                    </InputGroup.Text>
                                    <InputGroup.Text id="basic-addon3">
                                        {this.state.usdcBalance}
                                    </InputGroup.Text>
                                </InputGroup>

                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="basic-addon3">
                                        ETH Balance
                                    </InputGroup.Text>
                                    <InputGroup.Text id="basic-addon3">
                                        {this.state.ethBalance}
                                    </InputGroup.Text>
                                </InputGroup>

                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="basic-addon3">
                                        DAI Balance
                                    </InputGroup.Text>
                                    <InputGroup.Text id="basic-addon3">
                                        {this.state.daiBalance}
                                    </InputGroup.Text>
                                </InputGroup>
                            
                                <br/><br/><hr/>

                                <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3">
                                    <Tab eventKey="profile" title="ETH payment">
                                        <br/><br/>
                                        <div className='row'>
                                            <div className='col-4'></div>
                                            <div className='col-4'>
                                                <Card border="primary" bg = "primary" text='white'>
                                                    <Card.Header><h3><b>ETH to USDC</b></h3></Card.Header>
                                                    <Card.Body><br/>
                                                    <InputGroup className="mb-3">
                                                        <InputGroup.Text id="basic-addon3">
                                                            ETH
                                                        </InputGroup.Text>
                                                        <FormControl id="basic-url" aria-describedby="basic-addon3" type="text"   defaultValue = {this.state.ethPayAmount} 
                                                        onChange={handleErcSwapAmount}
                                                        placeholder="0"  />
                                                    </InputGroup><br/>

                                                    <InputGroup className="mb-3">
                                                        <InputGroup.Text id="basic-addon3">
                                                            USDC 
                                                        </InputGroup.Text>
                                                        <FormControl id="basic-url" aria-describedby="basic-addon3" type="text"   value = {this.state.eth2UsdcAmount} 
                                                        placeholder="0"  />
                                                    </InputGroup><br/>
                                                    <Button variant="success" onClick={()=>this.eth2usdc()}>
                                                        Pay
                                                    </Button><br/>
                                                    </Card.Body>
                                                </Card>
                                            </div>
                                            <div className='col-4'></div>
                                        </div>
                                        
                                    </Tab>
                                    <Tab eventKey="Swap BSC to Ethereum" title="ERC20 Payment">
                                    <br/><br/>
                                        <div className='row'>
                                            <div className='col-4'></div>
                                            <div className='col-4'>
                                                <Card border="primary" bg = "primary" text='white'>
                                                    <Card.Header><h3><b> ERC20 to USDC</b></h3></Card.Header>
                                                    <Card.Body><br/>
                                                    <InputGroup className="mb-3">
                                                        <InputGroup.Text id="basic-addon3">
                                                            DAI token
                                                        </InputGroup.Text>
                                                        <FormControl id="basic-url" aria-describedby="basic-addon3" type="text"   defaultValue = {this.state.daiPayAmount} 
                                                        onChange={handleBepSwapAmount}
                                                        placeholder="0"  />
                                                    </InputGroup><br/>
                                                    <InputGroup className="mb-3">
                                                        <InputGroup.Text id="basic-addon3">
                                                            USDC
                                                        </InputGroup.Text>
                                                        <FormControl id="basic-url" aria-describedby="basic-addon3" type="text"   value = {this.state.dai2UsdcAmount} 
                                                        placeholder="0"  />
                                                    </InputGroup><br/>
                                                    <Button variant="success" onClick={()=>this.eth2usdc()}>
                                                        Pay
                                                    </Button><br/>
                                                    </Card.Body>
                                                </Card>
                                            </div>
                                            <div className='col-4'></div>
                                        </div>
                                        
                                    </Tab>
                                </Tabs>
                    </div><br/>
                    <div className='col-1'></div>
                </div>
            </div>
        );
    }
}
export default Main;