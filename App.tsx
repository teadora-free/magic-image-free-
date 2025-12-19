
import React, { useState, useRef } from 'react';
import { editImage } from './services/geminiService';
import { ImageState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<ImageState>({
    original: null,
    edited: null,
    prompt: '',
    isProcessing: false,
    error: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({
          ...prev,
          original: reader.result as string,
          edited: null,
          error: null
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!state.original) return;
    setState(prev => ({ ...prev, isProcessing: true, error: null }));
    try {
      const editedBase64 = await editImage(state.original, state.prompt);
      setState(prev => ({ ...prev, edited: editedBase64, isProcessing: false }));
    } catch (error: any) {
      setState(prev => ({ ...prev, error: error.message, isProcessing: false }));
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF0] flex flex-col font-sans text-slate-700 relative overflow-x-hidden">
      {/* 고도화된 마법 입자 배경 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[70%] h-[70%] bg-indigo-200/25 blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-[-15%] right-[-10%] w-[70%] h-[70%] bg-pink-200/25 blur-[140px] animate-pulse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div 
              key={i} 
              className="absolute bg-indigo-300 rounded-full animate-magic-float opacity-40 shadow-[0_0_10px_rgba(129,140,248,0.5)]"
              style={{
                width: Math.random() * 6 + 2 + 'px',
                height: Math.random() * 6 + 2 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDuration: Math.random() * 10 + 5 + 's',
                animationDelay: Math.random() * 5 + 's'
              }}
            ></div>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-white/75 backdrop-blur-3xl border-b border-indigo-100/30 py-6 px-12 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-7">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-pink-400 rounded-2xl flex items-center justify-center text-white shadow-2xl relative group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
            </svg>
            <div className="absolute -inset-2 bg-indigo-400/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div className="no-wrap">
            <h1 className="text-3xl font-artistic text-indigo-950 leading-none">Mystic Magic Studio</h1>
            <p className="font-artistic text-xs text-purple-400 tracking-[0.4em] mt-1.5 uppercase">4:5 Auto Composition</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-8 md:p-14 relative z-10">
        {!state.edited ? (
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <section className="bg-white/95 rounded-[4.5rem] p-12 md:p-20 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.1)] border border-white flex flex-col lg:flex-row gap-16 backdrop-blur-md">
              <div className="flex-1 space-y-10">
                <div className="flex items-center gap-6 no-wrap">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm">
                    <span className="text-3xl text-indigo-500 font-artistic">1</span>
                  </div>
                  <h2 className="text-3xl text-indigo-900 font-artistic">이미지 소환</h2>
                </div>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative aspect-[4/5] rounded-[3.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-700 group overflow-hidden ${state.original ? 'border-purple-300 bg-white shadow-2xl' : 'border-purple-100 bg-purple-50/10 hover:bg-white hover:border-purple-300 shadow-sm'}`}
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                  {state.original ? (
                    <img src={state.original} alt="Target" className="w-full h-full object-contain p-6 transition-transform group-hover:scale-[1.04]" />
                  ) : (
                    <div className="text-center group-hover:scale-105 transition-transform duration-500">
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border border-purple-50">
                        <svg className="h-12 w-12 text-purple-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </div>
                      <p className="text-2xl font-artistic text-purple-300">이미지를 제단에 올리세요</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-10 flex flex-col">
                <div className="flex items-center gap-6 no-wrap">
                  <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center border border-pink-100 shadow-sm">
                    <span className="text-3xl text-pink-500 font-artistic">2</span>
                  </div>
                  <h2 className="text-3xl text-indigo-900 font-artistic">마술 영창</h2>
                </div>
                <textarea
                  value={state.prompt}
                  onChange={(e) => setState(prev => ({ ...prev, prompt: e.target.value }))}
                  placeholder="다른 방법을 원하시면 제미나이, GPT등 AI도구를 활용해보세요"
                  className="w-full flex-1 min-h-[250px] p-10 rounded-[3.5rem] border border-purple-50 bg-white/50 focus:bg-white focus:ring-[15px] focus:ring-purple-100/40 outline-none transition-all resize-none text-2xl font-artistic leading-relaxed shadow-inner"
                />
                
                <div className="bg-gradient-to-br from-indigo-50/40 to-white/60 p-8 rounded-[3rem] border border-white/80 shadow-sm space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full animate-ping"></div>
                    <p className="text-xl text-indigo-950 font-artistic no-wrap">지능형 4:5 자동 구도 프로토콜</p>
                  </div>
                  <ul className="text-lg text-indigo-800/70 font-artistic space-y-3">
                    <li className="no-wrap">• AI가 원본을 분석하여 가장 완벽한 4:5 구도로 조정합니다.</li>
                    <li className="no-wrap">• 불필요한 영역은 자르고, 부족한 배경은 마법처럼 채웁니다.</li>
                    <li className="no-wrap">• 당신의 의도를 꿰뚫는 최적의 시각적 밸런스를 제공합니다.</li>
                  </ul>
                </div>

                <button
                  onClick={handleEdit}
                  disabled={!state.original || state.isProcessing}
                  className={`w-full py-10 rounded-[3.5rem] btn-bold text-4xl transition-all shadow-2xl relative overflow-hidden group ${state.isProcessing ? 'bg-slate-200 text-slate-400 cursor-wait' : 'bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-white hover:scale-[1.03] active:scale-95'}`}
                >
                  {state.isProcessing ? (
                    <div className="flex items-center justify-center gap-5">
                      <div className="w-10 h-10 border-4 border-slate-300 border-t-white rounded-full animate-spin"></div>
                      <span className="font-artistic">최적의 구도 탐색 중...</span>
                    </div>
                  ) : (
                    <>
                      <span className="relative z-10 font-artistic">환상적인 마법 실행</span>
                      <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                    </>
                  )}
                </button>
              </div>
            </section>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-1000 space-y-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10 px-8">
              <div className="flex gap-6">
                <button onClick={() => setState(prev => ({ ...prev, edited: null }))} className="px-12 py-5 rounded-[2.5rem] bg-white shadow-2xl btn-bold text-2xl text-indigo-700 border border-indigo-50 hover:bg-indigo-50 hover:scale-105 transition-all">주문 수정</button>
                <button onClick={() => setState({ original: null, edited: null, prompt: '', isProcessing: false, error: null })} className="px-12 py-5 rounded-[2.5rem] bg-white shadow-2xl btn-bold text-2xl text-pink-600 border border-pink-50 hover:bg-pink-50 hover:scale-105 transition-all">새로운 소환</button>
              </div>
              <div className="text-right no-wrap">
                <h2 className="text-6xl text-indigo-950 font-artistic tracking-tighter">Artistic Miracle</h2>
                <p className="font-artistic text-2xl text-purple-500 mt-2">지능형 4:5 자동 구도 완성</p>
              </div>
            </div>

            <div className="bg-white/95 rounded-[5.5rem] p-12 md:p-24 shadow-[0_60px_180px_rgba(0,0,0,0.15)] border border-white flex flex-col items-center gap-14 backdrop-blur-3xl relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-44 h-44 bg-indigo-100/40 blur-[80px] -z-10"></div>
              
              {/* 이미지 캔버스 - 4:5 프레임 */}
              <div className="w-full max-w-2xl aspect-[4/5] bg-white rounded-[2.5rem] overflow-hidden flex items-center justify-center shadow-[0_80px_160px_-40px_rgba(0,0,0,0.5)] ring-1 ring-black/5 transition-transform duration-1000 hover:scale-[1.02]">
                <img src={state.edited} alt="Final Masterpiece" className="w-full h-full object-contain" />
              </div>

              <div className="w-full max-w-2xl space-y-12">
                <a 
                  href={state.edited} 
                  download="mystic-masterpiece.png" 
                  className="w-full py-10 bg-gradient-to-r from-indigo-800 via-indigo-700 to-pink-600 text-white rounded-[3.5rem] btn-bold text-5xl shadow-2xl flex items-center justify-center gap-6 hover:brightness-110 active:scale-95 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  <span className="font-artistic">걸작 영구 소장</span>
                </a>
                
                <div className="text-center space-y-6">
                  <p className="font-artistic text-4xl text-indigo-950 leading-tight no-wrap">AI가 피사체를 분석하여 <br/>가장 아름다운 4:5 구도로 재구성했습니다.</p>
                  <p className="font-artistic text-2xl text-indigo-500/50 leading-relaxed max-w-xl mx-auto">
                    더 이상의 수동 조정은 필요 없습니다. <br/>마법이 스스로 완벽을 찾아냈습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="py-24 text-center relative z-10">
        <div className="max-w-lg mx-auto h-px bg-gradient-to-r from-transparent via-indigo-100/50 to-transparent mb-12"></div>
        <p className="font-artistic text-2xl text-indigo-950/20 tracking-[0.6em] uppercase">Mystic Magic Studio</p>
        <p className="font-artistic text-sm text-indigo-300/60 mt-4 tracking-widest">INTELLIGENT COMPOSITION APPLIED</p>
      </footer>

      <style>{`
        @keyframes magic-float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
          50% { transform: translateY(-50px) scale(1.3); opacity: 0.7; }
        }
        .animate-magic-float {
          animation: magic-float infinite ease-in-out;
        }
        .font-artistic {
          word-break: keep-all;
          overflow-wrap: break-word;
        }
      `}</style>
    </div>
  );
};

export default App;
