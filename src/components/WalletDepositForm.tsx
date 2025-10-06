
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCardIcon, SmartphoneIcon, BanknoteIcon, WalletIcon } from 'lucide-react';

const formSchema = z.object({
  amount: z.coerce.number().min(10, { message: 'Minimum deposit amount is R10.' }).max(5000, { message: 'Maximum deposit amount is R5000.' }),
  method: z.string({ required_error: 'Please select a payment method.' }),
});

type FormValues = z.infer<typeof formSchema>;

interface WalletDepositFormProps {
  onSubmit: (amount: number, method: string) => void;
  onCancel: () => void;
}

const WalletDepositForm = ({ onSubmit, onCancel }: WalletDepositFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      method: '',
    },
  });

  const handleFormSubmit = (values: FormValues) => {
    onSubmit(values.amount, values.method);
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCardIcon className="h-4 w-4" />;
      case 'paypal': return <WalletIcon className="h-4 w-4" />;
      case 'googlepay': return <SmartphoneIcon className="h-4 w-4" />;
      case 'applepay': return <SmartphoneIcon className="h-4 w-4" />;
      case 'bank': return <BanknoteIcon className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount to Deposit (ZAR)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  className="flutter-input" 
                  placeholder="0.00" 
                  {...field}
                  onChange={e => field.onChange(e.target.valueAsNumber || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="flutter-input">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="card">
                    <div className="flex items-center gap-2">
                      <CreditCardIcon className="h-4 w-4" />
                      Credit/Debit Card
                    </div>
                  </SelectItem>
                  <SelectItem value="paypal">
                    <div className="flex items-center gap-2">
                      <WalletIcon className="h-4 w-4" />
                      PayPal
                    </div>
                  </SelectItem>
                  <SelectItem value="googlepay">
                    <div className="flex items-center gap-2">
                      <SmartphoneIcon className="h-4 w-4" />
                      Google Pay
                    </div>
                  </SelectItem>
                  <SelectItem value="applepay">
                    <div className="flex items-center gap-2">
                      <SmartphoneIcon className="h-4 w-4" />
                      Apple Pay
                    </div>
                  </SelectItem>
                  <SelectItem value="bank">
                    <div className="flex items-center gap-2">
                      <BanknoteIcon className="h-4 w-4" />
                      Bank Transfer
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> Deposits are processed instantly for most payment methods. 
            Bank transfers may take 1-3 business days to reflect in your wallet.
          </p>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="flutter-button">
            Add Funds
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default WalletDepositForm;
