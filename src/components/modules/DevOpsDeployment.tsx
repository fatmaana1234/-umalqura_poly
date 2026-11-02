import React, { useState } from 'react';
import { Server, Download, Copy, Check, Terminal, ShieldCheck, Cpu } from 'lucide-react';

interface Props {
  lang: 'ar' | 'en';
}

export const DevOpsDeployment: React.FC<Props> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [copied, setCopied] = useState(false);

  const dockerCompose = `# ==============================================================================
# UM ALQURA POLYCLINIC - DOCKER COMPOSE & COOLIFY DEPLOYMENT (2026)
# Barka, Sultanate of Oman - Self-Hosted Open-Source Stack
# ==============================================================================

version: '3.8'

services:
  # 1. Main Application Service (Next.js Dashboard & Express API)
  umalqura-web:
    image: node:20-alpine
    container_name: umalqura_polyclinic_web
    restart: always
    working_dir: /app
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - SUPABASE_URL=http://supabase-kong:8000
      - SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
      - WHATSAPP_API_TOKEN=YOUR_META_WHATSAPP_TOKEN
      - WHATSAPP_PHONE_ID=79470050
      - OMAN_INSURANCE_API_GATEWAY=https://api.damanhealth.om/v1
    command: sh -c "npm install && npm run build && npm start"
    depends_on:
      - supabase-db
      - whisper-scribe-service

  # 2. Local Whisper.cpp Speech-to-Text Microservice for AI Scribe
  whisper-scribe-service:
    image: ghcr.io/ggerganov/whisper.cpp:main
    container_name: umalqura_whisper_ai
    restart: always
    ports:
      - "8080:8080"
    volumes:
      - ./models:/models
    command: ["--server", "--port", "8080", "-m", "/models/ggml-medium.bin", "--language", "ar"]

  # 3. Supabase PostgreSQL 16 Database
  supabase-db:
    image: supabase/postgres:15.1.1.78
    container_name: umalqura_postgres
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: postgres
      POSTGRES_PASSWORD: SecureUmAlquraBarka2026!
      POSTGRES_USER: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./supabase_schema_2026.sql:/docker-entrypoint-initdb.d/init.sql

  # 4. Supabase API Gateway (Kong)
  supabase-kong:
    image: kong:2.8.1
    container_name: umalqura_kong
    restart: always
    ports:
      - "8000:8000"
    environment:
      KONG_DATABASE: "off"
      KONG_DECLARATIVE_CONFIG: /var/lib/kong/kong.yml
    depends_on:
      - supabase-db

  # 5. Redis for Rate Limiting & Real-time Sockets
  redis:
    image: redis:7-alpine
    container_name: umalqura_redis
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
`;

  const copyDocker = () => {
    navigator.clipboard.writeText(dockerCompose);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#075563]/10 text-[#075563]">
              <Server className="w-5 h-5 text-[#2A9DA5]" />
            </span>
            <h2 className="text-xl font-bold text-[#075563]">
              {isAr ? 'حزم النشر السحابي ودوكر (Docker Compose & Coolify Deployment)' : 'Docker & Coolify Deployment Stack'}
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {isAr
              ? 'ملف docker-compose.yml كامل مع خدمات Supabase و Whisper.cpp المحلي وبوابة الدفع والتأمين العُمانية، جاهز للنشر على Coolify أو أي سيرفر VPS مستقل'
              : 'Production-ready docker-compose file with Supabase, local Whisper.cpp, and Oman insurance API bindings.'}
          </p>
        </div>

        <button
          type="button"
          onClick={copyDocker}
          className="px-4 py-2 bg-[#075563] hover:bg-[#06424e] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          {copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ docker-compose.yml' : 'Copy Compose')}
        </button>
      </div>

      {/* Deployment Architecture Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-[#075563] font-bold text-xs">
            <Terminal className="w-4 h-4 text-[#B59B62]" />
            <span>{isAr ? '١. النشر عبر كوليفاي (Coolify)' : '1. Coolify Deployment'}</span>
          </div>
          <p className="text-[11px] text-neutral-600 leading-relaxed">
            {isAr
              ? 'أضف المشروع كـ Docker Compose في لوحة Coolify على سيرفر VPS (Hetzner أو OVH أو عمانتل) واضغط Deploy.'
              : 'Add as a Docker Compose service in Coolify and hit Deploy.'}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-[#075563] font-bold text-xs">
            <Cpu className="w-4 h-4 text-[#2A9DA5]" />
            <span>{isAr ? '٢. خدمة الذكاء الاصطناعي Whisper' : '2. Whisper.cpp AI'}</span>
          </div>
          <p className="text-[11px] text-neutral-600 leading-relaxed">
            {isAr
              ? 'يعمل محرك Whisper.cpp محلياً بنموذج اللغة العربية (ggml-medium.bin) دون تسريب بيانات المرضى خارج السيرفر.'
              : 'Runs locally on CPU with zero cloud telemetry for maximum patient privacy.'}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-[#075563] font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{isAr ? '٣. ربط التأمين والواتساب' : '3. WhatsApp & Daman'}</span>
          </div>
          <p className="text-[11px] text-neutral-600 leading-relaxed">
            {isAr
              ? 'مضبوط مسبقاً لربط هاتف المجمع (+968 79470050) مع Cloud API ونقاط نهاية بوابة ضمان للتأمين.'
              : 'Configured for Meta WhatsApp Cloud API and Oman Daman health platform.'}
          </p>
        </div>
      </div>

      {/* Code viewer */}
      <div className="bg-[#0F172A] rounded-xl border border-neutral-800 p-5 shadow-inner text-neutral-200 overflow-hidden">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4 text-xs">
          <span className="font-mono text-emerald-400">docker-compose.yml</span>
          <span className="text-neutral-500">Coolify 4.0+ • Docker Engine 26+</span>
        </div>
        <pre className="font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed text-neutral-300 pr-2">
          {dockerCompose}
        </pre>
      </div>
    </div>
  );
};
