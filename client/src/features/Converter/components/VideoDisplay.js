import {useState, useRef} from 'react';
import ReactPlayer from "react-player";
import PlayerControls from './PlayerControls';
import screenfull from 'screenfull';
import {Paper, Grid, Typography} from "@mui/material";

var config = {
  autoStartLoad: true,
  startPosition: -1,
  debug: false,
  capLevelOnFPSDrop: false,
  capLevelToPlayerSize: false,
  defaultAudioCodec: undefined,
  initialLiveManifestSize: 1,
  maxBufferLength: 30,
  maxMaxBufferLength: 600,
  backBufferLength: Infinity,
  maxBufferSize: 60 * 1000 * 1000,
  maxBufferHole: 0.5,
  highBufferWatchdogPeriod: 2,
  nudgeOffset: 0.1,
  nudgeMaxRetry: 3,
  maxFragLookUpTolerance: 0.25,
  liveSyncDurationCount: 3,
  liveMaxLatencyDurationCount: Infinity,
  liveDurationInfinity: false,
  enableWorker: true,
  enableSoftwareAES: true,
  manifestLoadingTimeOut: 10000,
  manifestLoadingMaxRetry: 1,
  manifestLoadingRetryDelay: 1000,
  manifestLoadingMaxRetryTimeout: 64000,
  startLevel: undefined,
  levelLoadingTimeOut: 10000,
  levelLoadingMaxRetry: 4,
  levelLoadingRetryDelay: 1000,
  levelLoadingMaxRetryTimeout: 64000,
  fragLoadingTimeOut: 20000,
  fragLoadingMaxRetry: 6,
  fragLoadingRetryDelay: 1000,
  fragLoadingMaxRetryTimeout: 64000,
  startFragPrefetch: false,
  testBandwidth: true,
  progressive: false,
  lowLatencyMode: true,
  fpsDroppedMonitoringPeriod: 5000,
  fpsDroppedMonitoringThreshold: 0.2,
  appendErrorMaxRetry: 3,
  enableWebVTT: true,
  enableIMSC1: true,
  enableCEA708Captions: true,
  stretchShortVideoTrack: false,
  maxAudioFramesDrift: 1,
  forceKeyFrameOnDiscontinuity: true,
  abrEwmaFastLive: 3.0,
  abrEwmaSlowLive: 9.0,
  abrEwmaFastVoD: 3.0,
  abrEwmaSlowVoD: 9.0,
  abrEwmaDefaultEstimate: 500000,
  abrBandWidthFactor: 0.95,
  abrBandWidthUpFactor: 0.7,
  abrMaxWithRealBitrate: false,
  maxStarvationDelay: 4,
  maxLoadingDelay: 4,
  minAutoBitrate: 0,
  emeEnabled: false,
  widevineLicenseUrl: undefined,
  licenseXhrSetup: undefined,
  drmSystemOptions: {},
};

const format = (seconds) => {
  if(isNaN(seconds)) {
    return '00:00';
  }

  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2,"0");
  if(hh){
    return `${hh}:${mm.toString().padStart(2,"0")}:${ss}`
  }

  return `${mm}:${ss}`;
}

let count = 0;

