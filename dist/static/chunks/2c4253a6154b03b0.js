(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,89590,e=>{"use strict";e.i(47167);var t=e.i(71645),r=e.i(7670),i=e.i(19130),a=e.i(84364),n=e.i(40799),s=e.i(75149),o=e.i(94425),l=e.i(40672),d=e.i(19727);function h(e){return(0,d.default)("MuiSkeleton",e)}(0,l.default)("MuiSkeleton",["root","text","rectangular","rounded","circular","pulse","wave","withChildren","fitContent","heightAuto"]);var c=e.i(43476);let u=a.keyframes`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`,p=a.keyframes`
  0% {
    transform: translateX(-100%);
  }

  50% {
    /* +0.5s of delay between each loop */
    transform: translateX(100%);
  }

  100% {
    transform: translateX(100%);
  }
`,f="string"!=typeof u?a.css`
        animation: ${u} 2s ease-in-out 0.5s infinite;
      `:null,x="string"!=typeof p?a.css`
        &::after {
          animation: ${p} 2s linear 0.5s infinite;
        }
      `:null,m=(0,n.styled)("span",{name:"MuiSkeleton",slot:"Root",overridesResolver:(e,t)=>{let{ownerState:r}=e;return[t.root,t[r.variant],!1!==r.animation&&t[r.animation],r.hasChildren&&t.withChildren,r.hasChildren&&!r.width&&t.fitContent,r.hasChildren&&!r.height&&t.heightAuto]}})((0,s.default)(({theme:e})=>{let t=String(e.shape.borderRadius).match(/[\d.\-+]*\s*(.*)/)[1]||"px",r=parseFloat(e.shape.borderRadius);return{display:"block",backgroundColor:e.vars?e.vars.palette.Skeleton.bg:e.alpha(e.palette.text.primary,"light"===e.palette.mode?.11:.13),height:"1.2em",variants:[{props:{variant:"text"},style:{marginTop:0,marginBottom:0,height:"auto",transformOrigin:"0 55%",transform:"scale(1, 0.60)",borderRadius:`${r}${t}/${Math.round(r/.6*10)/10}${t}`,"&:empty:before":{content:'"\\00a0"'}}},{props:{variant:"circular"},style:{borderRadius:"50%"}},{props:{variant:"rounded"},style:{borderRadius:(e.vars||e).shape.borderRadius}},{props:({ownerState:e})=>e.hasChildren,style:{"& > *":{visibility:"hidden"}}},{props:({ownerState:e})=>e.hasChildren&&!e.width,style:{maxWidth:"fit-content"}},{props:({ownerState:e})=>e.hasChildren&&!e.height,style:{height:"auto"}},{props:{animation:"pulse"},style:f||{animation:`${u} 2s ease-in-out 0.5s infinite`}},{props:{animation:"wave"},style:{position:"relative",overflow:"hidden",WebkitMaskImage:"-webkit-radial-gradient(white, black)","&::after":{background:`linear-gradient(
                90deg,
                transparent,
                ${(e.vars||e).palette.action.hover},
                transparent
              )`,content:'""',position:"absolute",transform:"translateX(-100%)",bottom:0,left:0,right:0,top:0}}},{props:{animation:"wave"},style:x||{"&::after":{animation:`${p} 2s linear 0.5s infinite`}}}]}})),g=t.forwardRef(function(e,t){let a=(0,o.useDefaultProps)({props:e,name:"MuiSkeleton"}),{animation:n="pulse",className:s,component:l="span",height:d,style:u,variant:p="text",width:f,...x}=a,g={...a,animation:n,component:l,variant:p,hasChildren:!!x.children},y=(e=>{let{classes:t,variant:r,animation:a,hasChildren:n,width:s,height:o}=e;return(0,i.default)({root:["root",r,a,n&&"withChildren",n&&!s&&"fitContent",n&&!o&&"heightAuto"]},h,t)})(g);return(0,c.jsx)(m,{as:l,ref:t,className:(0,r.default)(y.root,s),ownerState:g,...x,style:{width:f,height:d,...u}})});e.s(["Skeleton",0,g],89590)},39743,e=>{"use strict";var t=e.i(43476),r=e.i(76552),i=e.i(66796),a=e.i(36057),n=e.i(3974),s=e.i(89590),o=e.i(13607),l=e.i(34251),d=e.i(71645),h=e.i(75736),c=e.i(11795),u=e.i(18566),p=e.i(84500);function f(){let[e,f]=(0,d.useState)([]),[x,m]=(0,d.useState)(!0),[g,y]=(0,d.useState)(null),v=(0,c.createClient)(),w=(0,u.useRouter)();(0,d.useEffect)(()=>{!async function(){try{let{data:{user:e}}=await v.auth.getUser();if(!e)throw Error("Not authenticated");let{data:t,error:r}=await v.from("profiles").select("*").neq("id",e.id).eq("is_profile_completed",!0).limit(20);if(r)throw r;let{data:i,error:a}=await v.from("connections").select("*").or(`requester_id.eq.${e.id},receiver_id.eq.${e.id}`);if(a)throw a;let n=t.map(t=>{let r=i.find(r=>r.requester_id===t.id&&r.receiver_id===e.id||r.receiver_id===t.id&&r.requester_id===e.id);return{...t,connectionStatus:r?r.status:"none"}});f(n)}catch(e){y(e.message)}finally{m(!1)}}()},[v]);let b=async t=>{try{let{data:{user:r}}=await v.auth.getUser();if(!r)return;let{error:i}=await v.from("connections").insert([{requester_id:r.id,receiver_id:t,status:"pending"}]);if(i)throw i;f(e.map(e=>e.id===t?{...e,connectionStatus:"pending"}:e))}catch(e){console.error("Error sending request:",e)}},j=e=>w.push(`/messages?user=${e}`);return g?(0,t.jsx)(n.Alert,{severity:"error",children:g}):(0,t.jsxs)(r.Box,{sx:{maxWidth:1e3,mx:"auto"},children:[(0,t.jsx)(i.Typography,{variant:"h5",fontWeight:"bold",gutterBottom:!0,color:"primary.main",children:"Discover & Connect"}),(0,t.jsx)(i.Typography,{variant:"body1",color:"text.secondary",paragraph:!0,children:"Find peers, mentors, and staff in your campus community."}),x?(0,t.jsx)(a.Grid,{container:!0,spacing:3,children:[1,2,3,4].map(e=>(0,t.jsx)(a.Grid,{size:{xs:12,md:6},children:(0,t.jsxs)(o.Card,{sx:{p:3},children:[(0,t.jsxs)(r.Box,{sx:{display:"flex",mb:2},children:[(0,t.jsx)(s.Skeleton,{variant:"circular",width:64,height:64,sx:{mr:2,flexShrink:0}}),(0,t.jsxs)(r.Box,{sx:{flexGrow:1},children:[(0,t.jsx)(s.Skeleton,{variant:"text",width:"50%",height:28}),(0,t.jsx)(s.Skeleton,{variant:"text",width:"35%"}),(0,t.jsx)(s.Skeleton,{variant:"text",width:"80%"})]})]}),(0,t.jsxs)(r.Box,{sx:{display:"flex",gap:1,mb:2},children:[(0,t.jsx)(s.Skeleton,{variant:"rounded",width:60,height:24,sx:{borderRadius:20}}),(0,t.jsx)(s.Skeleton,{variant:"rounded",width:80,height:24,sx:{borderRadius:20}})]}),(0,t.jsx)(s.Skeleton,{variant:"rounded",width:90,height:32,sx:{borderRadius:20,mt:1}})]})},e))}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(a.Grid,{container:!0,spacing:3,children:e.map(e=>(0,t.jsx)(a.Grid,{size:{xs:12,md:6},children:(0,t.jsx)(h.default,{user:e,connectionStatus:e.connectionStatus,onConnect:b,onMessage:j})},e.id))}),0===e.length&&(0,t.jsxs)(r.Box,{sx:{mt:6,textAlign:"center"},children:[(0,t.jsx)(i.Typography,{variant:"h6",color:"text.secondary",gutterBottom:!0,children:"No profiles on the feed yet."}),(0,t.jsx)(i.Typography,{variant:"body2",color:"text.secondary",sx:{mb:3},children:"Be the first to explore! Use Search to find specific people."}),(0,t.jsx)(l.Button,{variant:"contained",startIcon:(0,t.jsx)(p.default,{}),onClick:()=>w.push("/search"),children:"Browse All Users"})]})]})]})}e.s(["default",()=>f])}]);