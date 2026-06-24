import { useState, useRef } from 'react';
import { inviteConfig, surveyConfig } from './config/site';
import { assetUrl } from './lib/assets';
import { sendResponseToGoogleSheets } from './lib/rsvpStorage';

const ICONS = {
  ceremony: 'https://static.tildacdn.com/tild3334-3737-4437-b039-313461616161/rings.svg',
  eat: 'https://static.tildacdn.com/tild3966-3730-4735-b764-356235336362/eat.svg',
  firework: 'https://static.tildacdn.com/tild3836-6562-4636-a466-653635623939/firework.svg',
  group: 'https://static.tildacdn.com/tild6362-6533-4532-b464-623638306237/Group.svg',
  whatsapp: 'https://static.tildacdn.com/tild6638-6663-4437-a361-356661623533/Group.svg',
};

const PROGRAM = [
  { time: '13:45', label: 'Сбор гостей', desc: 'Подарите нам свою улыбку и возьмите с собой хорошее настроение', icon: ICONS.group },
  { time: '14:00', label: 'Церемония', desc: 'Может быть трогательно, разрешается всплакнуть', icon: ICONS.ceremony },
  { time: '14:30', label: 'Фуршет', desc: 'Самое время для поздравлений, фотографий, вкусной еды и бокала игристого', icon: ICONS.eat },
  { time: '18:00', label: 'Время разделить важный момент с самыми близкими друзьями', desc: 'Надеемся, этот вечер вам понравится', icon: ICONS.firework },
];

