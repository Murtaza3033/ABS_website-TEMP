/* Arabic / RTL layer — ported verbatim in behavior from the static site's align-i18n
   (shared.js). Flips <html dir>, loads the Cairo font once, injects the RTL CSS layer once,
   swaps English text -> Arabic (placeholder dictionary) via a TreeWalker, and keeps applying
   across React re-renders with a MutationObserver while Arabic is active.

   Exposed as applyLang(lang), called by LanguageContext on language change. */

// ---- placeholder Arabic dictionary (replace with professional translations) ----
const AR = {
  'Home': 'الرئيسية', 'Company': 'الشركة', 'Products': 'المنتجات', 'Resources': 'الموارد',
  'Our Presence': 'حضورنا', 'About Us': 'من نحن', 'Clients': 'عملاؤنا', 'Contact Us': 'اتصل بنا',
  'Book a Demo': 'احجز عرضاً', 'Book a demo': 'احجز عرضاً',
  'Our Team': 'فريقنا', 'Our Advisors': 'مستشارونا', 'Our Advisor': 'مستشارنا', 'Our Partners': 'شركاؤنا', 'Our Clients': 'عملاؤنا',
  'Events': 'الفعاليات', 'Careers': 'الوظائف', 'Industries We Serve': 'القطاعات التي نخدمها',
  "Let's talk": 'لنتحدث', 'Get Info': 'اطلب معلومات', 'Learn More': 'اعرف المزيد', 'Learn more': 'اعرف المزيد',
  'Explore Our Team': 'استكشف فريقنا', 'See details': 'عرض التفاصيل',
  'Talk to a human': 'تحدث مع شخص', 'Ask a question': 'اطرح سؤالاً', 'Partnership': 'شراكة',
  'Learn about products': 'تعرف على المنتجات', 'Send message': 'إرسال الرسالة',
  'Align Assistant': 'مساعد Align', 'Online now': 'متصل الآن', 'Type a message…': 'اكتب رسالة…',
  'Quick Links': 'روابط سريعة', 'Follow us': 'تابعنا',
  'Transform your operations.': 'حوّل عملياتك.',
  'Enterprise software, built around how you actually work.': 'برمجيات مؤسسية مبنية حول طريقة عملك الفعلية.',
  'Book a discovery call': 'احجز مكالمة تعريفية',
  'Explore the advantages of partnering with us': 'اكتشف مزايا الشراكة معنا',
  'Manufacturers, pharma teams, retailers and service companies — running on our software every day.': 'شركات التصنيع وفرق الأدوية وتجار التجزئة وشركات الخدمات — تعمل على برمجياتنا كل يوم.',
  'We don’t just automate — we orchestrate.': 'نحن لا نُؤتمت فحسب — بل نُنسّق.',
  'Every department, one system': 'كل قسم، نظام واحد',
  'Nothing lives in a silo': 'لا شيء يعمل بمعزل',
  'Payments, attendance, approvals and reporting connect natively — no middleware, no exports, no manual sync.': 'المدفوعات والحضور والموافقات والتقارير مترابطة أصلاً — دون وسيط أو تصدير أو مزامنة يدوية.',
  'Dashboards that decide, not just display': 'لوحات تتخذ القرار، لا تعرض فقط',
  'Live visibility into every process, with the context to act on it — not just a report to read after the fact.': 'رؤية مباشرة لكل عملية، مع السياق للتصرف بناءً عليها — لا مجرد تقرير يُقرأ لاحقاً.',
  'chaos to aligned.': 'من الفوضى إلى الانسجام.',
  'The same day, with Align': 'في اليوم نفسه، مع Align',
  'Every product we ship began as one of these knots inside a real client’s business — and we straightened it.': 'كل منتج نطلقه بدأ كإحدى هذه العُقد داخل عمل عميل حقيقي — وقمنا بحلّها.',
  'Untangle your operations →': 'فُكّ تعقيد عملياتك →',
  'One aligned way of working.': 'طريقة عمل واحدة منسجمة.',
  'Finance, inventory, procurement and approvals — the whole operation in one connected flow.': 'المالية والمخزون والمشتريات والموافقات — العملية كاملة في تدفق واحد مترابط.',
  'Attendance, leave, payroll and people analytics — one place for managers and every employee.': 'الحضور والإجازات والرواتب وتحليلات الموظفين — مكان واحد للمديرين وكل موظف.',
  'Field visits, samples, routes and live KPIs — full visibility over teams on the ground.': 'الزيارات الميدانية والعينات والمسارات والمؤشرات المباشرة — رؤية كاملة للفرق في الميدان.',
  'Finance & Ops': 'المالية والعمليات', 'People & Payroll': 'الموظفون والرواتب', 'Field & Sales': 'الميدان والمبيعات',
  'Discovery & Fit': 'الاكتشاف والملاءمة', 'Product Engineering': 'هندسة المنتج', 'Implementation': 'التنفيذ', 'Support & SLA': 'الدعم واتفاقية الخدمة', 'Insight & Optimization': 'الرؤية والتحسين',
  'We map your process, teams, gaps and operational goals before building anything.': 'نرسم عملياتك وفرقك وثغراتك وأهدافك التشغيلية قبل بناء أي شيء.',
  'We design and develop scalable software products around your real workflows.': 'نصمم ونطوّر منتجات برمجية قابلة للتوسع حول تدفقات عملك الحقيقية.',
  'We deploy, configure, train and launch systems with minimal disruption.': 'ننشر ونهيّئ وندرّب ونطلق الأنظمة بأقل قدر من التعطيل.',
  'We stay involved with support, updates, improvements and managed service.': 'نبقى معك بالدعم والتحديثات والتحسينات والخدمة المُدارة.',
  'We use feedback, analytics and usage data to continuously improve operations.': 'نستخدم الملاحظات والتحليلات وبيانات الاستخدام لتحسين العمليات باستمرار.',
  'what you can’t buy.': 'ما لا يمكن شراؤه.',
  'The team behind our products takes on custom builds — web, mobile and SaaS.': 'الفريق وراء منتجاتنا ينفّذ حلولاً مخصصة — ويب وجوال وبرمجيات كخدمة.',
  'Explore solution →': 'استكشف الحل →',
  'the same discipline.': 'الانضباط نفسه.', 'All industries →': 'كل القطاعات →',
  'Manufacturing': 'التصنيع', 'Pharmaceutical': 'الأدوية', 'Retail': 'التجزئة', 'Distribution': 'التوزيع', 'HR & Workforce': 'الموارد البشرية', 'Enterprise': 'المؤسسات', 'Services': 'الخدمات',
  'View All': 'عرض الكل', 'Approve': 'موافقة', 'Hold': 'تعليق', 'Reject': 'رفض', 'Total': 'الإجمالي', 'Routes': 'المسارات', 'Loaded': 'محمّل', 'En route': 'في الطريق', 'Delivered': 'تم التسليم',
};

const SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, svg: 1, SVG: 1 };
const origMap = new WeakMap();
let fontAdded = false;
let cssAdded = false;
let mo = null;
let moTimer = null;

function ensureFontAndCss() {
  if (!fontAdded) {
    const f = document.createElement('link');
    f.rel = 'stylesheet';
    f.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap';
    document.head.appendChild(f);
    fontAdded = true;
  }
  if (!cssAdded) {
    const css = document.createElement('style');
    css.id = 'alignI18nCss';
    css.textContent =
      'html[dir="rtl"] body, html[dir="rtl"] button, html[dir="rtl"] input, html[dir="rtl"] textarea, html[dir="rtl"] select{font-family:"Cairo","Outfit",system-ui,sans-serif !important;}' +
      'html[dir="rtl"] #alignBotRoot, html[dir="rtl"] #alignBotRoot *{font-family:"Cairo",system-ui,sans-serif !important;}' +
      'html[dir="rtl"] #abLauncher{right:auto !important;left:24px !important;}' +
      'html[dir="rtl"] #abPanel{right:auto !important;left:24px !important;}' +
      'html[dir="rtl"] #abTip{right:auto !important;left:96px !important;}' +
      'html[dir="rtl"] #abMsgs > div{align-items:flex-start;}' +
      'html[dir="rtl"] .i18n-flip{display:inline-block;transform:scaleX(-1);}' +
      'html[dir="rtl"]{text-align:right;}';
    document.head.appendChild(css);
    cssAdded = true;
  }
}

function swapTo(lang) {
  const ar = lang === 'ar';
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
  let n;
  while ((n = walker.nextNode())) {
    const p = n.parentNode;
    if (!p) continue;
    if (SKIP[p.nodeName]) continue;
    if (p.closest && p.closest('#alignI18nToggle')) continue;
    const raw = n.nodeValue;
    const t = raw.trim();
    if (!t) continue;
    if (ar) {
      let nv = raw;
      if (AR[t] !== undefined) nv = raw.replace(t, AR[t]);
      if (/[→←›‹]/.test(nv)) {
        nv = nv
          .replace(/[→←]/g, (c) => (c === '→' ? '←' : '→'))
          .replace(/[›‹]/g, (c) => (c === '›' ? '‹' : '›'));
      }
      if (nv !== raw) {
        if (!origMap.has(n)) origMap.set(n, raw);
        n.nodeValue = nv;
      }
    } else if (origMap.has(n)) {
      n.nodeValue = origMap.get(n);
    }
  }
}

export function applyLang(lang) {
  ensureFontAndCss();
  const html = document.documentElement;
  if (lang === 'ar') {
    html.setAttribute('dir', 'rtl');
    html.setAttribute('lang', 'ar');
  } else {
    html.setAttribute('dir', 'ltr');
    html.setAttribute('lang', 'en');
  }
  swapTo(lang);

  // keep re-applying while Arabic is active (React re-renders / route changes)
  if (mo) { mo.disconnect(); mo = null; }
  if (lang === 'ar') {
    mo = new MutationObserver(() => {
      clearTimeout(moTimer);
      moTimer = setTimeout(() => swapTo('ar'), 60);
    });
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
  }
}
