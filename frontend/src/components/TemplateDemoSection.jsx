import { Link } from 'react-router-dom';
import { Heart, Pen, Mail, ArrowRight, Sparkles, Flower2, FileText, ShieldCheck } from 'lucide-react';
import { WEDDING_TEMPLATES } from '../lib/templates';
import redBg from '../../assets/red.png';
import pinkBg from '../../assets/pink.png';
import blackBg from '../../assets/black.png';

const BG_MAP = {
    velvet: redBg,
    bloom: pinkBg,
    noir: blackBg,
};

const ACCENT_MAP = {
    velvet: { primary: '#6b0f1a', hover: '#8b1a2b', text: '#fff' },
    bloom: { primary: '#c47b84', hover: '#d4929a', text: '#fff' },
    noir: { primary: '#111115', hover: '#22222a', text: '#e8d5a3' },
};

// Custom elegant drape/curtain icon SVG
const DrapeIcon = ({ size = 14, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M3 3h18M3 3v18h3c1-6 3-8 6-8s5 2 6 8h3V3M12 3v10" />
    </svg>
);

const getFeatureIcon = (featureName) => {
    const name = featureName.toLowerCase();
    if (name.includes('drape') || name.includes('curtain')) return DrapeIcon;
    if (name.includes('bloom') || name.includes('petal') || name.includes('flower')) return Flower2;
    if (name.includes('gold line') || name.includes('foil') || name.includes('sparkle')) return Sparkles;
    if (name.includes('date')) return Pen;
    if (name.includes('letter')) {
        if (name.includes('guest')) return Heart;
        return FileText;
    }
    if (name.includes('rsvp') || name.includes('mail')) return Mail;
    return Heart;
};

function TemplatePreview({ template }) {
    if (template.preview === 'bloom') {
        return (
            <div className="td2-phone-screen td2-phone-screen--bloom">
                <div className="template-preview-bloom__blob template-preview-bloom__blob--1" />
                <div className="template-preview-bloom__blob template-preview-bloom__blob--2" />
                <div className="template-preview-bloom__seal">A&amp;Y</div>
                <div className="template-preview-bloom__names">
                    <span>{template.couple.bride}</span>
                    <em>&amp;</em>
                    <span>{template.couple.groom}</span>
                </div>
            </div>
        );
    }

    if (template.preview === 'noir') {
        return (
            <div className="td2-phone-screen td2-phone-screen--noir">
                <svg className="template-preview-noir__frame" viewBox="0 0 200 320" aria-hidden="true">
                    <rect x="20" y="20" width="160" height="280" fill="none" stroke="#d4af37" strokeWidth="1" />
                    <line x1="100" y1="20" x2="100" y2="80" stroke="#d4af37" strokeWidth="1" />
                    <line x1="40" y1="80" x2="160" y2="80" stroke="#d4af37" strokeWidth="1" />
                </svg>
                <div className="template-preview-noir__names">
                    <span>{template.couple.bride}</span>
                    <span className="template-preview-noir__amp">&amp;</span>
                    <span>{template.couple.groom}</span>
                    <svg className="template-preview-noir__emblem" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#d4af37" strokeWidth="1.5">
                        <polygon points="12 2 22 12 12 22 2 12" />
                        <polygon points="12 6 18 12 12 18 6 12" />
                    </svg>
                </div>
            </div>
        );
    }

    return (
        <div className="td2-phone-screen">
            <div className="template-demo-drape">
                <div className="template-demo-drape-panel template-demo-drape-panel--left" />
                <div className="template-demo-drape-panel template-demo-drape-panel--right" />
                <span className="template-demo-drape-label">Touch to Open</span>
            </div>
            <div className="template-demo-names">
                <span>{template.couple.bride}</span>
                <em>&amp;</em>
                <span>{template.couple.groom}</span>
            </div>
        </div>
    );
}

export default function TemplateDemoSection() {
    return (
        <section id="demo" className="td2-section">
            <div className="td2-header">
                <div className="td2-divider-header">
                    <div className="td2-line-left" />
                    <Heart size={18} strokeWidth={1.5} className="td2-heart-gold" />
                    <div className="td2-line-right" />
                </div>
                <span className="td2-eyebrow">CHOOSE YOUR EXPERIENCE</span>
                <h2 className="td2-title">Three Distinct Experiences</h2>
                <p className="td2-subtitle">
                    Each demo showcases a unique style of luxury wedding stationery.
                </p>
            </div>

            <div className="td2-grid">
                {WEDDING_TEMPLATES.map((template) => {
                    const bg = BG_MAP[template.preview];
                    const accent = ACCENT_MAP[template.preview];

                    return (
                        <article key={template.slug} className={`td2-card td2-card--${template.preview}`}>
                            <div className="td2-card-visual">
                                <img
                                    className="td2-card-bg"
                                    src={bg}
                                    alt=""
                                    aria-hidden="true"
                                    loading="lazy"
                                />
                                <Link to={template.demoPath} className="td2-phone-link" aria-label={`Open ${template.name} guest demo`}>
                                    <div className="td2-phone">
                                        <div className="td2-phone-notch" />
                                        <TemplatePreview template={template} />
                                    </div>
                                </Link>
                            </div>

                            <div className="td2-card-body">
                                <h3 className="td2-card-name">{template.name}</h3>
                                <p className="td2-card-tagline">{template.tagline}</p>
                                <p className="td2-card-desc">
                                    {template.preview === 'velvet'
                                        ? 'A dramatic opening with rich textures and timeless elegance. Perfect for the classic romantic.'
                                        : template.preview === 'bloom'
                                          ? 'Soft florals and watercolor details for a fresh, romantic feel. Perfect for the modern couple.'
                                          : 'Bold, sleek, and sophisticated with golden accents. Perfect for the contemporary couple.'}
                                </p>

                                <ul className="td2-features">
                                    {template.features.map((feature) => {
                                        const Icon = getFeatureIcon(feature);
                                        return (
                                            <li key={feature} className="td2-feature">
                                                <Icon size={14} strokeWidth={1.5} />
                                                <span>{feature}</span>
                                            </li>
                                        );
                                    })}
                                </ul>

                                <Link
                                    to={template.demoPath}
                                    className="td2-cta"
                                    style={{
                                        '--cta-bg': accent.primary,
                                        '--cta-bg-hover': accent.hover,
                                        '--cta-text': accent.text,
                                    }}
                                >
                                    OPEN AS GUEST
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </article>
                    );
                })}
            </div>

            <p className="td2-footnote">
                <ShieldCheck size={16} className="td2-footnote-icon" />
                <span>Each demo opens as <strong>Mohamed</strong>, no account required.</span>
            </p>
        </section>
    );
}
