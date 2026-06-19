/* =====================================================
   VocalAI – Full SPA Application
   ===================================================== */

'use strict';

// ══════════════════════════════════════════════
// 1. DB (localStorage)
// ══════════════════════════════════════════════
const DB = {
  _get(k) { try { return JSON.parse(localStorage.getItem('vocalai_' + k)) || null; } catch { return null; } },
  _set(k, v) { localStorage.setItem('vocalai_' + k, JSON.stringify(v)); },

  getStudents() { return this._get('students') || []; },
  setStudents(v) { this._set('students', v); },
  getTrainers() { return this._get('trainers') || []; },
  setTrainers(v) { this._set('trainers', v); },
  getAdmins() { return this._get('admins') || []; },
  setAdmins(v) { this._set('admins', v); },
  getEmails() { return this._get('emails') || {}; },
  setEmails(v) { this._set('emails', v); },
  getSubmissions() { return this._get('submissions') || []; },
  setSubmissions(v) { this._set('submissions', v); },
  getAnalyses() { return this._get('analyses') || []; },
  setAnalyses(v) { this._set('analyses', v); },
  getSongs() { return this._get('songs') || []; },
  setSongs(v) { this._set('songs', v); },
  getBookings() { return this._get('bookings') || []; },
  setBookings(v) { this._set('bookings', v); },
  getPayments() { return this._get('payments') || []; },
  setPayments(v) { this._set('payments', v); },
  getReviews() { return this._get('reviews') || []; },
  setReviews(v) { this._set('reviews', v); },
  getMrRequests() { return this._get('mr_requests') || []; },
  setMrRequests(v) { this._set('mr_requests', v); },
  getSchedules() { return this._get('schedules') || []; },
  setSchedules(v) { this._set('schedules', v); },
  getNotifications() { return this._get('notifications') || []; },
  setNotifications(v) { this._set('notifications', v); },
  getCurrentSession() { return this._get('session'); },
  setCurrentSession(v) { this._set('session', v); },
  clearSession() { localStorage.removeItem('vocalai_session'); },

  nextId(arr) { return arr.length > 0 ? Math.max(...arr.map(i => i.id)) + 1 : 1; },

  seed() {
    if (this._get('seeded')) return;
    // Admin
    const admins = [{ id: 1, email: 'admin@vocalai.kr', password: hash('admin1234'), name: '시스템관리자' }];
    this.setAdmins(admins);

    // Emails registry
    const emails = { 'admin@vocalai.kr': 'admin' };

    // Approved trainers
    const trainers = [
      { id: 1, email: 'trainer1@vocalai.kr', password: hash('trainer1'), name: '김하늘', profileEmoji: '🎤', intro: '10년 경력의 보컬 전문 트레이너입니다. SBS 보이스킹 출연 경험이 있으며 고음 처리와 호흡법을 전문적으로 지도합니다.', careerYears: 10, lessonPrice: 80000, specialties: ['고음처리', '호흡', '발성'], approvalStatus: 'approved', oauthProvider: 'none', isActive: true, averageRating: 4.8, totalReviews: 124, createdAt: '2026-01-10' },
      { id: 2, email: 'trainer2@vocalai.kr', password: hash('trainer2'), name: '박서윤', profileEmoji: '🎵', intro: '음대 출신 보컬리스트로 팝, R&B, 재즈 장르에 특화되어 있습니다. 음정 교정과 스케일 훈련을 집중적으로 진행합니다.', careerYears: 7, lessonPrice: 65000, specialties: ['음정교정', '스케일', '팝/R&B'], approvalStatus: 'approved', oauthProvider: 'none', isActive: true, averageRating: 4.6, totalReviews: 89, createdAt: '2026-01-15' },
      { id: 3, email: 'trainer3@vocalai.kr', password: hash('trainer3'), name: '이준혁', profileEmoji: '🎼', intro: '발라드와 CCM 전문 트레이너입니다. 박자감, 다이나믹 표현, 감정 전달 기법을 중심으로 수업합니다.', careerYears: 5, lessonPrice: 55000, specialties: ['박자감', '다이나믹', '발라드'], approvalStatus: 'approved', oauthProvider: 'none', isActive: true, averageRating: 4.7, totalReviews: 67, createdAt: '2026-02-01' },
      { id: 4, email: 'trainer4@vocalai.kr', password: hash('trainer4'), name: '최민지', profileEmoji: '🌟', intro: '신청 중인 트레이너입니다.', careerYears: 3, lessonPrice: 45000, specialties: ['음색개발'], approvalStatus: 'pending', oauthProvider: 'none', isActive: true, averageRating: 0, totalReviews: 0, createdAt: '2026-06-10' },
    ];
    this.setTrainers(trainers);
    trainers.forEach(t => { emails[t.email] = 'trainer'; });

    // Songs
    const songs = [
      { id: 1, title: '밤편지', artist: '아이유', genre: '발라드', lowestNote: 'G3', highestNote: 'E5', difficulty: 'medium', emoji: '🌙' },
      { id: 2, title: 'Celebrity', artist: '아이유', genre: '팝', lowestNote: 'C4', highestNote: 'G5', difficulty: 'medium', emoji: '⭐' },
      { id: 3, title: '다시 만난 세계', artist: '소녀시대', genre: '팝', lowestNote: 'D4', highestNote: 'D5', difficulty: 'easy', emoji: '🌍' },
      { id: 4, title: '사랑하기 때문에', artist: '유재하', genre: '발라드', lowestNote: 'E3', highestNote: 'F5', difficulty: 'hard', emoji: '💕' },
      { id: 5, title: '눈의 꽃', artist: '박효신', genre: '발라드', lowestNote: 'D3', highestNote: 'G5', difficulty: 'hard', emoji: '❄️' },
      { id: 6, title: '좋은날', artist: '아이유', genre: '발라드', lowestNote: 'D4', highestNote: 'F6', difficulty: 'hard', emoji: '☀️' },
      { id: 7, title: '비', artist: '윤종신', genre: '발라드', lowestNote: 'A3', highestNote: 'D5', difficulty: 'easy', emoji: '🌧️' },
      { id: 8, title: '봄날', artist: 'BTS', genre: '팝', lowestNote: 'C4', highestNote: 'E5', difficulty: 'medium', emoji: '🌸' },
      { id: 9, title: 'Butter', artist: 'BTS', genre: '팝', lowestNote: 'C4', highestNote: 'D5', difficulty: 'easy', emoji: '🧈' },
      { id: 10, title: '서울의 달', artist: '한영애', genre: '트로트', lowestNote: 'B3', highestNote: 'C5', difficulty: 'medium', emoji: '🌕' },
    ];
    this.setSongs(songs);

    // Sample student
    const students = [
      { id: 1, email: 'student@test.kr', password: hash('student1'), nickname: '보컬고수', preferredGenres: ['발라드', '팝'], oauthProvider: 'none', isActive: true, createdAt: '2026-03-01' }
    ];
    this.setStudents(students);
    emails['student@test.kr'] = 'student';

    this.setEmails(emails);
    this._set('seeded', true);
  }
};

function hash(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
  return (h >>> 0).toString(36);
}

// ══════════════════════════════════════════════
// 2. STATE
// ══════════════════════════════════════════════
const State = {
  currentUser: null,
  userType: null,
  currentPage: 'home',
  dashPage: null,
};

// ══════════════════════════════════════════════
// 3. AUTH
// ══════════════════════════════════════════════
const Auth = {
  login(type, email, pw) {
    let user = null;
    if (type === 'student') {
      user = DB.getStudents().find(s => s.email === email && s.password === hash(pw));
    } else if (type === 'trainer') {
      user = DB.getTrainers().find(t => t.email === email && t.password === hash(pw));
    } else if (type === 'admin') {
      user = DB.getAdmins().find(a => a.email === email && a.password === hash(pw));
    }
    if (!user) return { ok: false, msg: '이메일 또는 비밀번호가 올바르지 않습니다.' };
    DB.setCurrentSession({ userId: user.id, type, email });
    State.currentUser = user;
    State.userType = type;
    return { ok: true, user };
  },

  logout() {
    DB.clearSession();
    State.currentUser = null;
    State.userType = null;
    navigate('home');
  },

  register(type, data) {
    const emails = DB.getEmails();
    if (emails[data.email]) return { ok: false, msg: '이미 사용 중인 이메일입니다.' };
    if (type === 'student') {
      const students = DB.getStudents();
      const newStudent = {
        id: DB.nextId(students),
        email: data.email,
        password: hash(data.password),
        nickname: data.nickname,
        preferredGenres: data.genres || [],
        oauthProvider: 'none',
        isActive: true,
        createdAt: new Date().toISOString().slice(0, 10)
      };
      students.push(newStudent);
      DB.setStudents(students);
      emails[data.email] = 'student';
      DB.setEmails(emails);
      DB.setCurrentSession({ userId: newStudent.id, type: 'student', email: data.email });
      State.currentUser = newStudent;
      State.userType = 'student';
      return { ok: true };
    } else if (type === 'trainer') {
      const trainers = DB.getTrainers();
      const newTrainer = {
        id: DB.nextId(trainers),
        email: data.email,
        password: hash(data.password),
        name: data.name,
        profileEmoji: '🎤',
        intro: data.intro || '',
        careerYears: Number(data.careerYears) || 0,
        lessonPrice: Number(data.lessonPrice) || 0,
        specialties: data.specialties || [],
        approvalStatus: 'pending',
        oauthProvider: 'none',
        isActive: true,
        averageRating: 0,
        totalReviews: 0,
        createdAt: new Date().toISOString().slice(0, 10)
      };
      trainers.push(newTrainer);
      DB.setTrainers(trainers);
      emails[data.email] = 'trainer';
      DB.setEmails(emails);
      return { ok: true };
    }
    return { ok: false, msg: '알 수 없는 오류' };
  },

  restoreSession() {
    const s = DB.getCurrentSession();
    if (!s) return;
    if (s.type === 'student') {
      const u = DB.getStudents().find(x => x.id === s.userId);
      if (u) { State.currentUser = u; State.userType = 'student'; }
    } else if (s.type === 'trainer') {
      const u = DB.getTrainers().find(x => x.id === s.userId);
      if (u) { State.currentUser = u; State.userType = 'trainer'; }
    } else if (s.type === 'admin') {
      const u = DB.getAdmins().find(x => x.id === s.userId);
      if (u) { State.currentUser = u; State.userType = 'admin'; }
    }
  }
};

// ══════════════════════════════════════════════
// 4. ROUTER
// ══════════════════════════════════════════════
function navigate(page, params = {}) {
  State.currentPage = page;
  const app = document.getElementById('app');
  app.innerHTML = '';
  app.style.animation = 'none';
  app.offsetHeight; // reflow
  app.style.animation = '';

  const pages = {
    home: renderHome,
    submit: renderSubmit,
    analysis: renderAnalysis,
    'student-auth': renderStudentAuth,
    'trainer-auth': renderTrainerAuth,
    'admin-auth': renderAdminAuth,
    'student-dashboard': renderStudentApp,
    'trainer-dashboard': renderTrainerApp,
    'admin-dashboard': renderAdminDashboard,
  };

  const renderer = pages[page];
  if (renderer) {
    app.innerHTML = renderer(params);
    app.style.animation = 'fadeIn 0.3s ease';
    attachPageListeners(page, params);
  }
  renderNav();
  window.scrollTo(0, 0);
}

// ══════════════════════════════════════════════
// 5. NAVIGATION
// ══════════════════════════════════════════════
function renderNav() {
  const nav = document.getElementById('nav-bar');
  const u = State.currentUser;
  const type = State.userType;

  let links = '';
  let actions = '';

  if (!u) {
    links = `
      <button class="nav-link" onclick="navigate('submit')">🎙 보컬 분석</button>
      <button class="nav-link" onclick="navigate('student-auth',{tab:'login'})">학생 로그인</button>
      <button class="nav-link" onclick="navigate('trainer-auth',{tab:'login'})">트레이너 로그인</button>`;
    actions = `
      <button class="btn btn-secondary btn-sm" onclick="navigate('student-auth',{tab:'signup'})">회원가입</button>
      <button class="btn btn-primary btn-sm" onclick="navigate('submit')">무료 분석 시작</button>`;
  } else if (type === 'student') {
    links = `
      <button class="nav-link" onclick="navigate('submit')">🎙 분석</button>
      <button class="nav-link" onclick="navigate('student-dashboard',{sub:'songs'})">🎵 곡 추천</button>
      <button class="nav-link" onclick="navigate('student-dashboard',{sub:'mr'})">🎛 MR 스튜디오</button>
      <button class="nav-link" onclick="navigate('student-dashboard',{sub:'trainers'})">👨‍🏫 트레이너</button>
      <button class="nav-link" onclick="navigate('student-dashboard',{sub:'lessons'})">📅 내 레슨</button>`;
    actions = `
      <button class="btn btn-ghost btn-sm" onclick="navigate('student-dashboard',{sub:'home'})">대시보드</button>
      <button class="btn btn-secondary btn-sm" onclick="Auth.logout()">로그아웃</button>`;
  } else if (type === 'trainer') {
    links = `
      <button class="nav-link" onclick="navigate('trainer-dashboard',{sub:'home'})">대시보드</button>
      <button class="nav-link" onclick="navigate('trainer-dashboard',{sub:'requests'})">레슨 요청</button>
      <button class="nav-link" onclick="navigate('trainer-dashboard',{sub:'schedule'})">스케줄</button>
      <button class="nav-link" onclick="navigate('trainer-dashboard',{sub:'profile'})">프로필</button>`;
    actions = `<button class="btn btn-secondary btn-sm" onclick="Auth.logout()">로그아웃</button>`;
  } else if (type === 'admin') {
    links = `<button class="nav-link" onclick="navigate('admin-dashboard')">관리자 패널</button>`;
    actions = `<button class="btn btn-secondary btn-sm" onclick="Auth.logout()">로그아웃</button>`;
  }

  nav.innerHTML = `
    <div class="nav-inner">
      <div class="nav-logo" onclick="navigate('home')">VocalAI</div>
      <div class="nav-links">${links}</div>
      <div class="nav-actions">${actions}</div>
    </div>`;
}

