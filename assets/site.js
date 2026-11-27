const year=document.getElementById('yr');
if(year) year.textContent=new Date().getFullYear();
const links=document.getElementById('links');
const menuBtn=document.getElementById('menu');
if(links && menuBtn){
  const setMenu=open=>{links.classList.toggle('open',open);menuBtn.setAttribute('aria-expanded',String(open));menuBtn.setAttribute('aria-label',open?'Close menu':'Open menu')};
  menuBtn.addEventListener('click',()=>setMenu(!links.classList.contains('open')));
  links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  document.addEventListener('keydown',event=>{if(event.key==='Escape' && links.classList.contains('open')){setMenu(false);menuBtn.focus();}});
}
const reveals=document.querySelectorAll('.reveal');
const showAll=()=>reveals.forEach(el=>el.classList.add('in'));
if('IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:0,rootMargin:'0px 0px -5% 0px'});
  reveals.forEach(el=>io.observe(el));
  setTimeout(showAll,2500);
}else showAll();
