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
  address: "경기도 의정부시 호원동 314-7",
  website: "https://tomboy-kor.github.io/hillstate-hoeryong/"
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

  const triggerCall = () => {
    showToast("📞 이진형 실장에게 전화를 연결합니다...");
    
    // 약간의 시간(150ms)을 두어 터치 시각 피드백(진동/효과)을 보여준 후 전화 실행
    setTimeout(() => {
      window.location.href = `tel:${CONTACT_INFO.cleanPhone}`;
    }, 150);
  };

  // 터치 및 클릭 이벤트 연결
  cardTouchArea.addEventListener("click", triggerCall);

  // 키보드 접근성 대응 (Enter 또는 Space 키)
  cardTouchArea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      triggerCall();
    }
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
    // 표준 vCard 포맷 텍스트 생성
    const vCardData = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${CONTACT_INFO.name};;;;`,
      `FN:${CONTACT_INFO.name} (${CONTACT_INFO.company})`,
      `ORG:${CONTACT_INFO.company};`,
      `TITLE:${CONTACT_INFO.title}`,
      `TEL;TYPE=CELL:${CONTACT_INFO.phone}`,
      `EMAIL;TYPE=WORK:${CONTACT_INFO.email}`,
      `ADR;TYPE=WORK:;;${CONTACT_INFO.address};;;;`,
      `URL:${CONTACT_INFO.website}`,
      "NOTE:힐스테이트 회룡역파크뷰 공식 모바일 명함",
      "END:VCARD"
    ].join("\r\n");

    // Blob 생성 및 다운로드 링크 트리거
    const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${CONTACT_INFO.name}_연락처.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast("👤 연락처 파일이 열렸습니다. [저장]을 눌러주세요!");
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

  // 현재 페이지 URL
  const currentUrl = window.location.href.split("?")[0];

  // 카카오톡 / 일반 공유 버튼
  if (btnShareKakao) {
    btnShareKakao.addEventListener("click", async () => {
      // 스마트폰 기본 공유 기능(카카오톡 선택 가능)이 지원되는 경우
      if (navigator.share) {
        try {
          await navigator.share({
            title: `[명함] ${CONTACT_INFO.company} ${CONTACT_INFO.name}`,
            text: `힐스테이트 회룡역파크뷰 이진형 실장 명함입니다. (터치 시 바로 통화 연결)\n전화: ${CONTACT_INFO.phone}`,
            url: currentUrl
          });
        } catch (err) {
          // 공유 취소 등은 무시
        }
      } else {
        // PC 브라우저 등에서는 링크 복사로 대체 안내
        copyToClipboard(currentUrl, "💬 명함 링크가 복사되었습니다. 카카오톡에 붙여넣어 보내세요!");
      }
    });
  }

  // 링크 복사 버튼
  if (btnShareLink) {
    btnShareLink.addEventListener("click", () => {
      copyToClipboard(currentUrl, "🔗 명함 링크가 복사되었습니다!");
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
