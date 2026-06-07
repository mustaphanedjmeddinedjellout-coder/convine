import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ChevronDown,
    ChevronRight,
    Heart,
    LogIn,
    Menu,
    Search,
    UserRound,
    X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const SAVED_KEY = 'convive-saved-categories';

const navMenus = [
    {
        id: 'cards',
        label: 'Card invitations',
        items: [
            { label: 'Wedding', category: 'Wedding' },
            { label: 'Birthday', category: 'Birthday' },
            { label: 'Dinner', category: 'Dinner' },
            { label: 'Baby', category: 'Baby' },
        ],
    },
    {
        id: 'flyers',
        label: 'Flyer event pages',
        items: [
            { label: 'Launch parties', category: 'Birthday' },
            { label: 'Community events', category: 'Dinner' },
            { label: 'Weekend gatherings', category: 'Wedding' },
        ],
    },
    {
        id: 'greeting',
        label: 'Greeting cards',
        items: [
            { label: 'Thank you notes', category: 'Dinner' },
            { label: 'Holiday greetings', category: 'Birthday' },
            { label: 'Announcements', category: 'Baby' },
        ],
    },
];

const professionalLinks = [
    { label: 'Event planners', href: '/login' },
    { label: 'Venues & caterers', href: '/login' },
    { label: 'Photographers', href: '/login' },
];

