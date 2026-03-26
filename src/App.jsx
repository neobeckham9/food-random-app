import { useEffect, useMemo, useRef, useState } from 'react'

const LANGUAGE_KEY = 'lunch-box-language'
const FAVORITES_KEY = 'lunch-box-favorites'
const HISTORY_KEY = 'lunch-box-history'

const categoryLabels = {
  rice: { zh: '盖饭', en: 'Rice Bowl' },
  noodles: { zh: '粉面', en: 'Noodles' },
  light: { zh: '轻食', en: 'Light Meal' },
  fastfood: { zh: '西式快餐', en: 'Fast Food' },
  baked: { zh: '焗饭', en: 'Baked Rice' },
  japanese: { zh: '日料', en: 'Japanese' },
}

const menus = [
  {
    id: 1,
    category: 'rice',
    price: 28,
    spice: 3,
    score: 92,
    name: { zh: '椒麻鸡腿饭', en: 'Pepper Chicken Rice Bowl' },
    vibe: { zh: '高效工作日', en: 'Focused workday' },
    desc: {
      zh: '鸡腿外酥里嫩，配椒麻汁，适合想吃得扎实一点的时候。',
      en: 'Crisp chicken with fragrant pepper sauce, ideal when you want something filling and dependable.',
    },
    tags: {
      zh: ['稳妥', '下饭', '高蛋白'],
      en: ['Reliable', 'Comforting', 'Protein-rich'],
    },
  },
  {
    id: 2,
    category: 'noodles',
    price: 32,
    spice: 2,
    score: 90,
    name: { zh: '酸汤肥牛米线', en: 'Sour Broth Beef Rice Noodles' },
    vibe: { zh: '下雨天续命', en: 'Rainy day comfort' },
    desc: {
      zh: '酸香开胃，肥牛和米线都很顶，适合状态低迷时回血。',
      en: 'Warm, tangy, and deeply satisfying, a quick reset when your energy is low.',
    },
    tags: {
      zh: ['热乎', '解馋', '汤面'],
      en: ['Hot', 'Craving fix', 'Soup noodles'],
    },
  },
  {
    id: 3,
    category: 'light',
    price: 39,
    spice: 0,
    score: 88,
    name: { zh: '照烧三文鱼轻食碗', en: 'Teriyaki Salmon Wellness Bowl' },
    vibe: { zh: '想控制热量', en: 'Keeping it lighter' },
    desc: {
      zh: '谷物、蔬菜和三文鱼搭配完整，适合中午不想犯困。',
      en: 'Balanced grains, greens, and salmon for a lighter lunch that still feels complete.',
    },
    tags: {
      zh: ['轻负担', '高颜值', '健身友好'],
      en: ['Light', 'Pretty', 'Gym-friendly'],
    },
  },
  {
    id: 4,
    category: 'fastfood',
    price: 24,
    spice: 1,
    score: 83,
    name: { zh: '老北京鸡肉卷套餐', en: 'Chicken Wrap Combo' },
    vibe: { zh: '预算收紧', en: 'Budget-minded' },
    desc: {
      zh: '速度快、价格稳，适合会议缝隙里迅速解决一餐。',
      en: 'Fast, affordable, and easy to fit into a packed schedule.',
    },
    tags: {
      zh: ['便宜', '快', '解馋'],
      en: ['Affordable', 'Fast', 'Tasty'],
    },
  },
  {
    id: 5,
    category: 'baked',
    price: 31,
    spice: 0,
    score: 87,
    name: { zh: '番茄牛腩焗饭', en: 'Tomato Beef Baked Rice' },
    vibe: { zh: '想吃点安慰型碳水', en: 'Comfort carb mood' },
    desc: {
      zh: '番茄和牛腩味道厚实，奶香焗饭很容易一口气炫完。',
      en: 'Rich tomato beef and creamy baked rice for a cozy, rewarding lunch.',
    },
    tags: {
      zh: ['治愈', '浓郁', '奶香'],
      en: ['Comforting', 'Rich', 'Creamy'],
    },
  },
  {
    id: 6,
    category: 'light',
    price: 35,
    spice: 1,
    score: 84,
    name: { zh: '泰式青柠鸡排沙拉', en: 'Thai Lime Chicken Salad' },
    vibe: { zh: '下午还要继续卷', en: 'Still have a long afternoon' },
    desc: {
      zh: '酸甜带一点冲劲，适合想清爽又不想太寡淡的时候。',
      en: 'Fresh and zesty with a little lift, ideal when you want clean flavors without feeling bored.',
    },
    tags: {
      zh: ['清爽', '酸口', '不腻'],
      en: ['Fresh', 'Tangy', 'Not heavy'],
    },
  },
  {
    id: 7,
    category: 'japanese',
    price: 42,
    spice: 0,
    score: 86,
    name: { zh: '双拼寿司便当', en: 'Double Combo Sushi Bento' },
    vibe: { zh: '想吃得像周五', en: 'Feels like Friday' },
    desc: {
      zh: '寿司加炸物双拼，满足感和仪式感都在线。',
      en: 'A slightly more special lunch that feels polished, balanced, and rewarding.',
    },
    tags: {
      zh: ['仪式感', '均衡', '精致'],
      en: ['Special', 'Balanced', 'Refined'],
    },
  },
  {
    id: 8,
    category: 'noodles',
    price: 21,
    spice: 4,
    score: 85,
    name: { zh: '重庆小面加煎蛋', en: 'Chongqing Noodles with Egg' },
    vibe: { zh: '重口回血', en: 'Need bold flavors' },
    desc: {
      zh: '辣度直接，价格友好，适合突然很想来点猛的。',
      en: 'Spicy, affordable, and energetic when you want something intense.',
    },
    tags: {
      zh: ['刺激', '醒神', '性价比'],
      en: ['Bold', 'Wake-up', 'Good value'],
    },
  },
]

