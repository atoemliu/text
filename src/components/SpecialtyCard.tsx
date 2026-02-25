import { useState, useRef } from 'react';
import { ImagePlus, Search, Loader2, X, Upload } from 'lucide-react';
import { searchSpecialtyInfo } from '../lib/gemini';
import Markdown from 'react-markdown';

export function SpecialtyCard({ name }: { name: string }) {
  const [image, setImage] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setImage(event.target?.result as string);
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const result = await searchSpecialtyInfo(name);
      setInfo(result);
    } catch (error) {
      console.error(error);
      alert("搜索失败");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col group">
      {/* Image Area */}
      <div
        className="aspect-[4/3] w-full rounded-3xl overflow-hidden bg-white shadow-sm border border-gray-200 relative mb-5 transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-black/5"
        onPaste={handlePaste}
        tabIndex={0}
      >
        {image ? (
          <>
            <img src={image} alt={name} className="w-full h-full object-cover" />
            <button
              onClick={() => setImage(null)}
              className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <ImagePlus className="w-8 h-8 text-gray-300 mb-4" />
            <p className="text-xs text-gray-400 font-sans mb-6 leading-relaxed">
              点击上传或 Ctrl+V 粘贴图片
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs rounded-full transition-colors font-sans flex items-center gap-1.5 border border-gray-200"
              >
                <Upload className="w-3.5 h-3.5" />
                上传
              </button>
            </div>
          </div>
        )}
        <input type="file" className="hidden" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} />
      </div>

      {/* Content Area */}
      <div className="px-2">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-2xl font-serif font-semibold leading-tight text-[#1a1a1a] tracking-tight">{name}</h3>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="p-2 text-gray-400 hover:text-[#1a1a1a] transition-colors rounded-full hover:bg-gray-100 shrink-0"
            title="生成本地简介（不联网）"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </button>
        </div>

        {isSearching && !info && (
          <p className="mt-3 text-xs text-gray-400 font-sans">
            正在生成本地模拟简介，不会向任何外部服务发送请求…
          </p>
        )}

        {info && (
          <div className="mt-4 pt-4 border-t border-gray-200/60">
            <div className="text-sm text-gray-500 font-sans leading-relaxed prose prose-sm max-w-none prose-p:my-1 prose-a:text-blue-600 hover:prose-a:text-blue-500">
              <Markdown>{info}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
