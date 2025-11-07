import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Video, 
  Phone, 
  Mail, 
  Calendar,
  TrendingUp,
  Users,
  Clock,
  Bot,
  Search,
  Filter,
  Download
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Communication {
  id: string;
  type: "meeting" | "chat" | "email" | "call";
  title: string;
  participants: string[];
  date: string;
  duration: string;
  summary: string;
  sentiment: "positive" | "neutral" | "negative";
  followUp?: boolean;
  tags: string[];
}

const Communications = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const communications: Communication[] = [
    {
      id: "1",
      type: "meeting",
      title: "Project Phoenix Sprint Planning",
      participants: ["Sarah Chen", "Alex Kumar", "Maria Rodriguez", "John Smith"],
      date: "2025-11-15",
      duration: "45 min",
      summary: "Discussed sprint goals for next 2 weeks. Focus on authentication module completion and API integration. Team capacity at 73%, two developers available for additional tasks.",
      sentiment: "positive",
      followUp: true,
      tags: ["sprint", "planning", "capacity"]
    },
    {
      id: "2",
      type: "chat",
      title: "Slack Channel Discussion",
      participants: ["Dev Team"],
      date: "2025-11-14",
      duration: "2h",
      summary: "Active discussion about deployment pipeline improvements. Consensus reached on implementing automated testing. Urgent feedback requested on database migration strategy.",
      sentiment: "neutral",
      tags: ["deployment", "automation"]
    },
    {
      id: "3",
      type: "email",
      title: "Client Feedback on UI Design",
      participants: ["client@techcorp.com"],
      date: "2025-11-14",
      duration: "One-time",
      summary: "Client requested minor adjustments to dashboard layout and color scheme. Priority: Medium. Deadline: End of week.",
      sentiment: "neutral",
      followUp: true,
      tags: ["client", "design", "feedback"]
    },
    {
      id: "4",
      type: "call",
      title: "Emergency Escalation Call",
      participants: ["Alex Kumar", "Project Manager"],
      date: "2025-11-13",
      duration: "20 min",
      summary: "Database connectivity issues reported. Immediate action required. Alex assigned to investigate. Status update required by EOD.",
      sentiment: "negative",
      followUp: true,
      tags: ["urgent", "escalation", "database"]
    },
    {
      id: "5",
      type: "meeting",
      title: "Quarterly Review Meeting",
      participants: ["All Team Members", "Stakeholders"],
      date: "2025-11-12",
      duration: "1h 30min",
      summary: "Reviewed Q4 progress. 94% on-time delivery rate achieved. Discussed resource allocation for upcoming projects. Team burnout risk identified for 2 members.",
      sentiment: "positive",
      tags: ["review", "quarterly", "resource"]
    },
    {
      id: "6",
      type: "chat",
      title: "Daily Standup Summary",
      participants: ["Sprint Team"],
      date: "2025-11-12",
      duration: "15 min",
      summary: "All team members present. Progress on track. No blockers identified. Feature requests for next sprint discussed.",
      sentiment: "positive",
      tags: ["standup", "daily"]
    },
  ];

  const getTypeIcon = (type: string) => {
    const icons = {
      meeting: Video,
      chat: MessageSquare,
      email: Mail,
      call: Phone,
    };
    return icons[type as keyof typeof icons];
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      meeting: "Meeting",
      chat: "Chat",
      email: "Email",
      call: "Call",
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getSentimentBadge = (sentiment: string) => {
    const variants = {
      positive: "bg-green-500/10 text-green-700 border-green-500/20",
      neutral: "bg-blue-500/10 text-blue-700 border-blue-500/20",
      negative: "bg-red-500/10 text-red-700 border-red-500/20",
    };
    return variants[sentiment as keyof typeof variants] || variants.neutral;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      weekday: "short",
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  const filteredCommunications = communications.filter((comm) => {
    const matchesSearch = 
      comm.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comm.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comm.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === "all" || comm.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalCommunications = communications.length;
  const positiveSentiment = communications.filter(c => c.sentiment === "positive").length;
  const averageParticipants = Math.round(
    communications.reduce((sum, c) => sum + c.participants.length, 0) / communications.length
  );
  const followUpsCount = communications.filter(c => c.followUp).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Bot className="w-8 h-8 text-primary" />
              Communications & AI Insights
            </h1>
            <p className="text-muted-foreground text-lg">
              AI-powered summaries, sentiment analysis, and action items
            </p>
          </div>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Communications</CardDescription>
              <CardTitle className="text-3xl">{totalCommunications}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3 text-primary" />
                Last 30 days
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Positive Sentiment</CardDescription>
              <CardTitle className="text-3xl">{positiveSentiment}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                {Math.round((positiveSentiment / totalCommunications) * 100)}% positive
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Avg Participants</CardDescription>
              <CardTitle className="text-3xl">{averageParticipants}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Users className="w-3 h-3 text-accent" />
                Per interaction
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Follow-ups Required</CardDescription>
              <CardTitle className="text-3xl">{followUpsCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3 text-yellow-600" />
                Action needed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Communications</TabsTrigger>
              <TabsTrigger value="meetings">Meetings</TabsTrigger>
              <TabsTrigger value="chats">Chats</TabsTrigger>
              <TabsTrigger value="emails">Emails</TabsTrigger>
            </TabsList>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search communications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="meeting">Meetings</SelectItem>
                    <SelectItem value="chat">Chats</SelectItem>
                    <SelectItem value="email">Emails</SelectItem>
                    <SelectItem value="call">Calls</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {filteredCommunications.map((comm) => {
                    const Icon = getTypeIcon(comm.type);
                    return (
                      <Card key={comm.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <Icon className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{comm.title}</h3>
                                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(comm.date)}
                                  <span className="mx-2">•</span>
                                  <Clock className="w-3 h-3" />
                                  {comm.duration}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Badge className={getSentimentBadge(comm.sentiment)}>
                                {comm.sentiment}
                              </Badge>
                              <Badge variant="outline">
                                {getTypeLabel(comm.type)}
                              </Badge>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {comm.summary}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                              {comm.tags.map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            {comm.followUp && (
                              <Button variant="outline" size="sm">
                                Follow Up Required
                              </Button>
                            )}
                          </div>

                          <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                            <Users className="w-4 h-4 inline mr-1" />
                            {comm.participants.join(", ")}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}

                  {filteredCommunications.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No communications found matching your criteria</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
};

export default Communications;
