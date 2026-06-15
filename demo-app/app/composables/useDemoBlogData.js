// List of blog posts
const blogPosts = [{
    id: 1,
    slug: 'designing-a-vintage-dashboard',
    path: '/blog/designing-a-vintage-dashboard',
    title: 'Designing a vintage dashboard without losing modern usability',
    description: 'How we balanced ornamental styling, dense information, and fast scanning in a dashboard meant for daily work.',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    categorySlug: 'design-systems',
    categoryText: 'Design Systems',
    publishedAt: 'May 29, 2026',
    readTime: '7 min read',
    keyPoints: [
        'Use a limited palette of surfaces so decorative treatments stay intentional.',
        'Reserve high-contrast accents for actions and key metrics.',
        'Let spacing do more work than borders when the page gets dense.'
    ],
    sections: [{
        title: 'Start from hierarchy, not decoration',
        paragraphs: [
            'The fastest way to make a themed interface feel gimmicky is to start by styling every container differently. We had better results when we locked the information hierarchy first and only then layered in type, borders, and background texture.',
            'That approach made the theme transferable. The same layout rules worked in admin screens, marketing pages, and embedded widgets because the vintage details were supporting structure instead of replacing it.'
        ]
    }, {
        title: 'Keep rhythm consistent across cards',
        paragraphs: [
            'Once the main spacing scale was stable, cards could vary in tone without collapsing into visual noise. Titles, body copy, and metadata lines all follow the same vertical rhythm, which makes mixed card grids much easier to scan.',
            'The result is a page that feels expressive at first glance and predictable after a few seconds of use. That second part is what keeps the design usable in products people open every day.'
        ]
    }]
}, {
    id: 2,
    slug: 'shipping-a-component-library-in-public',
    path: '/blog/shipping-a-component-library-in-public',
    title: 'Shipping a component library in public',
    description: 'A practical look at packaging, versioning, and demo surfaces when a design system becomes a shared product asset.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    categorySlug: 'product-updates',
    categoryText: 'Product Updates',
    publishedAt: 'May 18, 2026',
    readTime: '5 min read',
    keyPoints: [
        'Treat the demo app as a consumer, not a hidden playground.',
        'Exports and documentation drift unless they are validated together.',
        'Every public component needs a realistic showcase route.'
    ],
    sections: [{
        title: 'A library needs a real proving ground',
        paragraphs: [
            'The demo app became much more useful once we stopped filling it with isolated widgets and started composing real screens. It exposed gaps in naming, props, and spacing decisions that were invisible in one-off stories.',
            'That same pressure also improved the package boundary. If a demo route felt awkward to build, another project would feel the same friction later.'
        ]
    }, {
        title: 'Versioning follows clarity',
        paragraphs: [
            'Version numbers are only meaningful when consumers know what changed. We now pair every notable addition with an explicit demo route or section that makes the new surface easy to verify manually.',
            'That keeps releases grounded in visible outcomes instead of abstract internal changes.'
        ]
    }]
}, {
    id: 3,
    slug: 'writing-empty-states-that-guide-action',
    path: '/blog/writing-empty-states-that-guide-action',
    title: 'Writing empty states that guide action',
    description: 'Copy patterns for empty screens that reduce hesitation and move people toward the next useful step.',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    categorySlug: 'content-design',
    categoryText: 'Content Design',
    publishedAt: 'May 9, 2026',
    readTime: '6 min read',
    keyPoints: [
        'Name the missing object before describing the action.',
        'Support the primary CTA with one line of context, not a paragraph.',
        'Match the tone of the surrounding product, especially in B2B tools.'
    ],
    sections: [{
        title: 'A good empty state removes ambiguity',
        paragraphs: [
            'People often understand that a page is empty before they understand why. The first line should resolve that ambiguity immediately by naming what is missing and what the screen is for.',
            'After that, the call to action should feel inevitable. Extra explanation usually means the primary path is still unclear.'
        ]
    }, {
        title: 'Restraint beats cleverness',
        paragraphs: [
            'We avoid witty copy in operational views because it ages badly and slows scanning. A calm sentence, a useful button, and a compact illustration are enough for most product surfaces.',
            'That restraint also makes themed interfaces feel more mature. Ornamental visuals can carry personality without forcing the copy to do the same.'
        ]
    }]
}, {
    id: 4,
    slug: 'from-marketing-cards-to-product-cards',
    path: '/blog/from-marketing-cards-to-product-cards',
    title: 'From marketing cards to product cards',
    description: 'What changes when the same visual card pattern moves from a landing page into a logged-in workflow.',
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80',
    categorySlug: 'engineering-culture',
    categoryText: 'Engineering Culture',
    publishedAt: 'April 30, 2026',
    readTime: '4 min read',
    keyPoints: [
        'Interaction density matters more than visual novelty inside products.',
        'Card components should expose structure, not just appearance.',
        'The same surface can serve content and workflows when the slots are disciplined.'
    ],
    sections: [{
        title: 'Context changes the job of a card',
        paragraphs: [
            'A marketing card can afford to be a little theatrical because it is often read in isolation. A product card lives next to dozens of other elements and needs to cooperate with tables, filters, and secondary actions.',
            'That difference pushed us to make the shared card patterns more explicit about spacing, headers, and footers instead of treating them as one-off compositions.'
        ]
    }, {
        title: 'Consistency speeds teams up',
        paragraphs: [
            'Once the component exposes the right structure, designers and developers stop debating small layout choices in every feature branch. They can focus on the content and state logic instead.',
            'That shift is usually where a library starts paying back its maintenance cost.'
        ]
    }]
}, {
    id: 5,
    slug: 'launch-notes-for-the-blog-migration',
    path: '/blog/launch-notes-for-the-blog-migration',
    title: 'Launch notes for the blog migration',
    description: 'What moved into the shared library, what stayed app-specific, and which follow-up tasks are still worth doing.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    categorySlug: 'product-updates',
    categoryText: 'Product Updates',
    publishedAt: 'April 21, 2026',
    readTime: '5 min read',
    keyPoints: [
        'Reusable layout pieces moved first, content rendering stayed app-specific.',
        'Shared i18n keys reduce duplication across projects.',
        'A demo route should verify navigation, not just visuals.'
    ],
    sections: [{
        title: 'Separate reusable chrome from content plumbing',
        paragraphs: [
            'The migration worked because we moved the page shells, cards, and lists first. Content querying, markdown rendering, and SEO helpers still belong to the application using the library.',
            'That split keeps the component layer portable while leaving room for projects to fetch and shape content differently.'
        ]
    }, {
        title: 'Static demo data is still useful',
        paragraphs: [
            'For a component library, fixed data is enough to prove layout, responsiveness, and navigation. You do not need a full CMS pipeline to validate whether the surface is reusable.',
            'That is why this demo area focuses on curated objects instead of runtime content modules.'
        ]
    }]
}, {
    id: 6,
    slug: 'using-motion-with-editorial-restraint',
    path: '/blog/using-motion-with-editorial-restraint',
    title: 'Using motion with editorial restraint',
    description: 'Small transitions can add atmosphere to article grids and carousels without making reading feel unstable.',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
    categorySlug: 'design-systems',
    categoryText: 'Design Systems',
    publishedAt: 'April 12, 2026',
    readTime: '6 min read',
    keyPoints: [
        'Motion should reinforce direction and hierarchy.',
        'Editorial layouts need calmer timing than promotional banners.',
        'Hover states matter less than page-load rhythm on content surfaces.'
    ],
    sections: [{
        title: 'Subtle motion still communicates',
        paragraphs: [
            'The carousel transitions in this demo are intentionally soft. They create continuity between stories without pulling attention away from headlines and summaries.',
            'That same principle applies to cards: a small lift or image zoom is usually enough to signal interactivity.'
        ]
    }, {
        title: 'Reduce noise where reading dominates',
        paragraphs: [
            'Content-heavy screens benefit from fewer simultaneous animations. When everything moves, nothing feels important and the page starts to look unstable.',
            'We keep motion focused around entry points and major state changes so it supports reading instead of competing with it.'
        ]
    }]
}, {
    id: 7,
    slug: 'category-architecture-for-growing-blogs',
    path: '/blog/category-architecture-for-growing-blogs',
    title: 'Category architecture for growing blogs',
    description: 'A lightweight strategy for keeping categories useful when a content library expands beyond a handful of themes.',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    categorySlug: 'content-design',
    categoryText: 'Content Design',
    publishedAt: 'April 4, 2026',
    readTime: '8 min read',
    keyPoints: [
        'Category names should stay stable across product and marketing content.',
        'Counts are helpful when they support browsing, not vanity metrics.',
        'Featured imagery can make taxonomy screens feel less abstract.'
    ],
    sections: [{
        title: 'Taxonomy is part of the experience',
        paragraphs: [
            'Once a blog grows, categories stop being metadata and start shaping how readers discover material. That means naming, counts, and visual grouping all deserve product-level attention.',
            'A thin category layer is usually enough. You only need more structure when readers cannot predict where a topic belongs.'
        ]
    }, {
        title: 'Show enough context to encourage exploration',
        paragraphs: [
            'We like category cards that include a count and a representative image because they make browsing feel concrete. Readers can tell whether a topic is substantial before committing to a click.',
            'That is especially useful in library demos, where categories also help explain how a set of components hangs together.'
        ]
    }]
}, {
    id: 8,
    slug: 'editorial-patterns-for-release-notes',
    path: '/blog/editorial-patterns-for-release-notes',
    title: 'Editorial patterns for release notes',
    description: 'A repeatable structure for release notes that are concise enough for busy users but detailed enough for maintainers.',
    image: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1200&q=80',
    categorySlug: 'product-updates',
    categoryText: 'Product Updates',
    publishedAt: 'March 28, 2026',
    readTime: '5 min read',
    keyPoints: [
        'Lead with user-visible changes, not implementation details.',
        'Group related improvements into themes instead of long bullet dumps.',
        'Use links to deeper docs only where they unlock action.'
    ],
    sections: [{
        title: 'Readers want signal first',
        paragraphs: [
            'Release notes work best when they answer three questions quickly: what changed, who should care, and whether any action is required. Anything beyond that can sit lower on the page.',
            'That framing also maps cleanly to reusable components like feature cards and section titles.'
        ]
    }, {
        title: 'Structure reduces maintenance cost',
        paragraphs: [
            'A consistent template makes it easier for different contributors to publish updates without inventing a page from scratch each time. It also makes demos and archive pages more coherent.',
            'The same thinking applies to UI libraries: consistent structure pays for itself every time a new page is assembled.'
        ]
    }]
}, {
    id: 9,
    slug: 'building-cross-functional-ui-review-loops',
    path: '/blog/building-cross-functional-ui-review-loops',
    title: 'Building cross-functional UI review loops',
    description: 'Why design review gets sharper when product, design, and engineering evaluate reusable surfaces together.',
    image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80',
    categorySlug: 'engineering-culture',
    categoryText: 'Engineering Culture',
    publishedAt: 'March 18, 2026',
    readTime: '7 min read',
    keyPoints: [
        'Shared demo pages expose assumptions faster than isolated screenshots.',
        'Review reusable patterns in realistic compositions.',
        'A small library evolves better when every discipline can critique the same artifact.'
    ],
    sections: [{
        title: 'Shared artifacts produce better feedback',
        paragraphs: [
            'When review happens on a realistic page instead of a loose screenshot, teams talk about the same spacing, wording, and interaction details. That narrows ambiguity and makes feedback more actionable.',
            'A blog demo is a good example because it mixes hierarchy, navigation, cards, and dense reading content in one place.'
        ]
    }, {
        title: 'Libraries need product pressure',
        paragraphs: [
            'Reusable components improve faster when they are exercised in compositions that feel close to shipping product. That is how layout gaps, inflexible props, and awkward defaults reveal themselves.',
            'This demo area exists for exactly that reason: it keeps the library honest.'
        ]
    }]
}];

