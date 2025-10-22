import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Send, Search, Paperclip, File, Image as ImageIcon, X, Settings, Phone, Video, MoreVertical, ArrowLeft, Check, CheckCheck, Smile, Mic, Reply, Forward, Trash2, Copy, Star } from 'lucide-react';
import { ManageChannelsDialog } from './ManageChannelsDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface ChatSectionProps {
  userRole: 'team' | 'campus_lead';
}

interface Message {
  id: number;
  sender: string;
  role: 'team' | 'campus_lead';
  content: string;
  timestamp: string;
  time: string;
  date: string;
  file?: {
    name: string;
    type: 'image' | 'file' | 'voice';
    url?: string;
    duration?: string;
  };
  read: boolean;
  starred?: boolean;
  replyTo?: {
    id: number;
    sender: string;
    content: string;
  };
}

interface Channel {
  id: number;
  name: string;
  type: 'team' | 'campus_leads' | 'general';
  unread: number;
  lastMessage: string;
  lastMessageTime: string;
  avatar?: string;
  online?: boolean;
  typing?: boolean;
}

const channels: Channel[] = [
  { id: 1, name: 'Team Announcements', type: 'team', unread: 3, lastMessage: 'New cohort starting next month', lastMessageTime: '10:30 AM', online: true },
  { id: 2, name: 'Campus Leads - Telangana', type: 'campus_leads', unread: 5, lastMessage: 'Info session scheduled', lastMessageTime: '11:45 AM', online: true, typing: false },
  { id: 3, name: 'Campus Leads - Maharashtra', type: 'campus_leads', unread: 0, lastMessage: 'Great turnout today!', lastMessageTime: 'Yesterday', online: false },
  { id: 4, name: 'EVP A25 Coordinators', type: 'general', unread: 2, lastMessage: 'Interview dates confirmed', lastMessageTime: '9:15 AM', online: true },
  { id: 5, name: 'EdAstra Team', type: 'team', unread: 1, lastMessage: 'Workshop materials ready', lastMessageTime: '2 days ago', online: false },
];

const mockMessages: Message[] = [
  {
    id: 1,
    sender: 'Sarah',
    role: 'team',
    content: 'Hi everyone! We have confirmed the dates for the EVP A25 preliminary interviews.',
    timestamp: '10:30 AM',
    time: '10:30',
    date: '2025-10-22',
    read: true,
  },
  {
    id: 2,
    sender: 'Priya',
    role: 'campus_lead',
    content: 'That\'s great! We have around 30 students interested from our campus.',
    timestamp: '10:35 AM',
    time: '10:35',
    date: '2025-10-22',
    read: true,
  },
  {
    id: 3,
    sender: 'Rahul',
    role: 'campus_lead',
    content: 'We organized an info session yesterday. Got excellent response with 45+ registrations!',
    timestamp: '10:42 AM',
    time: '10:42',
    date: '2025-10-22',
    read: true,
    starred: true,
  },
  {
    id: 4,
    sender: 'Michael',
    role: 'team',
    content: 'Fantastic work! Make sure all students complete the application form by October 20th.',
    timestamp: '11:15 AM',
    time: '11:15',
    date: '2025-10-22',
    read: true,
  },
  {
    id: 5,
    sender: 'Ananya',
    role: 'campus_lead',
    content: 'Can we get the pitch workshop materials? Students are asking for preparation resources.',
    timestamp: '11:30 AM',
    time: '11:30',
    date: '2025-10-22',
    read: false,
    file: {
      name: 'Workshop_Guide.pdf',
      type: 'file',
    },
  },
  {
    id: 6,
    sender: 'You',
    role: 'team',
    content: 'I\'ll share the materials in a few minutes.',
    timestamp: '11:32 AM',
    time: '11:32',
    date: '2025-10-22',
    read: true,
    replyTo: {
      id: 5,
      sender: 'Ananya',
      content: 'Can we get the pitch workshop materials?',
    },
  },
];

