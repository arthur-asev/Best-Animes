
import VideoPlayer from '../../components/VideoPlayer/page.jsx';

export default function Page() {
  const videoUrl =
    "https://dh.netmagcdn.com:2228/hls-playback/bc46bb8b581e8a4c2a8444adec9d7fe2e0d3fe743c99a7bd3f842d6fd924af83e1ee6763f55f70b1627f3209a6465350240a8e5ad6ba7eec0b5553216c3d6b274f2941026f5dd96f090cf3bd3ecce6c50cb165b0a197498e0f883212e9e5dab128804441933222608109a42d56dc498d8a883b365972374ab485201727fd651b1c86ce4bdfdc45f18f5652ae11c5bcde/master.m3u8";

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>🎬 Player com Proxy Axios</h1>
      <VideoPlayer src={videoUrl} />
    </div>);
}