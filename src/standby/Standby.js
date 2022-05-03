import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import {Box, Button, Typography} from "@material-ui/core";
import BackgroundImage from '../common/images/BackgroundImage.png';
import { ReactComponent as CameraOn } from '../common/images/CameraOn.svg';
import { ReactComponent as MikeOn } from '../common/images/MikeOn.svg';
import { ReactComponent as SoundOn } from '../common/images/SoundOn.svg';
import clsx from "clsx";
import SettingDialog from "./SettingDialog";

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

class Standby extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogOpen: false,
            settingValue: 0
        };
    }

    handleDialogClose = () => {
        this.setState({ dialogOpen: false });
    };

    handleTabChange = (event, settingValue) => {
        this.setState({ settingValue });
    };

    render() {
        const { classes } = this.props;
        const { dialogOpen, settingValue } = this.state;

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
                            <Button className={classes.buttonStyle} onClick={() => this.setState({ dialogOpen: true, settingValue: 0 })} disableRipple><CameraOn/></Button>
                            <Button className={clsx(classes.buttonStyle, classes.buttonColor)} onClick={() => this.setState({ dialogOpen: true, settingValue: 1 })} disableRipple><MikeOn/></Button>
                            <Button className={classes.buttonStyle} onClick={() => this.setState({ dialogOpen: true, settingValue: 2 })} disableRipple><SoundOn/></Button>
                        </Box>
                        <SettingDialog dialogOpen={dialogOpen} handleDialogClose={this.handleDialogClose} settingValue={settingValue} handleTabChange={this.handleTabChange}/>
                    </Box>
                </Box>
            </div>
        );
    }
}

export default withStyles(style)(Standby);