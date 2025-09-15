import React, { useState, useMemo } from 'react';
import type { Theme } from '../App';
import type { CommentType } from '../types';
import * as Icons from './icons';
import { Comment } from './Comment';

// --- Mock Data and Types ---

const CURRENT_USER = 'You';
interface User { name: string; avatarUrl: string; }
type SortOrder = 'newest' | 'oldest';

const mockUsers: User[] = [
    { name: 'You', avatarUrl: 'https://i.pravatar.cc/40?u=you' },
    { name: 'Ali Rahimi', avatarUrl: 'https://i.pravatar.cc/40?u=ali' },
    { name: 'Farzan Sadeghi', avatarUrl: 'https://i.pravatar.cc/40?u=farzan' },
    { name: 'Jane Doe', avatarUrl: 'https://i.pravatar.cc/40?u=jane' },
    { name: 'Erfan Sharif', avatarUrl: 'https://i.pravatar.cc/40?u=erfan' },
    { name: 'Sadeghi', avatarUrl: 'https://i.pravatar.cc/40?u=sadeghi' },
].sort((a, b) => a.name.localeCompare(b.name));

const mockComments: CommentType[] = [
    {
        id: 1, author: { name: 'Ali Rahimi', avatarUrl: 'https://i.pravatar.cc/40?u=ali' },
        timestamp: '1h ago', createdAt: new Date(), text: 'This is a standard comment with #hashtags, @mentions, and a https://link.com',
        reactions: [ { emoji: '🚀', user: 'Farzan Sadeghi' }, { emoji: '🚀', user: 'You' }, { emoji: '👍', user: 'Jane Doe' }]
    },
    {
        id: 2, author: { name: 'Jane Doe', avatarUrl: 'https://i.pravatar.cc/40?u=jane' },
        timestamp: '2h ago', createdAt: new Date(), text: 'This comment has replies.', reactions: [],
    },
    {
        id: 3, author: { name: 'Farzan Sadeghi', avatarUrl: 'https://i.pravatar.cc/40?u=farzan' },
        timestamp: '4h ago', createdAt: new Date(), text: 'This is a reply to another comment.', reactions: [], parentId: 2
    },
    {
        id: 4, author: { name: 'Erfan Sharif', avatarUrl: 'https://i.pravatar.cc/40?u=erfan' },
        timestamp: '5h ago', createdAt: new Date(), text: 'Check out this screenshot for the new logo concept.',
        reactions: [{ emoji: '❤️', user: 'You' }],
        attachment: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400', type: 'image' }
    },
    {
        id: 5, author: { name: 'You', avatarUrl: 'https://i.pravatar.cc/40?u=you' },
        timestamp: '6h ago', createdAt: new Date(), text: 'This comment has been edited to provide more clarity.',
        reactions: [], isEdited: true
    },
];


// --- Reusable Components for Showcase ---

const ComponentShowcase: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="mb-12">
        <h2 className="text-2xl font-bold border-b border-border pb-2 mb-1">{title}</h2>
        <p className="text-muted-foreground mb-6">{description}</p>
        <div className="border border-dashed border-border rounded-lg p-6 space-y-4 bg-muted/20">
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

const SortControl: React.FC<{
    sortOrder: SortOrder;
    setSortOrder: (order: SortOrder) => void;
}> = ({ sortOrder, setSortOrder }) => (
    <div className="w-48 bg-popover border border-border rounded-lg shadow-xl z-10 py-1">
         <p className="text-xs font-semibold text-muted-foreground px-3 pt-2 pb-1">Sort by</p>
        <ul role="menu">
            {[ { value: 'newest', label: 'Newest First' }, { value: 'oldest', label: 'Oldest First' }].map(option => (
                <li key={option.value}>
                    <button role="menuitem" onClick={() => setSortOrder(option.value as SortOrder)} className="w-full text-left px-3 py-1.5 hover:bg-accent flex items-center justify-between text-popover-foreground text-sm">
                        <span>{option.label}</span>
                        {sortOrder === option.value && <Icons.CheckIcon className="!text-[18px] text-primary" />}
                    </button>
                </li>
            ))}
        </ul>
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
                            <img src={author.avatarUrl} alt={author.name} className="w-5 h-5 rounded-full" />
                            <span className="truncate">{author.name}</span>
                        </div>
                        {selectedUser === author.name && <Icons.CheckIcon className="!text-[18px] text-primary flex-shrink-0" />}
                    </button>
                </li>
            ))}
        </ul>
    </div>
);

const CommentInput: React.FC<{ placeholder: string; users: User[] }> = ({ placeholder, users }) => {
    const [commentText, setCommentText] = useState('This is an example comment text.');
    const isInputEmpty = !commentText.trim();
    return (
        <footer className="p-3 border-t border-border mt-auto relative bg-background rounded-b-lg -m-6 mt-6">
            <form onSubmit={(e) => { e.preventDefault(); setCommentText(''); }} className="flex items-end gap-2">
                 <div className="relative w-full bg-input rounded-2xl">
                    <textarea
                        rows={1}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-transparent border-transparent rounded-2xl resize-none text-sm text-foreground placeholder-muted-foreground p-3 pr-24 focus:outline-none focus:ring-0 transition-all"
                        style={{ lineHeight: '1.5', minHeight: '52px' }}
                        aria-label="Add a comment"
                    />
                    <div className="absolute right-3 bottom-3 flex items-center text-muted-foreground gap-1">
                        <button type="button" className="p-1.5 rounded-full hover:bg-accent hover:text-foreground transition-colors" aria-label="Attach file">
                            <Icons.AttachFileIcon />
                        </button>
                        <button type="button" className="p-1.5 rounded-full hover:bg-accent hover:text-foreground transition-colors" aria-label="Mention someone">
                            <Icons.AtIcon />
                        </button>
                        <button type="button" className="p-1.5 rounded-full hover:bg-accent hover:text-foreground transition-colors" aria-label="Add emoji">
                            <Icons.EmojiSmileAddIcon />
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isInputEmpty}
                    className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-200
                               disabled:bg-muted disabled:text-muted-foreground/80 disabled:opacity-50 disabled:cursor-not-allowed
                               bg-primary text-primary-foreground hover:bg-primary/90"
                    aria-label="Submit comment"
                >
                    <Icons.ArrowUpIcon className="!text-xl" />
                </button>
            </form>
        </footer>
    );
};


