"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../../auth/login/actions";
import {
  AdminSidebar,
  AdminHeader,
  AdminMobileNav,
} from "@/app/components/admin";
import { Card, Badge, Button } from "@/app/components/ui";
import { Mail, Trash2, Eye, CheckCircle } from "lucide-react";
import type { Message } from "@/types";

export default function MailPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check", {
          credentials: "include",
        });
        if (!response.ok) {
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/auth/login");
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/messages", {
        headers: {
          authorization: "Bearer token",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = (id: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
    );
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage({ ...selectedMessage, read: true });
    }
  };

  const handleDelete = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const unreadCount = messages.filter((msg) => !msg.read).length;

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-linear-to-r from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-r from-gray-900 to-gray-800">
      {/* Mobile Navigation */}
      <AdminMobileNav onLogout={handleLogout} title="EastStore" />

      {/* Desktop Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Desktop Header */}
      <AdminHeader
        isSidebarOpen={isSidebarOpen}
        onLogout={handleLogout}
        title="Messages"
      />

      {/* Main Content */}
      <main
        className="transition-all duration-300 ease-in-out pt-16 md:pt-16"
        style={{
          marginLeft: isMobile ? "0" : isSidebarOpen ? "256px" : "80px",
        }}
      >
        <div className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                  <Mail size={32} className="text-blue-400" />
                  Incoming Messages
                </h1>
                <p className="text-gray-300 mt-1">
                  {messages.length} total messages
                  {unreadCount > 0 && (
                    <span className="text-amber-400 ml-2">
                      ({unreadCount} unread)
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Messages List */}
              <div className="lg:col-span-1">
                <Card
                  variant="default"
                  className="p-4 max-h-[600px] overflow-y-auto bg-white/10 backdrop-blur-md border border-white/20"
                >
                  {isLoading ? (
                    <div className="text-center py-8">
                      <p className="text-gray-300">Loading messages...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-8">
                      <Mail size={40} className="mx-auto text-gray-500 mb-3" />
                      <p className="text-gray-300">No messages yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {messages.map((message) => (
                        <button
                          key={message.id}
                          onClick={() => setSelectedMessage(message)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            selectedMessage?.id === message.id
                              ? "bg-blue-500/30 border border-blue-500/50 text-white"
                              : "bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold truncate">
                                  {message.firstName} {message.lastName}
                                </p>
                                {!message.read && (
                                  <div className="w-2 h-2 bg-amber-400 rounded-full shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-gray-400 truncate">
                                {message.subject}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </Card>
              </div>

              {/* Message Detail */}
              <div className="lg:col-span-2">
                {selectedMessage ? (
                  <Card
                    variant="default"
                    className="p-6 bg-white/10 backdrop-blur-md border border-white/20"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h2 className="text-3xl font-bold text-white mb-2">
                          {selectedMessage.subject}
                        </h2>
                        <div className="flex items-center gap-3 text-gray-300">
                          <span className="font-semibold text-white">
                            {selectedMessage.firstName}{" "}
                            {selectedMessage.lastName}
                          </span>
                          <span>•</span>
                          <span>{selectedMessage.email}</span>
                          <span>•</span>
                          <span className="text-sm">
                            {formatDate(selectedMessage.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!selectedMessage.read && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsRead(selectedMessage.id)}
                            className="flex items-center gap-2"
                          >
                            <Eye size={16} />
                            Mark as Read
                          </Button>
                        )}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(selectedMessage.id)}
                          className="flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          Delete
                        </Button>
                      </div>
                    </div>

                    <div className="mb-6">
                      {selectedMessage.read && (
                        <div className="mb-4">
                          <Badge variant="success" size="sm">
                            <CheckCircle size={14} className="mr-1" />
                            Read
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="prose prose-sm max-w-none">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-6 text-gray-200 whitespace-pre-wrap">
                        {selectedMessage.message}
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <p className="text-blue-300 text-sm">
                        💡 Tip: You can reply to this message by sending an
                        email to{" "}
                        <span className="font-semibold">
                          {selectedMessage.email}
                        </span>
                      </p>
                    </div>
                  </Card>
                ) : (
                  <Card
                    variant="default"
                    className="p-8 text-center bg-white/10 backdrop-blur-md border border-white/20"
                  >
                    <Mail size={48} className="mx-auto text-gray-500 mb-4" />
                    <p className="text-gray-300 text-lg">
                      Select a message to view details
                    </p>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
