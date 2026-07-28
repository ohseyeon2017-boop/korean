import { LearningLog } from "../types";

// Send student learning record to Google Apps Script Web App URL
export async function sendLearningLogToGAS(
  gasUrl: string,
  log: LearningLog
): Promise<{ success: boolean; message: string }> {
  if (!gasUrl || !gasUrl.trim().startsWith("http")) {
    return {
      success: false,
      message: "구글 시트 연동 URL이 설정되지 않았습니다. [교사 설정]에서 GAS Web App URL을 등록해주세요.",
    };
  }

  try {
    const payload = JSON.stringify(log);

    // Using fetch with mode: 'no-cors' so browser won't fail cross-origin Google Apps Script redirects
    await fetch(gasUrl.trim(), {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload,
    });

    return {
      success: true,
      message: "구글 시트로 학습 기록이 정상 전송되었습니다!",
    };
  } catch (err: any) {
    console.error("GAS Sync Error:", err);
    return {
      success: false,
      message: "구글 시트 전송 중 오류 발생: " + (err.message || "네트워크 문제"),
    };
  }
}

// Generates copyable Google Apps Script (Code.gs) code for teacher setup
export const GAS_SCRIPT_CODE_TEMPLATE = `/**
 * [한빛 한글 샘] 구글 시트 연동용 Apps Script (Code.gs)
 * 
 * [설치 및 배포 방법]
 * 1. 구글 드라이브에서 새 '구글 스프레드시트' 생성
 * 2. 상단 메뉴 [확장 프로그램] -> [Apps Script] 클릭
 * 3. 아래 코드를 기존 내용 지우고 전체 복사하여 붙여넣기
 * 4. [저장] 아이콘(ctrl+s) 클릭
 * 5. 우측 상단 [배포] 버튼 -> [새 배포] 클릭
 * 6. 톱니바퀴 클릭 -> [웹 앱] 선택
 * 7. 다음 항목 설정:
 *    - 설명: 한글 AI 튜터 데이터 저장
 *    - 다음 사용자 권한으로 실행: 나 (Me)
 *    - 액세스 권한이 있는 사용자: 누구나 (Anyone)  <-- 중요!
 * 8. [배포] 버튼 클릭 -> 액세스 승인 진행 -> 생성된 '웹 앱 URL' 복사!
 * 9. 웹앱의 [교사 설정 ⚙️] 창 '구글 시트 GAS Web App URL' 항목에 붙여넣기!
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 헤더 행이 없다면 생성
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "기록 일시",
        "학생 이름",
        "공부한 단어/자모 수",
        "퀴즈 정답률",
        "따라쓰기 완료 수",
        "공부 시간(분)",
        "타임스탬프"
      ]);
      // 헤더 서식 변경 (연한 초록색 배경, 굵게)
      sheet.getRange(1, 1, 1, 7).setBackground("#E6F4EA").setFontWeight("bold");
    }

    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.date || new Date().toLocaleString("ko-KR"),
      data.studentName || "익명 친구",
      data.learnedWordsCount || 0,
      data.quizAccuracy || "0%",
      data.handwritingCount || 0,
      data.durationMinutes || 0,
      new Date().toISOString()
    ]);

    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("한빛 한글 샘 구글 시트 연동 서버가 정상 작동 중입니다.");
}
`;