// ══════════════════════════════════════════════
// 6. HOME PAGE
// ══════════════════════════════════════════════
function renderHome() {
  return `
  <div class="hero">
    <div class="hero-bg">
      <img src="singingwoman.png" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center top;opacity:0.6;pointer-events:none;" />
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% -10%,rgba(139,92,246,0.22) 0%,transparent 60%),radial-gradient(ellipse 50% 50% at 90% 80%,rgba(99,102,241,0.12) 0%,transparent 60%),linear-gradient(to bottom,rgba(6,6,8,0.45) 0%,rgba(6,6,8,0.82) 100%);pointer-events:none;"></div>
    </div>
    <div class="container hero-content animate-up">
      <div class="hero-eyebrow">✨ AI 보컬 분석 플랫폼</div>
      <h1 class="hero-title">당신의 목소리를<br><span class="grad-text">AI가 분석합니다</span></h1>
      <p class="hero-sub">음성 파일 하나만 업로드하면 AI가 음정·박자·성량·음색을 분석하고,<br>맞춤 트레이너를 연결해 드립니다. <strong>로그인 없이 바로 시작하세요.</strong></p>
      <div class="hero-cta">
        <button class="btn btn-primary btn-xl animate-glow" onclick="navigate('submit')">
          🎙 무료로 분석 시작 →
        </button>
        <button class="btn btn-secondary btn-xl" onclick="navigate('student-auth',{tab:'signup'})">
          회원가입
        </button>
      </div>

    </div>
  </div>

  <!-- Features -->
  <section class="section" style="background:var(--bg-1); border-top:1px solid var(--border);">
    <div class="container">
      <div class="text-center mb-24" style="margin-bottom:56px">
        <h2 style="font-size:36px;font-weight:900;letter-spacing:-1px;margin-bottom:12px">핵심 기능</h2>
        <p class="text-2" style="font-size:16px">AI 기술로 보컬 실력을 과학적으로 향상시켜 드립니다</p>
      </div>
      <div class="grid-3">
        <div class="card card-xl" style="animation:slideUp 0.5s ease 0.1s both">
          <div class="feature-icon">🧠</div>
          <h3 class="feature-title">AI 보컬 정밀 분석</h3>
          <p class="feature-desc">음정·박자·성량·음색 4개 항목을 AI가 정밀 분석하여 시각화 리포트를 제공합니다. <strong>로그인 없이도 이용 가능합니다.</strong></p>
          <div class="mt-16">
            <button class="btn btn-primary btn-sm" onclick="navigate('submit')">지금 분석하기</button>
          </div>
        </div>
        <div class="card card-xl" style="animation:slideUp 0.5s ease 0.2s both">
          <div class="feature-icon">🎛</div>
          <h3 class="feature-title">맞춤형 연습 도우미</h3>
          <p class="feature-desc">원하는 음역대에 맞게 키를 조절하고, AI 보컬 제거 기술로 연습용 MR을 즉시 생성합니다.</p>
          <div class="mt-16">
            <button class="btn btn-secondary btn-sm" onclick="navigate('student-auth',{tab:'signup'})">회원가입 후 이용</button>
          </div>
        </div>
        <div class="card card-xl" style="animation:slideUp 0.5s ease 0.3s both">
          <div class="feature-icon">👨‍🏫</div>
          <h3 class="feature-title">트레이너 매칭</h3>
          <p class="feature-desc">AI 분석 결과의 약점을 바탕으로 최적의 보컬 트레이너를 추천하고, 온라인 1:1 레슨을 예약합니다.</p>
          <div class="mt-16">
            <button class="btn btn-secondary btn-sm" onclick="navigate('student-auth',{tab:'signup'})">매칭 시작하기</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- How it works -->
  <section class="section">
    <div class="container">
      <div class="text-center" style="margin-bottom:56px">
        <h2 style="font-size:36px;font-weight:900;letter-spacing:-1px;margin-bottom:12px">이용 방법</h2>
        <p class="text-2">4단계로 보컬 실력을 레벨업하세요</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:32px;max-width:680px;margin:0 auto">
        ${[
          ['01', '🎙', '음성 파일 업로드', '연습한 노래나 아카펠라 파일을 업로드하세요. MP3, WAV, M4A 형식을 지원합니다. 로그인 없이도 가능합니다.'],
          ['02', '🤖', 'AI 분석 리포트 확인', 'AI가 음정, 박자, 성량, 음색을 분석하여 상세한 점수와 피드백을 제공합니다.'],
          ['03', '🎵', '맞춤 곡 추천 & MR 제작', '분석된 음역대를 바탕으로 도전 가능한 곡을 추천하고, 연습용 MR을 생성합니다.'],
          ['04', '👨‍🏫', '전문 트레이너와 레슨', '보완이 필요한 항목의 전문가와 연결되어 온라인 1:1 맞춤 레슨을 받으세요.']
        ].map(([num, emoji, title, desc]) => `
          <div class="flex gap-24 items-center">
            <div class="step-num">${num}</div>
            <div class="card" style="flex:1;padding:20px 24px">
              <div class="flex gap-12 items-center">
                <span style="font-size:28px">${emoji}</span>
                <div>
                  <div style="font-size:16px;font-weight:700;margin-bottom:4px">${title}</div>
                  <div class="text-2" style="font-size:14px">${desc}</div>
                </div>
              </div>
            </div>
          </div>`).join('')}
      </div>
    </div>
  </section>

  <!-- CTA Banner -->
  <section class="section-sm" style="background:var(--bg-1);border-top:1px solid var(--border)">
    <div class="container text-center">
      <div class="card card-accent card-xl" style="max-width:700px;margin:0 auto">
        <h2 style="font-size:28px;font-weight:900;margin-bottom:12px">지금 바로 시작해보세요</h2>
        <p class="text-2 mb-24">로그인 없이도 AI 보컬 분석이 가능합니다</p>
        <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary btn-lg" onclick="navigate('submit')">🎙 무료 분석 시작</button>
          <button class="btn btn-secondary btn-lg" onclick="navigate('student-auth',{tab:'signup'})">회원가입</button>
        </div>
        <p class="text-3 mt-12" style="font-size:12px">
          트레이너이신가요? <span class="text-accent" style="cursor:pointer" onclick="navigate('trainer-auth',{tab:'signup'})">트레이너 등록 →</span>
          &nbsp;|&nbsp; 관리자 <span class="text-accent" style="cursor:pointer" onclick="navigate('admin-auth')">로그인 →</span>
        </p>
      </div>
    </div>
  </section>

  <footer style="border-top:1px solid var(--border);padding:32px 0;text-align:center">
    <div class="container">
      <div class="nav-logo" style="font-size:18px;margin-bottom:8px">VocalAI</div>
      <p class="text-3" style="font-size:13px">© 2026 VocalAI. AI 기반 보컬 트레이닝 플랫폼.</p>
    </div>
  </footer>`;
}

// ══════════════════════════════════════════════
// 7. SUBMIT PAGE (Guest Voice Upload)
// ══════════════════════════════════════════════
function renderSubmit() {
  return `
  <div class="page-wrap">
    <div class="container" style="max-width:680px">
      <div class="animate-up">
        <div class="text-center mb-24" style="margin-bottom:40px">
          <span style="font-size:48px">🎙</span>
          <h1 style="font-size:32px;font-weight:900;letter-spacing:-1px;margin-top:12px;margin-bottom:8px">AI 보컬 분석</h1>
          <p class="text-2">음성 파일을 업로드하고 AI 분석 리포트를 받으세요</p>
          <div class="badge badge-accent mt-12">✅ 로그인 없이 이용 가능</div>
        </div>

        <div class="card card-xl">
          <form id="submit-form">
            <!-- File Drop Zone -->
            <div class="form-group mb-24" style="margin-bottom:24px">
              <label class="form-label">음성 파일 <span class="text-danger">*</span></label>
              <div class="drop-zone" id="drop-zone">
                <input type="file" id="audio-file" accept=".mp3,.wav,.m4a,.ogg" />
                <span class="drop-icon">🎵</span>
                <div style="font-size:16px;font-weight:600;margin-bottom:8px">파일을 드래그하거나 클릭해 업로드</div>
                <div class="text-2" style="font-size:13px">MP3, WAV, M4A, OGG 지원 · 최대 50MB</div>
                <div id="file-name" style="margin-top:12px;font-size:14px;color:var(--text-accent);display:none"></div>
              </div>
            </div>

            <!-- Requirements -->
            <div class="form-group" style="margin-bottom:20px">
              <label class="form-label">요구사항 <span class="text-3">(선택)</span></label>
              <textarea class="form-input form-textarea" id="requirements" placeholder="개선하고 싶은 부분, 목표 곡, 또는 궁금한 점을 적어주세요.&#10;예) 고음 처리가 불안정합니다 / 목표 곡: 밤편지 / 호흡이 짧습니다"></textarea>
            </div>

            <!-- Email -->
            <div class="form-group" style="margin-bottom:32px">
              <label class="form-label">이메일 <span class="text-3">(선택 – 결과 수령용)</span></label>
              <input type="email" class="form-input" id="guest-email" placeholder="result@example.com" />
              <div class="form-hint">입력 시 이메일로도 결과를 받을 수 있습니다</div>
            </div>

            <button type="submit" class="btn btn-primary btn-full btn-lg">
              🚀 AI 분석 시작
            </button>
            <p class="text-center text-3 mt-12" style="font-size:12px">
              분석 결과는 24시간 후 자동 삭제됩니다 (비회원)<br>
              히스토리 저장을 원하시면 <span class="text-accent" style="cursor:pointer" onclick="navigate('student-auth',{tab:'signup'})">회원가입</span>을 해주세요
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>`;
}

// ══════════════════════════════════════════════
// 8. ANALYSIS RESULT PAGE
// ══════════════════════════════════════════════
function renderAnalysis(params) {
  const a = params.analysis;
  if (!a) return `<div class="page-wrap container"><div class="empty-state"><div class="empty-icon">❌</div><div class="empty-title">분석 결과를 찾을 수 없습니다</div><button class="btn btn-primary" onclick="navigate('submit')">다시 시작</button></div></div>`;

  const scoreColor = (s) => s >= 80 ? 'var(--success)' : s >= 60 ? 'var(--warning)' : 'var(--danger)';
  const scoreLabel = (s) => s >= 85 ? '탁월함' : s >= 70 ? '양호함' : s >= 55 ? '보통' : '개선 필요';

  return `
  <div class="page-wrap">
    <div class="container" style="max-width:900px">
      <div class="animate-up">
        <!-- Header -->
        <div class="text-center mb-24" style="margin-bottom:40px">
          <div class="badge badge-success" style="margin-bottom:16px">✅ 분석 완료</div>
          <h1 style="font-size:32px;font-weight:900;letter-spacing:-1px;margin-bottom:8px">AI 보컬 분석 리포트</h1>
          <p class="text-2">파일: <strong>${a.fileName}</strong> · 분석 시간: ${a.processTime}초</p>
        </div>

        <!-- Overall Score -->
        <div class="card card-accent" style="text-align:center;padding:40px;margin-bottom:24px">
          <div class="text-2 mb-8" style="font-size:14px;font-weight:600;letter-spacing:1px;text-transform:uppercase">종합 점수</div>
          <div style="font-size:80px;font-weight:900;line-height:1;background:var(--accent-gradient);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${a.overall}</div>
          <div style="font-size:18px;font-weight:600;color:var(--text-2);margin-top:8px">/ 100점</div>
          <div class="badge badge-accent mt-16" style="margin-top:16px;font-size:14px">${scoreLabel(a.overall)}</div>
        </div>

        <!-- 4 Score Cards -->
        <div class="score-cards mb-24" style="margin-bottom:24px">
          ${[
            ['🎵', '음정', a.pitch, '음정 정확도'],
            ['⏱', '박자', a.rhythm, '리듬·타이밍'],
            ['📢', '성량', a.volume, '음량 다이나믹'],
            ['🎨', '음색', a.timbre, '톤·음색']
          ].map(([icon, label, score, desc]) => `
            <div class="score-card">
              <div class="score-card-icon">${icon}</div>
              <div class="score-card-label">${label}</div>
              <div class="score-card-num" style="color:${scoreColor(score)}">${score}</div>
              <div style="font-size:11px;color:var(--text-3);margin-top:2px">${desc}</div>
              <div class="score-card-bar mt-8" style="margin-top:8px">
                <div class="progress-bar">
                  <div class="progress-fill" style="width:${score}%;background:${scoreColor(score)}"></div>
                </div>
              </div>
            </div>`).join('')}
        </div>

        <!-- Chart + Feedback -->
        <div class="grid-2 mb-24" style="margin-bottom:24px">
          <div class="card" style="padding:32px;display:flex;flex-direction:column;align-items:center">
            <div class="text-2 mb-16" style="font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:16px">레이더 차트</div>
            <canvas id="radar-chart" width="280" height="280"></canvas>
          </div>
          <div class="card" style="padding:28px">
            <div style="font-size:15px;font-weight:700;margin-bottom:20px">📝 세부 피드백</div>
            ${[
              ['🎵 음정', a.pitchFeedback],
              ['⏱ 박자', a.rhythmFeedback],
              ['📢 성량', a.volumeFeedback],
              ['🎨 음색', a.timbreFeedback]
            ].map(([label, fb]) => `
              <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid var(--border)">
                <div style="font-size:13px;font-weight:700;margin-bottom:6px">${label}</div>
                <div class="text-2" style="font-size:13px;line-height:1.65">${fb}</div>
              </div>`).join('')}
          </div>
        </div>

        <!-- Weak Areas & Trainer Matching -->
        ${a.weakAreas && a.weakAreas.length > 0 ? `
        <div class="card card-accent mb-24" style="margin-bottom:24px">
          <div style="font-size:15px;font-weight:700;margin-bottom:12px">🎯 보완 필요 항목</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
            ${a.weakAreas.map(w => `<span class="badge badge-warning">${w}</span>`).join('')}
          </div>
          <p class="text-2" style="font-size:14px;margin-bottom:16px">위 항목을 전문으로 하는 트레이너를 추천해 드릴 수 있습니다.</p>
          ${State.userType === 'student' ? `<button class="btn btn-primary btn-sm" onclick="navigate('student-dashboard',{sub:'trainers',weakAreas:'${a.weakAreas.join(',')}'})">맞춤 트레이너 보기 →</button>` : `<button class="btn btn-secondary btn-sm" onclick="navigate('student-auth',{tab:'signup'})">회원가입 후 트레이너 연결</button>`}
        </div>` : ''}

        <!-- CTA for non-logged-in -->
        ${!State.currentUser ? `
        <div class="card" style="background:linear-gradient(135deg,rgba(139,92,246,0.1),rgba(99,102,241,0.05));border-color:var(--border-accent);padding:32px;text-align:center">
          <h3 style="font-size:20px;font-weight:800;margin-bottom:8px">더 많은 기능을 이용해 보세요</h3>
          <p class="text-2 mb-24" style="margin-bottom:24px">회원가입하면 분석 히스토리 저장, 맞춤 곡 추천, MR 제작, 트레이너 레슨 예약이 가능합니다</p>
          <div style="display:flex;gap:12px;justify-content:center">
            <button class="btn btn-primary" onclick="navigate('student-auth',{tab:'signup'})">무료 회원가입</button>
            <button class="btn btn-secondary" onclick="navigate('student-auth',{tab:'login'})">로그인</button>
          </div>
        </div>` : ''}

        <div style="text-align:center;margin-top:24px">
          <button class="btn btn-ghost" onclick="navigate('submit')">← 다시 분석하기</button>
        </div>
      </div>
    </div>
  </div>`;
}

// ══════════════════════════════════════════════
// 9. AUTH PAGES
// ══════════════════════════════════════════════
function renderStudentAuth(params) {
  const tab = (params && params.tab) || 'login';
  return `
  <div class="auth-wrap">
    <div class="auth-card animate-up">
      <div class="auth-logo grad-text">VocalAI</div>
      <div class="auth-subtitle">학생 계정</div>
      <div class="tabs mb-24" style="margin-bottom:28px">
        <button class="tab-btn ${tab === 'login' ? 'active' : ''}" id="tab-login" onclick="switchAuthTab('login')">로그인</button>
        <button class="tab-btn ${tab === 'signup' ? 'active' : ''}" id="tab-signup" onclick="switchAuthTab('signup')">회원가입</button>
      </div>

      <!-- LOGIN -->
      <div id="auth-login" style="display:${tab === 'login' ? 'block' : 'none'}">
        <form id="login-form" autocomplete="on">
          <div class="form-group mb-16" style="margin-bottom:16px">
            <label class="form-label">이메일</label>
            <input type="email" class="form-input" id="l-email" placeholder="email@example.com" required />
          </div>
          <div class="form-group" style="margin-bottom:24px">
            <label class="form-label">비밀번호</label>
            <input type="password" class="form-input" id="l-pw" placeholder="••••••••" required />
          </div>
          <div id="login-error" class="form-error mb-12" style="display:none;margin-bottom:12px"></div>
          <button type="submit" class="btn btn-primary btn-full">로그인</button>
          <p class="text-3 mt-12 text-center" style="font-size:12px">테스트 계정: student@test.kr / student1</p>
        </form>
      </div>

      <!-- SIGNUP -->
      <div id="auth-signup" style="display:${tab === 'signup' ? 'block' : 'none'}">
        <form id="signup-form" autocomplete="off">
          <div class="form-group mb-16" style="margin-bottom:16px">
            <label class="form-label">닉네임</label>
            <input type="text" class="form-input" id="s-nick" placeholder="사용할 닉네임" required />
          </div>
          <div class="form-group mb-16" style="margin-bottom:16px">
            <label class="form-label">이메일</label>
            <input type="email" class="form-input" id="s-email" placeholder="email@example.com" required />
          </div>
          <div class="form-group mb-16" style="margin-bottom:16px">
            <label class="form-label">비밀번호</label>
            <input type="password" class="form-input" id="s-pw" placeholder="8자 이상" required />
          </div>
          <div class="form-group" style="margin-bottom:20px">
            <label class="form-label">선호 장르 (복수 선택 가능)</label>
            <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:4px">
              ${['발라드','팝','R&B','록','재즈','트로트','힙합'].map(g => `
                <label class="chip" id="genre-${g}">
                  <input type="checkbox" name="genre" value="${g}" style="display:none" onchange="toggleChip(this,'genre-${g}')"> ${g}
                </label>`).join('')}
            </div>
          </div>
          <div id="signup-error" class="form-error mb-12" style="display:none;margin-bottom:12px"></div>
          <button type="submit" class="btn btn-primary btn-full">회원가입</button>
        </form>
      </div>

      <div class="auth-switch">
        트레이너이신가요? <a onclick="navigate('trainer-auth',{tab:'signup'})">트레이너 등록 →</a>
      </div>
    </div>
  </div>`;
}