const moodOptions = [
  { id: 'any', label: { zh: '都行', en: 'Any mood' } },
  { id: 'warm', label: { zh: '想吃热乎的', en: 'Something warm' } },
  { id: 'fresh', label: { zh: '想吃清爽的', en: 'Something fresh' } },
  { id: 'bold', label: { zh: '想吃重口的', en: 'Something bold' } },
  { id: 'budget', label: { zh: '想省钱', en: 'Save money' } },
  { id: 'treat', label: { zh: '想犒劳自己', en: 'Treat myself' } },
]

const copy = {
  zh: {
    brand: 'Lunch Box',
    title: '今天吃什么',
    subtitle: '一个更柔和的外卖盲盒体验。像打开生活方式推荐，而不是操作一个工具页面。',
    languageShort: 'EN',
    candidates: '候选',
    resultEyebrow: '今日推荐',
    drawingHint: '正在轻轻摇出一份更适合现在的午餐...',
    favorite: '收藏',
    favorited: '已收藏',
    score: '推荐度',
    cardCategory: '类别',
    cardBudget: '预算',
    cardSpice: '辣度',
    cardMood: '氛围',
    filtersEyebrow: '筛选',
    filtersTitle: '今天的偏好',
    iphoneHint: '移动端优先',
    budgetLabel: '预算上限',
    spiceLabel: '辣度上限',
    blacklistEyebrow: '排除项',
    blacklistTitle: '今天先不考虑这些',
    blacklistHint: '轻点卡片即可临时排除',
    exclude: '已排除',
    keep: '保留',
    recentEyebrow: '最近抽取',
    recentTitle: '最近 3 次结果',
    recentHint: '自动保留最近 3 条',
    favoritesEyebrow: '收藏',
    favoritesTitle: '喜欢的午餐',
    favoritesHint: '保存在本地',
    remove: '移除',
    favoritesEmpty: '还没有收藏。抽到满意的那一份时，点结果卡右上角的“收藏”。',
    draw: '开盲盒 / 再抽一次',
    drawing: '正在开盲盒...',
    priceUnit: '￥',
    points: '分',
  },
  en: {
    brand: 'Lunch Box',
    title: 'What should I eat today?',
    subtitle: 'A softer, calmer food randomizer that feels more like a lifestyle recommendation than a utility page.',
    languageShort: '中文',
    candidates: 'Choices',
    resultEyebrow: 'Today’s Reveal',
    drawingHint: 'Blending a lunch choice that feels right for this moment...',
    favorite: 'Save',
    favorited: 'Saved',
    score: 'Score',
    cardCategory: 'Category',
    cardBudget: 'Budget',
    cardSpice: 'Spice',
    cardMood: 'Mood',
    filtersEyebrow: 'Filters',
    filtersTitle: 'Today’s preferences',
    iphoneHint: 'Mobile first',
    budgetLabel: 'Budget cap',
    spiceLabel: 'Max spice',
    blacklistEyebrow: 'Blacklist',
    blacklistTitle: 'Skip these for now',
    blacklistHint: 'Tap a card to temporarily remove it',
    exclude: 'Excluded',
    keep: 'Keep',
    recentEyebrow: 'Recent draws',
    recentTitle: 'Last 3 picks',
    recentHint: 'Only the latest 3 are kept',
    favoritesEyebrow: 'Favorites',
    favoritesTitle: 'Saved lunches',
    favoritesHint: 'Stored locally',
    remove: 'Remove',
    favoritesEmpty: 'No saved picks yet. Tap “Save” on the result card when something feels right.',
    draw: 'Reveal another pick',
    drawing: 'Revealing...',
    priceUnit: '$',
    points: 'pts',
  },
}

