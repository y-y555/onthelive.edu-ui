import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
    Box, Button,
    Dialog, FormControl, IconButton, LinearProgress, MenuItem, Select, Tab, Tabs,
    Typography,
} from "@material-ui/core";
import { ReactComponent as CloseIcon } from '../common/images/CloseIcon.svg';
import {ReactComponent as CameraOn} from "../common/images/CameraOn.svg";
import {ReactComponent as MikeOn} from "../common/images/MikeOn.svg";
import {ReactComponent as SoundOn} from "../common/images/SoundOn.svg";
import {ReactComponent as CaretDown} from "../common/images/CaretDown.svg";
import {ReactComponent as PlayIcon} from "../common/images/PlayIcon.svg";
import {ReactComponent as StopIcon} from "../common/images/StopIcon.svg";
import ChangeSpeakerPopover from "./ChangeSpeakerPopover";

const style = theme => ({
    dialogBox:{
        '& .MuiDialog-paper':{
            margin: 0,
            boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
            borderRadius: 16
        },
        '& .MuiDialog-paperWidthSm':{
            width: 695,
            maxWidth: 900
        },
        '& *': {
            fontFamily: 'Noto Sans KR',
        },
    },
    flexBox:{
        display:'flex'
    },
    leftBox:{
        width: 190,
        borderRight: '1px solid #3c68ff',
        paddingBottom: 310
    },
    leftTitleText:{
        fontSize: '1.375rem',
        fontWeight: 500,
        margin: '38px 0 20px 27px'
    },
    tabsBox:{
        '& .MuiTabs-indicator':{
            display: 'none'
        },
        '& .MuiTab-root':{
            minHeight: 48,
            opacity: 1,
            paddingLeft: 27,
            boxSizing: 'border-box',
            '&.Mui-selected':{
                background: '#e0e7ff',
                '& span':{
                    color:'#3d68fe',
                    '& .camera-icon, .sound-icon, .mike-icon':{
                        fill: '#3d68fe'

                    }
                }
            }
        },
        '& .MuiTab-wrapper':{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            fontSize: '1.063rem',
            '& > :first-child':{
                marginBottom: 0
            },
            '& svg':{
                width: 35,
                height: 35,
                marginRight: 10,
                '& .camera-icon, .sound-icon, .mike-icon':{
                    fill: '#000'

                }
            }
        }
    },
    rightBox:{
        width: 455,
        padding: '17px 20px 0 27px'
    },
    closeBox:{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: 55
    },
    iconButton:{
        padding: 0,
        '&:hover':{
            background:'transparent'
        }
    },
    flexBoxCenter:{
        display: 'flex',
        alignItems: 'center'
    },
    textStyle:{
        fontSize: '1rem',
        color: '#3d67ff'
    },
    formControl:{
        width:330,
        height:40,
        marginBottom: 18,
        marginTop: 10,
        "& .MuiOutlinedInput-input":{
            padding:'12px 27px 12px 14px',
        },
        '& .MuiOutlinedInput-root':{
            borderRadius: 7,
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":{
            borderColor:'#c0c2c3',
            borderWidth:1
        },
        "& .MuiSelect-select:focus":{
            background:'transparent'
        },
        "& .MuiInputBase-root":{
            fontSize:'1rem',
            color:'#000',
        }
    },
    menuItem:{
    },
    menuText:{
        maxWidth: 400,
        fontSize:'1rem',
        color:'#000',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    videoBox:{
        width: 112,
        height: 70,
        borderRadius: 3,
        background:'linear-gradient(to bottom, #354767, #202226)',
        marginLeft: 15,
        overflow:'hidden',

    },
    audioBar:{
        '& .MuiLinearProgress-root':{
            background:'#c4c4c4',
            width:330,
            height: 10,
        },
        '& .MuiLinearProgress-bar':{
            background:'#3d68fe'
        }
    },
    testButtonBox:{
        width:330,
        height:48,
        border: '1px solid #c0c2c3',
        background: '#fff',
        borderRadius: 7,
        marginBottom: 18,
        marginTop: 10,
        '& span':{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        '&:hover':{
            background:'#fff'
        }
    },
    buttonText:{
        width: 280,
        fontSize: '1rem',
        textAlign:'left'
    },
    buttonStyle:{
        borderRadius: 7,
        border: '1px solid #000000',
        width: 200,
        height: 44,
        '& span':{
            fontSize: '1rem',
        },
        '&:hover':{
            background:'#fff'
        }
    }
});

class SettingDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            micDeviceValue: 'camera1',
            audioDeviceValue: 'audio1',
            changeSpeakerAnchorEl: null,
            testButton: true,

        };
    }

    handleClickTestButton = () => {
        if(this.state.testButton) {
            this.handlePlaySound();
        }else {
            this.handleStopSound();
        }
    };

    handleClickChangeSpeaker = event => {
        this.setState({
            changeSpeakerAnchorEl: event.currentTarget,
        });
    };

    handleCloseChangeSpeaker = () => {
        this.setState({
            changeSpeakerAnchorEl: null,
        });
    };

    handlePlaySound = () => {
        const testSoundContext = document.getElementById('soundSample01');

        if (testSoundContext) {
            testSoundContext.play();
            this.setState({
                testButton: false,
            });
        }
    };

    handleStopSound = () => {
        const testSoundContext = document.getElementById('soundSample01');

        if (testSoundContext) {
            testSoundContext.pause();
            this.setState({
                testButton: true,
            });
        }
    };

    handleDialogClose = () => {
        this.setState({
            testButton: true
        })
        if(this.props.handleDialogClose) {
            this.props.handleDialogClose();
        }
    }

    render() {
        const { classes, dialogOpen, settingValue, handleTabChange, handleChangeCamDevice, handleChangeMicDevice, selectedCamId, camDevices,  micDevices, selectedMicId, camPreviewRef} = this.props;
        const {changeSpeakerAnchorEl, testButton} = this.state;
        const changeSpeakerOpen = Boolean(changeSpeakerAnchorEl);

        return (
            <Dialog
                open={dialogOpen}
                onClose={this.handleDialogClose}
                aria-labelledby="draggable-dialog-title"
                className={classes.dialogBox}
            >
                <Box className={classes.flexBox}>
                    <Box className={classes.leftBox}>
                        <Typography className={classes.leftTitleText}>환경설정</Typography>
                        <Tabs orientation="vertical" value={settingValue} onChange={handleTabChange} className={classes.tabsBox}>
                            <Tab label="영상" icon={<CameraOn/>} />
                            <Tab label="오디오" icon={<MikeOn/>} />
                            <Tab label="사운드 테스트"  icon={<SoundOn/>} />
                        </Tabs>
                    </Box>
                    <Box className={classes.rightBox}>
                        <Box className={classes.closeBox}>
                            <IconButton className={classes.iconButton} onClick={this.handleDialogClose} disableRipple>
                                <CloseIcon/>
                            </IconButton>
                        </Box>

                        {settingValue === 0 &&
                            <Box className={classes.flexBoxCenter}>
                                <Box>
                                    <Typography className={classes.textStyle}>카메라</Typography>
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <Select
                                            value={(camDevices.length > 0) && selectedCamId ? selectedCamId : ''}
                                            onChange={handleChangeCamDevice}
                                            IconComponent={() => (
                                                <Box style={{ marginRight: 10 }}>
                                                    <CaretDown />
                                                </Box>
                                            )}
                                        >
                                            {camDevices.map(device =>
                                                <MenuItem className={classes.menuItem} key={`cam-device-${device.deviceId}`} value={device.deviceId}>
                                                    {(!device.label) && (!device.deviceId) ?
                                                        <Typography className={classes.menuText}>알수없는 장치</Typography>
                                                        :
                                                        (!device.label) && (device.deviceId) ?
                                                            <Typography className={classes.menuText}>장치-{device.deviceId.slice(0, 10)}</Typography>
                                                            :
                                                            <Typography className={classes.menuText}>{device.label}</Typography>
                                                    }
                                                </MenuItem>
                                            )}
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box className={classes.videoBox}>
                                    <video ref={camPreviewRef} style={{width:112, height:70}} autoPlay playsInline muted />
                                </Box>
                            </Box>
                        }
                        {settingValue === 1 &&
                        <Box>
                            <Typography className={classes.textStyle}>오디오</Typography>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <Select
                                    value={(micDevices.length > 0) && selectedMicId ? selectedMicId : ''}
                                    onChange={handleChangeMicDevice}
                                    IconComponent={() => (
                                        <Box style={{ marginRight: 10 }}>
                                            <CaretDown />
                                        </Box>
                                    )}
                                >
                                    {micDevices.map(device =>
                                        <MenuItem className={classes.menuItem} key={`mic-device-${device.deviceId}`} value={device.deviceId}>
                                            {(!device.label) && (!device.deviceId) ?
                                                <Typography className={classes.menuText}>알수없는 장치</Typography>
                                                :
                                                (!device.label) && (device.deviceId) ?
                                                    <Typography className={classes.menuText}>장치-{device.deviceId.slice(0, 10)}</Typography>
                                                    :
                                                    <Typography className={classes.menuText}>{device.label}</Typography>
                                            }
                                        </MenuItem>
                                    )}
                                </Select>
                            </FormControl>

                            <Box className={classes.audioBar}>
                                <LinearProgress variant="determinate" value={this.props.completed}/>
                            </Box>
                        </Box>
                        }
                        {settingValue === 2 &&
                            <Box>
                                <Typography className={classes.textStyle}>테스트용 사운드</Typography>
                                <Button className={classes.testButtonBox} onClick={this.handleClickTestButton} disableRipple>
                                    <Typography className={classes.buttonText} noWrap>ATMOSFERA - NYX KOA</Typography>
                                    {testButton ?
                                        <PlayIcon/>
                                        :
                                        <StopIcon/>
                                    }

                                </Button>
                                <Button
                                    className={classes.buttonStyle}
                                    aria-owns={changeSpeakerOpen ? 'simple-popper' : undefined}
                                    aria-haspopup="true"
                                    onClick={this.handleClickChangeSpeaker}
                                    disableRipple
                                >
                                    스피커 변경 방법
                                </Button>
                                <ChangeSpeakerPopover changeSpeakerOpen={changeSpeakerOpen} changeSpeakerAnchorEl={changeSpeakerAnchorEl} handleCloseChangeSpeaker={this.handleCloseChangeSpeaker}/>

                                <audio id={"soundSample01"}
                                       src={"https://kr.object.gov-ncloudstorage.com/onthelive/soundSample/soundSample01.mp3"}/>
                            </Box>
                        }
                    </Box>
                </Box>

            </Dialog>
        );
    }
}

export default withStyles(style)(SettingDialog);