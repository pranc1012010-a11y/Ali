import React, { useState, useEffect } from 'react';

// مكون الأيقونات البسيطة (لعدم تعقيد التحميل)
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
          <h1 className="text-4xl font-black text-indigo-900 mb-2">StudyFlow</h1>
          <p className="text-gray-400 mb-8">نظم مذاكرتك، ابني مستقبلك</p>
          <form onSubmit={handleAuth} className="space-y-4">
            <input name="email" type="email" placeholder="البريد الإلكتروني" required className="w-full p-4 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" />
            <input type="password" placeholder="كلمة المرور" required className="w-full p-4 bg-gray-100 rounded-2xl outline-none" />
            <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-indigo-700 transition">دخول سريع</button>
          </form>
        </div>
      </div>
    );
  }

  // --- 5. لوحة التحكم الرئيسية ---
  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'} min-h-screen transition-all`} dir="rtl">
      <nav className={`p-6 flex justify-between items-center shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚀</span>
          <span className="font-bold text-xl">StudyFlow 2026</span>
        </div>
        <div className="flex gap-4 items-center">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-xl">{darkMode ? '☀️' : '🌙'}</button>
          <button onClick={handleLogout} className="text-red-500 text-sm font-medium">خروج</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 md:p-10">
        {/* قسم المؤقت والإحصائيات */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className={`lg:col-span-2 p-8 rounded-[2rem] shadow-sm flex flex-col md:flex-row justify-between items-center ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-white'} border`}>
            <div>
              <h2 className="text-2xl font-bold mb-2">أهلاً بك، {userEmail.split('@')[0]}!</h2>
              <p className="opacity-60 italic">"الناجحون هم من يتقنون إدارة وقتهم."</p>
            </div>
            <div className="mt-6 md:mt-0 text-center">
              <div className="text-5xl font-mono font-bold text-indigo-500 mb-4">{formatTime(seconds)}</div>
              <div className="flex gap-2">
                <button onClick={() => setIsActive(!isActive)} className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold">{isActive ? 'إيقاف' : 'ابدأ التركيز'}</button>
                <button onClick={() => {setIsActive(false); setSeconds(25*60)}} className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-full font-bold">♻️</button>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-[2rem] text-white shadow-xl flex flex-col justify-center">
             <p className="opacity-80">إجمالي المواد المضافة</p>
             <h3 className="text-5xl font-black mt-2">{subjects.length}</h3>
             <button onClick={() => setIsModalOpen(true)} className="mt-6 bg-white text-indigo-600 py-3 rounded-2xl font-bold hover:bg-gray-100 transition shadow-md">إضافة مادة جديدة +</button>
          </div>
        </div>

        {/* عرض المواد الدراسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subjects.map(sub => (
            <div key={sub.id} className={`p-8 rounded-[2.5rem] shadow-lg hover:scale-[1.02] transition-transform ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-2xl font-bold mb-6">{sub.name}</h3>
              <div className="flex justify-between mb-2 text-sm">
                <span>التقدم: {Math.round((sub.done/sub.total)*100)}%</span>
                <span>{sub.done}/{sub.total} فصول</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 mb-8 overflow-hidden">
                <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${(sub.done/sub.total)*100}%` }}></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateProgress(sub.id, 1)} className="flex-[2] bg-indigo-50 text-indigo-600 py-3 rounded-2xl font-bold hover:bg-indigo-600 hover:text-white transition">+ فصل</button>
                <button onClick={() => updateProgress(sub.id, -1)} className="flex-1 bg-gray-50 dark:bg-gray-700 py-3 rounded-2xl font-bold opacity-40">-</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal إضافة مادة */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300`}>
            <h2 className="text-3xl font-bold mb-8">خطة جديدة 📝</h2>
            <div className="space-y-4">
              <input type="text" placeholder="اسم المادة" className={`w-full p-4 rounded-2xl outline-none border-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-transparent'} focus:border-indigo-500`} onChange={e => setNewSub({...newSub, name: e.target.value})} />
              <input type="number" placeholder="عدد فصول المنهج" className={`w-full p-4 rounded-2xl outline-none border-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-transparent'} focus:border-indigo-500`} onChange={e => setNewSub({...newSub, total: parseInt(e.target.value)})} />
              <div className="flex gap-4 pt-4">
                <button onClick={addSubject} className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg">إضافة للمنهج</button>
                <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 dark:bg-gray-700 py-4 rounded-2xl font-bold">إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
