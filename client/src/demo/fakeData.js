import { DEMO_USER } from '../utils/demo';

/* ─── 岩館 ─── */
export const FAKE_GYMS = [
  { _id: 'gym1', name: '岩所攀岩館' },
  { _id: 'gym2', name: 'B-PUMP 攀岩館' },
  { _id: 'gym3', name: '石屋攀岩場' },
  { _id: 'gym4', name: '極限攀岩 Pioneer' },
  { _id: 'gym5', name: '抱石聖地 Boulder Land' },
];

/* ─── 好友 API 結構（對應 Friends.js 的 friend.inviterId / receiverId） ─── */
export const FAKE_FRIENDS = [
  {
    _id: 'fr1',
    inviterId: { _id: DEMO_USER._id, name: DEMO_USER.name, image: DEMO_USER.image },
    receiverId: { _id: 'friend-alex', name: 'Alex 陳', image: 'https://i.pravatar.cc/100?img=5', introduce: '攀岩 5 年｜Lead Climbing 專攻' },
  },
  {
    _id: 'fr2',
    inviterId: { _id: DEMO_USER._id, name: DEMO_USER.name, image: DEMO_USER.image },
    receiverId: { _id: 'friend-sarah', name: 'Sarah 林', image: 'https://i.pravatar.cc/100?img=15', introduce: '攀岩初學者｜熱愛戶外探索' },
  },
  {
    _id: 'fr3',
    inviterId: { _id: 'friend-mike', name: 'Mike 張', image: 'https://i.pravatar.cc/100?img=13', introduce: '抱石愛好者｜V7 衝擊中 💪' },
    receiverId: { _id: DEMO_USER._id, name: DEMO_USER.name, image: DEMO_USER.image },
  },
];

/* ─── 好友詳細資料（對應 ChatRoom.js 的 friend state） ─── */
export const FAKE_FRIEND_DETAILS = {
  'friend-alex': { _id: 'friend-alex', name: 'Alex 陳', image: 'https://i.pravatar.cc/100?img=5', introduce: '攀岩 5 年｜Lead Climbing 專攻' },
  'friend-sarah': { _id: 'friend-sarah', name: 'Sarah 林', image: 'https://i.pravatar.cc/100?img=15', introduce: '攀岩初學者｜熱愛戶外探索' },
  'friend-mike': { _id: 'friend-mike', name: 'Mike 張', image: 'https://i.pravatar.cc/100?img=13', introduce: '抱石愛好者｜V7 衝擊中 💪' },
};

/* ─── 動態牆紀錄（對應 Explore.js 的 records state） ─── */
export const FAKE_EXPLORE_RECORDS = [
  {
    _id: 'rec1',
    user: { _id: 'friend-alex', name: 'Alex 陳', image: 'https://i.pravatar.cc/100?img=5' },
    gymName: '岩所攀岩館',
    date: '2024-05-22',
    records: [{
      _id: 'sub1', level: 'V5', times: 3, wall: 'A 區',
      types: ['Crimpy'],
      memo: '終於把這條卡了兩週的路線刷下來了！關鍵是腳點要踩穩 😤',
      files: [process.env.PUBLIC_URL + '/images/home1.png'],
      likes: 12, likedBy: [],
      comments: ['Sarah 林: 超猛！加油！', '示範用戶: 讚讚，教我 🙏'],
    }],
  },
  {
    _id: 'rec2',
    user: { _id: 'friend-sarah', name: 'Sarah 林', image: 'https://i.pravatar.cc/100?img=15' },
    gymName: 'B-PUMP 攀岩館',
    date: '2024-05-21',
    records: [{
      _id: 'sub2', level: 'V3', times: 5,
      types: ['Slope'],
      memo: '第一次爬斜面路線，手臂超酸 😂 但很好玩！',
      files: [process.env.PUBLIC_URL + '/images/home2.png'],
      likes: 8, likedBy: [],
      comments: ['Alex 陳: 繼續加油！很快就會突破！'],
    }],
  },
  {
    _id: 'rec3',
    user: { _id: 'friend-mike', name: 'Mike 張', image: 'https://i.pravatar.cc/100?img=13' },
    gymName: '石屋攀岩場',
    date: '2024-05-20',
    records: [{
      _id: 'sub3', level: 'V7', times: 8, wall: '主牆',
      types: ['Dyno', 'Power'],
      memo: '連續失敗 7 次終於動態成功！這條真的超難 🔥',
      files: [process.env.PUBLIC_URL + '/images/home3.png'],
      likes: 21, likedBy: [],
      comments: ['Alex 陳: 神！', 'Sarah 林: 怎麼可能！！', '示範用戶: 我要學！'],
    }],
  },
  {
    _id: 'rec4',
    user: { _id: DEMO_USER._id, name: DEMO_USER.name, image: DEMO_USER.image },
    gymName: '岩所攀岩館',
    date: '2024-05-19',
    records: [{
      _id: 'sub4', level: 'V4', times: 4,
      types: ['Power'],
      memo: '今天力量訓練日，刷了幾條 Power 路線，好累但充實！',
      files: [process.env.PUBLIC_URL + '/images/home4.png'],
      likes: 5, likedBy: [],
      comments: [],
    }],
  },
];

