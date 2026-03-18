import { useState, useEffect } from "react";

// ─── PALETTE ────────────────────────────────────────────────────────
const C={pine:"#1e3a1a",bark:"#5c3d1e",moss:"#3d5c2a",leaf:"#4a7c3f",sage:"#7a9e6e",gold:"#c49a3c",straw:"#e8d5a3",cream:"#f5f0e0",parchment:"#ede5cc",wicker:"#c4956a",walnut:"#2d1f0e",fog:"#b8c9a8",bloom:"#a0346a",bloomBg:"#f5dde8",red:"#c04040"};

// ─── CONSTANTS ───────────────────────────────────────────────────────
const ADMIN_PW="rooted2024";
const SC={HOME:"home",STORE:"store",CHECKOUT:"checkout",CONFIRM:"confirm",APPLY:"apply",BARTER:"barter",ADMIN:"admin",PRICING:"pricing"};
const AT={DASH:"dash",STORES:"stores",APPS:"apps",BANNED:"banned"};
const PI={home:"🏡",curbside:"🚗",market:"⛺",window:"🗓",virtual:"💻"};
const mkId=()=>"id_"+Math.random().toString(36).slice(2,8);
const FRAUD_REASONS=["Selling drop-shipped products","Misrepresenting handmade goods","Fake business identity","Fraudulent orders / chargebacks","Harassment of buyers or sellers","Repeated policy violations","Other"];

const CATS=[
  {id:"all",label:"All Makers",icon:"🌿"},{id:"herbs",label:"Herbs & Plants",icon:"🌱"},
  {id:"food",label:"Food & Preserves",icon:"🍯"},{id:"art",label:"Art & Prints",icon:"🎨"},
  {id:"fiber",label:"Crochet & Fiber",icon:"🧶"},{id:"candle",label:"Candles & Soaps",icon:"🕯️"},
  {id:"jewel",label:"Jewelry",icon:"💍"},{id:"pottery",label:"Pottery",icon:"🏺"},
  {id:"baked",label:"Baked Goods",icon:"🍞"},{id:"beauty",label:"Beauty & Wellness",icon:"💅"},
  {id:"virtual",label:"Virtual Services",icon:"💻"},
];

const TIERS={
  seedling:{label:"🌱 Seedling",price:"Free",c:C.moss,bg:"#d4e8cc",
    perks:["Store page & product listings","Barter / Trade Table access","Pickup & market scheduling","Verified maker badge"],
    locked:["Featured listing slots (2–3/mo)","🌸 Full Bloom badge","Top of category placement","Boosted barter listings","Subscription offerings","Analytics","Priority support"]},
  fullbloom:{label:"🌸 Full Bloom",price:"$9/month",c:C.bloom,bg:C.bloomBg,
    perks:["Everything in Seedling","🌸 Full Bloom badge","2–3 featured slots/month","Top of category placement","Boosted barter (top of Trade Table)","Subscription offerings","Analytics","Priority support"],
    locked:[]},
};

// ─── DATA ────────────────────────────────────────────────────────────
const STORES0=[
  {id:1,name:"Hemlock Hollow Herbs",owner:"Maya T.",tag:"Fresh Herbs & Tinctures",location:"Asheville, NC",avatar:"🌿",category:"herbs",verified:true,tier:"fullbloom",featured:true,featuredSlots:2,featuredUsed:1,flagged:false,banned:false,
   social:{instagram:"hemlockhollow",tiktok:"hemlockhollow",website:"hemlockhollow.com"},
   bio:"Maya's been talking to plants longer than she's been talking to most people — and honestly the plants give better advice. She grows everything on a mountain farm behind her house, cuts it fresh, and ships it the same morning. Pull up to her porch on a Saturday and she'll probably hand you a cup of tea while you browse.",
   products:[
     {id:"p1",name:"Fresh Basil Bundle",price:4.50,unit:"bunch",img:"🌱",type:"physical",stock:12,desc:"Cut this morning. Smells like summer walked into the room."},
     {id:"p2",name:"Lavender Tincture",price:18.00,unit:"2oz bottle",img:"💜",type:"physical",stock:6,desc:"Six weeks in grain alcohol. A few drops before bed changes everything."},
     {id:"p3",name:"Chamomile Loose Leaf",price:9.00,unit:"1oz",img:"🌼",type:"physical",stock:20,desc:"Dried at peak bloom. More apple than floral. Steep long and strong."},
     {id:"p4",name:"Wild Elderflower Syrup",price:14.00,unit:"8oz jar",img:"🫙",type:"physical",stock:8,desc:"Foraged from a secret spot. Tastes like a June afternoon."},
   ],
   subscriptionPlans:[
     {id:"s1",name:"Weekly Herb Box",price:28,freq:"weekly",desc:"Fresh cuts, bundles, maybe a tincture surprise."},
     {id:"s2",name:"Monthly Apothecary Box",price:55,freq:"monthly",desc:"Tinctures, teas, experiments. Always a hand-written note."},
   ],
   barter:[{id:"b1",offering:"Monthly Apothecary Box",seeking:"Ceramic mugs or bowls",category:"pottery",note:"Love wheel-thrown, earthy-glazed work.",boosted:true}],
   pickup:[{type:"home",label:"Porch Pickup",detail:"7 Ridgeline Rd, Asheville",hours:"Tues & Sat, 8am–12pm"},{type:"market",label:"Asheville City Market",detail:"Charlotte St — green canopy",hours:"Every Saturday, 8am–1pm"}],
   appearances:[{event:"Asheville City Market",date:"Every Saturday",time:"8am–1pm",address:"Charlotte St, Asheville, NC 28801",type:"recurring"}]},
  {id:2,name:"Sol Fruit Stand",owner:"Carlos M.",tag:"Fresh Fruit & Preserves",location:"Ojai, CA",avatar:"🍊",category:"food",verified:true,tier:"fullbloom",featured:false,featuredSlots:2,featuredUsed:0,flagged:false,banned:false,
   social:{instagram:"solfruitstand",tiktok:"",website:"solfruitstand.com"},
   bio:"Third generation on the same citrus grove. Carlos picks at 5am before it gets hot. The honor-system crate out front has been there for thirty years.",
   products:[
     {id:"p5",name:"Navel Orange Box",price:22.00,unit:"5 lbs",img:"🍊",type:"physical",stock:15,desc:"Picked to order. If you've only had grocery store navels, buckle up."},
     {id:"p6",name:"Meyer Lemon Honey",price:14.00,unit:"8oz jar",img:"🍯",type:"physical",stock:9,desc:"Raw honey stirred with fresh zest while still warm."},
     {id:"p7",name:"Blood Orange Jam",price:11.00,unit:"jar",img:"🫙",type:"physical",stock:18,desc:"Low sugar so the fruit speaks. Deep ruby, almost wine-like."},
   ],
   subscriptionPlans:[{id:"s3",name:"Bi-Weekly Grove Box",price:38,freq:"bi-weekly",desc:"What's coming off the trees. Always fresh, always different."}],
   barter:[{id:"b3",offering:"Bi-weekly citrus box (1 month)",seeking:"Nail art session",category:"beauty",note:"Open to nails, brows, lashes.",boosted:true}],
   pickup:[{type:"home",label:"Roadside Stand",detail:"142 Ojai Ave — honor system crate",hours:"Daily, dawn to dusk"}],
   appearances:[{event:"Ojai Certified Farmers Market",date:"Every Sunday",time:"9am–1pm",address:"300 E Matilija St, Ojai, CA 93023",type:"recurring"}]},
  {id:3,name:"Threadbare & Wonderful",owner:"Kezia L.",tag:"Crochet & Fiber Arts",location:"New Orleans, LA",avatar:"🧶",category:"fiber",verified:true,tier:"seedling",featured:false,featuredSlots:0,featuredUsed:0,flagged:false,banned:false,
   social:{instagram:"threadbarewonderful",tiktok:"threadbareknits",website:""},
   bio:"Kezia crochets while watching movies, during long phone calls, and apparently in her sleep based on how much she produces. Every piece is one-of-a-kind.",
   products:[
     {id:"p17",name:"Chunky Market Tote",price:42.00,unit:"each",img:"👜",type:"physical",stock:5,desc:"Thick cotton yarn, open weave, holds more than it looks like."},
     {id:"p18",name:"Plant Hanger Set (3)",price:28.00,unit:"set",img:"🪴",type:"physical",stock:8,desc:"Natural jute, knotted by hand. Your pothos will love it."},
     {id:"p19",name:"Custom Beret",price:55.00,unit:"made to order",img:"🎨",type:"physical",stock:99,desc:"Pick your color, she'll make it. Two weeks. Worth every day."},
   ],
   subscriptionPlans:[],
   barter:[{id:"b8",offering:"Custom crochet tote",seeking:"Herb bundle or plant kit",category:"herbs",note:"Would love something for stress or sleep.",boosted:false}],
   pickup:[{type:"home",label:"Studio Pickup",detail:"3rd Ward — text first",hours:"By appointment"},{type:"market",label:"Crescent City Farmers Market",detail:"700 Magazine St",hours:"Every Saturday, 8am–12pm"}],
   appearances:[{event:"Crescent City Farmers Market",date:"Every Saturday",time:"8am–12pm",address:"700 Magazine St, New Orleans, LA 70130",type:"recurring"}]},
  {id:4,name:"Slow Burn Studio",owner:"Deja R.",tag:"Hand-Poured Candles & Botanical Soaps",location:"Chicago, IL",avatar:"🕯️",category:"candle",verified:true,tier:"fullbloom",featured:true,featuredSlots:2,featuredUsed:1,flagged:false,banned:false,
   social:{instagram:"slowburnstudio",tiktok:"slowburnstudio",website:"slowburnstudio.co"},
   bio:"Deja started making candles during a rough winter and never stopped. Everything hand-poured in small batches with coconut-soy wax and real botanicals. She names every scent herself and the names are very good.",
   products:[
     {id:"p21",name:"After the Rain Candle",price:22.00,unit:"8oz",img:"🕯️",type:"physical",stock:10,desc:"Petrichor, green fig, cedar bark. That 10-minute window after a summer storm."},
     {id:"p22",name:"Calendula + Oat Soap",price:9.00,unit:"bar",img:"🌼",type:"physical",stock:18,desc:"Real calendula petals. Gentle for sensitive skin. You'll buy four at once."},
     {id:"p23",name:"Grandma's Kitchen Candle",price:22.00,unit:"8oz",img:"✨",type:"physical",stock:7,desc:"Vanilla, brown butter, cardamom. You know exactly what this smells like."},
   ],
   subscriptionPlans:[{id:"s4",name:"Monthly Scent Drop",price:32,freq:"monthly",desc:"One new-release candle and a seasonal soap bar monthly."}],
   barter:[{id:"b10",offering:"Candle + soap gift set",seeking:"Fresh bread or baked goods",category:"baked",note:"Sourdough obsessed. Would trade a candle for a loaf every week.",boosted:true}],
   pickup:[{type:"home",label:"Basement Studio",detail:"Pilsen — she'll text the address",hours:"Fri–Sat, 12–5pm"}],
   appearances:[{event:"Pilsen Community Market",date:"Every other Sunday",time:"10am–3pm",address:"18th St, Chicago, IL 60608",type:"recurring"}]},
  {id:5,name:"Glow Up Gardens",owner:"Simone A.",tag:"Natural Nail Art & Botanical Beauty",location:"Houston, TX",avatar:"💅",category:"beauty",verified:true,tier:"fullbloom",featured:true,featuredSlots:2,featuredUsed:2,flagged:false,banned:false,
   social:{instagram:"glowupgardens",tiktok:"glowupgardens",website:""},
   bio:"Simone does nail art in her home studio and treats every set like a tiny canvas. Non-toxic polishes, hand-painted press-ons, floral designs she was doing before it was everywhere. Book early.",
   products:[
     {id:"p44",name:"Full Nail Art Set",price:65.00,unit:"session",img:"💅",type:"virtual",stock:99,desc:"Custom nail art, your design. Usually 90 mins in her home studio."},
     {id:"p45",name:"Hand-Painted Press-Ons",price:38.00,unit:"set of 10",img:"🌸",type:"physical",stock:12,desc:"Painted to order in your size and palette. Ships in 5–7 days."},
     {id:"p46",name:"Brow Shape & Tint",price:45.00,unit:"session",img:"✨",type:"virtual",stock:99,desc:"Threading or wax plus tint. 45 mins. People rebook immediately."},
     {id:"p47",name:"Lash Lift & Tint",price:75.00,unit:"session",img:"👁️",type:"virtual",stock:99,desc:"8–10 weeks of lifted, tinted lashes. No maintenance needed."},
   ],
   subscriptionPlans:[],
   barter:[{id:"b18",offering:"Full nail art session",seeking:"Herb bundle or wellness kit",category:"herbs",note:"Interested in stress or sleep support.",boosted:true}],
   pickup:[{type:"home",label:"Home Studio",detail:"Third Ward — address sent after booking",hours:"Tues–Sat, by appointment"}],
   appearances:[{event:"Third Ward Sunday Market",date:"Every Sunday",time:"11am–4pm",address:"Emancipation Ave, Houston, TX 77004",type:"recurring"}]},
  {id:6,name:"Crown & Flourish",owner:"Yara M.",tag:"Natural Hair Styling & Protective Styles",location:"Baltimore, MD",avatar:"👑",category:"beauty",verified:true,tier:"fullbloom",featured:false,featuredSlots:2,featuredUsed:0,flagged:false,banned:false,
   social:{instagram:"crownandflourish",tiktok:"crownandflourish",website:"crownandflourish.com"},
   bio:"Yara does hair out of her home salon — locs, braids, twists, protective styles she's been perfecting for over a decade. Plant-based products only. No rushing, no upsells. Just good work in a calm space.",
   products:[
     {id:"p48",name:"Starter Locs",price:180.00,unit:"session",img:"👑",type:"virtual",stock:99,desc:"Consultation first, then install. She'll walk you through everything."},
     {id:"p49",name:"Loc Retwist & Style",price:80.00,unit:"session",img:"🌿",type:"virtual",stock:99,desc:"Retwist plus a finished style. 2–3 hours. She'll make it worth it."},
     {id:"p50",name:"Protective Style Braids",price:120.00,unit:"session",img:"✨",type:"virtual",stock:99,desc:"Box braids, knotless, twists — whatever works for your hair."},
     {id:"p51",name:"Scalp Treatment + Wash",price:55.00,unit:"session",img:"💆",type:"virtual",stock:99,desc:"Plant-based scalp oil, wash, condition, and a set. Great reset."},
   ],
   subscriptionPlans:[],
   barter:[{id:"b20",offering:"Scalp treatment + wash",seeking:"Pottery mug or bowl",category:"pottery",note:"My morning coffee deserves a good mug.",boosted:true}],
   pickup:[{type:"home",label:"Home Salon",detail:"Reservoir Hill, Baltimore — address after booking",hours:"Wed–Sun, by appointment"}],
   appearances:[{event:"Baltimore Farmers Market",date:"Every Sunday",time:"7am–12pm",address:"Saratoga St, Baltimore, MD 21202",type:"recurring"}]},
  {id:7,name:"Root to Rise Wellness",owner:"Camille T.",tag:"Virtual Wellness Coaching",location:"Remote / Denver, CO",avatar:"🌻",category:"virtual",verified:true,tier:"fullbloom",featured:false,featuredSlots:2,featuredUsed:0,flagged:false,banned:false,
   social:{instagram:"roottorisewell",tiktok:"",website:"roottorisewellness.com"},
   bio:"Camille is a certified wellness coach doing everything online. 1:1 coaching, breathwork, seasonal planning. She doesn't sell programs — she builds one around your actual life.",
   products:[
     {id:"p52",name:"1:1 Wellness Coaching",price:90.00,unit:"60 min",img:"🌻",type:"virtual",stock:99,desc:"Where you are, where you want to be, what's in the way. Real plan."},
     {id:"p53",name:"Seasonal Wellness Reset",price:145.00,unit:"3 sessions",img:"🌿",type:"virtual",stock:99,desc:"Three sessions over 6 weeks. Structure without a year-long commitment."},
     {id:"p54",name:"Group Breathwork Session",price:22.00,unit:"per session",img:"💨",type:"virtual",stock:99,desc:"45-min online breathwork, twice monthly. Calming, grounding, life-changing."},
   ],
   subscriptionPlans:[{id:"s5",name:"Monthly Coaching Membership",price:85,freq:"monthly",desc:"Two 30-min check-ins plus all group breathwork sessions."}],
   barter:[{id:"b22",offering:"1:1 Wellness Coaching session",seeking:"Handmade jewelry",category:"jewel",note:"Love intentional stone work.",boosted:true}],
   pickup:[{type:"virtual",label:"Video Call",detail:"Zoom or your platform — link sent after booking",hours:"By appointment"}],
   appearances:[{event:"Denver Wellness Festival",date:"May 23–24, 2026",time:"10am–6pm",address:"City Park, Denver, CO 80205",type:"upcoming"}]},
  {id:8,name:"Good Ground Ceramics",owner:"Priya S.",tag:"Wheel-Thrown Pottery",location:"Brooklyn, NY",avatar:"🏺",category:"pottery",verified:true,tier:"seedling",featured:false,featuredSlots:0,featuredUsed:0,flagged:false,banned:false,
   social:{instagram:"goodgroundceramics",tiktok:"goodgroundceramics",website:""},
   bio:"Priya throws everything on the wheel in her Brooklyn studio and carries it to the market herself. Six years full-time, still gets excited about a good glaze. Come early — her table empties fast.",
   products:[
     {id:"p32",name:"Morning Mug",price:38.00,unit:"each",img:"☕",type:"physical",stock:8,desc:"Wheel-thrown, matte speckled glaze, 12oz. The mug you'll have for twenty years."},
     {id:"p33",name:"Bud Vase",price:26.00,unit:"each",img:"🌸",type:"physical",stock:12,desc:"Slim neck, wide base, different every time. Perfect on a windowsill."},
     {id:"p34",name:"Pasta Bowl Set (2)",price:72.00,unit:"set",img:"🍝",type:"physical",stock:4,desc:"Wide, shallow, the exact right depth. Matching but not identical."},
     {id:"p35",name:"Pinch Pot Planter",price:32.00,unit:"each",img:"🪴",type:"physical",stock:9,desc:"Small enough for your desk succulent. Wobbly character that makes it charming."},
   ],
   subscriptionPlans:[],
   barter:[{id:"b13",offering:"2 handmade mugs",seeking:"Candles or botanical soaps",category:"candle",note:"Obsessed with Deja's scents.",boosted:false}],
   pickup:[{type:"home",label:"Studio Pickup",detail:"Bushwick, Brooklyn",hours:"Sat afternoons, 2–6pm"}],
   appearances:[{event:"Brooklyn Flea – DUMBO",date:"Every Sat & Sun",time:"10am–5pm",address:"80 Pearl St, Brooklyn, NY 11201",type:"recurring"}]},
  {id:9,name:"Sunday Loaf",owner:"Rosie T.",tag:"Cottage Bakery & Seasonal Sweets",location:"Austin, TX",avatar:"🍞",category:"baked",verified:true,tier:"fullbloom",featured:false,featuredSlots:2,featuredUsed:0,flagged:false,banned:false,
   social:{instagram:"sundayloafatx",tiktok:"sundayloaf",website:""},
   bio:"Rosie bakes out of her licensed home kitchen starting at 4am on Saturdays. Sourdough, seasonal galettes, whatever fruit is happening that week. She sells out every time. Subscribe or follow her.",
   products:[
     {id:"p36",name:"Country Sourdough",price:12.00,unit:"loaf",img:"🍞",type:"physical",stock:10,desc:"72-hour cold ferment, Dutch oven baked. The bread you eat half of on the drive home."},
     {id:"p37",name:"Seasonal Galette",price:16.00,unit:"each",img:"🥧",type:"physical",stock:6,desc:"Whatever fruit is best right now, folded into a rough pastry crust."},
     {id:"p38",name:"Brown Butter Shortbread",price:10.00,unit:"box of 6",img:"🍪",type:"physical",stock:14,desc:"Buttery, slightly salty, melt-in-your-mouth. People buy multiple boxes."},
   ],
   subscriptionPlans:[{id:"s6",name:"Weekly Bread Box",price:30,freq:"weekly",desc:"One loaf plus a sweet each week — reserved and ready."}],
   barter:[{id:"b15",offering:"Weekly sourdough loaf (4 weeks)",seeking:"Pottery mug or bowl",category:"pottery",note:"Been eyeing Priya's speckled mugs for months.",boosted:true}],
   pickup:[{type:"home",label:"Porch Pickup",detail:"East Austin — address sent when you subscribe",hours:"Saturday, 8–11am"}],
   appearances:[{event:"SFC Farmers Market",date:"Every Saturday",time:"9am–1pm",address:"Republic Square Park, Austin, TX 78701",type:"recurring"}]},
  {id:10,name:"Mireille Makes",owner:"Mireille D.",tag:"Original Art, Prints & Illustration",location:"Philadelphia, PA",avatar:"🎨",category:"art",verified:true,tier:"seedling",featured:false,featuredSlots:0,featuredUsed:0,flagged:false,banned:false,
   social:{instagram:"mireillemakes",tiktok:"",website:"mireillemakes.com"},
   bio:"Mireille paints botanicals, street scenes, and things that catch her eye on morning walks — then turns them into affordable prints. She'll chat with you for 20 minutes about color theory if you let her. Best 20 minutes of your week.",
   products:[
     {id:"p40",name:"Botanical Giclée Print",price:35.00,unit:"8x10",img:"🖼️",type:"physical",stock:15,desc:"Archival ink, heavy cotton rag paper. Color holds beautifully. Ready to frame."},
     {id:"p41",name:"Original Watercolor",price:180.00,unit:"original",img:"🎨",type:"physical",stock:4,desc:"One of a kind. Signed, dated, comes with a note about what she was thinking."},
     {id:"p42",name:"Risograph Zine",price:14.00,unit:"zine",img:"📖",type:"physical",stock:20,desc:"Seasonal botanicals, Riso-printed in two colors. The kind of thing you keep."},
     {id:"p43",name:"Custom Pet Portrait",price:95.00,unit:"8x10 print",img:"🐾",type:"physical",stock:99,desc:"Send her a photo. She paints them. People cry. In a good way."},
   ],
   subscriptionPlans:[],
   barter:[{id:"b17",offering:"8x10 botanical print",seeking:"Fermented goods or infused oil",category:"food",note:"Art for ferments — happily.",boosted:false}],
   pickup:[{type:"home",label:"Studio Pickup",detail:"West Philly — address sent when you order",hours:"Weekdays, by appointment"}],
   appearances:[{event:"Clark Park Farmers Market",date:"Every Saturday",time:"10am–2pm",address:"43rd & Baltimore Ave, Philadelphia, PA 19143",type:"recurring"}]},
];

