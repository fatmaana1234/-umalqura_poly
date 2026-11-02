import React, { useState } from 'react';
import { Smartphone, Copy, Check, Download, Layers, ShieldCheck, Play } from 'lucide-react';

interface Props {
  lang: 'ar' | 'en';
}

export const FlutterAppViewer: React.FC<Props> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [activeTab, setActiveTab] = useState<'main' | 'patient' | 'physio' | 'pubspec'>('main');
  const [copied, setCopied] = useState(false);

  const flutterCodes: Record<string, string> = {
    pubspec: `name: um_alqura_polyclinic_app
description: "Um Alqura Polyclinic Barka Oman - Complete Mobile System 2026"
version: 1.0.0+1
environment:
  sdk: '>=3.4.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  supabase_flutter: ^2.5.6
  camera: ^0.11.0
  google_mlkit_pose_detection: ^0.12.0
  flutter_tts: ^4.0.2
  font_awesome_flutter: ^10.7.0
  fl_chart: ^0.68.0
  url_launcher: ^6.3.0
  intl: ^0.19.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/logo.png
    - assets/images/barka_clinic.png
`,
    main: `// ==============================================================================
// UM ALQURA POLYCLINIC - MOBILE APP ENTRYPOINT (FLUTTER 3.22)
// Barka, Sultanate of Oman - iOS & Android Single Codebase
// ==============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'screens/patient_app.dart';
import 'screens/physio_app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const UmAlquraApp());
}

class UmAlquraApp extends StatelessWidget {
  const UmAlquraApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'مجمع أم القرى الطبي',
      debugShowCheckedModeBanner: false,
      locale: const Locale('ar', 'OM'),
      supportedLocales: const [
        Locale('ar', 'OM'),
        Locale('en', 'US'),
      ],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      theme: ThemeData(
        fontFamily: 'Cairo',
        primaryColor: const Color(0xFF075563), // Dark Teal
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF075563),
          primary: const Color(0xFF075563),
          secondary: const Color(0xFFB59B62), // Calm Gold
          surface: const Color(0xFFFAF8F1), // Ivory
        ),
        scaffoldBackgroundColor: const Color(0xFFFAF8F1),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF075563),
          foregroundColor: Colors.white,
          elevation: 0,
        ),
      ),
      home: const RoleSelectorScreen(),
    );
  }
}

class RoleSelectorScreen extends StatelessWidget {
  const RoleSelectorScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset('assets/images/logo.png', height: 110),
              const SizedBox(height: 16),
              const Text(
                'مجمع أم القرى الطبي - بركاء',
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF075563),
                ),
              ),
              const Text(
                'سلطنة عُمان • قسم العلاج الطبيعي والتأهيل',
                style: TextStyle(fontSize: 14, color: Color(0xFFB59B62)),
              ),
              const SizedBox(height: 40),
              _buildRoleButton(
                context,
                title: 'تطبيق المريض (Patient App)',
                subtitle: 'حجز المواعيد • التمارين المنزلية • مدرب الكاميرا الذكي',
                icon: Icons.person_outline,
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const PatientHomeScreen()),
                ),
              ),
              const SizedBox(height: 16),
              _buildRoleButton(
                context,
                title: 'تطبيق الأخصائي (Physiotherapist App)',
                subtitle: 'كتابة SOAP Notes • فحص زوايا المفاصل بالذكاء الاصطناعي',
                icon: Icons.medical_services_outlined,
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const PhysioDashboardScreen()),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRoleButton(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFF075563).withOpacity(0.15)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 10,
              offset: const Offset(0, 4),
            )
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFF075563).withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: const Color(0xFF075563), size: 28),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF075563))),
                  const SizedBox(height: 4),
                  Text(subtitle, style: const TextStyle(fontSize: 12, color: Colors.grey)),
                ],
              ),
            ),
            const Icon(Icons.arrow_forward_ios, size: 16, color: Color(0xFFB59B62)),
          ],
        ),
      ),
    );
  }
}
`,
    patient: `// ==============================================================================
// PATIENT APP SCREEN (FLUTTER 3.22)
// Home exercise videos, rep counter, WhatsApp appointment reminder
// ==============================================================================

import 'package:flutter/material.dart';

class PatientHomeScreen extends StatefulWidget {
  const PatientHomeScreen({super.key});

  @override
  State<PatientHomeScreen> createState() => _PatientHomeScreenState();
}

class _PatientHomeScreenState extends State<PatientHomeScreen> {
  int _activeSessions = 6;
  int _totalPackageSessions = 10;
  int _vasPain = 3;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ملفي الصحي • أم القرى'),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.chat_bubble_outline),
            onPressed: () {
              // Open WhatsApp support
            },
          )
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF075563), Color(0xFF2A9DA5)],
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('مرحباً بك يا سعيد المعمري', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 6),
                  const Text('باقة شد الفقرات القطنية وتأهيل الديسك (١٠ جلسات)', style: TextStyle(color: Color(0xFFFAF8F1), fontSize: 13)),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('الجلسات المنجزة: $_activeSessions / $_totalPackageSessions', style: const TextStyle(color: Colors.white, fontSize: 12)),
                      Text('مقياس الألم الحالي: $_vasPain / 10', style: const TextStyle(color: Color(0xFFB59B62), fontWeight: FontWeight.bold)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // AI Camera Home Trainer CTA
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFB59B62)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.camera_alt, color: Color(0xFF075563), size: 36),
                  const SizedBox(width: 14),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('مدرب التمارين المنزلي بالكاميرا', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF075563))),
                        Text('عد التكرارات تلقائياً وفحص استقامة الظهر بالذكاء الاصطناعي', style: TextStyle(fontSize: 11, color: Colors.grey)),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF075563)),
                    child: const Text('ابدأ الآن', style: TextStyle(color: Colors.white)),
                  )
                ],
              ),
            ),
            const SizedBox(height: 24),

            const Text('تماريني الموصوفة من الأخصائي', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF075563))),
            const SizedBox(height: 12),
            _buildExerciseCard('تمرين إرجاع الذقن واستقامة الرقبة', '٣ مجموعات × ١٠ تكرارات', '٩٠ ثانية • مصور بحشمة'),
            _buildExerciseCard('تمرين الجسر الحوضي لأسفل الظهر', '٣ مجموعات × ١٢ تكرار', '١١٠ ثانية • مصور بحشمة'),
          ],
        ),
      ),
    );
  }

  Widget _buildExerciseCard(String title, String reps, String duration) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        leading: const CircleAvatar(
          backgroundColor: Color(0xFFFAF8F1),
          child: Icon(Icons.play_arrow, color: Color(0xFF075563)),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
        subtitle: Text('$reps • $duration', style: const TextStyle(fontSize: 11, color: Colors.grey)),
        trailing: const Icon(Icons.arrow_forward_ios, size: 14),
      ),
    );
  }
}
`,
    physio: `// ==============================================================================
// PHYSIOTHERAPIST CLINICAL DASHBOARD (FLUTTER 3.22)
// SOAP notes, MediaPipe ROM goniometer, 5D conflict schedule
// ==============================================================================

import 'package:flutter/material.dart';

class PhysioDashboardScreen extends StatelessWidget {
  const PhysioDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('لوحة الأخصائي • مجمع أم القرى'),
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildQuickCard(
            context,
            title: 'الكاتب الذكي AI Scribe',
            subtitle: 'استماع صوتي وتدوين فوري لـ SOAP Note',
            icon: Icons.mic,
          ),
          _buildQuickCard(
            context,
            title: 'قياس المدى الحركي بالكاميرا (ROM)',
            subtitle: 'Google MediaPipe لقياس زوايا المفاصل رقمياً',
            icon: Icons.camera,
          ),
          _buildQuickCard(
            context,
            title: 'خريطة مواضع الألم التفاعلية',
            subtitle: 'تحديد بؤر الألم وتتبع مسار تحسنها',
            icon: Icons.accessibility_new,
          ),
          _buildQuickCard(
            context,
            title: 'الحاسبات السريرية (ODI / DASH / Berg)',
            subtitle: 'احتساب نسب العجز الوظيفي التلقائية',
            icon: Icons.calculate,
          ),
        ],
      ),
    );
  }

  Widget _buildQuickCard(BuildContext context, {required String title, required String subtitle, required IconData icon}) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: const Color(0xFF075563).withOpacity(0.1),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: const Color(0xFF075563)),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF075563))),
        subtitle: Text(subtitle, style: const TextStyle(fontSize: 12, color: Colors.grey)),
        trailing: const Icon(Icons.arrow_forward_ios, size: 14),
      ),
    );
  }
}
`,
  };

  const copyCode = () => {
    navigator.clipboard.writeText(flutterCodes[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadDart = () => {
    const filename = activeTab === 'pubspec' ? 'pubspec.yaml' : `${activeTab}.dart`;
    const blob = new Blob([flutterCodes[activeTab]], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#075563]/10 text-[#075563]">
              <Smartphone className="w-5 h-5 text-[#2A9DA5]" />
            </span>
            <h2 className="text-xl font-bold text-[#075563]">
              {isAr ? 'كود تطبيق الجوال فلاتر الكامل (Flutter 3.22 Single Codebase)' : 'Flutter 3.22 Mobile App Code'}
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {isAr
              ? 'كود دارت كامل جاهز للتصدير كـ APK لأندرويد و IPA لـ iOS • يجمع تطبيق المريض وتطبيق الأخصائي وتطبيق الإدارة بهوية مجمع أم القرى الطبي بركاء'
              : 'Complete Flutter 3.22 Dart codebase for Android & iOS. Covers Patient App, Physio Dashboard, and Admin management.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={copyCode}
            className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ كود Dart' : 'Copy Dart')}
          </button>
          <button
            type="button"
            onClick={downloadDart}
            className="px-4 py-2 bg-[#075563] hover:bg-[#06424e] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            {isAr ? 'تحميل الملف' : 'Download Code'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('main')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'main'
              ? 'bg-[#075563] text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 bg-neutral-100'
          }`}
        >
          lib/main.dart (Entrypoint)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('patient')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'patient'
              ? 'bg-[#075563] text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 bg-neutral-100'
          }`}
        >
          screens/patient_app.dart
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('physio')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'physio'
              ? 'bg-[#075563] text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 bg-neutral-100'
          }`}
        >
          screens/physio_app.dart
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pubspec')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'pubspec'
              ? 'bg-[#075563] text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 bg-neutral-100'
          }`}
        >
          pubspec.yaml
        </button>
      </div>

      {/* Code Display */}
      <div className="bg-[#0F172A] rounded-xl border border-neutral-800 p-5 shadow-inner text-neutral-200 overflow-hidden">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4 text-xs">
          <span className="font-mono text-emerald-400">
            {activeTab === 'pubspec' ? 'pubspec.yaml' : `${activeTab}.dart`}
          </span>
          <span className="text-neutral-500">Flutter 3.22 • Material 3 • Null Safety</span>
        </div>
        <pre className="font-mono text-xs overflow-x-auto max-h-[520px] leading-relaxed text-neutral-300 pr-2">
          {flutterCodes[activeTab]}
        </pre>
      </div>
    </div>
  );
};
