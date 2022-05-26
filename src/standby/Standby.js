import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import {Box, Button, Typography} from "@material-ui/core";
import BackgroundImage from '../common/images/BackgroundImage.png';
import { ReactComponent as CameraOn } from '../common/images/CameraOn.svg';
import { ReactComponent as MikeOn } from '../common/images/MikeOn.svg';
import { ReactComponent as SoundOn } from '../common/images/SoundOn.svg';
import clsx from "clsx";
import SettingDialog from "./SettingDialog";
import {MediaQuality, MediaUtil} from "../common/lib/MediaUtil";
import SoundMeter from "../common/lib/SoundMeter";

const style = theme => ({
    root:{
        width: '100%',
        height: 'calc(100vh - 82px)',
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 170,
        boxSizing: 'border-box',
        background: '#fdfbf7',
        '& *': {
            fontFamily: 'Noto Sans KR',
        },
    },
    contentsBox:{
        width: 1140,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    titleText:{
        fontSize: '2.375rem',
        fontWeight: 'bold',
        marginBottom: 30
    },
    textStyle:{
        fontSize: '1.25rem',
        fontWeight: 300
    },
    flexBox:{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 13
    },
    buttonStyle:{
        width: 164,
        height: 65,
        background: '#333',
        borderRadius: 16,
        boxSizing: 'border-box',
        '&:hover':{
            background: '#333',
        }
    },
    buttonColor:{
        width: 162,
        height: 63,
        border: '1.6px solid #000',
        background:'#fff',
        '&:hover':{
            background: '#fff',
        }
    }
});

const LogPrefix = "[Standby]"
class Standby extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogOpen: false,
            settingValue: 0,
            permission : undefined,
            camDevices: [],
            micDevices: [],

            selectedMicId: undefined,

            selectedCamId: undefined,

            previewCamStream: undefined,
            audioMediaStream: undefined,
            previewWidth: 0,
            previewHeight: 0,
            completed: 0,
        };
        this.camPreviewRef = React.createRef();
        this.soundMeterInterval = undefined;
        this.audioContext = undefined;
        this.isSoundMetering = false;
    }

    componentDidMount() {
        MediaUtil.requestMediaPermission()
            .then((permission) => {
                this.setState({permission : permission});
                console.log(LogPrefix, `permission=${permission}`)
            })
            .catch(() => {
                this.setState({permission : {mic: false, cam: false}});
            });
        this.init();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(LogPrefix, 'ComponentDidUpdate');
        if((this.state.dialogOpen !== prevState.dialogOpen) && (this.state.dialogOpen)) {
            this.init();
        }

        if (this.state.settingValue === 0 && this.state.previewCamStream && this.camPreviewRef && this.camPreviewRef.current) {
            this.camPreviewRef.current.srcObject = this.state.previewCamStream;
        }
    }

    handleDialogOpen = (settingValue) => {
        this.setState({ dialogOpen: true, settingValue: settingValue});
        if(settingValue === 0) {
            this.setPreview(this.state.selectedCamId);
        }else if(settingValue === 1) {
            this.selectAudioDeviceId(this.state.selectedMicId);
        }
    };

    handleDialogClose = (event, reason) => {
        if((reason !== 'escapeKeyDown') && (reason !== 'backdropClick')) {
            this.closePreviewStream();
            this.stopAudioTrackInStream();
            this.setState({ dialogOpen: false });
        }
    };

    handleTabChange = (event, settingValue) => {
        this.setState({settingValue});
        this.stopAudioTrackInStream();
        if(settingValue === 0) {
            this.setPreview(this.state.selectedCamId);
        }else if(settingValue === 1) {
            this.selectAudioDeviceId(this.state.selectedMicId);
        }
    };


    init = () => {
        MediaUtil.enumerateDevices()
            .then(devices => {
                console.log(LogPrefix, 'EnumerateDevices success : ', devices);

                const camDevices = devices.camDevices;
                const micDevices = devices.micDevices;
                const selectedCamId = devices.camDevices[0].deviceId;
                const selectedMicId = devices.micDevices[0].deviceId;

                this.setState({camDevices, micDevices, selectedCamId, selectedMicId});
            })
            .catch(error => {
                console.warn(LogPrefix, 'EnumerateDevices error : type=cam, error=', error);

                const camDevices = [];
                const micDevices = [];
                const selectedCamId = undefined;
                const selectedMicId = undefined;

                this.setState({camDevices, micDevices, selectedCamId, selectedMicId});
            });
    }

    setPreview = (deviceId) => {
        console.log(LogPrefix, 'SetPreviewStream : deviceId=', deviceId);

        if(this.state.previewCamStream) {
            this.state.previewCamStream.getTracks().forEach(track => track.stop());
        }

        MediaUtil.getUserVideoStream(deviceId, MediaQuality.VeryHigh)
            .then(result => {
                console.log(LogPrefix, `GetUserVideoStream success : width=${result.width}, height=${result.height}, stream=`, result.stream);

                this.setState({previewCamStream: result.stream, previewWidth: result.width, previewHeight: result.height});
            })
            .catch(error => {
                console.warn(LogPrefix, `GetUserVideoStream error : video=${deviceId}`, error);
            });
    }

    closePreviewStream = () => {
        const {previewCamStream} = this.state;
        if(previewCamStream) {
            previewCamStream.getTracks().forEach(track => track.stop());

            this.setState({previewCamStream: undefined});
        }
    }

    handleChangeCamDevice = (event) => {
        const deviceId = event.target.value;
        console.log(LogPrefix, 'ChangedCamDevice : ', deviceId);

        this.setState({selectedCamId : deviceId})
        this.setPreview(deviceId);
    }

    handleChangeMicDevice = (event) => {
        const deviceId = event.target.value;
        console.log(LogPrefix, 'ChangeMicDevice : ', deviceId);

        this.setState({selectedMicId: deviceId});
        this.selectAudioDeviceId(deviceId);
    }


    selectAudioDeviceId = (deviceId) => {
        console.log(LogPrefix, 'Select Audio DeviceId', deviceId);
        const that = this;

        that.stopAudioTrackInStream();
            MediaUtil.getUserAudioStream(this.state.selectedMicId)
                .then((mediaStream) => {
                console.log(LogPrefix, 'Get UserMedia success without constraints', mediaStream);
                        that.logMediaStreamTrack(mediaStream);

                        that.startSoundMeter(mediaStream);
            }).catch((error) => {
                console.warn(LogPrefix, 'Get UserMedia error without constraints', error);
                MediaUtil.getUserAudioStream(this.state.selectedMicId)
                    .then((mediaStream) => {
                        console.log(LogPrefix, 'Get UserMedia success without constraints', mediaStream);
                        that.logMediaStreamTrack(mediaStream);

                        that.startSoundMeter(mediaStream);
                    }).catch((error) => {
                        console.warn(LogPrefix, 'Get UserMedia error without constraints', error);
                    });
            });
    };

    logMediaStreamTrack = (mediaStream) => {
        mediaStream.getTracks().forEach((track) => {
            console.log(LogPrefix, 'Track', track);
            console.log(LogPrefix, "Track's constraints", track.getConstraints());
            console.log(LogPrefix, "Track's settings", track.getSettings());
        });
    };

    stopAudioTrackInStream = () => {
        if (this.state.audioMediaStream) {
            this.state.audioMediaStream.getTracks().forEach((track) => track.stop());
            console.log(
                LogPrefix,
                'Stop Audio stream success',
                this.state.audioMediaStream
            );
        }

        this.isSoundMetering = false;

        if (this.soundMeter) {
            this.soundMeter.stop();
            this.soundMeter = undefined;
        }

        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = undefined;
        }

        if (this.soundMeterInterval) {
            clearInterval(this.soundMeterInterval);
            this.soundMeterInterval = undefined;
        }
    };

    setSoundMeterValue = (value) => {
        this.setState({completed : value})
    };

    startSoundMeter = (mediaStream) => {
        this.setState({
            audioMediaStream : mediaStream
        })

        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext ||
                window.webkitAudioContext)();
        }
        if (this.soundMeter) {
            this.soundMeter.stop();
        } else {
            this.soundMeter = new SoundMeter(this.audioContext);
        }

        const that = this;
        this.soundMeter.connectToSource(mediaStream, (e) => {
            if (e) {
                console.warn(LogPrefix, 'SoundMeter connection error', e);

                that.isSoundMetering = false;
            } else {
                console.log(LogPrefix, 'SoundMeter connection success');

                that.isSoundMetering = true;
                if (!that.soundMeterInterval) {
                    that.soundMeterInterval = setInterval(() => {
                        let soundVal = that.isSoundMetering
                            ? that.soundMeter.instant.toFixed(2) * 100
                            : 0;

                        //console.log(LogPrefix, "SoundMeterValue", soundVal);
                        that.setSoundMeterValue(soundVal);
                    }, 200);
                }
            }
        });
    };

    render() {
        const { classes } = this.props;
        const { dialogOpen, settingValue, camDevices, micDevices, selectedCamId, selectedMicId, completed} = this.state;

        return (
            <div className={classes.root}>
                <Box className={classes.contentsBox}>
                    <Box>
                        <Typography className={classes.titleText}>
                            e학습터 화상수업에 오신<br/>
                            여러분을 환영합니다.
                        </Typography>
                        <Typography className={classes.textStyle}>
                            원격수업에 입장하기 전 환경설정을 확인해주세요.
                        </Typography>
                    </Box>
                    <Box>
                        <img src={BackgroundImage} alt='배경 이미지'/>
                        <Box className={classes.flexBox}>
                            <Button className={classes.buttonStyle} onClick={() => this.handleDialogOpen(0)} disableRipple><CameraOn/></Button>
                            <Button className={clsx(classes.buttonStyle, classes.buttonColor)} onClick={() => this.handleDialogOpen(1)} disableRipple><MikeOn/></Button>
                            <Button className={classes.buttonStyle} onClick={() => this.handleDialogOpen(2)} disableRipple><SoundOn/></Button>
                        </Box>
                        <SettingDialog
                            dialogOpen={dialogOpen}
                            handleDialogClose={this.handleDialogClose}
                            settingValue={settingValue}
                            camDevices={camDevices}
                            micDevices={micDevices}
                            selectedCamId={selectedCamId}
                            selectedMicId={selectedMicId}
                            completed={completed}
                            camPreviewRef={this.camPreviewRef}
                            handleTabChange={this.handleTabChange}
                            handleChangeCamDevice={this.handleChangeCamDevice}
                            handleChangeMicDevice={this.handleChangeMicDevice}
                        />
                    </Box>
                </Box>
            </div>
        );
    }
}

export default withStyles(style)(Standby);