const APPS0=[
  {id:"a1",name:"Jade R.",biz:"The Honey Hive",location:"Memphis, TN",type:"Honey & bee products",pickup:"Home stand",description:"Third-generation beekeeper. 40 hives. Raw wildflower honey, beeswax candles and lip balms.",instagram:"@thehoneyhive_tn",tiktok:"",website:"",status:"pending",date:"March 14, 2026"},
  {id:"a2",name:"Dara M.",biz:"Pressed & Loved",location:"Austin, TX",type:"Art, prints & illustration",pickup:"Farmers market",description:"I press and frame botanicals I forage and grow. Each piece is one of a kind.",instagram:"@pressedandloved",tiktok:"",website:"",status:"pending",date:"March 15, 2026"},
  {id:"a3",name:"Olu F.",biz:"Olu's Pottery",location:"Chicago, IL",type:"Pottery & ceramics",pickup:"Home studio",description:"Self-taught potter, 7 years. Functional ware fired in my garage kiln.",instagram:"@oluspottery",tiktok:"",website:"",status:"approved",date:"March 10, 2026"},
  {id:"a4",name:"Sam K.",biz:"Wildroot Weaves",location:"Santa Fe, NM",type:"Fiber arts",pickup:"Market booth",description:"Natural dye fiber artist. I grow my own dye plants and weave wall hangings.",instagram:"@wildrootweaves",tiktok:"",website:"wildrootweaves.com",status:"pending",date:"March 16, 2026"},
];

// ─── SHARED SMALL COMPONENTS ─────────────────────────────────────────
const TBadge = ({ tier, sz=12 }) => tier==="fullbloom"
  ? <span style={{display:"inline-flex",alignItems:"center",gap:3,background:C.bloomBg,color:C.bloom,fontSize:sz,padding:"3px 8px",borderRadius:1,fontFamily:"Crimson Text,serif",fontWeight:600}}>🌸 Full Bloom</span>
  : <span style={{display:"inline-flex",alignItems:"center",gap:3,background:"#d4e8cc",color:C.moss,fontSize:sz,padding:"3px 8px",borderRadius:1,fontFamily:"Crimson Text,serif"}}>🌱 Seedling</span>;

const SBar = ({ s }) => {
  if (!s) return null;
  const lx = [
    s.instagram && {ic:"📸", url:`https://instagram.com/${s.instagram}`, h:`@${s.instagram}`},
    s.tiktok && {ic:"🎵", url:`https://tiktok.com/@${s.tiktok}`, h:`@${s.tiktok}`},
    s.website && {ic:"🌐", url:s.website.startsWith("http")?s.website:`https://${s.website}`, h:s.website},
  ].filter(Boolean);
  if (!lx.length) return null;
  return (
    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:12}}>
      {lx.map(l => (
        <a key={l.h} href={l.url} target="_blank" rel="noopener noreferrer"
          style={{display:"inline-flex",alignItems:"center",gap:5,background:C.parchment,border:`1px solid ${C.straw}`,borderRadius:2,padding:"5px 11px",fontSize:13,fontFamily:"Crimson Text,serif",color:C.bark,textDecoration:"none"}}>
          {l.ic} {l.h}
        </a>
      ))}
    </div>
  );
};

const LD = () => <div style={{textAlign:"center",padding:"10px 0",fontSize:15,letterSpacing:10,opacity:.4,color:C.leaf}}>🌿 ✦ 🌿</div>;

const Branch = ({ side="left" }) => (
  <div style={{position:"absolute",top:0,[side]:0,width:110,height:"100%",pointerEvents:"none",overflow:"hidden",opacity:.11}}>
    <svg width="110" height="400" viewBox="0 0 110 400" fill="none">
      {side==="left" ? (
        <>
          <path d="M10 400 Q30 300 20 200 Q10 100 40 0" stroke={C.leaf} strokeWidth="2.5" fill="none"/>
          <path d="M20 300 Q55 280 72 248" stroke={C.leaf} strokeWidth="2" fill="none"/>
          <ellipse cx="78" cy="243" rx="16" ry="9" fill={C.moss} transform="rotate(-30 78 243)"/>
          <ellipse cx="68" cy="163" rx="13" ry="8" fill={C.leaf} transform="rotate(-20 68 163)"/>
        </>
      ) : (
        <>
          <path d="M100 400 Q80 300 90 200 Q100 100 70 0" stroke={C.leaf} strokeWidth="2.5" fill="none"/>
          <path d="M90 300 Q55 280 38 248" stroke={C.leaf} strokeWidth="2" fill="none"/>
          <ellipse cx="32" cy="243" rx="16" ry="9" fill={C.moss} transform="rotate(30 32 243)"/>
          <ellipse cx="42" cy="163" rx="13" ry="8" fill={C.leaf} transform="rotate(20 42 163)"/>
        </>
      )}
    </svg>
  </div>
);

