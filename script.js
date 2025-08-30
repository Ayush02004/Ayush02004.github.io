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


// Profile photo fallback logic
const img = document.getElementById('profile-photo');
const initials = document.getElementById('initials-fallback');
if(img){
img.addEventListener('error', ()=>{
img.style.display = 'none';
initials.style.display = 'grid';
});
img.addEventListener('load', ()=>{
initials.style.display = 'none';
});


// quick HEAD check to fail fast
fetch(img.src, {method:'HEAD'})
.then(resp=>{ if(!resp.ok) throw new Error('not found'); })
.catch(()=>{ img.style.display='none'; initials.style.display='grid'; });
}


// Project thumbnail fallback: hide broken images so layout stays clean
document.querySelectorAll('.project-thumb').forEach(img => {
img.addEventListener('error', ()=>{ img.style.display = 'none'; });
// also try HEAD fetch to quickly detect missing images on some hosts
fetch(img.src, {method:'HEAD'}).then(r=>{ if(!r.ok) throw new Error('no'); }).catch(()=>{ img.style.display = 'none'; });
});
});