import { JamoCard, WordCard, HandwritingItem, QuizItem, Sticker } from "../types";

// 1. 자음 카드 (14개)
export const CONSONANT_CARDS: JamoCard[] = [
  { id: "c1", char: "ㄱ", type: "consonant", name: "기역", soundSpelling: "그", exampleWord: "강아지", emoji: "🐶", bgColor: "bg-rose-100 text-rose-800 border-rose-300" },
  { id: "c2", char: "ㄴ", type: "consonant", name: "니은", soundSpelling: "느", exampleWord: "나비", emoji: "🦋", bgColor: "bg-amber-100 text-amber-800 border-amber-300" },
  { id: "c3", char: "ㄷ", type: "consonant", name: "디귿", soundSpelling: "드", exampleWord: "다람쥐", emoji: "🐿️", bgColor: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { id: "c4", char: "ㄹ", type: "consonant", name: "리을", soundSpelling: "르", exampleWord: "라디오", emoji: "📻", bgColor: "bg-sky-100 text-sky-800 border-sky-300" },
  { id: "c5", char: "ㅁ", type: "consonant", name: "미음", soundSpelling: "므", exampleWord: "모자", emoji: "🧢", bgColor: "bg-indigo-100 text-indigo-800 border-indigo-300" },
  { id: "c6", char: "ㅂ", type: "consonant", name: "비읍", soundSpelling: "브", exampleWord: "바나나", emoji: "🍌", bgColor: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  { id: "c7", char: "ㅅ", type: "consonant", name: "시옷", soundSpelling: "스", exampleWord: "사과", emoji: "🍎", bgColor: "bg-red-100 text-red-800 border-red-300" },
  { id: "c8", char: "ㅇ", type: "consonant", name: "이응", soundSpelling: "으", exampleWord: "오리", emoji: "🦆", bgColor: "bg-teal-100 text-teal-800 border-teal-300" },
  { id: "c9", char: "ㅈ", type: "consonant", name: "지읒", soundSpelling: "즈", exampleWord: "자동차", emoji: "🚗", bgColor: "bg-blue-100 text-blue-800 border-blue-300" },
  { id: "c10", char: "ㅊ", type: "consonant", name: "치읓", soundSpelling: "츠", exampleWord: "기차", emoji: "🚂", bgColor: "bg-purple-100 text-purple-800 border-purple-300" },
  { id: "c11", char: "ㅋ", type: "consonant", name: "키읔", soundSpelling: "크", exampleWord: "코끼리", emoji: "🐘", bgColor: "bg-pink-100 text-pink-800 border-pink-300" },
  { id: "c12", char: "ㅌ", type: "consonant", name: "티읕", soundSpelling: "트", exampleWord: "토끼", emoji: "🐰", bgColor: "bg-orange-100 text-orange-800 border-orange-300" },
  { id: "c13", char: "ㅍ", type: "consonant", name: "피읖", soundSpelling: "프", exampleWord: "포도", emoji: "🍇", bgColor: "bg-violet-100 text-violet-800 border-violet-300" },
  { id: "c14", char: "ㅎ", type: "consonant", name: "히읗", soundSpelling: "흐", exampleWord: "호랑이", emoji: "🐯", bgColor: "bg-lime-100 text-lime-800 border-lime-300" },
];

// 2. 모음 카드 (10개)
export const VOWEL_CARDS: JamoCard[] = [
  { id: "v1", char: "ㅏ", type: "vowel", name: "아", soundSpelling: "아", exampleWord: "아기", emoji: "👶", bgColor: "bg-amber-100 text-amber-800 border-amber-300" },
  { id: "v2", char: "ㅑ", type: "vowel", name: "야", soundSpelling: "야", exampleWord: "야구", emoji: "⚾", bgColor: "bg-orange-100 text-orange-800 border-orange-300" },
  { id: "v3", char: "ㅓ", type: "vowel", name: "어", soundSpelling: "어", exampleWord: "어머니", emoji: "👩", bgColor: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { id: "v4", char: "ㅕ", type: "vowel", name: "여", soundSpelling: "여", exampleWord: "여우", emoji: "🦊", bgColor: "bg-lime-100 text-lime-800 border-lime-300" },
  { id: "v5", char: "ㅗ", type: "vowel", name: "오", soundSpelling: "오", exampleWord: "오리", emoji: "🦆", bgColor: "bg-sky-100 text-sky-800 border-sky-300" },
  { id: "v6", char: "ㅛ", type: "vowel", name: "요", soundSpelling: "요", exampleWord: "요리", emoji: "🍳", bgColor: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  { id: "v7", char: "ㅜ", type: "vowel", name: "우", soundSpelling: "우", exampleWord: "우산", emoji: "☂️", bgColor: "bg-blue-100 text-blue-800 border-blue-300" },
  { id: "v8", char: "ㅠ", type: "vowel", name: "유", soundSpelling: "유", exampleWord: "유치원", emoji: "🏫", bgColor: "bg-indigo-100 text-indigo-800 border-indigo-300" },
  { id: "v9", char: "ㅡ", type: "vowel", name: "으", soundSpelling: "으", exampleWord: "으뜸", emoji: "👍", bgColor: "bg-violet-100 text-violet-800 border-violet-300" },
  { id: "v10", char: "ㅣ", type: "vowel", name: "이", soundSpelling: "이", exampleWord: "이빨", emoji: "🦷", bgColor: "bg-rose-100 text-rose-800 border-rose-300" },
];

// 3. 기초 음절 (가, 나, 다, 라...)
export const SYLLABLE_CARDS: JamoCard[] = [
  { id: "s1", char: "가", type: "syllable", name: "가", soundSpelling: "ㄱ + ㅏ = 가", exampleWord: "가방", emoji: "🎒", bgColor: "bg-red-50 text-red-700 border-red-200" },
  { id: "s2", char: "나", type: "syllable", name: "나", soundSpelling: "ㄴ + ㅏ = 나", exampleWord: "나비", emoji: "🦋", bgColor: "bg-amber-50 text-amber-700 border-amber-200" },
  { id: "s3", char: "다", type: "syllable", name: "다", soundSpelling: "ㄷ + ㅏ = 다", exampleWord: "다람쥐", emoji: "🐿️", bgColor: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { id: "s4", char: "라", type: "syllable", name: "라", soundSpelling: "ㄹ + ㅏ = 라", exampleWord: "라면", emoji: "🍜", bgColor: "bg-sky-50 text-sky-700 border-sky-200" },
  { id: "s5", char: "마", type: "syllable", name: "마", soundSpelling: "ㅁ + ㅏ = 마", exampleWord: "마을", emoji: "🏡", bgColor: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { id: "s6", char: "바", type: "syllable", name: "바", soundSpelling: "ㅂ + ㅏ = 바", exampleWord: "바나나", emoji: "🍌", bgColor: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { id: "s7", char: "사", type: "syllable", name: "사", soundSpelling: "ㅅ + ㅏ = 사", exampleWord: "사과", emoji: "🍎", bgColor: "bg-rose-50 text-rose-700 border-rose-200" },
  { id: "s8", char: "아", type: "syllable", name: "아", soundSpelling: "ㅇ + ㅏ = 아", exampleWord: "아기", emoji: "👶", bgColor: "bg-teal-50 text-teal-700 border-teal-200" },
  { id: "s9", char: "자", type: "syllable", name: "자", soundSpelling: "ㅈ + ㅏ = 자", exampleWord: "자전거", emoji: "🚲", bgColor: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "s10", char: "차", type: "syllable", name: "차", soundSpelling: "ㅊ + ㅏ = 차", exampleWord: "자동차", emoji: "🚗", bgColor: "bg-purple-50 text-purple-700 border-purple-200" },
  { id: "s11", char: "카", type: "syllable", name: "카", soundSpelling: "ㅋ + ㅏ = 카", exampleWord: "카메라", emoji: "📷", bgColor: "bg-pink-50 text-pink-700 border-pink-200" },
  { id: "s12", char: "타", type: "syllable", name: "타", soundSpelling: "ㅌ + ㅏ = 타", exampleWord: "타조", emoji: "🦩", bgColor: "bg-orange-50 text-orange-700 border-orange-200" },
  { id: "s13", char: "파", type: "syllable", name: "파", soundSpelling: "ㅍ + ㅏ = 파", exampleWord: "파인애플", emoji: "🍍", bgColor: "bg-violet-50 text-violet-700 border-violet-200" },
  { id: "s14", char: "하", type: "syllable", name: "하", soundSpelling: "ㅎ + ㅏ = 하", exampleWord: "하마", emoji: "🦛", bgColor: "bg-lime-50 text-lime-700 border-lime-200" },
];

// 4. 초등 기초 낱말 카드
export const WORD_CARDS: WordCard[] = [
  // 동물
  { id: "w_anim_1", word: "강아지", category: "animals", syllables: ["강", "아", "지"], emoji: "🐶", bgColor: "bg-amber-100 border-amber-300 text-amber-900", exampleSentence: "귀여운 강아지가 멍멍 짖어요.", hint: "멍멍! 꼬리를 치는 귀여운 동물이에요." },
  { id: "w_anim_2", word: "고양이", category: "animals", syllables: ["고", "양", "이"], emoji: "🐱", bgColor: "bg-orange-100 border-orange-300 text-orange-900", exampleSentence: "야옹 고양이가 세수를 해요.", hint: "야옹야옹 소리를 내는 동물이에요." },
  { id: "w_anim_3", word: "토끼", category: "animals", syllables: ["토", "끼"], emoji: "🐰", bgColor: "bg-pink-100 border-pink-300 text-pink-900", exampleSentence: "귀가 긴 토끼가 깡충깡충 뛰어갑니다.", hint: "귀가 길고 깡충깡충 뛰어요." },
  { id: "w_anim_4", word: "호랑이", category: "animals", syllables: ["호", "랑", "이"], emoji: "🐯", bgColor: "bg-yellow-100 border-yellow-300 text-yellow-900", exampleSentence: "멋진 호랑이가 어흥 하고 울어요.", hint: "어흥! 줄무늬가 멋진 정글의 왕이에요." },
  { id: "w_anim_5", word: "병아리", category: "animals", syllables: ["병", "아", "리"], emoji: "🐥", bgColor: "bg-lime-100 border-lime-300 text-lime-900", exampleSentence: "노란 병아리가 삐약삐약 모이를 먹어요.", hint: "삐약삐약 소리를 내는 노란 아기 새예요." },
  { id: "w_anim_6", word: "나비", category: "animals", syllables: ["나", "비"], emoji: "🦋", bgColor: "bg-sky-100 border-sky-300 text-sky-900", exampleSentence: "예쁜 나비가 하늘을 훨훨 날아가요.", hint: "알록달록 날개를 가진 예쁜 곤충이에요." },

  // 과일
  { id: "w_fruit_1", word: "사과", category: "fruits", syllables: ["사", "과"], emoji: "🍎", bgColor: "bg-red-100 border-red-300 text-red-900", exampleSentence: "아삭아삭 매콤달콤한 빨간 사과예요.", hint: "빨갛고 탐스러운 맛있는 과일이에요." },
  { id: "w_fruit_2", word: "바나나", category: "fruits", syllables: ["바", "나", "나"], emoji: "🍌", bgColor: "bg-yellow-100 border-yellow-300 text-yellow-900", exampleSentence: "달콤하고 노란 바나나를 먹어요.", hint: "길쭉하고 노란 달콤한 과일이에요." },
  { id: "w_fruit_3", word: "포도", category: "fruits", syllables: ["포", "도"], emoji: "🍇", bgColor: "bg-purple-100 border-purple-300 text-purple-900", exampleSentence: "보랏빛 달콤한 포도가 알알이 열렸어요.", hint: "보라색 동글동글 알맹이가 모여있어요." },
  { id: "w_fruit_4", word: "수박", category: "fruits", syllables: ["수", "박"], emoji: "🍉", bgColor: "bg-emerald-100 border-emerald-300 text-emerald-900", exampleSentence: "시원하고 달콤한 초록색 줄무늬 수박!", hint: "시원하고 초록색 바탕에 줄무늬가 있어요." },
  { id: "w_fruit_5", word: "딸기", category: "fruits", syllables: ["딸", "기"], emoji: "🍓", bgColor: "bg-rose-100 border-rose-300 text-rose-900", exampleSentence: "새콤달콤 빨간 딸기가 정말 맛있어요.", hint: "빨갛고 씨가 콕콕 박힌 달콤한 과일이에요." },

  // 학용품 & 교실
  { id: "w_sch_1", word: "연필", category: "school", syllables: ["연", "필"], emoji: "✏️", bgColor: "bg-amber-100 border-amber-300 text-amber-900", exampleSentence: "연필로 예쁘게 글씨를 씁니다.", hint: "공책에 글씨를 쓸 때 사용하는 도구예요." },
  { id: "w_sch_2", word: "공책", category: "school", syllables: ["공", "책"], emoji: "📓", bgColor: "bg-indigo-100 border-indigo-300 text-indigo-900", exampleSentence: "공책에 공부한 글자를 바르게 적어요.", hint: "연필로 글씨를 적는 책이에요." },
  { id: "w_sch_3", word: "가방", category: "school", syllables: ["가", "방"], emoji: "🎒", bgColor: "bg-blue-100 border-blue-300 text-blue-900", exampleSentence: "학교 갈 때 메고 가는 예쁜 책가방!", hint: "학용품을 넣고 등에 메는 가방이에요." },
  { id: "w_sch_4", word: "지우개", category: "school", syllables: ["지", "우", "개"], emoji: "🧹", bgColor: "bg-teal-100 border-teal-300 text-teal-900", exampleSentence: "틀린 글씨는 지우개로 쓱싹 지워요.", hint: "틀린 연필 글씨를 지울 때 써요." },
  { id: "w_sch_5", word: "가위", category: "school", syllables: ["가", "위"], emoji: "✂️", bgColor: "bg-pink-100 border-pink-300 text-pink-900", exampleSentence: "색종이를 가위로 조심조심 오려요.", hint: "종이나 종이 상자를 자르는 도구예요." },

  // 가족 & 일상
  { id: "w_fam_1", word: "엄마", category: "family_daily", syllables: ["엄", "마"], emoji: "👩", bgColor: "bg-rose-100 border-rose-300 text-rose-900", exampleSentence: "나를 꼭 안아주시는 따뜻한 엄마예요.", hint: "나를 사랑해 주시는 소중한 가족이에요." },
  { id: "w_fam_2", word: "아빠", category: "family_daily", syllables: ["아", "빠"], emoji: "👨", bgColor: "bg-blue-100 border-blue-300 text-blue-900", exampleSentence: "다정하고 든든한 우리 아빠가 좋아요.", hint: "나와 함께 신나게 놀아주시는 멋진 아빠예요." },
  { id: "w_fam_3", word: "친구", category: "family_daily", syllables: ["친", "구"], emoji: "👫", bgColor: "bg-emerald-100 border-emerald-300 text-emerald-900", exampleSentence: "학교에서 친구와 사이좋게 놀아요.", hint: "함께 공부하고 기분 좋게 노는 사이예요." },
  { id: "w_fam_4", word: "학교", category: "family_daily", syllables: ["학", "교"], emoji: "🏫", bgColor: "bg-yellow-100 border-yellow-300 text-yellow-900", exampleSentence: "즐겁게 공부하고 운동하는 우리 학교!", hint: "선생님과 친구들이 있는 배움터예요." },
  { id: "w_fam_5", word: "우유", category: "family_daily", syllables: ["우", "유"], emoji: "🥛", bgColor: "bg-sky-100 border-sky-300 text-sky-900", exampleSentence: "키가 쑥쑥 자라는 하얀 우유를 마셔요.", hint: "고소하고 하얀 건강한 음료예요." },
];

// 5. 한글 따라 쓰기 가이드 항목
export const HANDWRITING_ITEMS: HandwritingItem[] = [
  { id: "hw_1", targetText: "ㄱ", categoryName: "자음", guideType: "jamo", hints: ["왼쪽에서 오른쪽으로 꺾어서 아래로 내립니다."] },
  { id: "hw_2", targetText: "ㄴ", categoryName: "자음", guideType: "jamo", hints: ["위에서 아래로 내려온 뒤 오른쪽으로 갑니다."] },
  { id: "hw_3", targetText: "ㄷ", categoryName: "자음", guideType: "jamo", hints: ["오른쪽으로 그은 뒤 아래로 꺾고 다시 오른쪽으로 가요."] },
  { id: "hw_4", targetText: "ㅏ", categoryName: "모음", guideType: "jamo", hints: ["세로로 길게 내리고 오른쪽으로 살짝 그어요."] },
  { id: "hw_5", targetText: "ㅗ", categoryName: "모음", guideType: "jamo", hints: ["짧은 세로선을 그린 뒤 아래에 가로선을 긴 게 그어요."] },
  { id: "hw_6", targetText: "가", categoryName: "음절", guideType: "jamo", hints: ["'ㄱ'을 쓰고 옆에 'ㅏ'를 이어서 써요."] },
  { id: "hw_7", targetText: "사과", categoryName: "낱말", guideType: "word", hints: ["'사'를 쓰고 옆에 '과'를 정성껏 적어봐요."] },
  { id: "hw_8", targetText: "나비", categoryName: "낱말", guideType: "word", hints: ["'나'와 '비'를 또박또박 써봅시다."] },
  { id: "hw_9", targetText: "파", categoryName: "음절", guideType: "jamo", hints: ["'ㅍ'을 쓰고 옆에 'ㅏ'를 이어서 써요."] },
  { id: "hw_10", targetText: "하", categoryName: "음절", guideType: "jamo", hints: ["'ㅎ'을 쓰고 옆에 'ㅏ'를 이어서 써요."] },
];

// 6. 한글 퀴즈 데이터
export const QUIZ_ITEMS: QuizItem[] = [
  {
    id: "q1",
    targetWord: "사과",
    options: ["사과", "바나나", "포도", "수박"],
    correctIndex: 0,
    emojiHint: "🍎",
    questionAudioText: "다음 중 빨갛고 달콤한 '사과'는 어떤 글자일까요?",
  },
  {
    id: "q2",
    targetWord: "강아지",
    options: ["고양이", "강아지", "호랑이", "토끼"],
    correctIndex: 1,
    emojiHint: "🐶",
    questionAudioText: "멍멍 울고 꼬리를 치는 '강아지' 글자를 골라보세요!",
  },
  {
    id: "q3",
    targetWord: "연필",
    options: ["가방", "지우개", "연필", "공책"],
    correctIndex: 2,
    emojiHint: "✏️",
    questionAudioText: "공책에 글씨를 쓸 때 사용하는 '연필'을 찾아보세요!",
  },
  {
    id: "q4",
    targetWord: "나비",
    options: ["병아리", "오리", "나비", "개구리"],
    correctIndex: 2,
    emojiHint: "🦋",
    questionAudioText: "알록달록 훨훨 날아다니는 '나비' 글자는 무엇일까요?",
  },
  {
    id: "q5",
    targetWord: "학교",
    options: ["친구", "엄마", "우유", "학교"],
    correctIndex: 3,
    emojiHint: "🏫",
    questionAudioText: "선생님과 친구들이 있는 즐거운 '학교' 글자를 골라주세요!",
  },
];

// 7. 칭찬 스티커 데이터 목록
export const INITIAL_STICKERS: Sticker[] = [
  { id: "stk_1", title: "참 잘했어요!", subtitle: "첫 한글 학습을 시작했어요", icon: "💮", badgeBg: "bg-rose-500", unlocked: true },
  { id: "stk_2", title: "목소리 왕!", subtitle: "소리 내어 글자를 잘 읽었어요", icon: "📢", badgeBg: "bg-amber-500", unlocked: false },
  { id: "stk_3", title: "멋진 필기왕!", subtitle: "손가락으로 예쁘게 글씨를 썼어요", icon: "✏️", badgeBg: "bg-emerald-500", unlocked: false },
  { id: "stk_4", title: "한글 퀴즈 박사!", subtitle: "낱말 퀴즈 정답을 많이 맞혔어요", icon: "🧠", badgeBg: "bg-blue-500", unlocked: false },
  { id: "stk_5", title: "토끼 스티커!", subtitle: "동물 단어를 모두 정복했어요", icon: "🐰", badgeBg: "bg-pink-500", unlocked: false },
  { id: "stk_6", title: "참새 칭찬 도장", subtitle: "별 포인트를 10개 모았어요", icon: "🐤", badgeBg: "bg-yellow-500", unlocked: false },
  { id: "stk_7", title: "열정 가득왕!", subtitle: "한글 카드 10개를 모았어요", icon: "🔥", badgeBg: "bg-orange-500", unlocked: false },
  { id: "stk_8", title: "한글 마스터!", subtitle: "오늘 공부를 완벽히 마쳤어요", icon: "👑", badgeBg: "bg-purple-500", unlocked: false },
];
