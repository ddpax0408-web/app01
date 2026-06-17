import React, { useState, useEffect, useMemo } from 'react';

// ==========================================
// 1. 오리지널 Iris 데이터셋 (150개 샘플 전체 탑재)
// [sepalLength, sepalWidth, petalLength, petalWidth, species]
// Species: 0 - setosa, 1 - versicolor, 2 - virginica
// ==========================================
const IRIS_RAW_DATA = [
  [5.1,3.5,1.4,0.2,0],[4.9,3.0,1.4,0.2,0],[4.7,3.2,1.3,0.2,0],[4.6,3.1,1.5,0.2,0],[5.0,3.6,1.4,0.2,0],
  [5.4,3.9,1.7,0.4,0],[4.6,3.4,1.4,0.3,0],[5.0,3.4,1.5,0.2,0],[4.4,2.9,1.4,0.2,0],[4.9,3.1,1.5,0.1,0],
  [5.4,3.7,1.5,0.2,0],[4.8,3.4,1.6,0.2,0],[4.8,3.0,1.4,0.1,0],[4.3,3.0,1.1,0.1,0],[5.8,4.0,1.2,0.2,0],
  [5.7,4.4,1.5,0.4,0],[5.4,3.9,1.3,0.4,0],[5.1,3.5,1.4,0.3,0],[5.7,3.8,1.7,0.3,0],[5.1,3.8,1.5,0.3,0],
  [5.4,3.4,1.7,0.2,0],[5.1,3.7,1.5,0.4,0],[4.6,3.6,1.0,0.2,0],[5.1,3.3,1.7,0.5,0],[4.8,3.4,1.9,0.2,0],
  [5.0,3.0,1.6,0.2,0],[5.0,3.4,1.6,0.4,0],[5.2,3.5,1.5,0.2,0],[5.2,3.4,1.4,0.2,0],[4.7,3.2,1.6,0.2,0],
  [4.8,3.1,1.6,0.2,0],[5.4,3.4,1.5,0.4,0],[5.2,4.1,1.5,0.1,0],[5.5,4.2,1.4,0.2,0],[4.9,3.1,1.5,0.2,0],
  [5.0,3.2,1.2,0.2,0],[5.5,3.5,1.3,0.2,0],[4.9,3.6,1.4,0.1,0],[4.4,3.0,1.3,0.2,0],[5.1,3.4,1.5,0.2,0],
  [5.0,3.5,1.3,0.3,0],[4.5,2.3,1.3,0.3,0],[4.4,3.2,1.3,0.2,0],[5.0,3.5,1.6,0.6,0],[5.1,3.8,1.9,0.4,0],
  [4.8,3.0,1.4,0.3,0],[5.1,3.8,1.6,0.2,0],[4.6,3.2,1.4,0.2,0],[5.3,3.7,1.5,0.2,0],[5.0,3.3,1.4,0.2,0],
  [7.0,3.2,4.7,1.4,1],[6.4,3.2,4.5,1.5,1],[6.9,3.1,4.9,1.5,1],[5.5,2.3,4.0,1.3,1],[6.5,2.8,4.6,1.5,1],
  [5.7,2.8,4.5,1.3,1],[6.3,3.3,4.7,1.6,1],[4.9,2.4,3.3,1.0,1],[6.6,2.9,4.6,1.3,1],[5.2,2.7,3.9,1.4,1],
  [5.0,2.0,3.5,1.0,1],[5.9,3.0,4.2,1.5,1],[6.0,2.2,4.0,1.0,1],[6.1,2.9,4.7,1.4,1],[5.6,2.9,3.6,1.3,1],
  [6.7,3.1,4.4,1.4,1],[5.6,3.0,4.5,1.5,1],[5.8,2.7,4.1,1.0,1],[6.2,2.2,4.5,1.5,1],[5.6,2.5,3.9,1.1,1],
  [5.9,3.2,4.8,1.8,1],[6.1,2.8,4.0,1.3,1],[6.3,2.5,4.9,1.5,1],[6.1,2.8,4.7,1.2,1],[6.4,2.9,4.3,1.3,1],
  [6.6,3.0,4.4,1.4,1],[6.8,2.8,4.8,1.4,1],[6.7,3.0,5.0,1.7,1],[6.0,2.9,4.5,1.5,1],[5.7,2.6,3.5,1.0,1],
  [5.5,2.4,3.8,1.1,1],[5.5,2.4,3.7,1.0,1],[5.8,2.7,3.9,1.2,1],[6.0,2.7,5.1,1.6,1],[5.4,3.0,4.5,1.5,1],
  [6.0,3.4,4.5,1.6,1],[6.7,3.1,4.7,1.5,1],[6.3,2.3,4.4,1.3,1],[5.6,3.0,4.1,1.3,1],[5.5,2.5,4.0,1.3,1],
  [5.5,2.6,4.4,1.2,1],[6.1,3.0,4.6,1.4,1],[5.8,2.6,4.0,1.2,1],[5.0,2.3,3.3,1.0,1],[5.6,2.7,4.2,1.3,1],
  [5.7,3.0,4.2,1.2,1],[5.7,2.9,4.2,1.3,1],[6.2,2.9,4.3,1.3,1],[5.1,2.5,3.0,1.1,1],[5.7,2.8,4.1,1.3,1],
  [6.3,3.3,6.0,2.5,2],[5.8,2.7,5.1,1.9,2],[7.1,3.0,5.9,2.1,2],[6.3,2.9,5.6,1.8,2],[6.5,3.0,5.8,2.2,2],
  [7.6,3.0,6.6,2.1,2],[4.9,2.5,4.5,1.7,2],[7.3,2.9,6.3,1.8,2],[6.7,2.5,5.8,1.8,2],[7.2,3.6,6.1,2.5,2],
  [6.5,3.2,5.1,2.0,2],[6.4,2.7,5.3,1.9,2],[6.8,3.0,5.5,2.1,2],[5.7,2.5,5.0,2.0,2],[5.8,2.8,5.1,2.4,2],
  [6.4,3.2,5.3,2.3,2],[6.5,3.0,5.5,1.8,2],[7.7,3.8,6.7,2.2,2],[7.7,2.6,6.9,2.3,2],[6.0,2.2,5.0,1.5,2],
  [6.9,3.2,5.7,2.3,2],[5.6,2.8,4.9,2.0,2],[7.7,2.8,6.7,2.0,2],[6.3,2.7,4.9,1.8,2],[6.7,3.3,5.7,2.1,2],
  [7.2,3.2,6.0,1.8,2],[6.2,2.8,4.8,1.8,2],[6.1,3.0,4.9,1.8,2],[6.4,2.8,5.6,2.1,2],[7.2,3.0,5.8,1.6,2],
  [7.4,2.8,6.1,1.9,2],[7.9,3.8,6.4,2.0,2],[6.4,2.8,5.6,2.2,2],[6.3,2.8,5.1,1.5,2],[6.1,2.6,5.6,1.4,2],
  [7.7,3.0,6.1,2.3,2],[6.3,3.4,5.6,2.4,2],[6.4,3.1,5.5,1.8,2],[6.0,3.0,4.8,1.8,2],[6.9,3.1,5.4,2.1,2],
  [6.7,3.1,5.6,2.4,2],[6.9,3.1,5.1,2.3,2],[5.8,2.7,5.1,1.9,2],[6.8,3.2,5.9,2.3,2],[6.7,3.3,5.7,2.5,2],
  [6.7,3.0,5.2,2.3,2],[6.3,2.5,5.0,1.9,2],[6.5,3.0,5.2,2.0,2],[6.2,3.4,5.4,2.3,2],[5.9,3.0,5.1,1.8,2]
];