/* ─── 個人攀岩紀錄（對應 Personal.js 的 climbRecords state） ─── */
export const FAKE_CLIMB_RECORDS = [
  {
    _id: 'myRec1',
    date: '2024-03-15',
    gymName: '岩所攀岩館',
    records: [
      { level: 'V2', times: 2, wall: '', types: [], memo: '', files: [] },
      { level: 'V3', times: 4, wall: '', types: ['Crimpy'], memo: '第一次感覺到 Crimpy 的感覺', files: [] },
    ],
  },
  {
    _id: 'myRec2',
    date: '2024-04-02',
    gymName: '石屋攀岩場',
    records: [
      { level: 'V3', times: 6, wall: '', types: ['Dyno'], memo: '動態路線好有趣！', files: [] },
      { level: 'V3', times: 3, wall: '', types: ['Slope'], memo: '', files: [] },
    ],
  },
  {
    _id: 'myRec3',
    date: '2024-04-20',
    gymName: '岩所攀岩館',
    records: [
      { level: 'V4', times: 3, wall: 'B 區', types: ['Power'], memo: '', files: [] },
      { level: 'V4', times: 4, wall: '', types: ['Crimpy'], memo: '手指好痠...', files: [] },
    ],
  },
  {
    _id: 'myRec4',
    date: '2024-05-10',
    gymName: 'B-PUMP 攀岩館',
    records: [
      { level: 'V4', times: 5, wall: '', types: ['Slope', 'Pump'], memo: '', files: [] },
      { level: 'V3', times: 2, wall: '', types: [], memo: '暖身路線', files: [] },
    ],
  },
  {
    _id: 'myRec5',
    date: '2024-05-22',
    gymName: '岩所攀岩館',
    records: [
      {
        level: 'V5', times: 3, wall: 'A 區', types: ['Crimpy'],
        memo: '完攀成功！太開心了 🎉',
        files: [process.env.PUBLIC_URL + '/images/home4.png'],
      },
      { level: 'V4', times: 2, wall: '', types: ['Power'], memo: '', files: [] },
    ],
  },
];

/* ─── 成就牆面（對應 Achievements.js 的 walls state） ─── */
export const FAKE_WALLS = [
  {
    wallName: '岩所牆面 A',
    originalImage: 'https://picsum.photos/seed/wall1/350/400.jpg',
  },
  {
    wallName: 'B-PUMP 競技牆',
    originalImage: 'https://picsum.photos/seed/wall2/350/400.jpg',
  },
  {
    wallName: '石屋主牆',
    originalImage: 'https://picsum.photos/seed/wall3/350/400.jpg',
  },
];

