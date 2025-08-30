// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      // ignore external links that start with '#!' etc.
      const href = a.getAttribute('href');
      if(!href || href.length === 0 || href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
    })
  });

  // Profile photo fallback logic
  const img = document.getElementById('profile-photo');
  const initials = document.getElementById('initials-fallback');
  if(!img) return;

  // If the image fails to load, hide it and reveal initials fallback.
  img.addEventListener('error', ()=>{
    img.style.display = 'none';
    initials.style.display = 'grid';
  });

  // If it loads successfully, hide initials
  img.addEventListener('load', ()=>{
    initials.style.display = 'none';
  });

  // Try to fetch the image to get a quick failure if missing (optional)
  // This makes the fallback faster on some hosts
  fetch(img.src, {method:'HEAD'})
    .then(resp=>{
      if(!resp.ok) throw new Error('image not found');
      // do nothing — load event will handle hiding initials
    })
    .catch(()=>{
      img.style.display = 'none';
      initials.style.display = 'grid';
    });
});
