import BookmarkIcon from "@mui/icons-material/Bookmark";
import FastForwardIcon from "@mui/icons-material/FastForward";
import FastRewindIcon from "@mui/icons-material/FastRewind";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import PauseIcon from "@mui/icons-material/Pause";
import PictureInPictureAltIcon from "@mui/icons-material/PictureInPictureAlt";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import {
  Button, Grid, IconButton, Typography
} from "@mui/material";
import Popover from "@mui/material/Popover";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import React, { forwardRef } from "react";

const useStyles = makeStyles({
  color: "#161617",
  controlIcons: {
    fontSize: 50,
    transform: "scale(0.9)",
    "&:hover": {
      color: "#7520bb",
      transform: "scale(1)",
    },
  },

  bottomIcons: {
    color: "#161617",
    "&:hover": {
      color: "#7520bb",
      transform: "scale(1)",
    },
  },
});

const PrettoSlider = styled(Slider)({
  color: "#161617",
  height: 8,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&:before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: "#52af77",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&:before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
});

export default forwardRef((props, ref) => {
    const {
      togglePlay, 
      playing, 
      handleRewind, 
      handleForward, 
      muted, 
      toggleMute, 
      volume, 
      changeVolume, 
      playbackRate, 
      changePlaybackRate, 
      fullScreen, 
      toggleFullScreen,
      played,
      onSeekMouseDown,
      onSeekMouseUp,
      elapsedTime,
      totalDuration,
      onChangeDisplayFormat,
      addBookmark,
      notification,
      toggleActivePip
    } = props;

    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);
  
    const handlePopover = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'playbackrate-popover' : undefined;

    return (
        <div className="control-wrapper" ref={ref}>
            <div className="top-control">
            <Typography variant="h5" style={{ color: "#161617" }}>
                {notification}
            </Typography>
            <Button onClick={addBookmark} variant="text" style={{ color: "#161617" }}>
                <BookmarkIcon />
                BOOKMARK
            </Button>
            </div>
            <div className="medium-control">
              <div className="medium-left" onClick={handleRewind}>
                <FastRewindIcon fontSize="large" />
              </div>
              <div className="medium-center" onClick={togglePlay}>
                {playing ? <PauseIcon fontSize="large"/> : <PlayArrowIcon fontSize="large"/>}
              </div>
              <div className="medium-right" onClick={handleForward}>
                <FastForwardIcon fontSize="large"/>
              </div>
            </div>

            <div className="bottom-control">
            <div className="slider">
                <PrettoSlider onMouseDown={onSeekMouseDown} onChangeCommitted={onSeekMouseUp}
                  size="small"
                  min={0}
                  max={100}
                  aria-label="slide"
                  value={played * 100}
                />
            </div>
            <div className="control">
                <div className="left-container">
                <IconButton onClick={togglePlay} className={classes.bottomIcons} aria-label="play">
                    {playing ? <PauseIcon fontSize="inherit"  style={{ color: "#161617"}}/> : <PlayArrowIcon fontSize="inherit" style={{ color: "#161617"}}/>}
                </IconButton>
                <IconButton onClick={toggleMute} className={classes.bottomIcons} aria-label="volume">
                    {muted ? <VolumeOffIcon style={{ color: "#161617"}}/> : <VolumeUpIcon style={{ color: "#161617"}}/>}
                </IconButton>
                <Slider onChange={changeVolume}
                    size="small"
                    min={0}
                    max={100}
                    defaultValue={volume * 100}
                    style={{ width: "100px", color: "#161617" }}
                ></Slider>
                <Button onClick={onChangeDisplayFormat} variant="text" style={{ color: "#161617", marginLeft: 16 }}>
                    <Typography>{elapsedTime} / {totalDuration}</Typography>
                </Button>
                </div>
                <div className="right-container">
                <IconButton
                    onClick={handlePopover}
                    variant="text"
                    className={classes.bottomIcons}
                >
                    <Typography style={{color: "#161617"}}>{playbackRate}X</Typography>
                </IconButton>

                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                    }}
                    transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                    }}
                >
                    <Grid container direction="column-reverse">
                    {[0.5, 1, 1.5, 2].map((rate, index) => (
                        <IconButton key={index} onClick={() => changePlaybackRate(rate)} variant="text" className={classes.bottomIcons}>
                          <Typography style={{color: "#161617"}}>{rate}X</Typography>
                        </IconButton>
                    ))}
                    </Grid>
                </Popover>
                
                  <IconButton onClick = {toggleActivePip} className={classes.bottomIcons} aria-label="pip">
                      <PictureInPictureAltIcon style={{color: "#161617"}}/>
                  </IconButton>

                <IconButton onClick={toggleFullScreen}className={classes.bottomIcons} aria-label="fullscreen">
                    {fullScreen ? <FullscreenExitIcon style={{color: "#161617"}}/> : <FullscreenIcon style={{color: "#161617"}}/>}
                </IconButton>
                </div>
            </div>
            </div>
        </div>
    );
});