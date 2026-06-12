import {
  CalendarDays,
  ChevronDown,
  Check,
  ExternalLink,
  Heart,
  MapPin,
  Sparkles,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import Aurora from './components/Aurora';
import { inviteConfig, surveyConfig } from './config/site';
import { assetUrl } from './lib/assets';
import { sendResponseToGoogleSheets } from './lib/rsvpStorage';

function SectionLabel({ children }) {
  return <span className="section-label">{children}</span>;
}

function SplitTitle({ text, as: Tag = 'h1', className = '' }) {
  const words = text.split(' ');

  return (
    <Tag className={`split-title ${className}`}>
      {words.map((word, index) => (
        <span
          className="split-title__word"
          style={{ '--delay': `${index * 90}ms` }}
          key={`${word}-${index}`}
        >
          {word}
        </span>
      ))}
    </Tag>
  );
}

function Hero({ onOpenRsvp }) {
  const { hero, couple, date, images } = inviteConfig;

  return (
    <header className="hero" id="top">
      <div
        className="hero__photo"
        style={{ backgroundImage: `url(${assetUrl(images.hero)})` }}
        aria-hidden="true"
      />
      <Aurora
        amplitude={0.95}
        blend={0.5}
        colorStops={['#f4ddbf', '#9dac92', '#f7efe3']}
      />
      <nav className="nav" aria-label="Основная навигация">
        <a href="#top" className="nav__mark" aria-label="В начало">
          {couple.short}
        </a>
        <div className="nav__links">
          <a href="#program">Программа</a>
          <a href="#dress-code">Дресс-код</a>
          <a href="#location">Локация</a>
          <button type="button" onClick={onOpenRsvp}>RSVP</button>
        </div>
      </nav>

      <div className="hero__content">
        <p className="eyebrow">{hero.eyebrow}</p>
        <SplitTitle text={hero.title} />
        <p className="hero__subtitle">{hero.subtitle}</p>
        <div className="hero__meta" aria-label="Дата свадьбы">
          <span>{date.full}</span>
          <i />
          <span>WEDDING DAY</span>
        </div>
        <div className="hero__actions">
          <button className="button button--dark" type="button" onClick={onOpenRsvp}>
            Заполнить анкету
          </button>
          <a className="button button--ghost" href="#invitation">
            {hero.scrollLabel}
            <ChevronDown aria-hidden="true" size={18} />
          </a>
        </div>
      </div>
    </header>
  );
}

function Intro() {
  return (
    <section className="intro" id="invitation">
      <div className="intro__date" aria-label={inviteConfig.date.full}>
        <span>{inviteConfig.date.day}</span>
        <div>
          <strong>{inviteConfig.date.month}</strong>
          <small>{inviteConfig.date.year}</small>
        </div>
      </div>
      <div className="intro__text">
        <SectionLabel>{inviteConfig.intro.label}</SectionLabel>
        <h2>{inviteConfig.intro.title}</h2>
        <p>{inviteConfig.intro.text}</p>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section className="gallery-section" aria-label="Фотографии пары">
      <div className="gallery-heading">
        <SectionLabel>{inviteConfig.gallery.label}</SectionLabel>
        <h2>{inviteConfig.gallery.title}</h2>
        <p>{inviteConfig.gallery.text}</p>
      </div>
      <div className="gallery">
        {inviteConfig.gallery.items.map((item) => (
          <figure className="gallery__item" key={item.image}>
            <img src={assetUrl(item.image)} alt={item.title} />
            <figcaption>
              <strong>{item.title}</strong>
              <span>{item.text}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Program() {
  return (
    <section className="program page-section" id="program">
      <div className="section-heading">
        <SectionLabel>{inviteConfig.program.label}</SectionLabel>
        <h2>{inviteConfig.program.title}</h2>
      </div>
      <div className="timeline">
        {inviteConfig.program.items.map((item) => (
          <article className="timeline__item" key={`${item.time}-${item.title}`}>
            <time>{item.time}</time>
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function DressCode() {
  const { dressCode } = inviteConfig;

  return (
    <section className="dress page-section" id="dress-code">
      <div className="section-heading">
        <SectionLabel>{dressCode.label}</SectionLabel>
        <h2>{dressCode.title}</h2>
      </div>
      <div className="dress__palette" aria-label="Палитра дресс-кода">
        {dressCode.palette.map((color) => (
          <span key={color} style={{ backgroundColor: color }} />
        ))}
      </div>
      <div className="dress__notes">
        <p>{dressCode.women}</p>
        <p>{dressCode.men}</p>
      </div>
    </section>
  );
}

function Location() {
  const { location } = inviteConfig;

  return (
    <section className="location page-section" id="location">
      <div>
        <SectionLabel>{location.label}</SectionLabel>
        <h2>{location.title}</h2>
      </div>
      <div className="location__body">
        <div className="location__pin" aria-hidden="true">
          <MapPin size={34} />
        </div>
        <div>
          <h3>{location.name}</h3>
          <p>{location.address}</p>
          <p className="muted">{location.note}</p>
          <a className="text-link" href={location.mapUrl} target="_blank" rel="noreferrer">
            Открыть карту
            <ExternalLink aria-hidden="true" size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

function Notes() {
  const icons = [Sparkles, Heart, CalendarDays];

  return (
    <section className="notes page-section" aria-label="Важные детали">
      {inviteConfig.notes.map((note, index) => {
        const Icon = icons[index] ?? Sparkles;

        return (
          <article className="note" key={note.label}>
            <Icon aria-hidden="true" size={24} />
            <SectionLabel>{note.label}</SectionLabel>
            <h3>{note.title}</h3>
            <p>{note.text}</p>
          </article>
        );
      })}
    </section>
  );
}

function RsvpTeaser({ onOpenRsvp }) {
  const { intro } = surveyConfig;

  return (
    <section
      className="rsvp page-section"
      id="rsvp"
      style={{ '--rsvp-bg': `url(${assetUrl(inviteConfig.images.hero)})` }}
    >
      <div className="rsvp__copy">
        <SectionLabel>{intro.label}</SectionLabel>
        <h2>{intro.title}</h2>
        <p>
          Просим подтвердить ваше присутствие <strong>{intro.deadline}</strong>{' '}
          {intro.text}
        </p>
        <button className="button button--light" type="button" onClick={onOpenRsvp}>
          {intro.openButtonText}
        </button>
      </div>
      <div className="rsvp__signature">
        <span>{inviteConfig.closing}</span>
      </div>
    </section>
  );
}

function getInitialFormState() {
  const guestFields = Object.fromEntries(
    surveyConfig.guestFields.map((field) => [field.id, '']),
  );
  const answers = Object.fromEntries(
    surveyConfig.questions.map((question) => [
      question.id,
      question.type === 'checkbox' ? [] : '',
    ]),
  );

  return { guest: guestFields, answers };
}

function hasAnswer(question, value) {
  if (!question.required) return true;
  if (Array.isArray(value)) return value.length > 0;
  return String(value || '').trim().length > 0;
}

function QuestionField({ question, value, onChange }) {
  if (question.type === 'textarea') {
    return (
      <textarea
        autoFocus
        value={value}
        placeholder={question.placeholder}
        onChange={(event) => onChange(question.id, event.target.value)}
      />
    );
  }

  if (question.type === 'select') {
    return (
      <select
        autoFocus
        value={value}
        onChange={(event) => onChange(question.id, event.target.value)}
      >
        <option value="">Выберите ответ</option>
        {question.options.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (question.type === 'checkbox') {
    return (
      <div className="modal-choice-list">
        {question.options.map((option) => (
          <label className="modal-choice" key={option}>
            <input
              checked={value.includes(option)}
              type="checkbox"
              onChange={(event) => {
                const nextValue = event.target.checked
                  ? [...value, option]
                  : value.filter((item) => item !== option);
                onChange(question.id, nextValue);
              }}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    );
  }

  return (
    <div className="modal-choice-list">
      {question.options.map((option) => (
        <label className="modal-choice" key={option}>
          <input
            checked={value === option}
            name={question.id}
            type="radio"
            value={option}
            onChange={(event) => onChange(question.id, event.target.value)}
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}

function RsvpModal({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [formState, setFormState] = useState(getInitialFormState);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const { intro, googleScriptUrl } = surveyConfig;
  const steps = useMemo(
    () => [
      { kind: 'start', id: 'start' },
      ...surveyConfig.guestFields.map((field) => ({ kind: 'guest', field, id: field.id })),
      ...surveyConfig.questions.map((question) => ({ kind: 'question', question, id: question.id })),
      { kind: 'review', id: 'review' },
    ],
    [],
  );
  const currentStep = steps[step];
  const progress = Math.round((step / (steps.length - 1)) * 100);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.classList.add('modal-open');
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const updateGuest = (fieldId, value) => {
    setFormState((current) => ({
      ...current,
      guest: { ...current.guest, [fieldId]: value },
    }));
  };

  const updateAnswer = (questionId, value) => {
    setFormState((current) => ({
      ...current,
      answers: { ...current.answers, [questionId]: value },
    }));
  };

  const canGoNext = () => {
    if (currentStep.kind === 'guest') {
      if (!currentStep.field.required) return true;
      return formState.guest[currentStep.field.id].trim().length > 0;
    }

    if (currentStep.kind === 'question') {
      return hasAnswer(
        currentStep.question,
        formState.answers[currentStep.question.id],
      );
    }

    return true;
  };

  const next = () => {
    setMessage('');
    if (step < steps.length - 1 && canGoNext()) {
      setStep((current) => current + 1);
    }
  };

  const back = () => {
    setMessage('');
    setStep((current) => Math.max(0, current - 1));
  };

  const submit = async () => {
    if (!googleScriptUrl) {
      setStatus('warning');
      setMessage(intro.notConfiguredText);
      return;
    }

    setStatus('sending');
    setMessage('');

    try {
      await sendResponseToGoogleSheets(googleScriptUrl, {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        guest: formState.guest,
        questions: surveyConfig.questions.map(({ id, title }) => ({ id, title })),
        answers: formState.answers,
      });
      setStatus('success');
      setMessage(intro.successText);
    } catch {
      setStatus('error');
      setMessage(intro.errorText);
    }
  };

  const restart = () => {
    setFormState(getInitialFormState());
    setStep(0);
    setStatus('idle');
    setMessage('');
  };

  return (
    <div className="rsvp-modal" role="dialog" aria-modal="true" aria-labelledby="rsvp-modal-title">
      <button className="modal-backdrop" type="button" aria-label="Закрыть анкету" onClick={onClose} />
      <div className="modal-card">
        <button className="modal-close" type="button" aria-label="Закрыть" onClick={onClose}>
          <X size={20} />
        </button>
        <div className="modal-content">
          <div className="modal-topline">
            <span>{intro.label}</span>
            <div className="modal-progress" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>

          {status === 'success' ? (
            <div className="modal-success">
              <div className="success-mark"><Check size={30} /></div>
              <SectionLabel>{intro.label}</SectionLabel>
              <h2 id="rsvp-modal-title">Спасибо!</h2>
              <p>{message}</p>
              <button className="button button--dark" type="button" onClick={onClose}>
                Закрыть
              </button>
            </div>
          ) : (
            <>
              <StepContent
                currentStep={currentStep}
                formState={formState}
                intro={intro}
                message={message}
                onAnswerChange={updateAnswer}
                onGuestChange={updateGuest}
                status={status}
              />

              <div className="modal-actions">
                <button
                  className="button button--ghost-dark"
                  disabled={step === 0 || status === 'sending'}
                  type="button"
                  onClick={back}
                >
                  Назад
                </button>
                {currentStep.kind === 'review' ? (
                  <button
                    className="button button--dark"
                    disabled={status === 'sending'}
                    type="button"
                    onClick={submit}
                  >
                    {status === 'sending' ? 'Отправляем...' : intro.submitButtonText}
                  </button>
                ) : (
                  <button
                    className="button button--dark"
                    disabled={!canGoNext() || status === 'sending'}
                    type="button"
                    onClick={next}
                  >
                    {step === 0 ? intro.startButtonText : 'Далее'}
                  </button>
                )}
              </div>

              {message && status !== 'success' ? (
                <div className={`modal-message modal-message--${status}`}>
                  <p>{message}</p>
                  {status === 'warning' ? (
                    <button type="button" onClick={restart}>Начать заново</button>
                  ) : null}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StepContent({
  currentStep,
  formState,
  intro,
  message,
  onAnswerChange,
  onGuestChange,
  status,
}) {
  if (currentStep.kind === 'start') {
    return (
      <div className="modal-step">
        <SectionLabel>{intro.label}</SectionLabel>
        <h2 id="rsvp-modal-title">{intro.modalTitle}</h2>
        <p>{intro.modalText}</p>
      </div>
    );
  }

  if (currentStep.kind === 'guest') {
    const { field } = currentStep;

    return (
      <div className="modal-step">
        <SectionLabel>Гость</SectionLabel>
        <h2 id="rsvp-modal-title">{field.label}</h2>
        <input
          autoFocus
          placeholder={field.placeholder}
          type={field.type}
          value={formState.guest[field.id]}
          onChange={(event) => onGuestChange(field.id, event.target.value)}
        />
      </div>
    );
  }

  if (currentStep.kind === 'question') {
    const { question } = currentStep;

    return (
      <div className="modal-step">
        <SectionLabel>Вопрос</SectionLabel>
        <h2 id="rsvp-modal-title">{question.title}</h2>
        {question.description ? <p>{question.description}</p> : null}
        <QuestionField
          question={question}
          value={formState.answers[question.id]}
          onChange={onAnswerChange}
        />
      </div>
    );
  }

  return (
    <div className="modal-step">
      <SectionLabel>Проверка</SectionLabel>
      <h2 id="rsvp-modal-title">Всё верно?</h2>
      <div className="review-list">
        {Object.entries(formState.guest).map(([key, value]) => {
          const field = surveyConfig.guestFields.find((item) => item.id === key);
          return (
            <p key={key}>
              <span>{field?.label || key}</span>
              {value}
            </p>
          );
        })}
        {surveyConfig.questions.map((question) => {
          const value = formState.answers[question.id];
          return (
            <p key={question.id}>
              <span>{question.title}</span>
              {Array.isArray(value) ? value.join(', ') : value || 'нет ответа'}
            </p>
          );
        })}
      </div>
      {message && status === 'error' ? <p className="modal-error">{message}</p> : null}
    </div>
  );
}

export default function App() {
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);

  return (
    <>
      <Hero onOpenRsvp={() => setIsRsvpOpen(true)} />
      <main>
        <Intro />
        <Gallery />
        <Program />
        <DressCode />
        <Location />
        <Notes />
        <RsvpTeaser onOpenRsvp={() => setIsRsvpOpen(true)} />
      </main>
      <RsvpModal isOpen={isRsvpOpen} onClose={() => setIsRsvpOpen(false)} />
    </>
  );
}
