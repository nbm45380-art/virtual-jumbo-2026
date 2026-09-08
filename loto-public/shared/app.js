(()=>{
  const C=window.CFG||{};
  const kind=String(C.name||location.hostname).toLowerCase().includes('7')?'loto7':'loto6';
  const label=kind==='loto7'?'LOTO7':'LOTO6';
  const files=kind==='loto7'?['k1.js','k2.js','k3.js','k4.js','k5.js','k6.js']:['j1.js','j2.js','j3.js'];
  const B=`https://raw.githubusercontent.com/nbm45380-art/virtual-jumbo-2026/loto-public-apps-v3/loto-public/full/${kind}/`;
  const setText=(id,t)=>{const e=document.getElementById(id);if(e)e.textContent=t};
  const failBox=(msg)=>{setText('freshTitle','🔴 完全版の読み込みに失敗');setText('freshMeta',msg);setText('range','再読み込みしてください');const src=document.getElementById('source');if(src)src.innerHTML=`${msg}<br><button onclick="location.reload()" style="margin-top:8px;padding:8px 12px">再読み込み</button>`;};
  const loadScript=(name,n,total)=>new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    const timer=setTimeout(()=>{s.remove();reject(new Error(`完全版データ ${n}/${total} の読込がタイムアウトしました`));},8000);
    s.src=B+name+'?v=20260909-5';
    s.async=false;
    s.onload=()=>{clearTimeout(timer);resolve();};
    s.onerror=()=>{clearTimeout(timer);reject(new Error(`完全版データ ${n}/${total} の読込に失敗しました`));};
    document.head.appendChild(s);
  });
  async function boot(){
    setText('freshTitle','🔄 完全版を準備中');setText('freshMeta','公開版の本体を読み込んでいます');setText('range','完全版 読込中');setText('source','完全版へ切替中…');
    try{
      window.__FULL_GZ_B64='';
      for(let i=0;i<files.length;i++){
        setText('freshMeta',`完全版データを読み込み中… ${i+1}/${files.length}`);
        await loadScript(files[i],i+1,files.length);
      }
      if(!window.__FULL_GZ_B64||window.__FULL_GZ_B64.length<30000)throw new Error('完全版データが揃いませんでした');
      if(!('DecompressionStream'in window))throw new Error('このブラウザは完全版の復元処理に対応していません。Chrome / Edge / Safari の新しい版でお試しください。');
      setText('freshMeta','完全版を展開しています…');
      const bin=atob(window.__FULL_GZ_B64),bytes=Uint8Array.from(bin,c=>c.charCodeAt(0)),ds=new DecompressionStream('gzip');
      let full=await new Response(new Blob([bytes]).stream().pipeThrough(ds)).text();
      if(!full.includes(label+' 仮説研究所')||full.length<50000)throw new Error('完全版データの検証に失敗しました');
      const guard=`<script>(()=>{const _f=window.fetch.bind(window);window.fetch=(u,o={})=>{if(o&&o.signal)return _f(u,o);const c=new AbortController(),t=setTimeout(()=>c.abort(),6000);return _f(u,{...o,signal:c.signal}).finally(()=>clearTimeout(t));};})();<\/script>`;
      full=full.replace('</head>',guard+'</head>');
      document.open();document.write(full);document.close();
    }catch(e){failBox(String(e&&e.message||e));}
  }
  boot();
})();
