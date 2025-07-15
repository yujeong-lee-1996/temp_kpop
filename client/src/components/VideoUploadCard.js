// src/components/VideoUploadCard.jsx
import React, { useEffect, useState } from 'react';

export default function VideoUploadCard({
  label,       // 카드 상단 제목
  file,        // 선택된 File 객체
  onChange,    // 파일이 선택되었을 때 호출되는 콜백 (file: File) => void
  inputId      // 고유한 input id
}) {
  const [preview, setPreview] = useState(null);

  // file이 바뀔 때마다 preview URL 생성/해제
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // 파일 유무에 따라 드롭존 높이 조절
  const dropZoneHeight = file ? 'h-12' : 'h-64';

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">
        {label}
      </h3>

      {/* 실제 파일 input (보이지 않음) */}
      <input
        id={inputId}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={e => {
          const selected = e.target.files && e.target.files[0];
          if (selected) {
            onChange(selected);
          }
          // 취소했을 땐 아무 변화 없음
          // 같은 파일 재선택을 위해 value 초기화
          e.target.value = '';
        }}
      />

      {/* 비디오 미리보기 */}
      {preview && (
        <video
          src={preview}
          controls
          className="w-full rounded-lg mb-4"
        />
      )}

      {/* 드롭존 / 파일 선택 영역 */}
      <label
        htmlFor={inputId}
        className={`
          border-2 border-pink-200 border-dashed
          rounded-lg
          ${dropZoneHeight}   /* 동적 높이 */
          px-4 mb-4
          flex items-center justify-center
          text-pink-400 font-medium
          cursor-pointer transition-colors duration-200
          hover:border-pink-300 hover:text-pink-600
        `}
      >
        {file ? '파일 교체' : '파일 업로드'}
      </label>
    </div>
  );
}