const SPECIES_INFO = [
  { id: 0, name: 'setosa', korean: '세토사', color: '#6366f1', bg: 'bg-indigo-500/10', border: 'border-indigo-500', text: 'text-indigo-400', desc: '꽃잎이 아주 작고 꽃받침이 둥근 형태' },
  { id: 1, name: 'versicolor', korean: '버시컬러', color: '#ec4899', bg: 'bg-pink-500/10', border: 'border-pink-500', text: 'text-pink-400', desc: '중간 크기의 꽃잎과 꽃받침' },
  { id: 2, name: 'virginica', korean: '버진아카', color: '#10b981', bg: 'bg-emerald-500/10', border: 'border-emerald-500', text: 'text-emerald-400', desc: '가장 거대하고 길쭉한 꽃잎' }
];

const FEATURE_NAMES = [
  { id: 0, key: 'sepalLength', label: '꽃받침 길이', unit: 'cm', min: 4.3, max: 7.9 },
  { id: 1, key: 'sepalWidth', label: '꽃받침 너비', unit: 'cm', min: 2.0, max: 4.4 },
  { id: 2, key: 'petalLength', label: '꽃잎 길이', unit: 'cm', min: 1.0, max: 6.9 },
  { id: 3, key: 'petalWidth', label: '꽃잎 너비', unit: 'cm', min: 0.1, max: 2.5 }
];