function renderTrainerAuth(params) {
  const tab = (params && params.tab) || 'login';
  const specialties = ['고음처리', '호흡', '발성', '음정교정', '스케일', '박자감', '다이나믹', '팝/R&B', '발라드', '재즈', '음색개발'];
  return `
  <div class="auth-wrap">
    <div class="auth-card animate-up" style="max-width:560px">
      <div class="auth-logo grad-text">VocalAI</div>
      <div class="auth-subtitle">트레이너 계정</div>
      <div class="tabs mb-24" style="margin-bottom:28px">
        <button class="tab-btn ${tab === 'login' ? 'active' : ''}" onclick="switchAuthTab('login')">로그인</button>
        <button class="tab-btn ${tab === 'signup' ? 'active' : ''}" onclick="switchAuthTab('signup')">트레이너 등록</button>
      </div>

      <!-- LOGIN -->
      <div id="auth-login" style="display:${tab === 'login' ? 'block' : 'none'}">
        <form id="trainer-login-form">
          <div class="form-group mb-16" style="margin-bottom:16px">
            <label class="form-label">이메일</label>
            <input type="email" class="form-input" id="tl-email" placeholder="email@example.com" required />
          </div>
          <div class="form-group" style="margin-bottom:24px">
            <label class="form-label">비밀번호</label>
            <input type="password" class="form-input" id="tl-pw" placeholder="••••••••" required />
          </div>
          <div id="tlogin-error" class="form-error mb-12" style="display:none;margin-bottom:12px"></div>
          <button type="submit" class="btn btn-primary btn-full">로그인</button>
          <p class="text-3 mt-12 text-center" style="font-size:12px">테스트: trainer1@vocalai.kr / trainer1</p>
        </form>
      </div>

      <!-- SIGNUP -->
      <div id="auth-signup" style="display:${tab === 'signup' ? 'block' : 'none'}">
        <div class="badge badge-warning mb-16" style="margin-bottom:16px">⚠️ 등록 후 관리자 심사가 필요합니다 (1~3 영업일)</div>
        <form id="trainer-signup-form">
          <div class="form-row mb-16" style="margin-bottom:16px">
            <div class="form-group">
              <label class="form-label">이름</label>
              <input type="text" class="form-input" id="ts-name" placeholder="실명" required />
            </div>
            <div class="form-group">
              <label class="form-label">지도 경력 (년)</label>
              <input type="number" class="form-input" id="ts-career" placeholder="5" min="0" required />
            </div>
          </div>
          <div class="form-group mb-16" style="margin-bottom:16px">
            <label class="form-label">이메일</label>
            <input type="email" class="form-input" id="ts-email" placeholder="email@example.com" required />
          </div>
          <div class="form-group mb-16" style="margin-bottom:16px">
            <label class="form-label">비밀번호</label>
            <input type="password" class="form-input" id="ts-pw" placeholder="8자 이상" required />
          </div>
          <div class="form-group mb-16" style="margin-bottom:16px">
            <label class="form-label">레슨 가격 (원/시간)</label>
            <input type="number" class="form-input" id="ts-price" placeholder="60000" min="0" required />
          </div>
          <div class="form-group mb-16" style="margin-bottom:16px">
            <label class="form-label">전문 분야 (복수 선택)</label>
            <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:4px">
              ${specialties.map(s => `
                <label class="chip" id="sp-${s.replace('/','_')}">
                  <input type="checkbox" name="specialty" value="${s}" style="display:none" onchange="toggleChip(this,'sp-${s.replace('/','_')}')"> ${s}
                </label>`).join('')}
            </div>
          </div>
          <div class="form-group" style="margin-bottom:24px">
            <label class="form-label">자기소개</label>
            <textarea class="form-input form-textarea" id="ts-intro" placeholder="경력, 전문 분야, 지도 스타일 등을 자유롭게 적어주세요" required></textarea>
          </div>
          <div id="tsignup-error" class="form-error mb-12" style="display:none;margin-bottom:12px"></div>
          <button type="submit" class="btn btn-primary btn-full">트레이너 등록 신청</button>
        </form>
      </div>
      <div class="auth-switch">학생이신가요? <a onclick="navigate('student-auth',{tab:'login'})">학생 로그인 →</a></div>
    </div>
  </div>`;
}

function renderAdminAuth() {
  return `
  <div class="auth-wrap">
    <div class="auth-card animate-up">
      <div class="auth-logo grad-text">VocalAI</div>
      <div class="auth-subtitle">관리자 로그인</div>
      <form id="admin-login-form">
        <div class="form-group mb-16" style="margin-bottom:16px">
          <label class="form-label">이메일</label>
          <input type="email" class="form-input" id="al-email" placeholder="admin@vocalai.kr" required />
        </div>
        <div class="form-group" style="margin-bottom:24px">
          <label class="form-label">비밀번호</label>
          <input type="password" class="form-input" id="al-pw" placeholder="••••••••" required />
        </div>
        <div id="alogin-error" class="form-error mb-12" style="display:none;margin-bottom:12px"></div>
        <button type="submit" class="btn btn-primary btn-full">관리자 로그인</button>
        <p class="text-3 mt-12 text-center" style="font-size:12px">테스트: admin@vocalai.kr / admin1234</p>
      </form>
    </div>
  </div>`;
}

// ══════════════════════════════════════════════
// 10. STUDENT APP (Dashboard)
// ══════════════════════════════════════════════
function renderStudentApp(params) {
  if (!State.currentUser || State.userType !== 'student') {
    navigate('student-auth', { tab: 'login' }); return '';
  }
  const sub = (params && params.sub) || 'home';
  const subContents = {
    home: renderStudentHome,
    songs: renderStudentSongs,
    mr: renderStudentMR,
    trainers: renderStudentTrainers,
    lessons: renderStudentLessons,
    'song-analysis': renderStudentSongAnalysis,
  };
  const renderer = subContents[sub] || renderStudentHome;

  const navItems = [
    { key: 'home', icon: '🏠', label: '대시보드' },
    { key: 'songs', icon: '🎵', label: '곡 추천' },
    { key: 'mr', icon: '🎛', label: 'MR 스튜디오' },
    { key: 'trainers', icon: '👨‍🏫', label: '트레이너' },
    { key: 'lessons', icon: '📅', label: '내 레슨' },
    { key: 'song-analysis', icon: '🔬', label: '곡 분석' },
  ];

  return `
  <div class="page-wrap-full">
    <div class="dashboard-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px">
          <div class="avatar">${State.currentUser.nickname[0]}</div>
          <div>
            <div style="font-size:14px;font-weight:700">${State.currentUser.nickname}</div>
            <div class="badge badge-accent" style="font-size:11px;padding:2px 8px;margin-top:2px">학생</div>
          </div>
        </div>
        <div class="sidebar-section">
          <div class="sidebar-label">메뉴</div>
          ${navItems.map(item => `
            <button class="sidebar-item ${sub === item.key ? 'active' : ''}" onclick="navigate('student-dashboard',{sub:'${item.key}'})">
              <span class="sidebar-item-icon">${item.icon}</span>${item.label}
            </button>`).join('')}
        </div>
        <div class="divider"></div>
        <div class="sidebar-section">
          <button class="sidebar-item" onclick="navigate('submit')"><span class="sidebar-item-icon">🎙</span>새 분석</button>
          <button class="sidebar-item" onclick="Auth.logout()"><span class="sidebar-item-icon">🚪</span>로그아웃</button>
        </div>
      </aside>
      <!-- Content -->
      <div class="dashboard-content">
        ${renderer(params)}
      </div>
    </div>
  </div>`;
}

function renderStudentHome() {
  const u = State.currentUser;
  const submissions = DB.getSubmissions().filter(s => s.studentId === u.id);
  const bookings = DB.getBookings().filter(b => b.studentId === u.id);
  const upcomingLessons = bookings.filter(b => b.status === 'confirmed');

  return `
  <div class="animate-up">
    <div class="page-title">안녕하세요, ${u.nickname}님! 👋</div>
    <div class="page-sub">오늘도 보컬 실력을 향상시켜 보세요</div>

    <div class="grid-4 mb-24" style="margin-bottom:28px">
      <div class="stat-card">
        <div class="stat-card-label">총 분석 횟수</div>
        <div class="stat-card-val">${submissions.length}</div>
        <div class="stat-card-sub">회</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">예약된 레슨</div>
        <div class="stat-card-val">${upcomingLessons.length}</div>
        <div class="stat-card-sub">건</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">선호 장르</div>
        <div class="stat-card-val" style="font-size:16px">${u.preferredGenres && u.preferredGenres.length > 0 ? u.preferredGenres.slice(0,2).join(', ') : '미설정'}</div>
        <div class="stat-card-sub">장르</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">가입일</div>
        <div class="stat-card-val" style="font-size:16px">${u.createdAt}</div>
        <div class="stat-card-sub"></div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="section-header">
      <div><div class="section-title">빠른 시작</div></div>
    </div>
    <div class="grid-3 mb-24" style="margin-bottom:32px">
      <div class="card" style="cursor:pointer;transition:var(--transition-md)" onclick="navigate('submit')" onmouseenter="this.style.borderColor='var(--accent)'" onmouseleave="this.style.borderColor='var(--border)'">
        <div style="font-size:32px;margin-bottom:12px">🎙</div>
        <div style="font-size:15px;font-weight:700;margin-bottom:4px">새 보컬 분석</div>
        <div class="text-2" style="font-size:13px">음성 파일을 업로드해 AI 분석을 시작하세요</div>
      </div>
      <div class="card" style="cursor:pointer;transition:var(--transition-md)" onclick="navigate('student-dashboard',{sub:'trainers'})" onmouseenter="this.style.borderColor='var(--accent)'" onmouseleave="this.style.borderColor='var(--border)'">
        <div style="font-size:32px;margin-bottom:12px">👨‍🏫</div>
        <div style="font-size:15px;font-weight:700;margin-bottom:4px">트레이너 찾기</div>
        <div class="text-2" style="font-size:13px">전문 보컬 트레이너와 1:1 레슨을 예약하세요</div>
      </div>
      <div class="card" style="cursor:pointer;transition:var(--transition-md)" onclick="navigate('student-dashboard',{sub:'mr'})" onmouseenter="this.style.borderColor='var(--accent)'" onmouseleave="this.style.borderColor='var(--border)'">
        <div style="font-size:32px;margin-bottom:12px">🎛</div>
        <div style="font-size:15px;font-weight:700;margin-bottom:4px">MR 만들기</div>
        <div class="text-2" style="font-size:13px">AI 보컬 제거로 연습용 MR을 생성하세요</div>
      </div>
    </div>

    <!-- Recent Analyses -->
    <div class="section-header">
      <div class="section-title">최근 분석 히스토리</div>
      <button class="btn btn-ghost btn-sm" onclick="navigate('submit')">+ 새 분석</button>
    </div>
    ${submissions.length === 0 ? `
      <div class="empty-state">
        <div class="empty-icon">🎙</div>
        <div class="empty-title">아직 분석 내역이 없습니다</div>
        <div class="empty-desc">첫 번째 보컬 분석을 시작해 AI 리포트를 받아보세요</div>
        <button class="btn btn-primary" onclick="navigate('submit')">분석 시작하기</button>
      </div>` : `
      <div style="display:flex;flex-direction:column;gap:12px">
        ${submissions.slice(-5).reverse().map(s => {
          const analysis = DB.getAnalyses().find(a => a.submissionId === s.id);
          return `
          <div class="card card-sm flex gap-16 items-center" style="cursor:pointer" onclick="${analysis ? `showStoredAnalysis(${s.id})` : ''}">
            <div style="font-size:28px">🎵</div>
            <div style="flex:1">
              <div style="font-size:14px;font-weight:600">${s.fileName}</div>
              <div class="text-3" style="font-size:12px">${s.createdAt}</div>
            </div>
            ${analysis ? `<div style="text-align:center"><div style="font-size:22px;font-weight:800;color:var(--accent)">${analysis.overall}</div><div class="text-3" style="font-size:11px">종합점수</div></div>` : `<div class="badge badge-warning">분석중</div>`}
          </div>`;
        }).join('')}
      </div>`}
  </div>`;
}

function renderStudentSongs() {
  const u = State.currentUser;
  const songs = DB.getSongs();
  const genres = ['전체', ...new Set(songs.map(s => s.genre))];
  const difficulties = { easy: '쉬움', medium: '보통', hard: '어려움' };
  const diffColors = { easy: 'badge-success', medium: 'badge-info', hard: 'badge-danger' };

  return `
  <div class="animate-up">
    <div class="page-title">🎵 스마트 곡 추천</div>
    <div class="page-sub">당신의 음역대와 장르 취향에 맞는 곡을 추천합니다</div>

    <div class="card card-accent mb-24" style="margin-bottom:24px;display:flex;align-items:center;gap:20px">
      <span style="font-size:32px">💡</span>
      <div>
        <div style="font-size:14px;font-weight:700;margin-bottom:4px">AI 분석 기반 추천</div>
        <div class="text-2" style="font-size:13px">보컬 분석을 완료하면 음역대 기반으로 정확한 곡 추천을 받을 수 있습니다. <span class="text-accent" style="cursor:pointer" onclick="navigate('submit')">지금 분석하기 →</span></div>
      </div>
    </div>

    <!-- Filter -->
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px">
      ${genres.map(g => `<button class="chip genre-filter ${g === '전체' ? 'active' : ''}" data-genre="${g}" onclick="filterSongs(this,'${g}')">${g}</button>`).join('')}
    </div>

    <!-- Song List -->
    <div id="song-list" style="display:flex;flex-direction:column;gap:10px">
      ${songs.map((song, i) => `
        <div class="song-item" data-genre="${song.genre}" onclick="showSongDetail(${song.id})">
          <div class="song-num">${String(i+1).padStart(2,'0')}</div>
          <div class="song-thumb">${song.emoji}</div>
          <div class="song-info">
            <div class="song-title">${song.title}</div>
            <div class="song-artist">${song.artist}</div>
          </div>
          <div class="song-meta">
            <span class="badge ${diffColors[song.difficulty]}">${difficulties[song.difficulty]}</span>
            <span class="badge badge-muted">${song.genre}</span>
            <span class="text-3">${song.lowestNote}–${song.highestNote}</span>
          </div>
        </div>`).join('')}
    </div>
  </div>`;
}

function renderStudentMR() {
  const mrList = DB.getMrRequests().filter(r => r.studentId === State.currentUser.id);
  return `
  <div class="animate-up">
    <div class="page-title">🎛 MR 스튜디오</div>
    <div class="page-sub">원곡에서 AI가 보컬을 제거하고, 원하는 키로 조절한 MR을 생성합니다</div>

    <div class="grid-2 mb-24" style="margin-bottom:32px">
      <!-- MR Generation Form -->
      <div class="card card-xl">
        <h3 style="font-size:16px;font-weight:700;margin-bottom:20px">🎵 MR 생성</h3>
        <form id="mr-form">
          <div class="form-group mb-16" style="margin-bottom:16px">
            <label class="form-label">원곡 파일</label>
            <div class="drop-zone" id="mr-drop" style="padding:32px">
              <input type="file" id="mr-file" accept=".mp3,.wav,.m4a" />
              <span style="font-size:32px;display:block;margin-bottom:8px">🎼</span>
              <div style="font-size:14px;font-weight:600">파일 업로드</div>
              <div id="mr-file-name" class="text-accent" style="font-size:13px;margin-top:8px;display:none"></div>
            </div>
          </div>
          <div class="form-group mb-16" style="margin-bottom:16px">
            <label class="form-label">키(Key) 조절: <span id="key-display" class="text-accent">0 반음</span></label>
            <div style="display:flex;align-items:center;gap:12px;margin-top:8px">
              <span class="text-3" style="font-size:12px">-6</span>
              <input type="range" class="range-slider" id="key-slider" min="-6" max="6" step="1" value="0" oninput="document.getElementById('key-display').textContent=this.value+' 반음'" style="flex:1" />
              <span class="text-3" style="font-size:12px">+6</span>
            </div>
          </div>
          <div class="card" style="background:var(--warning-dim);border-color:rgba(245,158,11,0.3);padding:16px;margin-bottom:20px">
            <div style="font-size:13px;font-weight:700;margin-bottom:6px;color:var(--warning)">⚠️ 저작권 안내</div>
            <div style="font-size:12px;color:var(--text-2);line-height:1.6">생성된 MR은 개인 노래 연습 목적으로만 사용 가능합니다. 외부 유출 및 상업적 이용은 엄격히 금지됩니다.</div>
            <label class="check-group" style="margin-top:12px">
              <input type="checkbox" id="copyright-agree" required />
              <label for="copyright-agree" style="font-size:13px;color:var(--text-1)">저작권 가이드라인에 동의합니다</label>
            </label>
          </div>
          <button type="submit" class="btn btn-primary btn-full">🎛 MR 생성하기</button>
        </form>
      </div>

      <!-- MR List -->
      <div>
        <h3 style="font-size:16px;font-weight:700;margin-bottom:16px">📋 MR 목록</h3>
        ${mrList.length === 0 ? `
          <div class="empty-state" style="padding:48px 24px">
            <div class="empty-icon">🎼</div>
            <div class="empty-title">생성된 MR이 없습니다</div>
            <div class="empty-desc">원곡 파일을 업로드해 MR을 만들어보세요</div>
          </div>` : `
          <div style="display:flex;flex-direction:column;gap:12px">
            ${mrList.map(mr => `
              <div class="card card-sm flex gap-16 items-center">
                <span style="font-size:24px">🎼</span>
                <div style="flex:1">
                  <div style="font-size:14px;font-weight:600">${mr.originalFileName}</div>
                  <div class="text-3" style="font-size:12px">키: ${mr.keyShift > 0 ? '+' : ''}${mr.keyShift} 반음 · ${mr.createdAt}</div>
                </div>
                <div class="badge ${mr.status === 'completed' ? 'badge-success' : mr.status === 'processing' ? 'badge-warning' : 'badge-muted'}">${mr.status === 'completed' ? '완료' : mr.status === 'processing' ? '처리중' : '대기'}</div>
                ${mr.status === 'completed' ? `<button class="btn btn-secondary btn-sm" onclick="downloadMrFile(${mr.id})">⬇ 다운로드</button>` : ''}
              </div>`).join('')}
          </div>`}
      </div>
    </div>
  </div>`;
}

