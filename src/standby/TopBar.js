import React, {Component} from 'react';
import { withStyles } from '@material-ui/core/styles';
import {Box, Button, Popover, Typography} from "@material-ui/core";
import Logo from '../common/images/Logo.png';
import { ReactComponent as EnvelopeIcon } from '../common/images/EnvelopeIcon.svg';
import { ReactComponent as HeadsetIcon } from '../common/images/HeadsetIcon.svg';

const style = theme => ({
    root:{
        width: '100%',
        padding: '15px 0',
        boxSizing: 'border-box',
        borderBottom: '2px solid #3c68ff',
        '& *': {
            fontFamily: 'Noto Sans KR',
        },
    },
    rootIn:{
        width: 1140,
        margin:'0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    flexBox:{
        display: 'flex',
        alignItems: 'center'
    },
    aTextStyle:{
        display: 'flex',
        alignItems: 'center',
        fontSize: '1.063rem',
        color: '#000',
        textDecoration: 'none',
        marginRight: 30
    },
    buttonStyle:{
        display: 'flex',
        alignItems: 'center',
        padding: 0,
        '&:hover':{
            background: 'transparent !important'
        }
    },
    textStyle:{
        fontSize: '1.063rem',
        color: '#000',
    },
    iconMargin:{
        marginLeft: 10
    },
    popoverBox:{
        '& .MuiPopover-paper':{
            overflow: 'inherit',
            padding: '10px',
            top: '70px !important',
            '& .MuiTypography-root':{
                fontSize: '1.25rem',
                fontWeight: 600
            },
        }
    },
    popoverArrow:{
        '&::after':{
            backgroundColor: '#fff',
            boxShadow: '-1px -1px 2px 0 rgb(178 178 178 / 40%)',
            content: "''",
            display: 'block',
            height: 10,
            left: '45%',
            position: 'absolute',
            top: -5,
            transform: 'rotate( 45deg )',
            width:  10
        },
    },
});

class TopBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
        };
    }

    handleClick = event => {
        this.setState({
            anchorEl: event.currentTarget,
        });
    };

    handleClose = () => {
        this.setState({
            anchorEl: null,
        });
    };

    render() {
        const { classes } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        return (
            <div className={classes.root}>
                <Box className={classes.rootIn}>
                    <img src={Logo} alt='e학습터 로고'/>

                    <Box className={classes.flexBox}>
                        <a href="mailto:cls@keris.or.kr" target="_blank" rel="noopener noreferrer" className={classes.aTextStyle}>
                            개선의견 접수
                            <EnvelopeIcon className={classes.iconMargin}/>
                        </a>
                        <Button
                            className={classes.buttonStyle}
                            aria-owns={open ? 'simple-popper' : undefined}
                            aria-haspopup="true"
                            onClick={this.handleClick}
                            disableRipple
                        >
                            <Typography className={classes.textStyle}>서비스 문의</Typography>
                            <HeadsetIcon className={classes.iconMargin}/>
                        </Button>

                        <Popover
                            id="simple-popper"
                            open={open}
                            anchorEl={anchorEl}
                            onClose={this.handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            className={classes.popoverBox}
                        >
                            <Box className={classes.popoverArrow}>
                                <Typography>Tel. 1544-0079</Typography>
                            </Box>

                        </Popover>
                    </Box>
                </Box>
            </div>
        );
    }
}

export default withStyles(style)(TopBar);