/**
 * TODO: add a layout template with back button for each project page
 */
import LRC from "@/data/lrc";
import styles from "@/styles/MusicPlayer.module.css";
import { useState, useRef, useMemo } from "react";

function parseLrc() {
  return LRC.split("\n")
    .map((lrcStr) => [...lrcStr.split("]")])
    .map((parts) => ({
      time: parts[0].substring(1),
      lyrics: parts[1],
    }));
}

function parseTime(timeStr) {
  const [mins, sec] = timeStr.split(":");
  return Number(mins) * 60 + Number(sec) + 3.3;
}

function getOffset(containerHeight, liToTop, totalLiHeight) {
  const halfContainer = Math.floor(containerHeight / 2);
  const diff = halfContainer - liToTop;
  const maxOffset = -(totalLiHeight - containerHeight);
  if (diff <= maxOffset) {
    return maxOffset;
  }
  if (diff < 0) {
    return diff;
  }
  return 0;
}

export default function MusicPlayerHome() {
  const data = parseLrc();
  const [lrcIndex, setLrcIndex] = useState(-1);
  const containerRef = useRef(null);
  const ulRef = useRef(null);
  const liRef = useRef(null);
  const containerHeight = useMemo(() => containerRef?.current?.clientHeight);
  const liHeight = useMemo(() => liRef?.current?.clientHeight);

  const getLrcIndex = (time) => {
    const length = data.length;
    for (let i = 0; i < length; i++) {
      if (time < parseTime(data[i].time)) {
        return i - 1;
      }
    }
    return length - 1;
  };

  const handleTimeUpdate = (e) => {
    const { currentTime } = e?.target ?? {};
    setLrcIndex(getLrcIndex(currentTime));
    const liToTop =
      lrcIndex < 0 ? 0 : liHeight * lrcIndex + Math.floor(liHeight / 2);
    const offset = getOffset(containerHeight, liToTop, data.length * liHeight);
    ulRef.current.style.transform = `translateY(${offset}px)`;
  };

  return (
    <div className={styles.root}>
      <audio
        onTimeUpdate={handleTimeUpdate}
        className={styles.audio}
        controls
        src='/assets/yequ.mp3'
      ></audio>
      <div ref={containerRef} className={styles.lyricsContainer}>
        <ul ref={ulRef} className={styles.lyrics}>
          {data.map((d, i) => (
            <li
              ref={liRef}
              key={i}
              className={i === lrcIndex ? styles.active : ""}
            >
              {d.lyrics}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