// --- Main Workspace Component ---

export const Workspace: React.FC<{ theme: Theme; toggleTheme: () => void }> = ({ theme, toggleTheme }) => {
    const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
    const [filterUser, setFilterUser] = useState<string | null>('Ali Rahimi');
    const [isEditingComment, setIsEditingComment] = useState(true);

    const iconList = Object.entries(Icons);

    const emptyFunc = () => {};

    return (
        <main className="flex-1 h-screen overflow-y-auto p-8 lg:p-12">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-4xl font-bold">Design System</h1>
                        <p className="text-muted-foreground mt-2">A showcase of all components used in the Dizno commenting feature.</p>
                    </div>
                    <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
                </div>
                
                <ComponentShowcase title="Icons" description="The full set of Material Symbols used throughout the interface.">
                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-4 text-center">
                        {iconList.map(([name, IconComponent]) => (
                            <div key={name} className="flex flex-col items-center gap-2">
                                <IconComponent className="text-muted-foreground !text-2xl" />
                                <span className="text-xs text-muted-foreground/80">{name.replace('Icon', '')}</span>
                            </div>
                        ))}
                    </div>
                </ComponentShowcase>

                <ComponentShowcase title="Buttons" description="Various button styles for different actions.">
                    <div className="flex flex-wrap items-center gap-4">
                        <button className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"><Icons.ArrowUpIcon className="!text-xl" /></button>
                        <button className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90">Save</button>
                        <button className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-md hover:bg-accent">Cancel</button>
                        <button className="p-1 rounded-md hover:bg-accent hover:text-foreground transition-colors text-muted-foreground"><Icons.ReplyIcon className="!text-[20px]" /></button>
                        <button className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-sm bg-accent border border-transparent hover:border-border text-foreground/70"><span className="text-base">🚀</span> <span className="font-medium">2</span></button>
                        <button className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-sm bg-primary/20 border border-primary/50 text-primary"><span className="text-base">👍</span> <span className="font-medium">1</span></button>
                    </div>
                </ComponentShowcase>

                <ComponentShowcase title="Overlays & Popovers" description="Contextual menus and pickers that appear on user interaction.">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h3 className="font-semibold">Sort Control</h3>
                            <SortControl sortOrder={sortOrder} setSortOrder={setSortOrder} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold">User Filter</h3>
                            <UserFilterControl allAuthors={mockUsers} selectedUser={filterUser} onSelectUser={setFilterUser} />
                        </div>
                    </div>
                </ComponentShowcase>

                <ComponentShowcase title="Form Elements" description="Inputs for creating and editing comments.">
                     <CommentInput placeholder="Add Comment..." users={mockUsers} />
                </ComponentShowcase>

                <ComponentShowcase title="Comment Component" description="The core component for displaying user discussions, shown in various states.">
                    <div className="space-y-6">
                         <Comment comment={mockComments[0]} currentUser={CURRENT_USER} onUpdateComment={emptyFunc} onDeleteComment={emptyFunc} onToggleReaction={emptyFunc} onToggleResolve={emptyFunc} onViewThread={emptyFunc} replyCount={0} />
                         <hr className="border-border" />
                         <Comment comment={mockComments[1]} currentUser={CURRENT_USER} onUpdateComment={emptyFunc} onDeleteComment={emptyFunc} onToggleReaction={emptyFunc} onToggleResolve={emptyFunc} onViewThread={emptyFunc} replyCount={1} />
                         <hr className="border-border" />
                         <div data-scroll-container="true"> {/* Mock scroll container for positioning */}
                            <Comment comment={mockComments[2]} currentUser={CURRENT_USER} onUpdateComment={emptyFunc} onDeleteComment={emptyFunc} onToggleReaction={emptyFunc} onToggleResolve={emptyFunc} onViewThread={emptyFunc} replyCount={0} replyingToAuthor="Jane Doe" />
                         </div>
                         <hr className="border-border" />
                         <Comment comment={mockComments[3]} currentUser={CURRENT_USER} onUpdateComment={emptyFunc} onDeleteComment={emptyFunc} onToggleReaction={emptyFunc} onToggleResolve={emptyFunc} onViewThread={emptyFunc} replyCount={0} />
                         <hr className="border-border" />
                         <Comment comment={mockComments[4]} currentUser={CURRENT_USER} onUpdateComment={emptyFunc} onDeleteComment={emptyFunc} onToggleReaction={emptyFunc} onToggleResolve={emptyFunc} onViewThread={emptyFunc} replyCount={0} />
                    </div>
                </ComponentShowcase>
            </div>
        </main>
    );
};