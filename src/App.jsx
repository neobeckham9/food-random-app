import { useEffect, useMemo, useRef, useState } from 'react'

const menus = [
  {
    id: 1,
    name: '椒麻鸡腿饭',
    category: '盖饭',
    price: 28,
    spice: 3,
    score: 92,
    tags: ['稳妥', '下饭', '高蛋白'],
    vibe: '高效工作日',
    desc: '鸡腿外酥里嫩，配椒麻汁，适合想吃得扎实一点的时候。',
  },
  {
    id: 2,
    name: '酸汤肥牛米线',
    category: '粉面',
    price: 32,
    spice: 2,
    score: 90,
    tags: ['热乎', '解馋', '汤面'],
    vibe: '下雨天续命',
    desc: '酸香开胃，肥牛和米线都很顶，适合状态低迷时回血。',
  },
  {
    id: 3,
    name: '照烧三文鱼轻食碗',
    category: '轻食',
    price: 39,
    spice: 0,
    score: 88,
    tags: ['轻负担', '高颜值', '健身友好'],
    vibe: '想控制热量',
    desc: '谷物、蔬菜和三文鱼搭配完整，适合中午不想犯困。',
  },
  {
    id: 4,
    name: '老北京鸡肉卷套餐',
    category: '西式快餐',
    price: 24,
    spice: 1,
    score: 83,
    tags: ['便宜', '快', '解馋'],
    vibe: '预算收紧',
    desc: '速度快、价格稳，适合会议缝隙里迅速解决一餐。',
  },
  {
    id: 5,
    name: '番茄牛腩焗饭',
    category: '焗饭',
    price: 31,
    spice: 0,
    score: 87,
    tags: ['治愈', '浓郁', '奶香'],
    vibe: '想吃点安慰型碳水',
    desc: '番茄和牛腩味道厚实，奶香焗饭很容易一口气炫完。',
  },
  {
    id: 6,
    name: '泰式青柠鸡排沙拉',
    category: '轻食',
    price: 35,
    spice: 1,
    score: 84,
    tags: ['清爽', '酸口', '不腻'],
    vibe: '下午还要继续卷',
    desc: '酸甜带一点冲劲，适合想清爽又不想太寡淡的时候。',
  },
  {
    id: 7,
    name: '双拼寿司便当',
    category: '日料',
    price: 42,
    spice: 0,
    score: 86,
    tags: ['仪式感', '均衡', '精致'],
    vibe: '想吃得像周五',
    desc: '寿司加炸物双拼，满足感和仪式感都在线。',
  },
  {
    id: 8,
    name: '重庆小面加煎蛋',
    category: '粉面',
    price: 21,
    spice: 4,
    score: 85,
    tags: ['刺激', '醒神', '性价比'],
    vibe: '重口回血',
    desc: '辣度直接，价格友好，适合突然很想来点猛的。',
  },
]

const moods = ['都行', '想吃热乎的', '想吃清爽的', '想吃重口的', '想省钱', '想犒劳自己']

const FAVORITES_KEY = 'lunch-box-favorites'
const HISTORY_KEY = 'lunch-box-history'

