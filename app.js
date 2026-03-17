import React, { useState, useEffect } from 'react';

function App() {
  // 1. الحالة (State) مع استرجاع البيانات من التخزين المحلي
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('study_data');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Pure Math", total: 12, done: 4, color: 'bg-blue-500' },
      { id: 2, name: "Physics", total: 10, done: 3, color: 'bg-purple-500' }
    ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [newSub, setNewSub] = useState({ name: '', total: 0 });
  
  // Pomodoro Timer State
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  // 2. حفظ البيانات تلقائياً عند أي تغيير
  useEffect(() => {
    localStorage.setItem('study_data', JSON.stringify(subjects));
  }, [subjects]);

  // 3. منطق المؤقت
  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds(s => s - 1), 1000);
    } else if (seconds === 0) {
      clearInterval(interval);
      new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play();
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const addSubject = () => {
    if (newSub.name && newSub.total > 0) {
      const colors = ['bg-blue-500', 'bg-purple-500', 'bg-indigo-500', 'bg-pink-500', 'bg-emerald-500'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setSubjects([...subjects, { ...newSub, id: Date.now(), done: 0, color: randomColor }]);
      setIsModalOpen(false);
      setNewSub({ name: '', total: 0 });
    }
  };

  const updateProgress = (id, amount) => {
    setSubjects(subjects.map(s => {
      if (s.id === id) {
        const newDone = Math.min(Math.max(s.done + amount, 0), s.total);
        return { ...s, done: newDone };
      }
      return s;
    }));
  };

  const deleteSubject = (id) => {
    if(window.confirm("هل أنت متأكد من حذف هذه المادة؟")) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'} min-h-screen transition-colors duration-300 font-sans`} dir="rtl">
      
      {/* Navbar */}
      <nav className={`p-6 shadow-sm flex justify-between items-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h1 className="text-2xl font-black tracking-tight">STUDY<span className="text-indigo-500">FLOW</span> 2026</h1>
        <div className="flex gap-4">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700">
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold hover:scale-105 transition">
            + مادة جديدة
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        
        {/* Welcome & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className={`p-6 rounded-3xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <p className="opacity-60">إجمالي المواد</p>
            <h2 className="text-4xl font-bold">{subjects.length}</h2>
          </div>
          <div className={`p-6 rounded-3xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <p className="opacity-60">الفصول المنجزة</p>
            <h2 className="text-4xl font-bold text-emerald-500">
              {subjects.reduce((acc, curr) => acc + curr.done, 0)}
            </h2>
          </div>
          {/* Pomodoro Card */}
          <div className="md:col-span-1 p-6 rounded-3xl bg-indigo-600 text-white shadow-xl text-center">
            <h3 className="text-lg font-medium mb-2">مؤقت التركيز</h3>
            <div className="text-4xl font-mono font-bold mb-4">{formatTime(seconds)}</div>
            <div className="flex justify-center gap-2">
              <button onClick={() => setIsActive(!isActive)} className="bg-white/20 px-4 py-1 rounded-lg text-sm">
                {isActive ? 'إيقاف' : 'ابدأ'}
              </button>
              <button onClick={() => {setIsActive(false); setSeconds(25*60)}} className="bg-white/10 px-4 py-1 rounded-lg text-sm">إعادة</button>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subjects.map(sub => (
            <div key={sub.id} className={`group relative p-8 rounded-[2rem] shadow-lg transition-all hover:-translate-y-2 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <button onClick={() => deleteSubject(sub.id)} className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 text-red-400 transition">✕</button>
              <h3 className="text-2xl font-bold mb-6">{sub.name}</h3>
              
              <div className="flex justify-between mb-2 text-sm font-medium">
                <span>التقدم: {Math.round((sub.done/sub.total)*100)}%</span>
                <span>{sub.done} / {sub.total} فصل</span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-8 overflow-hidden">
                <div className={`${sub.color} h-full transition-all duration-700`} style={{ width: `${(sub.done/sub.total)*100}%` }}></div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => updateProgress(sub.id, 1)} className="flex-1 bg-indigo-500/10 text-indigo-500 py-3 rounded-2xl font-bold hover:bg-indigo-500 hover:text-white transition">+ فصل</button>
                <button onClick={() => updateProgress(sub.id, -1)} className="flex-1 bg-gray-100 dark:bg-gray-700 py-3 rounded-2xl font-bold">-</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal - إضافة مادة */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl`}>
            <h2 className="text-3xl font-bold mb-8 text-center">خطة جديدة 📝</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm mb-2 opacity-60">اسم المادة الدراسيّة</label>
                <input 
                  type="text" placeholder="مثال: ميكانيكا، كيمياء عضويّة" 
                  className={`w-full p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                  onChange={e => setNewSub({...newSub, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm mb-2 opacity-60">إجمالي عدد الفصول</label>
                <input 
                  type="number" placeholder="كم فصل في المنهج؟" 
                  className={`w-full p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                  onChange={e => setNewSub({...newSub, total: parseInt(e.target.value)})}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={addSubject} className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-extrabold shadow-lg hover:bg-indigo-700">تأكيد الإضافة</button>
                <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-200 dark:bg-gray-700 py-4 rounded-2xl font-bold">إلغاء</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <footer className="text-center py-10 opacity-40 text-sm">
        صنع بكل حماس لمستقبل أفضل © 2026
      </footer>
    </div>
  );
}

export default App;