function readSaved() {
    try {
        const raw = localStorage.getItem(SAVED_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export default function SiteHeader({
    onSearch,
    onCategorySelect,
    savedItems = [],
    onRemoveSaved,
}) {
    const { user } = useAuth();
    const searchInputRef = useRef(null);

    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [savedOpen, setSavedOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [openMenu, setOpenMenu] = useState(null);

    const accountPath = user
        ? user.role === 'admin'
            ? '/admin'
            : '/dashboard'
        : '/login';

    const closePanels = useCallback(() => {
        setMenuOpen(false);
        setSearchOpen(false);
        setSavedOpen(false);
        setOpenMenu(null);
    }, []);

    const scrollToCategories = useCallback((category) => {
        if (category && onCategorySelect) {
            onCategorySelect(category);
        }
        const el = document.getElementById('categories');
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closePanels();
    }, [closePanels, onCategorySelect]);

    const handleSearch = useCallback(
        (value) => {
            setSearchQuery(value);
            onSearch?.(value);
            if (value.trim()) {
                const el = document.getElementById('categories');
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        },
        [onSearch],
    );

    useEffect(() => {
        if (!menuOpen && !searchOpen && !savedOpen && !openMenu) {
            return undefined;
        }

        const onKeyDown = (event) => {
            if (event.key === 'Escape') {
                closePanels();
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.body.style.overflow = menuOpen || savedOpen || searchOpen ? 'hidden' : '';

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [menuOpen, searchOpen, savedOpen, openMenu, closePanels]);

    useEffect(() => {
        if (searchOpen) {
            searchInputRef.current?.focus();
        }
    }, [searchOpen]);

    useEffect(() => {
        const onPointerDown = (event) => {
            if (!event.target.closest('[data-nav-dropdown]')) {
                setOpenMenu(null);
            }
        };

        document.addEventListener('pointerdown', onPointerDown);
        return () => document.removeEventListener('pointerdown', onPointerDown);
    }, []);

    return (
        <header className="site-header">
            <div className="topbar">
                <div className="mobile-header-actions">
                    <button
                        type="button"
                        className={`nav-icon-btn ${menuOpen ? 'is-active' : ''}`}
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={menuOpen}
                        onClick={() => {
                            setMenuOpen((open) => !open);
                            setSearchOpen(false);
                            setSavedOpen(false);
                        }}
                    >
                        {menuOpen ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
                    </button>
                    <button
                        type="button"
                        className={`nav-icon-btn ${searchOpen ? 'is-active' : ''}`}
                        aria-label="Search"
                        aria-expanded={searchOpen}
                        onClick={() => {
                            setSearchOpen((open) => !open);
                            setMenuOpen(false);
                            setSavedOpen(false);
                        }}
                    >
                        <Search size={21} strokeWidth={1.75} />
                    </button>
                </div>

                <Link to="/" className="convive-logo" aria-label="Convive home" onClick={closePanels}>
                    <span className="convive-script">Convive</span>
                    <span className="convive-submark">MEMORABLE EVENTS</span>
                </Link>

                <div className="desktop-header-actions">
                    <button
                        type="button"
                        className={`nav-icon-btn ${searchOpen ? 'is-active' : ''}`}
                        aria-label="Search"
                        aria-expanded={searchOpen}
                        onClick={() => {
                            setSearchOpen((open) => !open);
                            setMenuOpen(false);
                            setSavedOpen(false);
                        }}
                    >
                        <Search size={21} strokeWidth={1.75} />
                    </button>
                    {user ? (
                        <Link className="auth-button auth-button-warm" to={accountPath}>
                            My account
                        </Link>
                    ) : (
                        <Link className="auth-button auth-button-warm" to="/login">
                            Log in
                        </Link>
                    )}
                </div>

                <div className="mobile-header-actions">
                    <button
                        type="button"
                        className={`nav-icon-btn ${savedOpen ? 'is-active' : ''}`}
                        aria-label="Saved invitations"
                        aria-expanded={savedOpen}
                        onClick={() => {
                            setSavedOpen((open) => !open);
                            setMenuOpen(false);
                            setSearchOpen(false);
                        }}
                    >
                        <Heart
                            size={21}
                            strokeWidth={1.75}
                            className={savedItems.length ? 'nav-heart-filled' : ''}
                        />
                    </button>
                    <Link
                        className="nav-icon-btn"
                        aria-label={user ? 'My account' : 'Sign in'}
                        to={accountPath}
                        onClick={closePanels}
                    >
                        <UserRound size={21} strokeWidth={1.75} />
                    </Link>
                </div>
            </div>

            {searchOpen && (
                <>
                    <button
                        type="button"
                        className="nav-overlay"
                        aria-label="Close search"
                        onClick={() => setSearchOpen(false)}
                    />
                    <div className="search-overlay" role="dialog" aria-label="Search">
                        <button
                            type="button"
                            className="search-overlay-close"
                            aria-label="Close search"
                            onClick={() => setSearchOpen(false)}
                        >
                            <X size={22} strokeWidth={1.75} />
                        </button>
                        <input
                            ref={searchInputRef}
                            className="search-overlay-input"
                            placeholder="Wedding, birthday, dinner..."
                            value={searchQuery}
                            onChange={(event) => handleSearch(event.target.value)}
                        />
                        {searchQuery.trim() ? (
                            <button
                                type="button"
                                className="search-overlay-clear"
                                onClick={() => handleSearch('')}
                            >
                                Clear
                            </button>
                        ) : null}
                    </div>
                </>
            )}

            <nav className="nav-row" aria-label="Main navigation">
                {navMenus.map((menu) => (
                    <div key={menu.id} className="nav-dropdown" data-nav-dropdown>
                        <button
                            type="button"
                            className={`nav-link ${openMenu === menu.id ? 'is-open' : ''}`}
                            aria-expanded={openMenu === menu.id}
                            onClick={() => setOpenMenu((current) => (current === menu.id ? null : menu.id))}
                        >
                            {menu.label}
                            <ChevronDown size={16} className="nav-chevron" />
                        </button>
                        {openMenu === menu.id && (
                            <div className="nav-dropdown-panel">
                                {menu.items.map((item) => (
                                    <button
                                        key={item.label}
                                        type="button"
                                        className="nav-dropdown-item"
                                        onClick={() => scrollToCategories(item.category)}
                                    >
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}

                <button
                    type="button"
                    className="nav-link nav-link-plain"
                    onClick={() => scrollToCategories('Wedding')}
                >
                    Make your own
                </button>

                <div className="nav-divider" aria-hidden="true" />

                <div className="nav-dropdown" data-nav-dropdown>
                    <button
                        type="button"
                        className={`nav-link ${openMenu === 'pros' ? 'is-open' : ''}`}
                        aria-expanded={openMenu === 'pros'}
                        onClick={() => setOpenMenu((current) => (current === 'pros' ? null : 'pros'))}
                    >
                        For professionals
                        <ChevronDown size={16} className="nav-chevron" />
                    </button>
                    {openMenu === 'pros' && (
                        <div className="nav-dropdown-panel">
                            {professionalLinks.map((item) => (
                                <Link
                                    key={item.label}
                                    className="nav-dropdown-item"
                                    to={item.href}
                                    onClick={closePanels}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </nav>

            {menuOpen && (
                <>
                    <button
                        type="button"
                        className="nav-overlay"
                        aria-label="Close menu"
                        onClick={() => setMenuOpen(false)}
                    />
                    <aside className="mobile-drawer" aria-label="Mobile menu">
                        <div className="mobile-drawer-header">
                            <Link to="/" className="convive-script text-[26px]" onClick={() => setMenuOpen(false)}>
                                Convive
                            </Link>
                            <button
                                type="button"
                                className="nav-icon-btn"
                                aria-label="Close menu"
                                onClick={() => setMenuOpen(false)}
                            >
                                <X size={20} strokeWidth={1.75} />
                            </button>
                        </div>

                        <div className="mobile-drawer-body">
                            <button
                                type="button"
                                className="mobile-drawer-create"
                                onClick={() => scrollToCategories('Wedding')}
                            >
                                <span className="mobile-drawer-create-copy">
                                    <span className="mobile-drawer-create-eyebrow">Blank canvas</span>
                                    <span className="mobile-drawer-create-title">Make your own</span>
                                </span>
                                <ChevronRight size={18} strokeWidth={1.75} aria-hidden="true" />
                            </button>

                            {navMenus.map((menu) => (
                                <div key={menu.id} className="mobile-drawer-group">
                                    <p className="drawer-section-title">{menu.label}</p>
                                    {menu.items.map((item) => (
                                        <button
                                            key={item.label}
                                            type="button"
                                            className="mobile-drawer-link"
                                            onClick={() => scrollToCategories(item.category)}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            ))}

                            <div className="mobile-drawer-group">
                                <p className="drawer-section-title">For professionals</p>
                                {professionalLinks.map((item) => (
                                    <Link
                                        key={item.label}
                                        className="mobile-drawer-link"
                                        to={item.href}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="mobile-drawer-footer">
                            <Link
                                className="mobile-drawer-account"
                                to={accountPath}
                                onClick={() => setMenuOpen(false)}
                            >
                                <UserRound size={18} />
                                {user ? 'My account' : 'Sign in'}
                            </Link>
                        </div>
                    </aside>
                </>
            )}

            {savedOpen && (
                <>
                    <button
                        type="button"
                        className="nav-overlay"
                        aria-label="Close saved panel"
                        onClick={() => setSavedOpen(false)}
                    />
                    <aside className="saved-panel" aria-label="Saved invitations">
                        <div className="saved-panel-header">
                            <h2 className="saved-panel-title">Saved</h2>
                            <button
                                type="button"
                                className="nav-icon-btn"
                                aria-label="Close saved panel"
                                onClick={() => setSavedOpen(false)}
                            >
                                <X size={20} strokeWidth={1.75} />
                            </button>
                        </div>

                        {savedItems.length === 0 ? (
                            <div className="saved-panel-empty">
                                <Heart size={28} strokeWidth={1.5} />
                                <p>Hearts you tap on a category land here.</p>
                                {!user && (
                                    <Link className="saved-panel-login" to="/login" onClick={closePanels}>
                                        <LogIn size={16} />
                                        Sign in
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <ul className="saved-panel-list">
                                {savedItems.map((category) => (
                                    <li key={category}>
                                        <button
                                            type="button"
                                            className="saved-panel-item"
                                            onClick={() => scrollToCategories(category)}
                                        >
                                            <span>{category} invitations</span>
                                            <Heart size={16} className="nav-heart-filled" />
                                        </button>
                                        <button
                                            type="button"
                                            className="saved-panel-remove"
                                            aria-label={`Remove ${category} from saved`}
                                            onClick={() => onRemoveSaved?.(category)}
                                        >
                                            <X size={14} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                    </aside>
                </>
            )}
        </header>
    );
}

export { SAVED_KEY, readSaved };
