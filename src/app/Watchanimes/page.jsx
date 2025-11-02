
import VideoPlayer from '../../components/VideoPlayer/page.jsx';

export default function Page() {
  const videoUrl = "https://dl.netmagcdn.com:2228/hls-playback/c81e0320ba619de237ee247b52d3bdb125d2e6f8f49bde94765ddd259c441a7b92faaefc4917c4cbabf53cd36a63cfbee5ae703ced43652ef488dcee5291e5ccd66ce530eefd07c7e7db5f3fa7fc369a1189e879615d14fd47ccda3b7aeeeda883a051268212818f60697375323da7e4e69cdfcbf889a9bef1eb4af62a867107300d250275d78973264094c1971126eb/master.m3u8";

  
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>🎬 Player com Proxy Axios</h1>
      <VideoPlayer src={videoUrl} />
    </div>);
} 