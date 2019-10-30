# splash
Splash는 미디어서버 개발을 쉽게 시작할 수 있도록 도와주는 오픈소스 미디어 서버 보일러플레이트 입니다. 

## 특징
 - 스트리밍(.mp4, h264, aac) 가능한 플레이어가 내장된 프론트엔드 제공
 - Admin 페이지를 통해 브라우저 환경에서 원격으로 파일 업로드, 관리(삭제, 이름바꾸기, 디렉토리 생성) 가능
 - 영상 업로드 시 원하는 미디어 포맷으로 인코딩 자동화(ffmpeg 필요)
 - 영상 업로드 시 OMDb API를 통해 메타 데이터 저장 및 프론트엔드에서 메타데이터 제공
 - 프론트엔드에서 메타 데이터 기반 카테고리 기반 뎁스 편성 가능
 - splash는 ubuntu 18.04 환경에서 테스트 되었으며 프론트엔드는 파이어폭스, 크롬, 엣지에서 동작합니다.
 
## 설치
 - Nginx & Nginx-Vod-Module 설치(https://github.com/kaltura/nginx-vod-module)
 - Node JS 설치
 - MongoDB 
 - splash 클론
 - splash/etc 에 nginx.conf 설정 파일 nginx/conf 폴더에 붙여넣기
 - nginx 웹서버 실행
 - splash 폴더에서 app.js, restServer.js 실행
 - 127.0.0.1/home 접속(프론트엔드)
 - 127.0.0.1/admin 접속(관리자페이지)
 
## 스트리밍 서버
Nginx 웹 서버, Nginx-vod-module

## 프론트 엔드
pug html 템플릿 엔진, Bootstrap

## 백엔드(REST API)
Node JS(express), MongoDB

## 파일 구조
app.js<br>
: express 웹 서버<br>
restServer.js<br>
: REST API 서버<br>
views<br>
: pug html 템플릿 파일, js 파일<br>
models<br>
: 데이터 처리<br>
routes<br>
: REST API 라우터 파일<br>
etc<br>
: 기타 파일(nginx 설정 파일) <br>
schemas<br>
: mongoDB 연결, 메타데이터 스키마 정의<br>
test.js<br>
: router 테스트 파일(모카, 이스탄불 기반)<br>
image<br>
: 기타 이미지 파일<br>
