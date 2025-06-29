import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { chatApi, isApiError } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import {
  Send,
  Bot,
  User,
  MessageSquare,
  Plus,
  MoreVertical,
  ArrowLeft,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatThread {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  lastUpdated: Date;
  backendThreadId?: string; // For backend thread tracking
}

const AiChat = () => {
  const [threads, setThreads] = useState<ChatThread[]>([
    {
      id: "1",
      title: "Code Review Discussion",
      messages: [
        {
          id: "1",
          type: "assistant",
          content:
            "Hi! I'm your AI code review assistant. I can help you understand code issues, suggest improvements, explain best practices, and answer any programming questions you have. What would you like to discuss?",
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
        },
      ],
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
      lastUpdated: new Date(Date.now() - 1000 * 60 * 30),
    },
  ]);

  const [activeThreadId, setActiveThreadId] = useState<string>("1");
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeThread = threads.find((thread) => thread.id === activeThreadId);

  useEffect(() => {
    scrollToBottom();
  }, [activeThread?.messages]);

  useEffect(() => {
    // Load threads from localStorage on mount
    const savedThreads = localStorage.getItem("chat-threads");
    if (savedThreads) {
      try {
        const parsed = JSON.parse(savedThreads).map(
          (
            thread: ChatThread & {
              createdAt: string;
              lastUpdated: string;
              messages: Array<Message & { timestamp: string }>;
            }
          ) => ({
            ...thread,
            createdAt: new Date(thread.createdAt),
            lastUpdated: new Date(thread.lastUpdated),
            messages: thread.messages.map(
              (msg: Message & { timestamp: string }) => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
              })
            ),
          })
        );
        setThreads(parsed);
      } catch (error) {
        console.error("Failed to load chat threads:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Save threads to localStorage whenever they change
    localStorage.setItem("chat-threads", JSON.stringify(threads));
  }, [threads]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const createNewThread = () => {
    const newThread: ChatThread = {
      id: Date.now().toString(),
      title: "New Conversation",
      messages: [
        {
          id: "1",
          type: "assistant",
          content:
            "Hello! I'm here to help you with code review and programming questions. What would you like to discuss?",
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      lastUpdated: new Date(),
    };

    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
  };

  const deleteThread = (threadId: string) => {
    setThreads((prev) => prev.filter((thread) => thread.id !== threadId));
    if (activeThreadId === threadId) {
      const remainingThreads = threads.filter(
        (thread) => thread.id !== threadId
      );
      if (remainingThreads.length > 0) {
        setActiveThreadId(remainingThreads[0].id);
      } else {
        createNewThread();
      }
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !activeThread) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    // Add user message
    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === activeThreadId
          ? {
              ...thread,
              messages: [...thread.messages, userMessage],
              lastUpdated: new Date(),
              title:
                thread.messages.length === 1
                  ? inputValue.trim().slice(0, 50) + "..."
                  : thread.title,
            }
          : thread
      )
    );

    const messageContent = inputValue.trim();
    setInputValue("");
    setIsTyping(true);

    try {
      // Send message to backend API
      const response = await chatApi.sendMessage({
        message: messageContent,
        threadId: activeThread.backendThreadId,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response.message,
        timestamp: new Date(),
      };

      setThreads((prev) =>
        prev.map((thread) =>
          thread.id === activeThreadId
            ? {
                ...thread,
                messages: [...thread.messages, assistantMessage],
                lastUpdated: new Date(),
                backendThreadId: response.threadId, // Store backend thread ID
              }
            : thread
        )
      );

      setIsTyping(false);
    } catch (error) {
      console.error("Failed to send message:", error);

      let errorMessage = "Failed to send message. Please try again.";
      if (isApiError(error)) {
        errorMessage = error.message;
      }

      toast({
        title: "Message Failed",
        description: errorMessage,
        variant: "destructive",
      });

      // Add error message to chat
      const errorAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "Sorry, I'm having trouble responding right now. Please try again later.",
        timestamp: new Date(),
      };

      setThreads((prev) =>
        prev.map((thread) =>
          thread.id === activeThreadId
            ? {
                ...thread,
                messages: [...thread.messages, errorAssistantMessage],
                lastUpdated: new Date(),
              }
            : thread
        )
      );

      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    AI Chat Assistant
                  </h1>
                  <p className="text-sm text-gray-600">
                    Get instant help with your code
                  </p>
                </div>
              </div>
            </div>

            <Link to="/review">
              <Button variant="outline">Code Review</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Left Sidebar - Thread List */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Conversations</CardTitle>
                  <Button size="sm" onClick={createNewThread}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <div className="space-y-2 p-4 pt-0">
                    {threads.map((thread) => (
                      <div
                        key={thread.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          activeThreadId === thread.id
                            ? "bg-blue-50 border border-blue-200"
                            : "hover:bg-gray-50 border border-transparent"
                        }`}
                        onClick={() => setActiveThreadId(thread.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {thread.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(thread.lastUpdated)} •{" "}
                              {thread.messages.length} messages
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                              >
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => deleteThread(thread.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Chat Interface */}
          <div className="lg:col-span-9">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-purple-600" />
                  <span>{activeThread?.title || "Select a conversation"}</span>
                </CardTitle>
                <CardDescription>
                  Ask questions about code quality, security, performance, and
                  best practices
                </CardDescription>
              </CardHeader>

              {activeThread && (
                <>
                  {/* Messages Area */}
                  <CardContent className="flex-1 p-0">
                    <ScrollArea className="h-[calc(100vh-400px)] px-6">
                      <div className="space-y-6 py-4">
                        {activeThread.messages.map((message) => (
                          <div key={message.id} className="flex space-x-3">
                            <div
                              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                message.type === "user"
                                  ? "bg-blue-100"
                                  : "bg-purple-100"
                              }`}
                            >
                              {message.type === "user" ? (
                                <User className="h-5 w-5 text-blue-600" />
                              ) : (
                                <Bot className="h-5 w-5 text-purple-600" />
                              )}
                            </div>

                            <div className="flex-1 space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-900">
                                  {message.type === "user"
                                    ? "You"
                                    : "AI Assistant"}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatTime(message.timestamp)}
                                </span>
                              </div>

                              <div
                                className={`p-3 rounded-lg ${
                                  message.type === "user"
                                    ? "bg-blue-50 border border-blue-200"
                                    : "bg-gray-50 border border-gray-200"
                                }`}
                              >
                                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                                  {message.content}
                                </p>

                                {message.type === "assistant" && (
                                  <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-gray-200">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        copyMessage(message.content)
                                      }
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <ThumbsUp className="h-3 w-3" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <ThumbsDown className="h-3 w-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}

                        {isTyping && (
                          <div className="flex space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                              <Bot className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-sm font-medium text-gray-900">
                                  AI Assistant
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  Typing...
                                </Badge>
                              </div>
                              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                  </CardContent>

                  <Separator />

                  {/* Input Area */}
                  <CardContent className="p-4">
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <textarea
                          ref={inputRef}
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Ask about code quality, security, performance, or any programming question..."
                          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          rows={3}
                          disabled={isTyping}
                        />
                      </div>
                      <Button
                        onClick={sendMessage}
                        disabled={!inputValue.trim() || isTyping}
                        className="self-end"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <span>Press Enter to send, Shift+Enter for new line</span>
                      <span>{inputValue.length}/2000</span>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChat;