/* ─── 成就路線（對應 handleWallSelect 的 routes state） ─── */
export const FAKE_ROUTES = {
  '岩所牆面 A': {
    customs: [
      { customName: '小紅路線', customType: ['Crimpy'], memo: '腳點卡位很重要', processedImage: 'https://picsum.photos/seed/route1/350/400.jpg' },
      { customName: '斜面大師', customType: ['Slope'], memo: '保持重心，不要過度出力', processedImage: 'https://picsum.photos/seed/route2/350/400.jpg' },
      { customName: '力量測試', customType: ['Power'], memo: '上肢力量要夠強', processedImage: 'https://picsum.photos/seed/route3/350/400.jpg' },
      { customName: '動態飛人', customType: ['Dyno'], memo: '爆發力路線，時機很重要', processedImage: 'https://picsum.photos/seed/route4/350/400.jpg' },
      { customName: '耐力挑戰', customType: ['Pump'], memo: '要保持穩定節奏', processedImage: 'https://picsum.photos/seed/route5/350/400.jpg' },
    ],
  },
  'B-PUMP 競技牆': {
    customs: [
      { customName: 'Flash Problem', customType: ['Crimpy', 'Power'], memo: '一次過是目標', processedImage: 'https://picsum.photos/seed/route6/350/400.jpg' },
      { customName: 'Red Zone', customType: ['Dyno'], memo: '動態關鍵是起跳時機', processedImage: 'https://picsum.photos/seed/route7/350/400.jpg' },
      { customName: 'Blue Circuit', customType: ['Slope'], memo: '整條都是斜面，核心要穩', processedImage: 'https://picsum.photos/seed/route8/350/400.jpg' },
      { customName: 'Final Boss', customType: ['Power', 'Pump'], memo: '最後一條最難', processedImage: 'https://picsum.photos/seed/route9/350/400.jpg' },
    ],
  },
  '石屋主牆': {
    customs: [
      { customName: '綠線入門', customType: ['Slope'], memo: '適合新手練習', processedImage: 'https://picsum.photos/seed/route10/350/400.jpg' },
      { customName: '黃線進階', customType: ['Crimpy'], memo: '點位很小要留意', processedImage: 'https://picsum.photos/seed/route11/350/400.jpg' },
      { customName: '紅線高手', customType: ['Power', 'Dyno'], memo: '需要強壯的手指力量', processedImage: 'https://picsum.photos/seed/route12/350/400.jpg' },
    ],
  },
};

/* ─── 初始成就狀態 ─── */
export const FAKE_ACHIEVEMENTS_INITIAL = {
  '小紅路線': 'completed',
  '力量測試': 'completed',
  'Red Zone': 'completed',
  '綠線入門': 'completed',
  '黃線進階': 'completed',
};

/* ─── 足跡地圖岩館座標 ─── */
export const FAKE_GYM_LOCATIONS = [
  { name: '岩所攀岩館',       lat: 25.0564, lng: 121.5217, visited: true,  times: 5, lastVisit: '2024-05-22', expiryDate: '2025-01-01' },
  { name: 'B-PUMP 攀岩館',      lat: 25.0398, lng: 121.5629, visited: true,  times: 3, lastVisit: '2024-05-10', expiryDate: '2024-12-31' },
  { name: '石屋攀岩場',       lat: 25.0730, lng: 121.5239, visited: true,  times: 1, lastVisit: '2024-04-02', expiryDate: '' },
  { name: '極限攀岩 Pioneer',   lat: 25.0480, lng: 121.5130, visited: false },
  { name: '抱石聖地 Boulder',   lat: 25.0600, lng: 121.5510, visited: false },
];