const COUPLE = { groom: inviteConfig.couple.groom, bride: inviteConfig.couple.bride };
const PHONE = '+7 (917) 621-31-53';
const WHATSAPP = '79176213153';
const MUSIC_FILE = 'background.mp3';

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function App() {
  const audioRef = useRef(null);
  const [rsvpForm, setRsvpForm] = useState({ name: '', attendance: '', drinks: [] });
  const [rsvpSent, setRsvpSent] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);

  return (
    <>
      <header className="hero" id="top">
        <div className="hero__bg" style={{ backgroundImage: `url(${assetUrl(inviteConfig.images.hero)})` }} />
        <div className="hero__overlay" />
        <div className="hero__names">
          <span className="hero__name">{COUPLE.groom}</span>
          <span className="hero__name hero__name--and">и</span>
          <span className="hero__name">{COUPLE.bride}</span>
        </div>
        <button className="hero__scroll" onClick={() => {
          scrollTo('invite');
          if (audioRef.current && !musicStarted) {
            audioRef.current.volume = 0.3;
            audioRef.current.play().then(() => {
              setMusicPlaying(true);
              setMusicStarted(true);
            }).catch(() => {});
          }
        }}>
          ЛИСТАЙТЕ ВНИЗ
        </button>
      </header>

      <section className="invite-text" id="invite">
        <p>Дорогие родные и близкие!<br />Приглашаем вас на нашу камерную свадьбу!</p>
      </section>

      <hr className="divider" />

      <section className="section program" id="program">
        <div className="section__title">Программа</div>
        <div className="program__date">Суббота, {inviteConfig.date.full}</div>
        <div className="program__grid">
          {PROGRAM.map((item, idx) => (
            <div className="program__item" key={item.label}>
              <div className="program__item-inner">
                <div className="program__center">
                  <div className="program__icon">
                    <img src={item.icon} alt="" />
                  </div>
                  {idx < PROGRAM.length - 1 && <div className="program__line" />}
                </div>
                <div className="program__info">
                  <div className="program__time">{item.time}</div>
                  <div className="program__label">{item.label}</div>
                  <div className="program__desc">{item.desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      <section className="section location" id="location">
        <div className="section__title">Локация</div>
        <div className="location__grid">
          <div className="location__card">
            <p className="location__text">
              Церемония пройдет в усадьбе &laquo;{inviteConfig.location.name}&raquo;
            </p>
            <p className="location__address">{inviteConfig.location.address}</p>
            <a className="btn" href={inviteConfig.location.mapUrl} target="_blank" rel="noreferrer">
              ПЕРЕЙТИ НА КАРТУ
            </a>
          </div>
          <div className="location__card">
            <p className="location__text">
              Банкет в формате камерной свадьбы пройдёт               4seasons_ul
            </p>
            <p className="location__address">Чистые пруды 3, Лазурный переулок, д.15</p>
            <a className="btn" href="https://yandex.ru/maps/org/4_seasons/150089715564/?ll=48.344373%2C54.528624&z=17" target="_blank" rel="noreferrer">
              ПЕРЕЙТИ НА КАРТУ
            </a>
          </div>
        </div>
      </section>

      <section className="photo-section">
        <div className="photo-section__image">
          <img src={assetUrl('photo-22.jpg')} alt="" />
        </div>
      </section>

      <section className="section dress-code" id="dress-code">
        <div className="section__title">Дресс-код</div>
        <p className="dress-code__desc">
          Мы трепетно относимся к подготовке, просим чтобы ваш образ был подобран в соответствии с палитрой свадьбы
        </p>
        <div className="dress-code__gender">Девушки</div>
        <div className="dress-code__palette">
          {['#5B3A29', '#D5E0D0', '#C7B8A3', '#C49A6C', '#D1D7B0', '#2B4B2F'].map((color) => (
            <div className="dress-code__swatch" key={color} style={{ backgroundColor: color }} />
          ))}
        </div>
        <p className="dress-code__text">{inviteConfig.dressCode.women}</p>
        <div className="dress-code__gender">Мужчины</div>
        <div className="dress-code__palette">
          <div className="dress-code__swatch" style={{ backgroundColor: '#ffffff' }} />
          <div className="dress-code__swatch" style={{ backgroundColor: '#000000' }} />
        </div>
        <p className="dress-code__text">{inviteConfig.dressCode.men}</p>
      </section>

      <hr className="divider" />

      <section className="section survey" id="survey">
        <div className="section__title">Анкета гостя</div>
        <p className="survey__desc">
          Подтвердите свое присутствие и ответьте на несколько вопросов.<br />
          Это поможет в организации торжества!
        </p>
        {rsvpSent ? (
          <p style={{ fontWeight: 600 }}>Спасибо! Ваш ответ отправлен.</p>
        ) : (
          <form className="form" onSubmit={async (e) => {
            e.preventDefault();
            setRsvpLoading(true);
            if (surveyConfig.googleScriptUrl) {
              try {
                const [lastName = '', ...firstNameParts] = rsvpForm.name.split(' ');
                await sendResponseToGoogleSheets(surveyConfig.googleScriptUrl, {
                  id: crypto.randomUUID(),
                  guest: { firstName: firstNameParts.join(' ') || lastName, lastName: firstNameParts.length ? lastName : '' },
                  questions: [
                    { id: 'attendance', title: 'Сможете ли Вы присутствовать?' },
                    { id: 'drinks', title: 'Предпочтения по напиткам' },
                  ],
                  answers: {
                    attendance: rsvpForm.attendance,
                    drinks: rsvpForm.drinks.join(', '),
                  },
                });
              } catch {}
            }
            setRsvpSent(true);
          }}>
            <div className="form__group">
              <label className="form__label">Фамилия Имя</label>
              <input className="form__input" required placeholder="Антон и Анна – Ивановы" value={rsvpForm.name} onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })} />
            </div>
            <div className="form__group">
              <label className="form__label">Сможете ли Вы присутствовать?</label>
              <div className="form__radio-group">
                {['Смогу / сможем присутствовать', 'Затрудняюсь ответить, сообщу позже', 'Не смогу прийти'].map((opt) => (
                  <label className="form__option" key={opt}>
                    <input type="radio" name="attendance" value={opt} checked={rsvpForm.attendance === opt} onChange={(e) => setRsvpForm({ ...rsvpForm, attendance: e.target.value })} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="form__group">
              <label className="form__label">Предпочтения по напиткам</label>
              <div className="form__subtitle">Можно выбрать несколько вариантов</div>
              <div className="form__checkbox-group">
                {['Шампанское', 'Белое вино', 'Красное вино', 'Виски', 'Водка', 'Коньяк', 'Безалкогольное'].map((opt) => (
                  <label className="form__option" key={opt}>
                    <input type="checkbox" value={opt} checked={rsvpForm.drinks.includes(opt)} onChange={(e) => {
                      const next = e.target.checked ? [...rsvpForm.drinks, opt] : rsvpForm.drinks.filter((d) => d !== opt);
                      setRsvpForm({ ...rsvpForm, drinks: next });
                    }} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
            <button className="form__submit" type="submit" disabled={rsvpLoading}>
              {rsvpLoading ? <span className="spinner" /> : 'Отправить'}
            </button>
          </form>
        )}
      </section>

      <section className="closing" id="closing">
        <div className="closing__text">Ждем Вас!</div>
      </section>

      <section className="photo-section" id="photo-section">
        <div className="photo-section__image">
          <img src={assetUrl('wedding-hero1.jpg')} alt="" />
        </div>
        <div className="photo-section__credit">Photo: @anastasiyagood</div>
      </section>

      <section className="calendar" id="calendar">
        <div className="calendar__title">АВГУСТ 2026</div>
        <div className="calendar__grid">
          <div className="calendar__weekday">ПН</div>
          <div className="calendar__weekday">ВТ</div>
          <div className="calendar__weekday">СР</div>
          <div className="calendar__weekday">ЧТ</div>
          <div className="calendar__weekday">ПТ</div>
          <div className="calendar__weekday">СБ</div>
          <div className="calendar__weekday">ВС</div>
          {Array.from({ length: 5 }, (_, i) => <div key={`empty-${i}`} className="calendar__day calendar__day--empty" />)}
          {Array.from({ length: 31 }, (_, i) => {
            const day = i + 1;
            return (
              <div key={day} className={`calendar__day${day === 1 ? ' calendar__day--highlighted' : ''}`}>
                <span className="calendar__day-number">{day}</span>
                {day === 1 && <span className="calendar__heart">&#10084;</span>}
              </div>
            );
          })}
        </div>
      </section>

      <hr className="divider" />

      <section className="contacts" id="contacts">
        <div className="section__title">Контакты</div>
        <p className="contacts__desc">
          По всем интересующим вас вопросам<br />
          вы можете связаться с женихом
        </p>
        <div className="contacts__name">{COUPLE.groom}</div>
        <a className="contacts__phone" href={`tel:${PHONE.replace(/\s/g, '')}`}>{PHONE}</a>
        <div className="contacts__social">
          <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">
            <img src={ICONS.whatsapp} alt="WhatsApp" />
          </a>
        </div>
      </section>

      <audio ref={audioRef} src={assetUrl(MUSIC_FILE)} loop preload="auto" />

      {musicStarted && (
        <button
          className={`music-toggle${musicPlaying ? ' music-toggle--playing' : ''}`}
          onClick={() => {
            if (audioRef.current) {
              if (musicPlaying) {
                audioRef.current.pause();
                setMusicPlaying(false);
              } else {
                audioRef.current.play();
                setMusicPlaying(true);
              }
            }
          }}
          aria-label={musicPlaying ? 'Выключить музыку' : 'Включить музыку'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {musicPlaying ? (
              <>
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <path d="M19.07 4.93a10 10 0 010 14.14" />
                <path d="M15.54 8.46a5 5 0 010 7.07" />
              </>
            ) : (
              <>
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </>
            )}
          </svg>
        </button>
      )}
    </>
  );
}
