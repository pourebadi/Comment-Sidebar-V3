import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import type { CommentType } from '../types';
import { EmojiSmileAddIcon, MoreVertIcon, EditIcon, CopyLinkIcon, DeleteIcon, ReplyIcon, CheckCircleIcon, ReopenIcon } from './icons';

const parseCommentText = (text: string) => {
    const regex = /(https?:\/\/[^\s]+)|(#[a-zA-Z0-9_]+)|(@[a-zA-Z0-9_ .]+?(?=\s@|\s#|\shttp|\n|$))/g;
    
    const parts = text.split(regex).filter(part => part);

    return parts.map((part, index) => {
        const trimmedPart = part.trim();
        if (trimmedPart.startsWith('http')) {
            return <a key={index} href={trimmedPart} target="_blank" rel="noopener noreferrer" className="text-sky-500 dark:text-sky-400 hover:underline break-all">{part}</a>;
        }
        if (trimmedPart.startsWith('#')) {
            return <span key={index} className="text-violet-600 dark:text-violet-400 cursor-pointer hover:underline">{part}</span>;
        }
        if (trimmedPart.startsWith('@')) {
            return <span key={index} className="text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-500/20 rounded font-medium px-1 cursor-pointer hover:bg-teal-200 dark:hover:bg-teal-500/30 transition-colors">{part}</span>;
        }
        return <span key={index}>{part}</span>
    });
};

const EMOJI_LIST = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🚀', '🎉'];

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [style, setStyle] = useState<React.CSSProperties>({ opacity: 0, pointerEvents: 'none' });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!triggerRef.current) return;
    let parent = triggerRef.current.parentElement;
    while (parent) {
      if (parent.getAttribute('data-scroll-container')) {
        scrollContainerRef.current = parent;
        break;
      }
      parent = parent.parentElement;
    }
  }, []);

  useLayoutEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current && scrollContainerRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipNode = tooltipRef.current;
      const containerRect = scrollContainerRef.current.getBoundingClientRect();
      
      const tooltipWidth = tooltipNode.offsetWidth;
      const tooltipHeight = tooltipNode.offsetHeight;
      const margin = 8;
      
      // --- Vertical Positioning ---
      const spaceAbove = triggerRect.top - containerRect.top;
      const spaceBelow = containerRect.bottom - triggerRect.bottom;
      
      let top;
      if (spaceAbove >= tooltipHeight + margin) {
          top = -tooltipHeight - margin; // Position above
      } else if (spaceBelow >= tooltipHeight + margin) {
          top = triggerRect.height + margin; // Position below
      } else {
          // Stick to container top to be as visible as possible
          top = containerRect.top - triggerRect.top + margin;
      }

      // --- Horizontal Positioning ---
      let left = (triggerRect.width - tooltipWidth) / 2;
      
      const absoluteTooltipLeft = triggerRect.left + left;
      const absoluteTooltipRight = absoluteTooltipLeft + tooltipWidth;
      
      const scrollbarWidth = scrollContainerRef.current.offsetWidth - scrollContainerRef.current.clientWidth;
      const containerRightEdge = containerRect.right - margin - scrollbarWidth; 
      if (absoluteTooltipRight > containerRightEdge) {
        left -= (absoluteTooltipRight - containerRightEdge);
      }
      
      const containerLeftEdge = containerRect.left + margin;
      if (absoluteTooltipLeft < containerLeftEdge) {
        left += (containerLeftEdge - absoluteTooltipLeft);
      }

      setStyle({
        top: `${top}px`,
        left: `${left}px`,
        opacity: 1,
        pointerEvents: 'auto',
        transform: 'translateY(0)',
        transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
      });
    } else {
        setStyle(prev => ({ 
            ...prev,
            opacity: 0, 
            pointerEvents: 'none',
            transform: 'translateY(4px)',
        }));
    }
  }, [isVisible, content]);

  return (
    <div 
      ref={triggerRef}
      className="relative flex items-center" 
      onMouseEnter={() => setIsVisible(true)} 
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <div 
        ref={tooltipRef}
        style={style}
        className="absolute p-2 text-xs text-popover-foreground bg-popover/80 backdrop-blur-sm border border-border rounded-lg shadow-xl z-30 w-48"
        role="tooltip"
      >
        {content}
      </div>
    </div>
  );
};


