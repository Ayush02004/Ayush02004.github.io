// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const href = a.getAttribute('href');
      if(!href || href.length === 0 || href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
    })
  });

  // Profile photo fallback logic (robust)
  const img = document.getElementById('profile-photo');
  const initials = document.getElementById('initials-fallback');
  if(img && initials){
    // ensure initials hidden initially (CSS hides it too)
    initials.style.display = 'none';

    // If image is already loaded/cached and valid, show it and hide initials
    if(img.complete && img.naturalWidth > 0){
      initials.style.display = 'none';
      img.style.display = 'block';
    }

    img.addEventListener('load', ()=>{
      initials.style.display = 'none';
      img.style.display = 'block';
    });

    img.addEventListener('error', ()=>{
      img.style.display = 'none';
      initials.style.display = 'grid';
    });

    // HEAD check wrapped in try/catch to avoid CORS errors; fallback to load/error events otherwise
    try {
      fetch(img.src, {method:'HEAD'}).then(resp=>{
        if(!resp.ok) throw new Error('image not found');
      }).catch(()=>{
        img.style.display = 'none';
        initials.style.display = 'grid';
      });
    } catch(e){
      // ignore fetch failures (CORS) and rely on load/error events
    }
  }

  // Project thumbnail fallback: hide broken images so layout stays clean
  document.querySelectorAll('.project-thumb').forEach(imgEl => {
    imgEl.addEventListener('error', ()=>{ imgEl.style.display = 'none'; });
    // try HEAD but ignore CORS by wrapping
    try {
      fetch(imgEl.src, {method:'HEAD'}).then(r=>{
        if(!r.ok) throw new Error('no');
      }).catch(()=>{ imgEl.style.display = 'none'; });
    } catch(e){
      // ignore and rely on load/error events
    }
  });
});