function renderStudentTrainers(params) {
  const trainers = DB.getTrainers().filter(t => t.approvalStatus === 'approved');
  const weakAreasParam = params && params.weakAreas ? params.weakAreas.split(',') : [];

  return `
  <div class="animate-up">
    <div class="page-title">👨‍🏫 트레이너 찾기</div>
    <div class="page-sub">AI 분석 결과를 바탕으로 맞춤 트레이너를 추천합니다</div>

    ${weakAreasParam.length > 0 ? `
    <div class="card card-accent mb-24" style="margin-bottom:24px">
      <div style="font-size:14px;font-weight:700;margin-bottom:8px">🎯 AI 추천 – 보완 필요 항목 기반</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${weakAreasParam.map(w => `<span class="badge badge-warning">${w}</span>`).join('')}
      </div>
    </div>` : ''}

    <!-- Search/Filter -->
    <div style="display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap">
      <input class="form-input" id="trainer-search" style="flex:1;min-width:200px" placeholder="트레이너 이름 또는 전문 분야 검색..." oninput="filterTrainers()" />
      <select class="form-input form-select" id="trainer-sort" style="width:160px" onchange="filterTrainers()">
        <option value="rating">평점순</option>
        <option value="price-asc">가격 낮은순</option>
        <option value="price-desc">가격 높은순</option>
        <option value="career">경력순</option>
      </select>
    </div>

    <div id="trainer-list" style="display:flex;flex-direction:column;gap:20px">
      ${trainers.map(t => renderTrainerCard(t, weakAreasParam)).join('')}
    </div>
  </div>`;
}

function renderTrainerCard(t, highlightSpecialties = []) {
  const matchScore = highlightSpecialties.length > 0
    ? Math.round((t.specialties.filter(s => highlightSpecialties.some(w => s.includes(w) || w.includes(s))).length / Math.max(highlightSpecialties.length, 1)) * 100)
    : null;

  return `
  <div class="trainer-card" data-name="${t.name}" data-specialties="${t.specialties.join(',')}">
    <div class="trainer-card-header">
      <div class="avatar avatar-lg">${t.profileEmoji}</div>
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:4px">
          <h3 style="font-size:17px;font-weight:800">${t.name}</h3>
          ${matchScore !== null ? `<span class="badge badge-accent">매칭 ${matchScore}%</span>` : ''}
        </div>
        <div class="trainer-rating">
          <div class="stars">${'★'.repeat(Math.round(t.averageRating))}${'☆'.repeat(5-Math.round(t.averageRating))}</div>
          <span style="font-size:14px;font-weight:700;color:var(--warning)">${t.averageRating}</span>
          <span class="text-3" style="font-size:13px">(${t.totalReviews}개 리뷰)</span>
          <span class="badge badge-muted">${t.careerYears}년 경력</span>
        </div>
      </div>
      <div style="text-align:right">
        <div class="trainer-price">${t.lessonPrice.toLocaleString()}원</div>
        <div class="text-3" style="font-size:12px">/시간</div>
      </div>
    </div>
    <p class="text-2" style="font-size:14px;line-height:1.65;margin-bottom:12px">${t.intro}</p>
    <div class="trainer-specialties">
      ${t.specialties.map(s => {
        const isMatch = highlightSpecialties.some(w => s.includes(w) || w.includes(s));
        return `<span class="badge ${isMatch ? 'badge-accent' : 'badge-muted'}">${s}</span>`;
      }).join('')}
    </div>
    <div style="display:flex;gap:12px;margin-top:16px">
      <button class="btn btn-primary btn-sm" onclick="showBookingModal(${t.id})">📅 레슨 예약</button>
      <button class="btn btn-secondary btn-sm" onclick="showTrainerDetail(${t.id})">프로필 보기</button>
    </div>
  </div>`;
}

function renderStudentLessons() {
  const u = State.currentUser;
  const bookings = DB.getBookings().filter(b => b.studentId === u.id);
  const trainers = DB.getTrainers();
  const payments = DB.getPayments();

  const statusMap = { pending: ['대기중', 'badge-warning'], confirmed: ['확정', 'badge-success'], cancelled: ['취소', 'badge-danger'], completed: ['완료', 'badge-muted'], refunded: ['환불', 'badge-info'] };

  return `
  <div class="animate-up">
    <div class="page-title">📅 내 레슨</div>
    <div class="page-sub">예약된 레슨과 지난 레슨 내역을 확인합니다</div>

    ${bookings.length === 0 ? `
    <div class="empty-state">
      <div class="empty-icon">📅</div>
      <div class="empty-title">예약된 레슨이 없습니다</div>
      <div class="empty-desc">전문 트레이너를 찾아 첫 레슨을 예약해보세요</div>
      <button class="btn btn-primary" onclick="navigate('student-dashboard',{sub:'trainers'})">트레이너 찾기</button>
    </div>` : `
    <div style="display:flex;flex-direction:column;gap:14px">
      ${bookings.slice().reverse().map(b => {
        const trainer = trainers.find(t => t.id === b.trainerId);
        const payment = payments.find(p => p.bookingId === b.id);
        const [statusLabel, statusClass] = statusMap[b.status] || ['알 수 없음', 'badge-muted'];
        return `
        <div class="booking-item">
          <div class="booking-date">
            <div class="booking-date-day">${b.lessonDate ? b.lessonDate.slice(8) : '--'}</div>
            <div class="booking-date-month">${b.lessonDate ? b.lessonDate.slice(0,7) : ''}</div>
          </div>
          <div class="divider-v" style="height:56px"></div>
          <div class="avatar avatar-lg">${trainer ? trainer.profileEmoji : '🎤'}</div>
          <div style="flex:1">
            <div style="font-size:15px;font-weight:700">${trainer ? trainer.name : '트레이너'} 선생님</div>
            <div class="text-2" style="font-size:13px">${b.lessonDate || '날짜 미정'} ${b.lessonStartTime || ''}</div>
            ${b.studentNote ? `<div class="text-3" style="font-size:12px;margin-top:2px">요청: ${b.studentNote}</div>` : ''}
          </div>
          <div style="text-align:right;display:flex;flex-direction:column;gap:6px;align-items:flex-end">
            <span class="badge ${statusClass}">${statusLabel}</span>
            ${payment ? `<div style="font-size:13px;font-weight:700">${payment.amount.toLocaleString()}원</div>` : ''}
            ${b.status === 'completed' && !DB.getReviews().find(r => r.bookingId === b.id) ? `<button class="btn btn-sm btn-secondary" onclick="showReviewModal(${b.id},${b.trainerId})">리뷰 작성</button>` : ''}
            ${b.status === 'confirmed' ? `<button class="btn btn-sm btn-danger" onclick="cancelBooking(${b.id})">취소</button>` : ''}
          </div>
        </div>`;
      }).join('')}
    </div>`}
  </div>`;
}

// ══════════════════════════════════════════════
// 11. TRAINER APP
// ══════════════════════════════════════════════
function renderTrainerApp(params) {
  if (!State.currentUser || State.userType !== 'trainer') {
    navigate('trainer-auth', { tab: 'login' }); return '';
  }
  const t = State.currentUser;

  if (t.approvalStatus === 'pending') {
    return `
    <div class="page-wrap">
      <div class="container" style="max-width:560px">
        <div class="card card-xl text-center animate-up">
          <div style="font-size:64px;margin-bottom:20px">⏳</div>
          <h2 style="font-size:24px;font-weight:800;margin-bottom:12px">심사 대기 중입니다</h2>
          <p class="text-2 mb-24" style="margin-bottom:24px">관리자가 등록 내용을 검토 중입니다. 승인까지 1~3 영업일이 소요됩니다.</p>
          <div class="badge badge-warning" style="font-size:14px;padding:8px 16px">pending</div>
          <div class="divider mt-24" style="margin-top:24px"></div>
          <div style="font-size:13px;color:var(--text-3)">승인 완료 시 이메일로 안내드립니다</div>
          <button class="btn btn-ghost btn-sm mt-16" style="margin-top:16px" onclick="Auth.logout()">로그아웃</button>
        </div>
      </div>
    </div>`;
  }
  if (t.approvalStatus === 'rejected') {
    return `
    <div class="page-wrap">
      <div class="container" style="max-width:560px">
        <div class="card card-xl text-center animate-up">
          <div style="font-size:64px;margin-bottom:20px">❌</div>
          <h2 style="font-size:24px;font-weight:800;margin-bottom:12px">등록이 거절되었습니다</h2>
          <p class="text-2">사유: ${t.rejectionReason || '자격 요건 미충족'}</p>
          <button class="btn btn-ghost btn-sm mt-16" style="margin-top:16px" onclick="Auth.logout()">로그아웃</button>
        </div>
      </div>
    </div>`;
  }

  const sub = (params && params.sub) || 'home';
  const navItems = [
    { key: 'home', icon: '🏠', label: '대시보드' },
    { key: 'requests', icon: '📬', label: '레슨 요청' },
    { key: 'schedule', icon: '📅', label: '스케줄 관리' },
    { key: 'profile', icon: '👤', label: '프로필 수정' },
  ];
  const subContents = { home: renderTrainerHome, requests: renderTrainerRequests, schedule: renderTrainerSchedule, profile: renderTrainerProfile };
  const renderer = subContents[sub] || renderTrainerHome;

  return `
  <div class="page-wrap-full">
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:32px">
          <div class="avatar avatar-lg">${t.profileEmoji || '🎤'}</div>
          <div>
            <div style="font-size:14px;font-weight:700">${t.name}</div>
            <div class="badge badge-accent" style="font-size:11px;padding:2px 8px;margin-top:2px">트레이너</div>
          </div>
        </div>
        <div class="sidebar-section">
          <div class="sidebar-label">메뉴</div>
          ${navItems.map(item => `
            <button class="sidebar-item ${sub === item.key ? 'active' : ''}" onclick="navigate('trainer-dashboard',{sub:'${item.key}'})">
              <span class="sidebar-item-icon">${item.icon}</span>${item.label}
            </button>`).join('')}
        </div>
        <div class="divider"></div>
        <button class="sidebar-item" onclick="Auth.logout()"><span class="sidebar-item-icon">🚪</span>로그아웃</button>
      </aside>
      <div class="dashboard-content">${renderer()}</div>
    </div>
  </div>`;
}

function renderTrainerHome() {
  const t = State.currentUser;
  const bookings = DB.getBookings().filter(b => b.trainerId === t.id);
  const pending = bookings.filter(b => b.status === 'pending');
  const confirmed = bookings.filter(b => b.status === 'confirmed');
  const completed = bookings.filter(b => b.status === 'completed');
  const payments = DB.getPayments();
  const totalEarnings = payments.filter(p => bookings.some(b => b.id === p.bookingId) && p.status === 'paid').reduce((sum, p) => sum + Math.round(p.amount * 0.8), 0);
  const reviews = DB.getReviews().filter(r => r.trainerId === t.id);

  return `
  <div class="animate-up">
    <div class="page-title">안녕하세요, ${t.name} 선생님! 🎤</div>
    <div class="page-sub">오늘의 레슨 현황을 확인하세요</div>

    <div class="grid-4 mb-24" style="margin-bottom:28px">
      <div class="stat-card">
        <div class="stat-card-label">대기 중 요청</div>
        <div class="stat-card-val" style="color:var(--warning)">${pending.length}</div>
        <div class="stat-card-sub">건</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">확정 레슨</div>
        <div class="stat-card-val" style="color:var(--success)">${confirmed.length}</div>
        <div class="stat-card-sub">건</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">총 완료</div>
        <div class="stat-card-val">${completed.length}</div>
        <div class="stat-card-sub">건</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-label">누적 정산</div>
        <div class="stat-card-val" style="font-size:18px">${totalEarnings.toLocaleString()}</div>
        <div class="stat-card-sub">원</div>
      </div>
    </div>

    <!-- Rating Summary -->
    <div class="card mb-24" style="margin-bottom:24px;display:flex;align-items:center;gap:32px">
      <div style="text-align:center">
        <div style="font-size:48px;font-weight:900;color:var(--warning)">${t.averageRating}</div>
        <div class="stars" style="justify-content:center;margin-top:4px">${'★'.repeat(Math.round(t.averageRating))}${'☆'.repeat(5-Math.round(t.averageRating))}</div>
        <div class="text-3" style="font-size:12px;margin-top:4px">${t.totalReviews}개 리뷰</div>
      </div>
      <div class="divider-v" style="height:80px"></div>
      <div style="flex:1">
        <div style="font-size:15px;font-weight:700;margin-bottom:16px">최근 리뷰</div>
        ${reviews.length === 0 ? `<div class="text-3" style="font-size:13px">아직 리뷰가 없습니다</div>` :
          reviews.slice(-3).reverse().map(r => {
            const students = DB.getStudents();
            const st = students.find(s => s.id === r.studentId);
            return `<div style="margin-bottom:10px"><span class="text-warning">★${r.rating}</span> <span class="text-2" style="font-size:13px">${r.content || '내용 없음'}</span> <span class="text-3" style="font-size:11px">– ${st ? st.nickname : '학생'}</span></div>`;
          }).join('')}
      </div>
    </div>

    <!-- Quick pending requests -->
    ${pending.length > 0 ? `
    <div class="section-header">
      <div class="section-title">🔔 대기 중인 레슨 요청</div>
      <button class="btn btn-ghost btn-sm" onclick="navigate('trainer-dashboard',{sub:'requests'})">전체 보기</button>
    </div>
    <div style="display:flex;flex-direction:column;gap:12px">
      ${pending.slice(0,3).map(b => {
        const students = DB.getStudents();
        const st = students.find(s => s.id === b.studentId);
        return `
        <div class="booking-item">
          <div class="avatar">${st ? st.nickname[0] : '?'}</div>
          <div style="flex:1">
            <div style="font-size:14px;font-weight:600">${st ? st.nickname : '학생'}</div>
            <div class="text-3" style="font-size:12px">${b.lessonDate || '날짜 미정'} ${b.lessonStartTime || ''}</div>
            ${b.studentNote ? `<div class="text-3" style="font-size:12px">요청: ${b.studentNote}</div>` : ''}
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-success btn-sm" onclick="handleLessonRequest(${b.id},'confirmed')">수락</button>
            <button class="btn btn-danger btn-sm" onclick="handleLessonRequest(${b.id},'cancelled')">거절</button>
          </div>
        </div>`;
      }).join('')}
    </div>` : ''}
  </div>`;
}

