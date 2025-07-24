
import React, { useState } from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, MessageSquare, Users, Eye, Heart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const AdminForums = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: forumPosts, isLoading } = useQuery({
    queryKey: ['admin-forum-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          *,
          forum_categories!inner(name, color),
          profiles!inner(full_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: categories } = useQuery({
    queryKey: ['forum-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const filteredPosts = forumPosts?.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const stats = [
    {
      title: 'Total Posts',
      value: forumPosts?.length || 0,
      icon: MessageSquare,
      color: 'text-blue-600'
    },
    {
      title: 'Categories',
      value: categories?.length || 0,
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Total Views',
      value: forumPosts?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0,
      icon: Eye,
      color: 'text-purple-600'
    },
    {
      title: 'Total Likes',
      value: forumPosts?.reduce((sum, post) => sum + (post.like_count || 0), 0) || 0,
      icon: Heart,
      color: 'text-red-600'
    }
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Forum Management</h1>
            <p className="text-gray-600">Manage forum posts and categories</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="posts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="posts">Forum Posts</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Forum Posts</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading forum posts...</p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Author</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Views</TableHead>
                          <TableHead>Likes</TableHead>
                          <TableHead>Replies</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPosts.map((post) => (
                          <TableRow key={post.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{post.title}</div>
                                <div className="text-sm text-gray-500">
                                  {new Date(post.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{post.profiles?.full_name || 'Unknown'}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                style={{ 
                                  borderColor: post.forum_categories?.color || '#3b82f6',
                                  color: post.forum_categories?.color || '#3b82f6'
                                }}
                              >
                                {post.forum_categories?.name || 'General'}
                              </Badge>
                            </TableCell>
                            <TableCell>{post.view_count || 0}</TableCell>
                            <TableCell>{post.like_count || 0}</TableCell>
                            <TableCell>{post.reply_count || 0}</TableCell>
                            <TableCell>
                              <Badge variant={post.is_locked ? 'destructive' : 'default'}>
                                {post.is_locked ? 'Locked' : 'Active'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                                <Button variant="outline" size="sm">
                                  {post.is_locked ? 'Unlock' : 'Lock'}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Forum Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Posts</TableHead>
                        <TableHead>Members</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories?.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: category.color }}
                              />
                              <span className="font-medium">{category.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{category.description}</TableCell>
                          <TableCell>{category.post_count || 0}</TableCell>
                          <TableCell>{category.member_count || 0}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              <Button variant="outline" size="sm">
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moderation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Moderation Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Items to Moderate</h3>
                  <p className="text-gray-600">All forum content is up to date.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminForums;
