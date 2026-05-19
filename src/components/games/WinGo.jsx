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
import { refreshBalance, useProfile } from '@/hooks/useProfile'
import { toast } from '@/hooks/use-toast'
import { wingoService } from '@/services/wingoService'

const GAMES = ['30s', '1Min', '3Min', '5Min']

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
  const [agreed, setAgreed] = useState(true)
  const [showHowTo, setShowHowTo] = useState(false)
  const [showPresale, setShowPresale] = useState(false)
  const [gameRecords, setGameRecords] = useState([])
  const [trendStats, setTrendStats] = useState([])
  const [trendHistory, setTrendHistory] = useState([])
  const [myBets, setMyBets] = useState([])
  const [betSubmitting, setBetSubmitting] = useState(false)
  const [cdActive, setCdActive] = useState(false)
  const [cdD1, setCdD1] = useState('0')
  const [cdD2, setCdD2] = useState('5')
  const [gamePage, setGamePage] = useState(1)

  const svgRef = useRef(null)
  const pathRef = useRef(null)
  const body2Ref = useRef(null)
  const endTimeRef = useRef(0)
  const issueRef = useRef('')
  const nextRef = useRef(null)
  const syncingRef = useRef(false)
  const lastSyncEndRef = useRef(0)
  const historyDelayRef = useRef(null)

  const total = (selectedBalanceIdx >= 0 ? BALANCE_CHIPS[selectedBalanceIdx] : 1) * qty

  async function syncCurrent() {
    const res = await wingoService.getCurrent()
    issueRef.current = res.current.issueNumber
    endTimeRef.current = res.current.endTime
    nextRef.current = res.next || null
    setIssueNumber(res.current.issueNumber)
    setTimeRemaining(Math.max(0, Math.floor((res.current.endTime - Date.now()) / 1000)))
  }

  async function loadHistory() {
    const res = await wingoService.getHistory(1)
    const list = res?.data?.list || []
    setGameRecords(list)
    setTrendHistory(list.slice(0, 100))
  }

  async function loadTrends() {
    const res = await wingoService.getTrends()
    setTrendStats(res?.data || [])
  }

  async function loadMyBets() {
    if (!localStorage.getItem('auth_token')) {
      setMyBets([])
      return
    }
    const res = await wingoService.getMyBets({ page: 1, limit: 25 })
    setMyBets(res?.items || [])
  }

  async function submitBet() {
    if (betSubmitting) return
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

    const selectType = typeof betType === 'number' ? String(betType) : String(betType)

    setBetSubmitting(true)
    try {
      await wingoService.placeBet({
        issueNumber: issueRef.current,
        betamount: total,
        selectType,
      })
      setShowBetOverlay(false)
      toast({ title: 'Bet placed', description: `₹${total.toFixed(2)} on ${selectType}` })
      const tasks = [refreshBalance()]
      if (recordTab === 'my') tasks.push(loadMyBets())
      await Promise.allSettled(tasks)
    } catch (err) {
      toast({ title: 'Bet failed', description: err?.message || 'Failed to place bet' })
    }
    setBetSubmitting(false)
  }

  useEffect(() => {
    Promise.allSettled([syncCurrent(), loadHistory()]).catch(() => {})
  }, [])

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
          Promise.allSettled([syncCurrent()])
            .finally(() => { syncingRef.current = false })

          if (historyDelayRef.current) clearTimeout(historyDelayRef.current)
          historyDelayRef.current = setTimeout(() => {
            loadHistory().catch(() => {})
          }, 2000)
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
      loadMyBets().catch(() => {})
    }
    if (recordTab === 'game') {
      loadHistory().catch(() => {})
    }
    if (recordTab === 'trend' && trendStats.length === 0) {
      loadTrends().catch(() => {})
    }
  }, [recordTab])

  useEffect(() => {
    if (timeRemaining <= 5 && timeRemaining >= 1) {
      setCdActive(true)
      setCdD1('0')
      setCdD2(String(timeRemaining))
    } else if (timeRemaining === 0) {
      setCdD1('0')
      setCdD2('0')
      setCdActive(true)
      const t = setTimeout(() => {
        setCdActive(false)
      }, 500)
      return () => clearTimeout(t)
    } else {
      setCdActive(false)
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
    setQty(1)
    setSelectedMulIdx(0)
    setShowBetOverlay(true)
  }

  function selectBalanceChip(idx) {
    setSelectedBalanceIdx(idx)
  }

  function selectMulChip(idx) {
    setSelectedMulIdx(idx)
    const val = parseInt(MULTIPLIER_CHIPS[idx].replace('X', ''))
    setQty(val)
  }

  function changeQty(d) {
    setQty(prev => Math.max(1, prev + d))
  }

  function toggleAgree() {
    setAgreed(prev => !prev)
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
            <text x="40" y="50" fontSize="46" fontWeight="900" fill="url(#blCrown_581)" filter="url(#blCrownS_581)" fontFamily="serif">♕</text>
            <text x="86" y="48" fontSize="38" fontWeight="900" letterSpacing="4" fill="url(#blText_581)" filter="url(#blShadow_581)" fontFamily="Georgia, serif">1xKING</text>
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
              <div>₹{Number(balance || 0).toFixed(2)}</div>
              <button type="button" className="refresh" aria-label="Refresh balance" onClick={refreshBalance}>
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
            <div className={`MyGameRecord__C-foot-previous${gamePage <= 1 ? ' disabled' : ''}`}>
              <svg className="icon-arrow" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </div>
            <div className="MyGameRecord__C-foot-page">1/1</div>
            <div className="MyGameRecord__C-foot-next disabled">
              <svg className="icon-arrow" viewBox="0 0 24 24">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </div>
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
            <div className="MyGameRecord__C-foot-previous disabled">
              <svg className="icon-arrow" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </div>
            <div className="MyGameRecord__C-foot-page">1/1</div>
            <div className="MyGameRecord__C-foot-next disabled">
              <svg className="icon-arrow" viewBox="0 0 24 24">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </div>
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
                    const profit = typeof b?.result?.profitAmount === 'number' ? b.result.profitAmount : 0
                    const amountText = isWon ? `+₹${profit.toFixed(2)}` : isPending ? `₹${Number(b.realAmount || b.betamount || 0).toFixed(2)}` : `-₹${Number(b.realAmount || b.betamount || 0).toFixed(2)}`
                    const selectType = String(b.selectType || '').toLowerCase()
                    
                    let leftClass = 'MyGameRecordList__C-item-l'
                    
                    if (selectType === 'green') leftClass += ' MyGameRecordList__C-item-l-green'
                    else if (selectType === 'violet') leftClass += ' MyGameRecordList__C-item-l-violet'
                    else if (selectType === 'red') leftClass += ' MyGameRecordList__C-item-l-red'
                    else if (selectType === 'big') leftClass += ' MyGameRecordList__C-item-l-big'
                    else if (selectType === 'small') leftClass += ' MyGameRecordList__C-item-l-small'
                    else if (['0','1','2','3','4','5','6','7','8','9'].includes(selectType)) leftClass += ` MyGameRecordList__C-item-l-${selectType}`

                    return (
                      <div className="MyGameRecordList__C-item" key={b.orderNumber}>
                        <div className={leftClass}>{selectType}</div>
                        <div className="MyGameRecordList__C-item-m">
                          <div className="MyGameRecordList__C-item-m-top">{b.issueNumber}</div>
                          <div className="MyGameRecordList__C-item-m-bottom">{b.timestamp}</div>
                        </div>
                        <div className={`MyGameRecordList__C-item-r ${isWon ? 'success' : ''}`}>
                          <div className={isWon ? 'success' : ''}>{b.status}</div>
                          <span>{amountText}</span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
            <div className="MyGameRecord__C-foot">
              <div className="MyGameRecord__C-foot-previous disabled">
                <svg className="icon-arrow" viewBox="0 0 24 24">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </div>
              <div className="MyGameRecord__C-foot-page">1/1</div>
              <div className="MyGameRecord__C-foot-next disabled">
                <svg className="icon-arrow" viewBox="0 0 24 24">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              </div>
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
                <input className="qty-input" type="number" id="qtyInput" value={qty} min="1" onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} />
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
            <button className="foot-submit" id="footSubmit" style={{ background: currentFootBg }} onClick={submitBet} disabled={betSubmitting}>
              Total amount ₹{total.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
