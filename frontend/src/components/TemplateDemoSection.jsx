import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { WEDDING_TEMPLATES } from '../lib/templates';

function TemplatePreview({ template }) {
    if (template.preview === 'bloom') {
        return (
            <div className="template-demo-phone-screen template-demo-phone-screen--bloom">
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
            <div className="template-demo-phone-screen template-demo-phone-screen--noir">
                <svg className="template-preview-noir__frame" viewBox="0 0 200 320" aria-hidden="true">
                    <rect x="20" y="20" width="160" height="280" fill="none" stroke="#d4af37" strokeWidth="1" />
                    <line x1="100" y1="20" x2="100" y2="80" stroke="#d4af37" strokeWidth="1" />
                    <line x1="40" y1="80" x2="160" y2="80" stroke="#d4af37" strokeWidth="1" />
                </svg>
                <div className="template-preview-noir__names">
                    <span>{template.couple.bride}</span>
                    <span>{template.couple.groom}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="template-demo-phone-screen">
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
        <section id="demo" className="template-demo-section">
            <div className="template-demo-showcase-header">
                <span className="template-demo-badge">
                    <Sparkles size={14} />
                    Live guest demos · No login
                </span>
                <h2 className="template-demo-showcase-title">Choose your story</h2>
                <p className="template-demo-showcase-desc">
                    Three stunning wedding experiences. Open any template as a guest — exactly how it feels on WhatsApp.
                </p>
            </div>

            <div className="template-demo-grid">
                {WEDDING_TEMPLATES.map((template) => (
                    <article key={template.slug} className={`template-demo-card template-demo-card--${template.preview}`}>
                        <Link to={template.demoPath} className="template-demo-preview" aria-label={`Open ${template.name} guest demo`}>
                            <div className="template-demo-phone">
                                <div className="template-demo-phone-notch" />
                                <TemplatePreview template={template} />
                            </div>
                        </Link>

                        <div className="template-demo-card-body">
                            <h3 className="template-demo-card-title">{template.name}</h3>
                            <p className="template-demo-card-tagline">{template.tagline}</p>
                            <ul className="template-demo-features template-demo-features--compact">
                                {template.features.map((feature) => (
                                    <li key={feature}>{feature}</li>
                                ))}
                            </ul>
                            <Link to={template.demoPath} className="template-demo-cta template-demo-cta--card">
                                Open as guest
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </article>
                ))}
            </div>

            <p className="template-demo-note template-demo-note--center">
                Each demo opens as <strong>Mohamed</strong> — no account required.
            </p>
        </section>
    );
}
