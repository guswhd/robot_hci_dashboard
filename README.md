# 🤖 Robot HCI Dashboard Project

## 📌 프로젝트 개요
이 프로젝트는 **로봇을 제어하고 상태를 모니터링할 수 있는 웹 기반 HCI(Human-Computer Interaction) 대시보드**를 제작하는 것을 목표로 합니다.  
특히 **생산 공장(HMI) 스타일**을 참고하여, 실제 산업 현장에서 사용하는 것처럼 직관적이고 실시간 반응이 가능한 UI/UX를 구현합니다.  

본 프로젝트는 **생성형 AI를 활용한 개발 지원**을 통해 설계/구현 과정을 효율화하였습니다.

---

## 🎯 주요 목표
- 시맨틱 HTML 마크업을 통한 구조적 설계
- CSS Flexbox/Grid를 활용한 공장 HMI 스타일 레이아웃 구현
- JavaScript(바닐라 JS) 기반의 동적 UI 제어 및 이벤트 처리
- 다중 페이지 구조 (Controller, Visualization, Status, Log)
- 사용자 입력에 따른 실시간 데이터 반영
- 초기화 및 JSON 저장 기능 제공

---

## 🛠️ 기술 스택
- **Frontend**: HTML5 / CSS3 / JavaScript (Vanilla)
- **IDE & Tools**: VSCode, Chrome Developer Tools
- **Version Control**: Git, GitLab
- **AI 활용**: ChatGPT를 활용한 코드 생성, UI/UX 아이디어 제안, 문서 작성 지원

---

## 📂 프로젝트 구조
```
robot-hci-dashboard/
│
├── index.html              # 메인 대시보드
├── pages/
│   ├── controller.html      # 제어 페이지 (속도, 회전각, IO)
│   ├── visualization.html   # 상태 시각화 페이지
│   ├── status.html          # 상태 모니터링 페이지
│   └── log.html             # 제어 이력 로그
│
├── styles/
│   ├── base.css
│   ├── layout.css
│   └── theme.css
│
├── js/
│   ├── controller.js
│   ├── visualization.js
│   ├── status.js
│   └── log.js
│
├── img/                    # 아이콘 및 UI 리소스
└── README.md
```

---

## 📑 기능 명세

### ✅ 필수 기능
1. **속도 제어**: 로봇의 이동 속도 조절 (슬라이더)
2. **회전각 제어**: 로봇의 회전각 조절 (슬라이더/게이지)
3. **디지털 I/O 제어**: 로봇의 디지털 신호 On/Off
4. **아날로그 I/O 제어**: 아날로그 값 입력 및 출력 시각화

### ➕ 추가 기능
- **초기화**: 전체 제어 값을 초기화
- **저장**: 입력한 값을 JSON 파일로 저장

### 💡 추가 제안 기능
- **실시간 데이터 시각화**: 센서 데이터를 실시간 차트로 표시 (예: 모터 온도, 전력 소모량)
- **사용자 인증**: 간단한 로그인 기능으로 대시보드 접근 제어
- **긴급 정지 버튼**: 모든 동작을 즉시 멈추는 비상 버튼 추가

---

## 📊 UI/UX 특징
- **어두운 테마 + 경고 색상 강조**  
  - 검정/회색 배경  
  - 초록(정상), 노랑(경고), 빨강(위험) 색상 포맷  
- **카드형 위젯 레이아웃**  
  - 속도, 회전각, I/O 제어 모듈을 위젯 단위로 구성  
- **실시간 반응형**  
  - 사용자 입력 시 즉시 대시보드에 반영  

---

## 🚀 설치 및 실행 방법
1. 저장소 클론
   ```bash
   git clone https://gitlab.com/your-repo/robot-hci-dashboard.git
   ```
2. 프로젝트 폴더로 이동
   ```bash
   cd robot-hci-dashboard
   ```
3. 로컬 실행 (예: VSCode Live Server 사용)
   ```bash
   open index.html
   ```
4. 웹 브라우저에서 대시보드를 확인

---

## 📅 프로젝트 진행 과정
- 요구사항 정의 및 AI 기반 분석
- 레이아웃 및 UI 와이어프레임 설계
- 기본 페이지 및 스타일 구현
- 제어 기능 구현 (JS 기반)
- 추가 기능(초기화/저장) 확장
- GitLab 업로드 및 산출물 정리

---

## 🤝 팀 협업
- 역할 분담: UI 설계 / 기능 구현 / 데이터 관리 / 문서화
- Git을 통한 버전 관리 및 코드 공유
- 생성형 AI(ChatGPT) 활용:
  - 기능 명세 및 요구사항 분석
  - 코드 스니펫 및 오류 해결 가이드
  - README 및 산출물 문서 작성 보조

---

## 📌 기대 효과
- 실제 공장 HMI 환경과 유사한 로봇 제어 경험 제공
- 생성형 AI 활용으로 개발 효율 및 품질 향상
- 웹 기술 기반의 확장성 있는 대시보드 템플릿 확보
