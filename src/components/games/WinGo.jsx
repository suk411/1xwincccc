import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './WinGo.css'
import timerAct from '@/assets/wingo/timer_act.png'
import timerNonAct from '@/assets/wingo/timer_nonact.png'
import navCs from '@/assets/wingo/nav_cs.png'
import navSound from '@/assets/wingo/nav_sound.png'
import walletBalIcon from '@/assets/wingo/wallet_bal_icon.png'
import refreshIcon from '@/assets/wingo/refresh.webp'
import timerBg from '@/assets/wingo/timerbg.png'
import clockIcon from '@/assets/wingo/clockicon.png'
import clockIconActive from '@/assets/wingo/clockiconative.png'
import noDataImg from '@/assets/wingo/nodata.png'
import di1Sound from '@/assets/wingo/mp3/di1.mp3'
import di2Sound from '@/assets/wingo/mp3/di2.mp3'
import { refreshBalance, useProfile } from '@/hooks/useProfile'
import { toast } from '@/hooks/use-toast'
import { wingoService } from '@/services/wingoService'

const GAMES = ['30s', '1Min', '3Min', '5Min']
const MODE_MAP = { '30s': '30s', '1Min': '1m', '3Min': '3m', '5Min': '5m' }

const POPUP_CFG = {
  green: { grad: 'grad-green', label: 'green', ac: 'rgb(71,186,124)', footBg: 'linear-gradient(90deg,rgb(63,170,112),rgb(71,186,124))' },
  red: { grad: 'grad-red', label: 'red', ac: 'rgb(255,100,108)', footBg: 'linear-gradient(90deg,rgb(252,80,80),rgb(255,100,108))' },
  violet: { grad: 'grad-violet', label: 'violet', ac: 'rgb(182,88,254)', footBg: 'linear-gradient(90deg,rgb(182,88,254),rgb(205,116,255))' },
  big: { grad: 'grad-big', label: 'big', ac: 'rgb(230,160,0)', footBg: 'linear-gradient(90deg,rgb(230,160,0),rgb(255,190,30))' },
  small: { grad: 'grad-small', label: 'small', ac: 'rgb(40,130,220)', footBg: 'linear-gradient(90deg,rgb(40,130,220),rgb(70,160,255))' },
  0: { grad: 'grad-split', label: '0', ac: 'rgb(251,78,78)', footBg: 'linear-gradient(135deg,rgb(251,78,78) 50%,rgb(182,88,254) 50%)' },
  5: { grad: 'grad-split', label: '5', ac: 'rgb(182,88,254)', footBg: 'linear-gradient(135deg,rgb(251,78,78) 50%,rgb(182,88,254) 50%)' },
  1: { grad: 'grad-green', label: '1', ac: 'rgb(71,186,124)', footBg: 'linear-gradient(90deg,rgb(63,170,112),rgb(71,186,124))' },
  2: { grad: 'grad-red', label: '2', ac: 'rgb(255,100,108)', footBg: 'linear-gradient(90deg,rgb(252,80,80),rgb(255,100,108))' },
  3: { grad: 'grad-green', label: '3', ac: 'rgb(71,186,124)', footBg: 'linear-gradient(90deg,rgb(63,170,112),rgb(71,186,124))' },
  4: { grad: 'grad-red', label: '4', ac: 'rgb(255,100,108)', footBg: 'linear-gradient(90deg,rgb(252,80,80),rgb(255,100,108))' },
  6: { grad: 'grad-red', label: '6', ac: 'rgb(255,100,108)', footBg: 'linear-gradient(90deg,rgb(252,80,80),rgb(255,100,108))' },
  7: { grad: 'grad-green', label: '7', ac: 'rgb(71,186,124)', footBg: 'linear-gradient(90deg,rgb(63,170,112),rgb(71,186,124))' },
  8: { grad: 'grad-red', label: '8', ac: 'rgb(255,100,108)', footBg: 'linear-gradient(90deg,rgb(252,80,80),rgb(255,100,108))' },
  9: { grad: 'grad-green', label: '9', ac: 'rgb(71,186,124)', footBg: 'linear-gradient(90deg,rgb(63,170,112),rgb(71,186,124))' },
}

function getNumberColor(number) {
  const n = parseInt(number)
  if (n === 0) return 'num-mixed-0'
  if (n === 5) return 'num-mixed-5'
  if ([1, 3, 7, 9].includes(n)) return 'num-green'
  return 'num-red'
}

function getOriginDots(number) {
  const n = parseInt(number)
  if (n === 0) {
    return (
      <>
        <div className="GameRecord__C-origin-I red" />
        <div className="GameRecord__C-origin-I violet" />
      </>
    )
  }
  if (n === 5) {
    return (
      <>
        <div className="GameRecord__C-origin-I green" />
        <div className="GameRecord__C-origin-I violet" />
      </>
    )
  }
  if ([1, 3, 7, 9].includes(n)) {
    return <div className="GameRecord__C-origin-I green" />
  }
  return <div className="GameRecord__C-origin-I red" />
}

const BALANCE_CHIPS = [1, 10, 100, 1000]
const MULTIPLIER_CHIPS = ['X1', 'X5', 'X10', 'X20', 'X50', 'X100']

