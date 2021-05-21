import AgoraRTC from "agora-rtc-sdk-ng";
import { useEffect } from "react";
import MediaPlayer from "./MediaPlayer";
import "./Agora.css";

const rtc = {
  client: null,
  localAudioTrack: null,
  localVideoTrack: null,
};

const options = {
  appID: "71b833f6de43406889a99afb31faf75c",
  channel: "cambit-live",
  token:
    "00671b833f6de43406889a99afb31faf75cIAC6c1Tp82snEwnrENseG/vGo1E1aU3jvbBCht0Ty2yTZUmx8WYAAAAAEAA7EFxEWX6oYAEAAQBZfqhg",
};

function Host() {
  useEffect(() => {
    stream();
  }, []);

  //   useEffect(() => {
  //     if (!container.current) return;
  //     props.videoTrack?.play(container.current);
  //     return () => {
  //       props.videoTrack?.stop();
  //     };
  //   }, [container, props.videoTrack]);
  //   useEffect(() => {
  //     props.audioTrack?.play();
  //     return () => {
  //       props.audioTrack?.stop();
  //     };
  //   }, [props.audioTrack]);

  async function stream() {
    rtc.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });

    await rtc.client.setClientRole("host");

    rtc.client.on("user-published", async (user, mediaType) => {
      await rtc.client.subscribe(user, mediaType);
      // this.setState({
      //   remote: true,
      // });
      if (mediaType === "video") {
        const remoteVideoTrack = user.videoTrack;

        remoteVideoTrack.play("remote-stream");
      }

      if (mediaType === "audio") {
        const remoteAudioTrack = user.audioTrack;
        remoteAudioTrack.play();
      }
    });

    const uid = await rtc.client.join(
      options.appId,
      options.channel,
      options.token
    );

    // Capture the video from the camera
    rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();

    // Sample the audio from the microphone
    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();

    await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);
  }

  return (
    <div className="call">
      <div className="player-container">
        <div className="local-player-wrapper">
          <MediaPlayer
            videoTrack={rtc.localVideoTrack}
            audioTrack={rtc.localAudioTrack}
          ></MediaPlayer>
        </div>
      </div>
    </div>
  );
}

export default Host;
