import Link from "next/link";
import LRC from "../../data/lrc";

function parseLrc() {
  return LRC.split("\n")
    .map((lrcStr) => [...lrcStr.split("]")])
    .map((parts) => ({
      time: parts[0].substring(1),
      lyrics: parts[1],
    }));
}

export default function MusicPlayerHome() {
  const data = parseLrc();
  return (
    <div>
      <audio controls src='/assets/yequ.mp3'></audio>
      <ul>
        {data.map((d) => (
          <li>{d.lyrics}</li>
        ))}
      </ul>
    </div>
  );
}
