
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, RecycleIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in.",
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) return;

    // Basic password strength validation
    if (password.length < 8) {
      toast({
        title: "Password too weak",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account Created!",
          description: "Please check your email to confirm your account.",
        });
        setEmail("");
        setPassword("");
        setFullName("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-6 px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-primary/10">
              <RecycleIcon className="h-12 w-12 text-primary" />
            </div>
            <span className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">E-Cycle</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight">
            Join the Future of <span className="text-primary">Sustainable E-Waste</span> Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Transform electronic waste into opportunity. Buy, sell, and recycle responsibly with our platform.
          </p>
          <div className="space-y-3 pt-4">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <div>
                <p className="font-semibold">Track Your Impact</p>
                <p className="text-sm text-muted-foreground">Monitor your recycling contributions in real-time</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <div>
                <p className="font-semibold">Marketplace Access</p>
                <p className="text-sm text-muted-foreground">Buy and sell recycled electronics safely</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
              <div>
                <p className="font-semibold">Earn Rewards</p>
                <p className="text-sm text-muted-foreground">Get incentivized for responsible recycling</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Forms */}
        <Card className="w-full shadow-2xl border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center lg:text-left pb-8">
            <div className="flex lg:hidden items-center justify-center gap-2 mb-4">
              <RecycleIcon className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">E-Cycle</span>
            </div>
            <CardTitle className="text-3xl">Welcome Back</CardTitle>
            <CardDescription className="text-base">
              Sign in to continue your sustainability journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
                <TabsTrigger value="login" className="text-base">Login</TabsTrigger>
                <TabsTrigger value="signup" className="text-base">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Password</label>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="h-12"
                      />
                    </div>
                    <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                      Sign In
                    </Button>
                    
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                          Or
                        </span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full h-12 text-sm"
                      onClick={() => navigate('/reset-password')}
                      disabled={loading}
                    >
                      Forgot your password?
                    </Button>
                  </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <Input
                      type="password"
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12"
                    />
                    <p className="text-xs text-muted-foreground">
                      Must be at least 8 characters long
                    </p>
                  </div>
                  <Button type="submit" className="w-full h-12 text-base" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    Create Account
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground pt-4">
                    By signing up, you agree to our Terms of Service and Privacy Policy
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
