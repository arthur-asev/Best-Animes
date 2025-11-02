
import VideoPlayer from '../../components/VideoPlayer/page.jsx';

export default function Page() {
  const videoUrl = "https://de.netmagcdn.com:2228/hls-playback/bc46bb8b581e8a4c2a8444adec9d7fe2e0d3fe743c99a7bd3f842d6fd924af83e1ee6763f55f70b1627f3209a6465350209ab3675dc3b6ae47636bec6fe236e01dd1b9cd2fb3bcace933e86adcb6bd43a789ea61b3b58f2b8e846a3df65c87dbeb97927680241f8e404bcdd0d70c1c3b63ab84a4dc2d482d8dc7079268f5e5a02279df51d48b4faab9a9f7141f02f69a/master.m3u8";

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>🎬 Player com Proxy Axios</h1>
      <VideoPlayer src={videoUrl} />
    </div>);
} 