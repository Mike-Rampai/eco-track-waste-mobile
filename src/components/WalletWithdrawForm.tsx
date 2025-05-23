
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BanknoteIcon, SmartphoneIcon } from 'lucide-react';

const formSchema = z.object({
  amount: z.coerce.number().min(50, { message: 'Minimum withdrawal amount is R50.' }),
  method: z.string({ required_error: 'Please select a withdrawal method.' }),
  accountDetails: z.string().min(5, { message: 'Please provide account details.' }),
});

type FormValues = z.infer<typeof formSchema>;

interface WalletWithdrawFormProps {
  maxAmount: number;
  onSubmit: (amount: number, method: string, details: string) => void;
  onCancel: () => void;
}

const WalletWithdrawForm = ({ maxAmount, onSubmit, onCancel }: WalletWithdrawFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema.refine((data) => data.amount <= maxAmount, {
      message: `Amount cannot exceed your balance of R${maxAmount.toFixed(2)}`,
      path: ['amount'],
    })),
    defaultValues: {
      amount: 0,
      method: '',
      accountDetails: '',
    },
  });

  const watchMethod = form.watch('method');

  const handleFormSubmit = (values: FormValues) => {
    onSubmit(values.amount, values.method, values.accountDetails);
  };

  const getPlaceholderText = (method: string) => {
    switch (method) {
      case 'bank': return 'e.g., FNB - Account Number: 123456789';
      case 'ewallet': return 'e.g., PayPal email or phone number';
      default: return 'Enter account details';
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 py-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Available Balance:</strong> R{maxAmount.toFixed(2)}
          </p>
        </div>

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount to Withdraw (ZAR)</FormLabel>
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
              <FormLabel>Withdrawal Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="flutter-input">
                    <SelectValue placeholder="Select withdrawal method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="bank">
                    <div className="flex items-center gap-2">
                      <BanknoteIcon className="h-4 w-4" />
                      Bank Account
                    </div>
                  </SelectItem>
                  <SelectItem value="ewallet">
                    <div className="flex items-center gap-2">
                      <SmartphoneIcon className="h-4 w-4" />
                      E-Wallet
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchMethod && (
          <FormField
            control={form.control}
            name="accountDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {watchMethod === 'bank' ? 'Bank Account Details' : 'E-Wallet Details'}
                </FormLabel>
                <FormControl>
                  <Input 
                    className="flutter-input" 
                    placeholder={getPlaceholderText(watchMethod)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Processing Time:</strong> Bank withdrawals take 1-3 business days. 
            E-wallet withdrawals are processed within 24 hours.
          </p>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="flutter-button">
            Withdraw Funds
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default WalletWithdrawForm;
