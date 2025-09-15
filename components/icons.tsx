import React from 'react';

interface IconProps {
  className?: string;
  children: string; // Material symbol name
}

const MaterialIcon: React.FC<IconProps> = ({ className = '', children }) => (
  <span className={`material-symbols-outlined ${className}`}>
    {children}
  </span>
);

export const TuneIcon: React.FC<{ className?: string }> = ({ className }) => <MaterialIcon className={className}>tune</MaterialIcon>;
export const InfoIcon: React.FC<{ className?: string }> = ({ className }) => <MaterialIcon className={className}>info</MaterialIcon>;
export const ChatIcon: React.FC<{ className?: string }> = ({ className }) => <MaterialIcon className={className}>chat_bubble</MaterialIcon>;
export const HistoryIcon: React.FC<{ className?: string }> = ({ className }) => <MaterialIcon className={className}>history</MaterialIcon>;
export const AtIcon: React.FC<{ className?: string }> = ({ className }) => <MaterialIcon className={className}>alternate_email</MaterialIcon>;
export const EmojiSmileAddIcon: React.FC<{ className?: string }> = ({ className }) => <MaterialIcon className={className}>add_reaction</MaterialIcon>;
export const ArrowUpIcon: React.FC<{ className?: string }> = ({ className }) => <MaterialIcon className={className}>arrow_upward</MaterialIcon>;
export const EmojiIcon: React.FC<{ className?: string }> = ({ className }) => <MaterialIcon className={className}>sentiment_satisfied</MaterialIcon>;

export const MoreVertIcon: React.FC<{ className?: string }> = ({ className }) => <MaterialIcon className={className}>more_vert</MaterialIcon>;
export const EditIcon: React.FC<{ className?: string }> = ({ className }) => <MaterialIcon className={className}>edit</MaterialIcon>;
export const CopyLinkIcon: React.FC<{ className?: string }> = ({ className }) => <MaterialIcon className={className}>content_copy</MaterialIcon>;
export const DeleteIcon: React.FC<{ className?: string }> = ({ className }) => <MaterialIcon className={className}>delete</MaterialIcon>;
export const ReplyIcon: React.FC<{ className?: string }> = ({ className }) => <MaterialIcon className={className}>reply</MaterialIcon>;

export const LightModeIcon: React.FC<{ className?: string }> = ({ className }) => <MaterialIcon className={className}>light_mode</MaterialIcon>;
export const DarkModeIcon: React.FC<{ className?: string }> = ({ className }) => <MaterialIcon className={className}>dark_mode</MaterialIcon>;

// FIX: Corrected closing tag from </Icon> to </MaterialIcon>
export const ArrowBackIcon: React.FC<{ className?: string }> = ({ className }) => <MaterialIcon className={className}>arrow_back</MaterialIcon>;

export const SwapVertIcon: React.FC<{ className?: string }> = ({ className }) => <MaterialIcon className={className}>swap_vert</MaterialIcon>;
export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => <MaterialIcon className={className}>check</MaterialIcon>;
export const PersonIcon: React.FC<{ className?: string }> = ({ className }) => <MaterialIcon className={className}>person</MaterialIcon>;
export const SendIcon: React.FC<{ className?: string }> = ({ className }) => <MaterialIcon className={className}>send</MaterialIcon>;

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => <MaterialIcon className={className}>check_circle</MaterialIcon>;
export const ReopenIcon: React.FC<{ className?: string }> = ({ className }) => <MaterialIcon className={className}>replay</MaterialIcon>;
export const ChecklistIcon: React.FC<{ className?: string }> = ({ className }) => <MaterialIcon className={className}>checklist</MaterialIcon>;

export const AttachFileIcon: React.FC<{ className?: string }> = ({ className }) => <MaterialIcon className={className}>attach_file</MaterialIcon>;
export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => <MaterialIcon className={className}>close</MaterialIcon>;