/* ─── 聊天腳本（每位好友 3 輪，每輪 3 個選項） ─── */
export const CHAT_SCRIPTS = {
  'friend-alex': [
    [
      { send: '好久不見，最近還有在爬嗎？', reply: '當然！上週才去岩館刷了幾條 5.12，手感越來越好了！你呢？' },
      { send: '想約你一起去攀岩！', reply: '太好了！我剛好想找練習夥伴！這週末你有空嗎？' },
      { send: '你最近有什麼新突破嗎？', reply: '哈！剛完攀了一條卡了兩週的 5.11b，感動到快哭出來 😂 你也快了！' },
    ],
    [
      { send: '週六下午有空！幾點出發？', reply: '下午兩點？我去接你，帶你試試那條超讚的 overhang 路線！' },
      { send: '有什麼路線推薦嗎？', reply: '右邊那條 overhang 超刺激！記得先 warm up，腳點要踩穩！' },
      { send: '要帶什麼裝備？', reply: '岩鞋和粉袋就夠！安全帶和繩子岩場有租，穿舒服的衣服來！' },
    ],
    [
      { send: '週六見！一定不遲到！', reply: '說定了！到時候給你展示我新練的技巧 💪 記得好好睡！', last: true },
      { send: '期待！這次要突破新高度 🔥', reply: '衝！我們一起進步，互相 beta 最有效！🧗', last: true },
      { send: '謝謝你，很開心有你當夥伴 😊', reply: '我也是！有夥伴爬起來更有動力，一起衝更高！✨', last: true },
    ],
  ],
  'friend-sarah': [
    [
      { send: '最近還在練習攀岩嗎？', reply: '當然！每週末都去！V3 終於感覺越來越順了～' },
      { send: '你最喜歡攀岩哪個部分？', reply: '完攀那一刻！成就感超棒的！還有認識很多有趣的朋友 😊' },
      { send: '想陪你一起練習喔！', reply: '真的嗎！太好了！你是高手，跟你練一定進步很快！' },
    ],
    [
      { send: '下次一起去 B-PUMP 如何？', reply: '好好好！我週六下午都有空！你什麼時候方便？' },
      { send: '你有想突破 V4 嗎？', reply: '好想！但每次都卡在手指力量不夠，你有什麼建議嗎？' },
      { send: '我來教你幾個技巧吧！', reply: '太感謝了！我一直搞不定腳點的放法，希望你能幫我！' },
    ],
    [
      { send: '週六一起衝 V4！', reply: '好！我要突破！！謝謝你願意帶我練 💪', last: true },
      { send: '重心放低、腳點踩穩就對了！', reply: '哦哦！我懂了！下次試試看！謝謝你的建議！🌟', last: true },
      { send: '一起加油！你進步很快的！', reply: '謝謝鼓勵！有你這個夥伴真的很開心！繼續一起爬 🧗‍♀️', last: true },
    ],
  ],
  'friend-mike': [
    [
      { send: '你怎麼爬 V7 這麼厲害？！', reply: '哪有厲害，我失敗了 7 次才成功！訓練最重要，核心要夠強！' },
      { send: '你有什麼訓練秘訣嗎？', reply: '每天懸掛訓練，加上每週 3 次的系統性刷牆！記錄每次嘗試！' },
      { send: '我也想挑戰 V7！', reply: '哦？你現在幾級？我可以幫你規劃訓練計畫！' },
    ],
    [
      { send: '我現在 V5，想繼續突破！', reply: 'V5 到 V7 是關鍵瓶頸！要加強手指力量和動態動作！來一起練！' },
      { send: '怎麼加強動態動作？', reply: '多練 Dyno 路線！從小動態開始，計算好起跳時機！一起練吧！' },
      { send: '核心怎麼練比較有效？', reply: '懸掛轉體加抱石後核心訓練！先從仰臥起坐加懸掛開始！' },
    ],
    [
      { send: '下週一起去練動態！', reply: '走！帶你去石屋，那邊 Dyno 路線超多！💪', last: true },
      { send: '謝謝你願意帶我練！', reply: '互相學習！你基礎很好，很快就能突破的！加油！🔥', last: true },
      { send: '一起衝 V7！🧗', reply: 'V7 等我們！！！🎯 沒問題的！', last: true },
    ],
  ],
};
