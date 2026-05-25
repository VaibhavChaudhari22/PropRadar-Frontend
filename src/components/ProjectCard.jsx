import { Link } from 'react-router-dom'
import { MapPin, Building2, CalendarCheck, ArrowRight } from 'lucide-react'
import { getPrimaryImage, formatPossession, getPriceRange, bhkColor } from '../utils/helpers'
import styles from './ProjectCard.module.css'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80'

export default function ProjectCard({ project }) {
  const {
    _id,
    projectName,
    developerName,
    location,
    images,
    variants,
    possession,
    towers,
    floors,
  } = project

  const img = getPrimaryImage(images) || PLACEHOLDER
  const priceRange = getPriceRange(variants)
  const bhkTypes = [...new Set(variants?.map(v => v.type) || [])]

  return (
    <Link to={`/projects/${_id}`} className={styles.card}>
      {/* Image */}
      <div className={styles.imageWrap}>
        <img src={img} alt={projectName} className={styles.image} loading="lazy" />
        <div className={styles.imageOverlay} />
        {bhkTypes.length > 0 && (
          <div className={styles.tags}>
            {bhkTypes.slice(0, 3).map(type => (
              <span key={type} className={`badge ${bhkColor(type)}`}>{type}</span>
            ))}
          </div>
        )}
        {priceRange && (
          <div className={styles.price}>{priceRange}</div>
        )}
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div>
          <h3 className={styles.name}>{projectName}</h3>
          <p className={styles.developer}>{developerName}</p>
        </div>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <MapPin size={13} strokeWidth={1.8} />
            {location}
          </span>
          {possession?.year && (
            <span className={styles.metaItem}>
              <CalendarCheck size={13} strokeWidth={1.8} />
              {formatPossession(possession)}
            </span>
          )}
          {(towers || floors) && (
            <span className={styles.metaItem}>
              <Building2 size={13} strokeWidth={1.8} />
              {towers ? `${towers} Towers` : ''}{towers && floors ? ' · ' : ''}{floors ? `${floors} Floors` : ''}
            </span>
          )}
        </div>

        <div className={styles.cta}>
          <span>View Details</span>
          <ArrowRight size={14} strokeWidth={2} />
        </div>
      </div>
    </Link>
  )
}
