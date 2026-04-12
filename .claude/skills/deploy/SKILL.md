---
name: deploy
description: game-web 빌드, 테스트, 커밋, 배포 전체 파이프라인
disable-model-invocation: true
allowed-tools: Bash Read Glob Grep
---

game-web 앱인토스 배포 파이프라인을 실행합니다.

## 단계

1. **테스트**: `pnpm test` 실행. 실패 시 중단.
2. **빌드**: `pnpm build` 실행. 실패 시 중단.
3. **변경사항 확인**: `git status`로 커밋할 내용 확인. 변경 없으면 4번으로.
4. **커밋 & 푸시**: 변경사항이 있으면 커밋 후 `git push origin main`.
5. **배포**: `npx ait deploy` 실행.
6. **결과 출력**: 배포 URL과 deploymentId 출력.

## 주의사항

- `pnpm deploy`는 사용 불가 (workspace 전용). 반드시 `npx ait deploy` 사용.
- 커밋 메시지는 변경 내용을 간결하게 요약.
- 테스트 실패 시 배포하지 않고 원인을 보고.
