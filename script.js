/**
 * ==========================================================================
 * 힐스테이트 회룡역파크뷰 모바일 명함 스크립트 (script.js)
 * 
 * - 주요 기능:
 *   1. 명함 이미지 터치 시 즉시 전화 걸기 (010-7675-3098)
 *   2. 주소록 저장 (vCard 파일 자동 생성 및 다운로드)
 *   3. 견본주택 주소 원터치 복사
 *   4. 카카오톡 및 SNS 명함 공유하기
 *   5. URL 파라미터(?call=1) 감지 시 자동 전화 다이얼 연결
 * ==========================================================================
 */

// 실장님 기본 연락처 정보 상수
const CONTACT_INFO = {
  name: "이진형 실장",
  company: "힐스테이트 회룡역파크뷰",
  title: "3본부 2팀 실장",
  phone: "010-7675-3098",
  cleanPhone: "01076753098",
  email: "aonehair01@naver.com",
  address: "경기도 의정부시 호원동 288",
  website: "https://hyeong-homepage.vercel.app/",
  blog: "https://blog.naver.com/aonehair01",
  openKakao: "https://open.kakao.com/o/sCaiVWMh",
  youtube: "https://www.youtube.com/@형HYEONG"
};

// DOM이 완전히 로드된 후 실행
document.addEventListener("DOMContentLoaded", () => {
  initTouchCall();
  initContactSave();
  initCopyAddress();
  initShareFeatures();
  checkAutoCallParam();
});

/**
 * 1. [핵심 기능] 명함 이미지 터치 시 즉시 전화 연결
 */
function initTouchCall() {
  const cardTouchArea = document.getElementById("cardTouchArea");
  if (!cardTouchArea) return;

  // 터치 시 시각 피드백 제공 후 고유 a 태그 tel 링크로 즉시 통화 연결
  cardTouchArea.addEventListener("click", () => {
    showToast("📞 이진형에게 전화를 연결합니다...");
  });
}

/**
 * 2. URL 파라미터 확인 후 자동 전화 걸기 (?call=1 or ?auto=true)
 * 카카오톡 카드에서 바로 통화 목적으로 링크를 걸었을 때 작동
 */
function checkAutoCallParam() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("call") === "1" || urlParams.get("auto") === "true") {
    showToast("📞 잠시 후 전화 통화 화면이 열립니다...");
    setTimeout(() => {
      window.location.href = `tel:${CONTACT_INFO.cleanPhone}`;
    }, 400);
  }
}

/**
 * 3. 스마트폰 주소록 저장 기능 (vCard .vcf 파일 생성)
 * 아이폰/갤럭시 상관없이 터치 한 번으로 연락처에 바로 저장
 */
function initContactSave() {
  const btnSaveContact = document.getElementById("btnSaveContact");
  if (!btnSaveContact) return;

  btnSaveContact.addEventListener("click", () => {
    showToast("👤 연락처가 다운로드되었습니다. [열기] 후 [저장]을 눌러주세요!");
  });
}

/**
 * 4. 견본주택 주소 원터치 복사 기능
 */
function initCopyAddress() {
  const btnCopyAddress = document.getElementById("btnCopyAddress");
  if (!btnCopyAddress) return;

  btnCopyAddress.addEventListener("click", async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(CONTACT_INFO.address);
      } else {
        // 구형 브라우저 대응
        const tempInput = document.createElement("input");
        tempInput.value = CONTACT_INFO.address;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }
      showToast("📍 주소가 복사되었습니다! (내비게이션에 붙여넣기)");
    } catch (err) {
      showToast("📍 견본주택: " + CONTACT_INFO.address);
    }
  });
}

/**
 * 5. 명함 공유하기 (카카오톡 및 링크 복사)
 */
function initShareFeatures() {
  const btnShareKakao = document.getElementById("btnShareKakao");
  const btnShareLink = document.getElementById("btnShareLink");

  // 대표 공유 URL: 로컬 파일(file:) 또는 로컬호스트 실행 시에도 실제 웹사이트 주소로 정확히 연결
  const defaultShareUrl = CONTACT_INFO.website || "https://hyeong-homepage.vercel.app/";
  const baseUrl = (window.location.protocol === "http:" || window.location.protocol === "https:") && !window.location.hostname.includes("localhost") && !window.location.hostname.includes("127.0.0.1")
    ? window.location.href.split("?")[0]
    : defaultShareUrl;

  // 카카오톡 카드를 누르면 웹이 열리면서 즉시 전화 다이얼이 자동으로 열리도록 ?call=1 파라미터 적용
  const callShareUrl = baseUrl.includes("?") ? `${baseUrl}&call=1` : `${baseUrl}?call=1`;

  const shareTitle = `[힐스테이트 회룡역파크뷰] 이진형 모바일 명함`;
  const shareText = `힐스테이트 회룡역파크뷰 이진형 공식 모바일 명함입니다.\n(터치 시 010-7675-3098 로 즉시 통화 연결)\n📍 견본주택: ${CONTACT_INFO.address}`;

  // 카카오톡 / 일반 공유 버튼 (내 카톡으로 받기 / 지인에게 전달하기)
  if (btnShareKakao) {
    btnShareKakao.addEventListener("click", async () => {
      // 스마트폰 기본 공유 기능(카카오톡 나와의 채팅 / 친구 선택 가능)이 지원되는 경우
      if (navigator.share) {
        try {
          await navigator.share({
            title: shareTitle,
            text: shareText,
            url: callShareUrl
          });
        } catch (err) {
          // 공유 창 취소 시
        }
      } else {
        // PC 브라우저 등에서는 명함 주소 클립보드 복사 후 안내
        copyToClipboard(callShareUrl, "💬 전화 바로연결 명함 주소가 복사되었습니다! 카카오톡에 붙여넣어 전송하세요.");
      }
    });
  }

  // 링크 복사 버튼
  if (btnShareLink) {
    btnShareLink.addEventListener("click", () => {
      copyToClipboard(callShareUrl, "🔗 전화 바로연결 명함 주소가 복사되었습니다!");
    });
  }
}

/**
 * 클립보드 복사 헬퍼 함수
 */
async function copyToClipboard(text, successMsg) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const tempInput = document.createElement("input");
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
    }
    showToast(successMsg);
  } catch (err) {
    showToast("링크 복사에 실패했습니다. 주소창을 복사해주세요.");
  }
}

/**
 * 화면 상단 토스트 알림 표시
 */
let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById("toastPopup");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}
