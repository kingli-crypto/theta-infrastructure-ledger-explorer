import React from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SmartContractCode from './smart-contract-code';
import ReadContract from './read-contract';
import { smartContractService } from 'common/services/smartContract';
import get from 'lodash/get';

export default class SmartContract extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      smartContract: null,
      isVerified: false,
      isReleasesReady: false,
      isLoading: false
    }
  }
  componentDidMount() {
    this.fetchSmartContract(this.props.address)
  }
  componentDidUpdate(preProps) {
    if (this.props.address !== preProps.address) {
      this.fetchSmartContract(this.props.address)
    }
  }
  fetchSmartContract = (address) => {
    if (!address) {
      return;
    }
    this.setState({ isLoading: true })
    smartContractService.getOneByAddress(address)
      .then(res => {
        switch (res.data.type) {
          case 'smart_contract':
            const smartContract = get(res, 'data.body')
            const isVerified = get(smartContract, 'verification_date')
            const hasSourceCode = get(smartContract, 'source_code')
            this.setState({
              smartContract: smartContract,
              isVerified: isVerified && hasSourceCode
            })
            if (!this.state.isVerified) {
              this.loadReleases(() => {
                this.setState({ isReleasesReady: true })
              })
            }
            break;
          case 'error_not_found':
            break;
          default:
            break;
        }
        this.setState({ isLoading: false })
      }).catch(err => {
        console.log(err);
      })
  }
  loadReleases = (callback) => {
    const existingScript = document.getElementById('solReleases');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://solc-bin.ethereum.org/bin/list.js';
      script.id = 'solReleases';
      document.body.appendChild(script);

      script.onload = () => {
        if (callback) callback();
      };
    }
    if (existingScript && callback) callback();
  }
  isReadFunction = (functionData) => {
    const constant = get(functionData, ['constant'], null);
    const stateMutability = get(functionData, ['stateMutability'], null);

    return (stateMutability === "view" || stateMutability === "pure" || constant === true);
  }
  render() {
    const { address } = this.props;
    const { smartContract, isVerified, isLoading, isReleasesReady } = this.state;
    const abi = get(smartContract, 'abi');
    return (
      <React.Fragment>
        <div className='actions'>
          <div className="title">Contract</div>
        </div>
        <Tabs className="theta-tabs">
          <TabList>
            <Tab>Code</Tab>
            <Tab disabled={!isVerified}>Read Contract</Tab>
            <Tab disabled>Write Contract</Tab>
          </TabList>

          <TabPanel>
            <SmartContractCode address={address} smartContract={smartContract} isVerified={isVerified}
              isLoading={isLoading} isReleasesReady={isReleasesReady} fetchSmartContract={this.fetchSmartContract} />
          </TabPanel>
          <TabPanel>
            {abi && <ReadContract abi={abi.filter(this.isReadFunction)} address={address}/>}
          </TabPanel>
          <TabPanel>
            <h2>Write Contract</h2>
          </TabPanel>
        </Tabs>
      </React.Fragment>
    );
  }
}
