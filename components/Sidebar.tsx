import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo } from 'react';
import { CommentType } from '../types';
import { Comment, EmojiPicker } from './Comment';
import { AtIcon, TuneIcon, InfoIcon, ChatIcon, HistoryIcon, ArrowUpIcon, EmojiSmileAddIcon, ArrowBackIcon, SwapVertIcon, CheckIcon, PersonIcon, ChecklistIcon, AttachFileIcon, CloseIcon, ForumIcon, ErrorIcon, ReopenIcon, PushPinIcon } from './icons';

const CURRENT_USER = 'You';
const REPLIES_PAGE_SIZE = 10;

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

const initialComments: CommentType[] = [
  {
    id: 1,
    author: {
      name: 'Ali Rahimi',
      avatarUrl: getAvatar('Ali Rahimi')
    },
    timestamp: '13m ago',
    createdAt: new Date(Date.now() - 13 * 60 * 1000),
    text: "The font pairings work well, especially for both UI and marketing contexts. 🙏\n#Hashtag #Hashtag\n@Farzan Sadeghi @Ali Rahimi\n@Erfan Sharif\nhttps://www.figma.com/design/Plb1fhJJ2GYHWDHlacpBXs/Dizno-Studio?node-id=18980-32510&t=dpfKabrWAH2NdaOc-11",
    reactions: [
        { emoji: '🚀', user: 'Farzan' },
        { emoji: '🚀', user: 'You' },
        { emoji: '🍌', user: 'Erfan' },
        { emoji: '🍌', user: 'Jane Doe' },
        { emoji: '🗿', user: 'Sadeghi' }
    ],
    isPinned: true,
  },
   {
    id: 10,
    author: { name: 'You', avatarUrl: getAvatar('You') },
    timestamp: '12m ago',
    createdAt: new Date(Date.now() - 12 * 60 * 1000),
    text: 'Totally agree!',
    reactions: [],
    parentId: 1,
  },
  {
    id: 11,
    author: { name: 'Farzan Sadeghi', avatarUrl: getAvatar('Farzan Sadeghi') },
    timestamp: '10m ago',
    createdAt: new Date(Date.now() - 10 * 60 * 1000),
    text: 'Good find, @Ali Rahimi!',
    reactions: [],
    parentId: 1,
    attachment: {
        url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=400',
        type: 'image',
    }
  },
  {
    id: 12,
    author: { name: 'You', avatarUrl: getAvatar('You') },
    timestamp: '9m ago',
    createdAt: new Date(Date.now() - 9 * 60 * 1000),
    text: 'What do you think about using a serif font for headings?',
    reactions: [],
    parentId: 11,
  },
  {
    id: 2,
    author: {
        name: 'Jane Doe',
        avatarUrl: getAvatar('Jane Doe')
    },
    timestamp: '2h ago',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    text: "Great point! I've been looking for some good font pairings. This is super helpful. #Design #Typography",
    reactions: [{ emoji: '👍', user: 'Ali Rahimi' }]
  },
  {
    id: 3,
    author: { name: 'Sadeghi', avatarUrl: getAvatar('Sadeghi') },
    timestamp: '3h ago',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    text: 'Totally agree with @Jane Doe. Good typography is a game changer. Also, check out this resource: https://fonts.google.com/',
    reactions: [
      { emoji: '❤️', user: 'You' },
      { emoji: '❤️', user: 'Ali Rahimi' },
      { emoji: '❤️', user: 'Jane Doe' },
    ]
  },
  {
    id: 4,
    author: { name: 'Erfan Sharif', avatarUrl: getAvatar('Erfan Sharif') },
    timestamp: '5h ago',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    text: "Just pushed a new update. Let me know what you guys think!\n#feedback #update",
    reactions: [
        { emoji: '🎉', user: 'Farzan' }
    ],
    resolved: true,
  },
  {
    id: 5,
    author: { name: 'Farzan Sadeghi', avatarUrl: getAvatar('Farzan Sadeghi') },
    timestamp: '1d ago',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    text: 'I found a small bug on the login page. It happens on mobile when you rotate the screen. Can someone from the dev team take a look? @Ali Rahimi',
    reactions: [],
    parentId: null,
  },
    {
    id: 6,
    author: { name: 'You', avatarUrl: getAvatar('You') },
    timestamp: '1d ago',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 + 10000),
    text: 'On it! I will check it out. #bugfix',
    reactions: [
        { emoji: '👍', user: 'Farzan Sadeghi' }
    ],
    parentId: 5,
    resolved: true,
  }
];

type Tab = 'tune' | 'info' | 'comments' | 'history';
type SortOrder = 'newest' | 'oldest';
type ResolutionFilter = 'all' | 'open' | 'resolved';

