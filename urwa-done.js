/* =========================================================
   urwa-done.js — زرار «أتممت المحاضرة» في صفحات العروة الوثقى
   • يُحمَّل بـ defer بعد ilm-track.js، ويُرسم داخل <div id="urwa-done">
     الموضوع خارج منطقة الهايلايت (بعد </main>) فلا يمسّ فهرسته.
   • يقرأ ويكتب بنفس مفتاح ilm-track (ilm_ + data-lecture-id على <body>)،
     فتظهر العلامة في الفهرس وتتزامن مع الحساب السحابي.
   ========================================================= */
(function () {
  'use strict';
  var host = document.getElementById('urwa-done');
  var id = document.body && document.body.getAttribute('data-lecture-id');
  if (!host || !id) return;

  var css = document.createElement('style');
  css.textContent =
    '.ud{max-width:800px;margin:44px auto 0;padding:0 18px}' +
    '.ud-box{display:flex;flex-wrap:wrap;align-items:center;background:var(--paper,#fffdf9);border:1px solid var(--line,#e4dfd3);border-radius:18px;padding:16px 20px}' +
    '.ud-b{display:inline-flex;align-items:center;font:inherit;font-size:17px;font-weight:700;min-height:48px;padding:0 20px 0 22px;border-radius:30px;border:2px solid var(--accent,#2a7f7a);background:#fff;color:var(--accent,#2a7f7a);cursor:pointer;margin:4px 0 4px 14px}' +
    '.ud-b:hover{background:#eef6f5}' +
    '.ud-i{display:inline-block;width:26px;height:26px;border-radius:50%;border:2px solid var(--accent,#2a7f7a);margin-left:10px;text-align:center;line-height:22px;font-size:15px;color:transparent}' +
    '.ud-b[aria-pressed="true"]{background:var(--accent,#2a7f7a);color:#fff}' +
    '.ud-b[aria-pressed="true"] .ud-i{color:var(--accent,#2a7f7a);background:#fff;border-color:#fff}' +
    '.ud-s{flex:1 1 220px;font-size:14.5px;color:var(--sub,#69708a);line-height:1.8}' +
    '.ud-s a{color:var(--brand,#25305a);font-weight:700}' +
    '@media(max-width:580px){.ud{padding:0 12px}.ud-b{width:100%;justify-content:center;margin:0 0 8px}}' +
    '@media print{.ud{display:none}}';
  document.head.appendChild(css);

  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function isDone() {
    if (window.IlmTrack) { try { return window.IlmTrack.isDone(id); } catch (e) {} }
    return ls('ilm_' + id) === '1';
  }
  function setDone(val) {
    if (window.IlmTrack) { try { window.IlmTrack.setDone(id, val); return; } catch (e) {} }
    ls('ilm_' + id, val ? '1' : '0'); ls('ilm_sync_ts', String(Date.now()));
  }
  /* رابط المحاضرة التالية من شريط التنقل نفسه (الرابط الذي يحمل «←» وليس رابط الفهرس) */
  function nextLink() {
    var as = document.querySelectorAll('.lnav a:not(.home)');
    for (var i = 0; i < as.length; i++) if (as[i].textContent.indexOf('←') > -1) return as[i];
    return null;
  }

  function render() {
    var d = isDone(), nx = nextLink(), msg;
    if (d) msg = 'أحسنت، سُجّلت في الفهرس وفي حسابك.' + (nx ? ' <a href="' + nx.getAttribute('href') + '">' + nx.textContent.replace('←', '').trim() + ' ←</a>' : ' <a href="index.html">ارجع للفهرس</a>');
    else msg = 'علّمها بعد ما تسمع المحاضرة وتقرأ الملف وتحل الأسئلة، وراجع البطاقات بعد يومين.';
    host.innerHTML = '<div class="ud"><div class="ud-box"><button type="button" class="ud-b" aria-pressed="' + d + '"><span class="ud-i" aria-hidden="true">✓</span>' +
      (d ? 'أتممت المحاضرة' : 'علّم: أتممت المحاضرة') + '</button><span class="ud-s" aria-live="polite">' + msg + '</span></div></div>';
    host.querySelector('.ud-b').onclick = function () { setDone(!isDone()); render(); host.querySelector('.ud-b').focus(); };
  }

  render();
  window.addEventListener('ilm-track-synced', render);
})();
