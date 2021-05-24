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
    "00671b833f6de43406889a99afb31faf75cIABUg35RVQZTTCDUFB36NAL9e+wRYkSmOk0jiBkzPbgbUUmx8WYAAAAAEAA7EFxErYWsYAEAAQCqhaxg",
};

function Audience() {
  useEffect(() => {
    joinCall();
  }, []);

  async function joinCall() {
    rtc.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });

    await rtc.client.setClientRole("audience");

    const uid = await rtc.client.join(
      options.appId,
      options.channel,
      options.token,
      null
    );

    rtc.client.on("user-published", async (user, mediaType) => {
      // Subscribe to a remote user.
      await rtc.client.subscribe(user, mediaType);
      console.log("subscribe success");

      // If the subscribed track is video.
      if (mediaType === "video") {
        // Get `RemoteVideoTrack` in the `user` object.
        const remoteVideoTrack = user.videoTrack;
        // Dynamically create a container in the form of a DIV element for playing the remote video track.
        const playerContainer = document.createElement("div");
        // Specify the ID of the DIV container. You can use the `uid` of the remote user.
        playerContainer.id = user.uid.toString();
        playerContainer.style.width = "720px";
        playerContainer.style.height = "1280px";
        document.body.append(playerContainer);

        // Play the remote video track.
        // Pass the DIV container and the SDK dynamically creates a player in the container for playing the remote video track.
        remoteVideoTrack.play(playerContainer);

        // Or just pass the ID of the DIV container.
        // remoteVideoTrack.play(playerContainer.id);
      }

      // If the subscribed track is audio.
      if (mediaType === "audio") {
        // Get `RemoteAudioTrack` in the `user` object.
        const remoteAudioTrack = user.audioTrack;
        // Play the audio track. No need to pass any DOM element.
        remoteAudioTrack.play();
      }
    });
  }

  async function leaveCall() {
    // Destroy the local audio and video tracks.
    rtc.localAudioTrack.close();
    rtc.localVideoTrack.close();

    // Traverse all remote users.
    rtc.client.remoteUsers.forEach((user) => {
      // Destroy the dynamically created DIV container.
      const playerContainer = document.getElementById(user.uid);
      playerContainer && playerContainer.remove();
    });

    // Leave the channel.
    await rtc.client.leave();
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

export default Audience;
