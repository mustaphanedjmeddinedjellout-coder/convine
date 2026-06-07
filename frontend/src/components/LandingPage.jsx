import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import SiteHeader, { readSaved, SAVED_KEY } from './SiteHeader.jsx';
import TemplateDemoSection from './TemplateDemoSection.jsx';
import { VELVET_TEMPLATE } from '../lib/templates';
import heroVideo from '../../assets/hero-web-landscape.mp4';

const categories = [
    {
        name: 'Wedding',
        copy: 'Cinematic Velvet invitations with drape openings, date reveals, and RSVP.',
        preview: '#6b0f1a',
        demoPath: VELVET_TEMPLATE.demoPath,
    },
    {
        name: 'Birthday',
        copy: 'Milestones, surprise parties, and group celebrations.',
        preview: '#c8d2d9',
    },
    {
        name: 'Dinner',
        copy: 'Holiday dinners, supper clubs, and seated gatherings.',
        preview: '#d5cdb8',
    },
    {
        name: 'Baby',
        copy: 'Showers, announcements, and first birthdays.',
        preview: '#d4c8cc',
    },
];

const products = [
    {
        title: 'Card invitations',
        copy: 'Cinematic wedding stories with red drape openings, scratch-to-reveal dates, RSVP, and personalized guest links.',
    },
    {
        title: 'Flyer event pages',
        copy: 'Shareable pages for launches, fundraisers, and community events with clear date, time, and location details.',
    },
    {
        title: 'Greeting cards',
        copy: 'Personal notes for holidays, thank-yous, birthdays, and announcements — send directly or by link.',
    },
];

function CategoryPreview({ name, preview }) {
    if (name === 'Wedding') {
        return (
            <div className="category-tile-preview category-tile-preview--wedding">
                <div className="category-tile-preview-ornament" />
                <div className="category-tile-preview-content">
                    <span className="category-tile-preview-title">Amina &amp; Yacine</span>
                    <span className="category-tile-preview-label">Wedding Invitation</span>
                </div>
            </div>
        );
    }
    if (name === 'Birthday') {
        return (
            <div className="category-tile-preview category-tile-preview--birthday">
                <div className="category-tile-preview-confetti" />
                <div className="category-tile-preview-content">
                    <span className="category-tile-preview-title">Soirée d'Anniversaire</span>
                    <span className="category-tile-preview-label">Milestone Birthday</span>
                </div>
            </div>
        );
    }
    if (name === 'Dinner') {
        return (
            <div className="category-tile-preview category-tile-preview--dinner">
                <div className="category-tile-preview-frame" />
                <div className="category-tile-preview-content">
                    <span className="category-tile-preview-title">Rendezvous</span>
                    <span className="category-tile-preview-label">Supper Clubs &amp; Dinners</span>
                </div>
            </div>
        );
    }
    if (name === 'Baby') {
        return (
            <div className="category-tile-preview category-tile-preview--baby">
                <div className="category-tile-preview-star" />
                <div className="category-tile-preview-content">
                    <span className="category-tile-preview-title">Welcome Little One</span>
                    <span className="category-tile-preview-label">Shower &amp; Birth Announcements</span>
                </div>
            </div>
        );
    }
    return (
        <div
            className="category-tile-preview"
            style={{ backgroundColor: preview }}
            aria-hidden="true"
        />
    );
}

