module.exports=[66148,a=>{"use strict";var b=a.i(72131),c=a.i(98621),d=a.i(36472),e=a.i(61156),f=a.i(74443),g=a.i(25054),h=a.i(33115),i=a.i(68604),j=a.i(29297);function k(a){return(0,j.default)("MuiSkeleton",a)}(0,i.default)("MuiSkeleton",["root","text","rectangular","rounded","circular","pulse","wave","withChildren","fitContent","heightAuto"]);var l=a.i(87924);let m=e.keyframes`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`,n=e.keyframes`
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
`,o="string"!=typeof m?e.css`
        animation: ${m} 2s ease-in-out 0.5s infinite;
      `:null,p="string"!=typeof n?e.css`
        &::after {
          animation: ${n} 2s linear 0.5s infinite;
        }
      `:null,q=(0,f.styled)("span",{name:"MuiSkeleton",slot:"Root",overridesResolver:(a,b)=>{let{ownerState:c}=a;return[b.root,b[c.variant],!1!==c.animation&&b[c.animation],c.hasChildren&&b.withChildren,c.hasChildren&&!c.width&&b.fitContent,c.hasChildren&&!c.height&&b.heightAuto]}})((0,g.default)(({theme:a})=>{let b=String(a.shape.borderRadius).match(/[\d.\-+]*\s*(.*)/)[1]||"px",c=parseFloat(a.shape.borderRadius);return{display:"block",backgroundColor:a.vars?a.vars.palette.Skeleton.bg:a.alpha(a.palette.text.primary,"light"===a.palette.mode?.11:.13),height:"1.2em",variants:[{props:{variant:"text"},style:{marginTop:0,marginBottom:0,height:"auto",transformOrigin:"0 55%",transform:"scale(1, 0.60)",borderRadius:`${c}${b}/${Math.round(c/.6*10)/10}${b}`,"&:empty:before":{content:'"\\00a0"'}}},{props:{variant:"circular"},style:{borderRadius:"50%"}},{props:{variant:"rounded"},style:{borderRadius:(a.vars||a).shape.borderRadius}},{props:({ownerState:a})=>a.hasChildren,style:{"& > *":{visibility:"hidden"}}},{props:({ownerState:a})=>a.hasChildren&&!a.width,style:{maxWidth:"fit-content"}},{props:({ownerState:a})=>a.hasChildren&&!a.height,style:{height:"auto"}},{props:{animation:"pulse"},style:o||{animation:`${m} 2s ease-in-out 0.5s infinite`}},{props:{animation:"wave"},style:{position:"relative",overflow:"hidden",WebkitMaskImage:"-webkit-radial-gradient(white, black)","&::after":{background:`linear-gradient(
                90deg,
                transparent,
                ${(a.vars||a).palette.action.hover},
                transparent
              )`,content:'""',position:"absolute",transform:"translateX(-100%)",bottom:0,left:0,right:0,top:0}}},{props:{animation:"wave"},style:p||{"&::after":{animation:`${n} 2s linear 0.5s infinite`}}}]}})),r=b.forwardRef(function(a,b){let e=(0,h.useDefaultProps)({props:a,name:"MuiSkeleton"}),{animation:f="pulse",className:g,component:i="span",height:j,style:m,variant:n="text",width:o,...p}=e,r={...e,animation:f,component:i,variant:n,hasChildren:!!p.children},s=(a=>{let{classes:b,variant:c,animation:e,hasChildren:f,width:g,height:h}=a;return(0,d.default)({root:["root",c,e,f&&"withChildren",f&&!g&&"fitContent",f&&!h&&"heightAuto"]},k,b)})(r);return(0,l.jsx)(q,{as:i,ref:b,className:(0,c.default)(s.root,g),ownerState:r,...p,style:{width:o,height:j,...m}})});a.s(["Skeleton",0,r],66148)},35992,a=>{"use strict";var b=a.i(87924),c=a.i(24089),d=a.i(19470),e=a.i(97927),f=a.i(66824),g=a.i(66148),h=a.i(74908),i=a.i(77940),j=a.i(72131),k=a.i(3900),l=a.i(95445),m=a.i(50944),n=a.i(36697);function o(){let[a,o]=(0,j.useState)([]),[p,q]=(0,j.useState)(!0),[r,s]=(0,j.useState)(null),t=(0,l.createClient)(),u=(0,m.useRouter)();(0,j.useEffect)(()=>{!async function(){try{let{data:{user:a}}=await t.auth.getUser();if(!a)throw Error("Not authenticated");let{data:b,error:c}=await t.from("profiles").select("*").neq("id",a.id).eq("is_profile_completed",!0).limit(20);if(c)throw c;let{data:d,error:e}=await t.from("connections").select("*").or(`requester_id.eq.${a.id},receiver_id.eq.${a.id}`);if(e)throw e;let f=b.map(b=>{let c=d.find(c=>c.requester_id===b.id&&c.receiver_id===a.id||c.receiver_id===b.id&&c.requester_id===a.id);return{...b,connectionStatus:c?c.status:"none"}});o(f)}catch(a){s(a.message)}finally{q(!1)}}()},[t]);let v=async b=>{try{let{data:{user:c}}=await t.auth.getUser();if(!c)return;let{error:d}=await t.from("connections").insert([{requester_id:c.id,receiver_id:b,status:"pending"}]);if(d)throw d;o(a.map(a=>a.id===b?{...a,connectionStatus:"pending"}:a))}catch(a){console.error("Error sending request:",a)}},w=a=>u.push(`/messages?user=${a}`);return r?(0,b.jsx)(f.Alert,{severity:"error",children:r}):(0,b.jsxs)(c.Box,{sx:{maxWidth:1e3,mx:"auto"},children:[(0,b.jsx)(d.Typography,{variant:"h5",fontWeight:"bold",gutterBottom:!0,color:"primary.main",children:"Discover & Connect"}),(0,b.jsx)(d.Typography,{variant:"body1",color:"text.secondary",paragraph:!0,children:"Find peers, mentors, and staff in your campus community."}),p?(0,b.jsx)(e.Grid,{container:!0,spacing:3,children:[1,2,3,4].map(a=>(0,b.jsx)(e.Grid,{size:{xs:12,md:6},children:(0,b.jsxs)(h.Card,{sx:{p:3},children:[(0,b.jsxs)(c.Box,{sx:{display:"flex",mb:2},children:[(0,b.jsx)(g.Skeleton,{variant:"circular",width:64,height:64,sx:{mr:2,flexShrink:0}}),(0,b.jsxs)(c.Box,{sx:{flexGrow:1},children:[(0,b.jsx)(g.Skeleton,{variant:"text",width:"50%",height:28}),(0,b.jsx)(g.Skeleton,{variant:"text",width:"35%"}),(0,b.jsx)(g.Skeleton,{variant:"text",width:"80%"})]})]}),(0,b.jsxs)(c.Box,{sx:{display:"flex",gap:1,mb:2},children:[(0,b.jsx)(g.Skeleton,{variant:"rounded",width:60,height:24,sx:{borderRadius:20}}),(0,b.jsx)(g.Skeleton,{variant:"rounded",width:80,height:24,sx:{borderRadius:20}})]}),(0,b.jsx)(g.Skeleton,{variant:"rounded",width:90,height:32,sx:{borderRadius:20,mt:1}})]})},a))}):(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(e.Grid,{container:!0,spacing:3,children:a.map(a=>(0,b.jsx)(e.Grid,{size:{xs:12,md:6},children:(0,b.jsx)(k.default,{user:a,connectionStatus:a.connectionStatus,onConnect:v,onMessage:w})},a.id))}),0===a.length&&(0,b.jsxs)(c.Box,{sx:{mt:6,textAlign:"center"},children:[(0,b.jsx)(d.Typography,{variant:"h6",color:"text.secondary",gutterBottom:!0,children:"No profiles on the feed yet."}),(0,b.jsx)(d.Typography,{variant:"body2",color:"text.secondary",sx:{mb:3},children:"Be the first to explore! Use Search to find specific people."}),(0,b.jsx)(i.Button,{variant:"contained",startIcon:(0,b.jsx)(n.default,{}),onClick:()=>u.push("/search"),children:"Browse All Users"})]})]})]})}a.s(["default",()=>o])}];

//# sourceMappingURL=_c2318b17._.js.map