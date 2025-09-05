// Normal words list (initial pool)
const normalWords = [
  'a','about','above','after','again','all','always','am','an','and','any','are','around','as','ask','at','away','back','bad','be',
  'because','bed','been','before','begin','best','better','big','bird','black','blue','book','both','boy','bring','brother','but','buy','by','call','came',
  'can','car','cat','child','clean','close','cold','come','cook','cool','could','day','did','do','does','dog','don\'t','door','down','drink',
  'each','eat','end','every','eye','face','family','far','fast','father','find','first','five','food','for','friend','from','full','fun','game',
  'get','girl','give','go','good','great','green','had','half','hand','happy','hard','has','have','he','help','her','here','him','his',
  'home','house','how','hundred','I','if','in','into','is','it','its','just','keep','kind','know','land','last','later','learn','leave',
  'left','let','life','light','like','little','live','long','look','love','made','make','man','many','may','me','mean','men','might','milk',
  'money','month','more','most','mother','much','must','my','name','near','need','never','new','next','night','no','not','now','number','of',
  'off','old','on','once','one','only','open','or','other','our','out','over','own','paper','part','people','pick','place','play','please',
  'put','rain','read','red','right','river','room','run','said','same','saw','say','school','see','seven','shall','she','ship','shoe','shop',
  'short','should','show','sister','sit','six','sleep','small','so','some','soon','sound','start','stay','still','stop','story','street','strong','study',
  'such','summer','sun','table','take','talk','teacher','tell','ten','than','thank','that','the','their','them','then','there','these','they','thing',
  'think','this','those','three','time','to','today','together','too','try','turn','two','under','up','us','use','very','wait','walk','want',
  'warm','was','wash','watch','water','way','we','week','well','went','were','what','when','where','which','white','who','why','will','win',
  'winter','with','woman','work','world','would','write','year','yellow','yes','you','young','your','after','apple','arm','away','bag','ball','band',
  'bank','bath','beach','bear','bed','bell','best','bird','birthday','body','box','bread','breakfast','bridge','brother','bus','cake','call','camera','camp',
  'card','care','chair','cheese','chicken','child','city','class','clock','cloud','coat','coffee','color','corn','country','cow','cup','cut','dance','dark',
  'desk','doctor','doll','dress','drop','ear','egg','eight','farm','farmer','fast','father','field','fire','fish','floor','flower','food','foot','forest',
  'garden','gate','girl','glass','glove','goat','ground','hair','hand','hat','head','heart','hill','horse','hospital','hot','house','ice','island','jam',
  'juice','key','king','kitchen','lake','lamp','leaf','leg','letter','line','lion','map','market','match','milk','money','moon','morning','mountain','mouth',
  'name','nest','nose','ocean','office','oil','orange','page','pain','paint','park','party','pen','pencil','pet','picture','pig','plane','plant','pocket',
  'post','queen','rabbit','rain','rice','ring','road','roof','root','rose','salt','sand','school','sea','seat','sheep','shoe','shop','sister','sky',
  'sleep','smoke','snow','soap','sock','song','spoon','star','stone','store','street','sugar','summer','sun','table','tail','tea','team','tent','test',
  'time','toe','town','toy','train','tree','watch','water','week','well','wheel','wind','window','wood','wool','zoo','above','across','act','add',
  'age','air','alone','animal','answer','area','baby','back','bag','ball','band','base','bear','beat','beauty','bed','bell','best','bird','bit',
  'black','blood','boat','body','bone','book','born','box','boy','bread','break','brother','brown','buy','call','camp','care','carry','case','catch',
  'chair','chance','change','check','child','choose','city','clean','clear','climb','clock','close','coat','cold','color','come','cook','cool','corn','cost',
  'country','course','cover','cross','cry','cut','dance','dark','day','dead','deal','dear','death','deep','desk','die','dog','door','down','draw',
  'dress','drink','drive','drop','dry','ear','earth','east','eat','edge','eight','end','evening','eye','face','fact','fall','family','farm','fast',
  'fat','father','fear','feel','few','field','fight','fill','find','fire','fish','five','floor','fly','food','foot','form','free','friend','full'
];

// Extra words to be introduced as time passes
const extraWords = [
  'computer','keyboard','monitor','spaceship','asteroid','galaxy','planet','universe','rocket','engine',
  'laser','shield','weapon','battle','victory','challenge','adventure','explore','discover','research',
  'science','technology','mission','journey','destination','navigation','communication','satellite','exercise','library',
  'battery','control','program','process','feature','network','package','service','message','channel'
];

// Advanced words for late game
const advancedWords = [
  'extraordinary','incomprehensible','electromagnetic','quantum','phenomenon','acceleration','gravitational',
  'atmospheric','astronomical','interstellar','extraterrestrial','technological','revolutionary','sophisticated',
  'unprecedented','multidimensional','transcendental','reconnaissance','metamorphosis','crystallography','supernova',
  'constellation','microbiology','biochemistry','neuroscience','cryptography','thermodynamics','aerodynamics'
];

// Return a word appropriate for elapsedSeconds (in seconds). If no elapsedSeconds provided, default to initial pool.
export function getRandomWord(elapsedSeconds: number = 0): string {
  // Early game: first 30s -> only normal words
  if (elapsedSeconds < 30) {
    return normalWords[Math.floor(Math.random() * normalWords.length)];
  }

  // Mid game: 30s - 120s -> mostly normal, sometimes extra
  if (elapsedSeconds < 120) {
    // 75% normal, 25% extra
    return Math.random() < 0.75
      ? normalWords[Math.floor(Math.random() * normalWords.length)]
      : extraWords[Math.floor(Math.random() * extraWords.length)];
  }

  // Late game: >120s -> mix normal, extra and advanced
  const r = Math.random();
  if (r < 0.6) {
    return normalWords[Math.floor(Math.random() * normalWords.length)];
  } else if (r < 0.9) {
    return extraWords[Math.floor(Math.random() * extraWords.length)];
  } else {
    return advancedWords[Math.floor(Math.random() * advancedWords.length)];
  }
}

export { normalWords, extraWords, advancedWords };