interface User {
  name: string;
  avatarUrl: string;
}

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

const LoadingState: React.FC = () => (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <CommentSkeleton />
        <CommentSkeleton />
        <CommentSkeleton />
        <CommentSkeleton />
    </div>
);

const EmptyState: React.FC<{ isFiltered: boolean }> = ({ isFiltered }) => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <ForumIcon className="!text-6xl text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-semibold text-foreground">
            {isFiltered ? "No Matching Comments" : "No Comments Yet"}
        </h3>
        <p className="text-muted-foreground mt-1">
            {isFiltered ? "Try adjusting your filters." : "Be the first to start the conversation."}
        </p>
    </div>
);

const ErrorState: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
     <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <ErrorIcon className="!text-6xl text-red-500/50 mb-4" />
        <h3 className="text-lg font-semibold text-foreground">Something Went Wrong</h3>
        <p className="text-muted-foreground mt-1 mb-4">We couldn't load the comments. Please try again.</p>
        <button 
            onClick={onRetry} 
            className="flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground text-sm font-medium rounded-md hover:bg-accent hover:text-foreground transition-colors"
        >
            <ReopenIcon className="!text-lg" />
            <span>Retry</span>
        </button>
    </div>
);


const ResolutionFilterControl: React.FC<{
    currentFilter: ResolutionFilter;
    onSetFilter: (filter: ResolutionFilter) => void;
    onClose: () => void;
}> = ({ currentFilter, onSetFilter, onClose }) => {
    const options = [
        { value: 'all', label: 'All Comments' },
        { value: 'open', label: 'Unresolved' },
        { value: 'resolved', label: 'Resolved' },
    ];

    return (
        <div className="w-48 bg-popover border border-border rounded-lg shadow-xl z-10 py-1">
             <p className="text-xs font-semibold text-muted-foreground px-3 pt-2 pb-1">Filter by status</p>
            <ul role="menu" aria-orientation="vertical" aria-labelledby="resolution-filter-options">
                {options.map(option => (
                    <li key={option.value}>
                        <button
                            role="menuitem"
                            onClick={() => {
                                onSetFilter(option.value as ResolutionFilter);
                                onClose();
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-accent flex items-center justify-between text-popover-foreground text-sm"
                        >
                            <span>{option.label}</span>
                            {currentFilter === option.value && <CheckIcon className="!text-[18px] text-primary" />}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};


const SortControl: React.FC<{
    sortOrder: SortOrder;
    setSortOrder: (order: SortOrder) => void;
    onClose: () => void;
}> = ({ sortOrder, setSortOrder, onClose }) => {
    const options = [
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' },
    ];

    return (
        <div className="w-48 bg-popover border border-border rounded-lg shadow-xl z-10 py-1">
             <p className="text-xs font-semibold text-muted-foreground px-3 pt-2 pb-1">Sort by</p>
            <ul role="menu" aria-orientation="vertical" aria-labelledby="sort-options">
                {options.map(option => (
                    <li key={option.value}>
                        <button
                            role="menuitem"
                            onClick={() => {
                                setSortOrder(option.value as SortOrder);
                                onClose();
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-accent flex items-center justify-between text-popover-foreground text-sm"
                        >
                            <span>{option.label}</span>
                            {sortOrder === option.value && <CheckIcon className="!text-[18px] text-primary" />}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const UserFilterControl: React.FC<{
    allAuthors: User[];
    selectedUser: string | null;
    onSelectUser: (name: string | null) => void;
    onClose: () => void;
}> = ({ allAuthors, selectedUser, onSelectUser, onClose }) => {
    return (
        <div className="w-56 bg-popover border border-border rounded-lg shadow-xl z-10 py-1">
             <p className="text-xs font-semibold text-muted-foreground px-3 pt-2 pb-1">Filter by user</p>
            <ul role="menu" aria-orientation="vertical" aria-labelledby="filter-options" className="max-h-60 overflow-y-auto text-sm">
                 <li>
                    <button
                        role="menuitem"
                        onClick={() => {
                            onSelectUser(null);
                            onClose();
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-accent flex items-center justify-between text-popover-foreground"
                    >
                        <span>All Comments</span>
                        {!selectedUser && <CheckIcon className="!text-[18px] text-primary" />}
                    </button>
                </li>
                {allAuthors.map(author => (
                    <li key={author.name}>
                        <button
                            role="menuitem"
                            onClick={() => {
                                onSelectUser(author.name);
                                onClose();
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-accent flex items-center justify-between text-popover-foreground gap-2"
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                <img src={author.avatarUrl} alt={author.name} className="w-5 h-5 rounded-full" />
                                <span className="truncate">{author.name}</span>
                            </div>
                            {selectedUser === author.name && <CheckIcon className="!text-[18px] text-primary flex-shrink-0" />}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};


interface SidebarHeaderProps {
    isThreadView: boolean;
    onBack: () => void;
    
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
    
    sortOrder: SortOrder;
    setSortOrder: (order: SortOrder) => void;
    isSortOpen: boolean;
    onSortClick: () => void;
    onSortClose: () => void;
    
    filterUser: string | null;
    onSelectUser: (name: string | null) => void;
    allAuthors: User[];
    isFilterOpen: boolean;
    onFilterClick: () => void;
    onFilterClose: () => void;

    resolutionFilter: ResolutionFilter;
    setResolutionFilter: (filter: ResolutionFilter) => void;
    isResolutionFilterOpen: boolean;
    onResolutionFilterClick: () => void;
    onResolutionFilterClose: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ 
    isThreadView, onBack, 
    activeTab, onTabChange, 
    sortOrder, setSortOrder, isSortOpen, onSortClick, onSortClose,
    filterUser, onSelectUser, allAuthors, isFilterOpen, onFilterClick, onFilterClose,
    resolutionFilter, setResolutionFilter, isResolutionFilterOpen, onResolutionFilterClick, onResolutionFilterClose
}) => {
    const tabs: { id: Tab; icon: React.FC<{ className?: string }>; label: string }[] = [
        { id: 'tune', icon: TuneIcon, label: 'Tune' },
        { id: 'info', icon: InfoIcon, label: 'Info' },
        { id: 'comments', icon: ChatIcon, label: 'Comments' },
        { id: 'history', icon: HistoryIcon, label: 'History' },
    ];
    
    const selectedAuthor = allAuthors.find(a => a.name === filterUser);
    
    const resolutionFilterLabels: Record<ResolutionFilter, string> = {
        all: 'All',
        open: 'Unresolved',
        resolved: 'Resolved',
    };
    
    const sortOrderLabels: Record<SortOrder, string> = {
        newest: 'Newest',
        oldest: 'Oldest',
    };

    if (isThreadView) {
        return (
             <header className="flex items-center justify-start p-2 border-b border-border min-h-[57px]">
                <button onClick={onBack} className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground flex items-center gap-1 text-sm font-medium" aria-label="Back to all comments">
                    <ArrowBackIcon className="!text-[20px]" />
                    All Comments
                </button>
            </header>
        )
    }

    return (
        <header>
            <div className="flex items-center border-b border-border" role="tablist" aria-label="Sidebar sections">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex-1 flex justify-center items-center p-3 transition-all duration-200 -mb-px
                            ${
                                activeTab === tab.id
                                    ? 'text-foreground border-b-2 border-primary'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                            }`}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`${tab.id}-panel`}
                        aria-label={tab.label}
                    >
                        <tab.icon className="!text-[20px]" />
                    </button>
                ))}
            </div>

            {activeTab === 'comments' && (
                <div className="flex items-center justify-between p-2 border-b border-border text-sm min-h-[53px]">
                    <div className="flex items-center gap-1">
                        <div className="relative">
                            <button onClick={onFilterClick} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-accent transition-colors text-foreground">
                                {selectedAuthor ? (
                                    <img src={selectedAuthor.avatarUrl} alt={selectedAuthor.name} className="w-5 h-5 rounded-full" />
                                ) : (
                                    <PersonIcon className="!text-[18px] text-muted-foreground" />
                                )}
                                <span className="font-medium max-w-[100px] truncate">{filterUser || 'All Users'}</span>
                            </button>
                            {isFilterOpen && (
                                <div className="absolute top-full left-0 mt-2 z-20">
                                     <UserFilterControl allAuthors={allAuthors} selectedUser={filterUser} onSelectUser={onSelectUser} onClose={onFilterClose} />
                                </div>
                            )}
                        </div>
                         <div className="relative">
                            <button onClick={onResolutionFilterClick} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-accent transition-colors text-foreground">
                                <ChecklistIcon className="!text-[18px] text-muted-foreground" />
                                <span className="font-medium">{resolutionFilterLabels[resolutionFilter]}</span>
                            </button>
                            {isResolutionFilterOpen && (
                                <div className="absolute top-full left-0 mt-2 z-20">
                                     <ResolutionFilterControl currentFilter={resolutionFilter} onSetFilter={setResolutionFilter} onClose={onResolutionFilterClose} />
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <button onClick={onSortClick} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-accent transition-colors text-foreground">
                                <SwapVertIcon className="!text-[18px] text-muted-foreground" />
                                <span className="font-medium">{sortOrderLabels[sortOrder]}</span>
                            </button>
                            {isSortOpen && (
                                <div className="absolute top-full right-0 mt-2 z-20">
                                    <SortControl sortOrder={sortOrder} setSortOrder={setSortOrder} onClose={onSortClose} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};


const CommentInput: React.FC<{
    onAddComment: (text: string, attachmentUrl?: string) => void;
    placeholder: string;
    users: User[];
    activeThreadId: number | null;
}> = ({ onAddComment, placeholder, users, activeThreadId }) => {
    const [commentText, setCommentText] = useState('');
    const [attachmentPreview, setAttachmentPreview] = useState<string | null>(null);
    const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
    const [mentionSuggestions, setMentionSuggestions] = useState<User[]>([]);
    const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLElement>(null);
    const suggestionsListRef = useRef<HTMLUListElement>(null);
    const emojiPickerContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const draftKey = useMemo(() => activeThreadId ? `commentDraft_thread_${activeThreadId}` : 'commentDraft_main', [activeThreadId]);

    // Load draft from localStorage on component mount or when thread changes
    useEffect(() => {
        const savedDraft = localStorage.getItem(draftKey);
        if (savedDraft) {
            setCommentText(savedDraft);
        } else {
            setCommentText(''); // Clear text when switching threads if no draft exists
        }
    }, [draftKey]);

    // Save draft to localStorage whenever text changes
    useEffect(() => {
        if (commentText) {
            localStorage.setItem(draftKey, commentText);
        } else {
            localStorage.removeItem(draftKey); // Clear draft if input is empty
        }
    }, [commentText, draftKey]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowMentionSuggestions(false);
            }
            if (emojiPickerContainerRef.current && !emojiPickerContainerRef.current.contains(event.target as Node)) {
                setIsEmojiPickerOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useLayoutEffect(() => {
        const textarea = inputRef.current;
        if (textarea) {
            textarea.style.height = '0px';
            const scrollHeight = textarea.scrollHeight;
            const maxHeight = 200; // Stop growing at 200px and show scrollbar
            textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
            textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
        }
    }, [commentText]);

    useEffect(() => {
        if (showMentionSuggestions && suggestionsListRef.current) {
            const highlightedElement = suggestionsListRef.current.children[highlightedIndex] as HTMLLIElement;
            if (highlightedElement) {
                highlightedElement.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [highlightedIndex, showMentionSuggestions]);

    const resetInputState = () => {
        setCommentText('');
        setAttachmentFile(null);
        setAttachmentPreview(null);
        setShowMentionSuggestions(false);
        setIsEmojiPickerOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim() || attachmentFile) {
            if (attachmentFile) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result as string;
                    onAddComment(commentText, base64String);
                    resetInputState();
                };
                reader.readAsDataURL(attachmentFile);
            } else {
                onAddComment(commentText);
                resetInputState();
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setCommentText(value);

        const cursorPosition = e.target.selectionStart;
        if (cursorPosition === null) {
            setShowMentionSuggestions(false);
            return;
        }

        const textBeforeCursor = value.substring(0, cursorPosition);
        const lastAt = textBeforeCursor.lastIndexOf('@');

        const isAtStartOrPrecededBySpace = lastAt === 0 || (lastAt > 0 && /\s/.test(textBeforeCursor[lastAt - 1]));

        if (lastAt !== -1 && isAtStartOrPrecededBySpace) {
            const query = textBeforeCursor.substring(lastAt + 1);
            
            const mentionedNames = new Set<string>();
            users.forEach(user => {
                const escapedName = user.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                const regex = new RegExp(`@${escapedName}(?!\\w)`);
                if (regex.test(value)) {
                    mentionedNames.add(user.name);
                }
            });

            const filteredUsers = users.filter(user =>
                user.name.toLowerCase().includes(query.toLowerCase()) && !mentionedNames.has(user.name)
            );

            if (filteredUsers.length > 0) {
                setMentionSuggestions(filteredUsers);
                setShowMentionSuggestions(true);
                setHighlightedIndex(0);
            } else {
                setShowMentionSuggestions(false);
            }
        } else {
            setShowMentionSuggestions(false);
        }
    };

    const handleMentionSelect = (name: string) => {
        const currentText = commentText;
        const cursorPosition = inputRef.current?.selectionStart;

        if (cursorPosition === undefined || cursorPosition === null) return;

        const textBeforeCursor = currentText.substring(0, cursorPosition);
        const lastAt = textBeforeCursor.lastIndexOf('@');
        const textAfterCursor = currentText.substring(cursorPosition);

        const newText = `${currentText.substring(0, lastAt)}@${name} ${textAfterCursor}`;

        setCommentText(newText);
        setShowMentionSuggestions(false);
        setHighlightedIndex(0);

        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
                const newCursorPos = lastAt + 1 + name.length + 1; // for @, name, and trailing space
                inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);
    };
    
    const handleEmojiSelect = (emoji: string) => {
        const textarea = inputRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const newText = text.substring(0, start) + emoji + text.substring(end);
        
        setCommentText(newText);

        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + emoji.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
        setIsEmojiPickerOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (showMentionSuggestions && mentionSuggestions.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlightedIndex(prev => (prev + 1) % mentionSuggestions.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlightedIndex(prev => (prev - 1 + mentionSuggestions.length) % mentionSuggestions.length);
            } else if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                handleMentionSelect(mentionSuggestions[highlightedIndex].name);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                setShowMentionSuggestions(false);
            }
        }
    };

    const handleAtClick = () => {
        const textarea = inputRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        const prefix = (start > 0 && text[start - 1] !== ' ' && text[start - 1] !== '\n') ? ' @' : '@';
        const newText = text.substring(0, start) + prefix + text.substring(end);
        
        setCommentText(newText);
        
        const mentionedNames = new Set<string>();
        users.forEach(user => {
            const escapedName = user.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            const regex = new RegExp(`@${escapedName}(?!\\w)`);
            if (regex.test(newText)) {
                mentionedNames.add(user.name);
            }
        });

        const filteredUsers = users.filter(user => !mentionedNames.has(user.name));
        
        if (filteredUsers.length > 0) {
            setMentionSuggestions(filteredUsers);
            setShowMentionSuggestions(true);
            setHighlightedIndex(0);
        } else {
            setShowMentionSuggestions(false);
        }
        
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + prefix.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const handleAttachClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setAttachmentFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAttachmentPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
        if (e.target) {
            e.target.value = '';
        }
    };

    const handleRemoveAttachment = () => {
        setAttachmentFile(null);
        setAttachmentPreview(null);
    };

    const canSubmit = commentText.trim() || attachmentFile;

    return (
        <footer ref={containerRef} className="p-3 border-t border-border mt-auto relative">
            {showMentionSuggestions && (
                <div className="absolute bottom-full left-3 right-3 mb-2 bg-popover border border-border rounded-lg shadow-xl z-20 p-2 max-h-48 overflow-y-auto">
                    <p className="text-xs font-semibold text-muted-foreground px-2 pb-1">Mention User</p>
                    <ul ref={suggestionsListRef}>
                        {mentionSuggestions.map((user, index) => (
                            <li key={user.name}>
                                <button
                                    type="button"
                                    onClick={() => handleMentionSelect(user.name)}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                    className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors ${index === highlightedIndex ? 'bg-accent' : ''}`}
                                >
                                    <img src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full" />
                                    <span className="text-sm font-medium text-popover-foreground">{user.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div ref={emojiPickerContainerRef}>
                {isEmojiPickerOpen && (
                     <EmojiPicker onSelect={handleEmojiSelect} positionClass="absolute bottom-full right-0 mb-2 z-20" />
                )}
            </div>
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                <div className="relative w-full bg-input rounded-2xl">
                     {attachmentPreview && (
                        <div className="p-3 pb-1">
                            <div className="relative inline-block">
                                <img src={attachmentPreview} alt="Preview" className="max-h-24 rounded-md border border-border" />
                                <button
                                    type="button"
                                    onClick={handleRemoveAttachment}
                                    className="absolute -top-1.5 -right-1.5 bg-muted rounded-full p-0.5 text-muted-foreground hover:bg-red-500 hover:text-white transition-colors"
                                    aria-label="Remove attachment"
                                >
                                    <CloseIcon className="!text-[16px]" />
                                </button>
                            </div>
                        </div>
                    )}
                    <textarea
                        ref={inputRef}
                        rows={1}
                        value={commentText}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="w-full bg-transparent border-transparent rounded-2xl resize-none text-sm text-foreground placeholder-muted-foreground p-3 pr-24 focus:outline-none focus:ring-0 transition-all"
                        style={{ lineHeight: '1.5', minHeight: '52px' }}
                        aria-label="Add a comment"
                    />
                    <div className="absolute right-3 bottom-3 flex items-center text-muted-foreground gap-1">
                        <button type="button" onClick={handleAttachClick} className="p-1.5 rounded-full hover:bg-accent hover:text-foreground transition-colors" aria-label="Attach file">
                            <AttachFileIcon />
                        </button>
                        <button type="button" onClick={handleAtClick} className="p-1.5 rounded-full hover:bg-accent hover:text-foreground transition-colors" aria-label="Mention someone">
                            <AtIcon />
                        </button>
                        <button 
                            type="button" 
                            onClick={() => setIsEmojiPickerOpen(p => !p)}
                            className="p-1.5 rounded-full hover:bg-accent hover:text-foreground transition-colors" 
                            aria-label="Add emoji">
                            <EmojiSmileAddIcon />
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-200
                               disabled:bg-muted disabled:text-muted-foreground/80 disabled:opacity-50 disabled:cursor-not-allowed
                               bg-primary text-primary-foreground hover:bg-primary/90"
                    aria-label="Submit comment"
                >
                    <ArrowUpIcon className="!text-xl" />
                </button>
            </form>
        </footer>
    )
};

export const Sidebar = () => {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState<Tab>('comments');
    const [activeThreadId, setActiveThreadId] = useState<number | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
    const [filterUser, setFilterUser] = useState<string | null>(null);
    const [resolutionFilter, setResolutionFilter] = useState<ResolutionFilter>('all');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isResolutionFilterOpen, setIsResolutionFilterOpen] = useState(false);
    const [visibleRepliesCount, setVisibleRepliesCount] = useState(REPLIES_PAGE_SIZE);


    const commentsContainerRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const [isAddingNewComment, setIsAddingNewComment] = useState(false);

    const fetchData = useCallback(() => {
        setIsLoading(true);
        setError(null);
        // Simulate API call
        setTimeout(() => {
            // To test error state, uncomment the following lines:
            // if (Math.random() > 0.5) {
            //    setError("Failed to fetch comments.");
            //    setIsLoading(false);
            //    return;
            // }

            // To test empty state, pass an empty array: setComments([])
            setComments(initialComments); 
            setIsLoading(false);
        }, 1500);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const mentionableUsers = useMemo(() => {
        const users = new Map<string, User>();
        comments.forEach(comment => {
            if (comment.author.name !== CURRENT_USER) {
                users.set(comment.author.name, comment.author);
            }
        });
        const userList = Array.from(users.values());
        return userList.sort((a,b) => a.name.localeCompare(b.name));
    }, [comments]);

    const allAuthors = useMemo(() => {
        const authors = new Map<string, User>();
        comments.forEach(comment => {
            authors.set(comment.author.name, comment.author);
        });
        return Array.from(authors.values()).sort((a,b) => a.name.localeCompare(b.name));
    }, [comments]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
                setIsFilterOpen(false);
                setIsResolutionFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useLayoutEffect(() => {
        const el = commentsContainerRef.current;
        if (!el) return;

        if (isAddingNewComment) {
             if (sortOrder === 'newest' && !activeThreadId) {
                el.scrollTop = 0;
             } else {
                el.scrollTop = el.scrollHeight;
             }
             setIsAddingNewComment(false);
        }
    }, [comments, isAddingNewComment, sortOrder, activeThreadId]);

     useEffect(() => {
        const el = commentsContainerRef.current;
        if (el) {
            el.scrollTop = 0;
        }
        setVisibleRepliesCount(REPLIES_PAGE_SIZE);
    }, [activeThreadId, filterUser, resolutionFilter]);

    const handleAddComment = (text: string, attachmentUrl?: string, parentId: number | null = null) => {
        const newComment: CommentType = {
            id: Date.now(),
            author: {
                name: CURRENT_USER,
                avatarUrl: getAvatar(CURRENT_USER)
            },
            timestamp: 'Just now',
            createdAt: new Date(),
            text: text,
            reactions: [],
            parentId,
            attachment: attachmentUrl ? { url: attachmentUrl, type: 'image' } : undefined,
        };
        setIsAddingNewComment(true);
        setComments(prev => [...prev, newComment]);
    };

    const handleDeleteComment = (id: number) => {
        const commentIdsToDelete = new Set<number>([id]);
        const findRepliesRecursive = (parentId: number) => {
            comments.forEach(c => {
                if (c.parentId === parentId) {
                    commentIdsToDelete.add(c.id);
                    findRepliesRecursive(c.id);
                }
            });
        };
        findRepliesRecursive(id);

        if (activeThreadId === id) {
            setActiveThreadId(null);
        }

        setComments(prev => prev.filter(c => !commentIdsToDelete.has(c.id)));
    };

    const handleUpdateComment = (id: number, text: string) => {
        setComments(prev => prev.map(c =>
            c.id === id ? { ...c, text, isEdited: true } : c
        ));
    };

    const handleToggleReaction = (commentId: number, emoji: string) => {
        setComments(prev => prev.map(c => {
            if (c.id === commentId) {
                const existingReactionIndex = c.reactions.findIndex(r => r.emoji === emoji && r.user === CURRENT_USER);

                if (existingReactionIndex > -1) {
                    const newReactions = c.reactions.filter((_, index) => index !== existingReactionIndex);
                    return { ...c, reactions: newReactions };
                } else {
                    const newReactions = [...c.reactions, { emoji, user: CURRENT_USER }];
                    return { ...c, reactions: newReactions };
                }
            }
            return c;
        }));
    };
    
    const handleToggleResolve = (id: number) => {
        setComments(prev => prev.map(c =>
            c.id === id ? { ...c, resolved: !c.resolved } : c
        ));
    };

    const handleTogglePinComment = (id: number) => {
        setComments(prev => {
            const isCurrentlyPinned = prev.find(c => c.id === id)?.isPinned;
            return prev.map(c => {
                if (c.id === id) {
                    return { ...c, isPinned: !isCurrentlyPinned };
                }
                if (!isCurrentlyPinned) {
                    return { ...c, isPinned: false };
                }
                return c;
            });
        });
    };

    const getDescendantCount = useCallback((rootId: number): number => {
        const children = comments.filter(comment => comment.parentId === rootId);
        let count = children.length;
        children.forEach(child => {
            count += getDescendantCount(child.id);
        });
        return count;
    }, [comments]);

    const getAllDescendants = useCallback((rootId: number): CommentType[] => {
        const allDescendants: CommentType[] = [];
        const findDescendantsRecursive = (parentId: number) => {
            const children = comments
                .filter(c => c.parentId === parentId)
                .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

            for (const child of children) {
                allDescendants.push(child);
                findDescendantsRecursive(child.id);
            }
        };
        findDescendantsRecursive(rootId);
        return allDescendants;
    }, [comments]);

    const pinnedComment = useMemo(() => comments.find(c => c.isPinned), [comments]);

    const sortedTopLevelComments = useMemo(() => {
        const topLevel = comments.filter(c => !c.parentId && !c.isPinned);

        let filtered = filterUser
            ? topLevel.filter(c => c.author.name === filterUser)
            : topLevel;
        
        if (resolutionFilter === 'open') {
            filtered = filtered.filter(c => !c.resolved);
        } else if (resolutionFilter === 'resolved') {
            filtered = filtered.filter(c => !!c.resolved);
        }

        return [...filtered].sort((a, b) => {
            if (sortOrder === 'newest') {
                return b.createdAt.getTime() - a.createdAt.getTime();
            }
            return a.createdAt.getTime() - b.createdAt.getTime();
        });
    }, [comments, sortOrder, filterUser, resolutionFilter]);


    const renderMainView = () => {
        if (isLoading) return <LoadingState />;
        if (error) return <ErrorState onRetry={fetchData} />;
        
        const isFiltered = filterUser !== null || resolutionFilter !== 'all';
        if (!pinnedComment && sortedTopLevelComments.length === 0) {
            return <EmptyState isFiltered={isFiltered && comments.length > 0} />;
        }

        return (
            <main ref={commentsContainerRef} data-scroll-container="true" className="flex-1 overflow-y-auto">
                {pinnedComment && (
                    <div className="p-4 border-b border-border bg-muted animate-fade-in-up">
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground mb-3 pl-11">
                            <PushPinIcon className="!text-[16px]" />
                            PINNED COMMENT
                        </div>
                        <Comment
                            comment={pinnedComment}
                            currentUser={CURRENT_USER}
                            onDeleteComment={handleDeleteComment}
                            onUpdateComment={handleUpdateComment}
                            onToggleReaction={handleToggleReaction}
                            onToggleResolve={handleToggleResolve}
                            onTogglePin={handleTogglePinComment}
                            onViewThread={() => setActiveThreadId(pinnedComment.id)}
                            replyCount={getDescendantCount(pinnedComment.id)}
                        />
                    </div>
                )}
                <div>
                    {sortedTopLevelComments.map((comment, index) => {
                        const totalReplies = getDescendantCount(comment.id);
                        const isLastComment = index === sortedTopLevelComments.length - 1;
                        return (
                            <div key={comment.id} className={`p-4 ${!isLastComment ? 'border-b border-border' : ''}`}>
                                <Comment
                                    comment={comment}
                                    currentUser={CURRENT_USER}
                                    onDeleteComment={handleDeleteComment}
                                    onUpdateComment={handleUpdateComment}
                                    onToggleReaction={handleToggleReaction}
                                    onToggleResolve={handleToggleResolve}
                                    onTogglePin={handleTogglePinComment}
                                    onViewThread={() => setActiveThreadId(comment.id)}
                                    replyCount={totalReplies}
                                />
                            </div>
                        );
                    })}
                </div>
            </main>
        );
    };

    const renderThreadView = () => {
        const parentComment = comments.find(c => c.id === activeThreadId);
        if (!parentComment) {
            setActiveThreadId(null);
            return renderMainView();
        }

        const allThreadReplies = getAllDescendants(activeThreadId!);
        const visibleReplies = allThreadReplies.slice(0, visibleRepliesCount);
        const remainingRepliesCount = allThreadReplies.length - visibleReplies.length;
        
        const commentsById = new Map(comments.map(c => [c.id, c]));

        const handleLoadMore = () => {
            setVisibleRepliesCount(prev => prev + REPLIES_PAGE_SIZE);
        };

        return (
             <main ref={commentsContainerRef} data-scroll-container="true" className="flex-1 overflow-y-auto">
                <div className="p-4 border-b border-border">
                     <Comment
                        comment={parentComment}
                        currentUser={CURRENT_USER}
                        onDeleteComment={handleDeleteComment}
                        onUpdateComment={handleUpdateComment}
                        onToggleReaction={handleToggleReaction}
                        onToggleResolve={handleToggleResolve}
                        onTogglePin={handleTogglePinComment}
                        onViewThread={() => {}} // Already in thread view
                        replyCount={allThreadReplies.length}
                        isThreadParent={true}
                     />
                 </div>
                 
                 {visibleReplies.length > 0 && (
                    <div className="px-4">
                        {visibleReplies.map((reply) => {
                            const parent = commentsById.get(reply.parentId!);
                            const replyingToAuthor = (parent && parent.id !== activeThreadId) ? parent.author.name : undefined;

                            return (
                                <div key={reply.id} className="py-4">
                                    <div className="relative">
                                        <div className="absolute left-4 top-0 bottom-0 w-px bg-border/40 z-0" aria-hidden="true"></div>
                                        {/* This relative wrapper ensures the comment and its contents create a new stacking context, placing it above the z-0 line. */}
                                        <div className="relative">
                                            <Comment
                                                comment={reply}
                                                currentUser={CURRENT_USER}
                                                onDeleteComment={handleDeleteComment}
                                                onUpdateComment={handleUpdateComment}
                                                onToggleReaction={handleToggleReaction}
                                                onToggleResolve={handleToggleResolve}
                                                onTogglePin={handleTogglePinComment}
                                                onViewThread={() => {}} // Replies in a thread don't open sub-threads
                                                replyCount={0} // No sub-replies shown
                                                replyingToAuthor={replyingToAuthor}
                                                isParentResolved={parentComment.resolved}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                 )}
                 {remainingRepliesCount > 0 && (
                    <div className="px-4 pb-4 text-center">
                         <div className="h-px bg-border my-2 w-1/4 mx-auto"></div>
                         <button 
                            onClick={handleLoadMore} 
                            className="text-sm font-semibold text-sky-500 hover:text-sky-400 p-2 rounded-md"
                        >
                            View {Math.min(remainingRepliesCount, REPLIES_PAGE_SIZE)} more {remainingRepliesCount > 1 ? 'replies' : 'reply'}
                        </button>
                    </div>
                 )}
            </main>
        );
    };

    const renderContent = () => {
        if (activeTab === 'comments') {
            return activeThreadId ? renderThreadView() : renderMainView();
        }
        return (
            <div className="flex-1 flex items-center justify-center p-8 text-center">
                <div>
                    <h2 className="text-xl font-semibold text-muted-foreground">
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Panel
                    </h2>
                    <p className="text-muted-foreground/80 mt-2">
                        Functionality for this section is not yet implemented.
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-background text-sm">
            <div ref={headerRef}>
                 <SidebarHeader
                    isThreadView={!!activeThreadId}
                    onBack={() => setActiveThreadId(null)}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    isSortOpen={isSortOpen}
                    onSortClick={() => { setIsSortOpen(p => !p); setIsFilterOpen(false); setIsResolutionFilterOpen(false); }}
                    onSortClose={() => setIsSortOpen(false)}
                    
                    filterUser={filterUser}
                    onSelectUser={setFilterUser}
                    allAuthors={allAuthors}
                    isFilterOpen={isFilterOpen}
                    onFilterClick={() => { setIsFilterOpen(p => !p); setIsSortOpen(false); setIsResolutionFilterOpen(false); }}
                    onFilterClose={() => setIsFilterOpen(false)}
                    
                    resolutionFilter={resolutionFilter}
                    setResolutionFilter={setResolutionFilter}
                    isResolutionFilterOpen={isResolutionFilterOpen}
                    onResolutionFilterClick={() => { setIsResolutionFilterOpen(p => !p); setIsFilterOpen(false); setIsSortOpen(false); }}
                    onResolutionFilterClose={() => setIsResolutionFilterOpen(false)}
                />
            </div>

            {renderContent()}
            
            {activeTab === 'comments' && (
                <CommentInput
                    onAddComment={(text, attachmentUrl) => handleAddComment(text, attachmentUrl, activeThreadId)}
                    placeholder={activeThreadId ? 'Reply to thread...' : 'Add Comment...'}
                    users={mentionableUsers}
                    activeThreadId={activeThreadId}
                />
            )}
        </div>
    );
};