export default function WinGo() {
  const { balance } = useProfile(false)
  const navigate = useNavigate()
  const [activeGame, setActiveGame] = useState('30s')
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [issueNumber, setIssueNumber] = useState('')
  const [recordTab, setRecordTab] = useState('game')
  const [showBetOverlay, setShowBetOverlay] = useState(false)
  const [betType, setBetType] = useState('green')
  const [currentAc, setCurrentAc] = useState('rgb(71,186,124)')
  const [currentFootBg, setCurrentFootBg] = useState('linear-gradient(90deg,rgb(63,170,112),rgb(71,186,124))')
  const [currentGrad, setCurrentGrad] = useState('grad-green')
  const [selectedBalanceIdx, setSelectedBalanceIdx] = useState(0)
  const [selectedMulIdx, setSelectedMulIdx] = useState(0)
  const [qty, setQty] = useState(1)
  const [qtyInput, setQtyInput] = useState('1')
  const [agreed, setAgreed] = useState(true)
  const [showHowTo, setShowHowTo] = useState(false)
  const [showPresale, setShowPresale] = useState(false)
  const [gameRecords, setGameRecords] = useState([])
  const [trendStats, setTrendStats] = useState([])
  const [trendHistory, setTrendHistory] = useState([])
  const [myBets, setMyBets] = useState([])
  const [cdActive, setCdActive] = useState(false)
  const [cdD1, setCdD1] = useState('0')
  const [cdD2, setCdD2] = useState('5')
  const [gamePage, setGamePage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [myBetsPage, setMyBetsPage] = useState(1)
  const [myBetsTotal, setMyBetsTotal] = useState(0)
  const [selectedBet, setSelectedBet] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const lastRefreshTimeRef = useRef(0)

  const svgRef = useRef(null)
  const pathRef = useRef(null)
  const body2Ref = useRef(null)
  const endTimeRef = useRef(0)
  const issueRef = useRef('')
  const nextRef = useRef(null)
  const syncingRef = useRef(false)
  const lastSyncEndRef = useRef(0)
  const historyDelayRef = useRef(null)
  const di1AudioRef = useRef(new Audio(di1Sound))
  const di2AudioRef = useRef(new Audio(di2Sound))
  const lastPlayedSecondRef = useRef(null)
  const betIssueRef = useRef('')
  const [showWinPopup, setShowWinPopup] = useState(false)
  const [winData, setWinData] = useState({ result: 0, winamt: [], issue: '' })
  const [winAutoClose, setWinAutoClose] = useState(true)
  const winCloseTimerRef = useRef(null)
  const winCloseCountdownRef = useRef(3)
  const [winCountdown, setWinCountdown] = useState(3)

  const total = (selectedBalanceIdx >= 0 ? BALANCE_CHIPS[selectedBalanceIdx] : 1) * qty

  const handleRefreshBalance = async () => {
    const now = Date.now()
    if (now - lastRefreshTimeRef.current < 10000) {
      return
    }
    lastRefreshTimeRef.current = now
    setIsRefreshing(true)
    try {
      await refreshBalance()
      toast({ title: 'Refresh success' })
    } catch (err) {
      console.error('Refresh balance failed:', err)
    } finally {
      setIsRefreshing(false)
    }
  }

  function getApiMode() {
    return MODE_MAP[activeGame] || '30s'
  }

  async function syncCurrent() {
    const res = await wingoService.getCurrent(getApiMode())
    issueRef.current = res.current.issueNumber
    endTimeRef.current = res.current.endTime
    nextRef.current = res.next || null
    setIssueNumber(res.current.issueNumber)
    setTimeRemaining(Math.max(0, Math.ceil((res.current.endTime - Date.now()) / 1000)))
  }

  async function loadHistory(page = 1) {
    const res = await wingoService.getHistory(page, getApiMode())
    const list = res?.data?.list || []
    setGameRecords(list)
    setTrendHistory(list.slice(0, 100))
    if (res?.data?.totalPage) {
      setTotalPage(res.data.totalPage)
    }
  }

  async function loadTrends() {
    const res = await wingoService.getTrends(getApiMode())
    setTrendStats(res?.data || [])
  }

  async function loadMyBets(page = 1) {
    if (!localStorage.getItem('auth_token')) {
      setMyBets([])
      setMyBetsTotal(0)
      return
    }
    const res = await wingoService.getMyBets({ page, limit: 25, mode: getApiMode() })
    setMyBets(res?.items || [])
    if (res?.total) {
      setMyBetsTotal(Math.ceil(res.total / 25))
    }
  }

  async function submitBet() {
    if (!agreed) {
      toast({ title: 'WinGo', description: 'Please agree to the Pre-sale rules' })
      return
    }
    if (!issueRef.current) {
      toast({ title: 'WinGo', description: 'Game not synced yet. Please try again.' })
      return
    }
    if (timeRemaining <= 5) {
      toast({ title: 'WinGo', description: 'Betting closed for this round' })
      return
    }
    if (total > Number(balance || 0)) {
      toast({ title: 'Insufficient balance' })
      return
    }

    const selectType = typeof betType === 'number' ? String(betType) : String(betType)

    setShowBetOverlay(false)
    betIssueRef.current = issueRef.current
    wingoService.placeBet({
      issueNumber: issueRef.current,
      betamount: total,
      selectType,
      mode: getApiMode(),
    }).then(() => {
      toast({ title: 'Bet Success' })
      const tasks = [refreshBalance()]
      if (recordTab === 'my') tasks.push(loadMyBets())
      Promise.allSettled(tasks)
    }).catch((err) => {
      toast({ title: 'Bet failed', description: err?.message || 'Failed to place bet' })
    })
  }

  useEffect(() => {
    Promise.allSettled([syncCurrent(), loadHistory(gamePage), loadTrends()]).catch(() => {})
    if (localStorage.getItem('auth_token')) {
      loadMyBets(myBetsPage).catch(() => {})
    }
  }, [gamePage, activeGame])

  useEffect(() => {
    const interval = setInterval(() => {
      const end = endTimeRef.current
      if (!end) return
      const now = Date.now()
      const remaining = Math.max(0, Math.ceil((end - now) / 1000))

      if (now >= end) {
        if (lastSyncEndRef.current !== end && !syncingRef.current) {
          lastSyncEndRef.current = end
          syncingRef.current = true

          const finishedIssue = issueRef.current

          Promise.allSettled([syncCurrent()])
            .finally(() => { syncingRef.current = false })

          if (historyDelayRef.current) clearTimeout(historyDelayRef.current)
          historyDelayRef.current = setTimeout(() => {
            loadHistory().catch(() => {})
          }, 2000)

          if (betIssueRef.current && betIssueRef.current === finishedIssue) {
            betIssueRef.current = ''
            wingoService.checkWin(finishedIssue, getApiMode()).then(res => {
              if (res.winamt && res.winamt.length > 0) {
                setWinData({ result: res.result, winamt: res.winamt, issue: res.issue })
                setShowWinPopup(true)
                startWinCloseCountdown()
              }
            }).catch(() => {})
          }
        }

        setTimeRemaining(0)
        return
      }

      setTimeRemaining(remaining)
    }, 250)
    return () => {
      clearInterval(interval)
      if (historyDelayRef.current) clearTimeout(historyDelayRef.current)
    }
  }, [])

  useEffect(() => {
    if (recordTab === 'my') {
      loadMyBets(myBetsPage).catch(() => {})
    }
    if (recordTab === 'game') {
      loadHistory(gamePage).catch(() => {})
    }
    if (recordTab === 'trend' && trendStats.length === 0) {
      loadTrends().catch(() => {})
    }
  }, [recordTab])
  
  useEffect(() => {
    if (recordTab === 'my') {
      loadMyBets(myBetsPage).catch(() => {})
    }
  }, [myBetsPage])

  useEffect(() => {
    if (timeRemaining <= 5 && timeRemaining >= 1) {
      setCdActive(true)
      setCdD1('0')
      setCdD2(String(timeRemaining))
      
      if (lastPlayedSecondRef.current !== timeRemaining) {
        lastPlayedSecondRef.current = timeRemaining
        
        if (timeRemaining >= 2) {
          di1AudioRef.current.currentTime = 0
          di1AudioRef.current.play().catch(() => {})
        } else if (timeRemaining === 1) {
          di2AudioRef.current.currentTime = 0
          di2AudioRef.current.play().catch(() => {})
        }
      }
    } else {
      setCdActive(false)
      lastPlayedSecondRef.current = null
    }
  }, [timeRemaining])

  useEffect(() => {
    if (showBetOverlay && timeRemaining <= 5 && timeRemaining >= 1) {
      setShowBetOverlay(false)
    }
  }, [timeRemaining, showBetOverlay])

  useEffect(() => {
    if (recordTab !== 'trend') return
    const timer = setTimeout(() => {
      const path = pathRef.current
      const items = body2Ref.current?.querySelectorAll('.Trend__C-body2-Num-item')
      if (!path || !items) return
      const activeItems = Array.from(items).filter(item =>
        Array.from(item.classList).some(c => c.startsWith('action'))
      )
      if (activeItems.length === 0) return
      const svg = svgRef.current
      const svgRect = svg.getBoundingClientRect()
      let d = ''
      activeItems.forEach((item, index) => {
        const r = item.getBoundingClientRect()
        const x = r.left - svgRect.left + r.width / 2
        const y = r.top - svgRect.top + r.height / 2
        d += index === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`
      })
      path.setAttribute('d', d)
    }, 100)
    return () => clearTimeout(timer)
  }, [recordTab, trendHistory])

  const minutes = Math.floor(Math.max(0, timeRemaining) / 60)
  const seconds = Math.max(0, timeRemaining) % 60
  const minStr = String(minutes).padStart(2, '0')
  const secStr = String(seconds).padStart(2, '0')

  function openPopup(key) {
    const c = POPUP_CFG[key]
    if (!c) return
    setCurrentAc(c.ac)
    setCurrentFootBg(c.footBg)
    setCurrentGrad(c.grad)
    setBetType(key)
    setSelectedBalanceIdx(0)
    setShowBetOverlay(true)
  }

  function selectBalanceChip(idx) {
    setSelectedBalanceIdx(idx)
  }

  function selectMulChip(idx) {
    setSelectedMulIdx(idx)
    const val = parseInt(MULTIPLIER_CHIPS[idx].replace('X', ''))
    setQty(val)
    setQtyInput(String(val))
  }

  function changeQty(d) {
    setQty(prev => {
      const next = Math.max(1, prev + d)
      setQtyInput(String(next))
      return next
    })
  }

  function toggleAgree() {
    setAgreed(prev => !prev)
  }

  const WIN_RESULT_MAP = {
    0: { color: 'color_red', label: 'Red', type: 'Small', cssClass: 'color_half_red_violet' },
    1: { color: 'color_green', label: 'Green', type: 'Small', cssClass: 'color_green' },
    2: { color: 'color_red', label: 'Red', type: 'Small', cssClass: 'color_red' },
    3: { color: 'color_green', label: 'Green', type: 'Small', cssClass: 'color_green' },
    4: { color: 'color_red', label: 'Red', type: 'Small', cssClass: 'color_red' },
    5: { color: 'color_green', label: 'Green', type: 'Big', cssClass: 'color_half_green_violet' },
    6: { color: 'color_red', label: 'Red', type: 'Big', cssClass: 'color_red' },
    7: { color: 'color_green', label: 'Green', type: 'Big', cssClass: 'color_green' },
    8: { color: 'color_red', label: 'Red', type: 'Big', cssClass: 'color_red' },
    9: { color: 'color_green', label: 'Green', type: 'Big', cssClass: 'color_green' },
  }

  function closeWinPopup() {
    if (winCloseTimerRef.current) {
      clearInterval(winCloseTimerRef.current)
      winCloseTimerRef.current = null
    }
    setShowWinPopup(false)
  }

  function toggleWinAutoClose() {
    setWinAutoClose(prev => {
      if (prev) {
        if (winCloseTimerRef.current) {
          clearInterval(winCloseTimerRef.current)
          winCloseTimerRef.current = null
        }
      } else {
        winCloseCountdownRef.current = 3
        setWinCountdown(3)
        winCloseTimerRef.current = setInterval(() => {
          winCloseCountdownRef.current -= 1
          setWinCountdown(winCloseCountdownRef.current)
          if (winCloseCountdownRef.current <= 0) {
            clearInterval(winCloseTimerRef.current)
            winCloseTimerRef.current = null
            setShowWinPopup(false)
          }
        }, 1000)
      }
      return !prev
    })
  }

  function startWinCloseCountdown() {
    winCloseCountdownRef.current = 3
    setWinCountdown(3)
    if (winCloseTimerRef.current) clearInterval(winCloseTimerRef.current)
    winCloseTimerRef.current = setInterval(() => {
      winCloseCountdownRef.current -= 1
      setWinCountdown(winCloseCountdownRef.current)
      if (winCloseCountdownRef.current <= 0) {
        clearInterval(winCloseTimerRef.current)
        winCloseTimerRef.current = null
        setShowWinPopup(false)
      }
    }, 1000)
  }

  const gameItem = (game) => {
    const isActive = activeGame === game
    return (
      <div
        key={game}
        className={`GameList__C-item${isActive ? ' active' : ''}`}
        onClick={() => setActiveGame(game)}
      >
        <div style={{ backgroundImage: `url(${isActive ? clockIconActive : clockIcon})` }}>Win Go<br />{game}</div>
      </div>
    )
  }

  const numberBallItem = (num) => (
    <div key={num} className={`n${num}`} onClick={() => openPopup(num)} />
  )

  return (
    <div className="wingo-container">
      <nav className="navbar">
        <div className="navbar__content-left">
          <div className="back-btn" onClick={() => window.history.back()}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11.25 3.75L5.25 9L11.25 14.25" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div className="navbar__content-center">
          <svg className="brand-logo-svg" viewBox="0 0 388 72" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="blCrown_581" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fff1b8"></stop>
                <stop offset="50%" stopColor="#e8a735"></stop>
                <stop offset="100%" stopColor="#c68a1d"></stop>
              </linearGradient>
              <linearGradient id="blText_581" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fff8e1"></stop>
                <stop offset="20%" stopColor="#ffd54f"></stop>
                <stop offset="45%" stopColor="#e8a735"></stop>
                <stop offset="55%" stopColor="#a06a10"></stop>
                <stop offset="75%" stopColor="#e8a735"></stop>
                <stop offset="100%" stopColor="#fff1b8"></stop>
              </linearGradient>
              <linearGradient id="blStroke_581" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255,241,184,0.8)"></stop>
                <stop offset="100%" stopColor="rgba(255,213,79,0.6)"></stop>
              </linearGradient>
              <filter id="blShadow_581" x="-10%" y="-10%" width="130%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="rgba(0,0,0,0.35)"></feDropShadow>
              </filter>
              <filter id="blCrownS_581" x="-20%" y="-20%" width="150%" height="160%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="rgba(255,213,79,0.5)"></feDropShadow>
              </filter>
              <linearGradient id="blLine_581" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(232,167,53,0)"></stop>
                <stop offset="50%" stopColor="#ffd54f"></stop>
                <stop offset="100%" stopColor="rgba(232,167,53,0)"></stop>
              </linearGradient>
            </defs>
            <rect x="10" width="368" y="61" height="1.5" rx="0.75" fill="url(#blLine_581)" opacity="0.6"></rect>
            <text x="40" y="50" fontSize="46" fontWeight="900" fill="url(#blCrown_581)" filter="url(#blCrownS_581)" fontFamily="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, 'Segoe UI', Arial, Roboto, 'PingFang SC', miui, 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif">♕</text>
            <text x="86" y="48" fontSize="38" fontWeight="900" letterSpacing="4" fill="url(#blText_581)" filter="url(#blShadow_581)" fontFamily="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, 'Segoe UI', Arial, Roboto, 'PingFang SC', miui, 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif">1xKING</text>
          </svg>
        </div>
        <div className="navbar__content-right">
          <div className="WinGo__C-head-more">
            <div className="head-more-icon icon-service" />
            <div className="head-more-icon icon-more" />
            <div className="head-more-icon" style={{ backgroundImage: `url(${navCs})` }} onClick={() => setShowHowTo(true)} />
            <div className="head-more-icon" style={{ backgroundImage: `url(${navSound})` }} />
          </div>
        </div>
      </nav>

      <div className="main-container">
        <div className="Wallet__C">
          <div className="Wallet__C-balance">
            <div className="Wallet__C-balance-l1">
              <img src={walletBalIcon} alt="Wallet Icon" />
              <div>₹{isRefreshing ? '***' : Number(balance || 0).toFixed(2)}</div>
              <button type="button" className="refresh" aria-label="Refresh balance" onClick={handleRefreshBalance}>
                <img src={refreshIcon} alt="" />
              </button>
            </div>
            <div className="Wallet__C-balance-l2">wallet balance</div>
            <div className="Wallet__C-balance-l3">
              <div className="glass-btn btn-withdraw" onClick={() => { navigate('/bank', { state: { activeTab: 'withdraw' } }); }}>Withdraw</div>
              <div className="glass-btn btn-deposit" onClick={() => { navigate('/bank', { state: { activeTab: 'deposit' } }); }}>Deposit</div>
            </div>
          </div>
        </div>

        <div className="GameList__C" id="gameList">
          {GAMES.map(gameItem)}
        </div>

        <div className="TimeLeft__C" style={{ backgroundImage: `url(${timerBg})` }}>
          <div className="TimeLeft__C-scanline"></div>
          
          <a href="#" className="TimeLeft__C-rule" onClick={(e) => { e.preventDefault(); setShowHowTo(true); }}>How to play</a>
          <div className="TimeLeft__C-name">Win Go {activeGame}</div>

          <div className="TimeLeft__C-time">
            <div className="TimeLeft__C-time-digit"><span>{minStr[0]}</span></div>
            <div className="TimeLeft__C-time-digit"><span>{minStr[1]}</span></div>
            <div className="TimeLeft__C-time-colon">:</div>
            <div className="TimeLeft__C-time-digit"><span>{secStr[0]}</span></div>
            <div className="TimeLeft__C-time-digit"><span>{secStr[1]}</span></div>
          </div>

          <div className="TimeLeft__C-text">Time remaining</div>
          <div className="TimeLeft__C-id">{issueNumber}</div>

          <div className="TimeLeft__C-num">
            {gameRecords.slice(0, 5).map((it, i) => (
              <div key={`${it.issueNumber}-${i}`} className={`n${it.number}`} />
            ))}
          </div>
        </div>

        <div className="Betting__C">
          <div className={`Betting__C-mark${cdActive ? ' active' : ''}`} id="countdownOverlay">
            <div className="mark-rays" />
            <div className="mark-pulse" />
            <div className="mark-pulse pulse2" />
            <div className="mark-pulse pulse3" />
            <div className="mark-ring" />
            <div className="mark-ring ring2" />
            <div className="mark-nums">
              <div className="mark-digit">{cdD1}</div>
              <div className="mark-sep">:</div>
              <div className="mark-digit">{cdD2}</div>
            </div>
            <div className="mark-label">COUNTDOWN</div>
          </div>

          <div className="Betting__C-head">
            <div className="Betting__C-head-g" onClick={() => openPopup('green')}>green</div>
            <div className="Betting__C-head-p" onClick={() => openPopup('violet')}>violet</div>
            <div className="Betting__C-head-r" onClick={() => openPopup('red')}>red</div>
          </div>

          <div className="Betting__C-numC">
            <div className="n0" onClick={() => openPopup(0)}></div>
            <div className="n1" onClick={() => openPopup(1)}></div>
            <div className="n2" onClick={() => openPopup(2)}></div>
            <div className="n3" onClick={() => openPopup(3)}></div>
            <div className="n4" onClick={() => openPopup(4)}></div>
            <div className="n5" onClick={() => openPopup(5)}></div>
            <div className="n6" onClick={() => openPopup(6)}></div>
            <div className="n7" onClick={() => openPopup(7)}></div>
            <div className="n8" onClick={() => openPopup(8)}></div>
            <div className="n9" onClick={() => openPopup(9)}></div>
          </div>

          <div className="Betting__C-multiple">
            <div className="random-btn">random bet</div>
            <div className="multiplier-items">
              <div className={`multiplier-btn${selectedMulIdx === 0 ? ' active' : ''}`} onClick={() => selectMulChip(0)}>X1</div>
              <div className={`multiplier-btn${selectedMulIdx === 1 ? ' active' : ''}`} onClick={() => selectMulChip(1)}>X5</div>
              <div className={`multiplier-btn${selectedMulIdx === 2 ? ' active' : ''}`} onClick={() => selectMulChip(2)}>X10</div>
              <div className={`multiplier-btn${selectedMulIdx === 3 ? ' active' : ''}`} onClick={() => selectMulChip(3)}>X20</div>
              <div className={`multiplier-btn${selectedMulIdx === 4 ? ' active' : ''}`} onClick={() => selectMulChip(4)}>X50</div>
              <div className={`multiplier-btn${selectedMulIdx === 5 ? ' active' : ''}`} onClick={() => selectMulChip(5)}>X100</div>
            </div>
          </div>

          <div className="Betting__C-foot">
            <div className="Betting__C-foot-b" onClick={() => openPopup('big')}>big</div>
            <div className="Betting__C-foot-s" onClick={() => openPopup('small')}>small</div>
          </div>
        </div>

        <div className="RecordNav__C">
          <div className={recordTab === 'game' ? 'active' : ''} data-tab="game" onClick={() => setRecordTab('game')}>Records</div>
          <div className={recordTab === 'trend' ? 'active' : ''} data-tab="trend" onClick={() => setRecordTab('trend')}>Trend</div>
          <div className={recordTab === 'my' ? 'active' : ''} data-tab="my" onClick={() => setRecordTab('my')}>My Bets</div>
        </div>

        <div id="game" className={`GameRecord__C${recordTab === 'game' ? ' active' : ''}`}>
          <div className="GameRecord__C-head">
            <div className="van-row" style={{ background: 'transparent', borderBottom: '1px solid rgba(255,200,55,0.15)' }}>
              <div className="van-col--8">Period</div>
              <div className="van-col--5">Number</div>
              <div className="van-col--5">Size</div>
              <div className="van-col--6">Color</div>
            </div>
          </div>

          {gameRecords.length === 0 ? (
            <div className="empty__container">
              <img src={noDataImg} alt="No data" />
              <p>No data</p>
            </div>
          ) : (
            <div className="GameRecord__C-body">
              {gameRecords.map((item, i) => {
                const n = item.number
                const bs = n >= 5 ? 'big' : 'small'
                return (
                  <div className="van-row" key={i}>
                    <div className="van-col--8">{item.issueNumber}</div>
                    <div className="van-col--5">
                      <div className={`GameRecord__C-body-num ${getNumberColor(n)}`}>{n}</div>
                    </div>
                    <div className="van-col--5">{bs}</div>
                    <div className="van-col--6">
                      <div className="GameRecord__C-origin">
                        {getOriginDots(n)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="MyGameRecord__C-foot">
            <button 
              className={`back-btn${gamePage <= 1 ? ' disabled' : ''}`}
              disabled={gamePage <= 1}
              onClick={() => { if (gamePage > 1) setGamePage(p => p - 1) }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11.25 3.75L5.25 9L11.25 14.25" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="MyGameRecord__C-foot-page">{gamePage}/{totalPage}</div>
            <button 
              className={`back-btn${gamePage >= totalPage ? ' disabled' : ''}`}
              disabled={gamePage >= totalPage}
              onClick={() => { if (gamePage < totalPage) setGamePage(p => p + 1) }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ transform: 'rotate(180deg)' }}>
                <path d="M11.25 3.75L5.25 9L11.25 14.25" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div id="trend" className={`Trend__C${recordTab === 'trend' ? ' active' : ''}`}>
          <div className="Trend__C-head">
            <div className="van-row" style={{ background: 'transparent', borderBottom: '1px solid rgba(255,200,55,0.15)' }}>
              <div className="van-col--8">Issue</div>
              <div className="van-col--16">Number</div>
            </div>
          </div>

          {trendHistory.length === 0 && trendStats.length === 0 ? (
            <div className="empty__container">
              <img src={noDataImg} alt="No data" />
              <p>No data</p>
            </div>
          ) : (
            <>
              <div className="Trend__C-body1">
                <div className="Trend__C-body1-line">Betting Assistant (last 100 issues)</div>

                <div className="Trend__C-body1-line lottery">
                  <div>Winning numbers</div>
                  <div className="Trend__C-body1-line-num">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => <div key={n}>{n}</div>)}
                  </div>
                </div>
                <div className="Trend__C-body1-line">
                  <div>Missing</div>
                  <div className="Trend__C-body1-line-num">
                    {trendStats.map((s, i) => <div key={i}>{s.missingCount}</div>)}
                  </div>
                </div>
                <div className="Trend__C-body1-line">
                  <div>Avg Missing</div>
                  <div className="Trend__C-body1-line-num">
                    {trendStats.map((s, i) => <div key={i}>{s.avgMissing}</div>)}
                  </div>
                </div>
                <div className="Trend__C-body1-line">
                  <div>Frequency</div>
                  <div className="Trend__C-body1-line-num">
                    {trendStats.map((s, i) => <div key={i}>{s.openCount}</div>)}
                  </div>
                </div>
                <div className="Trend__C-body1-line">
                  <div>Max Continued</div>
                  <div className="Trend__C-body1-line-num">
                    {trendStats.map((s, i) => <div key={i}>{s.maxContinuous}</div>)}
                  </div>
                </div>
              </div>

              <div className="Trend__C-body2" ref={body2Ref}>
                <svg className="line-overlay" ref={svgRef}>
                  <path className="trend-path" ref={pathRef} d="" />
                </svg>

                {trendHistory.map((item, i) => {
                  const n = item.number
                  const bs = n >= 5 ? 'B' : 'S'
                  let numsHtml = ''
                  const numDivs = []
                  for (let j = 0; j < 10; j++) {
                    numDivs.push(
                      <div key={j} className={`Trend__C-body2-Num-item${j === n ? ` action${j}` : ''}`}>{j}</div>
                    )
                  }
                  return (
                    <div key={i}>
                      <div className="van-row">
                        <div className="van-col--8">{item.issueNumber}</div>
                        <div className="van-col--16">
                          <div className="Trend__C-body2-Num">
                            {numDivs}
                          </div>
                          <div className={`Trend__C-body2-Num-BS is${bs}`}>{bs}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          <div className="MyGameRecord__C-foot">
            <button 
              className={`back-btn${gamePage <= 1 ? ' disabled' : ''}`}
              disabled={gamePage <= 1}
              onClick={() => { if (gamePage > 1) setGamePage(p => p - 1) }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11.25 3.75L5.25 9L11.25 14.25" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="MyGameRecord__C-foot-page">{gamePage}/{totalPage}</div>
            <button 
              className={`back-btn${gamePage >= totalPage ? ' disabled' : ''}`}
              disabled={gamePage >= totalPage}
              onClick={() => { if (gamePage < totalPage) setGamePage(p => p + 1) }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ transform: 'rotate(180deg)' }}>
                <path d="M11.25 3.75L5.25 9L11.25 14.25" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div id="my" className={`GameRecord__C${recordTab === 'my' ? ' active' : ''}`}>
          <div className="MyGameRecord__C">
            <div className="MyGameRecord__C-head">
              <div className="MyGameRecord__C-head-moreB">more</div>
            </div>
            <div className="MyGameRecord__C-body">
              <div className="MyGameRecordList__C">
                {myBets.length === 0 ? (
                  <div className="empty__container">
                    <img src={noDataImg} alt="No data" />
                    <p>No data</p>
                  </div>
                ) : (
                  myBets.map((b) => {
                    const s = String(b.status || '').toLowerCase()
                    const isWon = s === 'won'
                    const isPending = s === 'pending'
                    const isLost = s === 'lost'
                    const profit = typeof b?.result?.profitAmount === 'number' ? b.result.profitAmount : 0
                    const amountText = isWon ? `+₹${profit.toFixed(2)}` : isPending ? `₹${Number(b.realAmount || b.betamount || 0).toFixed(2)}` : `-₹${Number(b.betamount || 0).toFixed(2)}`
                    const selectType = String(b.selectType || '').toLowerCase()
                    
                    let leftClass = 'MyGameRecordList__C-item-l'
                    
                    if (selectType === 'green') leftClass += ' MyGameRecordList__C-item-l-green'
                    else if (selectType === 'violet') leftClass += ' MyGameRecordList__C-item-l-violet'
                    else if (selectType === 'red') leftClass += ' MyGameRecordList__C-item-l-red'
                    else if (selectType === 'big') leftClass += ' MyGameRecordList__C-item-l-big'
                    else if (selectType === 'small') leftClass += ' MyGameRecordList__C-item-l-small'
                    else if (['0','1','2','3','4','5','6','7','8','9'].includes(selectType)) leftClass += ` MyGameRecordList__C-item-l-${selectType}`

                    let displayStatus = b.status
                    if (isWon) displayStatus = 'success'
                    if (isLost) displayStatus = 'failed'

                    const isExpanded = selectedBet?.orderNumber === b.orderNumber
                    return (
                      <div className={`MyGameRecordList__C-item${isExpanded ? ' expanded' : ''}`} key={b.orderNumber} onClick={() => setSelectedBet(isExpanded ? null : b)}>
                        <div className="MyGameRecordList__C-item-main">
                          <div className={leftClass}>{selectType}</div>
                          <div className="MyGameRecordList__C-item-m">
                            <div className="MyGameRecordList__C-item-m-top">{b.issueNumber}</div>
                            <div className="MyGameRecordList__C-item-m-bottom">{b.timestamp}</div>
                          </div>
                          {!isPending && (
                            <div className={`MyGameRecordList__C-item-r ${isWon ? 'success' : ''}`}>
                              <div className={isWon ? 'success' : ''}>{displayStatus}</div>
                              <span>{amountText}</span>
                            </div>
                          )}
                        </div>
                        {isExpanded && (
                          <div className="MyGameRecordList__C-detail">
                            <div className="MyGameRecordList__C-detail-text">details</div>
                            <div className="MyGameRecordList__C-detail-line">
                              <span>order number</span>
                              <div>{b.orderNumber}<svg className="copy-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(b.orderNumber).then(() => toast({ title: 'Copy success' })).catch(() => {}) }} style={{ cursor: 'pointer' }}><path d="M16 1H9a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5zM9 5H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9l-5-5H9V5z"/></svg></div>
                            </div>
                            <div className="MyGameRecordList__C-detail-line">
                              <span>betting series</span>
                              <div>{b.issueNumber}</div>
                            </div>
                            <div className="MyGameRecordList__C-detail-line">
                              <span>purchase price</span>
                              <div>₹{Number(b.betamount || 0).toFixed(2)}</div>
                            </div>
                            <div className="MyGameRecordList__C-detail-line">
                              <span>Buy quantity</span>
                              <div>{Number(b.betamount || 0).toFixed(0)}</div>
                            </div>
                            <div className="MyGameRecordList__C-detail-line">
                              <span>Amount after tax</span>
                              <div className={!isWon && !isPending ? 'red' : ''}>₹{Number(b.realAmount || b.betamount || 0).toFixed(2)}</div>
                            </div>
                            <div className="MyGameRecordList__C-detail-line">
                              <span>tax</span>
                              <div>₹{Number(b.fee || 0).toFixed(2)}</div>
                            </div>
                            {b?.result && (() => {
                              const n = parseInt(b.result.number)
                              const isSmall = n >= 0 && n <= 4
                              const isBig = n >= 5 && n <= 9
                              return (
                                <div className="MyGameRecordList__C-detail-line">
                                  <span>results</span>
                                  <div>
                                    {b.result.number != null && <span className="MyGameRecordList__C-inlineB">{b.result.number}</span>}
                                    {(() => {
                                      const showViolet = n === 0 || n === 5
                                      const displayColour = showViolet ? 'violet' : b.result.colour
                                      return displayColour && <span className={`MyGameRecordList__C-inlineB purpleColor`}>{displayColour}</span>
                                    })()}
                                    {isSmall && <span className="MyGameRecordList__C-inlineB small">small</span>}
                                    {isBig && <span className="MyGameRecordList__C-inlineB big">big</span>}
                                  </div>
                                </div>
                              )
                            })()}
                            <div className="MyGameRecordList__C-detail-line">
                              <span>choose</span>
                              <div>{b.selectType}</div>
                            </div>
                            <div className="MyGameRecordList__C-detail-line">
                              <span>status</span>
                              <div className={isLost ? 'red' : isWon ? 'green' : ''}>{isWon ? 'success' : isLost ? 'failed' : b.status}</div>
                            </div>
                            <div className="MyGameRecordList__C-detail-line">
                              <span>win lose</span>
                              <div className={isWon ? 'green' : isLost ? 'red' : ''}>
                                {isWon
                                  ? `+ ₹${Number(b.result?.profitAmount || 0).toFixed(2)}`
                                  : isLost
                                    ? `- ₹${Number(b.realAmount || b.betamount || 0).toFixed(2)}`
                                    : '-'}
                              </div>
                            </div>
                            <div className="MyGameRecordList__C-detail-line">
                              <span>time of creation</span>
                              <div>{b.timestamp}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>
            <div className="MyGameRecord__C-foot">
              <button 
                className={`back-btn${myBetsPage <= 1 ? ' disabled' : ''}`}
                disabled={myBetsPage <= 1}
                onClick={() => { if (myBetsPage > 1) setMyBetsPage(p => p - 1) }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M11.25 3.75L5.25 9L11.25 14.25" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="MyGameRecord__C-foot-page">{myBetsPage}/{myBetsTotal || 1}</div>
              <button 
                className={`back-btn${myBetsPage >= myBetsTotal ? ' disabled' : ''}`}
                disabled={myBetsPage >= myBetsTotal}
                onClick={() => { if (myBetsPage < myBetsTotal) setMyBetsPage(p => p + 1) }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ transform: 'rotate(180deg)' }}>
                  <path d="M11.25 3.75L5.25 9L11.25 14.25" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`how-to-overlay${showHowTo ? ' active' : ''}`} id="howToOverlay" onClick={() => setShowHowTo(false)}>
        <div className="how-to-popup" onClick={e => e.stopPropagation()}>
          <div className="how-to-head">How to play</div>
          <div className="how-to-body">
            <div>
              <p><b>30 seconds per issue, 25 seconds to place an order, 5 seconds to draw a prize, open all day, total transaction volume 2880 issues.</b></p>
              <p>If you spend 100 to trade, after deducting service fee 2%, contract amount: 98.</p>
              <p>1. <b>Select green:</b> If the result shows 1, 3, 7, 9 you will get (98 * 2) = 196; If the result shows 5, you will get (98 * 1.5) = 147.</p>
              <p>2. <b>Select red:</b> If the result shows 2, 4, 6, 8 you will get (98 * 2) = 196; If the result shows 0, you will get (98 * 1.5) = 147.</p>
              <p>3. <b>Select violet:</b> If the result shows 0 or 5, you will get (98 * 4.5) = 441.</p>
              <p>4. <b>Select number:</b> If the result is the same as the number you selected, you will get (98 * 9) = 882.</p>
              <p>5. <b>Select big:</b> If the result shows 5, 6, 7, 8, 9 you will get (98 * 2) = 196.</p>
              <p>6. <b>Select small:</b> If the result shows 0, 1, 2, 3, 4 you will get (98 * 2) = 196.</p>
            </div>
          </div>
          <div className="how-to-foot">
            <div className="how-to-foot-btn" onClick={() => setShowHowTo(false)}>closure</div>
          </div>
        </div>
      </div>

      <div className={`presale-overlay${showPresale ? ' active' : ''}`} id="presaleOverlay" onClick={() => setShowPresale(false)}>
        <div className="presale-popup" onClick={e => e.stopPropagation()}>
          <div className="presale-head">Pre-sale rules</div>
          <div className="presale-body">
            In order to protect the legitimate rights and interests of users participating in the pre-sale and maintain the
            normal operation order of the pre-sale, these rules are formulated in accordance with relevant agreements and
            national laws and regulations. Chapter 1 Definition 1.1 Pre-sale definition: refers to the merchants providing
            products or services Plan, collect consumer orders through pre-sale product tools, and provide consumers with
            goods and/or services according to prior agreement. Sales model 1.2
            The pre-sale model is the "deposit" model. "Deposit" refers to pre-delivery at a fixed number of pre-sale items.
            "Deposit" Scam Participate in mini games for a chance to win more deposits. Deposits can be exchanged directly
            for merchandise. The deposit is not redeemable. 1.3
            Pre-sale products: Refers to the products transferred by merchants using the pre-sale product tools. Only mark
            the word pre-sale on the product name or product details page, and products that do not use the pre-sale product
            tool are not pre-sale products.
            1.4 Pre-sale system: refers to the system product tool that supports merchants to sell pre-sale models. 1.5
            Pre-sale product price: refers to the sales price of pre-sale products. The price of pre-sale items consists of
            two parts: deposit and final payment.
          </div>
          <div className="presale-foot">
            <div className="presale-foot-btn" onClick={() => setShowPresale(false)}>I Know</div>
          </div>
        </div>
      </div>

      <div className={`bet-overlay${showBetOverlay ? ' active' : ''}`} id="betOverlay" onClick={() => setShowBetOverlay(false)}>
        <div className="bet-popup" onClick={e => e.stopPropagation()}>
          <div className={`popup-head ${currentGrad}`} id="popupHead">
            <div className="popup-head-title">Win Go {activeGame}</div>
            <div className="popup-head-bar">
              <span>choose</span><span id="popupLabel">{typeof betType === 'string' ? betType : betType}</span>
            </div>
          </div>

          <div className="popup-body">
            <div className="body-line">
              <span className="body-label">Balance</span>
              <div className="chip-list" id="balanceChips">
                {BALANCE_CHIPS.map((chip, idx) => (
                  <button
                    key={chip}
                    className="chip"
                    style={{
                      background: idx === selectedBalanceIdx ? currentAc : '',
                      color: idx === selectedBalanceIdx ? '#fff' : '',
                    }}
                    onClick={() => selectBalanceChip(idx)}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            <div className="body-line">
              <span className="body-label">Quantity</span>
              <div className="qty-ctrl">
                <button className="qty-btn" id="qtyMinus" style={{ background: currentAc }} onClick={() => changeQty(-1)}>−</button>
                <input className="qty-input" type="number" id="qtyInput" value={qtyInput} min="1" onChange={e => setQtyInput(e.target.value)} onBlur={e => { const num = parseInt(e.target.value, 10); if (isNaN(num) || num < 1) { setQtyInput('1'); setQty(1) } else { const clamped = Math.max(1, num); setQtyInput(String(clamped)); setQty(clamped) } }} />
                <button className="qty-btn" id="qtyPlus" style={{ background: currentAc }} onClick={() => changeQty(1)}>+</button>
              </div>
            </div>

            <div className="body-line">
              <span className="body-label" style={{ visibility: 'hidden' }}>X</span>
              <div className="chip-list" id="mulChips">
                {MULTIPLIER_CHIPS.map((chip, idx) => (
                  <button
                    key={chip}
                    className="chip"
                    style={{
                      background: idx === selectedMulIdx ? currentAc : '',
                      color: idx === selectedMulIdx ? '#fff' : '',
                    }}
                    onClick={() => selectMulChip(idx)}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            <div className="body-line agree-row">
              <div className={`agree-check${agreed ? ' checked' : ''}`} id="agreeCheck" onClick={toggleAgree} />
              <span className="agree-text">I agree</span>
              <span className="agree-link" id="agreeLink" style={{ color: currentAc }} onClick={() => setShowPresale(true)}>Pre-sale rules</span>
            </div>
          </div>

          <div className="popup-foot">
            <button className="foot-cancel" onClick={() => setShowBetOverlay(false)}>cancel</button>
            <button className="foot-submit" id="footSubmit" style={{ background: currentFootBg }} onClick={submitBet}>
              Total amount ₹{total.toFixed(2)}
            </button>
          </div>
        </div>
      </div>

      <div className={`winning${showWinPopup ? '' : ''}`} id="winPopup" style={{ display: showWinPopup ? 'flex' : 'none' }}>
        <div className="winning-body isWin">
          <div className="sprinkle-overlay"></div>
          <div className="winning-main">
            <div className="winning-wrap">
              <div className="winning-wrap-l1">Congratulations</div>
              <div className="winning-wrap-l2">
                <div className="winner_box">
                  <span>Lottery results</span>
                  <div className="winner_result" id="winnerResult">
                    <div className={`${WIN_RESULT_MAP[winData.result]?.cssClass || 'color_red'}`} id="resultColor">{WIN_RESULT_MAP[winData.result]?.label || ''}</div>
                    <div className={`${WIN_RESULT_MAP[winData.result]?.cssClass || 'color_red'}`} id="resultNumber">{winData.result}</div>
                    <div className={`${WIN_RESULT_MAP[winData.result]?.cssClass || 'color_red'}`} id="resultType">{WIN_RESULT_MAP[winData.result]?.type || ''}</div>
                  </div>
                </div>
              </div>
              <div className="winning-wrap-l3">
                <div className="head">Bonus</div>
                <div className="bonus">₹{winData.winamt.reduce((a, b) => a + b, 0).toFixed(2)}</div>
                <div className="gameDetail">
                  Period: WinGo 30sec
                  <p>{winData.issue}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="winning-wrap-l4">
            <div className={`acitveBtn${winAutoClose ? ' active' : ''}`} id="checkMark" onClick={toggleWinAutoClose}></div>
            <span id="countdownText">{winCountdown} seconds auto close</span>
          </div>
          <div className="closeBtn" id="popupClose" onClick={closeWinPopup}></div>
        </div>
      </div>
    </div>
  )
}
