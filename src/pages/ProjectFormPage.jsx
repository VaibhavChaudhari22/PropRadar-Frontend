import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Plus, Trash2, Upload, X, Check, ChevronDown, ChevronUp,
  ImageIcon, ArrowLeft
} from 'lucide-react'
import TopBar from '../components/TopBar'
import { projectsApi } from '../utils/api'
import toast from 'react-hot-toast'
import styles from './ProjectFormPage.module.css'

const BHK_OPTIONS = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const EMPTY_CARPET = { area: '', price: '' }
const EMPTY_VARIANT = { type: '2 BHK', carpet: [{ ...EMPTY_CARPET }] }

const defaultForm = {
  projectName: '',
  developerName: '',
  location: '',
  landParcel: '',
  towers: '',
  floors: '',
  flatsPerFloor: '',
  lifts: '',
  parking: '',
  amenities: '',
  possession: { month: '', year: '' },
  variants: [{ ...EMPTY_VARIANT, carpet: [{ ...EMPTY_CARPET }] }],
  cpSlab: { companyShare: '', executiveShare: '' },
  tagDays: '',
  connectivity: '',
}

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`card ${styles.section}`}>
      <button className={styles.sectionHeader} onClick={() => setOpen(o => !o)}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <div className={styles.sectionBody}>{children}</div>}
    </div>
  )
}