const initialItem = menus[1]

function loadLanguage() {
  if (typeof window === 'undefined') return 'zh'

  const savedLanguage = window.localStorage.getItem(LANGUAGE_KEY)
  return savedLanguage === 'en' ? 'en' : 'zh'
}

function loadFavoriteIds() {
  if (typeof window === 'undefined') return []

  const savedFavorites = window.localStorage.getItem(FAVORITES_KEY)

  if (!savedFavorites) return []

  try {
    return JSON.parse(savedFavorites)
  } catch {
    window.localStorage.removeItem(FAVORITES_KEY)
    return []
  }
}

function loadHistoryItems() {
  if (typeof window === 'undefined') return [initialItem]

  const savedHistory = window.localStorage.getItem(HISTORY_KEY)

  if (!savedHistory) return [initialItem]

  try {
    const parsed = JSON.parse(savedHistory)
    const restored = parsed.map((id) => menus.find((item) => item.id === id)).filter(Boolean)

    return restored.length ? restored.slice(0, 3) : [initialItem]
  } catch {
    window.localStorage.removeItem(HISTORY_KEY)
    return [initialItem]
  }
}

function App() {
  const [language, setLanguage] = useState(loadLanguage)
  const [budget, setBudget] = useState(35)
  const [maxSpice, setMaxSpice] = useState(3)
  const [mood, setMood] = useState('any')
  const [excluded, setExcluded] = useState([])
  const [history, setHistory] = useState(loadHistoryItems)
  const [result, setResult] = useState(() => loadHistoryItems()[0] ?? initialItem)
  const [favorites, setFavorites] = useState(loadFavoriteIds)
  const [isDrawing, setIsDrawing] = useState(false)
  const timerRef = useRef(null)

  const t = copy[language]

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_KEY, language)
  }, [language])

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    window.localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(history.slice(0, 3).map((item) => item.id)),
    )
  }, [history])

  const candidates = useMemo(() => {
    return menus.filter((item) => {
      if (excluded.includes(item.id)) return false
      if (item.price > budget) return false
      if (item.spice > maxSpice) return false

      if (mood === 'warm') return ['noodles', 'baked', 'rice'].includes(item.category)
      if (mood === 'fresh') return ['light', 'japanese'].includes(item.category)
      if (mood === 'bold') return item.spice >= 2 || item.tags.zh.includes('下饭')
      if (mood === 'budget') return item.price <= 28
      if (mood === 'treat') return item.price >= 30 && item.score >= 86

      return true
    })
  }, [budget, excluded, maxSpice, mood])

  const favoriteItems = useMemo(
    () => favorites.map((id) => menus.find((item) => item.id === id)).filter(Boolean),
    [favorites],
  )

  const drawLunch = () => {
    if (isDrawing) return

    const pool = candidates.length ? candidates : menus.filter((item) => !excluded.includes(item.id))
    const picked = pool[Math.floor(Math.random() * pool.length)]

    if (!picked) return

    setIsDrawing(true)

    timerRef.current = window.setTimeout(() => {
      setResult(picked)
      setHistory((current) => [picked, ...current.filter((item) => item.id !== picked.id)].slice(0, 3))
      setIsDrawing(false)
    }, 520)
  }

  const toggleExcluded = (id) => {
    setExcluded((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [id, ...current].slice(0, 8),
    )
  }

  const isFavorite = favorites.includes(result.id)

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#edf1f7_0%,_#e6ebf2_38%,_#dde4ef_100%)] text-[#4b5563]">
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-4 pb-[calc(8.5rem+env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">
        <section className="overflow-hidden rounded-[32px] bg-white/94 px-5 pb-5 pt-4 shadow-[0_18px_40px_rgba(77,90,120,0.12)] ring-1 ring-black/5 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7c77a8]">
                {t.brand}
              </p>
              <h1 className="mt-2 max-w-[12rem] text-[32px] leading-[1.02] font-semibold tracking-[-0.05em] text-[#1f2937]">
                {t.title}
              </h1>
              <p className="mt-3 max-w-[16rem] text-sm leading-6 text-[#6b7280]">{t.subtitle}</p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <button
                type="button"
                onClick={() => setLanguage((current) => (current === 'zh' ? 'en' : 'zh'))}
                className="min-h-11 rounded-full bg-[#eef2ff] px-4 text-sm font-medium text-[#4f46e5] shadow-[0_10px_20px_rgba(99,102,241,0.14)] ring-1 ring-indigo-100"
              >
                {t.languageShort}
              </button>
              <div className="rounded-[22px] bg-[linear-gradient(180deg,_#e0e7ff,_#dbe4f5)] px-3 py-2 text-right text-[#334155] shadow-[0_12px_24px_rgba(99,102,241,0.14)]">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#667085]">{t.candidates}</p>
                <p className="text-xl font-semibold">{candidates.length}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1">
            {moodOptions.map((item) => {
              const active = item.id === mood
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMood(item.id)}
                  className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-medium transition ${
                    active
                      ? 'bg-[linear-gradient(180deg,_#818cf8,_#6366f1)] text-white shadow-[0_12px_22px_rgba(99,102,241,0.24)]'
                      : 'bg-[#f8fafc] text-[#6b7280] ring-1 ring-slate-200'
                  }`}
                >
                  {item.label[language]}
                </button>
              )
            })}
          </div>
        </section>

        <section className="mt-4 rounded-[34px] bg-white/95 p-4 shadow-[0_20px_42px_rgba(77,90,120,0.12)] ring-1 ring-black/5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7b8192]">
                {t.resultEyebrow}
              </p>
              <p className="mt-2 text-sm text-[#6b7280]">
                {isDrawing ? t.drawingHint : result.vibe[language]}
              </p>
            </div>
            <button
              type="button"
              onClick={() => toggleFavorite(result.id)}
              className={`min-h-11 rounded-full px-4 text-sm font-medium transition ${
                isFavorite
                  ? 'bg-[#ec4899] text-white shadow-[0_12px_22px_rgba(236,72,153,0.22)]'
                  : 'bg-[#f8fafc] text-[#6b7280] ring-1 ring-slate-200'
              }`}
            >
              {isFavorite ? t.favorited : t.favorite}
            </button>
          </div>

          <div
            key={`${result.id}-${language}`}
            className={`mt-4 overflow-hidden rounded-[30px] bg-[linear-gradient(145deg,_#f7f7fb_0%,_#e9eef8_42%,_#e6e2f5_100%)] p-5 text-[#4b5563] shadow-[0_18px_38px_rgba(99,102,241,0.12)] ring-1 ring-indigo-100 transition duration-500 ${
              isDrawing ? 'scale-[0.985] opacity-75' : 'animate-[reveal-card_560ms_cubic-bezier(.22,1,.36,1)]'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#6366f1]">{result.vibe[language]}</p>
                <h2 className="mt-2 max-w-[12rem] text-[30px] leading-[1.06] font-semibold tracking-[-0.05em] text-[#111827]">
                  {result.name[language]}
                </h2>
                <p className="mt-3 max-w-[15rem] text-sm leading-6 text-[#6b7280]">{result.desc[language]}</p>
              </div>
              <div className="rounded-[24px] bg-white/80 px-3 py-3 text-right backdrop-blur-sm ring-1 ring-indigo-100">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#7b8192]">{t.score}</p>
                <p className="text-2xl font-semibold text-[#111827]">{result.score}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-[22px] bg-white px-3 py-3 ring-1 ring-slate-200">
                {t.cardCategory} · {categoryLabels[result.category][language]}
              </div>
              <div className="rounded-[22px] bg-white px-3 py-3 ring-1 ring-slate-200">
                {t.cardBudget} · {t.priceUnit}
                {result.price}
              </div>
              <div className="rounded-[22px] bg-white px-3 py-3 ring-1 ring-slate-200">
                {t.cardSpice} · {result.spice}/4
              </div>
              <div className="rounded-[22px] bg-white px-3 py-3 ring-1 ring-slate-200">
                {t.cardMood} · {result.vibe[language]}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {result.tags[language].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white px-3 py-1.5 text-xs text-[#6366f1] ring-1 ring-indigo-100"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[30px] bg-white/95 p-4 shadow-[0_14px_30px_rgba(77,90,120,0.10)] ring-1 ring-black/5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7b8192]">
                {t.filtersEyebrow}
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#111827]">
                {t.filtersTitle}
              </h2>
            </div>
            <p className="rounded-full bg-[#eef2ff] px-3 py-2 text-xs text-[#6366f1]">{t.iphoneHint}</p>
          </div>

          <div className="mt-5 space-y-5">
            <label className="block">
              <div className="flex items-center justify-between text-sm text-[#6b7280]">
                <span>{t.budgetLabel}</span>
                <strong className="text-base font-semibold text-[#111827]">
                  {t.priceUnit}
                  {budget}
                </strong>
              </div>
              <input
                type="range"
                min="20"
                max="45"
                value={budget}
                onChange={(event) => setBudget(Number(event.target.value))}
                className="mt-3 w-full accent-[#b8a6ae]"
              />
            </label>

            <label className="block">
              <div className="flex items-center justify-between text-sm text-[#6b7280]">
                <span>{t.spiceLabel}</span>
                <strong className="text-base font-semibold text-[#111827]">{maxSpice}/4</strong>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                value={maxSpice}
                onChange={(event) => setMaxSpice(Number(event.target.value))}
                className="mt-3 w-full accent-[#9eb7ae]"
              />
            </label>
          </div>
        </section>

        <section className="mt-4 rounded-[30px] bg-white/95 p-4 shadow-[0_14px_30px_rgba(77,90,120,0.10)] ring-1 ring-black/5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7b8192]">
                {t.blacklistEyebrow}
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#111827]">
                {t.blacklistTitle}
              </h2>
            </div>
            <p className="max-w-[8rem] text-right text-xs leading-5 text-[#6b7280]">{t.blacklistHint}</p>
          </div>

          <div className="mt-4 grid gap-3">
            {menus.map((item) => {
              const disabled = excluded.includes(item.id)

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleExcluded(item.id)}
                  className={`min-h-11 rounded-[24px] px-4 py-3 text-left transition ${
                    disabled
                      ? 'bg-[#f3f4f6] text-[#9ca3af] ring-1 ring-slate-200'
                      : 'bg-white text-[#374151] shadow-[0_10px_18px_rgba(77,90,120,0.08)] ring-1 ring-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-medium">{item.name[language]}</h3>
                      <p className="mt-1 text-sm text-[#6b7280]">
                        {categoryLabels[item.category][language]} · {t.priceUnit}
                        {item.price}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-50 px-3 py-1 text-xs text-[#6b7280] ring-1 ring-slate-200">
                      {disabled ? t.exclude : t.keep}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        <section className="mt-4 grid gap-4">
          <article className="rounded-[30px] bg-white/95 p-4 shadow-[0_14px_30px_rgba(77,90,120,0.10)] ring-1 ring-black/5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7b8192]">
                  {t.recentEyebrow}
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#111827]">
                  {t.recentTitle}
                </h2>
              </div>
              <p className="max-w-[7.5rem] text-right text-xs leading-5 text-[#6b7280]">{t.recentHint}</p>
            </div>

            <div className="mt-4 grid gap-3">
              {history.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="rounded-[24px] bg-white px-4 py-3 shadow-[0_10px_18px_rgba(77,90,120,0.08)] ring-1 ring-slate-200"
                >
                  <div className="flex items-center justify-between gap-3">
                    <strong className="text-base font-medium text-[#111827]">{item.name[language]}</strong>
                    <span className="text-xs text-[#6b7280]">#{index + 1}</span>
                  </div>
                  <p className="mt-1 text-sm text-[#6b7280]">
                    {categoryLabels[item.category][language]} · {t.priceUnit}
                    {item.price} · {item.score} {t.points}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[30px] bg-white/95 p-4 shadow-[0_14px_30px_rgba(77,90,120,0.10)] ring-1 ring-black/5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7b8192]">
                  {t.favoritesEyebrow}
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-[#111827]">
                  {t.favoritesTitle}
                </h2>
              </div>
              <p className="text-xs text-[#6b7280]">{t.favoritesHint}</p>
            </div>

            <div className="mt-4 grid gap-3">
              {favoriteItems.length ? (
                favoriteItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex min-h-11 items-center justify-between gap-3 rounded-[24px] bg-white px-4 py-3 shadow-[0_10px_18px_rgba(77,90,120,0.08)] ring-1 ring-slate-200"
                  >
                    <div>
                      <strong className="text-base font-medium text-[#111827]">{item.name[language]}</strong>
                      <p className="mt-1 text-sm text-[#6b7280]">
                        {categoryLabels[item.category][language]} · {t.priceUnit}
                        {item.price}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(item.id)}
                      className="min-h-11 rounded-full bg-[#f3f4f6] px-4 text-sm text-[#4b5563] shadow-[0_8px_16px_rgba(77,90,120,0.08)]"
                    >
                      {t.remove}
                    </button>
                  </div>
                ))
              ) : (
                <div className="rounded-[24px] bg-white px-4 py-5 text-sm leading-6 text-[#6b7280] ring-1 ring-slate-200">
                  {t.favoritesEmpty}
                </div>
              )}
            </div>
          </article>
        </section>
      </div>

      <div className="sticky bottom-0 z-20 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-[430px] rounded-[30px] bg-[rgba(255,255,255,0.84)] p-3 shadow-[0_-12px_28px_rgba(77,90,120,0.16)] ring-1 ring-black/5 backdrop-blur-xl">
          <button
            type="button"
            onClick={drawLunch}
            disabled={isDrawing}
            className="min-h-12 w-full rounded-[24px] bg-[linear-gradient(135deg,_#4f46e5_0%,_#7c3aed_100%)] px-5 text-base font-semibold text-white shadow-[0_16px_28px_rgba(99,102,241,0.34)] transition active:scale-[0.985] disabled:opacity-80"
          >
            {isDrawing ? t.drawing : t.draw}
          </button>
        </div>
      </div>
    </main>
  )
}

export default App
