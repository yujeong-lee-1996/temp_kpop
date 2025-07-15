import React, { useState, useEffect, useRef } from 'react';

const formatTime = sec => {
  const m = String(Math.floor(sec/60)).padStart(2,'0');
  const s = String(sec % 60).padStart(2,'0');
  return `${m}:${s}`;
};

export default function TestViewer() {
  const jobId = "75352c72579b47f2afea36edf2f23b4f";
  const [scores, setScores]         = useState([]);
  const [feedback, setFeedback]     = useState({});
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const videoRef = useRef();
  const threshold = 0.8;

  useEffect(() => {
    fetch(`/data/${jobId}/dancer_kp/scores.json`)
      .then(r=>r.json()).then(j=>setScores(j.frame_scores||[]));
    fetch(`/data/${jobId}/dancer_kp/feedback.json`)
      .then(r=>r.json()).then(j=>setFeedback(j));
  }, []);

  const onTimeUpdate = () => {
    if (!videoRef.current) return;
    const t = Math.floor(videoRef.current.currentTime);
    const msgs = feedback[t];
    // 1) 빈 배열 or undefined → skip
    if (!msgs || msgs.length === 0) return;
    // 2) similarity가 threshold 이상이면 skip
    if (scores[t] !== undefined && scores[t] >= threshold) return;

    // 3) “선생님 XX.X°” 과 “학생 YY.Y°” 추출해서
    //    둘 다 0° 이상인 메시지만 남기기
    const valid = msgs.filter(msg => {
      const tea = msg.match(/선생님\s*([\d.]+)°/);
      const stu = msg.match(/학생\s*([\d.]+)°/);
      if (!tea || !stu) return false;
      return parseFloat(tea[1]) > 0 && parseFloat(stu[1]) > 0;
    });
    if (valid.length === 0) return;

    // 4) 이미 기록된 시간인지 중복 체크
    const ts = formatTime(t);
    if (feedbackHistory.some(e => e.time === ts)) return;

    // 5) 히스토리에 추가
    setFeedbackHistory(prev => [
      ...prev,
      { time: ts, msgs: valid }
    ]);
  };

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold">Test Viewer</h2>

      <video
        ref={videoRef}
        src={`/data/${jobId}/final_feedback_with_audio.mp4`}
        controls
        onTimeUpdate={onTimeUpdate}
        className="w-full max-w-2xl mx-auto border"
      />

      {feedbackHistory.length > 0 && (
        <div
          className="
            mt-6 p-4 bg-yellow-100 rounded shadow
            max-h-64 overflow-y-auto   /* ← 여기 */
            space-y-4
          "
        >
          <h3 className="font-semibold mb-2">피드백 히스토리</h3>
          {feedbackHistory.map((entry, idx) => (
            <div key={idx} className="mb-3">
              <div className="font-medium mb-1">⏱ {entry.time}</div>
              <ul className="list-disc list-inside text-sm">
                {entry.msgs.map((m,i) => <li key={i}>{m}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
