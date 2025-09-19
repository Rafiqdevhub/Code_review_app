import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { chatApi, isApiError, isRateLimitError } from "@/services/api";
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
  AlertTriangle,
  Mail,
  Clock,
  RefreshCw,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useAuth } from "@/hooks/useAuth";

const formatMessageContent = (content: string) => {
  // Handle undefined or null content
  if (!content) {
    return [
      <span key="empty" className="text-gray-500 italic">
        No content available
      </span>,
    ];
  }

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentCodeBlock: string[] = [];
  let inCodeBlock = false;
  let currentList: string[] = [];
  let inList = false;

  const flushCodeBlock = () => {
    if (currentCodeBlock.length > 0) {
      elements.push(
        <pre
          key={elements.length}
          className="bg-gray-900 text-gray-100 p-3 rounded-md overflow-x-auto my-2 text-sm"
        >
          <code>{currentCodeBlock.join("\n")}</code>
        </pre>
      );
      currentCodeBlock = [];
    }
  };

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul
          key={elements.length}
          className="list-disc list-inside space-y-1 my-2 ml-4"
        >
          {currentList.map((item, idx) => (
            <li key={idx} className="text-sm">
              {item}
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // Check for code block markers
    if (trimmedLine.startsWith("```")) {
      if (inCodeBlock) {
        flushCodeBlock();
        inCodeBlock = false;
      } else {
        if (inList) {
          flushList();
          inList = false;
        }
        inCodeBlock = true;
      }
      return;
    }

    // If we're in a code block, add to it
    if (inCodeBlock) {
      currentCodeBlock.push(line);
      return;
    }

    // Check for list items
    if (trimmedLine.match(/^[-*+]\s+/) || trimmedLine.match(/^\d+\.\s+/)) {
      if (!inList) {
        inList = true;
      }
      currentList.push(
        trimmedLine.replace(/^[-*+]\s+/, "").replace(/^\d+\.\s+/, "")
      );
      return;
    } else if (inList && trimmedLine === "") {
      // Continue list on empty lines
      return;
    } else if (inList) {
      // End of list
      flushList();
      inList = false;
    }

    // Check for headings - treat them as regular text for natural conversation
    if (trimmedLine.startsWith("##")) {
      const headingText = trimmedLine.replace(/^##\s*/, "");
      elements.push(
        <p
          key={elements.length}
          className="mb-2 text-sm leading-relaxed font-medium text-gray-900"
        >
          {headingText}
        </p>
      );
      return;
    }

    if (trimmedLine.startsWith("#")) {
      const headingText = trimmedLine.replace(/^#\s*/, "");
      elements.push(
        <p
          key={elements.length}
          className="mb-2 text-sm leading-relaxed font-medium text-gray-900"
        >
          {headingText}
        </p>
      );
      return;
    }

    // Handle inline code
    if (trimmedLine.includes("`")) {
      const parts = trimmedLine.split(/(`[^`]+`)/);
      const formattedParts = parts.map((part, idx) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={idx}
              className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return part;
      });

      if (trimmedLine) {
        elements.push(
          <p key={elements.length} className="mb-2 text-sm leading-relaxed">
            {formattedParts}
          </p>
        );
      }
      return;
    }

    // Regular paragraph
    if (trimmedLine) {
      elements.push(
        <p key={elements.length} className="mb-2 text-sm leading-relaxed">
          {trimmedLine}
        </p>
      );
    } else if (elements.length > 0) {
      // Add spacing for empty lines
      elements.push(<div key={elements.length} className="mb-2" />);
    }
  });

  // Flush any remaining blocks
  flushCodeBlock();
  flushList();

  return elements.length > 0 ? elements : [content];
};

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
  const { rateLimitStatus, checkRateLimit } = useRateLimit();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Check rate limits when component mounts
  useEffect(() => {
    checkRateLimit();
  }, [checkRateLimit]);

  // Handle rate limit redirection for guests
  useEffect(() => {
    const isDevelopment = import.meta.env.DEV;

    // Skip rate limit redirection in development mode
    if (isDevelopment) {
      return;
    }

    if (!isAuthenticated && rateLimitStatus.isLimited) {
      navigate("/login", {
        state: {
          rateLimitExceeded: true,
          message:
            "Rate limit exceeded. Please login to continue with higher limits.",
        },
        replace: true,
      });
    }
  }, [isAuthenticated, rateLimitStatus.isLimited, navigate]);

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

  // Error handling state
  const [errorDialog, setErrorDialog] = useState<{
    isOpen: boolean;
    type: "rate_limit" | "network" | "server" | "unknown";
    title: string;
    message: string;
    details?: string;
  }>({
    isOpen: false,
    type: "unknown",
    title: "",
    message: "",
  });

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
        content:
          response?.message ||
          "Sorry, I couldn't generate a response. Please try again.",
        timestamp: new Date(),
      };

      setThreads((prev) =>
        prev.map((thread) =>
          thread.id === activeThreadId
            ? {
                ...thread,
                messages: [...thread.messages, assistantMessage],
                lastUpdated: new Date(),
                backendThreadId:
                  response?.threadId || activeThread.backendThreadId, // Store backend thread ID
              }
            : thread
        )
      );

      setIsTyping(false);
    } catch (error) {
      console.error("Failed to send message:", error);
      setIsTyping(false);

      // Handle different types of errors
      if (isRateLimitError(error)) {
        // Show modal for rate limit errors
        setErrorDialog({
          isOpen: true,
          type: "rate_limit",
          title: "Daily Limit Reached",
          message: "You have reached your daily limit for AI requests.",
          details:
            "If you need more requests, please contact us at: rafkhan9323@gmail.com",
        });

        // Also add rate limit message to chat
        const rateLimitMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content:
            "You have reached the daily limit for AI requests. If you need more requests, please contact us at: rafkhan9323@gmail.com",
          timestamp: new Date(),
        };

        setThreads((prev) =>
          prev.map((thread) =>
            thread.id === activeThreadId
              ? {
                  ...thread,
                  messages: [...thread.messages, rateLimitMessage],
                  lastUpdated: new Date(),
                }
              : thread
          )
        );
      } else if (isApiError(error)) {
        // Determine error type based on status code
        let errorType: "network" | "server" | "unknown" = "unknown";
        let title = "Error";
        let message = "An error occurred while sending your message.";

        if (error.status === 503 || error.code === "SERVICE_UNAVAILABLE") {
          errorType = "server";
          title = "Service Unavailable";
          message =
            "The AI service is currently unavailable. Please try again later.";
        } else if (error.status === 408 || error.code === "TIMEOUT") {
          errorType = "network";
          title = "Connection Timeout";
          message =
            "The request timed out. Please check your connection and try again.";
        } else if (error.status && error.status >= 500) {
          errorType = "server";
          title = "Server Error";
          message = "A server error occurred. Please try again later.";
        } else if (!error.status) {
          errorType = "network";
          title = "Network Error";
          message =
            "Unable to connect to the service. Please check your internet connection.";
        }

        // For non-rate-limit errors, show a toast and add error message to chat
        toast({
          title: title,
          description: error.message || message,
          variant: "destructive",
          duration: 5000,
        });

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
      } else {
        // Unknown error
        toast({
          title: "Message Failed",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
          duration: 5000,
        });

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
      }
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
                                    : "bg-white border border-gray-200 shadow-sm"
                                }`}
                              >
                                <div className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                                  {formatMessageContent(message.content)}
                                </div>

                                {message.type === "assistant" && (
                                  <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-gray-100">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        copyMessage(message.content)
                                      }
                                      className="text-gray-600 hover:text-gray-900"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-gray-600 hover:text-gray-900"
                                    >
                                      <ThumbsUp className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-gray-600 hover:text-gray-900"
                                    >
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
                              <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
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

                  <CardContent className="p-4">
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <textarea
                          ref={inputRef}
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Ask about code quality, security, performance, or any programming question..."
                          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
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

      {/* Error Dialog Modal */}
      <AlertDialog
        open={errorDialog.isOpen}
        onOpenChange={(open) =>
          setErrorDialog((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center space-x-2">
              {errorDialog.type === "rate_limit" && (
                <div className="p-2 bg-orange-100 rounded-full">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
              )}
              {errorDialog.type === "network" && (
                <div className="p-2 bg-red-100 rounded-full">
                  <RefreshCw className="h-5 w-5 text-red-600" />
                </div>
              )}
              {(errorDialog.type === "server" ||
                errorDialog.type === "unknown") && (
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
              )}
              <AlertDialogTitle className="text-lg font-semibold">
                {errorDialog.title}
              </AlertDialogTitle>
            </div>
          </AlertDialogHeader>

          <AlertDialogDescription className="text-sm text-gray-600 space-y-3">
            <p>{errorDialog.message}</p>

            {errorDialog.details && (
              <div className="bg-gray-50 p-3 rounded-md border-l-4 border-orange-400">
                <p className="text-sm font-medium text-gray-800 mb-1">
                  Contact Information:
                </p>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {errorDialog.details}
                  </span>
                </div>
              </div>
            )}

            {errorDialog.type === "rate_limit" && (
              <div className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
                <p className="text-sm font-medium text-blue-800 mb-1">
                  What can you do?
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>
                    • Wait for the daily limit to reset (resets at midnight UTC)
                  </li>
                  <li>
                    • Contact us for increased limits if you're a regular user
                  </li>
                  <li>
                    • Use the code review feature which has separate limits
                  </li>
                </ul>
              </div>
            )}

            {errorDialog.type === "network" && (
              <div className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
                <p className="text-sm font-medium text-blue-800 mb-1">
                  Troubleshooting:
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Check your internet connection</li>
                  <li>• Try refreshing the page</li>
                  <li>• Wait a moment and try again</li>
                </ul>
              </div>
            )}

            {(errorDialog.type === "server" ||
              errorDialog.type === "unknown") && (
              <div className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
                <p className="text-sm font-medium text-blue-800 mb-1">
                  What to try:
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Wait a few minutes and try again</li>
                  <li>• Refresh the page</li>
                  <li>• If the problem persists, contact support</li>
                </ul>
              </div>
            )}
          </AlertDialogDescription>

          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            {errorDialog.type === "rate_limit" && errorDialog.details && (
              <AlertDialogAction
                onClick={() => {
                  window.open(
                    `mailto:${errorDialog.details?.replace(
                      "If you need more requests, please contact us at: ",
                      ""
                    )}?subject=Request for Increased AI Chat Limits&body=Hello, I would like to request increased daily limits for the AI chat feature. Thank you!`,
                    "_blank"
                  );
                }}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </AlertDialogAction>
            )}
            <AlertDialogCancel
              onClick={() =>
                setErrorDialog((prev) => ({ ...prev, isOpen: false }))
              }
            >
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AiChat;