// FIX: Added optional positionClass prop and made style prop optional to support different positioning strategies.
interface EmojiPickerProps {
    onSelect: (emoji: string) => void;
    style?: React.CSSProperties;
    positionClass?: string;
}

export const EmojiPicker = React.forwardRef<HTMLDivElement, EmojiPickerProps>(({ onSelect, style, positionClass }, ref) => (
    <div ref={ref} style={style} className={`absolute w-auto bg-popover border border-border rounded-lg shadow-xl z-10 p-2 flex gap-2 ${positionClass || ''}`}>
        {EMOJI_LIST.map(emoji => (
            <button
                key={emoji}
                onClick={() => onSelect(emoji)}
                className="text-xl p-1 rounded-md hover:bg-accent transition-colors"
                aria-label={`React with ${emoji}`}
            >
                {emoji}
            </button>
        ))}
    </div>
));
EmojiPicker.displayName = 'EmojiPicker';


interface CommentActionsMenuProps {
    onEdit: () => void;
    onCopy: () => void;
    onDelete: () => void;
    onToggleResolve: () => void;
    isResolved: boolean;
    positionClass: string;
    isConfirmingDelete: boolean;
}

export const CommentActionsMenu: React.FC<CommentActionsMenuProps> = ({ onEdit, onCopy, onDelete, onToggleResolve, isResolved, positionClass, isConfirmingDelete }) => (
    <div className={`absolute w-48 bg-popover border border-border rounded-lg shadow-xl z-10 py-1 ${positionClass}`}>
        <ul aria-label="Comment actions">
            <li>
                <button onClick={onToggleResolve} className="w-full text-left px-3 py-1.5 hover:bg-accent cursor-pointer flex items-center gap-3 text-sm text-popover-foreground">
                    {isResolved ? <ReopenIcon className="!text-[18px] text-muted-foreground" /> : <CheckCircleIcon className="!text-[18px] text-muted-foreground" />}
                    <span>{isResolved ? 'Re-open Comment' : 'Resolve Comment'}</span>
                </button>
            </li>
             <hr className="border-border my-1" />
            <li>
                <button onClick={onEdit} className="w-full text-left px-3 py-1.5 hover:bg-accent cursor-pointer flex items-center gap-3 text-sm">
                    <EditIcon className="!text-[18px] text-muted-foreground" />
                    <span className="text-popover-foreground">Edit Comment</span>
                </button>
            </li>
            <li>
                <button onClick={onCopy} className="w-full text-left px-3 py-1.5 hover:bg-accent cursor-pointer flex items-center gap-3 text-sm">
                    <CopyLinkIcon className="!text-[18px] text-muted-foreground" />
                    <span className="text-popover-foreground">Copy Link</span>
                </button>
            </li>
            <li>
                <button 
                    onClick={onDelete} 
                    className={`w-full text-left px-3 py-1.5 hover:bg-accent cursor-pointer flex items-center gap-3 text-sm ${isConfirmingDelete ? 'text-red-500 font-semibold' : 'text-red-500'}`}
                >
                    <DeleteIcon className={`!text-[18px] ${isConfirmingDelete ? 'text-red-500' : 'text-red-500/80'}`} />
                    <span>{isConfirmingDelete ? 'Confirm Delete?' : 'Delete Comment'}</span>
                </button>
            </li>
        </ul>
    </div>
);

interface CommentProps {
  comment: CommentType;
  currentUser: string;
  onUpdateComment: (id: number, text: string) => void;
  onDeleteComment: (id: number) => void;
  onToggleReaction: (id: number, emoji: string) => void;
  onToggleResolve: (id: number) => void;
  onViewThread: () => void;
  replyCount: number;
  isThreadParent?: boolean;
  replyingToAuthor?: string;
  isParentResolved?: boolean;
  initialIsEditing?: boolean;
}

