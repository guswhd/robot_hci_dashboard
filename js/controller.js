document.addEventListener('DOMContentLoaded', () => {
    // --- 전역 변수 (3D 로봇 객체) ---
    let scene, camera, renderer, controls;
    let robotBase, armGroup, forearmGroup; // 그룹을 사용하여 회전축 제어

    // --- 네비게이션 제어 로직 ---
    const navLinks = document.querySelectorAll('.navigation .nav-item');
    const pages = document.querySelectorAll('.dashboard .page-content');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-target');
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
            pages.forEach(page => page.classList.remove('active'));
            const targetPage = document.getElementById(targetId);
            if (targetPage) {
                targetPage.classList.add('active');
            }
        });
    });

    // --- 페이지 1: 수동 제어 로직 ---
    function setupManualControlPage() {
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

        const sliders = {
            tx: document.getElementById('tx-slider'),
            ty: document.getElementById('ty-slider'),
            tz: document.getElementById('tz-slider'),
            fx: document.getElementById('fx-slider'),
            fy: document.getElementById('fy-slider'),
            fz: document.getElementById('fz-slider')
        };

        const gaugeRadius = 45;
        const gaugeCircumference = 2 * Math.PI * gaugeRadius * 0.75;
        const FORCE_X_MIN = -20, FORCE_X_MAX = 20;
        const FORCE_Y_MIN = -20, FORCE_Y_MAX = 20;
        const FORCE_Z_MIN = -20, FORCE_Z_MAX = 80;

        function updateTorqueGauge(dial, text, value, min, max) {
            if (!dial || !text) return;
            const clampedValue = Math.max(min, Math.min(max, value));
            const percentage = (clampedValue - min) / (max - min);
            const offset = gaugeCircumference * (1 - percentage);
            dial.style.strokeDashoffset = offset;
            text.innerHTML = `${parseFloat(value).toFixed(1)}<span>Nm</span>`;
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
            
            updateTorqueGauge(torqueXDial, torqueXValueText, values.tx, sliders.tx.min, sliders.tx.max);
            updateTorqueGauge(torqueYDial, torqueYValueText, values.ty, sliders.ty.min, sliders.ty.max);
            if(torqueZValueText) torqueZValueText.textContent = `${values.tz.toFixed(1)} Nm`;
            
            updateForceBar(forceXBar, forceXValueText, values.fx, FORCE_X_MIN, FORCE_X_MAX);
            updateForceBar(forceYBar, forceYValueText, values.fy, FORCE_Y_MIN, FORCE_Y_MAX);
            updateForceBar(forceZBar, forceZValueText, values.fz, FORCE_Z_MIN, FORCE_Z_MAX);

            // 3D 로봇 모델 업데이트 (그룹 전체를 회전)
            if (robotBase && armGroup && forearmGroup) {
                robotBase.rotation.y = THREE.MathUtils.degToRad(values.tz);
                armGroup.rotation.z = THREE.MathUtils.degToRad(values.tx);
                forearmGroup.rotation.z = THREE.MathUtils.degToRad(values.ty);
            }
        }

        Object.values(sliders).forEach(slider => {
            if (slider) {
                slider.addEventListener('input', updateDashboardFromControls);
            }
        });

        if(sliders.tx) {
            updateDashboardFromControls();
        }
    }

    // --- 페이지 1.5: 3D 로봇 시각화 로직 (개선된 버전) ---
    function setupRobotVisualization() {
        const container = document.getElementById('robot-canvas-container');
        if (!container) return;

        // 1. Scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x2c303a);

        // 2. Camera
        camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(6, 7, 9); // 카메라 시점 조정
        camera.lookAt(0, 2, 0);

        // 3. Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true; // 그림자 활성화
        container.appendChild(renderer.domElement);

        // 4. Controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 2, 0);
        controls.enableDamping = true;
        controls.update();

        // 5. Lights
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));
        const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
        dirLight.position.set(10, 20, 5);
        dirLight.castShadow = true;
        scene.add(dirLight);

        // 바닥 추가
        const groundGeo = new THREE.PlaneGeometry(20, 20);
        const groundMat = new THREE.MeshStandardMaterial({ color: 0x20232a, roughness: 0.8 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        // 6. Robot Model (디자인 개선 및 축 수정)
        const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xff8c00, roughness: 0.4, metalness: 0.6 }); // 주황색으로 변경
        const jointMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.2, metalness: 0.8 }); // 어두운 금속 재질

        // Base
        const baseGeometry = new THREE.CylinderGeometry(1, 1.2, 0.8, 32);
        robotBase = new THREE.Mesh(baseGeometry, jointMaterial); // 베이스는 어둡게
        robotBase.castShadow = true;
        robotBase.position.y = 0.4;
        scene.add(robotBase);

        // Arm (첫 번째 관절과 팔)
        armGroup = new THREE.Group();
        robotBase.add(armGroup);
        armGroup.position.y = 0.4;

        const armJointGeo = new THREE.SphereGeometry(0.4, 32, 32);
        const armJoint = new THREE.Mesh(armJointGeo, jointMaterial);
        armJoint.castShadow = true;
        armGroup.add(armJoint);

        const armGeo = new THREE.CylinderGeometry(0.3, 0.2, 3, 32);
        const robotArm = new THREE.Mesh(armGeo, bodyMaterial);
        robotArm.castShadow = true;
        robotArm.position.y = 1.5;
        armGroup.add(robotArm);

        // Forearm (두 번째 관절과 팔)
        forearmGroup = new THREE.Group();
        forearmGroup.position.y = 3.0;
        armGroup.add(forearmGroup);

        const forearmJointGeo = new THREE.SphereGeometry(0.3, 32, 32);
        const forearmJoint = new THREE.Mesh(forearmJointGeo, jointMaterial);
        forearmJoint.castShadow = true;
        forearmGroup.add(forearmJoint);

        const forearmGeo = new THREE.CylinderGeometry(0.2, 0.15, 2.5, 32);
        const robotForearm = new THREE.Mesh(forearmGeo, bodyMaterial);
        robotForearm.castShadow = true;
        robotForearm.position.y = 1.25;
        forearmGroup.add(robotForearm);

        // End Effector (Gripper) 추가
        const endEffectorGroup = new THREE.Group();
        forearmGroup.add(endEffectorGroup);
        endEffectorGroup.position.y = 2.5; // 팔 끝에 위치

        const wristGeo = new THREE.SphereGeometry(0.2, 16, 16);
        const wrist = new THREE.Mesh(wristGeo, jointMaterial);
        wrist.castShadow = true;
        endEffectorGroup.add(wrist);
        
        const gripperMaterial = jointMaterial;

        // 왼쪽 집게
        const leftFinger = new THREE.Group();
        endEffectorGroup.add(leftFinger);
        leftFinger.position.x = 0.15;
        
        const fingerPart1Geo = new THREE.BoxGeometry(0.1, 0.4, 0.1);
        const fingerPart1L = new THREE.Mesh(fingerPart1Geo, gripperMaterial);
        fingerPart1L.position.y = 0.2;
        fingerPart1L.castShadow = true;
        leftFinger.add(fingerPart1L);

        const fingerPart2Geo = new THREE.BoxGeometry(0.1, 0.4, 0.1);
        const fingerPart2L = new THREE.Mesh(fingerPart2Geo, gripperMaterial);
        fingerPart2L.position.set(0, 0.4, 0.15);
        fingerPart2L.rotation.x = THREE.MathUtils.degToRad(-60);
        fingerPart2L.castShadow = true;
        leftFinger.add(fingerPart2L);

        // 오른쪽 집게 (복제 후 반전)
        const rightFinger = leftFinger.clone();
        rightFinger.position.x = -0.15;
        endEffectorGroup.add(rightFinger);

        // Animation Loop
        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();

        // Resize handler
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }

    // --- 페이지 2: 설정 페이지 로직 ---
    function setupSettingsPage() {
        const themeSwitch = document.getElementById('theme-switch');
        if (themeSwitch) {
            themeSwitch.addEventListener('change', () => {
                document.body.classList.toggle('light-theme');
            });
        }
    }

    // --- 페이지 3: 진단 페이지 로직 ---
    function setupDiagnosticsPage() {
        const runBtn = document.getElementById('run-diagnostics-btn');
        const diagList = document.getElementById('diagnostics-list');
        const components = [
            "Main Power Unit", "CPU Core", "Memory Integrity", 
            "Axis 1 Motor", "Axis 2 Motor", "Axis 3 Motor", 
            "Force/Torque Sensor", "Network Interface"
        ];

        if (runBtn) {
            runBtn.addEventListener('click', () => {
                diagList.innerHTML = '';
                runBtn.disabled = true;
                runBtn.textContent = 'Running...';

                components.forEach((component, index) => {
                    setTimeout(() => {
                        const li = document.createElement('li');
                        li.innerHTML = `<span>${component}</span><span class="diag-status checking">Checking...</span>`;
                        diagList.appendChild(li);

                        setTimeout(() => {
                            const statusSpan = li.querySelector('.diag-status');
                            const isOk = Math.random() > 0.15; // 85% success rate
                            statusSpan.textContent = isOk ? 'OK' : 'Fail';
                            statusSpan.classList.remove('checking');
                            statusSpan.classList.add(isOk ? 'ok' : 'fail');
                        }, 1000 + Math.random() * 500);

                    }, index * 500);
                });
                
                setTimeout(() => {
                    runBtn.disabled = false;
                    runBtn.textContent = 'Run Diagnostics';
                }, components.length * 500 + 1500);
            });
        }
    }

    // --- 페이지 4: 이벤트 로그 페이지 로직 ---
    function setupEventLogPage() {
        const logTableBody = document.getElementById('log-table-body');
        const initialLogs = [
            { type: 'info', message: 'System initialized successfully.' },
            { type: 'info', message: 'Manual control mode activated.' },
            { type: 'warn', message: 'Torque sensor on Y-axis approaching limit.' },
            { type: 'info', message: 'User updated Force Z value to 63.0 N.' },
            { type: 'error', message: 'Failed to connect to calibration server.' },
        ];

        function addLogEntry(log) {
            if (!logTableBody) return;
            const row = document.createElement('tr');
            const typeClass = `log-type-${log.type}`;
            row.innerHTML = `
                <td>${new Date().toLocaleString()}</td>
                <td><span class="${typeClass}">${log.type.toUpperCase()}</span></td>
                <td>${log.message}</td>
            `;
            logTableBody.prepend(row);
        }
        
        if(logTableBody) {
             initialLogs.forEach(log => addLogEntry(log));
        }
    }

    // --- 페이지별 초기화 함수 호출 ---
    setupManualControlPage();
    setupRobotVisualization();
    setupSettingsPage();
    setupDiagnosticsPage();
    setupEventLogPage();
});
