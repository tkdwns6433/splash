# splash
Splash는 오픈소스 미디어 서버입니다.

## 특징
 - 스트리밍(.mp4, h265, aac) 가능한 웹 페이지 제공
 - Admin 페이지를 통해 브라우저 환경에서 원격으로 파일 업로드, 관리 가능
 - 영상 업로드 시 원하는 미디어 포맷으로 자동 인코딩
 - 영상 업로드 시 OMDb API를 통해 메타 데이터 저장 및 웹 페이지에서 제공
 - restServer 제공
 
## 스트리밍 서버
Nginx 웹 서버, Nginx-vod-module

## 프론트 엔드
pug html 템플릿 엔진, Bootstrap

## 백엔드
Node JS, MongoDB
