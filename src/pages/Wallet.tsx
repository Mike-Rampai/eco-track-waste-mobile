
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  WalletIcon, 
  ArrowUpIcon, 
  ArrowDownIcon, 
  PlusIcon, 
  MinusIcon,
  ShoppingBagIcon,
  RecycleIcon,
  Calendar
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import WalletDepositForm from '@/components/WalletDepositForm';
import WalletWithdrawForm from '@/components/WalletWithdrawForm';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

const Wallet = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [balance, setBalance] = useState(0); // Current balance in ZAR
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'sale': return <ShoppingBagIcon className="h-4 w-4 text-green-600" />;
      case 'purchase': return <ShoppingBagIcon className="h-4 w-4 text-red-600" />;
      case 'recycling': return <RecycleIcon className="h-4 w-4 text-blue-600" />;
      case 'withdrawal': return <ArrowUpIcon className="h-4 w-4 text-orange-600" />;
      case 'deposit': return <ArrowDownIcon className="h-4 w-4 text-green-600" />;
      default: return <WalletIcon className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (amount: number) => {
    return amount > 0 ? 'text-green-600' : 'text-red-600';
  };

  const handleDeposit = (amount: number, method: string) => {
    const newTransaction = {
      id: `${transactions.length + 1}`,
      type: 'deposit',
      amount: amount,
      description: `Deposited via ${method}`,
      date: new Date(),
      status: 'completed'
    };
    setTransactions([newTransaction, ...transactions]);
    setBalance(balance + amount);
    setIsDepositOpen(false);
    toast({
      title: "Deposit successful",
      description: `R${amount} has been added to your wallet.`,
    });
  };

  const handleWithdraw = (amount: number, method: string, details: string) => {
    if (amount > balance) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough balance for this withdrawal.",
        variant: "destructive",
      });
      return;
    }
    
    const newTransaction = {
      id: `${transactions.length + 1}`,
      type: 'withdrawal',
      amount: -amount,
      description: `Withdrew to ${method} - ${details}`,
      date: new Date(),
      status: 'completed'
    };
    setTransactions([newTransaction, ...transactions]);
    setBalance(balance - amount);
    setIsWithdrawOpen(false);
    toast({
      title: "Withdrawal successful",
      description: `R${amount} has been withdrawn from your wallet.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flutter-text-gradient">My Wallet</h1>
          <p className="text-muted-foreground mt-2">Manage your funds and track transactions</p>
        </div>
      </div>

      {/* Balance Card */}
      <Card className="flutter-card mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WalletIcon className="h-5 w-5" />
            Current Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-primary mb-4">R{balance.toFixed(2)}</div>
          <div className="flex gap-4">
            <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
              <DialogTrigger asChild>
                <Button className="flutter-button">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Funds
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Funds to Wallet</DialogTitle>
                  <DialogDescription>
                    Choose your preferred payment method to add funds to your wallet.
                  </DialogDescription>
                </DialogHeader>
                <WalletDepositForm onSubmit={handleDeposit} onCancel={() => setIsDepositOpen(false)} />
              </DialogContent>
            </Dialog>

            <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flutter-button">
                  <MinusIcon className="h-4 w-4 mr-2" />
                  Withdraw
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Withdraw Funds</DialogTitle>
                  <DialogDescription>
                    Withdraw funds from your wallet to your preferred account.
                  </DialogDescription>
                </DialogHeader>
                <WalletWithdrawForm 
                  maxAmount={balance}
                  onSubmit={handleWithdraw} 
                  onCancel={() => setIsWithdrawOpen(false)} 
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Transactions */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <Card className="flutter-card">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(transaction.date, { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${getTransactionColor(transaction.amount)}`}>
                        {transaction.amount > 0 ? '+' : ''}R{Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sales" className="space-y-4">
          <Card className="flutter-card">
            <CardHeader>
              <CardTitle>Sales & Recycling Income</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.filter(t => t.type === 'sale' || t.type === 'recycling').map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(transaction.date, { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">+R{transaction.amount.toFixed(2)}</p>
                      <Badge variant="outline" className="text-xs">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="purchases" className="space-y-4">
          <Card className="flutter-card">
            <CardHeader>
              <CardTitle>Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.filter(t => t.type === 'purchase').map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(transaction.date, { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">-R{Math.abs(transaction.amount).toFixed(2)}</p>
                      <Badge variant="outline" className="text-xs">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transfers" className="space-y-4">
          <Card className="flutter-card">
            <CardHeader>
              <CardTitle>Deposits & Withdrawals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.filter(t => t.type === 'deposit' || t.type === 'withdrawal').map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(transaction.date, { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${getTransactionColor(transaction.amount)}`}>
                        {transaction.amount > 0 ? '+' : ''}R{Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Wallet;