function renderTrainerRequests() {
  const t = State.currentUser;
  const bookings = DB.getBookings().filter(b => b.trainerId === t.id);
  const students = DB.getStudents();
  const statusMap = { pending: ['대기중', 'badge-warning'], confirmed: ['확정', 'badge-success'], cancelled: ['취소', 'badge-danger'], completed: ['완료', 'badge-muted'] };

  return `
  <div class="animate-up">
    <div class="page-title">📬 레슨 요청 관리</div>
    <div class="page-sub">학생들의 레슨 요청을 확인하고 수락 또는 거절하세요</div>
    ${bookings.length === 0 ? `
    <div class="empty-state">
      <div class="empty-icon">📬</div>
      <div class="empty-title">아직 레슨 요청이 없습니다</div>
      <div class="empty-desc">학생들이 트레이너 프로필을 보고 레슨을 요청하면 여기에 표시됩니다</div>
    </div>` : `
    <div style="display:flex;flex-direction:column;gap:14px">
      ${bookings.slice().reverse().map(b => {
        const st = students.find(s => s.id === b.studentId);
        const [statusLabel, statusClass] = statusMap[b.status] || ['알 수 없음', 'badge-muted'];
        return `
        <div class="booking-item">
          <div class="avatar">${st ? st.nickname[0] : '?'}</div>
          <div style="flex:1">
            <div style="font-size:15px;font-weight:700">${st ? st.nickname : '학생'}</div>
            <div class="text-2" style="font-size:13px">${b.lessonDate || '날짜 미정'} ${b.lessonStartTime || ''} – ${b.lessonEndTime || ''}</div>
            ${b.studentNote ? `<div class="text-3" style="font-size:12px;margin-top:2px">"${b.studentNote}"</div>` : ''}
          </div>
          <span class="badge ${statusClass}">${statusLabel}</span>
          ${b.status === 'pending' ? `
          <div style="display:flex;gap:8px">
            <button class="btn btn-success btn-sm" onclick="handleLessonRequest(${b.id},'confirmed')">✓ 수락</button>
            <button class="btn btn-danger btn-sm" onclick="handleLessonRequest(${b.id},'cancelled')">✕ 거절</button>
          </div>` : b.status === 'confirmed' ? `
          <button class="btn btn-secondary btn-sm" onclick="handleLessonRequest(${b.id},'completed')">완료 처리</button>` : ''}
        </div>`;
      }).join('')}
    </div>`}
  </div>`;
}

function renderTrainerSchedule() {
  const t = State.currentUser;
  const schedules = DB.getSchedules().filter(s => s.trainerId === t.id);
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  return `
  <div class="animate-up">
    <div class="page-title">📅 스케줄 관리</div>
    <div class="page-sub">레슨 가능 시간을 설정하세요. 클릭하여 가능/불가능을 전환합니다</div>

    <div class="card mb-24" style="margin-bottom:24px">
      <div class="schedule-grid">
        <div class="schedule-cell header"></div>
        ${days.map(d => `<div class="schedule-cell header">${d}</div>`).join('')}
        ${hours.map(h => `
          <div class="schedule-cell header" style="font-size:11px">${h}</div>
          ${days.map((d,di) => {
            const key = `${di}-${h}`;
            const isAvailable = schedules.some(s => s.dayIndex === di && s.hour === h);
            return `<div class="schedule-cell ${isAvailable ? 'available' : ''}" data-day="${di}" data-hour="${h}" onclick="toggleScheduleSlot(this,${di},'${h}')">${isAvailable ? '✓' : ''}</div>`;
          }).join('')}
        `).join('')}
      </div>
    </div>

    <div style="display:flex;gap:20px;font-size:13px;color:var(--text-3)">
      <span><span style="color:var(--accent)">■</span> 레슨 가능</span>
      <span><span style="color:var(--text-3)">■</span> 불가능</span>
    </div>
  </div>`;
}

function renderTrainerProfile() {
  const t = State.currentUser;
  const specialties = ['고음처리', '호흡', '발성', '음정교정', '스케일', '박자감', '다이나믹', '팝/R&B', '발라드', '재즈', '음색개발'];
  return `
  <div class="animate-up" style="max-width:600px">
    <div class="page-title">👤 프로필 수정</div>
    <div class="page-sub">학생들에게 보이는 트레이너 프로필을 수정합니다</div>
    <div class="card card-xl">
      <form id="trainer-profile-form">
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:28px">
          <div class="avatar avatar-xl">${t.profileEmoji || '🎤'}</div>
          <div>
            <div style="font-size:18px;font-weight:800">${t.name}</div>
            <div class="badge badge-success mt-8" style="margin-top:8px">승인된 트레이너</div>
          </div>
        </div>
        <div class="form-row mb-16" style="margin-bottom:16px">
          <div class="form-group">
            <label class="form-label">경력 (년)</label>
            <input type="number" class="form-input" id="p-career" value="${t.careerYears}" min="0" />
          </div>
          <div class="form-group">
            <label class="form-label">레슨 가격 (원/시간)</label>
            <input type="number" class="form-input" id="p-price" value="${t.lessonPrice}" min="0" />
          </div>
        </div>
        <div class="form-group mb-16" style="margin-bottom:16px">
          <label class="form-label">전문 분야</label>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:4px">
            ${specialties.map(s => {
              const isActive = t.specialties.includes(s);
              return `<label class="chip ${isActive ? 'active' : ''}" id="tp-${s.replace('/','_')}">
                <input type="checkbox" name="specialty" value="${s}" style="display:none" ${isActive ? 'checked' : ''} onchange="toggleChip(this,'tp-${s.replace('/','_')}')"> ${s}
              </label>`;
            }).join('')}
          </div>
        </div>
        <div class="form-group" style="margin-bottom:24px">
          <label class="form-label">자기소개</label>
          <textarea class="form-input form-textarea" id="p-intro">${t.intro}</textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-full">프로필 저장</button>
      </form>
    </div>
  </div>`;
}

// ══════════════════════════════════════════════
// 12. ADMIN DASHBOARD
// ══════════════════════════════════════════════
function renderAdminDashboard() {
  if (!State.currentUser || State.userType !== 'admin') {
    navigate('admin-auth'); return '';
  }
  const trainers = DB.getTrainers();
  const students = DB.getStudents();
  const submissions = DB.getSubmissions();
  const bookings = DB.getBookings();
  const pending = trainers.filter(t => t.approvalStatus === 'pending');
  const approved = trainers.filter(t => t.approvalStatus === 'approved');

  return `
  <div class="page-wrap">
    <div class="container">
      <div class="animate-up">
        <div class="section-header mb-24" style="margin-bottom:32px">
          <div>
            <div class="page-title">🛡 관리자 패널</div>
            <div class="page-sub">플랫폼 전체 현황을 관리합니다</div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="Auth.logout()">로그아웃</button>
        </div>

        <!-- Stats -->
        <div class="grid-4 mb-24" style="margin-bottom:32px">
          <div class="stat-card">
            <div class="stat-card-label">전체 학생</div>
            <div class="stat-card-val">${students.length}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-label">승인된 트레이너</div>
            <div class="stat-card-val" style="color:var(--success)">${approved.length}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-label">심사 대기</div>
            <div class="stat-card-val" style="color:var(--warning)">${pending.length}</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-label">총 분석 건수</div>
            <div class="stat-card-val">${submissions.length}</div>
          </div>
        </div>

        <!-- Pending Trainers -->
        <div class="section-header mb-16" style="margin-bottom:20px">
          <div class="section-title">⏳ 심사 대기 트레이너</div>
          <span class="badge badge-warning">${pending.length}건</span>
        </div>
        ${pending.length === 0 ? `
        <div class="card" style="text-align:center;padding:40px">
          <div style="font-size:32px;margin-bottom:12px">✅</div>
          <div style="font-weight:600">대기 중인 심사 요청이 없습니다</div>
        </div>` : `
        <div style="display:flex;flex-direction:column;gap:14px;margin-bottom:40px">
          ${pending.map(t => `
          <div class="card" style="display:flex;gap:16px;align-items:flex-start">
            <div class="avatar avatar-lg">${t.profileEmoji || '🎤'}</div>
            <div style="flex:1">
              <div style="display:flex;align-items:center;gap:12px;margin-bottom:4px">
                <span style="font-size:16px;font-weight:700">${t.name}</span>
                <span class="badge badge-muted">${t.careerYears}년 경력</span>
                <span class="badge badge-muted">${t.lessonPrice.toLocaleString()}원/시간</span>
              </div>
              <div class="text-3" style="font-size:13px;margin-bottom:4px">${t.email}</div>
              <p class="text-2" style="font-size:13px;margin-bottom:8px">${t.intro}</p>
              <div style="display:flex;gap:6px;flex-wrap:wrap">
                ${t.specialties.map(s => `<span class="badge badge-muted">${s}</span>`).join('')}
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px">
              <button class="btn btn-success btn-sm" onclick="adminApprove(${t.id},'approved')">✓ 승인</button>
              <button class="btn btn-danger btn-sm" onclick="adminApprove(${t.id},'rejected')">✕ 거절</button>
            </div>
          </div>`).join('')}
        </div>`}

        <!-- All Trainers -->
        <div class="section-header mb-16" style="margin-bottom:20px">
          <div class="section-title">👨‍🏫 전체 트레이너 목록</div>
        </div>
        <div class="table-wrap mb-24" style="margin-bottom:32px">
          <table class="data-table">
            <thead>
              <tr><th>이름</th><th>이메일</th><th>전문분야</th><th>상태</th><th>가입일</th><th>관리</th></tr>
            </thead>
            <tbody>
              ${trainers.map(t => {
                const statusClass = t.approvalStatus === 'approved' ? 'badge-success' : t.approvalStatus === 'pending' ? 'badge-warning' : 'badge-danger';
                const statusLabel = t.approvalStatus === 'approved' ? '승인' : t.approvalStatus === 'pending' ? '대기' : '거절';
                return `<tr>
                  <td><div style="display:flex;gap:10px;align-items:center"><span>${t.profileEmoji || '🎤'}</span><strong>${t.name}</strong></div></td>
                  <td class="text-2">${t.email}</td>
                  <td><div style="display:flex;gap:4px;flex-wrap:wrap">${t.specialties.slice(0,2).map(s=>`<span class="badge badge-muted">${s}</span>`).join('')}</div></td>
                  <td><span class="badge ${statusClass}">${statusLabel}</span></td>
                  <td class="text-3">${t.createdAt}</td>
                  <td>
                    ${t.approvalStatus !== 'approved' ? `<button class="btn btn-sm btn-success" onclick="adminApprove(${t.id},'approved')">승인</button>` : ''}
                    ${t.approvalStatus !== 'rejected' ? `<button class="btn btn-sm btn-danger" onclick="adminApprove(${t.id},'rejected')">거절</button>` : ''}
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>

        <!-- Students -->
        <div class="section-header mb-16" style="margin-bottom:20px">
          <div class="section-title">🎓 전체 학생 목록</div>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr><th>닉네임</th><th>이메일</th><th>선호장르</th><th>가입일</th></tr>
            </thead>
            <tbody>
              ${students.map(s => `<tr>
                <td><strong>${s.nickname}</strong></td>
                <td class="text-2">${s.email}</td>
                <td>${(s.preferredGenres || []).join(', ') || '–'}</td>
                <td class="text-3">${s.createdAt}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>`;
}

// ══════════════════════════════════════════════
// 13. EVENT LISTENERS
// ══════════════════════════════════════════════
function attachPageListeners(page, params) {
  // Submit form
  if (page === 'submit') attachSubmitListeners();
  if (page === 'student-auth') attachStudentAuthListeners();
  if (page === 'trainer-auth') attachTrainerAuthListeners();
  if (page === 'admin-auth') attachAdminAuthListeners();
  if (page === 'analysis') setTimeout(() => drawRadarChart(params.analysis), 100);
  if (page === 'student-dashboard') {
    const sub = (params && params.sub) || 'home';
    if (sub === 'mr') attachMrListeners();
    if (sub === 'song-analysis') attachSongAnalysisListeners();
    if (sub === 'profile' || sub === 'trainer-profile') {}
  }
  if (page === 'trainer-dashboard') {
    const sub = (params && params.sub) || 'home';
    if (sub === 'profile') attachTrainerProfileListeners();
  }
}

function attachSubmitListeners() {
  const fileInput = document.getElementById('audio-file');
  const dropZone = document.getElementById('drop-zone');
  const fileNameEl = document.getElementById('file-name');

  if (fileInput) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files[0]) {
        fileNameEl.textContent = '✅ ' + fileInput.files[0].name;
        fileNameEl.style.display = 'block';
      }
    });
  }
  if (dropZone) {
    dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', e => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      if (e.dataTransfer.files[0] && fileInput) {
        const dt = new DataTransfer();
        dt.items.add(e.dataTransfer.files[0]);
        fileInput.files = dt.files;
        fileNameEl.textContent = '✅ ' + e.dataTransfer.files[0].name;
        fileNameEl.style.display = 'block';
      }
    });
  }

  const form = document.getElementById('submit-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const file = fileInput && fileInput.files[0];
      if (!file) { showToast('음성 파일을 선택해주세요', 'error'); return; }
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) { showToast('파일 크기는 50MB 이하여야 합니다', 'error'); return; }
      const allowed = ['.mp3', '.wav', '.m4a', '.ogg'];
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      if (!allowed.includes(ext)) { showToast('MP3, WAV, M4A, OGG 파일만 가능합니다', 'error'); return; }

      const requirements = document.getElementById('requirements')?.value || '';
      const guestEmail = document.getElementById('guest-email')?.value || '';

      startAnalysis(file.name, requirements, guestEmail);
    });
  }
}

function startAnalysis(fileName, requirements, guestEmail) {
  showLoading('AI가 음성을 분석 중입니다...');
  setTimeout(() => {
    const analysis = generateAnalysis(fileName, requirements);
    const submissions = DB.getSubmissions();
    const newSub = {
      id: DB.nextId(submissions),
      studentId: State.currentUser?.id || null,
      guestEmail,
      fileName,
      requirements,
      status: 'completed',
      accessToken: 'tok_' + Math.random().toString(36).slice(2),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    submissions.push(newSub);
    DB.setSubmissions(submissions);

    const analyses = DB.getAnalyses();
    const newAnalysis = { id: DB.nextId(analyses), submissionId: newSub.id, ...analysis };
    analyses.push(newAnalysis);
    DB.setAnalyses(analyses);

    hideLoading();
    navigate('analysis', { analysis: { ...analysis, fileName, processTime: (Math.random() * 1.5 + 1.5).toFixed(1) } });
    showToast('분석이 완료되었습니다!', 'success');
  }, 2800);
}

function generateAnalysis(fileName, requirements) {
  const base = () => Math.floor(Math.random() * 30 + 60);
  const pitch = base(), rhythm = base(), volume = base(), timbre = base();
  const overall = Math.round((pitch + rhythm + volume + timbre) / 4);

  const weakAreas = [];
  if (pitch < 72) weakAreas.push('음정교정');
  if (rhythm < 72) weakAreas.push('박자감');
  if (volume < 72) weakAreas.push('다이나믹');
  if (timbre < 72) weakAreas.push('음색개발');
  if (pitch >= 80 && overall < 80) weakAreas.push('고음처리');
  if (requirements.includes('호흡')) weakAreas.push('호흡');

  const pitchFB = pitch >= 80 ? '음정이 전반적으로 안정적입니다. 고음 구간에서 약간의 불안정함이 있으나 연습으로 개선 가능합니다.' : pitch >= 65 ? '음정 이탈이 일부 구간에서 발생합니다. 특히 전환음(transition note)에서 주의가 필요합니다.' : '음정 이탈이 다수 구간에서 나타납니다. 기본 음정 훈련과 청음 연습을 병행하기를 권장합니다.';
  const rhythmFB = rhythm >= 80 ? '박자 유지가 매우 안정적입니다. 강약 처리가 음악적으로 자연스럽습니다.' : rhythm >= 65 ? '박자가 전체적으로 양호하나 빠른 구간에서 약간의 딜레이가 있습니다.' : '박자 유지에 어려움이 있습니다. 메트로놈 훈련을 통해 리듬감을 향상시키세요.';
  const volumeFB = volume >= 80 ? '성량 조절이 훌륭합니다. 클라이맥스와 여린 부분의 대비가 효과적입니다.' : volume >= 65 ? '성량이 전반적으로 안정되어 있지만 다이나믹 폭을 더 넓히면 좋겠습니다.' : '성량이 일정하게 유지되지 않습니다. 호흡 지지(breath support)를 강화하는 연습이 필요합니다.';
  const timbreFB = timbre >= 80 ? '음색이 매력적이고 일관성이 높습니다. 개인 색깔이 잘 드러납니다.' : timbre >= 65 ? '음색이 보통 수준입니다. 발성 훈련을 통해 더 풍부한 음색을 만들 수 있습니다.' : '음색 발달이 더 필요합니다. 공명(resonance) 훈련과 후두 조절 연습을 추천합니다.';

  return { pitch, rhythm, volume, timbre, overall, pitchFeedback: pitchFB, rhythmFeedback: rhythmFB, volumeFeedback: volumeFB, timbreFeedback: timbreFB, weakAreas };
}

function attachStudentAuthListeners() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('l-email')?.value;
      const pw = document.getElementById('l-pw')?.value;
      const result = Auth.login('student', email, pw);
      if (result.ok) {
        showToast('로그인되었습니다!', 'success');
        navigate('student-dashboard', { sub: 'home' });
      } else {
        const el = document.getElementById('login-error');
        if (el) { el.textContent = result.msg; el.style.display = 'block'; }
      }
    });
  }
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      const nick = document.getElementById('s-nick')?.value;
      const email = document.getElementById('s-email')?.value;
      const pw = document.getElementById('s-pw')?.value;
      if (pw.length < 6) { const el = document.getElementById('signup-error'); if(el){el.textContent='비밀번호는 6자 이상이어야 합니다';el.style.display='block';} return; }
      const genres = [...document.querySelectorAll('input[name="genre"]:checked')].map(el => el.value);
      const result = Auth.register('student', { nickname: nick, email, password: pw, genres });
      if (result.ok) {
        showToast('회원가입 완료! 환영합니다 🎉', 'success');
        navigate('student-dashboard', { sub: 'home' });
      } else {
        const el = document.getElementById('signup-error');
        if (el) { el.textContent = result.msg; el.style.display = 'block'; }
      }
    });
  }
}

