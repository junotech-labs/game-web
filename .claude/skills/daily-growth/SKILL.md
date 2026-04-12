---
name: daily-growth
description: 일일 서비스 지표 수집 및 요약 리포트
allowed-tools: Bash Read Write Glob
---

common-sense 미니앱의 일일 성장 지표를 수집하고 요약합니다.

## 단계

1. **일일 집계 트리거**:
   ```
   curl -X POST https://api-common-sense.junogarden.com/analytics/aggregate
   ```

2. **7일 요약 수집**:
   ```
   curl https://api-common-sense.junogarden.com/analytics/summary
   ```
   결과를 `game-api/data/snapshots/$(date +%Y-%m-%d).json`에 저장.

3. **콘솔 엑셀 파싱** (새 파일이 있는 경우):
   `game-api/data/exports/`에 새 xlsx 파일이 있으면:
   ```
   python3 game-api/scripts/parse_console_export.py
   ```

4. **요약 출력**: 세션 수, 완료율, 평균 정확도, 카테고리별 현황을 간결하게 출력.
