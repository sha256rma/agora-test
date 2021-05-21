import { useRef, useEffect } from "react";

const MediaPlayer = (props) => {
  const container = useRef(null);
  useEffect(() => {
    if (!container.current) return;
    props.videoTrack?.play(container.current);
    return () => {
      props.videoTrack?.stop();
    };
  }, [container, props.videoTrack]);
  useEffect(() => {
    props.audioTrack?.play();
    return () => {
      props.audioTrack?.stop();
    };
  }, [props.audioTrack]);
  return (
    <div
      ref={container}
      className="video-player"
      style={{ width: 500, height: 500 }}
    ></div>
  );
};

export default MediaPlayer;
