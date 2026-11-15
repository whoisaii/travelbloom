const input=document.getElementById('conditionInput');
const resultsBox=document.getElementById('results');
const heading=document.getElementById('resultsTitle');
const count=document.getElementById('resultCount');
let searchId=0;
const catalog=fetch('travel_recommendation_api.json').then(r=>{if(!r.ok)throw Error('Could not load destinations');return r.json();});
function selectRecommendations(data,term){
 const q=term.trim().toLowerCase();
 if(!q)return [];
 if(['beach','beaches'].includes(q))return data.beaches;
 if(['temple','temples'].includes(q))return data.temples;
 if(['country','countries'].includes(q))return data.countries.flatMap(c=>c.cities);
 const items=[...data.beaches,...data.temples];
 for(const c of data.countries){if(c.name.toLowerCase().includes(q))items.push(...c.cities);else items.push(...c.cities.filter(i=>i.name.toLowerCase().includes(q)));}
 return [...new Map(items.filter(i=>i.name.toLowerCase().includes(q)||data.countries.some(c=>c.name.toLowerCase().includes(q)&&c.cities.includes(i))).map(i=>[i.name,i])).values()];
}
function render(list){
 resultsBox.replaceChildren();
 count.textContent=`${list.length} destinations found`;
 if(!list.length){const p=document.createElement('p');p.className='empty';p.textContent='No destinations found. Try beach, temple or country.';resultsBox.append(p);return;}
 for(const item of list){
  const card=document.createElement('article');card.className='result-card';
  const image=document.createElement('img');image.src=item.imageUrl;image.alt=item.name;
  const info=document.createElement('div');info.className='info';
  const tag=document.createElement('p');tag.className='eyebrow';tag.textContent='A PLACE TO REMEMBER';
  const title=document.createElement('h3');title.textContent=item.name;
  const description=document.createElement('p');description.textContent=item.description;
  const link=document.createElement('a');link.className='place-link';link.href='https://en.wikipedia.org/w/index.php?search='+encodeURIComponent(item.name);link.target='_blank';link.rel='noopener noreferrer';link.textContent='Explore destination ↗';
  info.append(tag,title,description,link);card.append(image,info);resultsBox.append(card);
 }
}
async function searchCondition(){
 const id=++searchId,q=input.value.trim();
 if(!q){clearResults();return;}
 heading.textContent=`Discover: ${q}`;count.textContent='Finding your next somewhere…';
 try{const data=await catalog;if(id!==searchId)return;render(selectRecommendations(data,q));}
 catch(err){if(id!==searchId)return;count.textContent='Unable to load destinations. Please refresh and try again.';}
}
function clearResults(){++searchId;input.value='';heading.textContent='A world to discover';count.textContent='Choose a category or search above.';resultsBox.replaceChildren();input.focus();}
document.getElementById('searchForm').addEventListener('submit',event=>{event.preventDefault();searchCondition();});
document.getElementById('btnClear').addEventListener('click',clearResults);
document.querySelectorAll('[data-query]').forEach(button=>button.addEventListener('click',()=>{input.value=button.dataset.query;searchCondition();}));
