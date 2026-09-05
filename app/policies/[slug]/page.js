import { notFound } from 'next/navigation';
import { policies } from '../../../lib/store-data';

const numbered = /^(\d+)\.\s+(.+)/;
const isStep = /^Step\s\d+:/i;
const isLabel = /^(Legal Business Name|Brand Name|Registered Address|GSTIN|Email|Customer Support|Phone\s*\/\s*WhatsApp|Address):/i;
const listLead = /^(To be eligible|This may include|These may include|We may use information collected from you to|If you receive|Please include|To request a return or exchange|Customers may request|The following|Examples include|You may|We may collect|We may share|You agree|You must|You must not):?$/i;

function structure(body){
  const visible=body.filter(x=>!x.includes('[LEGAL ENTITY NAME]')&&!x.includes('[GSTIN]'));
  const intro=[]; const sections=[]; let current=null;
  visible.forEach((text)=>{
    const hit=text.match(numbered);
    if(hit){
      current={number:hit[1],title:hit[2],id:`section-${hit[1]}`,items:[]};
      sections.push(current);
    } else if(current) current.items.push(text);
    else intro.push(text);
  });
  return {intro,sections};
}

function SectionContent({items}){
  return <>{items.map((x,i)=>{
    const next=items[i+1] || '';
    const looksLikeSubhead = listLead.test(x) || (x.length < 56 && !/[.!?]$/.test(x) && next && !isStep.test(x));
    if(isStep.test(x)){
      const [lead,...rest]=x.split(':');
      return <div className="legal-step" key={i}><span>{lead.replace(/Step\s*/i,'')}</span><p>{rest.join(':').trim()}</p></div>;
    }
    if(isLabel.test(x)){
      const [lead,...rest]=x.split(':');
      return <div className="legal-detail" key={i}><span>{lead}</span><strong>{rest.join(':').trim()}</strong></div>;
    }
    if(looksLikeSubhead) return <h3 key={i}>{x.replace(/:$/,'')}</h3>;
    return <p key={i}>{x}</p>;
  })}</>;
}

export async function generateMetadata({params}){const {slug}=await params;return {title:`${policies[slug]?.title || 'Policy'} — 6ix to Go`};}

export default async function Policy({params}){
  const {slug}=await params; const p=policies[slug]; if(!p)notFound();
  const {intro,sections}=structure(p.body);
  return <main className="legal-page">
    <header className="legal-hero">
      <div className="legal-kicker">6IX TO GO <span>/</span> LEGAL</div>
      <h1>{p.title}</h1>
      {intro.length>0 && <div className="legal-intro">{intro.map((x,i)=><p key={i}>{x}</p>)}</div>}
    </header>

    <div className="legal-layout">
      {sections.length>0 && <aside className="legal-toc" aria-label="On this page">
        <div className="legal-toc-inner">
          <span className="legal-toc-label">ON THIS PAGE</span>
          <nav>{sections.map(s=><a key={s.id} href={`#${s.id}`}><span>{String(s.number).padStart(2,'0')}</span>{s.title}</a>)}</nav>
        </div>
      </aside>}

      <article className="legal-document">
        {sections.length ? sections.map(s=><section className="legal-section" id={s.id} key={s.id}>
          <div className="legal-section-number">{String(s.number).padStart(2,'0')}</div>
          <div className="legal-section-copy"><h2>{s.title}</h2><SectionContent items={s.items}/></div>
        </section>) :
        <section className="legal-section legal-section-single"><div className="legal-section-copy"><SectionContent items={p.body}/></div></section>}
      </article>
    </div>
  </main>;
}