function attachTrainerAuthListeners() {
  const loginForm = document.getElementById('trainer-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('tl-email')?.value;
      const pw = document.getElementById('tl-pw')?.value;
      const result = Auth.login('trainer', email, pw);
      if (result.ok) {
        showToast('로그인되었습니다!', 'success');
        navigate('trainer-dashboard', { sub: 'home' });
      } else {
        const el = document.getElementById('tlogin-error');
        if (el) { el.textContent = result.msg; el.style.display = 'block'; }
      }
    });
  }
  const signupForm = document.getElementById('trainer-signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('ts-name')?.value;
      const email = document.getElementById('ts-email')?.value;
      const pw = document.getElementById('ts-pw')?.value;
      const career = document.getElementById('ts-career')?.value;
      const price = document.getElementById('ts-price')?.value;
      const intro = document.getElementById('ts-intro')?.value;
      const specialties = [...document.querySelectorAll('input[name="specialty"]:checked')].map(el => el.value);
      if (pw.length < 6) { const el = document.getElementById('tsignup-error'); if(el){el.textContent='비밀번호는 6자 이상이어야 합니다';el.style.display='block';} return; }
      const result = Auth.register('trainer', { name, email, password: pw, careerYears: career, lessonPrice: price, intro, specialties });
      if (result.ok) {
        showToast('트레이너 등록 신청 완료! 심사 후 활성화됩니다', 'info');
        navigate('trainer-auth', { tab: 'login' });
      } else {
        const el = document.getElementById('tsignup-error');
        if (el) { el.textContent = result.msg; el.style.display = 'block'; }
      }
    });
  }
}

function attachAdminAuthListeners() {
  const form = document.getElementById('admin-login-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('al-email')?.value;
      const pw = document.getElementById('al-pw')?.value;
      const result = Auth.login('admin', email, pw);
      if (result.ok) {
        showToast('관리자 로그인 완료', 'success');
        navigate('admin-dashboard');
      } else {
        const el = document.getElementById('alogin-error');
        if (el) { el.textContent = result.msg; el.style.display = 'block'; }
      }
    });
  }
}

function attachMrListeners() {
  const mrFile = document.getElementById('mr-file');
  const mrFileName = document.getElementById('mr-file-name');
  if (mrFile && mrFileName) {
    mrFile.addEventListener('change', () => {
      if (mrFile.files[0]) { mrFileName.textContent = '✅ ' + mrFile.files[0].name; mrFileName.style.display = 'block'; }
    });
  }
  const mrForm = document.getElementById('mr-form');
  if (mrForm) {
    mrForm.addEventListener('submit', async e => {
      e.preventDefault();
      const file = mrFile?.files[0];
      if (!file) { showToast('원곡 파일을 선택해주세요', 'error'); return; }
      if (!document.getElementById('copyright-agree')?.checked) { showToast('저작권 가이드라인에 동의해주세요', 'error'); return; }
      const keyShift = parseInt(document.getElementById('key-slider')?.value || '0');

      showLoading(keyShift !== 0 ? `키 ${keyShift > 0 ? '+' : ''}${keyShift}반음 적용 중...` : '오디오 처리 중...');

      const mrList = DB.getMrRequests();
      const newId = DB.nextId(mrList);

      await processMrAudio(file, keyShift, newId);

      mrList.push({
        id: newId, studentId: State.currentUser.id,
        originalFileName: file.name, keyShift, status: 'completed',
        createdAt: new Date().toISOString().slice(0, 10)
      });
      DB.setMrRequests(mrList);
      hideLoading();
      showToast('MR 생성 완료! 다운로드 버튼을 누르세요.', 'success');
      navigate('student-dashboard', { sub: 'mr' });
    });
  }
}

// ── MR 오디오 메모리 저장소 (mrId → { url, name })
const MrBlobStore = {};

// ── AudioBuffer → 16-bit PCM WAV Blob 변환
function audioBufferToWavBlob(buffer) {
  const numCh = buffer.numberOfChannels;
  const sr    = buffer.sampleRate;
  const len   = buffer.length;
  const bps   = 2;
  const ab    = new ArrayBuffer(44 + len * numCh * bps);
  const view  = new DataView(ab);
  const ws = (off, s) => { for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i)); };
  ws(0, 'RIFF');
  view.setUint32(4,  36 + len * numCh * bps, true);
  ws(8, 'WAVE');  ws(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20,  1, true);
  view.setUint16(22, numCh, true);
  view.setUint32(24, sr, true);
  view.setUint32(28, sr * numCh * bps, true);
  view.setUint16(32, numCh * bps, true);
  view.setUint16(34, 16, true);
  ws(36, 'data');
  view.setUint32(40, len * numCh * bps, true);
  let off = 44;
  for (let i = 0; i < len; i++) {
    for (let ch = 0; ch < numCh; ch++) {
      const s = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]));
      view.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      off += 2;
    }
  }
  return new Blob([ab], { type: 'audio/wav' });
}

// ── 보컬 제거 (위상 반전, OOPS) 및 키 조절 오디오 처리
async function processMrAudio(file, keyShift, mrId) {
  try {
    const arrayBuf = await file.arrayBuffer();
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const decoded  = await audioCtx.decodeAudioData(arrayBuf);
    await audioCtx.close();

    // ① 보컬 제거 (위상 반전: L - R)
    // 센터에 위치한 보컬을 상쇄하여 반주만 남김 (스테레오 곡 한정)
    if (decoded.numberOfChannels >= 2) {
      const L = decoded.getChannelData(0);
      const R = decoded.getChannelData(1);
      for (let i = 0; i < L.length; i++) {
        const diff = (L[i] - R[i]) * 0.7; // 상쇄 후 볼륨 보정
        L[i] = diff;
        R[i] = diff; // 양쪽 채널에 동일하게 적용하여 듀얼 모노 MR 생성
      }
    }

    // ② 키 조절 (OfflineAudioContext + playbackRate)
    const rate   = Math.pow(2, keyShift / 12);
    const newLen = Math.round(decoded.length / rate);
    const offCtx = new OfflineAudioContext(decoded.numberOfChannels, newLen, decoded.sampleRate);
    
    const src    = offCtx.createBufferSource();
    src.buffer = decoded;
    src.playbackRate.value = rate;
    src.connect(offCtx.destination);
    src.start(0);

    // ③ 최종 WAV 인코딩 및 저장
    const rendered = await offCtx.startRendering();
    const wavBlob  = audioBufferToWavBlob(rendered);
    
    const sign     = keyShift > 0 ? '+' : '';
    const keyStr   = keyShift !== 0 ? `_key${sign}${keyShift}` : '';
    const base     = file.name.replace(/\.[^.]+$/, '');
    
    MrBlobStore[mrId] = { url: URL.createObjectURL(wavBlob), name: `${base}_MR${keyStr}.wav` };
  } catch (err) {
    console.error('MR 오디오 처리 중 오류 발생:', err);
    alert('오디오 처리 중 오류가 발생했습니다: ' + err.message + '\n(원본 파일이 다운로드됩니다)');
    // 실패 시 원본 파일 폴백
    MrBlobStore[mrId] = { url: URL.createObjectURL(file), name: file.name };
  }
}

// ── MR 파일 다운로드
window.downloadMrFile = function(mrId) {
  const data = MrBlobStore[mrId];
  if (!data) {
    showToast('파일이 만료되었습니다. MR을 다시 생성해주세요.', 'error');
    return;
  }
  const a = document.createElement('a');
  a.href = data.url; a.download = data.name;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  showToast('다운로드가 시작됩니다!', 'success');
};

function attachTrainerProfileListeners() {
  const form = document.getElementById('trainer-profile-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const trainers = DB.getTrainers();
      const idx = trainers.findIndex(t => t.id === State.currentUser.id);
      if (idx >= 0) {
        const specialties = [...document.querySelectorAll('input[name="specialty"]:checked')].map(el => el.value);
        trainers[idx].careerYears = parseInt(document.getElementById('p-career')?.value || '0');
        trainers[idx].lessonPrice = parseInt(document.getElementById('p-price')?.value || '0');
        trainers[idx].intro = document.getElementById('p-intro')?.value || '';
        trainers[idx].specialties = specialties;
        DB.setTrainers(trainers);
        State.currentUser = trainers[idx];
        DB.setCurrentSession({ userId: trainers[idx].id, type: 'trainer', email: trainers[idx].email });
        showToast('프로필이 저장되었습니다', 'success');
      }
    });
  }
}

// ══════════════════════════════════════════════
// 14. INTERACTIVE FUNCTIONS
// ══════════════════════════════════════════════
function switchAuthTab(tab) {
  document.getElementById('auth-login').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('auth-signup').style.display = tab === 'signup' ? 'block' : 'none';
  document.querySelectorAll('.tab-btn').forEach((btn, i) => {
    btn.classList.toggle('active', (i === 0 && tab === 'login') || (i === 1 && tab === 'signup'));
  });
}

function toggleChip(input, chipId) {
  const chip = document.getElementById(chipId);
  if (chip) chip.classList.toggle('active', input.checked);
}