const HP = () => (
  <div style={{position:"absolute",top:0,left:0,right:0,height:100,pointerEvents:"none",overflow:"hidden",zIndex:1}}>
    {[6,17,28,39,50,61,72,83,93].map((pct,i) => (
      <div key={i} style={{position:"absolute",left:`${pct}%`,top:0,display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div style={{width:1,height:16+i%4*7,background:`${C.bark}66`}}/>
        <div style={{fontSize:20+i%3*5,lineHeight:1,animation:`sw${i%3} ${3+i%2}s ease-in-out infinite`}}>
          {["🪴","🌿","🍃","🪴","🌱","🍃","🌿","🪴","🍃"][i]}
        </div>
      </div>
    ))}
  </div>
);

const FL = ({ label, mb=14, children }) => (
  <div style={{marginBottom:mb}}>
    <label style={{display:"block",fontFamily:"Crimson Text,serif",fontSize:12,color:C.bark,marginBottom:5,letterSpacing:".07em",textTransform:"uppercase"}}>{label}</label>
    {children}
  </div>
);
const FI = ({ style:st, ...p }) => <input {...p} style={{width:"100%",padding:"9px 12px",border:`1px solid ${C.straw}`,borderRadius:2,fontFamily:"Crimson Text,serif",fontSize:15,background:C.cream,color:C.walnut,outline:"none",...st}}/>;
const FSel = ({ children, style:st, ...p }) => <select {...p} style={{width:"100%",padding:"9px 12px",border:`1px solid ${C.straw}`,borderRadius:2,fontFamily:"Crimson Text,serif",fontSize:15,background:C.cream,color:C.walnut,outline:"none",cursor:"pointer",...st}}>{children}</select>;
const FTA = ({ style:st, ...p }) => <textarea {...p} style={{width:"100%",padding:"9px 12px",border:`1px solid ${C.straw}`,borderRadius:2,fontFamily:"Crimson Text,serif",fontSize:15,background:C.cream,color:C.walnut,outline:"none",resize:"vertical",minHeight:80,...st}}/>;

// ─── CSS ─────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=IM+Fell+English:ital@0;1&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#f5f0e0;}
.pf{font-family:'Playfair Display',Georgia,serif;}
.cr{font-family:'Crimson Text',Georgia,serif;}
.fell{font-family:'IM Fell English',Georgia,serif;}
.wood{background-color:#5c3d1e;background-image:repeating-linear-gradient(90deg,transparent,transparent 2px,rgba(255,255,255,.03) 2px,rgba(255,255,255,.03) 4px);}
.btn{border:none;cursor:pointer;transition:all .18s;font-family:'Crimson Text',serif;}
.bp{background:#1e3a1a;color:#f5f0e0;padding:11px 24px;border-radius:2px;font-size:15px;}.bp:hover{background:#3d5c2a;}
.bg{background:#c49a3c;color:#2d1f0e;padding:11px 22px;border-radius:2px;font-size:15px;font-weight:600;}.bg:hover{background:#b8892e;}
.bbl{background:#a0346a;color:#fff;padding:11px 22px;border-radius:2px;font-size:15px;}.bbl:hover{background:#882d58;}
.brd{background:#c04040;color:#fff;padding:8px 14px;border-radius:2px;font-size:13px;}.brd:hover{background:#a03030;}
.bo{background:transparent;border:1.5px solid #1e3a1a;color:#1e3a1a;padding:10px 20px;border-radius:2px;font-size:15px;font-family:'Crimson Text',serif;cursor:pointer;transition:all .18s;}.bo:hover{background:#1e3a1a;color:#f5f0e0;}
.bsm{padding:7px 14px !important;font-size:13px !important;}
.card{background:#f5f0e0;border:1px solid #e8d5a3;border-radius:3px;transition:box-shadow .25s,transform .25s;cursor:pointer;position:relative;overflow:hidden;}
.card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#3d5c2a,#4a7c3f,#7a9e6e);}
.card:hover{box-shadow:0 10px 36px rgba(30,58,26,.18);transform:translateY(-4px);}
.feat::before{background:linear-gradient(90deg,#c49a3c,#c4956a,#c49a3c)!important;}
.tab{padding:10px 18px;border:none;background:transparent;cursor:pointer;font-family:'Crimson Text',serif;font-size:16px;color:#7a9e6e;border-bottom:2px solid transparent;transition:all .18s;white-space:nowrap;}
.tab.on{color:#1e3a1a;border-bottom-color:#4a7c3f;}
.atab{padding:10px 18px;border:none;background:transparent;cursor:pointer;font-family:'Crimson Text',serif;font-size:14px;color:#b8c9a8;border-left:3px solid transparent;display:block;width:100%;text-align:left;transition:all .15s;}
.atab.on{color:#f5f0e0;border-left-color:#4a7c3f;background:rgba(255,255,255,.08);}
.bdg{display:inline-flex;align-items:center;gap:3px;font-size:12px;padding:3px 8px;border-radius:1px;font-family:'Crimson Text',serif;}
.bl{background:#d4e8cc;color:#1e4a18;}.bk{background:#f0e0cc;color:#6b3a10;}.bm{background:#d0dfc8;color:#2d4a20;}.bgd{background:#f5e8c0;color:#7a5a10;}.bred{background:#fdeaea;color:#a03030;}
.cpill{padding:7px 14px;border-radius:20px;border:1.5px solid #e8d5a3;background:#f5f0e0;cursor:pointer;font-family:'Crimson Text',serif;font-size:14px;color:#5c3d1e;transition:all .18s;white-space:nowrap;display:inline-flex;align-items:center;gap:5px;}
.cpill:hover{border-color:#4a7c3f;}.cpill.on{background:#1e3a1a;color:#f5f0e0;border-color:#1e3a1a;}
.qc{display:inline-flex;align-items:center;border:1px solid #e8d5a3;border-radius:2px;overflow:hidden;}
.qb{background:#ede5cc;border:none;width:30px;height:30px;cursor:pointer;font-size:15px;color:#5c3d1e;}.qb:hover{background:#e8d5a3;}
.qn{width:36px;text-align:center;font-family:'Crimson Text',serif;font-size:15px;background:#f5f0e0;border:none;border-left:1px solid #e8d5a3;border-right:1px solid #e8d5a3;height:30px;line-height:30px;}
.drawer{position:fixed;right:0;top:0;bottom:0;width:360px;background:#f5f0e0;border-left:1px solid #e8d5a3;z-index:100;display:flex;flex-direction:column;box-shadow:-12px 0 40px rgba(30,58,26,.15);}
.ov{position:fixed;inset:0;background:rgba(20,35,15,.4);z-index:99;}
.mov{position:fixed;inset:0;background:rgba(20,35,15,.55);z-index:110;display:flex;align-items:center;justify-content:center;padding:20px;}
.modal{background:#f5f0e0;border:1px solid #e8d5a3;border-radius:4px;padding:26px;max-width:520px;width:100%;position:relative;max-height:92vh;overflow-y:auto;}
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1e3a1a;color:#f5f0e0;padding:12px 24px;border-radius:2px;font-family:'Crimson Text',serif;font-size:15px;z-index:200;white-space:nowrap;box-shadow:0 4px 20px rgba(0,0,0,.3);animation:fup .3s ease;}
@keyframes fup{from{opacity:0;transform:translateX(-50%) translateY(10px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}
@keyframes sw0{0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}}
@keyframes sw1{0%,100%{transform:rotate(-2deg);}50%{transform:rotate(4deg);}}
@keyframes sw2{0%,100%{transform:rotate(2deg);}50%{transform:rotate(-3deg);}}
@keyframes swav{0%,100%{transform:rotate(-1.5deg);}50%{transform:rotate(1.5deg);}}
.swav{animation:swav 4s ease-in-out infinite;}
.pc{border:1px solid #e8d5a3;border-radius:3px;padding:13px 15px;margin-bottom:10px;background:#f5f0e0;display:flex;gap:12px;align-items:flex-start;}
.ac{background:#ede5cc;border:1px solid #e8d5a3;border-radius:3px;padding:13px 17px;margin-bottom:10px;display:flex;gap:12px;align-items:flex-start;}
.bc{background:#f5f0e0;border:1px solid #e8d5a3;border-radius:3px;padding:16px 18px;position:relative;overflow:hidden;margin-bottom:14px;}
.bc::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#c49a3c,#c4956a,#c49a3c);}
.aw{display:grid;grid-template-columns:185px 1fr;min-height:calc(100vh - 62px);}
.asb{background:#2d1f0e;padding:14px 0;}
.sc{background:#ede5cc;border:1px solid #e8d5a3;border-radius:3px;padding:16px 20px;text-align:center;}
input[type=radio]{accent-color:#4a7c3f;}
::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:#ede5cc;}::-webkit-scrollbar-thumb{background:#7a9e6e;border-radius:3px;}
`;

// ════════════════════════════════════════════════════════════════════
// PAGE COMPONENTS (defined outside App for proper React structure)
// ════════════════════════════════════════════════════════════════════

// ── PRICING PAGE ─────────────────────────────────────────────────────
function PricingPage({ goHome, goApply }) {
  return (
    <div style={{maxWidth:800,margin:"0 auto",padding:"56px 24px"}}>
      <button onClick={goHome} className="btn cr" style={{color:C.sage,marginBottom:28,fontSize:15,background:"none",padding:0}}>← Back</button>
      <div style={{textAlign:"center",marginBottom:40}}>
        <div style={{fontSize:40,marginBottom:12}}>🌱</div>
        <h1 className="pf" style={{fontSize:36,color:C.pine,marginBottom:10}}>Seller Plans</h1>
        <p className="cr" style={{fontSize:17,color:C.bark,maxWidth:460,margin:"0 auto",lineHeight:1.8}}>A $25 one-time application fee keeps the market quality high. After that, grow at your own pace.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,maxWidth:680,margin:"0 auto 40px"}}>
        {Object.entries(TIERS).map(([key,t]) => (
          <div key={key} style={{borderRadius:4,overflow:"hidden",border:`2px solid ${key==="fullbloom"?C.bloom:C.straw}`}}>
            <div style={{background:t.bg,padding:"22px 22px 14px",textAlign:"center"}}>
              <div className="pf" style={{fontSize:22,color:t.c,fontWeight:700,marginBottom:4}}>{t.label}</div>
              <div className="pf" style={{fontSize:26,color:t.c}}>{t.price}</div>
              <div className="cr" style={{fontSize:12,color:t.c,opacity:.8}}>after $25 application fee</div>
            </div>
            <div style={{padding:"18px 20px",background:C.cream}}>
              {t.perks.map(p => <div key={p} className="cr" style={{fontSize:14,color:C.pine,padding:"4px 0",display:"flex",alignItems:"center",gap:7}}>✓ {p}</div>)}
              {t.locked.length > 0 && (
                <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${C.straw}`}}>
                  {t.locked.map(p => <div key={p} className="cr" style={{fontSize:13,color:C.sage,padding:"3px 0",display:"flex",alignItems:"center",gap:7,opacity:.7}}>✗ {p}</div>)}
                </div>
              )}
            </div>
            <div style={{padding:"0 20px 20px",background:C.cream}}>
              <button className="btn bp" style={{width:"100%",fontSize:15,padding:11}} onClick={goApply}>Apply — $25</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{background:C.parchment,border:`1px solid ${C.straw}`,borderRadius:3,padding:"22px 28px",maxWidth:680,margin:"0 auto",textAlign:"center"}}>
        <h3 className="pf" style={{fontSize:18,color:C.pine,marginBottom:8}}>Plus 2% on every sale</h3>
        <p className="cr" style={{fontSize:15,color:C.bark,lineHeight:1.8}}>We take a small 2% transaction fee via Stripe. You keep 98%. Buyers never pay extra.</p>
      </div>
    </div>
  );
}

// ── APPLY PAGE ────────────────────────────────────────────────────────
function ApplyPage({ goHome, onSubmit }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({name:"",biz:"",location:"",type:"",pickup:"",description:"",instagram:"",tiktok:"",website:""});
  const upd = (k,v) => setForm(p => ({...p,[k]:v}));
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");

  if (step === 3) return (
    <div style={{maxWidth:500,margin:"80px auto",padding:"0 24px",textAlign:"center"}}>
      <div style={{fontSize:52,marginBottom:16}}>🌱</div>
      <h2 className="pf" style={{fontSize:30,color:C.pine,marginBottom:12}}>Application submitted!</h2>
      <p className="cr" style={{fontSize:17,color:C.bark,lineHeight:1.8,marginBottom:8}}>A real human reads every application — usually within a week. We'll be in touch.</p>
      <p className="cr" style={{fontSize:14,color:C.sage,marginBottom:32}}>Your $25 application fee has been received. Refunded if not approved.</p>
      <button className="btn bp" onClick={goHome}>Back to the Market</button>
    </div>
  );

  if (step === 2) return (
    <div style={{maxWidth:560,margin:"0 auto",padding:"48px 24px"}}>
      <button onClick={()=>setStep(1)} className="btn cr" style={{color:C.sage,marginBottom:24,fontSize:15,background:"none",padding:0}}>← Back</button>
      <h2 className="pf" style={{fontSize:28,color:C.pine,marginBottom:6}}>Application fee — $25</h2>
      <p className="cr" style={{fontSize:15,color:C.bark,marginBottom:22,lineHeight:1.8}}>One-time fee to keep Rooted quality high. Refunded if you're not approved.</p>
      <div style={{background:C.parchment,border:`1px solid ${C.straw}`,borderRadius:3,padding:"16px 20px",marginBottom:22}}>
        <div className="cr" style={{fontSize:15,color:C.bark,marginBottom:3}}>Applying as: <strong>{form.biz}</strong></div>
        <div className="cr" style={{fontSize:14,color:C.bark}}>Owner: {form.name} · {form.location}</div>
      </div>
      <form onSubmit={e=>{e.preventDefault();onSubmit(form);setStep(3);}}>
        <FL label="Card Number" mb={14}><FI required placeholder="•••• •••• •••• ••••" value={card} onChange={e=>setCard(e.target.value)} maxLength={19}/></FL>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:18}}>
          <FL label="Expiry" mb={0}><FI required placeholder="MM / YY" value={exp} onChange={e=>setExp(e.target.value)}/></FL>
          <FL label="CVC" mb={0}><FI required placeholder="•••" value={cvc} onChange={e=>setCvc(e.target.value)} maxLength={4}/></FL>
        </div>
        <div style={{background:"#eef5e8",border:`1px solid ${C.fog}`,borderRadius:3,padding:"11px 14px",marginBottom:18}}>
          <p className="cr" style={{fontSize:13,color:C.moss}}>🔒 Payments processed securely through Stripe.</p>
        </div>
        <button type="submit" className="btn bp" style={{width:"100%",padding:13,fontSize:16}}>Pay $25 & Submit Application</button>
      </form>
    </div>
  );

  return (
    <div style={{maxWidth:580,margin:"0 auto",padding:"48px 24px"}}>
      <button onClick={goHome} className="btn cr" style={{color:C.sage,marginBottom:24,fontSize:15,background:"none",padding:0}}>← Back</button>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{fontSize:36,marginBottom:10}}>🌿</div>
        <h1 className="pf" style={{fontSize:32,color:C.pine,marginBottom:10}}>Claim your spot at the market</h1>
        <p className="cr" style={{fontSize:16,color:C.bark,lineHeight:1.8,maxWidth:460,margin:"0 auto"}}>Front-yard stand, home studio, virtual practice — if you made it yourself and real people want it, you belong here.</p>
      </div>
      <LD/>
      <form style={{marginTop:24}} onSubmit={e=>{e.preventDefault();setStep(2);}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
          <FL label="Your name" mb={0}><FI required placeholder="What do people call you?" value={form.name} onChange={e=>upd("name",e.target.value)}/></FL>
          <FL label="Business name" mb={0}><FI required placeholder="Name on your jars/tags/signs" value={form.biz} onChange={e=>upd("biz",e.target.value)}/></FL>
        </div>
        <FL label="City & state" mb={14}><FI required placeholder="e.g. Portland, OR" value={form.location} onChange={e=>upd("location",e.target.value)}/></FL>
        <FL label="What do you make or offer?" mb={14}>
          <FSel required value={form.type} onChange={e=>upd("type",e.target.value)}>
            <option value="">Choose the closest fit</option>
            {["Fresh herbs, plants & garden produce","Fresh fruit & vegetables","Ferments, preserves & pantry goods","Candles & botanical soaps","Crochet, knitting & fiber arts","Jewelry & metalwork","Pottery & ceramics","Art, prints & illustration","Baked goods & cottage food","Nail art & beauty services","Natural hair styling","Virtual wellness or coaching","Plant medicine & herbalism","Something else I make myself"].map(o=><option key={o}>{o}</option>)}
          </FSel>
        </FL>
        <FL label="How do you currently sell?" mb={14}>
          <FSel required value={form.pickup} onChange={e=>upd("pickup",e.target.value)}>
            <option value="">Select your setup</option>
            {["Front yard / home stand","Farmers market or craft fair","Home studio or kitchen, by appointment","Fully virtual / remote","Mix of everything"].map(o=><option key={o}>{o}</option>)}
          </FSel>
        </FL>
        <FL label="Tell us about what you make" mb={14}><FTA required placeholder="How long have you been doing this? What makes yours worth seeking out? Talk to us like a person." value={form.description} onChange={e=>upd("description",e.target.value)}/></FL>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
          <FL label="Instagram" mb={0}><FI placeholder="@handle" value={form.instagram} onChange={e=>upd("instagram",e.target.value)}/></FL>
          <FL label="TikTok" mb={0}><FI placeholder="@handle" value={form.tiktok} onChange={e=>upd("tiktok",e.target.value)}/></FL>
          <FL label="Website" mb={0}><FI placeholder="yoursite.com" value={form.website} onChange={e=>upd("website",e.target.value)}/></FL>
        </div>
        <div style={{background:C.parchment,border:`1px solid ${C.straw}`,borderRadius:3,padding:"12px 16px",marginBottom:20}}>
          <p className="cr" style={{fontSize:13,color:C.bark,lineHeight:1.7}}><strong>The only rule:</strong> You made it, grew it, or do it yourself. No drop shipping. No reselling. Home stands, garage studios, virtual practices — all welcome.</p>
        </div>
        <button type="submit" className="btn bp" style={{width:"100%",padding:13,fontSize:16}}>Continue to Payment →</button>
      </form>
    </div>
  );
}

// ── BARTER PAGE ───────────────────────────────────────────────────────
function BarterPage({ stores, goHome, goApply, openStore, t2 }) {
  const [filt, setFilt] = useState("all");
  const [contact, setContact] = useState(null);
  const [sent, setSent] = useState({});
  const [msg, setMsg] = useState("");
  const allBt = stores.filter(s=>!s.banned).flatMap(s=>(s.barter||[]).map(b=>({...b,storeName:s.name,storeOwner:s.owner,storeAvatar:s.avatar,storeId:s.id,storeTier:s.tier})));
  const sorted = [...allBt].sort((a,b)=>(b.boosted?1:0)-(a.boosted?1:0));
  const filtered = filt==="all" ? sorted : sorted.filter(b=>b.category===filt);

  return (
    <div style={{maxWidth:1060,margin:"0 auto",padding:"44px 24px"}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{fontSize:38,marginBottom:10}}>🤝</div>
        <h1 className="pf" style={{fontSize:34,color:C.pine,marginBottom:10}}>The Trade Table</h1>
        <p className="cr" style={{fontSize:16,color:C.bark,maxWidth:520,margin:"0 auto",lineHeight:1.85}}>Makers trading with makers. Bread for nails, ceramics for candles, herb kits for art prints. No platform fee. Full Bloom sellers get their listings boosted to the top.</p>
      </div>
      <LD/>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center",margin:"22px 0 26px"}}>
        {[{id:"all",label:"All Trades",icon:"🌿"},...CATS.filter(c=>c.id!=="all")].map(c=>(
          <button key={c.id} className={`cpill${filt===c.id?" on":""}`} onClick={()=>setFilt(c.id)}>{c.icon} {c.label}</button>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(295px,1fr))",gap:16}}>
        {filtered.map(b => (
          <div key={b.id} className="bc">
            {b.boosted && <span className="bdg bgd" style={{position:"absolute",top:12,right:12}}>⭐ Featured</span>}
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <span style={{fontSize:26}}>{b.storeAvatar}</span>
              <div>
                <div className="pf" style={{fontSize:14,color:C.pine}}>{b.storeOwner}</div>
                <div className="cr" style={{fontSize:12,color:C.sage}}>{b.storeName}</div>
              </div>
              <div style={{marginLeft:"auto"}}><TBadge tier={b.storeTier}/></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
              <div style={{background:C.parchment,borderRadius:2,padding:"9px 11px"}}>
                <div className="cr" style={{fontSize:10,letterSpacing:".07em",textTransform:"uppercase",color:C.sage,marginBottom:3}}>Offering</div>
                <div className="cr" style={{fontSize:13,color:C.walnut,fontWeight:600}}>{b.offering}</div>
              </div>
              <div style={{background:"#eef5e8",border:`1px solid ${C.fog}`,borderRadius:2,padding:"9px 11px"}}>
                <div className="cr" style={{fontSize:10,letterSpacing:".07em",textTransform:"uppercase",color:C.sage,marginBottom:3}}>Looking for</div>
                <div className="cr" style={{fontSize:13,color:C.pine,fontWeight:600}}>{b.seeking}</div>
              </div>
            </div>
            {b.note && <p className="cr" style={{fontSize:12,color:C.bark,lineHeight:1.7,marginBottom:10,fontStyle:"italic"}}>"{b.note}"</p>}
            <div style={{display:"flex",gap:8}}>
              {sent[b.id]
                ? <span className="bdg bl" style={{fontSize:12,padding:"5px 10px"}}>✓ Sent!</span>
                : <button className="btn bg bsm" onClick={()=>setContact(b)}>Propose a Trade</button>}
              <button className="btn bo bsm" onClick={()=>{const s=stores.find(x=>x.id===b.storeId);if(s)openStore(s);}}>Visit Store</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{marginTop:36,background:C.parchment,border:`1px solid ${C.straw}`,borderRadius:3,padding:"24px 32px",textAlign:"center"}}>
        <h3 className="pf" style={{fontSize:18,color:C.pine,marginBottom:8}}>Want to list a trade?</h3>
        <p className="cr" style={{fontSize:14,color:C.bark,maxWidth:400,margin:"0 auto 16px",lineHeight:1.8}}>Trades are managed from your seller dashboard. New here? Apply first.</p>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <button className="btn bp bsm" onClick={()=>t2("🌱 Seller dashboard coming soon!")}>Manage My Trades</button>
          <button className="btn bo bsm" onClick={goApply}>Apply to Join</button>
        </div>
      </div>
      {contact && (
        <div className="mov" onClick={()=>setContact(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <button className="btn cr" style={{position:"absolute",top:14,right:14,background:"none",color:C.sage,fontSize:18,padding:0}} onClick={()=>setContact(null)}>✕</button>
            <div style={{fontSize:28,marginBottom:10,textAlign:"center"}}>🤝</div>
            <h3 className="pf" style={{fontSize:20,color:C.pine,marginBottom:6}}>Propose a Trade</h3>
            <p className="cr" style={{fontSize:13,color:C.bark,marginBottom:14,lineHeight:1.7}}>Reaching out to <strong>{contact.storeOwner}</strong> about <strong>{contact.offering}</strong>.</p>
            {sent[contact.id] ? (
              <div style={{textAlign:"center",padding:"12px 0"}}>
                <span className="bdg bl" style={{fontSize:14,padding:"7px 14px"}}>✓ Trade proposal sent!</span>
              </div>
            ) : (
              <>
                <FL label="What are you offering?" mb={12}><FTA placeholder="e.g. Two sourdough loaves, or a custom crochet tote..." value={msg} onChange={e=>setMsg(e.target.value)} style={{minHeight:60}}/></FL>
                <FL label="Your name & how to reach you" mb={14}><FI placeholder="Name + email or @handle"/></FL>
                <button className="btn bg" style={{width:"100%",padding:11,fontSize:14}} onClick={()=>{setSent(p=>({...p,[contact.id]:true}));setMsg("");t2(`🤝 Proposal sent to ${contact.storeOwner}!`);setContact(null);}}>Send Proposal</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── STORE PAGE ────────────────────────────────────────────────────────
function StorePage({ store, goHome, addCart, getQty, setQty, subs, doSub, t2 }) {
  const [tab, setTab] = useState("shop");
  const [bContact, setBContact] = useState(null);
  const [tradeSent, setTradeSent] = useState({});
  const [tradeMsg, setTradeMsg] = useState("");
  if (!store) return null;

  const tabs = [
    ["shop","Shop"],
    store.subscriptionPlans?.length > 0 && store.tier==="fullbloom" && ["sub","Subscribe & Save"],
    (store.barter||[]).length > 0 && ["barter","🤝 Trade"],
    ["pickup","🏡 Pickup"],
    ["findus","📍 Find Us"],
  ].filter(Boolean);

  return (
    <div style={{maxWidth:820,margin:"0 auto",padding:"32px 24px"}}>
      <button onClick={goHome} className="btn cr" style={{color:C.sage,marginBottom:20,fontSize:15,background:"none",padding:0}}>← Back to market</button>
      <div style={{background:C.parchment,border:`1px solid ${C.straw}`,borderRadius:3,padding:"24px 26px",marginBottom:24,position:"relative",overflow:"hidden"}}>
        <Branch side="right"/>
        <div style={{display:"flex",gap:16,alignItems:"flex-start",position:"relative"}}>
          <div style={{fontSize:52,lineHeight:1}} className="swav">{store.avatar}</div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:5}}>
              <h2 className="pf" style={{fontSize:28,color:C.pine}}>{store.name}</h2>
              {store.verified && <span className="bdg bl">✓ Verified</span>}
              <TBadge tier={store.tier}/>
              {store.featured && <span className="bdg bgd">⭐ Featured</span>}
            </div>
            <div className="cr" style={{color:C.bark,fontSize:14,marginBottom:8}}>by {store.owner} · 📍 {store.location}</div>
            <span style={{background:C.straw,color:C.bark,fontSize:12,padding:"3px 9px",borderRadius:2,fontFamily:"Crimson Text,serif",display:"inline-block"}}>{store.tag}</span>
            <SBar s={store.social}/>
          </div>
        </div>
        <blockquote style={{borderLeft:`3px solid ${C.leaf}`,paddingLeft:16,marginTop:18,fontFamily:"'IM Fell English',serif",fontStyle:"italic",fontSize:15,color:C.bark,lineHeight:1.85}}>{store.bio}</blockquote>
      </div>
      <div style={{borderBottom:`1px solid ${C.straw}`,marginBottom:22,display:"flex",overflowX:"auto"}}>
        {tabs.map(([id,label]) => (
          <button key={id} className={`tab${tab===id?" on":""}`} onClick={()=>setTab(id)}>{label}</button>
        ))}
      </div>

      {tab==="shop" && store.products.map(p => (
        <div key={p.id} style={{display:"flex",gap:14,alignItems:"flex-start",padding:"18px 0",borderBottom:`1px solid ${C.straw}`}}>
          <div style={{fontSize:36,width:46,textAlign:"center",flexShrink:0}}>{p.img}</div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:5}}>
              <h4 className="pf" style={{fontSize:18,color:C.pine}}>{p.name}</h4>
              <span className={`bdg ${p.type==="virtual"?"bm":"bk"}`}>{p.type==="virtual"?"💻 Virtual":"📦 Ships"}</span>
              {p.stock<=5 && p.stock<99 && <span className="bdg bred">⚡ {p.stock} left</span>}
            </div>
            <p className="cr" style={{fontSize:14,color:C.bark,marginBottom:12,lineHeight:1.75}}>{p.desc}</p>
            <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
              <span className="pf" style={{fontSize:20,color:C.pine}}>${p.price.toFixed(2)}</span>
              <span className="cr" style={{fontSize:13,color:C.sage}}>/ {p.unit}</span>
              {p.type!=="virtual" && (
                <div className="qc">
                  <button className="qb" onClick={()=>setQty(p.id,getQty(p.id)-1)}>−</button>
                  <span className="qn">{getQty(p.id)}</span>
                  <button className="qb" onClick={()=>setQty(p.id,getQty(p.id)+1)}>+</button>
                </div>
              )}
              <button className="btn bp bsm" onClick={()=>p.type==="virtual"?t2("📅 Booking coming soon!"):addCart(p,store)}>
                {p.type==="virtual"?"Book Now":"Add to Basket"}
              </button>
            </div>
          </div>
        </div>
      ))}

      {tab==="sub" && (
        <div>
          <p className="cr" style={{fontSize:15,color:C.bark,marginBottom:18,lineHeight:1.8}}>Regular orders help {store.owner} plan ahead. Cancel any time.</p>
          {store.subscriptionPlans.map(plan => {
            const key = store.id+plan.id;
            return (
              <div key={plan.id} style={{background:C.parchment,border:`1px solid ${C.straw}`,borderRadius:3,padding:"18px 22px",marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:14}}>
                  <div>
                    <h4 className="pf" style={{fontSize:19,color:C.pine,marginBottom:5}}>{plan.name}</h4>
                    <p className="cr" style={{fontSize:13,color:C.bark,marginBottom:7,lineHeight:1.7}}>{plan.desc}</p>
                    <span className="bdg bk" style={{textTransform:"capitalize"}}>↻ {plan.freq}</span>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div className="pf" style={{fontSize:22,color:C.pine}}>${plan.price}<span className="cr" style={{fontSize:12,color:C.sage}}>/{plan.freq==="weekly"?"wk":plan.freq==="monthly"?"mo":"2wk"}</span></div>
                    {subs[key]
                      ? <span className="bdg bl" style={{fontSize:12,padding:"6px 10px",marginTop:8,display:"inline-block"}}>✓ Subscribed!</span>
                      : <button className="btn bp bsm" style={{marginTop:8}} onClick={()=>doSub(plan,store)}>Subscribe</button>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab==="barter" && (
        <div>
          <p className="cr" style={{fontSize:15,color:C.bark,marginBottom:18,lineHeight:1.8}}>{store.owner} is open to trades.</p>
          {(store.barter||[]).map(b => (
            <div key={b.id} className="bc">
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <div style={{background:C.parchment,borderRadius:2,padding:"9px 11px"}}>
                  <div className="cr" style={{fontSize:10,letterSpacing:".07em",textTransform:"uppercase",color:C.sage,marginBottom:3}}>Offering</div>
                  <div className="cr" style={{fontSize:13,color:C.walnut,fontWeight:600}}>{b.offering}</div>
                </div>
                <div style={{background:"#eef5e8",border:`1px solid ${C.fog}`,borderRadius:2,padding:"9px 11px"}}>
                  <div className="cr" style={{fontSize:10,letterSpacing:".07em",textTransform:"uppercase",color:C.sage,marginBottom:3}}>Looking for</div>
                  <div className="cr" style={{fontSize:13,color:C.pine,fontWeight:600}}>{b.seeking}</div>
                </div>
              </div>
              {b.note && <p className="cr" style={{fontSize:12,color:C.bark,lineHeight:1.7,marginBottom:10,fontStyle:"italic"}}>"{b.note}"</p>}
              {tradeSent[b.id]
                ? <span className="bdg bl" style={{fontSize:12,padding:"5px 10px"}}>✓ Sent!</span>
                : <button className="btn bg bsm" onClick={()=>setBContact(b)}>Propose a Trade</button>}
            </div>
          ))}
          {bContact && (
            <div className="mov" onClick={()=>setBContact(null)}>
              <div className="modal" onClick={e=>e.stopPropagation()}>
                <button className="btn cr" style={{position:"absolute",top:14,right:14,background:"none",color:C.sage,fontSize:18,padding:0}} onClick={()=>setBContact(null)}>✕</button>
                <h3 className="pf" style={{fontSize:20,color:C.pine,marginBottom:12}}>Propose a Trade</h3>
                <FL label="What are you offering?" mb={12}><FTA value={tradeMsg} onChange={e=>setTradeMsg(e.target.value)} style={{minHeight:60}}/></FL>
                <FL label="Your name & contact" mb={14}><FI placeholder="Name + email or @handle"/></FL>
                <button className="btn bg" style={{width:"100%",padding:11}} onClick={()=>{setTradeSent(p=>({...p,[bContact.id]:true}));t2("🤝 Trade proposal sent!");setBContact(null);}}>Send Proposal</button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab==="pickup" && (
        <div>
          <p className="cr" style={{fontSize:15,color:C.bark,marginBottom:18,lineHeight:1.8}}>Here's how to get your order from {store.owner} directly:</p>
          {store.pickup.map((pu,i) => (
            <div key={i} className="pc">
              <div style={{fontSize:24,flexShrink:0}}>{PI[pu.type]||"📍"}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                  <h4 className="pf" style={{fontSize:17,color:C.pine}}>{pu.label}</h4>
                  <span className="bdg bm">{pu.type==="home"?"Home Stand":pu.type==="curbside"?"Curbside":pu.type==="virtual"?"Virtual":pu.type==="market"?"At the Market":"Scheduled"}</span>
                </div>
                <div className="cr" style={{fontSize:13,color:C.bark,marginBottom:3}}>{pu.detail}</div>
                <div className="cr" style={{fontSize:12,color:C.sage}}>🕐 {pu.hours}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="findus" && (
        <div>
          <p className="cr" style={{fontSize:15,color:C.bark,marginBottom:18,lineHeight:1.8}}>Catch {store.owner} out in the world.</p>
          {store.appearances.map((a,i) => (
            <div key={i} className="ac">
              <div style={{width:10,height:10,borderRadius:"50%",background:a.type==="recurring"?C.leaf:C.gold,marginTop:4,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                  <h4 className="pf" style={{fontSize:17,color:C.pine}}>{a.event}</h4>
                  <span className={`bdg ${a.type==="recurring"?"bl":"bk"}`}>{a.type==="recurring"?"↻ Regular":"📅 Upcoming"}</span>
                </div>
                <div className="cr" style={{fontSize:13,color:C.bark,marginBottom:3}}>🗓 {a.date} · 🕐 {a.time}</div>
                <div className="cr" style={{fontSize:12,color:C.walnut,marginBottom:6}}>📍 {a.address}</div>
                <button className="btn cr" style={{color:C.leaf,fontSize:12,background:"none",padding:0,textDecoration:"underline"}} onClick={()=>window.open(`https://maps.google.com/?q=${encodeURIComponent(a.address)}`,"_blank")}>Open in Maps →</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── ADMIN PAGE ────────────────────────────────────────────────────────
function AdminPage({ stores, setStores, apps, setApps, banList, setBanList, goHome, t2 }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(false);
  const [tab, setTab] = useState(AT.DASH);
  const [editSt, setEditSt] = useState(null);
  const [editStId, setEditStId] = useState(null);
  const [editPr, setEditPr] = useState(null);
  const [addingPr, setAddingPr] = useState(false);
  const [editBr, setEditBr] = useState(null);
  const [addingBr, setAddingBr] = useState(false);
  const [banModal, setBanModal] = useState(null);
  const [banReason, setBanReason] = useState("");
  const [banNote, setBanNote] = useState("");
  const [flagModal, setFlagModal] = useState(null);
  const [flagNote, setFlagNote] = useState("");
  const [delConf, setDelConf] = useState(null);

  const pendApps = apps.filter(a=>a.status==="pending");
  const curSt = editStId ? stores.find(s=>s.id===editStId) : null;

  const saveSt = () => { setStores(p=>p.map(s=>s.id===editSt.id?editSt:s)); setEditSt(null); setEditStId(null); t2("✅ Store saved!"); };
  const delSt = (id) => { setStores(p=>p.filter(s=>s.id!==id)); setDelConf(null); setEditStId(null); t2("🗑️ Store deleted."); };
  const savePr = (sid,pr) => { setStores(p=>p.map(s=>{ if(s.id!==sid)return s; const ex=s.products.find(x=>x.id===pr.id); return{...s,products:ex?s.products.map(x=>x.id===pr.id?pr:x):[...s.products,{...pr,id:mkId()}]};})); setEditPr(null); setAddingPr(false); t2("✅ Product saved!"); };
  const delPr = (sid,pid) => { setStores(p=>p.map(s=>s.id===sid?{...s,products:s.products.filter(x=>x.id!==pid)}:s)); t2("🗑️ Product removed."); };
  const saveBr = (sid,b) => { setStores(p=>p.map(s=>{ if(s.id!==sid)return s; const ex=(s.barter||[]).find(x=>x.id===b.id); return{...s,barter:ex?(s.barter||[]).map(x=>x.id===b.id?b:x):[...(s.barter||[]),{...b,id:mkId()}]};})); setEditBr(null); setAddingBr(false); t2("✅ Trade saved!"); };
  const delBr = (sid,bid) => { setStores(p=>p.map(s=>s.id===sid?{...s,barter:(s.barter||[]).filter(b=>b.id!==bid)}:s)); t2("🗑️ Trade removed."); };
  const updApp = (id,status) => { setApps(p=>p.map(a=>a.id===id?{...a,status}:a)); t2(status==="approved"?"✅ Approved!":"❌ Declined."); };
  const togFeat = (id) => { setStores(p=>p.map(s=>s.id===id?{...s,featured:!s.featured}:s)); t2("⭐ Featured updated!"); };
  const setTierF = (id,tier) => { setStores(p=>p.map(s=>s.id===id?{...s,tier,featuredSlots:tier==="fullbloom"?2:0}:s)); t2("🌿 Tier updated!"); };
  const flagStore = (id,note) => { setStores(p=>p.map(s=>s.id===id?{...s,flagged:true,flagNote:note}:s)); setFlagModal(null); setFlagNote(""); t2("⚠️ Store flagged."); };
  const unflag = (id) => { setStores(p=>p.map(s=>s.id===id?{...s,flagged:false,flagNote:""}:s)); t2("✅ Flag removed."); };
  const doBan = (store) => {
    setBanList(p=>[...p,{id:mkId(),storeId:store.id,storeName:store.name,owner:store.owner,instagram:store.social?.instagram||"",location:store.location,reason:banReason,note:banNote,date:new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}]);
    setStores(p=>p.map(s=>s.id===store.id?{...s,banned:true,banReason}:s));
    setBanModal(null); setBanReason(""); setBanNote(""); t2(`🚫 ${store.name} banned.`);
  };
  const doUnban = (storeId) => { setStores(p=>p.map(s=>s.id===storeId?{...s,banned:false,banReason:""}:s)); setBanList(p=>p.filter(b=>b.storeId!==storeId)); t2("✅ Account reinstated."); };

  if (!authed) return (
    <div style={{maxWidth:360,margin:"100px auto",padding:"0 24px",textAlign:"center"}}>
      <div style={{fontSize:36,marginBottom:12}}>🌿</div>
      <h2 className="pf" style={{fontSize:24,color:C.pine,marginBottom:6}}>Admin Access</h2>
      <p className="cr" style={{fontSize:13,color:C.sage,marginBottom:18}}>Rooted Market dashboard.</p>
      <FI type="password" placeholder="Password" value={pw} onChange={e=>{setPw(e.target.value);setPwErr(false);}} style={{marginBottom:10,textAlign:"center",fontSize:18,letterSpacing:".1em"}} onKeyDown={e=>e.key==="Enter"&&(pw===ADMIN_PW?setAuthed(true):setPwErr(true))}/>
      {pwErr && <p className="cr" style={{color:C.red,fontSize:13,marginBottom:8}}>Incorrect password.</p>}
      <button className="btn bp" style={{width:"100%",padding:12,fontSize:15,marginBottom:10}} onClick={()=>pw===ADMIN_PW?setAuthed(true):setPwErr(true)}>Enter</button>
      <button className="btn cr" style={{background:"none",color:C.sage,fontSize:13,padding:0}} onClick={goHome}>← Back to market</button>
    </div>
  );

  return (
    <div className="aw">
      <div className="asb">
        <div style={{padding:"0 14px 14px",borderBottom:"1px solid rgba(255,255,255,.1)",marginBottom:8}}>
          <div className="pf" style={{fontSize:16,color:C.cream,fontWeight:700}}>🌿 Rooted</div>
          <div className="cr" style={{fontSize:10,color:C.fog,opacity:.5,letterSpacing:".14em",textTransform:"uppercase"}}>Admin</div>
        </div>
        {[
          {id:AT.DASH,icon:"📊",label:"Dashboard"},
          {id:AT.STORES,icon:"🏪",label:"Stores & Products"},
          {id:AT.APPS,icon:"📋",label:`Applications${pendApps.length>0?` (${pendApps.length})`:""}`},
          {id:AT.BANNED,icon:"🚫",label:`Banned${banList.length>0?` (${banList.length})`:""}`},
        ].map(it => (
          <button key={it.id} className={`atab${tab===it.id?" on":""}`} onClick={()=>setTab(it.id)}>{it.icon} {it.label}</button>
        ))}
        <div style={{borderTop:"1px solid rgba(255,255,255,.08)",marginTop:12,paddingTop:12}}>
          <button className="atab cr" style={{color:C.fog}} onClick={()=>{setAuthed(false);goHome();}}>← Exit Admin</button>
        </div>
      </div>

      <div style={{padding:"24px 28px",overflowY:"auto",maxHeight:"calc(100vh - 62px)"}}>

        {/* DASHBOARD */}
        {tab===AT.DASH && (
          <div>
            <h2 className="pf" style={{fontSize:24,color:C.pine,marginBottom:22}}>Dashboard</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:14,marginBottom:32}}>
              {[
                {label:"Total Stores",val:stores.filter(s=>!s.banned).length,icon:"🏪"},
                {label:"Full Bloom",val:stores.filter(s=>s.tier==="fullbloom"&&!s.banned).length,icon:"🌸"},
                {label:"Seedling",val:stores.filter(s=>s.tier==="seedling"&&!s.banned).length,icon:"🌱"},
                {label:"Pending Apps",val:pendApps.length,icon:"📋"},
                {label:"Banned",val:banList.length,icon:"🚫"},
                {label:"Flagged",val:stores.filter(s=>s.flagged&&!s.banned).length,icon:"⚠️"},
                {label:"Featured",val:stores.filter(s=>s.featured&&!s.banned).length,icon:"⭐"},
                {label:"Est. Monthly",val:`$${(stores.filter(s=>s.tier==="fullbloom"&&!s.banned).length*9).toLocaleString()}+`,icon:"💰"},
              ].map(st => (
                <div key={st.label} className="sc">
                  <div style={{fontSize:22,marginBottom:5}}>{st.icon}</div>
                  <div className="pf" style={{fontSize:20,color:C.pine,marginBottom:3}}>{st.val}</div>
                  <div className="cr" style={{fontSize:11,color:C.sage}}>{st.label}</div>
                </div>
              ))}
            </div>
            {stores.filter(s=>s.flagged&&!s.banned).length > 0 && (
              <div style={{marginBottom:24}}>
                <h3 className="pf" style={{fontSize:17,color:C.gold,marginBottom:12}}>⚠️ Flagged Stores</h3>
                {stores.filter(s=>s.flagged&&!s.banned).map(s => (
                  <div key={s.id} style={{background:"#fff8e8",border:`1px solid ${C.gold}`,borderRadius:3,padding:"12px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                    <div>
                      <div className="pf" style={{fontSize:15,color:C.pine}}>{s.avatar} {s.name}</div>
                      <div className="cr" style={{fontSize:12,color:C.bark}}>{s.owner} · {s.location}</div>
                      {s.flagNote && <div className="cr" style={{fontSize:11,color:C.sage}}>Note: {s.flagNote}</div>}
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button className="btn bo bsm" onClick={()=>unflag(s.id)}>Remove Flag</button>
                      <button className="btn brd bsm" onClick={()=>setBanModal(s)}>Ban</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {pendApps.length > 0 && (
              <div>
                <h3 className="pf" style={{fontSize:17,color:C.pine,marginBottom:12}}>📋 Pending Applications ({pendApps.length})</h3>
                {pendApps.slice(0,3).map(a => (
                  <div key={a.id} style={{background:C.parchment,border:`1px solid ${C.straw}`,borderRadius:3,padding:"11px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                    <div>
                      <div className="pf" style={{fontSize:14,color:C.pine}}>{a.biz}</div>
                      <div className="cr" style={{fontSize:12,color:C.sage}}>{a.name} · {a.location} · {a.date}</div>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <button className="btn bp bsm" onClick={()=>updApp(a.id,"approved")}>Approve</button>
                      <button className="btn brd bsm" onClick={()=>updApp(a.id,"rejected")}>Decline</button>
                    </div>
                  </div>
                ))}
                {pendApps.length > 3 && <button className="btn bo bsm" onClick={()=>setTab(AT.APPS)}>View all {pendApps.length} →</button>}
              </div>
            )}
          </div>
        )}

        {/* STORES */}
        {tab===AT.STORES && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h2 className="pf" style={{fontSize:22,color:C.pine}}>{editStId && curSt ? curSt.name : "Stores & Products"}</h2>
              {editStId && <button className="btn cr" style={{color:C.sage,fontSize:13,background:"none",padding:0}} onClick={()=>setEditStId(null)}>← All Stores</button>}
            </div>
            {editStId && curSt ? (
              <div>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:18,flexWrap:"wrap"}}>
                  <span style={{fontSize:36}}>{curSt.avatar}</span>
                  <div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:4}}>
                      <TBadge tier={curSt.tier}/>
                      {curSt.featured && <span className="bdg bgd">⭐ Featured</span>}
                      {curSt.flagged && <span className="bdg" style={{background:"#fff3cc",color:"#8a6000"}}>⚠️ Flagged</span>}
                    </div>
                    <div className="cr" style={{fontSize:12,color:C.sage}}>{curSt.owner} · {curSt.location}</div>
                  </div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",marginLeft:"auto"}}>
                    <button className="btn bp bsm" onClick={()=>setEditSt({...curSt})}>Edit Info</button>
                    <button className="btn" style={{background:C.gold,color:C.walnut,padding:"7px 14px",borderRadius:2,fontSize:12}} onClick={()=>togFeat(curSt.id)}>{curSt.featured?"Unfeature":"⭐ Feature"}</button>
                    {!curSt.flagged
                      ? <button className="btn" style={{background:"#f5e8c0",color:"#8a6000",padding:"7px 14px",borderRadius:2,fontSize:12}} onClick={()=>setFlagModal(curSt)}>⚠️ Flag</button>
                      : <button className="btn bo bsm" onClick={()=>unflag(curSt.id)}>Remove Flag</button>}
                    <button className="btn brd bsm" onClick={()=>setBanModal(curSt)}>🚫 Ban</button>
                    <button className="btn" style={{background:"#fdeaea",color:C.red,padding:"7px 14px",borderRadius:2,fontSize:12}} onClick={()=>setDelConf({id:curSt.id,name:curSt.name})}>🗑️ Delete</button>
                  </div>
                </div>
                <div style={{marginBottom:16}}>
                  <FSel value={curSt.tier} onChange={e=>setTierF(curSt.id,e.target.value)} style={{width:"auto",padding:"7px 12px",fontSize:13}}>
                    <option value="seedling">🌱 Seedling (Free)</option>
                    <option value="fullbloom">🌸 Full Bloom ($9/mo)</option>
                  </FSel>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <h3 className="pf" style={{fontSize:17,color:C.pine}}>Products ({curSt.products.length})</h3>
                  <button className="btn bp bsm" onClick={()=>{setAddingPr(true);setEditPr({name:"",price:"",unit:"",img:"📦",type:"physical",stock:10,desc:""});}}>+ Add</button>
                </div>
                {curSt.products.map(p => (
                  <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",background:C.parchment,border:`1px solid ${C.straw}`,borderRadius:3,marginBottom:7}}>
                    <div><span style={{fontSize:18,marginRight:7}}>{p.img}</span><span className="cr" style={{fontSize:14,color:C.pine}}>{p.name}</span><span className="cr" style={{fontSize:12,color:C.sage,marginLeft:7}}>${p.price} · {p.unit}</span></div>
                    <div style={{display:"flex",gap:7}}>
                      <button className="btn bo bsm" onClick={()=>{setEditPr({...p});setAddingPr(false);}}>Edit</button>
                      <button className="btn brd bsm" onClick={()=>delPr(curSt.id,p.id)}>Del</button>
                    </div>
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,marginTop:20}}>
                  <h3 className="pf" style={{fontSize:17,color:C.pine}}>Trade Listings ({(curSt.barter||[]).length})</h3>
                  <button className="btn bp bsm" onClick={()=>{setAddingBr(true);setEditBr({offering:"",seeking:"",category:"all",note:"",boosted:false});}}>+ Add</button>
                </div>
                {(curSt.barter||[]).map(b => (
                  <div key={b.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",background:C.parchment,border:`1px solid ${C.straw}`,borderRadius:3,marginBottom:7}}>
                    <div className="cr" style={{fontSize:13,color:C.pine}}><strong>{b.offering}</strong> <span style={{color:C.sage}}>↔</span> {b.seeking}{b.boosted&&<span style={{marginLeft:7,fontSize:10,background:C.bloomBg,color:C.bloom,padding:"2px 5px",borderRadius:1}}>Boosted</span>}</div>
                    <div style={{display:"flex",gap:7}}>
                      <button className="btn bo bsm" onClick={()=>{setEditBr({...b});setAddingBr(false);}}>Edit</button>
                      <button className="btn brd bsm" onClick={()=>delBr(curSt.id,b.id)}>Del</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {stores.map(s => (
                  <div key={s.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 14px",background:s.banned?"#fdeaea":s.flagged?"#fff8e8":C.parchment,border:`1px solid ${s.banned?C.red:s.flagged?C.gold:C.straw}`,borderRadius:3,marginBottom:9,flexWrap:"wrap",gap:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:9}}>
                      <span style={{fontSize:28}}>{s.avatar}</span>
                      <div>
                        <div className="pf" style={{fontSize:15,color:s.banned?C.red:C.pine}}>{s.name}{s.banned?" (BANNED)":""}</div>
                        <div className="cr" style={{fontSize:11,color:C.sage}}>{s.owner} · {s.location}</div>
                        <div style={{display:"flex",gap:5,marginTop:3,flexWrap:"wrap"}}>
                          <TBadge tier={s.tier} sz={10}/>
                          {s.featured && <span className="bdg bgd" style={{fontSize:10}}>⭐</span>}
                          {s.flagged && <span className="bdg" style={{background:"#fff3cc",color:"#8a6000",fontSize:10}}>⚠️</span>}
                        </div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                      {!s.banned && <button className="btn bp bsm" onClick={()=>setEditStId(s.id)}>Manage</button>}
                      {!s.banned && <button className="btn brd bsm" onClick={()=>setBanModal(s)}>🚫 Ban</button>}
                      {s.banned && <button className="btn bo bsm" onClick={()=>doUnban(s.id)}>Reinstate</button>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* APPLICATIONS */}
        {tab===AT.APPS && (
          <div>
            <h2 className="pf" style={{fontSize:22,color:C.pine,marginBottom:20}}>Applications</h2>
            {["pending","approved","rejected"].map(status => {
              const list = apps.filter(a=>a.status===status);
              if (!list.length) return null;
              return (
                <div key={status} style={{marginBottom:28}}>
                  <h3 className="pf" style={{fontSize:16,color:status==="pending"?C.gold:status==="approved"?C.leaf:C.red,marginBottom:12,textTransform:"capitalize"}}>
                    {status==="pending"?"⏳":status==="approved"?"✅":"❌"} {status} ({list.length})
                  </h3>
                  {list.map(a => (
                    <div key={a.id} style={{background:C.parchment,border:`1px solid ${C.straw}`,borderRadius:3,padding:"14px 18px",marginBottom:9}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,flexWrap:"wrap"}}>
                        <div>
                          <div className="pf" style={{fontSize:16,color:C.pine,marginBottom:2}}>{a.biz}</div>
                          <div className="cr" style={{fontSize:12,color:C.bark,marginBottom:3}}>by {a.name} · {a.location} · {a.type}</div>
                          <div className="cr" style={{fontSize:12,color:C.sage,marginBottom:5}}>{a.date}</div>
                          <p className="cr" style={{fontSize:13,color:C.bark,lineHeight:1.7,maxWidth:460}}>{a.description}</p>
                          <div style={{display:"flex",gap:10,marginTop:6,flexWrap:"wrap"}}>
                            {a.instagram && <span className="cr" style={{fontSize:11,color:C.sage}}>📸 {a.instagram}</span>}
                            {a.tiktok && <span className="cr" style={{fontSize:11,color:C.sage}}>🎵 {a.tiktok}</span>}
                            {a.website && <span className="cr" style={{fontSize:11,color:C.sage}}>🌐 {a.website}</span>}
                          </div>
                        </div>
                        {status==="pending" && (
                          <div style={{display:"flex",gap:8,flexShrink:0}}>
                            <button className="btn bp bsm" onClick={()=>updApp(a.id,"approved")}>Approve</button>
                            <button className="btn brd bsm" onClick={()=>updApp(a.id,"rejected")}>Decline</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* BANNED */}
        {tab===AT.BANNED && (
          <div>
            <h2 className="pf" style={{fontSize:22,color:C.pine,marginBottom:8}}>Banned Accounts</h2>
            <p className="cr" style={{fontSize:13,color:C.sage,marginBottom:22}}>Identity info kept on record to prevent re-applications.</p>
            {banList.length===0 ? (
              <div style={{textAlign:"center",padding:"40px 0",color:C.sage}}>
                <div style={{fontSize:32,marginBottom:10}}>✅</div>
                <p className="cr" style={{fontSize:15}}>No banned accounts. The market is clean.</p>
              </div>
            ) : banList.map(b => (
              <div key={b.id} style={{background:"#fdeaea",border:`1px solid ${C.red}`,borderRadius:3,padding:"14px 18px",marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,flexWrap:"wrap"}}>
                  <div>
                    <div className="pf" style={{fontSize:16,color:C.red,marginBottom:2}}>🚫 {b.storeName}</div>
                    <div className="cr" style={{fontSize:12,color:C.bark,marginBottom:3}}>Owner: {b.owner} · {b.location}</div>
                    {b.instagram && <div className="cr" style={{fontSize:11,color:C.sage}}>📸 @{b.instagram}</div>}
                    <div className="cr" style={{fontSize:12,color:C.red,marginTop:5}}>Reason: {b.reason}</div>
                    {b.note && <div className="cr" style={{fontSize:11,color:C.bark,marginTop:2}}>Note: {b.note}</div>}
                    <div className="cr" style={{fontSize:10,color:C.sage,marginTop:3}}>Banned: {b.date}</div>
                  </div>
                  <button className="btn bo bsm" onClick={()=>doUnban(b.storeId)}>Reinstate</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Store Modal */}
      {editSt && (
        <div className="mov" onClick={()=>setEditSt(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <button className="btn cr" style={{position:"absolute",top:14,right:14,background:"none",color:C.sage,fontSize:18,padding:0}} onClick={()=>setEditSt(null)}>✕</button>
            <h3 className="pf" style={{fontSize:20,color:C.pine,marginBottom:18}}>Edit — {editSt.name}</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              <FL label="Store Name" mb={0}><FI value={editSt.name} onChange={e=>setEditSt(p=>({...p,name:e.target.value}))}/></FL>
              <FL label="Owner" mb={0}><FI value={editSt.owner} onChange={e=>setEditSt(p=>({...p,owner:e.target.value}))}/></FL>
            </div>
            <FL label="Tag Line" mb={12}><FI value={editSt.tag} onChange={e=>setEditSt(p=>({...p,tag:e.target.value}))}/></FL>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              <FL label="Location" mb={0}><FI value={editSt.location} onChange={e=>setEditSt(p=>({...p,location:e.target.value}))}/></FL>
              <FL label="Avatar (emoji)" mb={0}><FI value={editSt.avatar} onChange={e=>setEditSt(p=>({...p,avatar:e.target.value}))}/></FL>
            </div>
            <FL label="Category" mb={12}>
              <FSel value={editSt.category} onChange={e=>setEditSt(p=>({...p,category:e.target.value}))}>
                {CATS.filter(c=>c.id!=="all").map(c=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
              </FSel>
            </FL>
            <FL label="Bio" mb={12}><FTA value={editSt.bio} onChange={e=>setEditSt(p=>({...p,bio:e.target.value}))}/></FL>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
              <FL label="Instagram" mb={0}><FI value={editSt.social?.instagram||""} onChange={e=>setEditSt(p=>({...p,social:{...p.social,instagram:e.target.value}}))}/></FL>
              <FL label="TikTok" mb={0}><FI value={editSt.social?.tiktok||""} onChange={e=>setEditSt(p=>({...p,social:{...p.social,tiktok:e.target.value}}))}/></FL>
              <FL label="Website" mb={0}><FI value={editSt.social?.website||""} onChange={e=>setEditSt(p=>({...p,social:{...p.social,website:e.target.value}}))}/></FL>
            </div>
            <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:18,flexWrap:"wrap"}}>
              <label className="cr" style={{display:"flex",alignItems:"center",gap:6,fontSize:13,cursor:"pointer"}}><input type="checkbox" checked={editSt.verified||false} onChange={e=>setEditSt(p=>({...p,verified:e.target.checked}))}/> Verified</label>
              <label className="cr" style={{display:"flex",alignItems:"center",gap:6,fontSize:13,cursor:"pointer"}}><input type="checkbox" checked={editSt.featured||false} onChange={e=>setEditSt(p=>({...p,featured:e.target.checked}))}/> Featured</label>
              <FSel value={editSt.tier||"seedling"} onChange={e=>setEditSt(p=>({...p,tier:e.target.value}))} style={{width:"auto",padding:"5px 10px",fontSize:13}}>
                <option value="seedling">🌱 Seedling</option>
                <option value="fullbloom">🌸 Full Bloom</option>
              </FSel>
            </div>
            <button className="btn bp" style={{width:"100%",padding:11,fontSize:15}} onClick={saveSt}>Save Changes</button>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {(editPr || addingPr) && (
        <div className="mov" onClick={()=>{setEditPr(null);setAddingPr(false);}}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <button className="btn cr" style={{position:"absolute",top:14,right:14,background:"none",color:C.sage,fontSize:18,padding:0}} onClick={()=>{setEditPr(null);setAddingPr(false);}}>✕</button>
            <h3 className="pf" style={{fontSize:19,color:C.pine,marginBottom:16}}>{addingPr?"Add Product":"Edit Product"}</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              <FL label="Name" mb={0}><FI value={editPr?.name||""} onChange={e=>setEditPr(p=>({...p,name:e.target.value}))}/></FL>
              <FL label="Emoji" mb={0}><FI value={editPr?.img||""} onChange={e=>setEditPr(p=>({...p,img:e.target.value}))}/></FL>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
              <FL label="Price ($)" mb={0}><FI type="number" step="0.01" value={editPr?.price||""} onChange={e=>setEditPr(p=>({...p,price:parseFloat(e.target.value)||0}))}/></FL>
              <FL label="Unit" mb={0}><FI placeholder="bunch, jar…" value={editPr?.unit||""} onChange={e=>setEditPr(p=>({...p,unit:e.target.value}))}/></FL>
              <FL label="Stock" mb={0}><FI type="number" value={editPr?.stock||""} onChange={e=>setEditPr(p=>({...p,stock:parseInt(e.target.value)||0}))}/></FL>
            </div>
            <FL label="Type" mb={12}>
              <FSel value={editPr?.type||"physical"} onChange={e=>setEditPr(p=>({...p,type:e.target.value}))}>
                <option value="physical">📦 Physical (ships)</option>
                <option value="virtual">💻 Virtual / Service</option>
              </FSel>
            </FL>
            <FL label="Description" mb={16}><FTA value={editPr?.desc||""} onChange={e=>setEditPr(p=>({...p,desc:e.target.value}))}/></FL>
            <button className="btn bp" style={{width:"100%",padding:11}} onClick={()=>savePr(editStId,editPr)}>Save Product</button>
          </div>
        </div>
      )}

      {/* Barter Modal */}
      {(editBr || addingBr) && (
        <div className="mov" onClick={()=>{setEditBr(null);setAddingBr(false);}}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <button className="btn cr" style={{position:"absolute",top:14,right:14,background:"none",color:C.sage,fontSize:18,padding:0}} onClick={()=>{setEditBr(null);setAddingBr(false);}}>✕</button>
            <h3 className="pf" style={{fontSize:19,color:C.pine,marginBottom:16}}>{addingBr?"Add Trade":"Edit Trade"}</h3>
            <FL label="What you're offering" mb={12}><FI value={editBr?.offering||""} onChange={e=>setEditBr(p=>({...p,offering:e.target.value}))}/></FL>
            <FL label="What you're seeking" mb={12}><FI value={editBr?.seeking||""} onChange={e=>setEditBr(p=>({...p,seeking:e.target.value}))}/></FL>
            <FL label="Category of what you want" mb={12}>
              <FSel value={editBr?.category||"all"} onChange={e=>setEditBr(p=>({...p,category:e.target.value}))}>
                {CATS.map(c=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
              </FSel>
            </FL>
            <FL label="Note (optional)" mb={12}><FI value={editBr?.note||""} onChange={e=>setEditBr(p=>({...p,note:e.target.value}))}/></FL>
            <label className="cr" style={{display:"flex",alignItems:"center",gap:8,fontSize:13,marginBottom:16,cursor:"pointer"}}>
              <input type="checkbox" checked={editBr?.boosted||false} onChange={e=>setEditBr(p=>({...p,boosted:e.target.checked}))}/>
              Boosted (Full Bloom — shows at top of Trade Table)
            </label>
            <button className="btn bp" style={{width:"100%",padding:11}} onClick={()=>saveBr(editStId,editBr)}>Save Trade Listing</button>
          </div>
        </div>
      )}

      {/* Ban Modal */}
      {banModal && (
        <div className="mov" onClick={()=>setBanModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:460}}>
            <button className="btn cr" style={{position:"absolute",top:14,right:14,background:"none",color:C.sage,fontSize:18,padding:0}} onClick={()=>setBanModal(null)}>✕</button>
            <div style={{fontSize:32,marginBottom:10,textAlign:"center"}}>🚫</div>
            <h3 className="pf" style={{fontSize:20,color:C.red,marginBottom:6,textAlign:"center"}}>Ban Account</h3>
            <p className="cr" style={{fontSize:14,color:C.bark,marginBottom:18,textAlign:"center",lineHeight:1.7}}>Banning <strong>{banModal.name}</strong> will remove their store immediately and flag their identity to prevent reapplying.</p>
            <FL label="Reason for ban" mb={12}>
              <FSel value={banReason} onChange={e=>setBanReason(e.target.value)}>
                <option value="">Select a reason</option>
                {FRAUD_REASONS.map(r=><option key={r}>{r}</option>)}
              </FSel>
            </FL>
            <FL label="Internal notes (optional)" mb={16}><FTA placeholder="Document what happened for your records..." value={banNote} onChange={e=>setBanNote(e.target.value)} style={{minHeight:60}}/></FL>
            <div style={{background:"#fdeaea",border:`1px solid ${C.red}`,borderRadius:3,padding:"10px 14px",marginBottom:16}}>
              <p className="cr" style={{fontSize:12,color:C.red}}>⚠️ This permanently removes their store and flags their identity info so they cannot reapply.</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <button className="btn bo" onClick={()=>setBanModal(null)}>Cancel</button>
              <button className="btn brd" style={{fontSize:14,padding:11}} disabled={!banReason} onClick={()=>doBan(banModal)}>Confirm Ban</button>
            </div>
          </div>
        </div>
      )}

      {/* Flag Modal */}
      {flagModal && (
        <div className="mov" onClick={()=>setFlagModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:420}}>
            <h3 className="pf" style={{fontSize:19,color:C.gold,marginBottom:10}}>⚠️ Flag Store for Review</h3>
            <p className="cr" style={{fontSize:13,color:C.bark,marginBottom:14,lineHeight:1.7}}>Flagging <strong>{flagModal.name}</strong> marks it for review. Store stays live.</p>
            <FL label="Why are you flagging this?" mb={14}><FTA placeholder="Describe the concern..." value={flagNote} onChange={e=>setFlagNote(e.target.value)} style={{minHeight:60}}/></FL>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <button className="btn bo" onClick={()=>setFlagModal(null)}>Cancel</button>
              <button className="btn bg" onClick={()=>flagStore(flagModal.id,flagNote)}>Flag Store</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {delConf && (
        <div className="mov" onClick={()=>setDelConf(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:380,textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:10}}>🗑️</div>
            <h3 className="pf" style={{fontSize:20,color:C.red,marginBottom:8}}>Delete Store?</h3>
            <p className="cr" style={{fontSize:14,color:C.bark,marginBottom:22,lineHeight:1.7}}>This will permanently delete <strong>{delConf.name}</strong> and all their products. Cannot be undone.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <button className="btn bo" onClick={()=>setDelConf(null)}>Cancel</button>
              <button className="btn brd" style={{fontSize:14,padding:11}} onClick={()=>delSt(delConf.id)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════════════════
export default function App() {
  const [scr, setScr] = useState(SC.HOME);
  const [stores, setStores] = useState(STORES0);
  const [apps, setApps] = useState(APPS0);
  const [banList, setBanList] = useState([]);
  const [selSt, setSelSt] = useState(null);
  const [cat, setCat] = useState("all");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [subs, setSubs] = useState({});
  const [toast, setToast] = useState(null);
  const [qtys, setQtys] = useState({});
  const [oInfo, setOInfo] = useState({name:"",email:"",address:"",city:"",zip:"",ship:"standard"});
  const [oNum] = useState(() => "ROOT-"+Math.floor(10000+Math.random()*90000));
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);

  const t2 = (m) => { setToast(m); setTimeout(()=>setToast(null), 2700); };
  const gQ = (id) => qtys[id] || 1;
  const sQ = (id, v) => setQtys(p => ({...p,[id]:Math.max(1,v)}));
  const addCart = (p, store) => {
    const qty = gQ(p.id);
    setCart(prev => {
      const ex = prev.find(i => i.id===p.id);
      if (ex) return prev.map(i => i.id===p.id ? {...i,qty:i.qty+qty} : i);
      return [...prev, {...p, store:store.name, qty}];
    });
    t2(`${p.img} ${p.name} added`);
  };
  const updQ = (id, d) => setCart(p => p.map(i => i.id===id ? {...i,qty:Math.max(0,i.qty+d)} : i).filter(i => i.qty>0));
  const rmCart = (id) => setCart(p => p.filter(i => i.id!==id));
  const doSub = (plan, store) => { setSubs(p => ({...p,[store.id+plan.id]:true})); t2(`🌿 Subscribed to "${plan.name}"!`); };
  const openStore = (s) => { setSelSt(s); setScr(SC.STORE); window.scrollTo(0,0); };
  const goHome = () => { setScr(SC.HOME); setSelSt(null); };
  const goApply = () => { setScr(SC.APPLY); window.scrollTo(0,0); };
  const cTot = cart.reduce((s,i) => s+i.price*i.qty, 0);
  const cCnt = cart.reduce((s,i) => s+i.qty, 0);
  const shipCost = oInfo.ship==="express" ? 12.99 : cTot>45 ? 0 : 5.99;
  const visStores = stores.filter(s => !s.banned);
  const filtSt = (cat==="all" ? visStores : visStores.filter(s=>s.category===cat))
    .sort((a,b) => (b.featured?1:0)-(a.featured?1:0) || (b.tier==="fullbloom"?1:0)-(a.tier==="fullbloom"?1:0));

  return (
    <div style={{fontFamily:"'Crimson Text',Georgia,serif",background:C.cream,minHeight:"100vh",color:C.walnut}}>
      <style>{CSS}</style>

      {/* NAV */}
      <header className="wood" style={{color:C.cream,padding:"0 22px",display:"flex",alignItems:"center",justifyContent:"space-between",height:62,position:"sticky",top:0,zIndex:50,boxShadow:scrolled?"0 2px 20px rgba(0,0,0,.25)":"none",transition:"box-shadow .3s",borderBottom:`1px solid ${C.walnut}`}}>
        <div onClick={goHome} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:22}}>🌿</span>
          <div>
            <div className="pf" style={{fontSize:21,fontWeight:700,lineHeight:1}}>Rooted</div>
            <div className="cr" style={{fontSize:9,opacity:.4,letterSpacing:".22em",textTransform:"uppercase",lineHeight:1}}>Market</div>
          </div>
        </div>
        <nav style={{display:"flex",gap:18,alignItems:"center"}}>
          <span className="cr" onClick={goHome} style={{fontSize:14,opacity:.75,cursor:"pointer"}}>Browse</span>
          <span className="cr" style={{fontSize:14,opacity:.75,cursor:"pointer"}} onClick={()=>{setScr(SC.BARTER);window.scrollTo(0,0);}}>🤝 Trade</span>
          <span className="cr" style={{fontSize:14,opacity:.75,cursor:"pointer"}} onClick={()=>{setScr(SC.PRICING);window.scrollTo(0,0);}}>Sell</span>
          <span className="cr" style={{fontSize:12,opacity:.35,cursor:"pointer"}} onClick={()=>{setScr(SC.ADMIN);window.scrollTo(0,0);}}>⚙</span>
          <button className="btn" onClick={()=>setCartOpen(true)} style={{background:C.cream,color:C.pine,borderRadius:2,padding:"6px 14px",display:"flex",alignItems:"center",gap:6,fontFamily:"'Crimson Text',serif",fontSize:14}}>
            🧺{cCnt>0&&<span style={{background:C.leaf,color:"#fff",borderRadius:"50%",width:17,height:17,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700}}>{cCnt}</span>}
          </button>
        </nav>
      </header>

      {/* SCREEN ROUTING */}
      {scr===SC.HOME && (
        <>
          {/* Hero */}
          <div style={{background:`linear-gradient(160deg,${C.pine} 0%,${C.moss} 55%,${C.bark} 100%)`,color:C.cream,padding:"0 28px",minHeight:520,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",textAlign:"center"}}>
            <HP/>
            <div style={{position:"absolute",inset:0,backgroundImage:`url('/mnt/user-data/uploads/IMG_7222.jpeg')`,backgroundSize:"cover",backgroundPosition:"center 40%",opacity:.16}}/>
            <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>
              {["🍃","🌿","🍃","🌱","🍃","🌿","🌾","🍃","🌿","🍃"].map((l,i)=>(
                <div key={i} style={{position:"absolute",fontSize:14+i%3*7,opacity:.1+i%3*.06,top:`${8+i*9}%`,left:`${2+i*11}%`,transform:`rotate(${-30+i*18}deg)`}}>{l}</div>
              ))}
            </div>
            <Branch side="left"/><Branch side="right"/>
            <div style={{position:"relative",maxWidth:680,paddingTop:65}}>
              <div className="fell" style={{fontSize:11,letterSpacing:".22em",textTransform:"uppercase",color:C.fog,marginBottom:14,opacity:.85}}>Rooted Market · The market that never closes</div>
              <h1 className="pf" style={{fontSize:50,fontWeight:700,lineHeight:1.08,marginBottom:20,textShadow:"0 2px 24px rgba(0,0,0,.4)"}}>Straight from<br/><em style={{color:C.straw}}>the hands that made it.</em></h1>
              <p className="cr" style={{fontSize:17,lineHeight:1.95,opacity:.92,maxWidth:520,margin:"0 auto 8px"}}>Inspired by homegrown beginnings, early mornings, and creativity sparked by everyday moments.</p>
              <p className="cr" style={{fontSize:17,lineHeight:1.95,opacity:.92,maxWidth:520,margin:"0 auto 8px"}}>Crafted slowly, made intentionally, and created by hands that care.</p>
              <p className="fell" style={{fontSize:18,fontStyle:"italic",opacity:.78,marginBottom:28,letterSpacing:".02em"}}>All of it real. All of it handmade.</p>
              <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:28}}>
                {["🌿 Made by hand","📍 Find them IRL","🏡 Home pickup","📦 Ships direct","🤝 Trade Table","💅 Beauty & wellness","💻 Virtual services"].map(t=>(
                  <span key={t} className="cr" style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",borderRadius:2,padding:"5px 11px",fontSize:13}}>{t}</span>
                ))}
              </div>
              <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
                <button className="btn" style={{fontSize:15,padding:"12px 28px",background:C.cream,color:C.pine,borderRadius:2,fontFamily:"'Crimson Text',serif"}} onClick={()=>document.getElementById("stores")?.scrollIntoView({behavior:"smooth"})}>Explore the Market</button>
                <button className="btn bg" style={{fontSize:15,padding:"12px 24px"}} onClick={()=>{setScr(SC.BARTER);window.scrollTo(0,0);}}>🤝 Trade Table</button>
                <button className="btn bo" style={{color:C.cream,borderColor:C.fog,fontSize:15,padding:"12px 22px"}} onClick={goApply}>Open Your Store</button>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div style={{background:C.walnut,color:C.cream,padding:"28px 28px",display:"flex",justifyContent:"center",gap:36,flexWrap:"wrap",borderBottom:`3px solid ${C.bark}`}}>
            {[{icon:"🤝",title:"Vetted always",desc:"Every seller reviewed by a real person. Didn't make it? You're not here."},{icon:"🏡",title:"Home stands welcome",desc:"Your front-yard crate counts. Your porch herb bundles count."},{icon:"🔄",title:"Trade your work",desc:"The Trade Table — makers swapping with makers. No cash needed."},{icon:"🎨",title:"All crafts welcome",desc:"Herbs, bread, pottery, crochet, nails, locs, candles, art — all here."}].map(item=>(
              <div key={item.title} style={{textAlign:"center",maxWidth:180}}>
                <div style={{fontSize:24,marginBottom:7}}>{item.icon}</div>
                <div className="pf" style={{fontSize:14,marginBottom:4,color:C.straw}}>{item.title}</div>
                <div className="cr" style={{fontSize:13,opacity:.7,lineHeight:1.7}}>{item.desc}</div>
              </div>
            ))}
          </div>

          {/* Photo strip */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",height:200,overflow:"hidden"}}>
            {["/mnt/user-data/uploads/IMG_7224.jpeg","/mnt/user-data/uploads/IMG_7223.jpeg","/mnt/user-data/uploads/IMG_7222.jpeg"].map((src,i)=>(
              <div key={i} style={{overflow:"hidden"}}>
                <img src={src} alt="" style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(.85) saturate(1.1)",transition:"transform .5s",display:"block"}}
                  onMouseEnter={e=>e.currentTarget.style.transform="scale(1.06)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>
              </div>
            ))}
          </div>

          {/* Store grid */}
          <div id="stores" style={{maxWidth:1080,margin:"0 auto",padding:"40px 22px"}}>
            <div style={{textAlign:"center",marginBottom:28}}>
              <div className="fell" style={{fontSize:11,letterSpacing:".2em",textTransform:"uppercase",color:C.sage,marginBottom:8}}>The Growers, Makers & Market Besties</div>
              <h2 className="pf" style={{fontSize:32,color:C.pine,marginBottom:8}}>Who's at the market today</h2>
              <p className="cr" style={{fontSize:15,color:C.bark,maxWidth:480,margin:"0 auto"}}>Every store here passed a real application. Every product was made by the person whose name is on it.</p>
            </div>
            <div style={{display:"flex",gap:7,flexWrap:"wrap",justifyContent:"center",marginBottom:24}}>
              {CATS.map(c=><button key={c.id} className={`cpill${cat===c.id?" on":""}`} onClick={()=>setCat(c.id)}>{c.icon} {c.label}</button>)}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(275px,1fr))",gap:18}}>
              {filtSt.map(s=>(
                <div key={s.id} className={`card${s.featured?" feat":""}`} style={{padding:22}} onClick={()=>openStore(s)}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:11}}>
                    <span style={{fontSize:42,filter:"drop-shadow(0 3px 6px rgba(0,0,0,.12))"}}>{s.avatar}</span>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5}}>
                      {s.verified&&<span className="bdg bl">✓ Verified</span>}
                      <TBadge tier={s.tier} sz={11}/>
                      {s.featured&&<span className="bdg bgd">⭐ Featured</span>}
                      {(s.barter||[]).length>0&&<span className="bdg" style={{background:"#f5e8c0",color:"#7a5a10",fontSize:10}}>🤝 Trades</span>}
                    </div>
                  </div>
                  <h3 className="pf" style={{fontSize:18,color:C.pine,marginBottom:3}}>{s.name}</h3>
                  <div className="cr" style={{color:C.sage,fontSize:12,marginBottom:8}}>by {s.owner} · {s.location}</div>
                  <span style={{background:C.straw,color:C.bark,fontSize:11,padding:"2px 8px",borderRadius:2,fontFamily:"Crimson Text,serif",display:"inline-block",marginBottom:10}}>{s.tag}</span>
                  <p className="cr" style={{fontSize:13,color:C.bark,lineHeight:1.7,marginBottom:12}}>{s.bio.slice(0,105)}…</p>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:9}}>
                    {s.products.slice(0,3).map(p=>(
                      <span key={p.id} style={{background:C.parchment,border:`1px solid ${C.straw}`,borderRadius:2,padding:"2px 7px",fontSize:11,fontFamily:"Crimson Text,serif",color:C.bark}}>{p.img} {p.name.split(" ").slice(0,3).join(" ")}</span>
                    ))}
                  </div>
                  {s.appearances.length>0&&<div className="cr" style={{fontSize:11,color:C.sage,borderTop:`1px solid ${C.straw}`,paddingTop:7}}>📍 {s.appearances[0].event} · {s.appearances[0].date}</div>}
                </div>
              ))}
            </div>

            {/* Trade CTA */}
            <div style={{marginTop:36,background:`linear-gradient(135deg,${C.bark} 0%,${C.walnut} 100%)`,borderRadius:3,padding:"28px 36px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:18,position:"relative",overflow:"hidden"}}>
              <Branch side="right"/>
              <div style={{position:"relative",color:C.cream}}>
                <div style={{fontSize:26,marginBottom:7}}>🤝</div>
                <h3 className="pf" style={{fontSize:20,marginBottom:5,color:C.straw}}>The Trade Table is open.</h3>
                <p className="cr" style={{fontSize:14,opacity:.8,maxWidth:420,lineHeight:1.85}}>Bread for nails, ceramics for candles, herb kits for art prints. No cash needed.</p>
              </div>
              <button className="btn bg" style={{fontSize:14,padding:"11px 24px",whiteSpace:"nowrap",position:"relative"}} onClick={()=>{setScr(SC.BARTER);window.scrollTo(0,0);}}>Browse Trades →</button>
            </div>

            {/* Apply CTA */}
            <div style={{marginTop:14,background:C.parchment,border:`1px solid ${C.straw}`,borderRadius:3,padding:"26px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16,position:"relative",overflow:"hidden"}}>
              <Branch side="right"/>
              <div style={{position:"relative"}}>
                <div style={{fontSize:26,marginBottom:7}}>🏡</div>
                <h3 className="pf" style={{fontSize:19,color:C.pine,marginBottom:6}}>Got a crate on your porch? You're one of us.</h3>
                <p className="cr" style={{fontSize:14,color:C.bark,maxWidth:440,lineHeight:1.8}}>Home herb stand, garage studio, living room crochet stash, home salon — Rooted is where your people find you.</p>
              </div>
              <div style={{display:"flex",gap:9,flexDirection:"column",position:"relative"}}>
                <button className="btn bp" style={{fontSize:14,padding:"11px 24px"}} onClick={goApply}>Apply to Sell — $25</button>
                <button className="btn bo" style={{fontSize:13,padding:"8px 18px"}} onClick={()=>{setScr(SC.PRICING);window.scrollTo(0,0);}}>View seller plans</button>
              </div>
            </div>

            {/* Manifesto */}
            <div style={{marginTop:14,background:`linear-gradient(135deg,${C.pine} 0%,${C.walnut} 100%)`,color:C.cream,borderRadius:3,padding:"40px 44px",textAlign:"center",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",inset:0,opacity:.05,backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",backgroundSize:"24px 24px"}}/>
              <Branch side="left"/><Branch side="right"/>
              <div style={{position:"relative"}}>
                <div style={{fontSize:28,marginBottom:12}}>🌿</div>
                <div className="fell" style={{fontSize:10,letterSpacing:".22em",textTransform:"uppercase",opacity:.4,marginBottom:14}}>What Rooted stands for</div>
                <h2 className="pf" style={{fontSize:24,fontStyle:"italic",marginBottom:14,color:C.straw}}>"If you didn't make it, you can't sell it here."</h2>
                <p className="cr" style={{fontSize:16,opacity:.8,maxWidth:540,margin:"0 auto 8px",lineHeight:2}}>Inspired by homegrown beginnings, early mornings, and creativity sparked by everyday moments.</p>
                <p className="cr" style={{fontSize:16,opacity:.8,maxWidth:540,margin:"0 auto 8px",lineHeight:2}}>Crafted slowly, made intentionally, and created by hands that care.</p>
                <p className="fell" style={{fontSize:17,fontStyle:"italic",opacity:.65,marginBottom:24}}>All of it real. All of it handmade.</p>
                <button className="btn bo" style={{color:C.cream,borderColor:`${C.fog}88`,fontSize:14,padding:"10px 24px"}} onClick={goApply}>Apply to Open Your Store 🌱</button>
              </div>
            </div>
          </div>
        </>
      )}

      {scr===SC.STORE && <StorePage store={selSt} goHome={goHome} addCart={addCart} getQty={gQ} setQty={sQ} subs={subs} doSub={doSub} t2={t2}/>}
      {scr===SC.BARTER && <BarterPage stores={stores} goHome={goHome} goApply={goApply} openStore={openStore} t2={t2}/>}
      {scr===SC.APPLY && <ApplyPage goHome={goHome} onSubmit={()=>{}} />}
      {scr===SC.PRICING && <PricingPage goHome={goHome} goApply={goApply}/>}
      {scr===SC.ADMIN && <AdminPage stores={stores} setStores={setStores} apps={apps} setApps={setApps} banList={banList} setBanList={setBanList} goHome={goHome} t2={t2}/>}

      {scr===SC.CONFIRM && (
        <div style={{maxWidth:500,margin:"80px auto",padding:"0 24px",textAlign:"center"}}>
          <div style={{fontSize:50,marginBottom:16}}>🌱</div>
          <h1 className="pf" style={{fontSize:34,color:C.pine,marginBottom:10}}>It's on its way!</h1>
          <p className="cr" style={{fontSize:16,color:C.bark,lineHeight:1.8,marginBottom:8}}>Order <strong>{oNum}</strong> confirmed. A real person is packing this by hand.</p>
          <p className="cr" style={{fontSize:13,color:C.sage,marginBottom:32}}>Check your email for details.</p>
          <LD/>
          <button className="btn bp" style={{marginTop:24,fontSize:14,padding:"11px 32px"}} onClick={goHome}>Back to the Market</button>
        </div>
      )}

      {scr===SC.CHECKOUT && (
        <div style={{maxWidth:860,margin:"0 auto",padding:"36px 22px",display:"grid",gridTemplateColumns:"1fr 290px",gap:28,alignItems:"start"}}>
          <div>
            <button onClick={goHome} className="btn cr" style={{color:C.sage,marginBottom:22,fontSize:14,background:"none",padding:0}}>← Back</button>
            <h2 className="pf" style={{fontSize:26,color:C.pine,marginBottom:22}}>Almost there 🌿</h2>
            <form onSubmit={e=>{e.preventDefault();setCart([]);setCartOpen(false);setScr(SC.CONFIRM);window.scrollTo(0,0);}}>
              {[
                {title:"Where are we sending this?",body:(
                  <>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                      <FL label="Full Name" mb={0}><FI required placeholder="Your name" value={oInfo.name} onChange={e=>setOInfo(p=>({...p,name:e.target.value}))}/></FL>
                      <FL label="Email" mb={0}><FI required type="email" placeholder="you@email.com" value={oInfo.email} onChange={e=>setOInfo(p=>({...p,email:e.target.value}))}/></FL>
                    </div>
                    <FL label="Street Address" mb={12}><FI required placeholder="123 Any St" value={oInfo.address} onChange={e=>setOInfo(p=>({...p,address:e.target.value}))}/></FL>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 110px",gap:12}}>
                      <FL label="City" mb={0}><FI required placeholder="City" value={oInfo.city} onChange={e=>setOInfo(p=>({...p,city:e.target.value}))}/></FL>
                      <FL label="ZIP" mb={0}><FI required placeholder="00000" value={oInfo.zip} onChange={e=>setOInfo(p=>({...p,zip:e.target.value}))}/></FL>
                    </div>
                  </>
                )},
                {title:"How fast?",body:(
                  [{val:"standard",label:"Standard (5–7 days)",note:cTot>45?"Free — you hit $45!":"$5.99"},{val:"express",label:"Express (2–3 days)",note:"$12.99"}].map(o=>(
                    <label key={o.val} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 0",borderBottom:`1px solid ${C.straw}`,cursor:"pointer"}}>
                      <input type="radio" name="ship" value={o.val} checked={oInfo.ship===o.val} onChange={e=>setOInfo(p=>({...p,ship:e.target.value}))}/>
                      <div><div className="cr" style={{fontSize:15}}>{o.label}</div><div className="cr" style={{fontSize:12,color:C.sage}}>{o.note}</div></div>
                    </label>
                  ))
                )},
                {title:"Payment",body:(
                  <>
                    <FL label="Card Number" mb={12}><FI required placeholder="•••• •••• •••• ••••" maxLength={19}/></FL>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                      <FL label="Expiry" mb={0}><FI required placeholder="MM / YY"/></FL>
                      <FL label="CVC" mb={0}><FI required placeholder="•••" maxLength={4}/></FL>
                    </div>
                  </>
                )},
              ].map(s=>(
                <div key={s.title} style={{background:C.cream,border:`1px solid ${C.straw}`,borderRadius:3,padding:22,marginBottom:14}}>
                  <h3 className="pf" style={{fontSize:17,color:C.pine,marginBottom:14}}>{s.title}</h3>
                  {s.body}
                </div>
              ))}
              <button type="submit" className="btn bp" style={{width:"100%",padding:13,fontSize:16}}>Place Order · ${(cTot+shipCost).toFixed(2)}</button>
            </form>
          </div>
          <div style={{background:C.parchment,border:`1px solid ${C.straw}`,borderRadius:3,padding:18,position:"sticky",top:76}}>
            <h3 className="pf" style={{fontSize:17,color:C.pine,marginBottom:12}}>Your Order</h3>
            {cart.map(i=>(
              <div key={i.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.straw}`}}>
                <div><div className="cr" style={{fontSize:13}}>{i.img} {i.name}</div><div className="cr" style={{fontSize:11,color:C.sage}}>from {i.store} · {i.qty}×</div></div>
                <div className="cr" style={{fontSize:13}}>${(i.price*i.qty).toFixed(2)}</div>
              </div>
            ))}
            <div style={{marginTop:10}}>
              {[["Subtotal",`$${cTot.toFixed(2)}`],["Shipping",shipCost===0?"Free 🌿":`$${shipCost.toFixed(2)}`]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0"}}><span className="cr" style={{color:C.bark,fontSize:13}}>{k}</span><span className="cr" style={{fontSize:13}}>{v}</span></div>
              ))}
              <div style={{borderTop:`1px solid ${C.straw}`,marginTop:7,paddingTop:9,display:"flex",justifyContent:"space-between"}}>
                <span className="pf" style={{fontSize:16,color:C.pine}}>Total</span>
                <span className="pf" style={{fontSize:17,color:C.pine}}>${(cTot+shipCost).toFixed(2)}</span>
              </div>
              <p className="cr" style={{fontSize:10,color:C.sage,marginTop:7}}>2% Rooted fee included. Sellers keep 98%.</p>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <>
          <div className="ov" onClick={()=>setCartOpen(false)}/>
          <div className="drawer">
            <div style={{padding:"18px 20px 12px",borderBottom:`1px solid ${C.straw}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:C.parchment}}>
              <div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:18}}>🧺</span><h3 className="pf" style={{fontSize:18,color:C.pine}}>Your Basket</h3></div>
              <button onClick={()=>setCartOpen(false)} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:C.sage}}>✕</button>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"12px 20px"}}>
              {cart.length===0 ? (
                <div style={{textAlign:"center",paddingTop:56}}>
                  <div style={{fontSize:44,marginBottom:12}}>🧺</div>
                  <p className="cr" style={{color:C.sage,fontSize:16,lineHeight:1.7}}>Nothing here yet.<br/>Go find something good.</p>
                </div>
              ) : cart.map(item=>(
                <div key={item.id} style={{padding:"11px 0",borderBottom:`1px solid ${C.straw}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                    <div><div className="cr" style={{fontSize:14}}>{item.img} {item.name}</div><div className="cr" style={{fontSize:11,color:C.sage}}>from {item.store}</div></div>
                    <div className="cr" style={{fontSize:14}}>${(item.price*item.qty).toFixed(2)}</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <div className="qc"><button className="qb" style={{width:26,height:26}} onClick={()=>updQ(item.id,-1)}>−</button><span className="qn" style={{width:28,height:26,lineHeight:"26px"}}>{item.qty}</span><button className="qb" style={{width:26,height:26}} onClick={()=>updQ(item.id,1)}>+</button></div>
                    <button onClick={()=>rmCart(item.id)} className="btn cr" style={{color:"#b04040",fontSize:12,background:"none",padding:0}}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
            {cart.length>0 && (
              <div style={{padding:18,borderTop:`1px solid ${C.straw}`,background:C.parchment}}>
                {cTot>45 && <div className="cr" style={{color:C.moss,fontSize:12,marginBottom:8}}>🌿 Free standard shipping unlocked!</div>}
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                  <span className="cr" style={{fontSize:16}}>Subtotal</span>
                  <span className="pf" style={{fontSize:18,color:C.pine}}>${cTot.toFixed(2)}</span>
                </div>
                <button className="btn bp" style={{width:"100%",padding:12,fontSize:15}} onClick={()=>{setCartOpen(false);setScr(SC.CHECKOUT);window.scrollTo(0,0);}}>Checkout →</button>
              </div>
            )}
          </div>
        </>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}