export const Comment: React.FC<CommentProps> = ({ 
    comment, currentUser, 
    onUpdateComment, onDeleteComment, onToggleReaction, onToggleResolve, onViewThread, 
    replyCount, isThreadParent = false, replyingToAuthor, isParentResolved = false, initialIsEditing = false
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(initialIsEditing);
    const [editedText, setEditedText] = useState(comment.text);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    const [emojiPickerStyle, setEmojiPickerStyle] = useState<React.CSSProperties>({ opacity: 0, pointerEvents: 'none' });
    const [menuPosition, setMenuPosition] = useState('opacity-0 pointer-events-none');
    
    const menuContainerRef = useRef<HTMLDivElement>(null);
    const emojiPickerContainerRef = useRef<HTMLDivElement>(null);
    const editInputRef = useRef<HTMLTextAreaElement>(null);
    const emojiTriggerRef = useRef<HTMLButtonElement>(null);
    const menuTriggerRef = useRef<HTMLButtonElement>(null);
    const scrollContainerRef = useRef<HTMLElement | null>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    const isEffectivelyResolved = !!comment.resolved || isParentResolved;

    // Find the scrollable container once on mount
    useEffect(() => {
        let parent = menuContainerRef.current?.parentElement;
        while (parent) {
            if (parent.getAttribute('data-scroll-container')) {
                scrollContainerRef.current = parent;
                break;
            }
            parent = parent.parentElement;
        }
    }, []);

    // Close popovers when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuContainerRef.current && !menuContainerRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
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
    
    // Focus input when editing starts
    useEffect(() => {
        if(isEditing) {
            editInputRef.current?.focus();
            editInputRef.current?.select();
        }
    }, [isEditing]);

    // Reset delete confirmation when menu closes
    useEffect(() => {
        if (!isMenuOpen) {
            setIsConfirmingDelete(false);
        }
    }, [isMenuOpen]);

    // Dynamic positioning for all popovers
    useLayoutEffect(() => {
        const positionEmojiPicker = () => {
            if (!isEmojiPickerOpen || !emojiTriggerRef.current || !emojiPickerRef.current || !scrollContainerRef.current) {
                setEmojiPickerStyle({ opacity: 0, pointerEvents: 'none', transform: 'translateY(4px)' });
                return;
            }
            const trigger = emojiTriggerRef.current;
            const picker = emojiPickerRef.current;
            const container = scrollContainerRef.current;
            
            const triggerRect = trigger.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            
            const pickerWidth = picker.offsetWidth;
            const pickerHeight = picker.offsetHeight;
            const margin = 8;
            
            if (pickerWidth === 0) return; // Not ready to be positioned

            // --- Vertical Positioning ---
            const spaceAbove = triggerRect.top - containerRect.top;
            const spaceBelow = containerRect.bottom - triggerRect.bottom;
            
            let top;
            if (spaceBelow >= pickerHeight + margin) {
                top = trigger.offsetHeight + margin; // Position below
            } else if (spaceAbove >= pickerHeight + margin) {
                top = -pickerHeight - margin; // Position above
            } else {
                top = containerRect.top - triggerRect.top + margin; // Fallback
            }

            // --- Horizontal Positioning ---
            let left = (trigger.offsetWidth - pickerWidth) / 2;
            
            const absolutePickerLeft = triggerRect.left + left;
            const absolutePickerRight = absolutePickerLeft + pickerWidth;
            
            const scrollbarWidth = container.offsetWidth - container.clientWidth;
            const containerRightEdge = containerRect.right - margin - scrollbarWidth; 
            if (absolutePickerRight > containerRightEdge) {
                left -= (absolutePickerRight - containerRightEdge);
            }
            
            const containerLeftEdge = containerRect.left + margin;
            if (absolutePickerLeft < containerLeftEdge) {
                left += (containerLeftEdge - absolutePickerLeft);
            }

            setEmojiPickerStyle({
                top: `${top}px`,
                left: `${left}px`,
                opacity: 1,
                pointerEvents: 'auto',
                transform: 'translateY(0)',
                transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
            });
        };

        const positionMenu = () => {
             if (!menuTriggerRef.current || !scrollContainerRef.current) return;
            const scrollContainer = scrollContainerRef.current;
            const containerRect = scrollContainer.getBoundingClientRect();
            const buttonRect = menuTriggerRef.current.getBoundingClientRect();
            const menuHeight = 120; // Approximation
            const menuMargin = 8;
            const spaceAbove = buttonRect.top - containerRect.top;
            const spaceBelow = containerRect.bottom - buttonRect.bottom;
            let position = 'top-full right-0 mt-2';
            if (spaceBelow < (menuHeight + menuMargin) && spaceAbove > spaceBelow) {
                position = 'bottom-full right-0 mb-2';
            }
            setMenuPosition(position);
        };
        
        const handleReposition = () => {
            // Use requestAnimationFrame to ensure the browser has painted before we measure.
            requestAnimationFrame(() => {
                if(isEmojiPickerOpen) positionEmojiPicker();
                if(isMenuOpen) positionMenu();
            });
        };
        
        handleReposition(); // Initial position
        
        if (!isEmojiPickerOpen) {
            setEmojiPickerStyle({ opacity: 0, pointerEvents: 'none', transform: 'translateY(4px)' });
        }
        if (!isMenuOpen) {
             setMenuPosition('opacity-0 pointer-events-none');
        }

        const scrollEl = scrollContainerRef.current;
        if (isEmojiPickerOpen || isMenuOpen) {
            scrollEl?.addEventListener('scroll', handleReposition, { passive: true });
            window.addEventListener('resize', handleReposition, { passive: true });
            return () => {
                scrollEl?.removeEventListener('scroll', handleReposition);
                window.removeEventListener('resize', handleReposition);
            };
        }
    }, [isEmojiPickerOpen, isMenuOpen]);

    const handleEdit = () => {
        setIsMenuOpen(false);
        setIsEditing(true);
    };

    const handleCopyLink = () => {
        const link = `${window.location.href.split('#')[0]}#comment-${comment.id}`;
        navigator.clipboard.writeText(link).then(() => {
            setShowCopiedMessage(true);
            setTimeout(() => setShowCopiedMessage(false), 2000);
        });
        setIsMenuOpen(false);
    };

    const handleDelete = () => {
        if (isConfirmingDelete) {
            onDeleteComment(comment.id);
            setIsMenuOpen(false);
        } else {
            setIsConfirmingDelete(true);
        }
    };
    
    const handleToggleResolve = () => {
        onToggleResolve(comment.id);
        setIsMenuOpen(false);
    };

    const handleSaveEdit = () => {
        if (editedText.trim() || comment.attachment) { // Allow saving if there's an attachment, even with empty text
            onUpdateComment(comment.id, editedText);
        }
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditedText(comment.text);
        setIsEditing(false);
    };
    
    const handleSelectEmoji = (emoji: string) => {
        onToggleReaction(comment.id, emoji);
        setIsEmojiPickerOpen(false);
    };

    const groupedReactions = comment.reactions.reduce((acc, reaction) => {
        if (!acc[reaction.emoji]) {
            acc[reaction.emoji] = [];
        }
        acc[reaction.emoji].push(reaction.user);
        return acc;
    }, {} as Record<string, string[]>);

    return (
        <div className={`flex items-start space-x-3 group transition-opacity ${isEffectivelyResolved ? 'opacity-60' : ''}`}>
            <img src={comment.author.avatarUrl} alt={comment.author.name} className="relative z-10 w-8 h-8 rounded-full mt-0.5 object-cover" />
            <div className="flex-1">
                {replyingToAuthor && (
                    <div className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                        <ReplyIcon className="!text-[14px]" />
                        Replying to <span className="font-semibold text-foreground/80">@{replyingToAuthor}</span>
                    </div>
                 )}
                <div className="flex items-center justify-between">
                    <div className="flex items-baseline space-x-2">
                        <span className="font-semibold text-foreground">{comment.author.name}</span>
                        <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                         {comment.isEdited && (
                            <span className="text-xs text-muted-foreground/80">(edited)</span>
                        )}
                        {comment.resolved && (
                             <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-500 font-medium">
                                <CheckCircleIcon className="!text-[14px]" />
                                <span>Resolved</span>
                            </div>
                        )}
                    </div>
                    {!isThreadParent && (
                         <div className="flex items-center text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                            {!isEffectivelyResolved && (
                                <button onClick={onViewThread} className="p-1 rounded-md hover:bg-accent hover:text-foreground transition-colors" aria-label="Reply to comment">
                                    <ReplyIcon className="!text-[20px]" />
                                </button>
                            )}
                            <div className="relative" ref={menuContainerRef}>
                                <button
                                    ref={menuTriggerRef}
                                    onClick={() => setIsMenuOpen(prev => !prev)}
                                    className="p-1 rounded-md hover:bg-accent hover:text-foreground transition-colors relative"
                                    aria-haspopup="true"
                                    aria-expanded={isMenuOpen}
                                    aria-label="More options"
                                >
                                    <MoreVertIcon className="!text-[20px]" />
                                    {showCopiedMessage && <span className="absolute bottom-full mb-1 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">Copied!</span>}
                                </button>
                                {isMenuOpen && <CommentActionsMenu onEdit={handleEdit} onCopy={handleCopyLink} onDelete={handleDelete} onToggleResolve={handleToggleResolve} isResolved={!!comment.resolved} positionClass={menuPosition} isConfirmingDelete={isConfirmingDelete} />}
                            </div>
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <div className="mt-2">
                        <textarea
                            ref={editInputRef}
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            className="w-full bg-input border border-border rounded-md p-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                            rows={3}
                        />
                        <div className="flex items-center gap-2 mt-2">
                            <button onClick={handleSaveEdit} className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90">Save</button>
                            <button onClick={handleCancelEdit} className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-md hover:bg-accent">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <>
                        {comment.text && (
                            <div className="text-foreground/90 mt-1 text-[14px] leading-relaxed whitespace-pre-wrap">
                                {parseCommentText(comment.text)}
                            </div>
                        )}
                         {comment.attachment && (
                            <div className="mt-2">
                                <a href={comment.attachment.url} target="_blank" rel="noopener noreferrer">
                                    <img 
                                        src={comment.attachment.url} 
                                        alt="Comment attachment" 
                                        className="max-w-full rounded-lg border border-border cursor-pointer" 
                                    />
                                </a>
                            </div>
                        )}
                         {!isEffectivelyResolved && (
                            <div className="mt-2 flex items-center flex-wrap gap-2">
                                {Object.entries(groupedReactions).map(([emoji, users]) => {
                                    const isCurrentUserReaction = users.includes(currentUser);
                                    
                                    const mappedUsers = users.map(u => u === currentUser ? 'You' : u)
                                        .sort((a,b) => a === 'You' ? -1 : b === 'You' ? 1 : 0);

                                    const userListContent = (
                                        <div className="text-left">
                                            <div className="font-semibold pb-1.5 mb-1.5 border-b border-border">
                                                Reacted with {emoji}
                                            </div>
                                            <div className="flex flex-col items-start gap-0.5 max-h-32 overflow-y-auto pr-1">
                                                {mappedUsers.map(name => (
                                                    <div key={name} className="truncate w-full">{name}</div>
                                                ))}
                                            </div>
                                        </div>
                                    );

                                    return (
                                        <Tooltip key={emoji} content={userListContent}>
                                            <button 
                                                onClick={() => onToggleReaction(comment.id, emoji)}
                                                className={`flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 focus:ring-offset-background
                                                            ${isCurrentUserReaction 
                                                                ? 'bg-sky-100 dark:bg-sky-500/20 border border-sky-500/50 text-sky-600 dark:text-sky-400' 
                                                                : 'bg-accent border border-transparent hover:border-border text-foreground/70'}`}
                                                aria-label={`Reacted by ${users.length} people`}
                                            >
                                                <span className="text-base">{emoji}</span>
                                                <span className="font-medium">{users.length}</span>
                                            </button>
                                        </Tooltip>
                                    );
                                })}
                                <div className="relative" ref={emojiPickerContainerRef}>
                                    <button ref={emojiTriggerRef} onClick={() => setIsEmojiPickerOpen(p => !p)} className="p-1.5 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center w-7 h-7" aria-label="Add reaction" aria-expanded={isEmojiPickerOpen}>
                                        <EmojiSmileAddIcon className="!text-[18px]" />
                                    </button>
                                    {isEmojiPickerOpen && <EmojiPicker ref={emojiPickerRef} onSelect={handleSelectEmoji} style={emojiPickerStyle} />}
                                </div>
                            </div>
                         )}

                         {replyCount > 0 && !isThreadParent && !isEffectivelyResolved && (
                            <div className="mt-3">
                                <button onClick={onViewThread} className="text-sm font-medium text-sky-500 hover:text-sky-400">
                                     View {replyCount} {replyCount > 1 ? 'replies' : 'reply'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};