function VideoDisplay({video}) {
  const [state, setState] = useState({
    notification: "",
    playing: false,
    muted: true,
    volume: 0.5,
    playbackRate: 1.0,
    fullScreen: false,
    seeking: false,
    played: 0
  });

  const [timeDisplayFormat, setTimeDisplayFormat] = useState("normal");
  const [bookmarks, setBookmarks] = useState([]);
  const [activePip, setActivePip] = useState(false);

  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const controlsRef = useRef(null);

  const togglePlay = () => {
    setState({...state, playing: !state.playing});
  }

  const handleRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 5, 'seconds');
  }

  const handleForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 5, 'seconds');
  }

  const toggleMute = () => {
    setState({
      ...state, muted: !state.muted
    })
  }

  const changeVolume = (event) => {
    setState({
      ...state, volume: Number(event.target.value) / 100, muted: event.target.value === 0 ? true : false
    })
  }

  const changePlaybackRate = (rate) => {
    setState({
      ...state, playbackRate: Number(rate)
    })
  }

  const toggleFullScreen = () => {
    setState({
      ...state, fullScreen: !state.fullScreen
    });
    screenfull.toggle(containerRef.current);
  }

  const handleProgress = (progress) => {
    if(count > 3){
      controlsRef.current.style.visibility = "hidden";
      count = 0;
    }

    if(controlsRef.current.style.visibility == "visible") {
      console.log(count);
      count = count + 1;
    }

    if(!state.seeking) {
      setState({
        ...state, played: progress.played
      });
    }
  }

  const handleSeekMouseDown = (e) => {
    setState({
      ...state, seeking: true
    })
  }

  const handleSeekMouseUp = (e, newValue) => {
    setState({
      ...state, seeking: false, played: parseFloat(newValue / 100)
    });
    playerRef.current.seekTo(newValue/100);
  }

  const handleChangeDisplayFormat = () => {
    setTimeDisplayFormat(
      timeDisplayFormat==='normal'? 'remaining' : 'normal'
    );
  }

  const addBookmark = () => {
    const canvas = canvasRef.current;
    canvas.width = 160;
    canvas.height = 90;

    const ctx = canvas.getContext("2d");

    // Cần tìm hiểu thêm:
    ctx.drawImage(playerRef.current.getInternalPlayer(), 0, 0, canvas.width, canvas.height); 

    const imageUrl = canvas.toDataURL();
    canvas.width = 0;
    canvas.height = 0;
    setBookmarks([
      ...bookmarks,
      {time: currentTime, display: elapsedTime, image: imageUrl}
    ])
  }

  const handleEnded = () => {
    setState({...state, playing: false})
  }

  const handleMouseMove = () => {
    controlsRef.current.style.visibility = "visible";
    count = 0;
  };

  const toggleActivePip = () => {
    setActivePip(!activePip);
  }

  const handleReady = (e) => {
    fetch(video)
    .then(result => result.text())
    .then(textValue => {
      const array_text = textValue.split('\n');
      const notification_fil = array_text.filter((oneLine) => oneLine.match("#NOTIFICATION"));
      if(notification_fil.length > 0) {
        const notification = notification_fil[0].split('=')[1];
        setState({...state, notification});
      }
    });
  }
  const currentTime = playerRef.current ? playerRef.current.getCurrentTime() : "00:00";
  const duration = playerRef.current ? playerRef.current.getDuration() : "00:00";
  
  const elapsedTime = timeDisplayFormat === "normal" ? format(currentTime) : `-${format(duration - currentTime)}`;
  const totalDuration = format(duration);

  return (
    <div className="main-video-container">
      <div 
        ref={containerRef} 
        className="video-container"
        onMouseMove={handleMouseMove}
      >
        <div className="video-wrapper">
          <ReactPlayer
            ref={playerRef}
            width="inherit"
            height="inherit"
            url={video}
            controls={false}
            playing={state.playing}
            muted={state.muted}
            volume={state.volume}
            playbackRate={state.playbackRate}
            onProgress={handleProgress}
            onEnded={handleEnded}
            onReady={handleReady}
            pip={activePip}
            stopOnUnmount={true}
            config={{
              file: {
                forceVideo: true,
                forceHLS: true,
                hlsOptions: {config},
                forceDASH: true
              }
            }}
          >
          </ReactPlayer>
          <PlayerControls  
            notification={state.notification}
            ref={controlsRef}
            togglePlay={togglePlay}
            playing={state.playing}
            handleRewind={handleRewind}
            handleForward={handleForward}
            muted={state.muted}
            toggleMute={toggleMute}
            volume={state.volume}
            changeVolume={changeVolume}
            playbackRate={state.playbackRate}
            changePlaybackRate={changePlaybackRate}
            fullScreen={state.fullScreen}
            toggleFullScreen={toggleFullScreen}
            played={state.played}
            onSeekMouseDown={handleSeekMouseDown}
            onSeekMouseUp={handleSeekMouseUp}
            elapsedTime={elapsedTime}
            totalDuration={totalDuration}
            onChangeDisplayFormat={handleChangeDisplayFormat}
            addBookmark={addBookmark}
            toggleActivePip={toggleActivePip}
            activePip={activePip}
          />
        </div>
      </div>
        <Grid container style={{marginTop:20, cursor: "pointer"}} className="bookmarks" spacing={3}>
          {bookmarks.map((bookmark, index) => 
            <Grid onClick={() => playerRef.current.seekTo(bookmark.time)} item key={index}>
              <Paper>
                <img crossOrigin="anomyous" src={bookmark.image} />
                <Typography>
                  Bookmark at {format(bookmark.time)}
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>

        <canvas ref={canvasRef} />
    </div>
  );
}

export default VideoDisplay;