// List of category descriptions
const categoryDescriptions = {
    'design-systems': 'Patterns for layout, motion, spacing, and reusable surfaces.',
    'product-updates': 'Release notes, migration summaries, and packaging decisions.',
    'content-design': 'Editorial structure, categorization, and interface copy patterns.',
    'engineering-culture': 'Workflow decisions, review loops, and team-facing implementation practices.'
};

// Return the fixed pagination size used by the blog listing demo.
export const useBlogPostsPerPage = () => 6;

// Return the full static blog dataset used across the demo routes.
export const useBlogDemoPosts = () => blogPosts;

// Build the category list from the post dataset with counts and cover images.
export const useBlogCategories = () => Object.values(blogPosts.reduce((accumulator, post) => {
    const existingCategory = accumulator[post.categorySlug];

    if (existingCategory) {
        existingCategory.count += 1;
        return accumulator;
    }

    accumulator[post.categorySlug] = {
        name: post.categoryText,
        slug: post.categorySlug,
        count: 1,
        image: post.image,
        description: categoryDescriptions[post.categorySlug] || 'Curated notes from the UI Vintage demo blog.'
    };

    return accumulator;
}, {}));

// Return the subset of posts highlighted in the homepage carousel.
export const useFeaturedBlogPosts = () => blogPosts.slice(0, 4);

// Find a single category by its slug.
export const getBlogCategory = slug => {
    return useBlogCategories().find(category => category.slug === slug);
};

// Find a single post by its slug.
export const getBlogPost = slug => {
    return blogPosts.find(post => post.slug === slug);
};

// Return every post that belongs to a given category.
export const getPostsByCategory = slug => {
    return blogPosts.filter(post => post.categorySlug === slug);
};

// Return related posts by prioritizing items from the same category.
export const getRelatedPosts = (slug, count = 3) => {
    const activePost = getBlogPost(slug);

    if (!activePost) {
        return [];
    }

    const sameCategory = blogPosts.filter(post => post.slug !== slug && post.categorySlug === activePost.categorySlug);
    const remainingPosts = blogPosts.filter(post => post.slug !== slug && post.categorySlug !== activePost.categorySlug);

    return [...sameCategory, ...remainingPosts].slice(0, count);
};

// Return a limited set of categories excluding the active one.
export const getRelatedCategories = (categorySlug, count = 2) => {
    return useBlogCategories().filter(category => category.slug !== categorySlug).slice(0, count);
};