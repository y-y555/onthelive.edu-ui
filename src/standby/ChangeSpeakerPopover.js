import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import {Box, Button, Popover, Typography} from "@material-ui/core";
import ChangeSpeakerImg from '../common/images/ChangeSpeakerImg.png';

const style = theme => ({
    popoverBox:{
        '& .MuiPopover-paper':{
            boxShadow: '0 2.5px 2.5px 0 rgba(0, 0, 0, 0.25)',
            borderRadius: 10,
            padding: '17px 18px'
        },
        '& *': {
            fontFamily: 'Noto Sans KR',
        },
    },
    popoverBoxIn:{

    },
    titleText:{
        fontSize: '0.938rem',
        fontWeight: 500,
        marginBottom: 16
    },
    textStyle:{
        fontSize: '0.75rem',
        marginBottom: 5
    },
    buttonBox:{
        display:'flex',
        justifyContent: 'flex-end'
    },
    buttonStyle:{
        width: 80,
        height: 30,
        background:'#fff',
        border: '1px solid #000',
        marginTop: 8,
        '& span':{
            fontSize: '0.75rem',
        },
       '&:hover':{
           background:'#fff'
       }
    }
});

class ChangeSpeakerPopover extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        const { classes, changeSpeakerOpen, changeSpeakerAnchorEl, handleCloseChangeSpeaker } = this.props;

        return (
            <Popover
                id="simple-popper"
                open={changeSpeakerOpen}
                anchorEl={changeSpeakerAnchorEl}
                onClose={handleCloseChangeSpeaker}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                className={classes.popoverBox}
            >
                <Box className={classes.popoverBoxIn}>
                    <Typography className={classes.titleText}>스피커 변경 방법 [Windows]</Typography>
                    <Typography className={classes.textStyle}>
                        1. 우측하단에 표시된 스피커 아이콘을 클릭하세요.<br/>
                        2. 원하시는 재생 디바이스를 선택하세요.
                    </Typography>
                    <img src={ChangeSpeakerImg} alt='스피커 변경 방법 이미지'/>
                    <Box className={classes.buttonBox}>
                        <Button className={classes.buttonStyle} onClick={handleCloseChangeSpeaker} disableRipple>
                            확인
                        </Button>
                    </Box>
                </Box>

            </Popover>
        );
    }
}

export default withStyles(style)(ChangeSpeakerPopover);