function filterSongs(btn, genre) {
  document.querySelectorAll('.genre-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const items = document.querySelectorAll('#song-list .song-item');
  items.forEach(item => {
    item.style.display = (genre === '전체' || item.dataset.genre === genre) ? 'flex' : 'none';
  });
}

function filterTrainers() {
  const q = (document.getElementById('trainer-search')?.value || '').toLowerCase();
  const sort = document.getElementById('trainer-sort')?.value || 'rating';
  const allTrainers = DB.getTrainers().filter(t => t.approvalStatus === 'approved');

  let filtered = allTrainers.filter(t =>
    t.name.toLowerCase().includes(q) || t.specialties.some(s => s.toLowerCase().includes(q))
  );
  if (sort === 'rating') filtered.sort((a,b) => b.averageRating - a.averageRating);
  else if (sort === 'price-asc') filtered.sort((a,b) => a.lessonPrice - b.lessonPrice);
  else if (sort === 'price-desc') filtered.sort((a,b) => b.lessonPrice - a.lessonPrice);
  else if (sort === 'career') filtered.sort((a,b) => b.careerYears - a.careerYears);

  const list = document.getElementById('trainer-list');
  if (list) list.innerHTML = filtered.map(t => renderTrainerCard(t)).join('');
}

function showTrainerDetail(trainerId) {
  const trainer = DB.getTrainers().find(t => t.id === trainerId);
  if (!trainer) return;
  const reviews = DB.getReviews().filter(r => r.trainerId === trainerId);
  const students = DB.getStudents();
  showModal(`${trainer.profileEmoji} ${trainer.name} 트레이너`, `
    <div style="line-height:1.7">
      <div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap">
        <span class="badge badge-muted">${trainer.careerYears}년 경력</span>
        <span class="badge badge-accent">${trainer.lessonPrice.toLocaleString()}원/시간</span>
        <span style="color:var(--warning)">★${trainer.averageRating}</span>
        <span class="text-3">(${trainer.totalReviews}개)</span>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px">${trainer.specialties.map(s=>`<span class="badge badge-muted">${s}</span>`).join('')}</div>
      <p class="text-2" style="font-size:14px;margin-bottom:20px">${trainer.intro}</p>
      ${reviews.length > 0 ? `<div style="border-top:1px solid var(--border);padding-top:16px">
        <div style="font-size:14px;font-weight:700;margin-bottom:12px">수강 후기</div>
        ${reviews.slice(0,3).map(r => {
          const st = students.find(s => s.id === r.studentId);
          return `<div style="margin-bottom:10px;padding:12px;background:var(--bg-2);border-radius:8px"><span style="color:var(--warning)">${'★'.repeat(r.rating)}</span> <span style="font-size:13px;color:var(--text-2)">${r.content}</span> <span style="font-size:11px;color:var(--text-3)">– ${st?.nickname || '학생'}</span></div>`;
        }).join('')}
      </div>` : ''}
    </div>`,
    [{ label: '📅 레슨 예약', cls: 'btn-primary', action: () => { closeModal(); showBookingModal(trainerId); } },
     { label: '닫기', cls: 'btn-secondary', action: closeModal }]
  );
}

function showBookingModal(trainerId) {
  if (!State.currentUser || State.userType !== 'student') {
    showToast('레슨 예약은 회원 로그인 후 가능합니다', 'error');
    navigate('student-auth', { tab: 'login' });
    return;
  }
  const trainer = DB.getTrainers().find(t => t.id === trainerId);
  if (!trainer) return;
  const schedules = DB.getSchedules().filter(s => s.trainerId === trainerId && !s.isBooked);

  showModal(`📅 레슨 예약 – ${trainer.name} 선생님`, `
    <form id="booking-form">
      <div class="form-group mb-16" style="margin-bottom:16px">
        <label class="form-label">레슨 날짜</label>
        <input type="date" class="form-input" id="b-date" min="${new Date().toISOString().slice(0,10)}" required />
      </div>
      <div class="form-row mb-16" style="margin-bottom:16px">
        <div class="form-group">
          <label class="form-label">시작 시간</label>
          <select class="form-input form-select" id="b-start">
            ${['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'].map(h=>`<option>${h}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">종료 시간</label>
          <select class="form-input form-select" id="b-end">
            ${['10:00','11:00','12:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'].map(h=>`<option>${h}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-group mb-16" style="margin-bottom:16px">
        <label class="form-label">요청 사항 <span class="text-3">(선택)</span></label>
        <textarea class="form-input" id="b-note" placeholder="레슨에서 집중하고 싶은 부분, 목표 곡 등"></textarea>
      </div>
      <div class="card" style="background:var(--accent-dim);border-color:var(--border-accent);padding:14px;margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span style="font-size:14px;font-weight:600">레슨 금액</span>
          <span style="font-size:20px;font-weight:800;color:var(--text-accent)">${trainer.lessonPrice.toLocaleString()}원/시간</span>
        </div>
      </div>
    </form>`,
    [{ label: '💳 결제 및 예약', cls: 'btn-primary', action: () => submitBooking(trainerId, trainer.lessonPrice) },
     { label: '취소', cls: 'btn-secondary', action: closeModal }]
  );
}

function submitBooking(trainerId, price) {
  const date = document.getElementById('b-date')?.value;
  const start = document.getElementById('b-start')?.value;
  const end = document.getElementById('b-end')?.value;
  const note = document.getElementById('b-note')?.value;
  if (!date) { showToast('날짜를 선택해주세요', 'error'); return; }

  closeModal();
  showLoading('결제를 처리 중입니다...');
  setTimeout(() => {
    const bookings = DB.getBookings();
    const newBooking = {
      id: DB.nextId(bookings), studentId: State.currentUser.id, trainerId,
      status: 'pending', lessonDate: date, lessonStartTime: start, lessonEndTime: end,
      studentNote: note, createdAt: new Date().toISOString().slice(0,10)
    };
    bookings.push(newBooking);
    DB.setBookings(bookings);

    const payments = DB.getPayments();
    payments.push({
      id: DB.nextId(payments), bookingId: newBooking.id, studentId: State.currentUser.id,
      pgProvider: 'toss', pgTransactionId: 'pg_' + Date.now(),
      pgOrderId: 'ord_' + Date.now(), amount: price, status: 'paid',
      paidAt: new Date().toISOString()
    });
    DB.setPayments(payments);

    hideLoading();
    showToast('레슨 예약이 완료되었습니다! 🎉', 'success');
    navigate('student-dashboard', { sub: 'lessons' });
  }, 2000);
}

function handleLessonRequest(bookingId, newStatus) {
  const bookings = DB.getBookings();
  const idx = bookings.findIndex(b => b.id === bookingId);
  if (idx >= 0) {
    bookings[idx].status = newStatus;
    if (newStatus === 'completed') bookings[idx].completedAt = new Date().toISOString();
    DB.setBookings(bookings);
    showToast(newStatus === 'confirmed' ? '레슨 요청을 수락했습니다' : newStatus === 'completed' ? '레슨이 완료 처리되었습니다' : '레슨 요청을 거절했습니다', newStatus === 'cancelled' ? 'error' : 'success');
    navigate('trainer-dashboard', { sub: 'requests' });
  }
}

function cancelBooking(bookingId) {
  showModal('레슨 취소', '<p class="text-2">예약을 취소하시겠습니까? 취소 후에는 되돌릴 수 없습니다.</p>',
    [{ label: '취소 확인', cls: 'btn-danger', action: () => {
        const bookings = DB.getBookings();
        const idx = bookings.findIndex(b => b.id === bookingId);
        if (idx >= 0) { bookings[idx].status = 'cancelled'; bookings[idx].cancelledAt = new Date().toISOString(); DB.setBookings(bookings); }
        closeModal();
        showToast('레슨이 취소되었습니다', 'info');
        navigate('student-dashboard', { sub: 'lessons' });
      }},
     { label: '돌아가기', cls: 'btn-secondary', action: closeModal }]
  );
}

function showReviewModal(bookingId, trainerId) {
  let selectedRating = 5;
  showModal('리뷰 작성', `
    <div>
      <div style="text-align:center;margin-bottom:20px">
        <div style="font-size:14px;font-weight:600;margin-bottom:12px">레슨 만족도를 평가해주세요</div>
        <div class="stars" id="star-rating" style="justify-content:center;font-size:32px;gap:6px">
          ${[1,2,3,4,5].map(n=>`<span class="star filled" data-rating="${n}" onclick="setRating(${n})">★</span>`).join('')}
        </div>
        <div id="rating-val" class="text-accent" style="font-size:14px;font-weight:600;margin-top:8px">5점</div>
      </div>
      <div class="form-group">
        <label class="form-label">후기 내용</label>
        <textarea class="form-input form-textarea" id="review-content" placeholder="트레이너와의 레슨은 어떠셨나요?"></textarea>
      </div>
    </div>`,
    [{ label: '리뷰 등록', cls: 'btn-primary', action: () => submitReview(bookingId, trainerId) },
     { label: '취소', cls: 'btn-secondary', action: closeModal }]
  );
}

window.setRating = function(n) {
  document.querySelectorAll('#star-rating .star').forEach((s, i) => s.classList.toggle('filled', i < n));
  document.getElementById('rating-val').textContent = n + '점';
  window._selectedRating = n;
};

function submitReview(bookingId, trainerId) {
  const content = document.getElementById('review-content')?.value || '';
  const rating = window._selectedRating || 5;
  const reviews = DB.getReviews();
  reviews.push({ id: DB.nextId(reviews), bookingId, studentId: State.currentUser.id, trainerId, rating, content, createdAt: new Date().toISOString().slice(0,10) });
  DB.setReviews(reviews);

  // Update trainer avg rating
  const trainers = DB.getTrainers();
  const tIdx = trainers.findIndex(t => t.id === trainerId);
  if (tIdx >= 0) {
    const trReviews = reviews.filter(r => r.trainerId === trainerId);
    trainers[tIdx].averageRating = parseFloat((trReviews.reduce((s,r) => s+r.rating, 0) / trReviews.length).toFixed(1));
    trainers[tIdx].totalReviews = trReviews.length;
    DB.setTrainers(trainers);
  }
  closeModal();
  showToast('리뷰가 등록되었습니다! 감사합니다 ⭐', 'success');
  navigate('student-dashboard', { sub: 'lessons' });
}

function showSongDetail(songId) {
  const song = DB.getSongs().find(s => s.id === songId);
  if (!song) return;
  const difficulties = { easy: '쉬움', medium: '보통', hard: '어려움' };
  const diffColors = { easy: 'badge-success', medium: 'badge-info', hard: 'badge-danger' };
  showModal(`${song.emoji} ${song.title}`, `
    <div>
      <div style="font-size:18px;font-weight:700;margin-bottom:4px">${song.title}</div>
      <div class="text-2 mb-16" style="margin-bottom:16px">${song.artist}</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px">
        <span class="badge ${diffColors[song.difficulty]}">${difficulties[song.difficulty]}</span>
        <span class="badge badge-muted">${song.genre}</span>
        <span class="badge badge-accent">음역: ${song.lowestNote} – ${song.highestNote}</span>
      </div>
      <div class="card" style="background:var(--accent-dim);border-color:var(--border-accent);padding:14px">
        <div style="font-size:13px;font-weight:600;color:var(--text-accent)">💡 이 곡으로 MR 만들기</div>
        <div class="text-2" style="font-size:12px;margin-top:4px">MR 스튜디오에서 원곡 파일을 업로드하면 연습용 MR을 생성할 수 있습니다</div>
      </div>
    </div>`,
    [{ label: '🎛 MR 스튜디오로', cls: 'btn-primary', action: () => { closeModal(); navigate('student-dashboard', {sub:'mr'}); } },
     { label: '닫기', cls: 'btn-secondary', action: closeModal }]
  );
}

function showStoredAnalysis(submissionId) {
  const analysis = DB.getAnalyses().find(a => a.submissionId === submissionId);
  const submission = DB.getSubmissions().find(s => s.id === submissionId);
  if (!analysis || !submission) return;
  navigate('analysis', { analysis: { ...analysis, fileName: submission.fileName, processTime: '2.1' } });
}

function adminApprove(trainerId, status) {
  const trainers = DB.getTrainers();
  const idx = trainers.findIndex(t => t.id === trainerId);
  if (idx >= 0) {
    trainers[idx].approvalStatus = status;
    if (status === 'approved') trainers[idx].approvedAt = new Date().toISOString();
    if (status === 'rejected') {
      showModal('거절 사유', `
        <div class="form-group">
          <label class="form-label">거절 사유를 입력해주세요</label>
          <textarea class="form-input form-textarea" id="reject-reason" placeholder="예: 자격 증빙 서류 부족"></textarea>
        </div>`,
        [{ label: '거절 처리', cls: 'btn-danger', action: () => {
            trainers[idx].rejectionReason = document.getElementById('reject-reason')?.value || '자격 요건 미충족';
            DB.setTrainers(trainers);
            closeModal();
            showToast('트레이너 등록이 거절되었습니다', 'error');
            navigate('admin-dashboard');
          }},
         { label: '취소', cls: 'btn-secondary', action: closeModal }]
      );
      return;
    }
    DB.setTrainers(trainers);
    showToast(status === 'approved' ? '트레이너가 승인되었습니다 ✅' : '처리되었습니다', 'success');
    navigate('admin-dashboard');
  }
}

function toggleScheduleSlot(cell, dayIndex, hour) {
  const trainerId = State.currentUser.id;
  const schedules = DB.getSchedules();
  const existingIdx = schedules.findIndex(s => s.trainerId === trainerId && s.dayIndex === dayIndex && s.hour === hour);
  if (existingIdx >= 0) {
    schedules.splice(existingIdx, 1);
    cell.classList.remove('available');
    cell.textContent = '';
  } else {
    schedules.push({ id: DB.nextId(schedules), trainerId, dayIndex, hour, isBooked: false });
    cell.classList.add('available');
    cell.textContent = '✓';
  }
  DB.setSchedules(schedules);
}

// ══════════════════════════════════════════════
// 15. RADAR CHART
// ══════════════════════════════════════════════
function drawRadarChart(analysis) {
  const canvas = document.getElementById('radar-chart');
  if (!canvas || !analysis) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const r = Math.min(W, H) * 0.36;
  const labels = ['음정', '박자', '성량', '음색'];
  const scores = [analysis.pitch, analysis.rhythm, analysis.volume, analysis.timbre];
  const N = 4;

  ctx.clearRect(0, 0, W, H);

  // Background grid levels
  for (let lv = 5; lv >= 1; lv--) {
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const angle = (Math.PI * 2 * i / N) - Math.PI / 2;
      const px = cx + Math.cos(angle) * r * lv / 5;
      const py = cy + Math.sin(angle) * r * lv / 5;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = lv === 5 ? 'rgba(139,92,246,0.04)' : 'transparent';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Axes
  for (let i = 0; i < N; i++) {
    const angle = (Math.PI * 2 * i / N) - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Data polygon
  ctx.beginPath();
  for (let i = 0; i < N; i++) {
    const angle = (Math.PI * 2 * i / N) - Math.PI / 2;
    const val = scores[i] / 100;
    const px = cx + Math.cos(angle) * r * val;
    const py = cy + Math.sin(angle) * r * val;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(139,92,246,0.25)';
  ctx.fill();
  ctx.strokeStyle = '#8b5cf6';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Data points
  for (let i = 0; i < N; i++) {
    const angle = (Math.PI * 2 * i / N) - Math.PI / 2;
    const val = scores[i] / 100;
    const px = cx + Math.cos(angle) * r * val;
    const py = cy + Math.sin(angle) * r * val;
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#8b5cf6';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Labels
  for (let i = 0; i < N; i++) {
    const angle = (Math.PI * 2 * i / N) - Math.PI / 2;
    const px = cx + Math.cos(angle) * (r + 30);
    const py = cy + Math.sin(angle) * (r + 30);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '700 14px Inter, sans-serif';
    ctx.fillStyle = '#f0f0f5';
    ctx.fillText(labels[i], px, py);
    ctx.font = '600 12px Inter, sans-serif';
    ctx.fillStyle = '#8b5cf6';
    ctx.fillText(scores[i] + '점', px, py + 18);
  }
}

// ══════════════════════════════════════════════
// 16. MODAL & TOAST
// ══════════════════════════════════════════════
function showModal(title, contentHtml, actions = []) {
  const overlay = document.getElementById('modal-overlay');
  const box = document.getElementById('modal-box');
  box.innerHTML = `
    <div class="modal-header">
      <div class="modal-title">${title}</div>
      <span class="modal-close" onclick="closeModal()">✕</span>
    </div>
    <div class="modal-content">${contentHtml}</div>
    ${actions.length > 0 ? `<div class="modal-footer">${actions.map(a => `<button class="btn ${a.cls}" onclick="(${a.action.toString()})()">${a.label}</button>`).join('')}</div>` : ''}`;
  overlay.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

function showToast(msg, type = 'success') {
  const container = document.getElementById('toast-container');
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.classList.add('fade-out'); setTimeout(() => toast.remove(), 300); }, 3200);
}

function showLoading(text = '처리 중...') {
  const overlay = document.getElementById('loading-overlay');
  const textEl = overlay.querySelector('.loading-text');
  if (textEl) textEl.textContent = text;
  overlay.classList.remove('hidden');
}

function hideLoading() {
  document.getElementById('loading-overlay').classList.add('hidden');
}

// ══════════════════════════════════════════════
// 17. INIT
// ══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  DB.seed();
  Auth.restoreSession();

  // Close modal on overlay click
  document.getElementById('modal-overlay')?.addEventListener('click', e => {
    if (e.target.id === 'modal-overlay') closeModal();
  });

  // Route based on current user
  if (State.currentUser) {
    if (State.userType === 'student') navigate('student-dashboard', { sub: 'home' });
    else if (State.userType === 'trainer') navigate('trainer-dashboard', { sub: 'home' });
    else if (State.userType === 'admin') navigate('admin-dashboard');
    else navigate('home');
  } else {
    navigate('home');
  }
});

// Expose globals needed in onclick handlers
window.navigate = navigate;
window.Auth = Auth;
window.switchAuthTab = switchAuthTab;
window.toggleChip = toggleChip;
window.filterSongs = filterSongs;
window.filterTrainers = filterTrainers;
window.showBookingModal = showBookingModal;
window.showTrainerDetail = showTrainerDetail;
window.showSongDetail = showSongDetail;
window.handleLessonRequest = handleLessonRequest;
window.cancelBooking = cancelBooking;
window.showReviewModal = showReviewModal;
window.submitReview = submitReview;
window.showStoredAnalysis = showStoredAnalysis;
window.adminApprove = adminApprove;
window.toggleScheduleSlot = toggleScheduleSlot;
window.closeModal = closeModal;
window.showModal = showModal;
window.showToast = showToast;

// ══════════════════════════════════════════════
// SONG ANALYSIS ENGINE
// ══════════════════════════════════════════════

const SongAnalysisState = { results: [], total: 0, done: 0 };

// ── Iterative Cooley-Tukey FFT (in-place, power-of-2 size)
function runFFT(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      let t = re[i]; re[i] = re[j]; re[j] = t;
      t = im[i]; im[i] = im[j]; im[j] = t;
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = -2 * Math.PI / len;
    const wRe = Math.cos(ang), wIm = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let curRe = 1, curIm = 0;
      for (let j = 0; j < (len >> 1); j++) {
        const uRe = re[i+j], uIm = im[i+j];
        const vRe = re[i+j+(len>>1)]*curRe - im[i+j+(len>>1)]*curIm;
        const vIm = re[i+j+(len>>1)]*curIm + im[i+j+(len>>1)]*curRe;
        re[i+j] = uRe+vRe; im[i+j] = uIm+vIm;
        re[i+j+(len>>1)] = uRe-vRe; im[i+j+(len>>1)] = uIm-vIm;
        const tmp = curRe*wRe - curIm*wIm;
        curIm = curRe*wIm + curIm*wRe;
        curRe = tmp;
      }
    }
  }
}

// ── Hz → MIDI 번호
function freqToMidi(freq) {
  if (freq <= 0) return -1;
  return Math.round(12 * Math.log2(freq / 440) + 69);
}

// ── MIDI 번호 → 음이름 (예: 69 → A4)
function midiToNoteName(midi) {
  if (!midi || midi <= 0) return '-';
  const names = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const octave = Math.floor(midi / 12) - 1;
  return names[midi % 12] + octave;
}

// ── RMS 에너지 계산 (무음 구간 필터링용)
function getRMS(buf) {
  let sum = 0;
  for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
  return Math.sqrt(sum / buf.length);
}

// ── 단일 PCM 세그먼트의 보컬 주파수 감지 (FFT)
// ── 스테레오 오디오에서 보컬 중앙 채널(중앙 채널 추출, Vocal Isolation)
// 상업용 녹음은 보컬이 캐터 첫번째에 정위치(Center) 팟되어 있음
// Mid = (L + R) / 2  으로 보컬만 추출 가능
function extractVocalChannel(audioBuffer) {
  if (audioBuffer.numberOfChannels >= 2) {
    const L   = audioBuffer.getChannelData(0);
    const R   = audioBuffer.getChannelData(1);
    const mid = new Float32Array(L.length);
    for (let i = 0; i < L.length; i++) mid[i] = (L[i] + R[i]) * 0.5;
    return mid;
  }
  // 모노: 그대로 반환
  return audioBuffer.getChannelData(0);
}

// ── Harmonic Product Spectrum (HPS) 기반 피치 감지
// 단순 FFT 피크보다 배음 오판 없이 기본 주파수(Fundamental)'를 정확히 찾음
function detectSegmentFreq(samples, sampleRate) {
  const n    = 8192;
  const re   = new Float64Array(n);
  const im   = new Float64Array(n);
  const half = n >> 1;

  // Hanning 윈도 적용
  for (let i = 0; i < n && i < samples.length; i++) {
    const w = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (n - 1));
    re[i] = samples[i] * w;
  }
  runFFT(re, im);

  // 제곱 진폭 (sqrt 없이 빠르게 비교)
  const mag = new Float64Array(half);
  for (let k = 0; k < half; k++) mag[k] = re[k]*re[k] + im[k]*im[k];

  // HPS: 각 빈 k에서 mag[k] × mag[2k] × mag[3k] × mag[4k] 지정
  // 기본주파수는 모든 배수에서 강하게 나타나므로 HPS가 피크를 형성
  const minBin = Math.ceil(130  * n / sampleRate);  // C3 ≈ 130Hz
  const maxBin = Math.floor(2100 * n / sampleRate); // C7 ≈ 2093Hz (초고음 허용)

  let bestHPS = 0, bestFreq = 0;
  for (let k = minBin; k <= maxBin; k++) {
    const k2 = Math.min(k << 1, half - 1);
    const k3 = Math.min(k * 3,  half - 1);
    const k4 = Math.min(k << 2, half - 1);
    const hps = mag[k] * mag[k2] * mag[k3] * mag[k4];
    if (hps > bestHPS) { bestHPS = hps; bestFreq = k * sampleRate / n; }
  }
  return bestFreq;
}

// ── 최고음 기준 난이도 계산
function calcDifficulty(highestMidi) {
  if (!highestMidi || highestMidi <= 0) return { label: '알 수 없음', color: '#6b7280' };
  if (highestMidi <= 72) return { label: '하  (쉬움)', color: '#34d399' };   // ≤C5
  if (highestMidi <= 79) return { label: '중  (보통)', color: '#fbbf24' };   // C#5~G5
  return { label: '상  (어려움)', color: '#f87171' };                         // G#5↑
}

// ── 오디오 파일 1개 분석 (보컬 채널 전처리 + HPS 피치 + 신뢰도 필터링)
async function analyzeSongFile(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = async e => {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        let audioBuffer;
        try {
          audioBuffer = await audioCtx.decodeAudioData(e.target.result.slice(0));
        } catch {
          await audioCtx.close();
          resolve({ fileName: file.name.replace(/\.[^.]+$/, ''), error: '디코딩 실패', highestMidi: 0 });
          return;
        }

        const sr    = audioBuffer.sampleRate;
        const dur   = audioBuffer.duration;
        const total = audioBuffer.length;

        // ① 보컬 채널 추출 (스테레오 → 중앙 채널, 모노 → 그대로)
        const vocalCh = extractVocalChannel(audioBuffer);
        await audioCtx.close();

        const segLen = 8192;
        // ② 20% ~ 95% 구간을 0.5초 간격으로 전체 스캔
        const startOffset = Math.floor(total * 0.20);
        const endOffset   = Math.floor(total * 0.95);
        const step        = Math.floor(sr * 0.5); // 0.5초 간격

        const detectedMidis  = []; // 유효한 MIDI 값 전체 모음
        const rmsThreshold   = 0.01; // 간주, 숨소리 등 낮은 에너지 구간 필터링

        for (let start = startOffset; start < endOffset; start += step) {
          if (start + segLen > total) break;

          const seg = vocalCh.slice(start, start + segLen);

          // ③ 무음 및 에너지가 낮은 세그먼트 스킵
          if (getRMS(seg) < rmsThreshold) continue;

          // ④ HPS로 보컬 기본 주파수 감지
          const freq = detectSegmentFreq(seg, sr);
          if (freq <= 0) continue;

          const midi = freqToMidi(freq);
          // ⑤ 보컬 음역대만 허용: C3(48) ~ C7(96)
          if (midi >= 48 && midi <= 96) detectedMidis.push(midi);
        }

        // ⑥ 신뢰도 필터링: 가장 높은 음부터 검사하여 우연한 오작동 필터링
        let highestMidi = 0;
        let lowestMidi  = 999;

        if (detectedMidis.length > 0) {
          // MIDI 값을 내림차순 정렬
          const sorted = [...detectedMidis].sort((a, b) => b - a);
          lowestMidi = sorted[sorted.length - 1];

          // 최고음부터 내려오면서 검증
          // 인접한 음(±1반음)이 곡 전체에서 최소 3번(약 1.5초 지속) 이상 감지되었으면 진짜 최고음으로 인정
          for (let i = 0; i < sorted.length; i++) {
            const candidate = sorted[i];
            const clusterCount = sorted.filter(m => Math.abs(m - candidate) <= 1).length;
            
            if (clusterCount >= 3) {
              highestMidi = candidate;
              break;
            }
          }

          // 3번 이상 지속된 음이 전혀 없다면(곡이 짧거나 감지가 잘 안 된 경우)
          if (highestMidi === 0) {
            highestMidi = sorted[Math.floor(sorted.length * 0.1)]; // 상위 10% 지점 선택
          }
        }

        const range = (lowestMidi !== 999 && highestMidi > 0) ? highestMidi - lowestMidi : 0;

        resolve({
          fileName:       file.name.replace(/\.[^.]+$/, ''),
          duration:       Math.round(dur),
          highestNote:    midiToNoteName(highestMidi),
          lowestNote:     lowestMidi !== 999 ? midiToNoteName(lowestMidi) : '-',
          rangeText:      range > 0 ? range + ' 반음' : '-',
          rangeSemitones: range,
          difficulty:     calcDifficulty(highestMidi),
          highestMidi,
          lowestMidi:     lowestMidi !== 999 ? lowestMidi : 0,
          detectedMidis,          // Supabase 업로드용 로우 데이터
          vocalChannel:   audioBuffer.numberOfChannels >= 2 ? 'center(mid)' : 'mono',
          error:          null
        });
      } catch (err) {
        resolve({ fileName: file.name.replace(/\.[^.]+$/, ''), error: '분석 오류: ' + err.message, highestMidi: 0 });
      }
    };
    reader.onerror = () => resolve({ fileName: file.name, error: '파일 읽기 오류', highestMidi: 0 });
    reader.readAsArrayBuffer(file);
  });
}

