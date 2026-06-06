import { useCallback, useMemo, useState } from 'react';
import { ChevronRight, Heart } from 'lucide-react';
import SiteHeader, { readSaved, SAVED_KEY } from './SiteHeader.jsx';
import heroVideo from '../../assets/hero-web-landscape.mp4';

const categories = [
    ['Wedding', 'Save the dates, invitations, and weekend details', '#e8d7c8'],
    ['Birthday', 'Milestones, surprise parties, and casual hangs', '#d8e5ef'],
    ['Dinner', 'Supper clubs, holidays, and intimate tables', '#ece2bf'],
    ['Baby', 'Showers, announcements, and first birthdays', '#e6d9df'],
];

const products = [
    ['Card invitations', 'Polished digital cards with envelopes, liners, and RSVP tracking.'],
    ['Flyer event pages', 'Fast visual pages for launches, parties, and community events.'],
    ['Greeting cards', 'Personal notes for holidays, thanks, birthdays, and announcements.'],
];

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
            ([name, copy]) =>
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
                            Online invitations and cards for all the moments that matter
                        </h1>

                        <a href="#categories" className="hero-cta">
                            Get started
                        </a>
                    </div>

                    <button className="hero-arrow">
                        <ChevronRight size={32} strokeWidth={1.5} />
                    </button>
                </div>
            </section>

            <section id="categories" className="px-5 py-16 lg:px-9">
                <h2 className="section-title text-center">What are you celebrating?</h2>

                {searchQuery.trim() && visibleCategories.length > 0 ? (
                    <p className="mx-auto mt-5 max-w-2xl text-center text-[#6b5d4d]">
                        {visibleCategories.length} match{visibleCategories.length === 1 ? 'es' : ''} for
                        &ldquo;{searchQuery.trim()}&rdquo;
                    </p>
                ) : null}

                <div className="mx-auto mt-10 flex max-w-5xl flex-wrap justify-center gap-3">
                    {categories.map(([name]) => (
                        <button
                            key={name}
                            type="button"
                            className={`category-chip ${activeCategory === name ? 'is-active' : ''}`}
                            onClick={() => setActiveCategory(name)}
                        >
                            {name}
                        </button>
                    ))}
                </div>

                <div className="mx-auto mt-10 grid max-w-7xl gap-5 md:grid-cols-4">
                    {visibleCategories.length === 0 ? (
                        <p className="col-span-full py-12 text-center text-[#6b5d4d]">
                            No categories match your search. Try wedding, birthday, dinner, or baby.
                        </p>
                    ) : (
                        visibleCategories.map(([name, copy, color]) => (
                            <article
                                key={name}
                                className="category-card group"
                                onClick={() => setActiveCategory(name)}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        setActiveCategory(name);
                                    }
                                }}
                                role="button"
                                tabIndex={0}
                            >
                                <div style={{ backgroundColor: color }} className="category-card-surface">
                                    <button
                                        type="button"
                                        className={`category-save-btn ${savedItems.includes(name) ? 'is-saved' : ''}`}
                                        aria-label={
                                            savedItems.includes(name)
                                                ? `Remove ${name} from saved`
                                                : `Save ${name} invitations`
                                        }
                                        onClick={(event) => toggleSaved(name, event)}
                                    >
                                        <Heart size={18} strokeWidth={1.75} />
                                    </button>
                                    <div className="category-card-inner">
                                        <div>
                                            <h3 className="category-card-title">{name}</h3>
                                            <p className="category-card-copy">{copy}</p>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </section>

            <section id="products" className="border-y border-[#e8dfd3] bg-[#f3ede4] px-5 py-16 lg:px-9">
                <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
                    <div>
                        <h2 className="section-title leading-tight">
                            From the first save-the-date to the last RSVP.
                        </h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        {products.map(([title, copy]) => (
                            <article key={title} className="border border-black/10 bg-white p-6">
                                <h3 className="text-2xl font-normal">{title}</h3>
                                <p className="mt-4 text-base leading-7 text-black/60">{copy}</p>
                                <button type="button" className="text-link mt-8">
                                    Start <ChevronRight size={18} />
                                </button>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
