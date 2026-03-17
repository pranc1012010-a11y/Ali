import React, { useState, useEffect } from 'react';

// أيقونات بسيطة متوافقة مع التصميم
const IconTime = () => <span>⏱️</span>;
const IconBook = () => <span>📚</span>;

function App() {
  // --- 1. الحالات (States) ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSub, setNewSub] = useState({ name: '', total: 0 });
  const [darkMode, setDarkMode] = useState(false);
  
  // مؤقت بومودورو
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  // --- 2. الحفظ والاسترجاع (Persistence) ---
  useEffect(() => {
    const savedUser = localStorage.getItem('study_user');
    if (savedUser) {
      setIsLoggedIn(true);
      setUserEmail(savedUser);
      const savedData = localStorage.getItem(`data_${savedUser}`);
      if (savedData) setSubjects(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem(`data_${userEmail}`, JSON.stringify(subjects));
    }
  }, [subjects, isLoggedIn, userEmail]);

  // --- 3. الوظائف (Functions) ---
  const handleAuth = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    setUserEmail(email);
    setIsLoggedIn(true);
    localStorage.setItem('study_user', email);
  };

  const handleLogout = () => {
    localStorage.removeItem('study_user');
    setIsLoggedIn(false);
    setSubjects([]);
  };

  const addSubject = () => {
    if (newSub.name && newSub.total > 0) {
      setSubjects([...subjects, { ...newSub, id: Date.now(), done: 0 }]);
      setIsModalOpen(false);
      setNewSub({ name: '', total: 0 });
    }
  };

  const updateProgress = (id, val) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, done: Math.min(Math.max(s.done + val, 0), s.total) } : s));
  };

  // مؤقت بومودورو
  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds(s => s - 1), 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      alert("انتهى الوقت! خذ استراحة قصيرة.");
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // --- 4. شاشة تسجيل الدخول ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-indigo-700 flex items-center justify-center p-6 font-sans" dir="rtl">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md text-center">
          <h1 className="text-4xl font-black text-indigo-900 mb-2 font-sans">StudyFlow</h1>
          <p className="text-gray-400 mb-8">نظم مذاكرتك، ابني مستقبلك</p>
          <form onSubmit={handleAuth} className="space-y-4 text-right">
             <label className="block text-sm font-bold text-gray-700 mr-2">البريد الإلكتروني</label>
            <input name="email" type="email" placeholder="example@mail.com" required className="w-full p-4 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-left" dir="ltr" />
            <label className="block text-sm font-bold text-gray-700 mr-2">كلمة المرور</label>
            <input type="password" placeholder="••••••••" required className="w-full p-4 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-left" dir="ltr" />
            <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-indigo-700 transform hover:-translate-y-1 transition active:scale-95">دخول سريع</button>
          </form>
        </div>
      </div>
    );
  }

  // --- 5. لوحة التحكم الرئيسية ---
  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'} min-h-screen transition-colors duration-500 font-sans`} dir="rtl">
      <nav className={`p-6 flex justify-between items-center shadow-sm sticky top-0 z-40 ${darkMode ? 'bg-gray-800/80 backdrop-blur-md' : 'bg-white/80 backdrop-blur-md'}`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚀</span>
          <span className="font-bold text-xl tracking-tight">StudyFlow 2026</span>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={() => setDarkMode(!darkMode)} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-2xl hover:rotate-12 transition-transform">{darkMode ? '☀️' : '🌙'}</button>
          <button onClick={handleLogout} className="bg-red-50 text-red-500 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition">خروج</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 md:p-10">
        {/* قسم المؤقت والإحصائيات */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className={`lg:col-span-2 p-8 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row justify-between items-center ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-white'} border`}>
            <div>
              <h2 className="text-3xl font-bold mb-2">أهلاً بك، <span className="text-indigo-500">{userEmail.split('@')[0]}</span>!</h2>
              <p className="opacity-60 italic text-lg">"الناجحون هم من يتقنون إدارة وقتهم."</p>
            </div>
            <div className="mt-6 md:mt-0 text-center bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-[2rem]">
              <div className="text-5xl font-mono font-black text-indigo-600 dark:text-indigo-400 mb-4">{formatTime(seconds)}</div>
              <div className="flex gap-2">
                <button onClick={() => setIsActive(!isActive)} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-indigo-200 shadow-lg hover:bg-indigo-700 transition">{isActive ? 'إيقاف' : 'ابدأ التركيز'}</button>
                <button onClick={() => {setIsActive(false); setSeconds(25*60)}} className="bg-white dark:bg-gray-700 px-4 py-3 rounded-2xl font-bold border border-gray-200 dark:border-gray-600">♻️</button>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[2.5rem] text-white shadow-xl flex flex-col justify-center relative overflow-hidden group">
             <div className="absolute -right-4 -bottom-4 text-9xl opacity-10 group-hover:scale-110 transition-transform">📚</div>
             <p className="text-lg opacity-80">إجمالي المواد المضافة</p>
             <h3 className="text-6xl font-black mt-2">{subjects.length}</h3>
             <button onClick={() => setIsModalOpen(true)} className="mt-8 bg-white text-indigo-600 py-4 rounded-2xl font-bold hover:bg-gray-100 transition shadow-lg active:scale-95">إضافة مادة جديدة +</button>
          </div>
        </div>

        {/* عرض المواد الدراسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subjects.map(sub => (
            <div key={sub.id} className={`p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
              <div className="flex justify-between items-start mb-6">
                 <h3 className="text-2xl font-bold">{sub.name}</h3>
                 <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-lg text-xs font-black">نشط</span>
              </div>
              
              <div className="flex justify-between mb-3 text-sm font-bold">
                <span className="opacity-60">التقدم المحرز</span>
                <span className="text-indigo-500">{Math.round((sub.done/sub.total)*100)}%</span>
              </div>
              
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4 mb-8 overflow-hidden p-1">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-700 shadow-sm" style={{ width: `${(sub.done/sub.total)*100}%` }}></div>
              </div>

              <div className="flex items-center justify-between mb-6">
                 <span className="text-gray-400 text-sm italic">{sub.done} من {sub.total} فصول</span>
              </div>

              <div className="flex gap-3">
                <button onClick={() => updateProgress(sub.id, 1)} className="flex-[3] bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-md transition-all active:scale-95">+ إضافة فصل</button>
                <button onClick={() => updateProgress(sub.id, -1)} className="flex-1 bg-gray-100 dark:bg-gray-700 py-4 rounded-2xl font-bold text-gray-400 hover:text-red-500 transition-colors">-</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal إضافة مادة */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-6 z-50">
          <div className={`${darkMode ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white'} p-10 rounded-[3rem] w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300`}>
            <div className="text-center mb-8">
               <span className="text-5xl">📝</span>
               <h2 className="text-3xl font-black mt-4">خطة دراسية جديدة</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2 mr-2 opacity-70">اسم المادة الدراسية</label>
                <input type="text" placeholder="مثال: رياضيات، فيزياء..." className={`w-full p-4 rounded-2xl outline-none border-2 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 focus:border-indigo-500' : 'bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500'}`} onChange={e => setNewSub({...newSub, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 mr-2 opacity-70">عدد الفصول الكلي</label>
                <input type="number" placeholder="كم فصل في المنهج؟" className={`w-full p-4 rounded-2xl outline-none border-2 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 focus:border-indigo-500' : 'bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500'}`} onChange={e => setNewSub({...newSub, total: parseInt(e.target.value)})} />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={addSubject} className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:bg-indigo-700 active:scale-95 transition-all">اعتماد المادة</button>
                <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 dark:bg-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
