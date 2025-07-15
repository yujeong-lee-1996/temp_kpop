# flask-server/pipeline/similarity/main.py

import os
import json
import numpy as np

from .data_utils      import load_mediapipe_json
from .angle_utils     import calc_interior_angles_2d, angle_diff
from .similarity_utils import compute_frame_similarities, aggregate_per_second, identify_misaligned_joints
from .feedback_utils  import generate_frame_feedback
from .data_utils import normalize_keypoints, smooth_keypoints, interpolate_missing

def compute_feedback(
    ref_json: str,
    user_json: str,
    fps: int = 30,
    angle_report_thresh: float = 10.0,
    proc_thresh: float = 0.1
) -> tuple[str, str]:
    """
     ref_json/user_json: keypoints JSON 경로
     실행 후 (feedback.json 경로, scores.json 경로)를 반환
    """
    # 1) 원본 로드
    kp_ref_raw, vis_ref   = load_mediapipe_json(ref_json)
    kp_user_raw, vis_user = load_mediapipe_json(user_json)

    # 2) 전처리
    kp_ref  = normalize_keypoints(smooth_keypoints(interpolate_missing(kp_ref_raw, vis_ref)))
    kp_user = normalize_keypoints(smooth_keypoints(interpolate_missing(kp_user_raw, vis_user)))

    # 3) 유사도 계산
    res = compute_frame_similarities(kp_ref, kp_user, angle_weight=0.6)
    # 4) 차이가 큰 프레임/관절 탐지
    dyn_thresh = np.percentile(res['angle_diffs'].flatten(), 95)
    bad_frames, _ = identify_misaligned_joints(
        res['angle_diffs'], res['proc_dists'],
        angle_thresh=dyn_thresh,
        proc_thresh=proc_thresh
    )

    # 5) 피드백 메시지 생성
    angle_rad = np.deg2rad(angle_report_thresh)
    feedback = {}
    for t in bad_frames:
        msgs = generate_frame_feedback(kp_ref_raw[t], kp_user_raw[t], angle_thresh=angle_rad)
        feedback[t] = msgs

    # 6) 저장 및 경로 반환
    feedback_path = os.path.join(os.path.dirname(ref_json), "feedback.json")
    with open(feedback_path, 'w', encoding='utf-8') as f:
        json.dump(feedback, f, ensure_ascii=False, indent=2)


    # 7) 유사도 점수 JSON 저장
    #    frame별 최종 final_scores 와 초별 sec_scores
    final_scores = res['final']
    sec_scores   = aggregate_per_second(final_scores, fps)
    scores_dict = {
        "frame_scores": final_scores.tolist(),
        "second_scores": sec_scores.tolist()
    }
    scores_path = os.path.join(os.path.dirname(ref_json), "scores.json")
    with open(scores_path, 'w', encoding='utf-8') as f:
        json.dump(scores_dict, f, ensure_ascii=False, indent=2)

    return feedback_path, scores_path


