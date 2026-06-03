<script setup>
import { ref } from 'vue';
import { ChevronDown, ChevronRight, Heart, Menu, Search, UserRound } from '@lucide/vue';
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

const activeCategory = ref('Wedding');
</script>

<template>
    <main class="min-h-screen bg-white text-black">
        <header class="sticky top-0 z-40 border-b border-black/10 bg-white">
            <div class="topbar">
                <div class="mobile-header-actions">
                    <button class="mobile-icon-button" aria-label="Open menu">
                        <Menu :size="25" stroke-width="1.5" />
                    </button>
                    <button class="mobile-icon-button" aria-label="Search">
                        <Search :size="24" stroke-width="1.5" />
                    </button>
                </div>

                <a href="#" class="convive-logo" aria-label="Convive home">
                    <span class="convive-script">Convive</span>
                </a>

                <div class="hidden flex-1 justify-end lg:flex">
                    <label class="search-pill">
                        <Search :size="22" stroke-width="1.6" />
                        <input class="w-full bg-transparent text-[20px] outline-none placeholder:text-black/38" placeholder="Search" />
                    </label>
                </div>

                <div class="desktop-auth flex items-center gap-3">
                    <button class="auth-button auth-button-outline">Log in</button>
                    <button class="auth-button auth-button-fill">Sign up</button>
                </div>

                <div class="mobile-header-actions">
                    <button class="mobile-icon-button" aria-label="Saved invitations">
                        <Heart :size="24" stroke-width="1.5" />
                    </button>
                    <button class="mobile-icon-button" aria-label="Account">
                        <UserRound :size="24" stroke-width="1.5" />
                    </button>
                </div>
            </div>

            <div class="nav-row">
                <button class="nav-link">Card invitations <ChevronDown :size="20" /></button>
                <button class="nav-link">Flyer event pages <ChevronDown :size="20" /></button>
                <button class="nav-link">Greeting cards <ChevronDown :size="20" /></button>
                <button class="nav-link">Make your own</button>
                <div class="h-7 w-px bg-black/14"></div>
                <button class="nav-link">For professionals <ChevronDown :size="20" /></button>
            </div>
        </header>

        <section class="relative overflow-hidden border-b border-black/10 bg-[#e7ded2]">
            <div class="hero-shell">
                <video
                    class="hero-video-backdrop"
                    :src="heroVideo"
                    autoplay
                    muted
                    loop
                    playsinline
                ></video>

                <video
                    class="hero-video"
                    :src="heroVideo"
                    autoplay
                    muted
                    loop
                    playsinline
                ></video>

                <div class="absolute inset-0 bg-white/18"></div>

                <nav class="hero-mobile-tabs" aria-label="Invitation categories">
                    <a href="#categories" class="hero-mobile-tab is-active">Card invitations</a>
                    <a href="#categories" class="hero-mobile-tab">Flyer event pages</a>
                </nav>

                <div class="hero-content">
                    <h1 class="hero-title">
                        Online invitations and cards for all the moments that matter
                    </h1>

                    <a href="#categories" class="hero-cta">
                        Get started
                    </a>
                </div>

                <button class="hero-arrow">
                    <ChevronRight :size="32" stroke-width="1.5" />
                </button>
            </div>
        </section>

        <section id="categories" class="px-5 py-16 lg:px-9">
            <h2 class="text-center text-5xl font-normal tracking-normal">Explore by category</h2>

            <div class="mx-auto mt-10 flex max-w-5xl flex-wrap justify-center gap-3">
                <button
                    v-for="[name] in categories"
                    :key="name"
                    :class="[
                        'rounded-full border px-6 py-3 text-base font-semibold',
                        activeCategory === name ? 'border-black bg-black text-white' : 'border-black/15 bg-white',
                    ]"
                    @click="activeCategory = name"
                >
                    {{ name }}
                </button>
            </div>

            <div class="mx-auto mt-10 grid max-w-7xl gap-5 md:grid-cols-4">
                <article v-for="[name, copy, color] in categories" :key="name" class="group cursor-pointer">
                    <div :style="{ backgroundColor: color }" class="aspect-[4/5] overflow-hidden border border-black/10 p-6">
                        <div class="flex h-full flex-col justify-between bg-white/52 p-5 transition group-hover:-translate-y-1">
                            <p class="text-sm font-bold uppercase tracking-[0.18em]">{{ name }}</p>
                            <div>
                                <h3 class="text-3xl font-normal">{{ name }} invitations</h3>
                                <p class="mt-4 text-base leading-7 text-black/62">{{ copy }}</p>
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        </section>

        <section class="border-y border-black/10 bg-[#f7f7f5] px-5 py-16 lg:px-9">
            <div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
                <div>
                    <p class="text-sm font-bold uppercase tracking-[0.22em] text-black/45">Create and send</p>
                    <h2 class="mt-4 text-5xl font-normal leading-tight">A complete invitation experience, from design to RSVP.</h2>
                </div>

                <div class="grid gap-4 md:grid-cols-3">
                    <article v-for="[title, copy] in products" :key="title" class="border border-black/10 bg-white p-6">
                        <h3 class="text-2xl font-normal">{{ title }}</h3>
                        <p class="mt-4 text-base leading-7 text-black/60">{{ copy }}</p>
                        <button class="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em]">
                            Start <ChevronRight :size="18" />
                        </button>
                    </article>
                </div>
            </div>
        </section>
    </main>
</template>