const formattedData = IRIS_RAW_DATA.map((row, idx) => ({
  id: idx,
  sepalLength: row[0],
  sepalWidth: row[1],
  petalLength: row[2],
  petalWidth: row[3],
  species: row[4],
  speciesName: SPECIES_INFO[row[4]].name,
  speciesKorean: SPECIES_INFO[row[4]].korean
}));

export default function App() {
  const [activeTab, setActiveTab] = useState('predictor'); // 모바일 핵심 기능인 '실시간 예측 및 꽃 모핑'을 기본 탭으로!

  // 공통 머신러닝 파라미터 (단순화)
  const [kValue, setKValue] = useState(3);

  // 실시간 붓꽃 수치 (모든 탭 공유 및 동적 연동)
  const [predSepalLength, setPredSepalLength] = useState(5.8);
  const [predSepalWidth, setPredSepalWidth] = useState(3.0);
  const [predPetalLength, setPredPetalLength] = useState(4.35);
  const [predPetalWidth, setPredPetalWidth] = useState(1.3);

  // 시각화용 축 선택
  const [scatterX, setScatterX] = useState(2); // 기본값: 꽃잎 길이
  const [scatterY, setScatterY] = useState(3); // 기본값: 꽃잎 너비

  // ⭐️ [버그 픽스]: 누락되었던 검색어 입력 및 데이터 가공 상태 복구
  const [searchQuery, setSearchQuery] = useState('');
  
  const sortedData = useMemo(() => {
    return formattedData;
  }, []);

  // -----------------------------------------------------------------
  // KNN 예측 연산 코어
  // -----------------------------------------------------------------
  const realtimePrediction = useMemo(() => {
    const features = [predSepalLength, predSepalWidth, predPetalLength, predPetalWidth];
    
    const dists = formattedData.map(row => {
      const d = Math.sqrt(
        Math.pow(row.sepalLength - features[0], 2) +
        Math.pow(row.sepalWidth - features[1], 2) +
        Math.pow(row.petalLength - features[2], 2) +
        Math.pow(row.petalWidth - features[3], 2)
      );
      return { distance: d, species: row.species, id: row.id, item: row };
    });

    dists.sort((a, b) => a.distance - b.distance);
    const neighbors = dists.slice(0, kValue);

    const votes = [0, 0, 0];
    neighbors.forEach(n => {
      votes[n.species]++;
    });

    let maxVotes = -1;
    let predictedSpecies = 0;
    for (let i = 0; i < votes.length; i++) {
      if (votes[i] > maxVotes) {
        maxVotes = votes[i];
        predictedSpecies = i;
      }
    }

    const confidence = maxVotes / kValue;
    return { predictedSpecies, confidence, neighbors };
  }, [predSepalLength, predSepalWidth, predPetalLength, predPetalWidth, kValue]);

  // -----------------------------------------------------------------
  // 2D 결정 경계 그리드 연산 (모바일 최적화 버전 - 24x18 격자)
  // -----------------------------------------------------------------
  const decisionGrid = useMemo(() => {
    const gridX = 24;
    const gridY = 18;
    const xFeature = FEATURE_NAMES[scatterX];
    const yFeature = FEATURE_NAMES[scatterY];
    
    const xMin = xFeature.min - 0.2;
    const xMax = xFeature.max + 0.2;
    const yMin = yFeature.min - 0.2;
    const yMax = yFeature.max + 0.2;
    
    const grid = [];
    const baseFeatures = [predSepalLength, predSepalWidth, predPetalLength, predPetalWidth];

    for (let i = 0; i < gridX; i++) {
      const pctX = i / (gridX - 1);
      const xVal = xMin + pctX * (xMax - xMin);

      for (let j = 0; j < gridY; j++) {
        const pctY = j / (gridY - 1);
        const yVal = yMin + pctY * (yMax - yMin);

        const testVector = [...baseFeatures];
        testVector[scatterX] = xVal;
        testVector[scatterY] = yVal;

        const dists = formattedData.map(row => {
          return {
            distance: Math.sqrt(
              Math.pow(row.sepalLength - testVector[0], 2) +
              Math.pow(row.sepalWidth - testVector[1], 2) +
              Math.pow(row.petalLength - testVector[2], 2) +
              Math.pow(row.petalWidth - testVector[3], 2)
            ),
            species: row.species
          };
        });

        dists.sort((a, b) => a.distance - b.distance);
        
        const votes = [0, 0, 0];
        for (let k = 0; k < kValue; k++) {
          votes[dists[k].species]++;
        }

        let predictedSpecies = 0;
        let maxVotes = -1;
        for (let s = 0; s < 3; s++) {
          if (votes[s] > maxVotes) {
            maxVotes = votes[s];
            predictedSpecies = s;
          }
        }

        grid.push({ xPct: pctX, yPct: pctY, species: predictedSpecies });
      }
    }
    return grid;
  }, [scatterX, scatterY, kValue, predSepalLength, predSepalWidth, predPetalLength, predPetalWidth]);

  // SVG 좌표 헬퍼
  const scatterConfig = { width: 320, height: 240, padding: 30 };
  const getScale = (featureIdx, val, isX) => {
    const config = FEATURE_NAMES[featureIdx];
    const min = config.min - 0.2;
    const max = config.max + 0.2;
    const viewSize = isX ? scatterConfig.width - (scatterConfig.padding * 2) : scatterConfig.height - (scatterConfig.padding * 2);
    const offset = scatterConfig.padding;
    if (isX) {
      return offset + ((val - min) / (max - min)) * viewSize;
    } else {
      return scatterConfig.height - offset - ((val - min) / (max - min)) * viewSize;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased relative pb-12 select-none">
      
      {/* 고정(Sticky/Fixed) 방식을 버리고 HTML 문서의 기본 흐름으로 상단 영역 선언 */}
      <div className="relative z-[999] bg-slate-950 border-b border-slate-800 px-4 py-4">
        <div className="max-w-md mx-auto flex flex-col gap-3">
          
          {/* 심플 헤더 */}
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-md font-bold tracking-tight text-white">
              Iris AI 모바일 샌드박스
            </h1>
          </div>

          {/* 탭 네비게이션: 터치 영역 극대화(Touch target 48px), pointer-events 고정 및 Z-index 최상단 확보 */}
          <div className="flex bg-slate-900 p-1.5 rounded-xl border border-slate-800 gap-1 select-none relative z-[1000]">
            {[
              { id: 'predictor', label: '🌸 예측 & 모핑' },
              { id: 'explorer', label: '📈 결정 경계' },
              { id: 'dashboard', label: '📊 데이터' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(tab.id);
                }}
                className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all text-center cursor-pointer select-none active:scale-95 ${
                  activeTab === tab.id 
                    ? 'bg-slate-850 text-emerald-400 border border-slate-700 shadow-lg font-black' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                style={{ touchAction: 'manipulation', minHeight: '48px', position: 'relative', zIndex: 1010 }}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* 메인 뷰포트 바디 */}
      <div className="max-w-md mx-auto px-4 py-4 space-y-4 relative z-10">
        
        {/* TAB 1: 실시간 예측 & 꽃 모핑 (기본 대시보드) */}
        {activeTab === 'predictor' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* 결과 스코어보드 */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">실시간 KNN 연산결과</span>
                <h2 className="text-lg font-black text-white">
                  품종: <span style={{ color: SPECIES_INFO[realtimePrediction.predictedSpecies].color }}>
                    {SPECIES_INFO[realtimePrediction.predictedSpecies].korean}
                  </span>
                </h2>
                <span className="text-[11px] text-slate-400 font-mono block">
                  의사결정 신뢰율: {(realtimePrediction.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-bold border-2 animate-pulse"
                style={{ 
                  borderColor: SPECIES_INFO[realtimePrediction.predictedSpecies].color,
                  backgroundColor: SPECIES_INFO[realtimePrediction.predictedSpecies].color + '15',
                  color: SPECIES_INFO[realtimePrediction.predictedSpecies].color 
                }}
              >
                {SPECIES_INFO[realtimePrediction.predictedSpecies].name.toUpperCase().substring(0, 3)}
              </div>
            </div>

            {/* 예측 결과에 연동된 모핑 SVG */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center justify-center h-48 relative overflow-hidden">
              <svg viewBox="0 0 200 200" className="w-40 h-40 transition-all duration-500">
                <defs>
                  <radialGradient id="flowerCenter" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="100%" stopColor="#d97706" />
                  </radialGradient>
                  <linearGradient id="petalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={realtimePrediction.predictedSpecies === 0 ? '#a5b4fc' : (realtimePrediction.predictedSpecies === 1 ? '#fbcfe8' : '#6366f1')} />
                    <stop offset="100%" stopColor={realtimePrediction.predictedSpecies === 0 ? '#4f46e5' : (realtimePrediction.predictedSpecies === 1 ? '#db2777' : '#047857')} />
                  </linearGradient>
                </defs>
                {/* 줄기 */}
                <path d="M100,100 Q100,170 95,185" fill="none" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
                {/* 잎 1 */}
                <path d={`M100,100 C${100 - predSepalWidth*10},${100 - predSepalLength*12} ${100 + predSepalWidth*10},${100 - predSepalLength*12} 100,100`} fill="url(#petalGradient)" opacity="0.85" />
                {/* 잎 2 */}
                <path d={`M100,100 C${100 - predPetalLength*12},${100 + predPetalWidth*10} ${100 - predPetalLength*4},${100 + predPetalLength*12} 100,100`} fill="url(#petalGradient)" opacity="0.75" />
                {/* 잎 3 */}
                <path d={`M100,100 C${100 + predPetalLength*4},${100 + predPetalLength*12} ${100 + predPetalLength*12},${100 + predPetalWidth*10} 100,100`} fill="url(#petalGradient)" opacity="0.75" />
                {/* 중심 */}
                <circle cx="100" cy="100" r={3 + predPetalWidth * 4} fill="url(#flowerCenter)" />
              </svg>
              <span className="absolute bottom-2 right-3 text-[9px] font-mono text-slate-500">
                수치 모핑 모델링 구동중
              </span>
            </div>

            {/* 모바일 최적화 원터치 드래그 슬라이더 */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-4">
              <span className="text-xs font-bold text-slate-300 block">4대 피처 크기 조절 (cm)</span>
              
              {[
                { label: '꽃받침 길이 (SL)', val: predSepalLength, setter: setPredSepalLength, min: 4.3, max: 7.9, step: 0.1 },
                { label: '꽃받침 너비 (SW)', val: predSepalWidth, setter: setPredSepalWidth, min: 2.0, max: 4.4, step: 0.1 },
                { label: '꽃잎 길이 (PL)', val: predPetalLength, setter: setPredPetalLength, min: 1.0, max: 6.9, step: 0.1 },
                { label: '꽃잎 너비 (PW)', val: predPetalWidth, setter: setPredPetalWidth, min: 0.1, max: 2.5, step: 0.1 }
              ].map((sld, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">{sld.label}</span>
                    <span className="text-emerald-400 font-bold">{sld.val.toFixed(1)} cm</span>
                  </div>
                  <input
                    type="range"
                    min={sld.min}
                    max={sld.max}
                    step={sld.step}
                    value={sld.val}
                    onChange={(e) => sld.setter(parseFloat(e.target.value))}
                    className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              ))}

              {/* 기본 타입 퀵매핑 버튼 */}
              <div className="pt-2 border-t border-slate-900">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-2">테스트 표준 세트 주입</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '세토사 형', sl: 5.0, sw: 3.4, pl: 1.5, pw: 0.2 },
                    { label: '버시컬러 형', sl: 5.9, sw: 2.7, pl: 4.2, pw: 1.3 },
                    { label: '버진아카 형', sl: 6.5, sw: 3.0, pl: 5.5, pw: 2.0 }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setPredSepalLength(preset.sl);
                        setPredSepalWidth(preset.sw);
                        setPredPetalLength(preset.pl);
                        setPredPetalWidth(preset.pw);
                      }}
                      className="py-2.5 text-[11px] font-bold bg-slate-900 border border-slate-800 hover:border-slate-750 text-slate-300 rounded-xl cursor-pointer active:bg-slate-800"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 심플 알고리즘 파라미터 조절 */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-300 block">이웃 탐색 수 (KNN - K)</span>
                <span className="text-[10px] text-slate-500 block">다수결에 참여할 가장 인접한 점의 개수</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setKValue(prev => Math.max(1, prev - 2))}
                  className="w-9 h-9 bg-slate-900 border border-slate-800 rounded-xl font-black cursor-pointer text-slate-300 active:bg-slate-800"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-mono font-bold text-emerald-400">K = {kValue}</span>
                <button 
                  onClick={() => setKValue(prev => Math.min(15, prev + 2))}
                  className="w-9 h-9 bg-slate-900 border border-slate-800 rounded-xl font-black cursor-pointer text-slate-300 active:bg-slate-800"
                >
                  +
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: 실시간 의사결정 경계선 시각화 */}
        {activeTab === 'explorer' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* 시가지 가로/세로 매핑축 선택 패널 */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
              <span className="text-xs font-bold text-slate-300 block">산점도 축 변수 고정</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">X축</label>
                  <select 
                    value={scatterX} 
                    onChange={(e) => setScatterX(parseInt(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none"
                  >
                    {FEATURE_NAMES.map(fn => <option key={fn.id} value={fn.id}>{fn.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-1">Y축</label>
                  <select 
                    value={scatterY} 
                    onChange={(e) => setScatterY(parseInt(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none"
                  >
                    {FEATURE_NAMES.map(fn => <option key={fn.id} value={fn.id}>{fn.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* 컴팩트 디시전 맵 캔버스 */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex flex-col items-center">
              <span className="text-xs font-bold text-slate-400 mb-2 self-start px-1 block">
                실시간 2차원 의사결정 영역 평면도
              </span>
              
              <div className="relative border border-slate-900 rounded-xl overflow-hidden bg-slate-950">
                <svg viewBox={`0 0 ${scatterConfig.width} ${scatterConfig.height}`} className="w-full max-w-sm h-auto">
                  
                  {/* 1. 모바일에 알맞게 캐싱된 결정 구역 배경 그리기 */}
                  {decisionGrid.map((cell, idx) => {
                    const colWidth = (scatterConfig.width - scatterConfig.padding * 2) / 24;
                    const rowHeight = (scatterConfig.height - scatterConfig.padding * 2) / 18;
                    const xPos = scatterConfig.padding + cell.xPct * (scatterConfig.width - scatterConfig.padding * 2);
                    const yPos = scatterConfig.height - scatterConfig.padding - rowHeight - cell.yPct * (scatterConfig.height - scatterConfig.padding * 2);
                    
                    let cellColor = 'rgba(99, 102, 241, 0.08)'; // Setosa
                    if (cell.species === 1) cellColor = 'rgba(236, 72, 153, 0.08)'; // Versicolor
                    if (cell.species === 2) cellColor = 'rgba(16, 185, 129, 0.08)'; // Virginica

                    return (
                      <rect 
                        key={`cell-${idx}`} 
                        x={xPos} 
                        y={yPos} 
                        width={colWidth + 0.5} 
                        height={rowHeight + 0.5} 
                        fill={cellColor} 
                        shapeRendering="crispEdges" 
                      />
                    );
                  })}

                  {/* 격자 축 라인 */}
                  <line x1={scatterConfig.padding} y1={scatterConfig.height - scatterConfig.padding} x2={scatterConfig.width - scatterConfig.padding} y2={scatterConfig.height - scatterConfig.padding} stroke="#475569" strokeWidth="1" />
                  <line x1={scatterConfig.padding} y1={scatterConfig.padding} x2={scatterConfig.padding} y2={scatterConfig.height - scatterConfig.padding} stroke="#475569" strokeWidth="1" />

                  {/* 2. KNN 최인접 이웃 연결선 */}
                  {realtimePrediction && realtimePrediction.neighbors.map((nei, idx) => {
                    const targetX = getScale(scatterX, [predSepalLength, predSepalWidth, predPetalLength, predPetalWidth][scatterX], true);
                    const targetY = getScale(scatterY, [predSepalLength, predSepalWidth, predPetalLength, predPetalWidth][scatterY], false);
                    
                    const nX = getScale(scatterX, nei.item[FEATURE_NAMES[scatterX].key], true);
                    const nY = getScale(scatterY, nei.item[FEATURE_NAMES[scatterY].key], false);

                    return (
                      <line 
                        key={idx} 
                        x1={targetX} 
                        y1={targetY} 
                        x2={nX} 
                        y2={nY} 
                        stroke="#f59e0b" 
                        strokeWidth="1.2" 
                        strokeDasharray="2 2" 
                      />
                    );
                  })}

                  {/* 3. 실제 원본 붓꽃 도트 플로팅 */}
                  {formattedData.map(item => {
                    const cx = getScale(scatterX, item[FEATURE_NAMES[scatterX].key], true);
                    const cy = getScale(scatterY, item[FEATURE_NAMES[scatterY].key], false);
                    const spInfo = SPECIES_INFO[item.species];
                    const isKNeighbor = realtimePrediction?.neighbors.some(n => n.id === item.id);

                    return (
                      <circle 
                        key={item.id}
                        cx={cx}
                        cy={cy}
                        r={isKNeighbor ? 6.5 : 3}
                        fill={spInfo.color}
                        stroke={isKNeighbor ? '#f59e0b' : 'none'}
                        strokeWidth={isKNeighbor ? 1.5 : 0}
                        opacity={isKNeighbor ? 1.0 : 0.6}
                      />
                    );
                  })}

                  {/* 4. 실시간 드래그 타겟 골드 포인터 */}
                  {(() => {
                    const cx = getScale(scatterX, [predSepalLength, predSepalWidth, predPetalLength, predPetalWidth][scatterX], true);
                    const cy = getScale(scatterY, [predSepalLength, predSepalWidth, predPetalLength, predPetalWidth][scatterY], false);
                    return (
                      <g>
                        <circle cx={cx} cy={cy} r="10" fill="none" stroke="#f59e0b" strokeWidth="1" className="animate-ping" />
                        <circle cx={cx} cy={cy} r="5" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
                      </g>
                    );
                  })()}

                </svg>
              </div>

              {/* 하단 수치 동적 동기화 알림 */}
              <div className="w-full mt-3 p-3 bg-slate-900 rounded-xl text-[11px] text-slate-400 space-y-1">
                <span className="font-bold text-slate-300 block">💡 모바일 하이브리드 바인딩 제어:</span>
                현재 선택된 평면 변수 외의 슬라이더 크기를 변경하면, 보이지 않는 잔여 차원의 영향도가 계산식에 즉각 개입되어 <strong className="text-emerald-400">배경 영역의 결정 지형 형태가 유기적으로 흐르듯 모핑</strong>됩니다.
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: 요약형 붓꽃 원본 데이터셋 */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* 요약 카드 그리드 */}
            <div className="grid grid-cols-3 gap-2">
              {SPECIES_INFO.map(info => {
                const count = formattedData.filter(d => d.species === info.id).length;
                return (
                  <div key={info.id} className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center">
                    <span className="text-[10px] font-bold block" style={{ color: info.color }}>{info.korean}</span>
                    <span className="text-lg font-black block mt-0.5 text-white">{count}개</span>
                  </div>
                );
              })}
            </div>

            {/* 로우 데이터 탐색기 */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-3.5 border-b border-slate-900 flex justify-between items-center gap-2">
                <span className="text-xs font-bold text-slate-200">오리지널 데이터셋 탐색 (Total 150)</span>
                
                {/* 검색 필터 */}
                <input 
                  type="text" 
                  placeholder="품종 검색..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 w-28 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="overflow-y-auto max-h-56">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-900 text-[10px] text-slate-400 sticky top-0 uppercase border-b border-slate-900">
                    <tr>
                      <th className="p-2.5 pl-4">ID</th>
                      <th className="p-2.5">꽃잎 길이/너비</th>
                      <th className="p-2.5">품종</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-slate-300">
                    {sortedData.filter(item => 
                      searchQuery.trim() === '' || 
                      item.speciesKorean.includes(searchQuery) ||
                      item.speciesName.includes(searchQuery)
                    ).map(item => {
                      const sp = SPECIES_INFO[item.species];
                      return (
                        <tr key={item.id} className="hover:bg-slate-900/50">
                          <td className="p-2.5 pl-4 text-slate-500 font-mono">#{item.id+1}</td>
                          <td className="p-2.5">{item.petalLength} / {item.petalWidth} cm</td>
                          <td className="p-2.5">
                            <span className="font-bold text-[10px]" style={{ color: sp.color }}>
                              {sp.korean}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* 모바일 최적화 하단 미니 상태 바 */}
      <div className="border-t border-slate-800 bg-slate-950 text-slate-500 py-3.5 text-center text-[10px] mt-8 relative z-10 select-none">
        <p className="font-mono text-slate-600">⚡ Iris AI Real-time Core Sandbox / Touch Optimized</p>
      </div>

    </div>
  );
}
