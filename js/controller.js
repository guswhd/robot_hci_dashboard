document.addEventListener('DOMContentLoaded', () => {
    // --- 네비게이션 제어 로직 ---
    const navLinks = document.querySelectorAll('.navigation .nav-item');
    const pages = document.querySelectorAll('.dashboard .page-content');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // 링크의 기본 동작 방지
            const targetId = link.getAttribute('data-target');

            // 모든 네비게이션 링크에서 'active' 클래스 제거
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            // 클릭된 링크에 'active' 클래스 추가
            link.classList.add('active');

            // 모든 페이지를 숨김
            pages.forEach(page => {
                page.classList.remove('active');
            });
            // 목표 페이지를 보여줌
            const targetPage = document.getElementById(targetId);
            if (targetPage) {
                targetPage.classList.add('active');
            }
        });
    });

    // --- 시각화 UI 요소 ---
    const torqueXDial = document.getElementById('torque-x-dial');
    const torqueXValueText = document.getElementById('torque-x-value');
    const torqueYDial = document.getElementById('torque-y-dial');
    const torqueYValueText = document.getElementById('torque-y-value');
    const torqueZValueText = document.getElementById('torque-z-value');

    const forceXBar = document.getElementById('force-x-bar');
    const forceXValueText = document.getElementById('force-x-value');
    const forceYBar = document.getElementById('force-y-bar');
    const forceYValueText = document.getElementById('force-y-value');
    const forceZBar = document.getElementById('force-z-bar');
    const forceZValueText = document.getElementById('force-z-value');

    // --- 사용자 입력 컨트롤 요소 ---
    const sliders = {
        tx: document.getElementById('tx-slider'),
        ty: document.getElementById('ty-slider'),
        tz: document.getElementById('tz-slider'),
        fx: document.getElementById('fx-slider'),
        fy: document.getElementById('fy-slider'),
        fz: document.getElementById('fz-slider')
    };

    // --- 게이지 및 바 설정 ---
    const gaugeRadius = 45;
    const gaugeCircumference = 2 * Math.PI * gaugeRadius * 0.75; // 270도 호
    const TORQUE_MIN = -10, TORQUE_MAX = 10;
    const FORCE_X_MIN = -20, FORCE_X_MAX = 20;
    const FORCE_Y_MIN = -20, FORCE_Y_MAX = 20;
    const FORCE_Z_MIN = -20, FORCE_Z_MAX = 80;

    function updateTorqueGauge(dial, text, value) {
        if (!dial || !text) return;
        const clampedValue = Math.max(TORQUE_MIN, Math.min(TORQUE_MAX, value));
        const percentage = (clampedValue - TORQUE_MIN) / (TORQUE_MAX - TORQUE_MIN);
        const offset = gaugeCircumference * (1 - percentage);
        dial.style.strokeDashoffset = offset;
        text.innerHTML = `${value.toFixed(1)}<span>Nm</span>`;
    }

    function updateForceBar(bar, text, value, min, max) {
        if (!bar || !text) return;
        const percentage = Math.abs(value / (value >= 0 ? max : min)) * 100;
        const clampedPercentage = Math.min(100, percentage);
        bar.style.width = `${clampedPercentage}%`;
        text.textContent = `${value.toFixed(1)} N`;
    }

    function updateDashboardFromControls() {
        const values = {
            tx: parseFloat(sliders.tx.value),
            ty: parseFloat(sliders.ty.value),
            tz: parseFloat(sliders.tz.value),
            fx: parseFloat(sliders.fx.value),
            fy: parseFloat(sliders.fy.value),
            fz: parseFloat(sliders.fz.value)
        };
        updateTorqueGauge(torqueXDial, torqueXValueText, values.tx);
        updateTorqueGauge(torqueYDial, torqueYValueText, values.ty);
        if(torqueZValueText) torqueZValueText.textContent = `${values.tz.toFixed(1)} Nm`;
        updateForceBar(forceXBar, forceXValueText, values.fx, FORCE_X_MIN, FORCE_X_MAX);
        updateForceBar(forceYBar, forceYValueText, values.fy, FORCE_Y_MIN, FORCE_Y_MAX);
        updateForceBar(forceZBar, forceZValueText, values.fz, FORCE_Z_MIN, FORCE_Z_MAX);
    }

    Object.values(sliders).forEach(slider => {
        if (slider) {
            slider.addEventListener('input', updateDashboardFromControls);
        }
    });

    // 페이지 로드 시 초기값으로 대시보드 한 번 업데이트
    if(sliders.tx) { // Manual Control 페이지가 활성 상태일 때만 실행
        updateDashboardFromControls();
    }
});