export function ChatSection({ userRole }: ChatSectionProps) {
  const [selectedChannel, setSelectedChannel] = useState<Channel>(channels[1]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [channelsList, setChannelsList] = useState<Channel[]>(channels);
  const [showManageChannels, setShowManageChannels] = useState(false);
  const [showChannelList, setShowChannelList] = useState(true);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const filteredChannels = channelsList.filter(channel => 
    userRole === 'team' || channel.type !== 'team'
  ).filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateChannels = (updatedChannels: Channel[]) => {
    setChannelsList(updatedChannels);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() || selectedFile) {
      const now = new Date();
      const newMsg: Message = {
        id: Date.now(),
        sender: 'You',
        role: userRole,
        content: newMessage.trim() || (selectedFile ? `Sent ${selectedFile.name}` : ''),
        timestamp: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        date: now.toISOString().split('T')[0],
        read: false,
        replyTo: replyingTo ? {
          id: replyingTo.id,
          sender: replyingTo.sender,
          content: replyingTo.content,
        } : undefined,
        file: selectedFile ? {
          name: selectedFile.name,
          type: selectedFile.type.startsWith('image/') ? 'image' : 'file',
          url: URL.createObjectURL(selectedFile),
        } : undefined,
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
      setSelectedFile(null);
      setReplyingTo(null);
      
      // Simulate message being read after 2 seconds
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === newMsg.id ? { ...msg, read: true } : msg
        ));
      }, 2000);
    }
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
  };

  const handleDelete = (messageId: number) => {
    setMessages(messages.filter(msg => msg.id !== messageId));
  };

  const handleStar = (messageId: number) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, starred: !msg.starred } : msg
    ));
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach(msg => {
      if (!groups[msg.date]) {
        groups[msg.date] = [];
      }
      groups[msg.date].push(msg);
    });
    return groups;
  };

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
  };

  const messageGroups = groupMessagesByDate(messages);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-[calc(100vh-12rem)] flex bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Channels Sidebar - EdVenture Park Theme */}
      <div className={`${showChannelList ? 'w-full md:w-96' : 'hidden md:block md:w-96'} border-r border-gray-200 flex flex-col bg-gray-50`}>
        {/* Sidebar Header */}
        <div className="bg-cyan-700 text-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl">Chats</h2>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-cyan-600 h-8 w-8 p-0"
                onClick={() => setShowManageChannels(true)}
                title="Manage Channels"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 bg-white border-b">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-gray-100 border-none"
            />
          </div>
        </div>

        {/* Channel List */}
        <ScrollArea className="flex-1">
          <div className="divide-y divide-gray-200">
            {filteredChannels.map(channel => (
              <button
                key={channel.id}
                onClick={() => {
                  setSelectedChannel(channel);
                  setShowChannelList(false);
                }}
                className={`w-full text-left p-4 transition-colors hover:bg-gray-100 ${
                  selectedChannel.id === channel.id
                    ? 'bg-gray-200'
                    : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-cyan-600 text-white">
                        {channel.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {channel.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="truncate">{channel.name}</p>
                      <span className="text-xs text-gray-500">{channel.lastMessageTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      {channel.typing ? (
                        <p className="text-sm text-cyan-600 italic">typing...</p>
                      ) : (
                        <p className="text-sm text-gray-600 truncate flex-1">
                          {channel.lastMessage}
                        </p>
                      )}
                      {channel.unread > 0 && (
                        <Badge className="bg-cyan-600 text-white rounded-full h-5 min-w-5 flex items-center justify-center text-xs ml-2">
                          {channel.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area - EdVenture Park Theme */}
      <div className={`${!showChannelList ? 'w-full' : 'hidden md:flex md:flex-1'} flex flex-col bg-gray-50`}>
        {/* Chat Header */}
        <div className="bg-cyan-700 text-white p-3 flex items-center gap-3 shadow">
          <Button
            size="sm"
            variant="ghost"
            className="md:hidden text-white hover:bg-cyan-600 h-8 w-8 p-0"
            onClick={() => setShowChannelList(true)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-white text-cyan-700">
                {selectedChannel.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {selectedChannel.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-cyan-700 rounded-full"></div>
            )}
          </div>
          <div className="flex-1">
            <h3>{selectedChannel.name}</h3>
            <p className="text-xs text-cyan-100">
              {selectedChannel.typing ? 'typing...' : selectedChannel.online ? 'online' : 'offline'}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" className="text-white hover:bg-cyan-600 h-8 w-8 p-0">
              <Video className="h-5 w-5" />
            </Button>
            <Button size="sm" variant="ghost" className="text-white hover:bg-cyan-600 h-8 w-8 p-0">
              <Phone className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-white hover:bg-cyan-600 h-8 w-8 p-0 rounded inline-flex items-center justify-center">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowManageChannels(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Channel Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-br from-cyan-50 via-white to-blue-50" ref={scrollAreaRef}>
          <div className="space-y-4 max-w-4xl mx-auto">
            {Object.entries(messageGroups).map(([date, dateMessages]) => (
              <div key={date}>
                {/* Date Separator */}
                <div className="flex items-center justify-center my-4">
                  <div className="bg-white shadow-sm px-3 py-1 rounded-lg text-xs text-gray-600">
                    {formatDateLabel(date)}
                  </div>
                </div>

                {/* Messages for this date */}
                {dateMessages.map(message => {
                  const isCurrentUser = message.sender === 'You' || message.role === userRole;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}
                    >
                      <div className={`max-w-[70%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <div
                              className={`rounded-lg p-3 shadow cursor-pointer transition-all hover:shadow-md ${
                                isCurrentUser
                                  ? 'bg-cyan-100 rounded-tr-none'
                                  : 'bg-white rounded-tl-none'
                              } ${message.starred ? 'ring-2 ring-yellow-400' : ''}`}
                            >
                              {message.replyTo && (
                                <div className={`mb-2 p-2 rounded border-l-4 ${
                                  isCurrentUser ? 'bg-cyan-200 border-cyan-600' : 'bg-gray-100 border-gray-400'
                                }`}>
                                  <p className="text-xs text-cyan-700">{message.replyTo.sender}</p>
                                  <p className="text-xs text-gray-700 truncate">{message.replyTo.content}</p>
                                </div>
                              )}
                              {!isCurrentUser && (
                                <p className="text-xs mb-1 text-cyan-700">
                                  {message.sender}
                                </p>
                              )}
                              <p className="text-sm text-gray-900 break-words">
                                {message.content}
                              </p>
                              {message.file && (
                                <div className="mt-2">
                                  {message.file.type === 'image' && message.file.url ? (
                                    <div className="rounded overflow-hidden max-w-xs">
                                      <img 
                                        src={message.file.url} 
                                        alt={message.file.name}
                                        className="w-full h-auto"
                                      />
                                      <div className={`p-2 text-xs ${isCurrentUser ? 'bg-cyan-200' : 'bg-gray-100'}`}>
                                        {message.file.name}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className={`p-2 rounded flex items-center gap-2 ${
                                      isCurrentUser ? 'bg-cyan-200' : 'bg-gray-100'
                                    }`}>
                                      {message.file.type === 'voice' ? (
                                        <Mic className="h-4 w-4" />
                                      ) : (
                                        <File className="h-4 w-4" />
                                      )}
                                      <span className="text-xs flex-1">{message.file.name}</span>
                                      {message.file.duration && (
                                        <span className="text-xs text-gray-600">{message.file.duration}</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                              <div className="flex items-center justify-end gap-1 mt-1">
                                {message.starred && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                                <span className="text-xs text-gray-600">{message.time}</span>
                                {isCurrentUser && (
                                  message.read ? (
                                    <CheckCheck className="h-4 w-4 text-cyan-600" />
                                  ) : (
                                    <Check className="h-4 w-4 text-gray-500" />
                                  )
                                )}
                              </div>
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align={isCurrentUser ? 'end' : 'start'}>
                            <DropdownMenuItem onClick={() => handleReply(message)}>
                              <Reply className="h-4 w-4 mr-2" />
                              Reply
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStar(message.id)}>
                              <Star className="h-4 w-4 mr-2" />
                              {message.starred ? 'Unstar' : 'Star'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCopy(message.content)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Copy
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {}}>
                              <Forward className="h-4 w-4 mr-2" />
                              Forward
                            </DropdownMenuItem>
                            {isCurrentUser && (
                              <DropdownMenuItem onClick={() => handleDelete(message.id)} className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-lg p-3 shadow">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reply Preview */}
        {replyingTo && (
          <div className="bg-cyan-50 border-t border-cyan-200 p-2 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-cyan-700">Replying to {replyingTo.sender}</p>
              <p className="text-sm text-gray-700 truncate">{replyingTo.content}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(null)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Message Input Area */}
        <div className="bg-white p-3 border-t">
          {selectedFile && (
            <div className="mb-2 p-2 bg-cyan-50 rounded-lg shadow">
              {selectedFile.type.startsWith('image/') ? (
                <div className="flex items-start gap-2">
                  <img 
                    src={URL.createObjectURL(selectedFile)} 
                    alt="Preview" 
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-cyan-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <button className="h-10 w-10 rounded-full hover:bg-gray-100 inline-flex items-center justify-center">
                  <Smile className="h-5 w-5 text-gray-600" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid grid-cols-8 gap-2">
                  {['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒'].map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setNewMessage(newMessage + emoji)}
                      className="text-2xl hover:bg-gray-100 rounded p-1"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileSelect}
              accept="image/*,.pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => document.getElementById('file-upload')?.click()}
              className="h-10 w-10 rounded-full hover:bg-gray-100"
            >
              <Paperclip className="h-5 w-5 text-gray-600" />
            </Button>
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                // Simulate typing indicator
                if (e.target.value.length > 0 && !isTyping) {
                  setIsTyping(false);
                }
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 rounded-full border-gray-300 bg-gray-50 focus:bg-white"
            />
            {newMessage.trim() || selectedFile ? (
              <Button 
                onClick={handleSendMessage} 
                className="h-10 w-10 rounded-full bg-cyan-600 hover:bg-cyan-700 p-0"
              >
                <Send className="h-5 w-5" />
              </Button>
            ) : (
              <Button 
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-gray-100"
              >
                <Mic className="h-5 w-5 text-gray-600" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <ManageChannelsDialog
        open={showManageChannels}
        onOpenChange={setShowManageChannels}
        channels={channelsList}
        onUpdate={handleUpdateChannels}
      />
    </div>
  );
}
