import { useState } from 'react';
import { extractTableData } from './lib/gemini';
import { RegionSection } from './components/RegionSection';
import { Upload, Loader2, Sparkles } from 'lucide-react';
import type { RegionData } from './types/region';

export default function App() {
  return <MainContent />;
}

function MainContent() {
  const [data, setData] = useState<RegionData[] | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = (reader.result as string).split(',')[1];
        const extracted = await extractTableData(base64, file.type);
        setData(extracted);
      } catch (error) {
        console.error(error);
        alert("生成示例数据失败，请重试");
      } finally {
        setIsExtracting(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLoadDemo = async () => {
    // 直接加载示例数据，不需要实际图片
    setIsExtracting(true);
    try {
      const extracted = await extractTableData('', 'image/png');
      setData(extracted);
    } catch (error) {
      console.error(error);
      alert("加载示例数据失败，请重试");
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 lg:p-20 max-w-7xl mx-auto">
      <header className="mb-20 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight mb-4 text-[#1a1a1a]">风物志</h1>
          <p className="text-gray-400 font-sans tracking-[0.2em] uppercase text-xs font-medium">
            Local Specialties Illustrated
          </p>
        </div>
        {data && (
          <button
            onClick={() => setData(null)}
            className="text-sm font-sans text-gray-500 hover:text-black transition-colors underline underline-offset-4"
          >
            重新上传图表
          </button>
        )}
      </header>

      {!data && (
        <div className="max-w-3xl mx-auto mt-32 space-y-4">
          <label className="flex flex-col items-center justify-center w-full h-80 border border-dashed border-gray-300 rounded-[2rem] cursor-pointer bg-white/40 hover:bg-white transition-all hover:shadow-xl hover:border-gray-400 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
              {isExtracting ? (
                <>
                  <div className="relative mb-6">
                    <Loader2 className="w-12 h-12 text-gray-300 animate-spin" />
                    <Sparkles className="w-5 h-5 text-[#1a1a1a] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-sm text-gray-600 font-sans font-medium tracking-wide">
                    正在生成风物志特产图鉴示例...
                  </p>
                  <p className="text-xs text-gray-400 font-sans mt-2">
                    当前为纯前端演示版，不会上传图片到任何服务器
                  </p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-6 h-6 text-[#1a1a1a]" />
                  </div>
                  <p className="mb-3 text-base text-gray-600 font-sans">
                    <span className="font-semibold text-[#1a1a1a]">点击上传</span> 或拖拽图片至此处
                  </p>
                  <p className="text-sm text-gray-400 font-sans">
                    支持包含特产列表的纯文字图片（当前为本地模拟解析，仅用于触发示例数据生成）
                  </p>
                </>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isExtracting}
            />
          </label>

          <div className="text-center">
            <button
              type="button"
              onClick={handleLoadDemo}
              disabled={isExtracting}
              className="text-sm font-sans text-gray-600 hover:text-black underline underline-offset-4 disabled:text-gray-400"
            >
              直接查看示例特产图鉴
            </button>
          </div>
        </div>
      )}

      {data && (
        <div className="space-y-32 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {data.map((regionData, index) => (
            <RegionSection key={index} data={regionData} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
