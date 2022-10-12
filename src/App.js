import TopBar from "./standby/TopBar";
import Standby from "./standby/Standby";
import React from "react";
import {getDeviceBrowserType} from "./common/lib/Common";
import {Box} from "@material-ui/core";
import MobileStandby from "./standby/mobile/MobileStandby";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isMobile : false,
        }
    }

    componentDidMount() {
        this.configureIsMobile();
    }


    configureIsMobile = () => {
        const deviceBrowser = getDeviceBrowserType(false);
        console.log('Configure IsMobile', deviceBrowser);

        const device = deviceBrowser && deviceBrowser.deviceType;

        if((device === 'ios') || (device === 'android')) {
            this.setState({isMobile: true});
        } else {
            this.setState({isMobile: false});
        }
    }

    render() {
        console.log("@@@@@@@@", window.innerWidth)
        return (
            <div className="App">
                {this.state.isMobile &&  window.innerWidth < 801 ?
                    <Box>
                        <MobileStandby/>
                    </Box>
                    :
                    <Box>
                        <TopBar/>
                        <Standby/>
                    </Box>
                }
            </div>
        );
    }
}

export default App;
