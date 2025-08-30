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

  // Project thumbnail: lazy-load + placeholder fallback instead of hiding
  const PLACEHOLDER_THUMB = 'projects/placeholder.jpg';
  document.querySelectorAll('.project-thumb').forEach(imgEl => {
    // enable lazy loading and async decoding
    if(!imgEl.hasAttribute('loading')) imgEl.setAttribute('loading','lazy');
    imgEl.setAttribute('decoding','async');

    const swapToPlaceholder = () => {
      // avoid infinite loop: if already swapped, hide to keep layout clean
      if(imgEl.dataset.fallbackApplied === '1') { imgEl.style.display = 'none'; return; }
      imgEl.src = PLACEHOLDER_THUMB;
      imgEl.dataset.fallbackApplied = '1';
      imgEl.style.display = 'block';
    };

    imgEl.addEventListener('error', swapToPlaceholder);

    // try HEAD but ignore CORS; if missing, swap to placeholder
    try {
      fetch(imgEl.src, {method:'HEAD'}).then(r=>{
        if(!r.ok) throw new Error('no');
      }).catch(swapToPlaceholder);
    } catch(e){
      // ignore and rely on load/error events
    }
  });
});
