

export const getDevice = (userAgent, maxTouchPoints) => {
    let device = "etc";

    if(userAgent) {
        let agent = userAgent.toLowerCase();
        if(agent.includes('android')) {
            device = 'android';
        } else if(agent.includes('iphone')) {
            device = 'iphone';
        } else if(agent.includes('ipad')) {
            device = 'ipad';
        } else if(agent.includes('macintosh')) {
            if(maxTouchPoints) {
                device = 'ipad';
            } else {
                device = 'mac';
            }
        } else if(agent.includes('windows')) {
            device = 'windows';
        } else if(agent.includes('linux')) {
            device = 'linux';
        }
    }

    return device;
}



export function getDeviceBrowserType(isAlert) {
    const agent = navigator.userAgent.toLowerCase();
    if(isAlert) {
        alert(agent);
    }
    // else {
    //     console.log('Agent : ' + agent);
    // }

    let deviceType = undefined;
    let browserType = undefined;

    if(agent.indexOf('android') > 0) {
        deviceType = 'android';

        if(agent.indexOf('kakaotalk') > 0) {
            browserType = 'kakaotalk';
        } else if(agent.indexOf('samsungbrowser') > 0) {
            browserType = 'saumsungbrowser';
        } else if(agent.indexOf('chrome') > 0) {
            browserType = 'chrome';
        } else {
            browserType = 'etc';
        }
    } else if(agent.indexOf('iphone') > 0) {
        deviceType = 'ios';

        if(agent.indexOf('kakaotalk') > 0) {
            browserType = 'kakaotalk';
        } else if(agent.indexOf('safari') > 0) {
            if(agent.indexOf('crios') > 0) {
                browserType = 'chrome';
            } else {
                browserType = 'safari';
            }
        } else {
            browserType = 'etc';
        }
    } else if(agent.indexOf('ipad') > 0 || (agent.indexOf('mac') > 0 && (navigator.maxTouchPoints && navigator.maxTouchPoints > 0))) {
        deviceType = 'ios';

        if(agent.indexOf('kakaotalk') > 0) {
            browserType = 'kakaotalk';
        } else if(agent.indexOf('safari') > 0) {
            if(agent.indexOf('crios') > 0) {
                browserType = 'chrome';
            } else {
                browserType = 'safari';
            }
        } else {
            browserType = 'etc';
        }
    } else {
        deviceType = 'etc';

        if(agent.indexOf('edge') > 0) {
            browserType = 'edge'
        } else if(agent.indexOf('firefox') > 0) {
            browserType = 'firefox';
        } else if(agent.indexOf('chrome') > 0) {
            browserType = 'chrome';
        } else if(agent.indexOf('safari') > 0) {
            browserType = 'safari';
        } else {
            browserType = 'etc';
        }
    }

    return {deviceType: deviceType, browserType: browserType};
}

export const getIsMobile = () => {
    const deviceBrowserType = getDeviceBrowserType(false);
    return (deviceBrowserType.deviceType === 'android' || deviceBrowserType.deviceType === 'ios');
}