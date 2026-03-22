'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { postItem } from '@/services/itemService'
import type { ItemFormValues, ItemCategory, ItemType } from '@/types'
import { CATEGORY_LABELS, LOCATION_OPTIONS } from '@/utils/helpers'
import Link from 'next/link'

/* ============================================================
   ICONS
   ============================================================ */
const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
)
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5v14"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
)

/* ============================================================
   CONSTANTS
   ============================================================ */
const STEPS = [
  { label: 'Item Type',    icon: '📋' },
  { label: 'Details',      icon: '✏️' },
  { label: 'Location',     icon: '📍' },
  { label: 'Security',     icon: '🔒' },
  { label: 'Review',       icon: '✅' },
]

const CATEGORY_EMOJIS: Record<string, string> = {
  electronics: '💻', clothing: '👕', accessories: '⌚',
  documents: '📄', keys: '🔑', bags: '🎒',
  stationery: '✏️', sports: '⚽', other: '📦',
}

/* ============================================================
   STEP INDICATOR
   ============================================================ */
function StepBar({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              display: 'flex', flexDirection: 'column' as const,
              alignItems: 'center', gap: 6,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: i < current
                  ? 'var(--color-brand-amber)'
                  : i === current
                    ? 'var(--color-brand-navy)'
                    : 'var(--color-surface-3)',
                border: i === current
                  ? '2px solid var(--color-brand-amber)'
                  : '2px solid transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: i < current ? '0.9rem' : '1rem',
                transition: 'all 0.3s ease',
                flexShrink: 0,
                color: i < current
                  ? 'var(--color-brand-navy)'
                  : i === current ? 'white' : 'var(--color-text-muted)',
                fontWeight: 700,
              }}>
                {i < current ? <CheckIcon /> : s.icon}
              </div>
              <span style={{
                fontSize: '0.7rem', fontWeight: i === current ? 700 : 500,
                color: i === current ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                whiteSpace: 'nowrap' as const,
              }}>
                {s.label}
              </span>
            </div>
            {i < total - 1 && (
              <div style={{
                width: 'clamp(20px, 4vw, 48px)', height: 2, marginBottom: 22,
                background: i < current ? 'var(--color-brand-amber)' : 'var(--color-border)',
                transition: 'background 0.3s ease',
                flexShrink: 0,
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ============================================================
   POST ITEM PAGE
   ============================================================ */
export default function PostItemPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [extraKey, setExtraKey] = useState('')
  const [extraVal, setExtraVal] = useState('')
  const [form, setForm] = useState<ItemFormValues>({
    type: 'lost',
    title: '',
    category: 'other',
    location: '',
    date: new Date().toISOString().split('T')[0],
    securityQuestions: [
    {
      question: '',
      options: ['', ''], // minimum 2 options
      correctAnswer: -1
    }
  ],
    extraAttributes: {},
  })

    /* ── Field updater ── */
  const set = (field: keyof ItemFormValues, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const addQuestion = () => {
    const last = form.securityQuestions?.slice(-1)[0]

    if (last && (!last.question.trim() || last.options.some(o => !o.trim()))) {
      setError('Fill previous question properly first')
      return
    }

    set('securityQuestions', [
      ...(form.securityQuestions || []),
      { question: '', options: ['', ''], correctAnswer: -1 }
    ])
  }

  const updateQuestion = (index: number, value: string) => {
    const updated = [...(form.securityQuestions ?? [])]
    updated[index] = { ...updated[index], question: value }
    set('securityQuestions', updated)
  }

  const addOption = (qIndex: number) => {
    const updated = [...(form.securityQuestions ?? [])]
    updated[qIndex] = {
      ...updated[qIndex],
      options: [...updated[qIndex].options, '']
    }
    set('securityQuestions', updated)
  }

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...(form.securityQuestions ?? [])]
    const options = [...updated[qIndex].options]
    options[oIndex] = value
    updated[qIndex] = { ...updated[qIndex], options }

    // ❗ reset correct answer if edited
    if (updated[qIndex].correctAnswer === -1) {
      updated[qIndex].correctAnswer = -1
    }

    set('securityQuestions', updated)
  }

  const setCorrectAnswer = (qIndex: number, index: number) => {
    const updated = [...(form.securityQuestions || [])]
    updated[qIndex].correctAnswer = index
    set('securityQuestions', updated)
  }


  /* ── Image handler ── */
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB.'); return }
    set('image', file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  /* ── Extra attributes ── */
  const addExtra = () => {
    if (!extraKey.trim() || !extraVal.trim()) return
    set('extraAttributes', { ...form.extraAttributes, [extraKey.trim()]: extraVal.trim() })
    setExtraKey('')
    setExtraVal('')
  }
  const removeExtra = (key: string) => {
    const updated = { ...form.extraAttributes }
    delete updated[key]
    set('extraAttributes', updated)
  }

  const removeQuestion = (qIndex: number) => {
    if ((form.securityQuestions?.length || 0) <= 1) {
      setError('At least one question is required')
      return
    }

    const updated = [...(form.securityQuestions || [])]
    updated.splice(qIndex, 1)
    set('securityQuestions', updated)
  }

  /* ── Validation ── */
  const validate = () => {
    if (step === 0 && !form.type) return 'Please select Lost or Found.'
    if (step === 1) {
      if (!form.title.trim()) return 'Please enter an item title.'
      if (!form.category) return 'Please select a category.'
    }
    if (step === 2) {
      if (!form.location.trim()) return 'Please enter a location.'
      if (!form.date) return 'Please select a date.'
    }
    if (step === 3 && form.type === 'found') {
      const questions = form.securityQuestions ?? []

      if (!questions.length)
        return 'Add at least one question.'

      for (const q of questions) {
        if (!q.question.trim())
          return 'Question cannot be empty.'

        if (q.options.length < 2)
          return 'Each question needs at least 2 options.'

        if (q.options.some(opt => !opt.trim()))
          return 'Options cannot be empty.'

        if (q.correctAnswer === -1)
          return 'Select correct answer.'
      }
      
    }
    return ''
  }

  const handleNext = () => {
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    setStep(s => s + 1)
  }

  const handleBack = () => { setError(''); setStep(s => s - 1) }

  /* ── Submit ── */
  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const item = await postItem(form)
      router.push(`/items/${item._id}?posted=true`)
    } catch (err: any) {
      setError(err?.message || 'Failed to post item. Please try again.')
      setLoading(false)
    }
  }

  /* ── Not logged in ── */
  if (!isAuthenticated) return (
    <div style={{
      minHeight: '60dvh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center' as const, maxWidth: 380 }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔐</div>
        <h2 style={{ marginBottom: 8 }}>Sign in to post</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
          You need to be signed in to post a lost or found item.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <Link href="/login?redirect=/post-item" className="qf-btn qf-btn-primary">Sign In</Link>
          <Link href="/register" className="qf-btn qf-btn-secondary">Register</Link>
        </div>
      </div>
    </div>
  )

  /* ── Shared field styles ── */
  const fieldWrap: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6 }

  return (
    <div style={{ background: 'var(--color-surface)', minHeight: '100dvh' }}>

      {/* ── HEADER ── */}
      <div style={{
        background: 'var(--color-brand-navy)',
        paddingBlock: 'clamp(2rem, 4vw, 3rem)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(245,158,11,0.07) 0%, transparent 70%)',
        }} />
        <div className="qf-container" style={{ position: 'relative', textAlign: 'center' as const }}>
          <h1 style={{ color: 'white', marginBottom: 8 }}>Post an Item</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)' }}>
            Fill in the details — takes less than 2 minutes
          </p>
        </div>
      </div>

      {/* ── FORM ── */}
      <div className="qf-container" style={{ paddingBlock: '2.5rem' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>

          <StepBar current={step} total={STEPS.length} />

          {/* Error */}
          {error && (
            <div style={{
              padding: '0.875rem 1rem', borderRadius: 10,
              background: 'var(--color-lost-bg)',
              border: '1px solid rgba(239,68,68,0.2)',
              marginBottom: '1.5rem',
              fontSize: '0.875rem', color: 'var(--color-lost)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* ══════════════════════════════
              STEP 0 — Item Type
          ══════════════════════════════ */}
          {step === 0 && (
            <div className="animate-fade-in">
              <h3 style={{ marginBottom: '0.5rem' }}>What are you posting?</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                Select whether you lost something or found something.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {([
                  { value: 'lost',  emoji: '🔍', title: 'I Lost Something',  desc: 'Post an item you\'ve lost and notify the campus.' },
                  { value: 'found', emoji: '✅', title: 'I Found Something',  desc: 'Post an item you\'ve found so the owner can claim it.' },
                ] as const).map(opt => (
                  <button key={opt.value} type="button"
                    onClick={() => set('type', opt.value as ItemType)}
                    style={{
                      padding: '2rem 1.5rem',
                      borderRadius: 14,
                      border: `2px solid ${form.type === opt.value
                        ? opt.value === 'lost' ? 'var(--color-lost)' : 'var(--color-found)'
                        : 'var(--color-border)'}`,
                      background: form.type === opt.value
                        ? opt.value === 'lost' ? 'var(--color-lost-bg)' : 'var(--color-found-bg)'
                        : 'var(--color-surface)',
                      cursor: 'pointer',
                      textAlign: 'center' as const,
                      transition: 'all var(--transition-smooth)',
                    }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{opt.emoji}</div>
                    <p style={{
                      fontFamily: 'var(--font-display)', fontWeight: 700,
                      fontSize: '1rem', color: 'var(--color-text-primary)', marginBottom: 6,
                    }}>
                      {opt.title}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                      {opt.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════
              STEP 1 — Item Details
          ══════════════════════════════ */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h3 style={{ marginBottom: 0 }}>Describe the item</h3>

              {/* Title */}
              <div style={fieldWrap}>
                <label className="qf-label" htmlFor="title">Item Title *</label>
                <input
                  id="title" value={form.title}
                  onChange={e => set('title', e.target.value)}
                  placeholder="e.g. Blue HP Laptop, Black Leather Wallet"
                  className="qf-input"
                />
              </div>

              {/* Category */}
              <div style={fieldWrap}>
                <label className="qf-label">Category *</label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                  gap: 8,
                }}>
                  {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                    <button key={val} type="button"
                      onClick={() => set('category', val as ItemCategory)}
                      style={{
                        padding: '0.625rem 0.5rem',
                        borderRadius: 10,
                        border: `1.5px solid ${form.category === val ? 'var(--color-brand-amber)' : 'var(--color-border)'}`,
                        background: form.category === val ? 'var(--color-brand-amber-dim)' : 'var(--color-surface)',
                        cursor: 'pointer',
                        textAlign: 'center' as const,
                        transition: 'all var(--transition-base)',
                        fontFamily: 'var(--font-body)',
                      }}>
                      <div style={{ fontSize: '1.25rem', marginBottom: 3 }}>
                        {CATEGORY_EMOJIS[val]}
                      </div>
                      <div style={{
                        fontSize: '0.72rem', fontWeight: 600,
                        color: form.category === val ? 'var(--color-brand-navy)' : 'var(--color-text-secondary)',
                      }}>
                        {label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Image upload */}
              <div style={fieldWrap}>
                <label className="qf-label">Photo <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(optional, max 5MB)</span></label>
                {imagePreview ? (
                  <div style={{ position: 'relative', width: '100%', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                    <img src={imagePreview} alt="Preview"
                      style={{ width: '100%', maxHeight: 220, objectFit: 'cover', display: 'block' }} />
                    <button type="button" onClick={() => { setImagePreview(null); set('image', undefined) }}
                      style={{
                        position: 'absolute', top: 8, right: 8,
                        background: 'rgba(0,0,0,0.6)', border: 'none',
                        borderRadius: '50%', width: 28, height: 28,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'white',
                      }}>
                      <XIcon />
                    </button>
                  </div>
                ) : (
                  <label style={{
                    display: 'flex', flexDirection: 'column' as const,
                    alignItems: 'center', justifyContent: 'center',
                    gap: 10, padding: '2rem',
                    border: '2px dashed var(--color-border)',
                    borderRadius: 12, cursor: 'pointer',
                    background: 'var(--color-surface-2)',
                    transition: 'border-color var(--transition-base)',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-brand-amber)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
                  >
                    <UploadIcon />
                    <div style={{ textAlign: 'center' as const }}>
                      <p style={{ fontWeight: 600, color: 'var(--color-text-primary)', margin: 0, fontSize: '0.9rem' }}>
                        Click to upload a photo
                      </p>
                      <p style={{ color: 'var(--color-text-muted)', margin: 0, fontSize: '0.8rem' }}>
                        JPG, PNG, WEBP up to 5MB
                      </p>
                    </div>
                    <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
                  </label>
                )}
              </div>

              {/* Extra attributes */}
              <div style={fieldWrap}>
                <label className="qf-label">Extra Details <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(optional)</span></label>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  Add key details like color, brand, model number, etc.
                </p>

                {/* Existing extras */}
                {Object.entries(form.extraAttributes || {}).length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {Object.entries(form.extraAttributes || {}).map(([k, v]) => (
                      <div key={k} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.5rem 0.875rem', borderRadius: 8,
                        background: 'var(--color-surface-2)', border: '1px solid var(--color-border)',
                      }}>
                        <span style={{ fontSize: '0.875rem' }}>
                          <strong style={{ textTransform: 'capitalize' as const }}>{k}</strong>: {v}
                        </span>
                        <button type="button" onClick={() => removeExtra(k)} style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'var(--color-text-muted)', display: 'flex', padding: 4,
                        }}><XIcon /></button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new extra */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={extraKey} onChange={e => setExtraKey(e.target.value)}
                    placeholder="Key (e.g. Color)"
                    className="qf-input" style={{ flex: 1 }}
                    onKeyDown={e => e.key === 'Enter' && addExtra()}
                  />
                  <input
                    value={extraVal} onChange={e => setExtraVal(e.target.value)}
                    placeholder="Value (e.g. Blue)"
                    className="qf-input" style={{ flex: 1 }}
                    onKeyDown={e => e.key === 'Enter' && addExtra()}
                  />
                  <button type="button" onClick={addExtra}
                    className="qf-btn qf-btn-secondary"
                    style={{ padding: '0.625rem 0.875rem', flexShrink: 0 }}>
                    <PlusIcon />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════
              STEP 2 — Location & Date
          ══════════════════════════════ */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h3 style={{ marginBottom: 0 }}>Where and when?</h3>

              {/* Location */}
              <div style={fieldWrap}>
                <label className="qf-label" htmlFor="location">Location *</label>
                <select
                  id="location"
                  value={form.location}
                  onChange={e => set('location', e.target.value)}
                  className="qf-input"
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">Select a location...</option>
                  {LOCATION_OPTIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Custom location */}
              {form.location === 'Other' && (
                <div style={fieldWrap}>
                  <label className="qf-label" htmlFor="customLocation">Specify Location *</label>
                  <input
                    id="customLocation"
                    placeholder="e.g. Near Gate 3, Engineering Block"
                    className="qf-input"
                    onChange={e => set('location', e.target.value)}
                  />
                </div>
              )}

              {/* Date */}
              <div style={fieldWrap}>
                <label className="qf-label" htmlFor="date">
                  Date {form.type === 'lost' ? 'Lost' : 'Found'} *
                </label>
                <input
                  id="date" type="date"
                  value={form.date}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={e => set('date', e.target.value)}
                  className="qf-input"
                />
              </div>
            </div>
          )}

          {/* ══════════════════════════════
              STEP 3 — Security
          ══════════════════════════════ */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              <h3>
                {form.type === 'found' ? 'Set Security Questions' : 'Almost done!'}
              </h3>

              {form.type === 'found' ? (
                <>
                  <div style={{
                    padding: '1rem',
                    borderRadius: 10,
                    background: 'var(--color-brand-amber-dim)',
                    border: '1px solid rgba(245,158,11,0.25)'
                  }}>
                    🔒 Add questions only the real owner can answer.
                  </div>

                  {(form.securityQuestions ?? []).map((q, qIndex) => (
                    <div key={qIndex} style={{
                      border: '1px solid var(--color-border)',
                      padding: '1rem',
                      borderRadius: 10
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 8
                      }}>
                        <label className="qf-label">Question {qIndex + 1}</label>

                        <button
                          type="button"
                          onClick={() => removeQuestion(qIndex)}
                          disabled={(form.securityQuestions?.length || 0) <= 1}
                          style={{
                            background: 'none',
                            color: 'black',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          ❌ Delete
                        </button>
                      </div>

                      {/* Question */}
                      <input
                        value={q.question}
                        onChange={(e) => updateQuestion(qIndex, e.target.value)}
                        placeholder="Enter question..."
                        className="qf-input"
                      />

                      {/* Options */}
                      <div style={{ marginTop: '1rem' }}>
                        {q.options.map((opt, oIndex) => (
                          <div key={oIndex} style={{
                            display: 'flex',
                            gap: 10,
                            alignItems: 'center',
                            marginBottom: 8
                          }}>
                            <input
                              value={opt}
                              placeholder={`Option ${oIndex + 1}`}
                              onChange={(e) =>
                                updateOption(qIndex, oIndex, e.target.value)
                              }
                              className="qf-input"
                            />

                            <input
                              type="radio"
                              name={`correct-${qIndex}`}
                              disabled={!opt.trim()}
                              checked={q.correctAnswer === oIndex}
                              onChange={() => setCorrectAnswer(qIndex, oIndex)}
                            />

                            <span style={{
                              fontSize: '0.75rem',
                              color: q.correctAnswer === oIndex  ? 'green' : 'var(--color-text-muted)'
                            }}>
                              {q.correctAnswer === oIndex  ? 'Correct' : 'Select'}
                            </span>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => addOption(qIndex)}
                          className="qf-btn qf-btn-secondary"
                          style={{ marginTop: 6 }}
                        >
                          + Add Option
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addQuestion}
                    className="qf-btn qf-btn-primary"
                  >
                    + Add Question
                  </button>

                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Answers are stored securely and never shown publicly.
                  </p>
                </>
              ) : (
                <div style={{
                  padding: '1.5rem',
                  borderRadius: 12,
                  background: 'var(--color-found-bg)',
                  textAlign: 'center'
                }}>
                  No security needed for lost items.
                </div>
              )}
            </div>
          )}
          {/* ══════════════════════════════
              STEP 4 — Review & Submit
          ══════════════════════════════ */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }} className="animate-fade-in">
              <h3 style={{ marginBottom: 0 }}>Review your post</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', margin: 0 }}>
                Everything look good? Hit submit to go live on campus.
              </p>

              {/* Summary card */}
              <div style={{
                borderRadius: 14, border: '1px solid var(--color-border)',
                overflow: 'hidden',
              }}>
                {/* Image preview */}
                {imagePreview && (
                  <img src={imagePreview} alt="Preview"
                    style={{ width: '100%', maxHeight: 200, objectFit: 'cover', display: 'block' }} />
                )}

                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {/* Type badge */}
                  <span className={`qf-badge qf-badge-${form.type}`}>
                    {form.type === 'lost' ? '🔍 Lost' : '✅ Found'}
                  </span>

                  {/* Title */}
                  <h3 style={{ margin: 0 }}>{form.title || '—'}</h3>

                  {/* Meta */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
                    paddingTop: '0.875rem',
                    borderTop: '1px solid var(--color-border)',
                  }}>
                    {[
                      { label: 'Category', value: `${CATEGORY_EMOJIS[form.category]} ${CATEGORY_LABELS[form.category]}` },
                      { label: 'Location', value: form.location || '—' },
                      { label: 'Date', value: form.date || '—' },
                      {
                        label: 'Security Q',
                        value: form.type === 'found'
                          ? (form.securityQuestions?.length ? `${form.securityQuestions.length} Questions` : '—')
                          : 'N/A'
                      }
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'var(--color-text-muted)', margin: '0 0 2px' }}>
                          {label}
                        </p>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', margin: 0 }}>
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Extra attributes */}
                  {Object.entries(form.extraAttributes || {}).length > 0 && (
                    <div style={{ paddingTop: '0.875rem', borderTop: '1px solid var(--color-border)' }}>
                      <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: 'var(--color-text-muted)', marginBottom: 8 }}>
                        Extra Details
                      </p>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
                        {Object.entries(form.extraAttributes || {}).map(([k, v]) => (
                          <span key={k} style={{
                            padding: '0.25rem 0.625rem', borderRadius: 99,
                            background: 'var(--color-surface-3)',
                            fontSize: '0.78rem', fontWeight: 600,
                            color: 'var(--color-text-secondary)',
                          }}>
                            {k}: {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── NAV BUTTONS ── */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
            {step > 0 && (
              <button type="button" onClick={handleBack}
                className="qf-btn qf-btn-secondary"
                style={{ flex: 1, padding: '0.875rem' }}>
                ← Back
              </button>
            )}

            {step < STEPS.length - 1 ? (
              <button type="button" onClick={handleNext}
                className="qf-btn qf-btn-primary"
                style={{ flex: 2, padding: '0.875rem', fontSize: '1rem' }}>
                Continue →
              </button>
            ) : (
              <button type="button" onClick={handleSubmit}
                disabled={loading}
                className="qf-btn qf-btn-primary"
                style={{
                  flex: 2, padding: '0.875rem', fontSize: '1rem',
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                      style={{ animation: 'spin 0.75s linear infinite' }}>
                      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Posting...
                  </span>
                ) : '🚀 Post Item'}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}