// src/pages/IndexPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import VideoUploadCard from '../components/VideoUploadCard';

export default function IndexPage() {
  const [dancer, setDancer]   = useState(null);
  const [trainee, setTrainee] = useState(null);
  const [finalVideo, setFinalVideo] = useState(null);
  const [durations, setDurations]   = useState(null);

  const startCompare = async () => {
    if (!dancer || !trainee) return;

    const form = new FormData();
    form.append('dancer', dancer);
    form.append('trainee', trainee);

    try {
      const res = await axios.post(
        '/compare/',
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      console.log('서버 응답:', res.data);
      setFinalVideo(`/data/${res.data.final_video}`);
      setDurations(res.data.durations);
    } catch (err) {
      console.error(err);
      alert('서버 호출 중 에러가 발생했습니다');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-6">영상 업로드</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 justify-items-center">
        <div className="w-full max-w-lg">
          <VideoUploadCard
            label="댄서 영상 업로드"
            file={dancer}
            onChange={file => setDancer(file)}
            inputId="dancer-input"
          />
        </div>
        <div className="w-full max-w-lg">
          <VideoUploadCard
            label="연습생 영상 업로드"
            file={trainee}
            onChange={file => setTrainee(file)}
            inputId="trainee-input"
          />
        </div>
      </div>
      <div className="flex justify-center mb-8">
        <button
          onClick={startCompare}
          disabled={!(dancer && trainee)}
          className="
            bg-red-300 hover:bg-red-400 text-white p-4 flex justify-center
            rounded-lg transition-colors duration-200 ease-in-out
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-200
          "
        >
          비교 시작
        </button>
      </div>

      {finalVideo && (
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">결과 비디오</h3>
          <video controls src={finalVideo} className="w-full max-w-3xl mx-auto" />
        </div>
      )}

      {durations && (
        <div className="mt-6 text-center">
          <h4 className="font-medium">소요 시간 (초)</h4>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(durations, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
