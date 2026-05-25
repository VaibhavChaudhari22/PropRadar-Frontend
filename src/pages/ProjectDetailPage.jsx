import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, MapPin, Building2, Layers, Users, Car,
  CalendarCheck, Wifi, Star, Pencil, Trash2, ChevronLeft,
  ChevronRight, Home, Phone, Share2, Zap
} from 'lucide-react'
import TopBar from '../components/TopBar'
import ProjectCard from '../components/ProjectCard'
import { projectsApi } from '../utils/api'
import { formatPrice, formatPossession, formatArea, bhkColor } from '../utils/helpers'
import toast from 'react-hot-toast'
import styles from './ProjectDetailPage.module.css'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    setLoading(true)
    try {
      const { data } = await projectsApi.getSingle(id)
      setProject(data.project)
      setRelated(data.relatedProjects || [])
      setActiveImg(0)
    } catch (err) {
      toast.error(err.message)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return
    setDeleting(true)
    try {
      await projectsApi.delete(id)
      toast.success('Project deleted')
      navigate('/')
    } catch (err) {
      toast.error(err.message)
      setDeleting(false)
    }
  }

  const images = project?.images?.length > 0
    ? project.images
    : [{ url: PLACEHOLDER }]

  const prevImg = () => setActiveImg(i => (i - 1 + images.length) % images.length)
  const nextImg = () => setActiveImg(i => (i + 1) % images.length)

  if (loading) return (
    <>
      <TopBar title="Project Details" />
      <div className="page-loading"><div className="spinner" /></div>
    </>
  )
  if (!project) return null

  const {
    projectName, developerName, location, landParcel, towers,
    floors, flatsPerFloor, lifts, parking, amenities, possession,
    variants, cpSlab, tagDays, connectivity
  } = project

  return (
    <>
      <TopBar
        title={projectName}
        subtitle={developerName}
        actions={
          <div className="flex gap-2">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={14} /> Back
            </button>
            <Link to={`/projects/${id}/edit`} className="btn btn-outline btn-sm">
              <Pencil size={14} /> Edit
            </Link>
            <button
              className="btn btn-danger btn-sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 size={14} />
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        }
      />

      <div className="page-body fade-up">
        <div className={styles.layout}>

          {/* LEFT COLUMN */}
          <div className={styles.left}>

            {/* Gallery */}
            <div className={`card ${styles.gallery}`}>
              <div className={styles.mainImg}>
                <img src={images[activeImg]?.url} alt={projectName} />
                {images.length > 1 && (
                  <>
                    <button className={`${styles.imgNav} ${styles.imgNavLeft}`} onClick={prevImg}>
                      <ChevronLeft size={18} />
                    </button>
                    <button className={`${styles.imgNav} ${styles.imgNavRight}`} onClick={nextImg}>
                      <ChevronRight size={18} />
                    </button>
                    <div className={styles.imgCount}>
                      {activeImg + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className={styles.thumbs}>
                  {images.map((img, i) => (
                    <button
                      key={i}
                      className={`${styles.thumb} ${i === activeImg ? styles.thumbActive : ''}`}
                      onClick={() => setActiveImg(i)}
                    >
                      <img src={img.url} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick stats */}
            <div className={styles.statsGrid}>
              {[
                { icon: Building2, label: 'Towers', value: towers || '—' },
                { icon: Layers, label: 'Floors', value: floors || '—' },
                { icon: Home, label: 'Flats/Floor', value: flatsPerFloor || '—' },
                { icon: Zap, label: 'Lifts', value: lifts || '—' },
                { icon: Car, label: 'Parking', value: parking || '—' },
                { icon: Users, label: 'Land Parcel', value: landParcel ? `${landParcel} acres` : '—' },
                { icon: CalendarCheck, label: 'Possession', value: formatPossession(possession) },
                { icon: Star, label: 'Tag Days', value: tagDays ? `${tagDays} days` : '—' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className={styles.statCard}>
                  <Icon size={16} strokeWidth={1.8} className={styles.statIcon} />
                  <div className={styles.statLabel}>{label}</div>
                  <div className={styles.statValue}>{value}</div>
                </div>
              ))}
            </div>

            {/* Amenities */}
            {amenities?.length > 0 && (
              <div className={`card ${styles.section}`}>
                <h2 className={styles.sectionTitle}>Amenities</h2>
                <div className={styles.tagsList}>
                  {amenities.map(a => (
                    <span key={a} className="badge badge-neutral" style={{ padding: '5px 12px', fontSize: '13px' }}>{a}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Connectivity */}
            {connectivity?.length > 0 && (
              <div className={`card ${styles.section}`}>
                <h2 className={styles.sectionTitle}>
                  <Wifi size={16} strokeWidth={1.8} style={{ display: 'inline', marginRight: 8 }} />
                  Connectivity
                </h2>
                <div className={styles.tagsList}>
                  {connectivity.map(c => (
                    <span key={c} className="badge badge-teal" style={{ padding: '5px 12px', fontSize: '13px' }}>{c}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className={styles.right}>

            {/* Project header card */}
            <div className={`card ${styles.headerCard}`}>
              <div className={styles.headerTop}>
                <div>
                  <h1 className={styles.projName}>{projectName}</h1>
                  <div className={styles.projDev}>{developerName}</div>
                  <div className={styles.projLocation}>
                    <MapPin size={14} strokeWidth={1.8} />
                    {location}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap" style={{ marginTop: 16 }}>
                {variants?.map(v => (
                  <span key={v.type} className={`badge ${bhkColor(v.type)}`}>{v.type}</span>
                ))}
              </div>
              <div className={styles.actions}>
                <button className="btn btn-primary w-full">
                  <Phone size={15} /> Share with Client
                </button>
                <button className="btn btn-outline" style={{ flex: '0 0 auto' }}>
                  <Share2 size={15} />
                </button>
              </div>
            </div>

            {/* Variants / Pricing */}
            {variants?.length > 0 && (
              <div className={`card ${styles.section}`}>
                <h2 className={styles.sectionTitle}>Pricing & Variants</h2>
                <div className={styles.variantsList}>
                  {variants.map(v => (
                    <div key={v.type} className={styles.variantItem}>
                      <div className={styles.variantHeader}>
                        <span className={`badge ${bhkColor(v.type)}`}>{v.type}</span>
                      </div>
                      {v.carpet?.length > 0 && (
                        <div className={styles.carpetList}>
                          {v.carpet.map((c, i) => (
                            <div key={i} className={styles.carpetRow}>
                              <span className={styles.carpetArea}>{formatArea(c.area)}</span>
                              <span className={styles.carpetPrice}>{formatPrice(c.price)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CP Slab */}
            {cpSlab && (cpSlab.companyShare || cpSlab.executiveShare) && (
              <div className={`card ${styles.section}`}>
                <h2 className={styles.sectionTitle}>CP Slab</h2>
                <div className={styles.cpGrid}>
                  <div className={styles.cpCard}>
                    <div className={styles.cpLabel}>Company Share</div>
                    <div className={styles.cpValue}>{cpSlab.companyShare}%</div>
                  </div>
                  <div className={styles.cpCard}>
                    <div className={styles.cpLabel}>Executive Share</div>
                    <div className={styles.cpValue}>{cpSlab.executiveShare}%</div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Related Projects */}
        {related.length > 0 && (
          <div className={styles.related}>
            <h2 className={styles.relatedTitle}>Other projects in {location}</h2>
            <div className={styles.relatedGrid}>
              {related.map(p => (
                <ProjectCard key={p._id} project={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
