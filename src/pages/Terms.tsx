import { useTransitionNavigate } from "@/providers/NavigationProvider";

const Terms = () => {
  const { goBack } = useTransitionNavigate();

  return (
    <div className="x-page">
      <style>{`
  .x-page {
    --main-color: #f2413b;
    min-height: calc(100vh - 120px);
    color: #fff;
    width: 100%;
  }
  .x-page .navbar {
    display: block;
    position: static;
    width: 100%;
    height: 46px;
    box-sizing: border-box;
    z-index: 100;
    background: none;
  }
  .x-page .navbar-fixed {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: var(--app-max-width);
    height: 46px;
    background: linear-gradient(180deg, #35030c 0%, #5b0116 100%);
    color: #fff;
    z-index: 101;
    box-sizing: border-box;
    user-select: none;
    -webkit-user-select: none;
  }
  .x-page .navbar__content {
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }
  .x-page .navbar__content-left {
    position: absolute;
    left: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    cursor: pointer;
  }
  .x-page .navbar__content-center {
    display: flex;
    align-items: center;
    height: 100%;
  }
  .x-page .navbar__content-title {
    font-size: 18px;
    font-weight: 400;
    line-height: 1.2;
    color: #fff;
    text-align: center;
  }
  .x-page .navbar__content-right {
    position: absolute;
    right: 12px;
  }
  .x-page .back-arrow {
    width: 20px;
    height: 20px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .x-page .x-page-list {
    padding: 12px 8px 24px;
    flex: 1;
    overflow-y: auto;
  }
  .rules-card {
    position: relative;
    display: block;
    width: 100%;
    max-width: 461px;
    margin: 0 auto 34px;
    padding: 35px 12px 17px;
    background: linear-gradient(rgba(53,3,12,0.6), rgba(53,3,12,0.6)) no-repeat top / 200% 100%, url("https://www.82bet22.com/assets/png/promotionbg-1203267e.webp") no-repeat top / 200% 100%, linear-gradient(180deg, #35030c 0%, #5b0116 100%);
    border-radius: 10px;
    box-sizing: border-box;
    text-align: start;
    border: 1px solid rgba(255,180,50,0.25);
  }
  .rules-card-title {
    position: absolute;
    top: 7px;
    left: 50%;
    transform: translateX(-50%);
    width: 109px;
    height: 27px;
    font-size: 16px;
    font-weight: 400;
    color: rgba(255,255,255,0.85);
    text-align: center;
    line-height: 27px;
    z-index: 1;
  }
  .rules-card-txt {
    display: block;
    padding: 24px 0 0;
    font-size: 16px;
    font-weight: 400;
    color: rgba(255,255,255,0.6);
    line-height: 26px;
    text-align: start;
  }
  .rules-card-txt p {
    margin: 10px 0;
  }
  .rules-svg-head {
    position: absolute;
    top: -1px;
    left: 50%;
    transform: translateX(-50%);
    width: 337px;
    height: 41px;
    pointer-events: none;
  }
`}</style>
      <div className="navbar"><div className="navbar-fixed"><div className="navbar__content"><div className="navbar__content-left" onClick={() => goBack()}><svg className="back-arrow" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg></div><div className="navbar__content-center"><div className="navbar__content-title">Terms of Service</div></div><div className="navbar__content-right"></div></div></div></div>
      <div className="x-page-list">
        <div className="rules-card">
          <svg className="rules-svg-head" viewBox="0 0 489 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-2 -0.0310078V-4H492V-0.0310078C485 -0.0310078 470.65 -0.0310078 463 4.43411C454.5 9.39535 450 12.8682 439 35.1938C429.492 54.4913 413.5 59.6693 408 60H83C66 60 53.5 42.1395 50.5 36.186C47.5 30.2326 44.0048 21.3075 33.5 9.89147C23 -1.51938 8 -0.0310078 -2 -0.0310078Z" fill="rgba(255,255,255,0.08)"/>
          </svg>
          <div className="rules-card-title">01</div>
          <div className="rules-card-txt">
            <p>These Terms of Service govern access to and use of our online gaming and betting platform, including but not limited to games, top-up features, bonus activities, promotions, and all related services. By accessing and using our platform, you agree to be bound by these Terms.</p>
          </div>
        </div>

        <div className="rules-card">
          <svg className="rules-svg-head" viewBox="0 0 489 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-2 -0.0310078V-4H492V-0.0310078C485 -0.0310078 470.65 -0.0310078 463 4.43411C454.5 9.39535 450 12.8682 439 35.1938C429.492 54.4913 413.5 59.6693 408 60H83C66 60 53.5 42.1395 50.5 36.186C47.5 30.2326 44.0048 21.3075 33.5 9.89147C23 -1.51938 8 -0.0310078 -2 -0.0310078Z" fill="rgba(255,255,255,0.08)"/>
          </svg>
          <div className="rules-card-title">02</div>
          <div className="rules-card-txt">
            <p>Access is restricted to users who are at least 18 years old or of legal age in their jurisdiction. We reserve the right to verify user age and deny access for failure to meet this requirement.</p>
          </div>
        </div>

        <div className="rules-card">
          <svg className="rules-svg-head" viewBox="0 0 489 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-2 -0.0310078V-4H492V-0.0310078C485 -0.0310078 470.65 -0.0310078 463 4.43411C454.5 9.39535 450 12.8682 439 35.1938C429.492 54.4913 413.5 59.6693 408 60H83C66 60 53.5 42.1395 50.5 36.186C47.5 30.2326 44.0048 21.3075 33.5 9.89147C23 -1.51938 8 -0.0310078 -2 -0.0310078Z" fill="rgba(255,255,255,0.08)"/>
          </svg>
          <div className="rules-card-title">03</div>
          <div className="rules-card-txt">
            <p>You must register using accurate, complete, and up-to-date information.</p>
            <p>You are solely responsible for safeguarding your account credentials.</p>
            <p>All actions carried out from your account are your responsibility.</p>
            <p>We reserve the right to suspend or terminate accounts found to be in violation of these Terms or engaging in suspicious or fraudulent activity.</p>
          </div>
        </div>

        <div className="rules-card">
          <svg className="rules-svg-head" viewBox="0 0 489 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-2 -0.0310078V-4H492V-0.0310078C485 -0.0310078 470.65 -0.0310078 463 4.43411C454.5 9.39535 450 12.8682 439 35.1938C429.492 54.4913 413.5 59.6693 408 60H83C66 60 53.5 42.1395 50.5 36.186C47.5 30.2326 44.0048 21.3075 33.5 9.89147C23 -1.51938 8 -0.0310078 -2 -0.0310078Z" fill="rgba(255,255,255,0.08)"/>
          </svg>
          <div className="rules-card-title">04</div>
          <div className="rules-card-txt">
            <p>Credits and virtual assets purchased or earned on the platform have no real-world monetary value.</p>
            <p>Top-ups are considered final and non-refundable unless required by law.</p>
            <p>We are not liable for losses caused by third-party payment providers.</p>
          </div>
        </div>

        <div className="rules-card">
          <svg className="rules-svg-head" viewBox="0 0 489 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-2 -0.0310078V-4H492V-0.0310078C485 -0.0310078 470.65 -0.0310078 463 4.43411C454.5 9.39535 450 12.8682 439 35.1938C429.492 54.4913 413.5 59.6693 408 60H83C66 60 53.5 42.1395 50.5 36.186C47.5 30.2326 44.0048 21.3075 33.5 9.89147C23 -1.51938 8 -0.0310078 -2 -0.0310078Z" fill="rgba(255,255,255,0.08)"/>
          </svg>
          <div className="rules-card-title">05</div>
          <div className="rules-card-txt">
            <p>Using cheats, bots, scripts, or automation tools.</p>
            <p>Committing fraud, money laundering, or criminal activity.</p>
            <p>Impersonating others.</p>
            <p>Harassing or abusing other users.</p>
            <p>Exploiting bugs or manipulating game outcomes.</p>
          </div>
        </div>

        <div className="rules-card">
          <svg className="rules-svg-head" viewBox="0 0 489 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-2 -0.0310078V-4H492V-0.0310078C485 -0.0310078 470.65 -0.0310078 463 4.43411C454.5 9.39535 450 12.8682 439 35.1938C429.492 54.4913 413.5 59.6693 408 60H83C66 60 53.5 42.1395 50.5 36.186C47.5 30.2326 44.0048 21.3075 33.5 9.89147C23 -1.51938 8 -0.0310078 -2 -0.0310078Z" fill="rgba(255,255,255,0.08)"/>
          </svg>
          <div className="rules-card-title">06</div>
          <div className="rules-card-txt">
            <p>Our platform is intended for entertainment purposes only. Monetary gain is not guaranteed, and real-money wagering carries inherent financial risk. You participate at your own discretion and risk.</p>
          </div>
        </div>

        <div className="rules-card">
          <svg className="rules-svg-head" viewBox="0 0 489 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-2 -0.0310078V-4H492V-0.0310078C485 -0.0310078 470.65 -0.0310078 463 4.43411C454.5 9.39535 450 12.8682 439 35.1938C429.492 54.4913 413.5 59.6693 408 60H83C66 60 53.5 42.1395 50.5 36.186C47.5 30.2326 44.0048 21.3075 33.5 9.89147C23 -1.51938 8 -0.0310078 -2 -0.0310078Z" fill="rgba(255,255,255,0.08)"/>
          </svg>
          <div className="rules-card-title">07</div>
          <div className="rules-card-txt">
            <p>We may modify these Terms at any time. Continued use of the platform following updates signifies acceptance of the revised Terms.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