export default function ProjectFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const fileInputRef = useRef(null)

  const [form, setForm] = useState(defaultForm)
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEdit) loadProject()
  }, [id])

  const loadProject = async () => {
    try {
      const { data } = await projectsApi.getSingle(id)
      const p = data.project
      setForm({
        projectName: p.projectName || '',
        developerName: p.developerName || '',
        location: p.location || '',
        landParcel: p.landParcel || '',
        towers: p.towers || '',
        floors: p.floors || '',
        flatsPerFloor: p.flatsPerFloor || '',
        lifts: p.lifts || '',
        parking: p.parking || '',
        amenities: (p.amenities || []).join(', '),
        possession: { month: p.possession?.month || '', year: p.possession?.year || '' },
        variants: p.variants?.length > 0
          ? p.variants.map(v => ({
              type: v.type,
              carpet: v.carpet?.length > 0 ? v.carpet : [{ ...EMPTY_CARPET }]
            }))
          : [{ ...EMPTY_VARIANT, carpet: [{ ...EMPTY_CARPET }] }],
        cpSlab: { companyShare: p.cpSlab?.companyShare || '', executiveShare: p.cpSlab?.executiveShare || '' },
        tagDays: p.tagDays || '',
        connectivity: (p.connectivity || []).join(', '),
      })
      setExistingImages(p.images || [])
    } catch (err) {
      toast.error(err.message)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  // File picker
  const handleFiles = (e) => {
    const picked = Array.from(e.target.files)
    setFiles(prev => [...prev, ...picked])
    const newPreviews = picked.map(f => URL.createObjectURL(f))
    setPreviews(prev => [...prev, ...newPreviews])
  }

  const removeNewFile = (i) => {
    URL.revokeObjectURL(previews[i])
    setFiles(prev => prev.filter((_, idx) => idx !== i))
    setPreviews(prev => prev.filter((_, idx) => idx !== i))
  }

  // Simple field update
  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  // Nested
  const setPossession = (key, val) =>
    setForm(f => ({ ...f, possession: { ...f.possession, [key]: val } }))
  const setCpSlab = (key, val) =>
    setForm(f => ({ ...f, cpSlab: { ...f.cpSlab, [key]: val } }))

  // Variants
  const addVariant = () =>
    setForm(f => ({ ...f, variants: [...f.variants, { type: '2 BHK', carpet: [{ ...EMPTY_CARPET }] }] }))

  const removeVariant = (i) =>
    setForm(f => ({ ...f, variants: f.variants.filter((_, idx) => idx !== i) }))

  const updateVariant = (i, key, val) =>
    setForm(f => ({
      ...f,
      variants: f.variants.map((v, idx) => idx === i ? { ...v, [key]: val } : v)
    }))

  const addCarpet = (vi) =>
    setForm(f => ({
      ...f,
      variants: f.variants.map((v, idx) =>
        idx === vi ? { ...v, carpet: [...v.carpet, { ...EMPTY_CARPET }] } : v
      )
    }))

  const removeCarpet = (vi, ci) =>
    setForm(f => ({
      ...f,
      variants: f.variants.map((v, idx) =>
        idx === vi ? { ...v, carpet: v.carpet.filter((_, cidx) => cidx !== ci) } : v
      )
    }))

  const updateCarpet = (vi, ci, key, val) =>
    setForm(f => ({
      ...f,
      variants: f.variants.map((v, idx) =>
        idx === vi
          ? { ...v, carpet: v.carpet.map((c, cidx) => cidx === ci ? { ...c, [key]: val } : c) }
          : v
      )
    }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.projectName || !form.developerName || !form.location) {
      toast.error('Project name, developer and location are required')
      return
    }

    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('projectName', form.projectName)
      fd.append('developerName', form.developerName)
      fd.append('location', form.location)
      if (form.landParcel) fd.append('landParcel', form.landParcel)
      if (form.towers) fd.append('towers', form.towers)
      if (form.floors) fd.append('floors', form.floors)
      if (form.flatsPerFloor) fd.append('flatsPerFloor', form.flatsPerFloor)
      if (form.lifts) fd.append('lifts', form.lifts)
      if (form.parking) fd.append('parking', form.parking)
      if (form.amenities) fd.append('amenities', form.amenities)
      if (form.tagDays) fd.append('tagDays', form.tagDays)
      if (form.connectivity) fd.append('connectivity', form.connectivity)
      fd.append('possession', JSON.stringify(form.possession))
      fd.append('variants', JSON.stringify(form.variants))
      fd.append('cpSlab', JSON.stringify(form.cpSlab))
      files.forEach(f => fd.append('images', f))

      if (isEdit) {
        await projectsApi.update(id, fd)
        toast.success('Project updated!')
        navigate(`/projects/${id}`)
      } else {
        const { data } = await projectsApi.create(fd)
        toast.success('Project created!')
        navigate(`/projects/${data.project._id}`)
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <>
      <TopBar title="Loading..." />
      <div className="page-loading"><div className="spinner" /></div>
    </>
  )

  return (
    <>
      <TopBar
        title={isEdit ? 'Edit Project' : 'Add New Project'}
        subtitle={isEdit ? form.projectName : 'Fill in the project details'}
        actions={
          <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={14} /> Cancel
          </button>
        }
      />

      <div className="page-body">
        <form onSubmit={handleSubmit} className={styles.formLayout}>
          <div className={styles.formCol}>

            {/* Basic Info */}
            <Section title="Basic Information">
              <div className={styles.grid2}>
                <div className="form-group">
                  <label className="form-label">Project Name *</label>
                  <input
                    className="input"
                    value={form.projectName}
                    onChange={e => set('projectName', e.target.value)}
                    placeholder="e.g. Skyline Heights"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Developer Name *</label>
                  <input
                    className="input"
                    value={form.developerName}
                    onChange={e => set('developerName', e.target.value)}
                    placeholder="e.g. Godrej Properties"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Location *</label>
                <input
                  className="input"
                  value={form.location}
                  onChange={e => set('location', e.target.value)}
                  placeholder="e.g. Moshi, Pune"
                  required
                />
              </div>
            </Section>

            {/* Project Details */}
            <Section title="Project Details">
              <div className={styles.grid3}>
                {[
                  { key: 'towers', label: 'Towers', ph: '4' },
                  { key: 'floors', label: 'Floors', ph: '24' },
                  { key: 'flatsPerFloor', label: 'Flats/Floor', ph: '6' },
                  { key: 'lifts', label: 'Lifts', ph: '2' },
                  { key: 'landParcel', label: 'Land Parcel (acres)', ph: '5' },
                  { key: 'tagDays', label: 'Tag Days', ph: '30' },
                ].map(({ key, label, ph }) => (
                  <div key={key} className="form-group">
                    <label className="form-label">{label}</label>
                    <input
                      className="input"
                      type="number"
                      value={form[key]}
                      onChange={e => set(key, e.target.value)}
                      placeholder={ph}
                    />
                  </div>
                ))}
              </div>
              <div className="form-group">
                <label className="form-label">Parking</label>
                <input
                  className="input"
                  value={form.parking}
                  onChange={e => set('parking', e.target.value)}
                  placeholder="e.g. Stilt + Open, 2 per flat"
                />
              </div>
            </Section>

            {/* Variants & Pricing */}
            <Section title="Variants & Pricing">
              {form.variants.map((variant, vi) => (
                <div key={vi} className={styles.variantBlock}>
                  <div className={styles.variantTop}>
                    <select
                      className="input input-sm"
                      style={{ width: 130 }}
                      value={variant.type}
                      onChange={e => updateVariant(vi, 'type', e.target.value)}
                    >
                      {BHK_OPTIONS.map(b => <option key={b}>{b}</option>)}
                    </select>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => addCarpet(vi)}
                    >
                      <Plus size={13} /> Add Size
                    </button>
                    {form.variants.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => removeVariant(vi)}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>

                  <div className={styles.carpetRows}>
                    <div className={styles.carpetHeader}>
                      <span>Carpet Area (sq.ft)</span>
                      <span>Price (₹)</span>
                      <span />
                    </div>
                    {variant.carpet.map((c, ci) => (
                      <div key={ci} className={styles.carpetRow}>
                        <input
                          className="input input-sm"
                          type="number"
                          placeholder="e.g. 650"
                          value={c.area}
                          onChange={e => updateCarpet(vi, ci, 'area', e.target.value)}
                        />
                        <input
                          className="input input-sm"
                          type="number"
                          placeholder="e.g. 6500000"
                          value={c.price}
                          onChange={e => updateCarpet(vi, ci, 'price', e.target.value)}
                        />
                        {variant.carpet.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => removeCarpet(vi, ci)}
                            style={{ color: 'var(--coral)' }}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button
                type="button"
                className={`btn btn-outline btn-sm ${styles.addVariantBtn}`}
                onClick={addVariant}
              >
                <Plus size={14} /> Add Variant
              </button>
            </Section>

            {/* Possession */}
            <Section title="Possession & Commission">
              <div className={styles.grid2}>
                <div className="form-group">
                  <label className="form-label">Possession Month</label>
                  <select
                    className="input"
                    value={form.possession.month}
                    onChange={e => setPossession('month', e.target.value)}
                  >
                    <option value="">Select month</option>
                    {MONTHS.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Possession Year</label>
                  <input
                    className="input"
                    type="number"
                    placeholder="e.g. 2027"
                    value={form.possession.year}
                    onChange={e => setPossession('year', e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.grid2}>
                <div className="form-group">
                  <label className="form-label">Company Share (%)</label>
                  <input
                    className="input"
                    type="number"
                    placeholder="e.g. 2"
                    value={form.cpSlab.companyShare}
                    onChange={e => setCpSlab('companyShare', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Executive Share (%)</label>
                  <input
                    className="input"
                    type="number"
                    placeholder="e.g. 0.5"
                    value={form.cpSlab.executiveShare}
                    onChange={e => setCpSlab('executiveShare', e.target.value)}
                  />
                </div>
              </div>
            </Section>

            {/* Amenities & Connectivity */}
            <Section title="Amenities & Connectivity" defaultOpen={false}>
              <div className="form-group">
                <label className="form-label">Amenities</label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="Swimming Pool, Gym, Clubhouse, Children's Play Area (comma separated)"
                  value={form.amenities}
                  onChange={e => set('amenities', e.target.value)}
                />
                <span className="form-hint">Separate each amenity with a comma</span>
              </div>
              <div className="form-group">
                <label className="form-label">Connectivity</label>
                <textarea
                  className="input"
                  rows={2}
                  placeholder="Near Pune Metro, 5 min to Highway, IT Park adjacent (comma separated)"
                  value={form.connectivity}
                  onChange={e => set('connectivity', e.target.value)}
                />
              </div>
            </Section>

          </div>

          {/* RIGHT STICKY COLUMN */}
          <div className={styles.sideCol}>

            {/* Image Upload */}
            <div className={`card ${styles.uploadCard}`}>
              <h2 className={styles.sectionTitle}>Project Images</h2>

              {/* Existing images */}
              {existingImages.length > 0 && (
                <div className={styles.existingImgs}>
                  {existingImages.map((img, i) => (
                    <div key={i} className={styles.imgThumb}>
                      <img src={img.url} alt="" />
                    </div>
                  ))}
                </div>
              )}

              {/* New previews */}
              {previews.length > 0 && (
                <div className={styles.existingImgs}>
                  {previews.map((src, i) => (
                    <div key={i} className={`${styles.imgThumb} ${styles.newThumb}`}>
                      <img src={src} alt="" />
                      <button
                        type="button"
                        className={styles.removeImg}
                        onClick={() => removeNewFile(i)}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                className={styles.uploadZone}
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon size={28} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
                <span className={styles.uploadText}>
                  {isEdit ? 'Add more images' : 'Click to upload images'}
                </span>
                <span className={styles.uploadSub}>PNG, JPG, WEBP up to 10MB</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFiles}
              />
            </div>

            {/* Submit */}
            <div className={`card ${styles.submitCard}`}>
              <button
                type="submit"
                className="btn btn-primary btn-lg w-full"
                disabled={saving}
              >
                {saving ? (
                  <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: 'white' }} /> Saving…</>
                ) : (
                  <><Check size={17} /> {isEdit ? 'Update Project' : 'Create Project'}</>
                )}
              </button>
              <p className={styles.submitHint}>
                * Required fields must be filled before saving
              </p>
            </div>

          </div>
        </form>
      </div>
    </>
  )
}