export default function LandingPage() {
    const [activeCategory, setActiveCategory] = useState('Wedding');
    const [searchQuery, setSearchQuery] = useState('');
    const [savedItems, setSavedItems] = useState(readSaved);

    const handleCategorySelect = useCallback((category) => {
        setActiveCategory(category);
    }, []);

    const updateSaved = useCallback((category, shouldSave) => {
        setSavedItems((prev) => {
            const next = shouldSave
                ? prev.includes(category)
                    ? prev
                    : [...prev, category]
                : prev.filter((item) => item !== category);
            localStorage.setItem(SAVED_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    const toggleSaved = useCallback(
        (category, event) => {
            event.stopPropagation();
            updateSaved(category, !savedItems.includes(category));
        },
        [savedItems, updateSaved],
    );

    const visibleCategories = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) {
            return categories;
        }

        return categories.filter(
            ({ name, copy }) =>
                name.toLowerCase().includes(query) ||
                copy.toLowerCase().includes(query) ||
                `${name} invitations`.toLowerCase().includes(query),
        );
    }, [searchQuery]);

    return (
        <main className="min-h-screen bg-[#faf7f2] text-[#2c2419]">
            <SiteHeader
                onSearch={setSearchQuery}
                onCategorySelect={handleCategorySelect}
                savedItems={savedItems}
                onRemoveSaved={(category) => updateSaved(category, false)}
            />

            <section className="relative overflow-hidden border-b border-black/10 bg-[#e7ded2]">
                <div className="hero-shell">
                    <video
                        className="hero-video-backdrop"
                        src={heroVideo}
                        autoPlay
                        muted
                        loop
                        playsInline
                    />

                    <video
                        className="hero-video"
                        src={heroVideo}
                        autoPlay
                        muted
                        loop
                        playsInline
                    />

                    <div className="absolute inset-0 bg-white/18"></div>

                    <nav className="hero-mobile-tabs" aria-label="Invitation categories">
                        <a href="#categories" className="hero-mobile-tab is-active">
                            Card invitations
                        </a>
                        <a href="#categories" className="hero-mobile-tab">
                            Flyer event pages
                        </a>
                    </nav>

                    <div className="hero-content">
                        <h1 className="hero-title">
                            Online <em>invitations</em> &amp; <em>cards</em> for the moments that matter
                        </h1>

                        <div className="hero-cta-group">
                            <Link to={VELVET_TEMPLATE.demoPath} className="hero-cta hero-cta--primary">
                                Try live demo
                            </Link>
                            <a href="#categories" className="hero-cta hero-cta--secondary">
                                Get started
                            </a>
                        </div>
                    </div>

                    <button className="hero-arrow">
                        <ChevronRight size={32} strokeWidth={1.5} />
                    </button>
                </div>
            </section>

            <TemplateDemoSection />

            <section id="categories" className="celebrate-section">
                <div className="celebrate-section-inner">
                    <header className="celebrate-header">
                        <h2 className="celebrate-heading">What are you celebrating?</h2>
                        <p className="celebrate-subheading">
                            Select an occasion to view invitation designs.
                        </p>
                    </header>

                    {searchQuery.trim() && visibleCategories.length > 0 ? (
                        <p className="celebrate-search-note">
                            {visibleCategories.length} result{visibleCategories.length === 1 ? '' : 's'} for
                            &ldquo;{searchQuery.trim()}&rdquo;
                        </p>
                    ) : null}

                    <div className="category-grid">
                        {visibleCategories.length === 0 ? (
                            <p className="category-empty">
                                No categories match your search. Try wedding, birthday, dinner, or baby.
                            </p>
                        ) : (
                            visibleCategories.map(({ name, copy, preview, demoPath }) => {
                                const isSaved = savedItems.includes(name);
                                const isActive = activeCategory === name;

                                return (
                                    <article
                                        key={name}
                                        className={`category-tile ${isActive ? 'is-active' : ''}`}
                                        onClick={() => setActiveCategory(name)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter' || event.key === ' ') {
                                                event.preventDefault();
                                                setActiveCategory(name);
                                            }
                                        }}
                                        role="button"
                                        tabIndex={0}
                                        aria-pressed={isActive}
                                    >
                                        <CategoryPreview name={name} preview={preview} />
                                        <div className="category-tile-body">
                                            <h3 className="category-tile-name">{name}</h3>
                                            <p className="category-tile-desc">{copy}</p>
                                            <div className="category-tile-footer">
                                                {demoPath ? (
                                                    <Link
                                                        to={demoPath}
                                                        className="category-tile-action category-tile-action--link"
                                                        onClick={(event) => event.stopPropagation()}
                                                    >
                                                        Try guest demo
                                                    </Link>
                                                ) : (
                                                    <span className="category-tile-action">View designs</span>
                                                )}
                                                <button
                                                    type="button"
                                                    className={`category-tile-save ${isSaved ? 'is-saved' : ''}`}
                                                    aria-pressed={isSaved}
                                                    onClick={(event) => toggleSaved(name, event)}
                                                >
                                                    {isSaved ? 'Saved' : 'Save for later'}
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })
                        )}
                    </div>
                </div>
            </section>

            <section id="products" className="products-section">
                <div className="products-section-inner">
                    <header className="products-header">
                        <h2 className="products-heading">
                            Invitations, event pages, and greeting cards
                        </h2>
                        <p className="products-subheading">
                            Design, send, and track guest responses in one place — from the
                            save-the-date through the final RSVP.
                        </p>
                    </header>

                    <div className="products-grid">
                        {products.map(({ title, copy }) => (
                            <article key={title} className="product-panel">
                                <h3 className="product-panel-title">{title}</h3>
                                <p className="product-panel-copy">{copy}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