const initialItem = menus[1]

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
  const [budget, setBudget] = useState(35)
  const [maxSpice, setMaxSpice] = useState(3)
  const [mood, setMood] = useState('都行')
  const [excluded, setExcluded] = useState([])
  const [history, setHistory] = useState(loadHistoryItems)
  const [result, setResult] = useState(() => loadHistoryItems()[0] ?? initialItem)
  const [favorites, setFavorites] = useState(loadFavoriteIds)
  const [isDrawing, setIsDrawing] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [])

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

      if (mood === '想吃热乎的') return ['粉面', '焗饭', '盖饭'].includes(item.category)
      if (mood === '想吃清爽的') return ['轻食', '日料'].includes(item.category)
      if (mood === '想吃重口的') return item.spice >= 2 || item.tags.includes('下饭')
      if (mood === '想省钱') return item.price <= 28
      if (mood === '想犒劳自己') return item.price >= 30 && item.score >= 86

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
    }, 480)
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
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f7f8fb_0%,_#eef1f7_38%,_#e9edf4_100%)] text-stone-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[420px] flex-col px-4 pb-[calc(8.5rem+env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">
        <section className="rounded-[28px] bg-white/86 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-black/5 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-600">
                Lunch Box
              </p>
              <h1 className="mt-2 text-[32px] leading-[1.05] font-semibold tracking-[-0.05em] text-stone-950">
                今天吃什么
              </h1>
              <p className="mt-2 max-w-[18rem] text-sm leading-6 text-stone-500">
                为 iPhone 优化的外卖盲盒。少一点网页感，多一点原生 App 的克制和节奏。
              </p>
            </div>
            <div className="rounded-[22px] bg-slate-900 px-3 py-2 text-right text-white shadow-[0_8px_20px_rgba(15,23,42,0.25)]">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-300">候选</p>
              <p className="text-xl font-semibold">{candidates.length}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
            {moods.map((item) => {
              const active = item === mood
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMood(item)}
                  className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-medium transition ${
                    active
                      ? 'bg-slate-900 text-white shadow-[0_8px_20px_rgba(15,23,42,0.18)]'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item}
                </button>
              )
            })}
          </div>
        </section>

        <section
          className={`mt-4 overflow-hidden rounded-[32px] bg-[linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(247,249,252,0.92))] p-4 shadow-[0_18px_40px_rgba(15,23,42,0.10)] ring-1 ring-black/5 transition duration-300 ${
            isDrawing ? 'scale-[0.985] opacity-80' : 'scale-100 opacity-100'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Blind Box Result
              </p>
              <p className="mt-2 text-sm text-slate-500">{isDrawing ? '正在摇一份更合适的午餐...' : result.vibe}</p>
            </div>
            <button
              type="button"
              onClick={() => toggleFavorite(result.id)}
              className={`min-h-11 rounded-full px-4 text-sm font-medium transition ${
                isFavorite
                  ? 'bg-rose-500 text-white shadow-[0_8px_20px_rgba(244,63,94,0.25)]'
                  : 'bg-white text-slate-600 ring-1 ring-slate-200'
              }`}
            >
              {isFavorite ? '已收藏' : '收藏'}
            </button>
          </div>

          <div
            key={result.id}
            className={`mt-4 rounded-[28px] bg-[linear-gradient(180deg,_#0f172a_0%,_#1e293b_100%)] p-5 text-white shadow-[0_20px_35px_rgba(15,23,42,0.25)] transition duration-500 ${
              isDrawing ? 'translate-y-2 rotate-x-6 blur-[1px]' : 'translate-y-0 animate-[fade-slide-in_420ms_ease-out]'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="max-w-[12rem] text-[30px] leading-[1.08] font-semibold tracking-[-0.05em]">
                  {result.name}
                </h2>
                <p className="mt-3 text-sm text-slate-300">{result.desc}</p>
              </div>
              <div className="rounded-[22px] bg-white/12 px-3 py-2 text-right backdrop-blur-sm">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-300">推荐</p>
                <p className="text-2xl font-semibold">{result.score}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-2xl bg-white/10 px-3 py-3">类别 · {result.category}</div>
              <div className="rounded-2xl bg-white/10 px-3 py-3">预算 · ￥{result.price}</div>
              <div className="rounded-2xl bg-white/10 px-3 py-3">辣度 · {result.spice}/4</div>
              <div className="rounded-2xl bg-white/10 px-3 py-3">状态 · {result.vibe}</div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {result.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/10 px-3 py-1.5 text-xs text-slate-200">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[28px] bg-white/86 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-black/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Filters</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">今天的条件</h2>
            </div>
            <p className="rounded-full bg-slate-100 px-3 py-2 text-xs text-slate-500">iPhone 优先</p>
          </div>

          <div className="mt-5 space-y-5">
            <label className="block">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>预算上限</span>
                <strong className="text-base font-semibold text-slate-900">￥{budget}</strong>
              </div>
              <input
                type="range"
                min="20"
                max="45"
                value={budget}
                onChange={(event) => setBudget(Number(event.target.value))}
                className="mt-3 w-full accent-sky-500"
              />
            </label>

            <label className="block">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>辣度上限</span>
                <strong className="text-base font-semibold text-slate-900">{maxSpice}/4</strong>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                value={maxSpice}
                onChange={(event) => setMaxSpice(Number(event.target.value))}
                className="mt-3 w-full accent-emerald-500"
              />
            </label>
          </div>
        </section>

        <section className="mt-4 rounded-[28px] bg-white/86 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-black/5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Blacklist</p>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">今天不想吃的</h2>
            </div>
            <p className="text-xs text-slate-400">点一下即可排除</p>
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
                      ? 'bg-slate-100 text-slate-400 ring-1 ring-slate-200'
                      : 'bg-slate-50 text-slate-800 shadow-[0_8px_18px_rgba(15,23,42,0.05)] ring-1 ring-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-medium">{item.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.category} · ￥{item.price}
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-500 ring-1 ring-slate-200">
                      {disabled ? '已排除' : '保留'}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        <section className="mt-4 grid gap-4">
          <article className="rounded-[28px] bg-white/86 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-black/5 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Recent</p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">最近抽取</h2>
              </div>
              <p className="text-xs text-slate-400">最近 3 条</p>
            </div>
            <div className="mt-4 grid gap-3">
              {history.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="rounded-[22px] bg-slate-50 px-4 py-3 shadow-[0_8px_18px_rgba(15,23,42,0.05)] ring-1 ring-slate-100"
                >
                  <div className="flex items-center justify-between gap-3">
                    <strong className="text-base font-medium text-slate-900">{item.name}</strong>
                    <span className="text-xs text-slate-400">#{index + 1}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.category} · ￥{item.price} · {item.score} 分
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[28px] bg-white/86 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-black/5 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Favorites</p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">我的收藏</h2>
              </div>
              <p className="text-xs text-slate-400">本地保存</p>
            </div>
            <div className="mt-4 grid gap-3">
              {favoriteItems.length ? (
                favoriteItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex min-h-11 items-center justify-between gap-3 rounded-[22px] bg-slate-50 px-4 py-3 shadow-[0_8px_18px_rgba(15,23,42,0.05)] ring-1 ring-slate-100"
                  >
                    <div>
                      <strong className="text-base font-medium text-slate-900">{item.name}</strong>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.category} · ￥{item.price}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(item.id)}
                      className="min-h-11 rounded-full bg-white px-4 text-sm text-slate-600 ring-1 ring-slate-200"
                    >
                      移除
                    </button>
                  </div>
                ))
              ) : (
                <div className="rounded-[22px] bg-slate-50 px-4 py-5 text-sm leading-6 text-slate-500 ring-1 ring-slate-100">
                  还没有收藏。抽到满意的那一份时，点结果卡右上角的“收藏”。
                </div>
              )}
            </div>
          </article>
        </section>
      </div>

      <div className="sticky bottom-0 z-20 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-[420px] rounded-[28px] bg-white/88 p-3 shadow-[0_-12px_30px_rgba(15,23,42,0.12)] ring-1 ring-black/5 backdrop-blur-xl">
          <button
            type="button"
            onClick={drawLunch}
            disabled={isDrawing}
            className="min-h-12 w-full rounded-[22px] bg-[linear-gradient(180deg,_#0f172a_0%,_#1e293b_100%)] px-5 text-base font-semibold text-white shadow-[0_12px_24px_rgba(15,23,42,0.28)] transition active:scale-[0.98] disabled:opacity-80"
          >
            {isDrawing ? '正在开盲盒...' : '开盲盒 / 再抽一次'}
          </button>
        </div>
      </div>
    </main>
  )
}

export default App
