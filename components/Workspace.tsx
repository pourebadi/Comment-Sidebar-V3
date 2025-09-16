import React, { useState, useMemo } from 'react';
import type { Theme } from '../App';
import type { CommentType } from '../types';
import * as Icons from './icons';
import { Comment, EmojiPicker, Tooltip, CommentActionsMenu } from './Comment';

// --- Reusable Components for Showcase ---

const Showcase: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="mb-12">
        <h2 className="text-2xl font-bold border-b border-border pb-2 mb-1">{title}</h2>
        <p className="text-muted-foreground mb-6">{description}</p>
        <div className="border border-dashed border-border rounded-lg p-6 bg-muted/20">
            {children}
        </div>
    </div>
);

const ThemeToggleButton: React.FC<{ theme: Theme; toggleTheme: () => void }> = ({ theme, toggleTheme }) => (
    <button
        onClick={toggleTheme}
        className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
        {theme === 'light' ? <Icons.DarkModeIcon className="!text-[20px]" /> : <Icons.LightModeIcon className="!text-[20px]" />}
    </button>
);

// --- FOUNDATION COMPONENTS ---

const ColorPalette: React.FC = () => {
    const colorScales = {
        Gray: [
            { name: 'gray-1', light: '#F8F9FA', dark: '#161616' },
            { name: 'gray-2', light: '#F1F3F5', dark: '#1C1C1C' },
            { name: 'gray-3', light: '#E9ECEF', dark: '#232323' },
            { name: 'gray-4', light: '#DEE2E6', dark: '#2B2B2B' },
            { name: 'gray-5', light: '#CED4DA', dark: '#343434' },
            { name: 'gray-6', light: '#ADB5BD', dark: '#404040' },
            { name: 'gray-7', light: '#868E96', dark: '#4E4E4E' },
            { name: 'gray-8', light: '#495057', dark: '#626262' },
            { name: 'gray-9', light: '#343A40', dark: '#7C7C7C' },
            { name: 'gray-10', light: '#212529', dark: '#909090' },
            { name: 'gray-11', light: '#111213', dark: '#B5B5B5' },
            { name: 'gray-12', light: '#000000', dark: '#F1F1F1' },
        ],
        Blue: [
            { name: 'blue-1', light: '#E7F5FF', dark: '#0C1D36' },
            { name: 'blue-2', light: '#D0EBFF', dark: '#11254A' },
            { name: 'blue-3', light: '#A5D8FF', dark: '#142F62' },
            { name: 'blue-4', light: '#74C0FC', dark: '#183C7D' },
            { name: 'blue-5', light: '#4DABF7', dark: '#1C4A99' },
            { name: 'blue-6', light: '#339AF0', dark: '#2159B9' },
            { name: 'blue-7', light: '#228BE6', dark: '#2568D7' },
            { name: 'blue-8', light: '#1C7ED6', dark: '#2F7CEC' },
            { name: 'blue-9', light: '#1971C2', dark: '#4D95F3' },
            { name: 'blue-10', light: '#1864AB', dark: '#70B0F6' },
            { name: 'blue-11', light: '#105491', dark: '#C2E1FF' },
            { name: 'blue-12', light: '#0B4C80', dark: '#EAF6FF' },
        ],
        Green: [
            { name: 'green-1', light: '#E6FCF0', dark: '#0B201A' },
            { name: 'green-2', light: '#C3FAE8', dark: '#0F2C23' },
            { name: 'green-3', light: '#96F2D7', dark: '#133A2F' },
            { name: 'green-4', light: '#63E6BE', dark: '#164A3B' },
            { name: 'green-5', light: '#38D9A9', dark: '#195C48' },
            { name: 'green-6', light: '#20C997', dark: '#1D6F56' },
            { name: 'green-7', light: '#12B886', dark: '#208364' },
            { name: 'green-8', light: '#0CA678', dark: '#279F76' },
            { name: 'green-9', light: '#099268', dark: '#36B88A' },
            { name: 'green-10', light: '#087F5B', dark: '#50D1A3' },
            { name: 'green-11', light: '#066347', dark: '#9EF0D0' },
            { name: 'green-12', light: '#04583E', dark: '#DBF9EE' },
        ],
        Red: [
            { name: 'red-1', light: '#FFF5F5', dark: '#2B0F13' },
            { name: 'red-2', light: '#FFE3E3', dark: '#3C1318' },
            { name: 'red-3', light: '#FFC9C9', dark: '#4B181D' },
            { name: 'red-4', light: '#FFA8A8', dark: '#5C1B22' },
            { name: 'red-5', light: '#FF8787', dark: '#701E27' },
            { name: 'red-6', light: '#FF6B6B', dark: '#88212C' },
            { name: 'red-7', light: '#FA5252', dark: '#A42533' },
            { name: 'red-8', light: '#F03E3E', dark: '#C5283A' },
            { name: 'red-9', light: '#E03131', dark: '#E13D4D' },
            { name: 'red-10', light: '#C92A2A', dark: '#F56573' },
            { name: 'red-11', light: '#A42020', dark: '#FFB6BC' },
            { name: 'red-12', light: '#901C1C', dark: '#FFE9EB' },
        ],
        Violet: [
            { name: 'violet-1', light: '#F3F0FF', dark: '#1A1138' },
            { name: 'violet-2', light: '#E5DBFF', dark: '#22174F' },
            { name: 'violet-3', light: '#D0BFFF', dark: '#2C1D68' },
            { name: 'violet-4', light: '#B197FC', dark: '#362484' },
            { name: 'violet-5', light: '#9775FA', dark: '#412CA1' },
            { name: 'violet-6', light: '#845EF7', dark: '#4D33C1' },
            { name: 'violet-7', light: '#7950F2', dark: '#5939E4' },
            { name: 'violet-8', light: '#7048E8', dark: '#6543F5' },
            { name: 'violet-9', light: '#6741D9', dark: '#7C5FF8' },
            { name: 'violet-10', light: '#5F3DC4', dark: '#9B7FFB' },
            { name: 'violet-11', light: '#4F30A8', dark: '#D4C6FF' },
            { name: 'violet-12', light: '#452A96', dark: '#F0EBFF' },
        ],
        Yellow: [
            { name: 'yellow-1', light: '#FFF9DB', dark: '#211B00' },
            { name: 'yellow-2', light: '#FFF3BF', dark: '#2D2500' },
            { name: 'yellow-3', light: '#FFEC99', dark: '#3B3000' },
            { name: 'yellow-4', light: '#FFE066', dark: '#4A3C00' },
            { name: 'yellow-5', light: '#FFD43B', dark: '#5A4A00' },
            { name: 'yellow-6', light: '#FCC419', dark: '#6D5900' },
            { name: 'yellow-7', light: '#FAB005', dark: '#826A00' },
            { name: 'yellow-8', light: '#F59F00', dark: '#9F8000' },
            { name: 'yellow-9', light: '#F08C00', dark: '#B99100' },
            { name: 'yellow-10', light: '#E67700', dark: '#D7A609' },
            { name: 'yellow-11', light: '#CB6A00', dark: '#FBE273' },
            { name: 'yellow-12', light: '#B66000', dark: '#FFF3B3' },
        ],
    };

    const familyNames = Object.keys(colorScales);
    const [activeFamily, setActiveFamily] = useState(familyNames[0]);

    const activeColors = colorScales[activeFamily as keyof typeof colorScales];

    return (
        <div className="-m-6">
            <div className="border-b border-border px-4 flex items-center gap-2 overflow-x-auto">
                 {familyNames.map(name => (
                    <button
                        key={name}
                        onClick={() => setActiveFamily(name)}
                        className={`px-3 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors flex-shrink-0 ${
                            activeFamily === name
                                ? 'border-primary text-foreground'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                        role="tab"
                        aria-selected={activeFamily === name}
                    >
                        {name}
                    </button>
                ))}
            </div>
            <div role="tabpanel">
                <table className="w-full text-sm border-collapse">
                    <thead className="border-b border-border">
                        <tr>
                            <th className="text-left font-semibold p-4 w-1/3">Name</th>
                            <th className="text-left font-semibold p-4">Dark</th>
                            <th className="text-left font-semibold p-4">Light</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeColors.map((token) => (
                                <tr key={token.name} className="border-t border-border">
                                    <td className="p-4 font-medium text-foreground">
                                        <div className="flex items-center gap-3">
                                            <Icons.PaletteIcon className="text-muted-foreground" />
                                            <span className="font-mono">{token.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-md ring-1 ring-inset ring-border" style={{ backgroundColor: token.dark }}></div>
                                            <span className="font-mono text-muted-foreground">{token.dark.toUpperCase()}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-md ring-1 ring-inset ring-border" style={{ backgroundColor: token.light }}></div>
                                            <span className="font-mono text-muted-foreground">{token.light.toUpperCase()}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


const TypeStyle: React.FC<{
  preview: React.ReactNode;
  details: { label: string; value: string }[];
}> = ({ preview, details }) => (
    <div className="py-6 border-b border-border last:border-b-0 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 items-center">
        <div className="break-words">{preview}</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            {details.map(detail => (
                <div key={detail.label}>
                    <div className="text-muted-foreground">{detail.label}</div>
                    <div className="font-semibold text-foreground font-mono break-words">{detail.value}</div>
                </div>
            ))}
        </div>
    </div>
);

const TypographyScale: React.FC = () => {
    const typographyStyles = [
        {
            preview: <h1 className="text-4xl font-bold">Aa - Heading 1</h1>,
            details: [
                { label: 'Size', value: '36px' },
                { label: 'Weight', value: '700' },
                { label: 'Line Height', value: '40px' },
                { label: 'Class', value: '.text-4xl .font-bold' },
            ],
        },
        {
            preview: <h2 className="text-2xl font-bold">Aa - Heading 2</h2>,
            details: [
                { label: 'Size', value: '24px' },
                { label: 'Weight', value: '700' },
                { label: 'Line Height', value: '32px' },
                { label: 'Class', value: '.text-2xl .font-bold' },
            ],
        },
        {
            preview: <h3 className="text-lg font-semibold">Aa - Heading 3</h3>,
            details: [
                { label: 'Size', value: '18px' },
                { label: 'Weight', value: '600' },
                { label: 'Line Height', value: '28px' },
                { label: 'Class', value: '.text-lg .font-semibold' },
            ],
        },
        {
            preview: <p className="text-base">The quick brown fox jumps over the lazy dog. This is the default body text style, designed for long-form content.</p>,
            details: [
                { label: 'Size', value: '16px' },
                { label: 'Weight', value: '400' },
                { label: 'Line Height', value: '24px' },
                { label: 'Class', value: '.text-base' },
            ],
        },
        {
            preview: <p className="text-sm text-muted-foreground">The quick brown fox jumps over the lazy dog. Used for metadata and captions.</p>,
            details: [
                { label: 'Size', value: '14px' },
                { label: 'Weight', value: '400' },
                { label: 'Line Height', value: '20px' },
                { label: 'Class', value: '.text-sm' },
            ],
        },
        {
            preview: <p className="text-xs text-muted-foreground">Used for timestamps and minor details.</p>,
            details: [
                { label: 'Size', value: '12px' },
                { label: 'Weight', value: '400' },
                { label: 'Line Height', value: '16px' },
                { label: 'Class', value: '.text-xs' },
            ],
        },
         {
            preview: <p className="text-base">This is an example of an <a href="#" onClick={(e) => e.preventDefault()} className="text-sky-500 dark:text-sky-400 hover:underline">inline link</a> within body text.</p>,
            details: [
                { label: 'Color', value: 'sky-500' },
                { label: 'Dark Color', value: 'sky-400' },
                { label: 'Decoration', value: 'underline' },
                { label: 'State', value: ':hover' },
            ],
        },
    ];

    return (
        <div>
            {typographyStyles.map((style, index) => <TypeStyle key={index} {...style} />)}
        </div>
    );
};

const SpacingScale: React.FC = () => {
    const spacings = [
        { rem: '0.25rem', pixels: '4px', class: 'p-1' },
        { rem: '0.5rem', pixels: '8px', class: 'p-2' },
        { rem: '0.75rem', pixels: '12px', class: 'p-3' },
        { rem: '1rem', pixels: '16px', class: 'p-4' },
        { rem: '1.5rem', pixels: '24px', class: 'p-6' },
        { rem: '2rem', pixels: '32px', class: 'p-8' },
        { rem: '2.5rem', pixels: '40px', class: 'p-10' },
    ];
    const radii = [
        { name: 'sm', class: 'rounded-sm', pixels: '4px' },
        { name: 'md', class: 'rounded-md', pixels: '6px' },
        { name: 'lg', class: 'rounded-lg', pixels: '8px' },
        { name: 'full', class: 'rounded-full', pixels: '9999px' },
    ];
    return (
        <div className="space-y-10">
            <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Spacing Scale</h3>
                <p className="text-sm text-muted-foreground mb-4">Use these tokens for padding, margins, and gaps. Based on a 4px grid.</p>
                <div className="flex flex-col gap-4">
                    {spacings.map(s => (
                        <div key={s.class} className="flex items-center gap-6 text-sm">
                            <div className="w-24 text-right font-mono text-muted-foreground">{s.class}</div>
                            <div className="w-20 font-mono text-foreground">{s.pixels} ({s.rem})</div>
                            <div className="h-5 bg-primary/20 rounded-sm" style={{ width: s.rem }} />
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">Border Radius</h3>
                <p className="text-sm text-muted-foreground mb-4">Use radius tokens to control the roundness of corners.</p>
                <div className="flex flex-wrap items-end gap-6 pt-2">
                     {radii.map(r => (
                        <div key={r.name} className="flex flex-col items-center gap-2">
                            <div className={`w-20 h-20 bg-primary/10 border border-border ${r.class}`} />
                            <div className="text-center mt-1">
                                <div className="text-sm font-semibold text-foreground font-mono">{r.class}</div>
                                <div className="text-xs text-muted-foreground">{r.pixels}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- DATA & STATE MOCKS ---

type SortOrder = 'newest' | 'oldest';
type ResolutionFilter = 'all' | 'open' | 'resolved';
interface User { name: string; avatarUrl: string; }

const CURRENT_USER = 'You';

const getAvatar = (name: string) => {
    // A simple, deterministic hash function to get a number from a string.
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        const char = name.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    // Use the hash to pick a gender and an avatar index.
    const gender = (Math.abs(hash) % 2 === 0) ? 'male' : 'female';
    // There are 79 avatars for each gender (0-78)
    const index = Math.abs(hash) % 79;
    return `https://xsgames.co/randomusers/assets/avatars/${gender}/${index}.jpg`;
};

const mockUsers: User[] = [
    { name: 'You', avatarUrl: getAvatar('You') },
    { name: 'Ali Rahimi', avatarUrl: getAvatar('Ali Rahimi') },
    { name: 'Farzan Sadeghi', avatarUrl: getAvatar('Farzan Sadeghi') },
    { name: 'Jane Doe', avatarUrl: getAvatar('Jane Doe') },
    { name: 'Erfan Sharif', avatarUrl: getAvatar('Erfan Sharif') },
    { name: 'Sadeghi', avatarUrl: getAvatar('Sadeghi') },
].sort((a, b) => a.name.localeCompare(b.name));

const mockComments: CommentType[] = [
    {
        id: 1, author: { name: 'Ali Rahimi', avatarUrl: getAvatar('Ali Rahimi') },
        timestamp: '1h ago', createdAt: new Date(Date.now() - 3600000), text: 'This is a standard comment with #hashtags, @mentions, and a https://link.com',
        reactions: [ { emoji: '🚀', user: 'Farzan Sadeghi' }, { emoji: '🚀', user: 'You' }, { emoji: '👍', user: 'Jane Doe' }]
    },
    {
        id: 2, author: { name: 'Jane Doe', avatarUrl: getAvatar('Jane Doe') },
        timestamp: '2h ago', createdAt: new Date(Date.now() - 7200000), text: 'This comment has replies.', reactions: [],
    },
    {
        id: 3, author: { name: 'Farzan Sadeghi', avatarUrl: getAvatar('Farzan Sadeghi') },
        timestamp: '1h 58m ago', createdAt: new Date(Date.now() - 7100000), text: 'This is a reply to another comment.', reactions: [], parentId: 2
    },
    {
        id: 4, author: { name: 'Erfan Sharif', avatarUrl: getAvatar('Erfan Sharif') },
        timestamp: '5h ago', createdAt: new Date(Date.now() - 18000000), text: 'Check out this screenshot for the new logo concept.',
        reactions: [{ emoji: '❤️', user: 'You' }],
        attachment: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400', type: 'image' }
    },
    {
        id: 5, author: { name: 'You', avatarUrl: getAvatar('You') },
        timestamp: '6h ago', createdAt: new Date(Date.now() - 21600000), text: 'This comment has been edited to provide more clarity.',
        reactions: [], isEdited: true
    },
     {
        id: 6, author: { name: 'Sadeghi', avatarUrl: getAvatar('Sadeghi') },
        timestamp: '1d ago', createdAt: new Date(Date.now() - 86400000), text: 'This issue is now resolved.',
        reactions: [], resolved: true,
    },
    {
        id: 7, author: { name: 'You', avatarUrl: getAvatar('You') },
        timestamp: '1d ago', createdAt: new Date(Date.now() - 86400000), text: 'This is a comment by the current user.',
        reactions: [{ emoji: '👍', user: 'Ali Rahimi' }],
    },
    {
        id: 8, author: { name: 'Erfan Sharif', avatarUrl: getAvatar('Erfan Sharif') },
        timestamp: '2d ago', createdAt: new Date(Date.now() - 2 * 86400000), text: 'Okay, I am resolving this entire discussion thread now.',
        reactions: [], resolved: true,
    },
    {
        id: 9, author: { name: 'Jane Doe', avatarUrl: getAvatar('Jane Doe') },
        timestamp: '2d ago', createdAt: new Date(Date.now() - 2 * 86400000 + 60000), text: 'Sounds good, thanks!',
        reactions: [], parentId: 8,
    },
     {
        id: 10, author: { name: 'Ali Rahimi', avatarUrl: getAvatar('Ali Rahimi') },
        timestamp: '3d ago', createdAt: new Date(Date.now() - 3 * 86400000), text: 'This comment is pinned to the top for visibility.',
        reactions: [], isPinned: true,
    },
    // Data for long thread showcase
    {
        id: 11, author: { name: 'Sadeghi', avatarUrl: getAvatar('Sadeghi') },
        timestamp: '4d ago', createdAt: new Date(Date.now() - 4 * 86400000), text: 'This is the start of a very long discussion thread with many replies to test performance.',
        reactions: [],
    },
    ...Array.from({ length: 25 }, (_, i) => ({
        id: 100 + i,
        author: mockUsers[i % (mockUsers.length -1) + 1], // Cycle through users, skipping "You"
        timestamp: `${20-i}h ago`,
        createdAt: new Date(Date.now() - (4 * 86400000 + (20-i) * 3600000)),
        text: `This is reply number ${i + 1}. We need to ensure the UI remains smooth even with a large number of comments. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
        reactions: i % 5 === 0 ? [{ emoji: '👍', user: 'You' }] : [],
        parentId: 11,
        isEdited: i === 3,
    })),
];

// --- COMPONENT MOCKS ---

const ResolutionFilterControl: React.FC<{
    currentFilter: ResolutionFilter;
    onSetFilter: (filter: ResolutionFilter) => void;
}> = ({ currentFilter, onSetFilter }) => {
    const options = [
        { value: 'all', label: 'All Comments' },
        { value: 'open', label: 'Unresolved' },
        { value: 'resolved', label: 'Resolved' },
    ];
    return (
        <div className="w-48 bg-popover border border-border rounded-lg shadow-xl z-10 py-1">
             <p className="text-xs font-semibold text-muted-foreground px-3 pt-2 pb-1">Filter by status</p>
             {options.map(option => (
                <button key={option.value} onClick={() => onSetFilter(option.value as ResolutionFilter)} className="w-full text-left px-3 py-1.5 hover:bg-accent flex items-center justify-between text-popover-foreground text-sm">
                    <span>{option.label}</span>
                    {currentFilter === option.value && <Icons.CheckIcon className="!text-[18px] text-primary" />}
                </button>
            ))}
        </div>
    );
};

const SortControl: React.FC<{
    sortOrder: SortOrder;
    setSortOrder: (order: SortOrder) => void;
}> = ({ sortOrder, setSortOrder }) => (
    <div className="w-48 bg-popover border border-border rounded-lg shadow-xl z-10 py-1">
         <p className="text-xs font-semibold text-muted-foreground px-3 pt-2 pb-1">Sort by</p>
         {[ { value: 'newest', label: 'Newest First' }, { value: 'oldest', label: 'Oldest First' }].map(option => (
            <button key={option.value} onClick={() => setSortOrder(option.value as SortOrder)} className="w-full text-left px-3 py-1.5 hover:bg-accent flex items-center justify-between text-popover-foreground text-sm">
                <span>{option.label}</span>
                {sortOrder === option.value && <Icons.CheckIcon className="!text-[18px] text-primary" />}
            </button>
        ))}
    </div>
);

const UserFilterControl: React.FC<{
    allAuthors: User[];
    selectedUser: string | null;
    onSelectUser: (name: string | null) => void;
}> = ({ allAuthors, selectedUser, onSelectUser }) => (
    <div className="w-56 bg-popover border border-border rounded-lg shadow-xl z-10 py-1">
        <p className="text-xs font-semibold text-muted-foreground px-3 pt-2 pb-1">Filter by user</p>
        <ul role="menu" className="max-h-60 overflow-y-auto text-sm">
             <li>
                <button role="menuitem" onClick={() => onSelectUser(null)} className="w-full text-left px-3 py-1.5 hover:bg-accent flex items-center justify-between text-popover-foreground">
                    <span>All Comments</span>
                    {!selectedUser && <Icons.CheckIcon className="!text-[18px] text-primary" />}
                </button>
            </li>
            {allAuthors.map(author => (
                <li key={author.name}>
                    <button role="menuitem" onClick={() => onSelectUser(author.name)} className="w-full text-left px-3 py-1.5 hover:bg-accent flex items-center justify-between text-popover-foreground gap-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <img src={author.avatarUrl} alt={author.name} className="w-5 h-5 rounded-full object-cover" />
                            <span className="truncate">{author.name}</span>
                        </div>
                        {selectedUser === author.name && <Icons.CheckIcon className="!text-[18px] text-primary flex-shrink-0" />}
                    </button>
                </li>
            ))}
        </ul>
    </div>
);

const CommentInputShowcase: React.FC<{
    initialState?: { text?: string; attachment?: string };
    showMentions?: boolean;
    showEmojiPicker?: boolean;
}> = ({ initialState = {}, showMentions = false, showEmojiPicker = false }) => {
    const [text, setText] = useState(initialState.text || '');
    const [attachment, setAttachment] = useState(initialState.attachment || null);

    const longText = "This is a very long comment to demonstrate the auto-sizing and scrolling behavior of the textarea. As the user types more and more content, the input area will expand vertically to a certain point.\n\nOnce it reaches its maximum height, a scrollbar will appear, allowing the user to continue writing without breaking the layout of the page. This ensures a great user experience for both short and long messages.";

    const currentText = initialState.text === longText ? longText : text;

    return (
        <div className="flex flex-col-reverse">
            <footer className="p-3 border-t border-border bg-background rounded-b-lg">
                <form onSubmit={(e) => e.preventDefault()} className="flex items-end gap-2">
                    <div className="relative w-full bg-input rounded-2xl">
                        {attachment && (
                            <div className="p-3 pb-1">
                                <div className="relative inline-block">
                                    <img src={attachment} alt="Preview" className="max-h-24 rounded-md border border-border" />
                                    <button type="button" onClick={() => setAttachment(null)} className="absolute -top-1.5 -right-1.5 bg-muted rounded-full p-0.5 text-muted-foreground hover:bg-red-500 hover:text-white transition-colors" aria-label="Remove attachment">
                                        <Icons.CloseIcon className="!text-[16px]" />
                                    </button>
                                </div>
                            </div>
                        )}
                        <textarea
                            rows={1}
                            value={currentText}
                            onChange={e => setText(e.target.value)}
                            placeholder="Add Comment..."
                            className="w-full bg-transparent p-3 pr-24 text-sm resize-none"
                            style={{ 
                                minHeight: '52px',
                                height: currentText === longText ? '120px' : 'auto',
                                maxHeight: '120px',
                                overflowY: currentText === longText ? 'auto' : 'hidden',
                             }}
                         />
                        <div className="absolute right-3 bottom-3 flex items-center text-muted-foreground gap-1">
                            <button type="button" className="p-1.5 rounded-full hover:bg-accent hover:text-foreground"><Icons.AttachFileIcon /></button>
                            <button type="button" className="p-1.5 rounded-full hover:bg-accent hover:text-foreground"><Icons.AtIcon /></button>
                            <button type="button" className="p-1.5 rounded-full hover:bg-accent hover:text-foreground"><Icons.EmojiSmileAddIcon /></button>
                        </div>
                    </div>
                    <button type="submit" disabled={!currentText.trim() && !attachment} className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground/80 disabled:opacity-50"><Icons.ArrowUpIcon className="!text-xl" /></button>
                </form>
            </footer>

            {showMentions && (
                <div className="mb-2 bg-popover border border-border rounded-t-lg shadow-xl p-2 max-h-48 overflow-y-auto">
                    <p className="text-xs font-semibold text-muted-foreground px-2 pb-1">Mention User</p>
                    <ul>
                        {mockUsers.filter(u => u.name !== 'You').slice(0, 3).map((user, index) => (
                            <li key={user.name}>
                                <button type="button" className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors ${index === 0 ? 'bg-accent' : ''}`}>
                                    <img src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                                    <span className="text-sm font-medium text-popover-foreground">{user.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {showEmojiPicker && (
                <div className="mb-2 self-end">
                    <div className="w-auto bg-popover border border-border rounded-lg shadow-xl z-10 p-2 flex gap-2">
                        {['👍', '❤️', '😂', '😮', '😢', '🙏', '🚀', '🎉'].map(emoji => (
                            <button key={emoji} className="text-xl p-1 rounded-md hover:bg-accent transition-colors">{emoji}</button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const PageStateComponents = () => {
    const CommentSkeleton: React.FC = () => (
        <div className="flex items-start space-x-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-muted mt-0.5"></div>
            <div className="flex-1 space-y-2 py-1">
                <div className="h-3 bg-muted rounded w-1/3"></div>
                <div className="space-y-1.5">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-5/6"></div>
                </div>
            </div>
        </div>
    );
    return (
        <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="border border-border rounded-lg p-6">
                 <h3 className="font-semibold mb-4">Loading State</h3>
                 <div className="space-y-6 text-left">
                    <CommentSkeleton />
                    <CommentSkeleton />
                    <CommentSkeleton />
                 </div>
            </div>
             <div className="border border-border rounded-lg p-6 flex flex-col justify-center">
                 <h3 className="font-semibold mb-4">Empty State</h3>
                 <Icons.ForumIcon className="!text-6xl text-muted-foreground/30 mx-auto mb-4" />
                 <h4 className="text-lg font-semibold text-foreground">No Comments Yet</h4>
                 <p className="text-muted-foreground mt-1">Be the first to start the conversation.</p>
            </div>
             <div className="border border-border rounded-lg p-6 flex flex-col justify-center">
                 <h3 className="font-semibold mb-4">Error State</h3>
                <Icons.ErrorIcon className="!text-6xl text-red-500/50 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-foreground">Something Went Wrong</h4>
                <p className="text-muted-foreground mt-1 mb-4">We couldn't load the comments.</p>
                <button className="flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground text-sm font-medium rounded-md hover:bg-accent hover:text-foreground transition-colors mx-auto">
                    <Icons.ReopenIcon className="!text-lg" />
                    <span>Retry</span>
                </button>
            </div>
        </div>
    );
};

const ButtonVariantShowcase: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="py-6 border-b border-border last:border-b-0">
        <h3 className="text-lg font-semibold mb-4 text-foreground">{title}</h3>
        <div className="flex flex-wrap items-end gap-x-8 gap-y-6">
            {children}
        </div>
    </div>
);

const ButtonState: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex flex-col items-center gap-2 min-w-[80px]">
        {children}
        <span className="text-xs text-muted-foreground">{label}</span>
    </div>
);

const CommentStateShowcaseItem: React.FC<{ title: string; description: string; children: React.ReactNode; className?: string }> = ({ title, description, children, className }) => (
    <div className={`border border-border rounded-lg p-6 bg-background ${className || ''}`}>
        <h3 className="font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        {children}
    </div>
);


// --- Main Workspace Component ---

export const Workspace: React.FC<{ theme: Theme; toggleTheme: () => void }> = ({ theme, toggleTheme }) => {
    const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
    const [filterUser, setFilterUser] = useState<string | null>('Ali Rahimi');
    const [resolutionFilter, setResolutionFilter] = useState<ResolutionFilter>('all');
    
    const iconList = Object.entries(Icons);
    const emptyFunc = () => {};
    const longCommentText = "This is a very long comment to demonstrate the auto-sizing and scrolling behavior of the textarea. As the user types more and more content, the input area will expand vertically to a certain point.\n\nOnce it reaches its maximum height, a scrollbar will appear, allowing the user to continue writing without breaking the layout of the page. This ensures a great user experience for both short and long messages.";

    const resolutionFilterLabels: Record<ResolutionFilter, string> = {
        all: 'All',
        open: 'Unresolved',
        resolved: 'Resolved',
    };

    const sortOrderLabels: Record<SortOrder, string> = {
        newest: 'Newest',
        oldest: 'Oldest',
    };

    const LongThreadShowcase: React.FC = () => {
        const parentComment = mockComments.find(c => c.id === 11)!;
        const allReplies = useMemo(() => mockComments
            .filter(c => c.parentId === 11)
            .sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime()), []);
        
        const BATCH_SIZE = 5;
        const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

        const visibleReplies = allReplies.slice(0, visibleCount);
        const remainingCount = allReplies.length - visibleCount;

        const handleLoadMore = () => {
            setVisibleCount(prev => Math.min(prev + BATCH_SIZE, allReplies.length));
        };

        return (
            <div>
                <Comment comment={parentComment} currentUser={CURRENT_USER} isThreadParent={true} replyCount={allReplies.length} {...{onUpdateComment: emptyFunc, onDeleteComment: emptyFunc, onToggleReaction: emptyFunc, onToggleResolve: emptyFunc, onTogglePin: emptyFunc, onViewThread: emptyFunc}} />
                
                <div className="pl-4 mt-4">
                    {visibleReplies.map(reply => (
                        <div key={reply.id} className="py-4">
                             <div className="relative">
                                <div className="absolute left-4 top-0 bottom-0 w-px bg-border/40 z-0" aria-hidden="true"></div>
                                <Comment comment={reply} currentUser={CURRENT_USER} {...{onUpdateComment: emptyFunc, onDeleteComment: emptyFunc, onToggleReaction: emptyFunc, onToggleResolve: emptyFunc, onTogglePin: emptyFunc, onViewThread: emptyFunc, replyCount: 0, replyingToAuthor: parentComment.author.name}} />
                            </div>
                        </div>
                    ))}
                </div>
                
                {remainingCount > 0 && (
                    <div className="px-4 pb-4 text-center">
                         <div className="h-px bg-border my-2 w-1/4 mx-auto"></div>
                         <button 
                            onClick={handleLoadMore} 
                            className="text-sm font-semibold text-sky-500 hover:text-sky-400 p-2 rounded-md"
                        >
                            View {Math.min(remainingCount, BATCH_SIZE)} more {remainingCount > 1 ? 'replies' : 'reply'}
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <main className="flex-1 h-screen overflow-y-auto">
            <header className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b border-border">
                <div className="max-w-5xl mx-auto flex justify-between items-start px-8 lg:px-12 py-6">
                    <div>
                        <h1 className="text-4xl font-bold">Design System</h1>
                        <p className="text-muted-foreground mt-2">A showcase of all components used in the Dizno commenting feature.</p>
                    </div>
                    <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
                </div>
            </header>
            
            <div className="max-w-5xl mx-auto px-8 lg:px-12">
                <div className="pt-12">
                    <section>
                        <h2 className="text-3xl font-bold border-b border-border pb-3 mb-8">Foundation</h2>
                        <Showcase title="Colors" description="The color palette is defined using HSL values and CSS variables for easy theming.">
                            <ColorPalette />
                        </Showcase>
                         <Showcase title="Typography" description="Our typographic scale uses the 'Inter' typeface, designed to establish a clear visual hierarchy, enhance readability, and ensure consistency across the application. All sizes are based on a 4px grid.">
                            <TypographyScale />
                        </Showcase>
                         <Showcase title="Spacing & Sizing" description="Consistent spacing and sizing are based on a 4px grid.">
                            <SpacingScale />
                        </Showcase>
                    </section>
                    
                    <section className="mt-16">
                        <h2 className="text-3xl font-bold border-b border-border pb-3 mb-8">Components</h2>
                        <Showcase title="Icons" description="The full set of Material Symbols used throughout the interface.">
                            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-4 text-center">
                                {iconList.map(([name, IconComponent]) => (
                                    <div key={name} className="flex flex-col items-center gap-2">
                                        <IconComponent className="text-muted-foreground !text-2xl" />
                                        <span className="text-xs text-muted-foreground/80">{name.replace('Icon', '')}</span>
                                    </div>
                                ))}
                            </div>
                        </Showcase>
                         <Showcase title="Buttons" description="Various button styles for different actions and their states.">
                            <div className="space-y-4 -my-6">
                                <ButtonVariantShowcase title="Primary">
                                    <ButtonState label="Default">
                                        <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover:bg-primary/90 transition-colors">Button</button>
                                    </ButtonState>
                                    <ButtonState label="Focus">
                                        <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-md ring-2 ring-primary/50 ring-offset-2 ring-offset-background">Button</button>
                                    </ButtonState>
                                    <ButtonState label="Disabled">
                                        <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-md opacity-50 cursor-not-allowed" disabled>Button</button>
                                    </ButtonState>
                                    <ButtonState label="With Icon">
                                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover:bg-primary/90 transition-colors">
                                            <Icons.SendIcon className="!text-base" />
                                            <span>Send</span>
                                        </button>
                                    </ButtonState>
                                </ButtonVariantShowcase>
                                
                                <ButtonVariantShowcase title="Secondary">
                                    <ButtonState label="Default">
                                        <button className="px-4 py-2 bg-muted text-muted-foreground text-sm font-semibold rounded-md hover:bg-accent transition-colors">Button</button>
                                    </ButtonState>
                                    <ButtonState label="Focus">
                                        <button className="px-4 py-2 bg-muted text-muted-foreground text-sm font-semibold rounded-md ring-2 ring-primary/50 ring-offset-2 ring-offset-background">Button</button>
                                    </ButtonState>
                                    <ButtonState label="Disabled">
                                        <button className="px-4 py-2 bg-muted text-muted-foreground text-sm font-semibold rounded-md opacity-50 cursor-not-allowed" disabled>Button</button>
                                    </ButtonState>
                                    <ButtonState label="With Icon">
                                        <button className="flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground text-sm font-semibold rounded-md hover:bg-accent transition-colors">
                                            <Icons.ReopenIcon className="!text-base" />
                                            <span>Retry</span>
                                        </button>
                                    </ButtonState>
                                </ButtonVariantShowcase>

                                <ButtonVariantShowcase title="Destructive">
                                    <ButtonState label="Default">
                                        <button className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-md hover:bg-red-600 transition-colors">Delete</button>
                                    </ButtonState>
                                    <ButtonState label="Focus">
                                        <button className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-md ring-2 ring-red-500/50 ring-offset-2 ring-offset-background">Delete</button>
                                    </ButtonState>
                                    <ButtonState label="Disabled">
                                        <button className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-md opacity-50 cursor-not-allowed" disabled>Delete</button>
                                    </ButtonState>
                                </ButtonVariantShowcase>

                                <ButtonVariantShowcase title="Specialized Buttons">
                                    <ButtonState label="Reaction">
                                        <button className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-sm bg-accent border border-transparent hover:border-border text-foreground/70"><span className="text-base">🚀</span><span className="font-medium">2</span></button>
                                    </ButtonState>
                                    <ButtonState label="Reaction (Active)">
                                        <button className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-sm bg-sky-100 dark:bg-sky-500/20 border border-sky-500/50 text-sky-600 dark:text-sky-400"><span className="text-base">👍</span><span className="font-medium">1</span></button>
                                    </ButtonState>
                                    <ButtonState label="Icon Button">
                                        <button className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground"><Icons.EmojiSmileAddIcon /></button>
                                    </ButtonState>
                                    <ButtonState label="Icon Button (Primary)">
                                        <button className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-primary-foreground"><Icons.ArrowUpIcon className="!text-xl" /></button>
                                    </ButtonState>
                                    <ButtonState label="Icon Button (Disabled)">
                                        <button className="w-12 h-12 flex items-center justify-center rounded-full bg-muted text-muted-foreground opacity-50 cursor-not-allowed"><Icons.ArrowUpIcon className="!text-xl" /></button>
                                    </ButtonState>
                                </ButtonVariantShowcase>
                            </div>
                        </Showcase>
                        <Showcase title="Overlays & Popovers" description="Contextual menus and elements that appear on user interaction. Here they are displayed statically in their 'open' state for visibility, using a flexbox layout to prevent any overlap.">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                                
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-sm">Tooltip</h3>
                                    <div className="flex flex-col items-start gap-2 relative">
                                        <button className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-sm bg-sky-100 dark:bg-sky-500/20 border border-sky-500/50 text-sky-600 dark:text-sky-400">
                                            <span className="text-base">👍</span>
                                            <span className="font-medium">5</span>
                                        </button>
                                        {/* The static tooltip itself, styled like the new one */}
                                        <div className="p-2 text-xs text-popover-foreground bg-popover/80 backdrop-blur-sm border border-border rounded-lg shadow-xl w-48" role="tooltip">
                                            <div className="text-left">
                                                <div className="font-semibold pb-1.5 mb-1.5 border-b border-border">
                                                    Reacted with 👍
                                                </div>
                                                <div className="flex flex-col items-start gap-0.5 max-h-32 overflow-y-auto pr-1">
                                                    <div>You</div>
                                                    <div>Ali Rahimi</div>
                                                    <div>Jane Doe</div>
                                                    <div>Farzan Sadeghi</div>
                                                    <div>Sadeghi</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-sm">Comment Actions</h3>
                                    <div className="flex flex-col items-start gap-2 relative">
                                        <button className="p-2 rounded-full bg-background border border-border text-muted-foreground">
                                            <Icons.MoreVertIcon className="!text-[20px]" />
                                        </button>
                                        <CommentActionsMenu onEdit={() => {}} onCopy={() => {}} onDelete={() => {}} onToggleResolve={() => {}} onTogglePin={() => {}} isResolved={false} isPinned={false} positionClass="static" isConfirmingDelete={false} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-sm">Actions (Pinned)</h3>
                                    <div className="flex flex-col items-start gap-2 relative">
                                        <button className="p-2 rounded-full bg-background border border-border text-muted-foreground">
                                            <Icons.MoreVertIcon className="!text-[20px]" />
                                        </button>
                                        <CommentActionsMenu onEdit={() => {}} onCopy={() => {}} onDelete={() => {}} onToggleResolve={() => {}} onTogglePin={() => {}} isResolved={false} isPinned={true} positionClass="static" isConfirmingDelete={false} />
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-sm">Confirm Delete</h3>
                                    <div className="flex flex-col items-start gap-2 relative">
                                        <button className="p-2 rounded-full bg-background border border-border text-muted-foreground">
                                            <Icons.MoreVertIcon className="!text-[20px]" />
                                        </button>
                                        <CommentActionsMenu onEdit={() => {}} onCopy={() => {}} onDelete={() => {}} onToggleResolve={() => {}} onTogglePin={() => {}} isResolved={false} isPinned={false} positionClass="static" isConfirmingDelete={true} />
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-sm">Sort Control</h3>
                                    <div className="flex flex-col items-start gap-3 pt-6">
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-background text-foreground">
                                            <Icons.SwapVertIcon className="!text-[18px] text-muted-foreground" />
                                            <span className="font-medium">{sortOrderLabels[sortOrder]}</span>
                                        </button>
                                        <SortControl sortOrder={sortOrder} setSortOrder={setSortOrder} />
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-sm">User Filter</h3>
                                    <div className="flex flex-col items-start gap-3 pt-6">
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-background text-foreground">
                                             <img src={mockUsers.find(u => u.name === filterUser)?.avatarUrl} alt={filterUser || ''} className="w-5 h-5 rounded-full object-cover" />
                                            <span className="font-medium max-w-[100px] truncate">{filterUser || 'All Users'}</span>
                                        </button>
                                        <UserFilterControl allAuthors={mockUsers} selectedUser={filterUser} onSelectUser={setFilterUser} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-sm">Status Filter</h3>
                                    <div className="flex flex-col items-start gap-3 pt-6">
                                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-background text-foreground">
                                            <Icons.ChecklistIcon className="!text-[18px] text-muted-foreground" />
                                            <span className="font-medium">{resolutionFilterLabels[resolutionFilter]}</span>
                                        </button>
                                        <ResolutionFilterControl currentFilter={resolutionFilter} onSetFilter={setResolutionFilter} />
                                    </div>
                                </div>

                                <div className="space-y-4 sm:col-span-2 lg:col-span-3">
                                    <h3 className="font-semibold text-sm">Emoji Picker</h3>
                                    <div className="flex flex-col items-start gap-2 relative">
                                        <button className="p-2 rounded-full bg-background border border-border text-muted-foreground">
                                            <Icons.EmojiSmileAddIcon className="!text-[20px]" />
                                        </button>
                                        <div className="static w-auto bg-popover border border-border rounded-lg shadow-xl z-10 p-2 flex gap-2">
                                            {['👍', '❤️', '😂', '😮', '😢', '🙏', '🚀', '🎉'].map(emoji => (
                                                <button key={emoji} className="text-xl p-1 rounded-md hover:bg-accent transition-colors">{emoji}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="sm:col-span-2 lg:col-span-3 space-y-4">
                                    <h3 className="font-semibold text-sm">Mention Suggestions</h3>
                                    <div className="bg-popover border border-border rounded-lg shadow-xl p-2 max-h-48 overflow-y-auto w-full">
                                        <p className="text-xs font-semibold text-muted-foreground px-2 pb-1">Mention User</p>
                                        <ul>
                                            {mockUsers.filter(u => u.name !== 'You').slice(0, 3).map((user, index) => (
                                                <li key={user.name}>
                                                    <button type="button" className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors ${index === 1 ? 'bg-accent' : ''}`}>
                                                        <img src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                                                        <span className="text-sm font-medium text-popover-foreground">{user.name}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Showcase>
                        <Showcase title="Form Elements" description="A comprehensive look at the comment input component, including all its interactive states and features. Popovers are rendered statically using a flexbox layout to ensure they don't overlap.">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <CommentStateShowcaseItem title="Default State" description="The input field in its initial, empty state.">
                                    <CommentInputShowcase />
                                </CommentStateShowcaseItem>
                                <CommentStateShowcaseItem title="Typing State" description="The input field with user-entered text.">
                                    <CommentInputShowcase initialState={{ text: 'This is an example comment...' }} />
                                </CommentStateShowcaseItem>
                                <CommentStateShowcaseItem title="With Attachment" description="An image has been attached and is shown as a preview.">
                                    <CommentInputShowcase initialState={{ attachment: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=400' }} />
                                </CommentStateShowcaseItem>
                                <CommentStateShowcaseItem title="Scrolling (Max Height)" description="The textarea grows until it hits a max height, after which it becomes scrollable.">
                                    <CommentInputShowcase initialState={{ text: longCommentText }} />
                                </CommentStateShowcaseItem>
                                <CommentStateShowcaseItem title="Mention Suggestions" description="When a user types '@', a suggestion box appears." className="md:col-span-2">
                                    <CommentInputShowcase showMentions={true} initialState={{ text: '@Ali' }}/>
                                </CommentStateShowcaseItem>
                                <CommentStateShowcaseItem title="Emoji Picker" description="Users can open a picker to add emoji reactions." className="md:col-span-2">
                                    <CommentInputShowcase showEmojiPicker={true} />
                                </CommentStateShowcaseItem>
                             </div>
                        </Showcase>
                        <Showcase title="Page States" description="States for loading, empty, and error scenarios to provide user feedback.">
                            <PageStateComponents />
                        </Showcase>
                        <Showcase title="Comment Component States" description="The core component for displaying user discussions, shown in various states to demonstrate its full range of features.">
                            <div className="grid md:grid-cols-1 gap-8" data-scroll-container="true">
                                <CommentStateShowcaseItem title="Standard Comment" description="Default appearance with rich text parsing for links, #hashtags, and @mentions.">
                                    <Comment comment={mockComments.find(c => c.id === 1)!} currentUser={CURRENT_USER} {...{onUpdateComment: emptyFunc, onDeleteComment: emptyFunc, onToggleReaction: emptyFunc, onToggleResolve: emptyFunc, onTogglePin: emptyFunc, onViewThread: emptyFunc, replyCount: 0}} />
                                </CommentStateShowcaseItem>
                                 <CommentStateShowcaseItem 
                                    title="Pinned Comment" 
                                    description="A pinned comment is highlighted with an icon, text indicator, and a subtle background color to make it stand out."
                                    className="bg-muted"
                                >
                                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-3 pl-11">
                                        <Icons.PushPinIcon className="!text-[16px]" />
                                        PINNED COMMENT
                                    </div>
                                    <Comment comment={mockComments.find(c => c.id === 10)!} currentUser={CURRENT_USER} {...{onUpdateComment: emptyFunc, onDeleteComment: emptyFunc, onToggleReaction: emptyFunc, onToggleResolve: emptyFunc, onTogglePin: emptyFunc, onViewThread: emptyFunc, replyCount: 0}} />
                                </CommentStateShowcaseItem>
                                <CommentStateShowcaseItem title="Comment by Current User" description="Comments by 'You' have the same appearance but different permissions for actions.">
                                    <Comment comment={mockComments.find(c => c.id === 7)!} currentUser={CURRENT_USER} {...{onUpdateComment: emptyFunc, onDeleteComment: emptyFunc, onToggleReaction: emptyFunc, onToggleResolve: emptyFunc, onTogglePin: emptyFunc, onViewThread: emptyFunc, replyCount: 0}} />
                                </CommentStateShowcaseItem>
                                 <CommentStateShowcaseItem title="Comment with Attachment" description="A comment that includes an image attachment.">
                                    <Comment comment={mockComments.find(c => c.id === 4)!} currentUser={CURRENT_USER} {...{onUpdateComment: emptyFunc, onDeleteComment: emptyFunc, onToggleReaction: emptyFunc, onToggleResolve: emptyFunc, onTogglePin: emptyFunc, onViewThread: emptyFunc, replyCount: 0}} />
                                </CommentStateShowcaseItem>
                                <CommentStateShowcaseItem title="Edited Comment" description="An indicator appears if a comment has been modified after posting.">
                                    <Comment comment={mockComments.find(c => c.id === 5)!} currentUser={CURRENT_USER} {...{onUpdateComment: emptyFunc, onDeleteComment: emptyFunc, onToggleReaction: emptyFunc, onToggleResolve: emptyFunc, onTogglePin: emptyFunc, onViewThread: emptyFunc, replyCount: 0}} />
                                </CommentStateShowcaseItem>
                                <CommentStateShowcaseItem title="Editing State" description="The interface shown when a user is actively editing their comment.">
                                    <Comment comment={mockComments.find(c => c.id === 5)!} currentUser={CURRENT_USER} {...{onUpdateComment: emptyFunc, onDeleteComment: emptyFunc, onToggleReaction: emptyFunc, onToggleResolve: emptyFunc, onTogglePin: emptyFunc, onViewThread: emptyFunc, replyCount: 0}} initialIsEditing={true} />
                                </CommentStateShowcaseItem>
                                <CommentStateShowcaseItem title="Long Thread with Pagination" description="For performance, long threads only show the first few replies with a button to load more.">
                                    <LongThreadShowcase />
                                </CommentStateShowcaseItem>
                                 <CommentStateShowcaseItem title="Reply in a Thread" description="A reply to another comment, indicating who the user is replying to.">
                                    <div className="relative">
                                        <div className="absolute left-4 top-0 bottom-0 w-px bg-border/40 z-0" aria-hidden="true"></div>
                                        <Comment comment={mockComments.find(c => c.id === 3)!} currentUser={CURRENT_USER} {...{onUpdateComment: emptyFunc, onDeleteComment: emptyFunc, onToggleReaction: emptyFunc, onToggleResolve: emptyFunc, onTogglePin: emptyFunc, onViewThread: emptyFunc, replyCount: 0, replyingToAuthor:"Jane Doe"}} />
                                    </div>
                                </CommentStateShowcaseItem>
                                <CommentStateShowcaseItem title="Resolved Comment" description="A single comment that has been marked as resolved, de-emphasizing it.">
                                    <Comment comment={mockComments.find(c => c.id === 6)!} currentUser={CURRENT_USER} {...{onUpdateComment: emptyFunc, onDeleteComment: emptyFunc, onToggleReaction: emptyFunc, onToggleResolve: emptyFunc, onTogglePin: emptyFunc, onViewThread: emptyFunc, replyCount: 0}} />
                                </CommentStateShowcaseItem>
                                <CommentStateShowcaseItem title="Resolved Thread" description="When a parent comment is resolved, the entire thread including replies is de-emphasized.">
                                   <div>
                                        <Comment comment={mockComments.find(c => c.id === 8)!} currentUser={CURRENT_USER} {...{onUpdateComment: emptyFunc, onDeleteComment: emptyFunc, onToggleReaction: emptyFunc, onToggleResolve: emptyFunc, onTogglePin: emptyFunc, onViewThread: emptyFunc, replyCount: 1, isThreadParent: true}} />
                                        <div className="py-4 mt-4 border-t border-border">
                                            <div className="relative">
                                                <div className="absolute left-4 top-0 bottom-0 w-px bg-border/40 z-0" aria-hidden="true"></div>
                                                <Comment comment={mockComments.find(c => c.id === 9)!} currentUser={CURRENT_USER} {...{onUpdateComment: emptyFunc, onDeleteComment: emptyFunc, onToggleReaction: emptyFunc, onToggleResolve: emptyFunc, onTogglePin: emptyFunc, onViewThread: emptyFunc, replyCount: 0, isParentResolved: true}} />
                                            </div>
                                        </div>
                                   </div>
                                </CommentStateShowcaseItem>
                            </div>
                        </Showcase>
                    </section>
                </div>
            </div>
        </main>
    );
};