// ── 테이블 행 렌더링
function renderSongAnalysisTable(results) {
  const tbody = document.getElementById('sa-tbody');
  if (!tbody) return;
  tbody.innerHTML = results.map((r, i) => {
    if (r.error) {
      return `<tr style="border-bottom:1px solid var(--border)">
        <td style="padding:11px 16px;color:var(--text-2);font-size:13px">${i+1}</td>
        <td style="padding:11px 16px;font-weight:600">${r.fileName}</td>
        <td colspan="5" style="padding:11px 16px;text-align:center;color:#f87171;font-size:13px">${r.error}</td>
      </tr>`;
    }
    const d = r.difficulty || calcDifficulty(r.highestMidi);
    const noteColor = r.highestMidi > 79 ? '#f87171' : r.highestMidi > 72 ? '#fbbf24' : '#34d399';
    const dur = r.duration ? `${Math.floor(r.duration/60)}:${String(r.duration%60).padStart(2,'0')}` : '-';
    return `<tr style="border-bottom:1px solid var(--border);transition:background .15s" onmouseover="this.style.background='var(--bg-1)'" onmouseout="this.style.background=''">
      <td style="padding:11px 16px;color:var(--text-2);font-size:13px">${i+1}</td>
      <td style="padding:11px 16px;font-weight:600">${r.fileName}</td>
      <td style="padding:11px 16px;text-align:center;color:var(--text-2);font-size:13px">${dur}</td>
      <td style="padding:11px 16px;text-align:center;font-family:monospace;font-weight:600;font-size:13px">${r.lowestNote||'-'}</td>
      <td style="padding:11px 16px;text-align:center;font-family:monospace;font-weight:700;color:${noteColor}">${r.highestNote||'-'}</td>
      <td style="padding:11px 16px;text-align:center;color:var(--text-2);font-size:13px">${r.rangeText||'-'}</td>
      <td style="padding:11px 16px;text-align:center">
        <span style="background:${d.color}22;color:${d.color};border:1px solid ${d.color}44;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:600;white-space:nowrap">${d.label}</span>
      </td>
    </tr>`;
  }).join('');
}

// ── 정렬
window.SongAnalysisSortBy = function(field) {
  if (!SongAnalysisState.results.length) return;
  const sorted = [...SongAnalysisState.results].sort((a, b) => {
    if (field === 'fileName') return (a.fileName||'').localeCompare(b.fileName||'', 'ko');
    return (b.highestMidi||0) - (a.highestMidi||0); // 최고음순 = 난이도순
  });
  renderSongAnalysisTable(sorted);
};

// ── CSV 다운로드
function downloadSongAnalysisCSV(results) {
  const header = ['번호', '곡명', '길이(초)', '최저음', '최고음', '음역대(반음)', '난이도'];
  const rows = results.map((r, i) => [
    i+1,
    `"${(r.fileName||'').replace(/"/g,'""')}"`,
    r.duration||'',
    r.lowestNote||'',
    r.highestNote||'',
    r.rangeSemitones||'',
    r.difficulty ? r.difficulty.label.trim() : (r.error||'')
  ]);
  const csv = [header, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob(['\uFEFF'+csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = '곡분석결과_' + new Date().toISOString().slice(0,10) + '.csv';
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}

// ── 요약 카드 업데이트
function updateSaStats(results) {
  const valid = results.filter(r => !r.error && r.highestMidi > 0);
  const hard = valid.filter(r => r.highestMidi > 79).length;
  const med  = valid.filter(r => r.highestMidi > 72 && r.highestMidi <= 79).length;
  const easy = valid.filter(r => r.highestMidi <= 72).length;
  const topMidi = valid.length ? Math.max(...valid.map(r => r.highestMidi)) : 0;
  const avgRange = valid.length
    ? Math.round(valid.reduce((s,r) => s + (r.rangeSemitones||0), 0) / valid.length) : 0;
  const cards = document.getElementById('sa-summary-cards');
  if (cards) cards.innerHTML = `
    <div class="stat-card"><div class="stat-card-label">전체 곡 수</div><div class="stat-card-val">${results.length}</div><div class="stat-card-sub">곡</div></div>
    <div class="stat-card"><div class="stat-card-label">가장 높은 음</div><div class="stat-card-val" style="font-size:22px;font-family:monospace">${midiToNoteName(topMidi)}</div><div class="stat-card-sub">최고음</div></div>
    <div class="stat-card"><div class="stat-card-label">난이도 분포</div><div class="stat-card-val" style="font-size:14px">상 ${hard}곡 · 중 ${med}곡 · 하 ${easy}곡</div><div class="stat-card-sub">평균 음역 ${avgRange}반음</div></div>
  `;
  const summary = document.getElementById('sa-result-summary');
  if (summary) summary.textContent = `분석 성공 ${valid.length}곡 · 오류 ${results.length-valid.length}곡 · 평균 음역대 ${avgRange}반음`;
}

// ── 메인 분석 실행기
async function runSongAnalysis(files) {
  const wrap    = document.getElementById('sa-progress-wrap');
  const bar     = document.getElementById('sa-progress-bar');
  const count   = document.getElementById('sa-progress-count');
  const label   = document.getElementById('sa-progress-label');
  const curFile = document.getElementById('sa-current-file');
  const results = document.getElementById('sa-results');
  const upCard  = document.getElementById('sa-upload-card');
  if (wrap)   wrap.style.display = 'block';
  if (upCard) upCard.style.opacity = '0.4';
  SongAnalysisState.results = [];
  SongAnalysisState.total = files.length;
  for (let i = 0; i < files.length; i++) {
    if (curFile) curFile.textContent = `📄 ${files[i].name}`;
    const res = await analyzeSongFile(files[i]);
    SongAnalysisState.results.push(res);
    const pct = Math.round(((i+1)/files.length)*100);
    if (bar)   bar.style.width = pct+'%';
    if (count) count.textContent = `${i+1} / ${files.length}`;
    if (label) label.textContent = `분석 중... ${pct}%`;
  }
  if (wrap)   wrap.style.display = 'none';
  if (upCard) upCard.style.opacity = '1';
  if (results) results.style.display = 'block';
  const title = document.getElementById('sa-result-title');
  if (title) title.textContent = `🎵 분석 완료 — ${files.length}곡`;
  renderSongAnalysisTable(SongAnalysisState.results);
  updateSaStats(SongAnalysisState.results);
  showToast(`${files.length}곡 분석 완료!`, 'success');
}

// ── 곡 분석 페이지 렌더러
function renderStudentSongAnalysis() {
  return `
  <div class="animate-up">
    <div class="page-title">🔬 곡 분석</div>
    <div class="page-sub">MP3 파일을 업로드하면 최고음·음역대·난이도를 자동 분석합니다 (최대 200곡)</div>

    <div class="card card-xl" id="sa-upload-card" style="margin-bottom:24px">
      <div id="sa-drop-zone" style="min-height:180px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;cursor:pointer;border:2px dashed var(--border);border-radius:16px;padding:32px;transition:border-color .2s,background .2s">
        <input type="file" id="sa-file-input" multiple accept=".mp3,.wav,.m4a,.ogg" style="display:none" />
        <div style="font-size:52px">🎵</div>
        <div style="font-size:18px;font-weight:700">MP3 파일을 드래그하거나 클릭하여 선택</div>
        <div class="text-2" style="font-size:13px">최대 200개 · MP3, WAV, M4A, OGG 지원 · 보컬 주파수 기반 FFT 분석</div>
        <button class="btn btn-primary" onclick="document.getElementById('sa-file-input').click()">📂 파일 선택</button>
      </div>
    </div>

    <div id="sa-progress-wrap" style="display:none;margin-bottom:24px" class="card card-xl">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div style="font-weight:700" id="sa-progress-label">분석 중...</div>
        <div class="text-2" id="sa-progress-count">0 / 0</div>
      </div>
      <div style="height:8px;background:var(--bg-2);border-radius:999px;overflow:hidden">
        <div id="sa-progress-bar" style="height:100%;width:0%;background:linear-gradient(90deg,var(--accent),#6366f1);border-radius:999px;transition:width .3s ease"></div>
      </div>
      <div id="sa-current-file" class="text-2" style="margin-top:8px;font-size:12px"></div>
    </div>

    <div id="sa-results" style="display:none">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:16px">
        <div>
          <div style="font-size:20px;font-weight:800" id="sa-result-title">분석 완료</div>
          <div class="text-2" id="sa-result-summary" style="font-size:13px;margin-top:4px"></div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-ghost btn-sm" onclick="SongAnalysisSortBy('fileName')">이름순</button>
          <button class="btn btn-ghost btn-sm" onclick="SongAnalysisSortBy('highestMidi')">최고음순</button>
          <button class="btn btn-primary btn-sm" id="sa-csv-btn">⬇ CSV 다운로드</button>
        </div>
      </div>
      <div class="grid-3" id="sa-summary-cards" style="margin-bottom:24px"></div>
      <div class="card" style="overflow:hidden;padding:0">
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:14px" id="sa-table">
            <thead>
              <tr style="border-bottom:1px solid var(--border);background:var(--bg-1)">
                <th style="padding:12px 16px;text-align:left;font-weight:600;color:var(--text-2)">#</th>
                <th style="padding:12px 16px;text-align:left;font-weight:600;color:var(--text-2)">곡명</th>
                <th style="padding:12px 16px;text-align:center;font-weight:600;color:var(--text-2)">길이</th>
                <th style="padding:12px 16px;text-align:center;font-weight:600;color:var(--text-2)">최저음</th>
                <th style="padding:12px 16px;text-align:center;font-weight:600;color:var(--text-2)">최고음 🔺</th>
                <th style="padding:12px 16px;text-align:center;font-weight:600;color:var(--text-2)">음역대</th>
                <th style="padding:12px 16px;text-align:center;font-weight:600;color:var(--text-2)">난이도</th>
              </tr>
            </thead>
            <tbody id="sa-tbody"></tbody>
          </table>
        </div>
      </div>
    </div>
  </div>`;
}

// ── 곡 분석 이벤트 리스너 연결
function attachSongAnalysisListeners() {
  const fileInput = document.getElementById('sa-file-input');
  const dropZone  = document.getElementById('sa-drop-zone');
  const csvBtn    = document.getElementById('sa-csv-btn');
  if (fileInput) {
    fileInput.addEventListener('change', () => {
      const files = Array.from(fileInput.files).slice(0, 200);
      if (files.length) runSongAnalysis(files);
    });
  }
  if (dropZone) {
    dropZone.addEventListener('dragover', e => {
      e.preventDefault();
      dropZone.style.borderColor = 'var(--accent)';
      dropZone.style.background  = 'rgba(139,92,246,0.06)';
    });
    dropZone.addEventListener('dragleave', () => {
      dropZone.style.borderColor = '';
      dropZone.style.background  = '';
    });
    dropZone.addEventListener('drop', e => {
      e.preventDefault();
      dropZone.style.borderColor = '';
      dropZone.style.background  = '';
      const files = Array.from(e.dataTransfer.files)
        .filter(f => /\.(mp3|wav|m4a|ogg)$/i.test(f.name))
        .slice(0, 200);
      if (files.length) runSongAnalysis(files);
      else showToast('MP3, WAV, M4A, OGG 파일만 지원합니다', 'error');
    });
  }
  if (csvBtn) {
    csvBtn.addEventListener('click', () => {
      if (!SongAnalysisState.results.length) { showToast('분석된 결과가 없습니다', 'error'); return; }
      downloadSongAnalysisCSV(SongAnalysisState.results);
    });
  }
}
